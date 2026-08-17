import { AdvancedImage } from "@cloudinary/react";
import { useCreate, useDelete, useList, useShow } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { useParams } from "react-router";

import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { ShowButton } from "@/components/refine-ui/buttons/show";
import {
  ShowView,
  ShowViewHeader,
} from "@/components/refine-ui/views/show-view";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { bannerPhoto } from "@/lib/cloudinary";
import { ClassDetails, User } from "@/types";

type ClassUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string | null;
};

const ClassesShow = () => {
  const { id } = useParams();
  const classId = id ?? "";
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { query } = useShow<ClassDetails>({
    resource: "classes",
    id: classId,
  });
  const { mutateAsync: createEnrollment } = useCreate();
  const { mutateAsync: removeEnrollment } = useDelete();
  const { query: studentsQuery } = useList<User>({
    resource: "users",
    filters: [{ field: "role", operator: "eq", value: "student" }],
    pagination: { pageSize: 100 },
  });
  const { query: enrolledQuery } = useList<ClassUser>({
    resource: `classes/${classId}/users`,
    pagination: { pageSize: 100 },
    filters: [{ field: "role", operator: "eq", value: "student" }],
    queryOptions: { enabled: Boolean(classId) },
  });

  const classDetails = query.data?.data;
  const students = studentsQuery.data?.data ?? [];
  const enrolledStudents = enrolledQuery.data?.data ?? [];

  const studentColumns = useMemo<ColumnDef<ClassUser>[]>(
    () => [
      {
        id: "name",
        accessorKey: "name",
        size: 240,
        header: () => <p className="column-title">Student</p>,
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Avatar className="size-7">
              {row.original.image && (
                <AvatarImage src={row.original.image} alt={row.original.name} />
              )}
              <AvatarFallback>{getInitials(row.original.name)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col truncate">
              <span className="truncate">{row.original.name}</span>
              <span className="text-xs text-muted-foreground truncate">
                {row.original.email}
              </span>
            </div>
          </div>
        ),
      },
      {
        id: "details",
        size: 180,
        header: () => <p className="column-title">Actions</p>,
        cell: ({ row }) => (
          <div className="flex gap-2">
            <ShowButton
              resource="users"
              recordItemId={row.original.id}
              variant="outline"
              size="sm"
            >
              View
            </ShowButton>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleRemoveEnrollment(row.original.id)}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Removing..." : "Remove"}
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  const studentsTable = useTable<ClassUser>({
    columns: studentColumns,
    refineCoreProps: {
      resource: `classes/${classId}/users`,
      pagination: {
        pageSize: 10,
        mode: "server",
      },
      filters: {
        permanent: [
          {
            field: "role",
            operator: "eq",
            value: "student",
          },
        ],
      },
    },
  });

  const handleEnrollStudent = async () => {
    if (!classId || !selectedStudentId) return;

    setIsSubmitting(true);
    try {
      await createEnrollment({
        resource: "enrollments",
        values: { classId: Number(classId), studentId: selectedStudentId },
      });
      setSelectedStudentId("");
      await enrolledQuery.refetch();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveEnrollment = async (studentId: string) => {
    if (!classId) return;

    setIsSubmitting(true);
    try {
      await removeEnrollment({
        resource: "enrollments",
        id: `${classId}/${studentId}`,
      });
      await enrolledQuery.refetch();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (query.isLoading || query.isError || !classDetails) {
    return (
      <ShowView className="class-view class-show">
        <ShowViewHeader resource="classes" title="Class Details" />
        <p className="state-message">
          {query.isLoading
            ? "Loading class details..."
            : query.isError
            ? "Failed to load class details."
            : "Class details not found."}
        </p>
      </ShowView>
    );
  }

  const teacherName = classDetails.teacher?.name ?? "Unknown";
  const teacherInitials = getInitials(classDetails.teacher?.name ?? "Unknown");

  const placeholderUrl = `https://placehold.co/600x400?text=${encodeURIComponent(
    teacherInitials || "NA"
  )}`;

  const status = classDetails.status ?? "unknown";
  const capacityWarning = classDetails.capacity && enrolledStudents.length >= classDetails.capacity;

  return (
    <ShowView className="class-view class-show space-y-6">
      <ShowViewHeader resource="classes" title="Class Details" />

      <div className="banner">
        {classDetails.bannerUrl ? (
          classDetails.bannerUrl.includes("res.cloudinary.com") &&
          classDetails.bannerCldPubId ? (
            <AdvancedImage
              cldImg={bannerPhoto(
                classDetails.bannerCldPubId ?? "",
                classDetails.name
              )}
              alt="Class Banner"
            />
          ) : (
            <img
              src={classDetails.bannerUrl}
              alt={classDetails.name}
              loading="lazy"
            />
          )
        ) : (
          <div className="placeholder" />
        )}
      </div>

      <Card className="details-card">
        {/* Class Details */}
        <div>
          <div className="details-header">
            <div>
              <h1>{classDetails.name}</h1>
              <p>{classDetails.description}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{classDetails.capacity} spots</Badge>
              <Badge
                variant={status === "active" ? "default" : "secondary"}
                data-status={status}
              >
                {status.toUpperCase()}
              </Badge>
              <Badge variant={capacityWarning ? "destructive" : "secondary"}>
                {enrolledStudents.length}/{classDetails.capacity} enrolled
              </Badge>
            </div>
          </div>

          <div className="details-grid">
            <div className="instructor">
              <p>👨‍🏫 Instructor</p>
              <div>
                <img
                  src={classDetails.teacher?.image ?? placeholderUrl}
                  alt={teacherName}
                />

                <div>
                  <p>{teacherName}</p>
                  <p>{classDetails?.teacher?.email}</p>
                </div>
              </div>
            </div>

            <div className="department">
              <p>🏛️ Department</p>

              <div>
                <p>{classDetails?.department?.name}</p>
                <p>{classDetails?.department?.description}</p>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Subject Card */}
        <div className="subject">
          <p>📚 Subject</p>

          <div>
            <Badge variant="outline">
              Code: <span>{classDetails?.subject?.code}</span>
            </Badge>
            <p>{classDetails?.subject?.name}</p>
            <p>{classDetails?.subject?.description}</p>
          </div>
        </div>

        <Separator />

        {/* Join Class Section */}
        <div className="join">
          <h2>🎓 Class Access</h2>

          <ol>
            <li>Share the invite code below with students.</li>
            <li>Use the enrollment panel to add students manually.</li>
            <li>Monitor capacity warnings when the class reaches its limit.</li>
          </ol>
          <div className="mt-3 rounded-md border border-border bg-muted/20 p-3">
            <p className="text-sm font-medium">Invite code</p>
            <p className="text-lg font-semibold tracking-[0.2em]">{classDetails.inviteCode ?? "Unavailable"}</p>
          </div>
        </div>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Enroll Students</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
              <SelectTrigger className="w-full md:w-80">
                <SelectValue placeholder="Choose a student" />
              </SelectTrigger>
              <SelectContent>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.name} ({student.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleEnrollStudent} disabled={!selectedStudentId || isSubmitting}>
              {isSubmitting ? "Working..." : "Enroll Student"}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            {students.length === 0
              ? "No student accounts are available yet."
              : "Select a student to add them to this class."}
          </p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Enrolled Students</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable table={studentsTable} />
        </CardContent>
      </Card>
    </ShowView>
  );
};

const getInitials = (name = "") => {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "";
  return `${parts[0][0] ?? ""}${
    parts[parts.length - 1][0] ?? ""
  }`.toUpperCase();
};

export default ClassesShow;


// 7:27:27