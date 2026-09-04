import { useList, useGetIdentity, useLink } from "@refinedev/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Plus, Edit2, Trash2, Copy } from "lucide-react";
import type { ClassDetails, User } from "@/types";
import { useMemo, useState } from "react";

export default function TeacherClassesPage() {
  const Link = useLink();
  const { data: identity } = useGetIdentity<User>();
  const [copiedCode, setCopiedCode] = useState<number | null>(null);

  const { query: classesQuery } = useList<ClassDetails>({
    resource: "classes",
    pagination: { mode: "off" },
  });

  const ownClasses = useMemo(() => {
    return (classesQuery.data?.data ?? []).filter((c) => c.teacher?.id === identity?.id);
  }, [classesQuery.data?.data, identity?.id]);

  if (identity?.role !== "teacher") {
    return (
      <Card className="mt-10 mx-auto w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-red-600">Access Restricted</CardTitle>
        </CardHeader>
        <CardContent>
          You do not have permission to view this page.
        </CardContent>
      </Card>
    );
  }

  const handleCopyCode = (code: string, classId: number) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(classId);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b pb-6">
        <h1 className="text-4xl font-bold tracking-tight flex items-center gap-2">
          <BookOpen className="h-8 w-8 text-indigo-600" />
          My Classes
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Manage your classes, share class codes, and monitor student enrollment
        </p>
      </div>

      {/* Create Class Button */}
      <div className="flex justify-end">
        <Link to="/classes/create">
          <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2">
            <Plus className="h-4 w-4" />
            Create Class
          </Button>
        </Link>
      </div>

      {/* Classes Grid */}
      {ownClasses.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No classes yet</p>
            <p className="text-muted-foreground mb-6">
              Create your first class to start teaching students
            </p>
            <Link to="/classes/create">
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                Create Your First Class
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ownClasses.map((cls) => (
            <Card key={cls.id} className="hover:shadow-lg transition-shadow overflow-hidden">
              {/* Header with Status */}
              <div className={`p-4 border-b ${cls.status === "active" ? "bg-green-50" : "bg-slate-50"}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{cls.name}</h3>
                    <p className="text-sm text-muted-foreground">{cls.subject?.name}</p>
                  </div>
                  <Badge
                    variant={cls.status === "active" ? "default" : "outline"}
                    className={cls.status === "active" ? "bg-green-600" : ""}
                  >
                    {cls.status}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-6 space-y-4">
                {/* Class Code Section */}
                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                  <p className="text-xs text-muted-foreground font-semibold mb-2">CLASS CODE</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 font-mono font-bold text-lg text-indigo-600 bg-white px-3 py-2 rounded border">
                      {cls.inviteCode || "N/A"}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopyCode(cls.inviteCode || "", cls.id)}
                      className="text-xs"
                    >
                      <Copy className="h-3 w-3" />
                      {copiedCode === cls.id ? "✓" : ""}
                    </Button>
                  </div>
                </div>

                {/* Class Info */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Capacity:</span>
                    <span className="font-medium">{cls.capacity || 0} students</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Schedule:</span>
                    <span className="font-medium">{cls.schedules?.length || 0} sessions</span>
                  </div>
                </div>

                {/* Description */}
                {cls.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{cls.description}</p>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-4">
                  <Link to={`/classes/show/${cls.id}`} className="flex-1">
                    <Button size="sm" className="w-full">
                      Open Class
                    </Button>
                  </Link>
                  <Link to={`/classes/edit/${cls.id}`} className="flex-1">
                    <Button size="sm" variant="outline" className="w-full gap-1">
                      <Edit2 className="h-3 w-3" />
                      Edit
                    </Button>
                  </Link>
                </div>

                {/* Share Code Link */}
                <Button variant="outline" size="sm" className="w-full text-xs">
                  📋 Share Code with Students
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
