import { useMemo } from "react";
import { useGetIdentity, useList, useLink, useLogout } from "@refinedev/core";
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BookOpen, ClipboardCheck, Layers, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { ClassDetails, Subject, User } from "@/types";

const subjectColors = ["#0ea5e9", "#f97316", "#a855f7", "#22c55e"];

const StudentDashboard = () => {
  const Link = useLink();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const { data: identity } = useGetIdentity<User>();

  const { query: subjectsQuery } = useList<Subject>({
    resource: "subjects",
    pagination: { mode: "off" },
  });
  const { query: classesQuery } = useList<ClassDetails>({
    resource: "classes",
    pagination: { mode: "off" },
  });

  const subjects = subjectsQuery.data?.data ?? [];
  const classes = classesQuery.data?.data ?? [];

  const classesBySubject = useMemo(() => {
    const counts = classes.reduce<Record<string, number>>((acc, classItem) => {
      const subjectName = classItem.subject?.name ?? "Unassigned";
      acc[subjectName] = (acc[subjectName] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts).map(([subjectName, totalClasses]) => ({
      subjectName,
      totalClasses,
    }));
  }, [classes]);

  const topSubjects = useMemo(() => {
    return [...classesBySubject]
      .sort((a, b) => b.totalClasses - a.totalClasses)
      .slice(0, 5)
      .map((item, index) => ({
        ...item,
        id: index,
      }));
  }, [classesBySubject]);

  if (identity?.role !== "student") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Access Restricted</CardTitle>
        </CardHeader>
        <CardContent>
          This dashboard is designed for students. Please use your assigned portal.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="page-title">Student Dashboard</h1>
          <p className="text-muted-foreground">
            Track your classes, subjects, and enrollment options from one place.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => logout()}>
          {isLoggingOut ? "Signing out..." : "Sign Out"}
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-lg border border-border bg-muted/20 p-4 hover:border-primary/40 hover:bg-muted/40 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Available Classes</p>
              <div className="mt-2 text-2xl font-semibold">{classes.length}</div>
            </div>
            <Layers className="h-5 w-5 text-rose-600" />
          </div>
        </Card>
        <Card className="rounded-lg border border-border bg-muted/20 p-4 hover:border-primary/40 hover:bg-muted/40 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Subjects</p>
              <div className="mt-2 text-2xl font-semibold">{subjects.length}</div>
            </div>
            <BookOpen className="h-5 w-5 text-sky-600" />
          </div>
        </Card>
        <Card className="rounded-lg border border-border bg-muted/20 p-4 hover:border-primary/40 hover:bg-muted/40 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Your Role</p>
              <div className="mt-2 text-2xl font-semibold">{identity?.role}</div>
            </div>
            <Users className="h-5 w-5 text-cyan-600" />
          </div>
        </Card>
        <Card className="rounded-lg border border-border bg-muted/20 p-4 hover:border-primary/40 hover:bg-muted/40 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Enrollment</p>
              <div className="mt-2 text-2xl font-semibold">Quick</div>
            </div>
            <ClipboardCheck className="h-5 w-5 text-emerald-600" />
          </div>
        </Card>
      </div>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle>Recommended Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {topSubjects.length === 0 ? (
              <p className="text-sm text-muted-foreground">No course recommendations are available yet.</p>
            ) : (
              topSubjects.map((subject) => (
                <div
                  key={subject.id}
                  className="rounded-md border border-border p-4"
                >
                  <p className="text-sm font-semibold">{subject.subjectName}</p>
                  <p className="text-xs text-muted-foreground">
                    {subject.totalClasses} classes available
                  </p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Student Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild>
              <Link to="/enrollments/join" className="w-full justify-center">
                Join a class
              </Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link to="/classes" className="w-full justify-center">
                Browse all classes
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Need help?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              If you need admin support, ask your administrator or visit the admin portal.
            </p>
            <Button variant="outline" asChild>
              <Link to="/admin" className="w-full justify-center">
                Open Admin Dashboard
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Separator />
    </div>
  );
};

export default StudentDashboard;
