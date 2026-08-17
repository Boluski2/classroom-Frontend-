import { useMemo } from "react";
import { useGetIdentity, useLink, useList, useLogout } from "@refinedev/core";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { ClassDetails, User } from "@/types";

const TeacherDashboard = () => {
  const Link = useLink();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const { data: identity } = useGetIdentity<User>();
  const { query: classesQuery } = useList<ClassDetails>({
    resource: "classes",
    pagination: { mode: "off" },
  });
  const { query: codesQuery } = useList({
    resource: "registration-codes",
    pagination: { mode: "off" },
  });

  const classes = classesQuery.data?.data ?? [];
  const codes = codesQuery.data?.data ?? [];

  const ownClasses = useMemo(() => {
    return classes.filter((classItem) => classItem.teacher?.id === identity?.id);
  }, [classes, identity?.id]);

  if (identity?.role !== "teacher") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Access Restricted</CardTitle>
        </CardHeader>
        <CardContent>
          This dashboard is only available for teachers. Please sign in with a teacher account.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="page-title">Teacher Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your classes, generate student registration codes, and track enrollments.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => logout()}>
          {isLoggingOut ? "Signing out..." : "Sign Out"}
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="rounded-lg border border-border bg-muted/20 p-4 hover:border-primary/40 hover:bg-muted/40 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">My classes</p>
              <div className="mt-2 text-2xl font-semibold">{ownClasses.length}</div>
            </div>
          </div>
        </Card>

        <Card className="rounded-lg border border-border bg-muted/20 p-4 hover:border-primary/40 hover:bg-muted/40 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Registration codes</p>
              <div className="mt-2 text-2xl font-semibold">{codes.length}</div>
            </div>
          </div>
        </Card>

        <Card className="rounded-lg border border-border bg-muted/20 p-4 hover:border-primary/40 hover:bg-muted/40 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Total classes</p>
              <div className="mt-2 text-2xl font-semibold">{classes.length}</div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Your classes</CardTitle>
          </CardHeader>
          <CardContent>
            {ownClasses.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                You currently have no classes assigned. Use the class management page to add a new class.
              </p>
            ) : (
              <div className="grid gap-3">
                {ownClasses.slice(0, 5).map((classItem) => (
                  <div
                    key={classItem.id}
                    className="rounded-md border border-border p-3"
                  >
                    <p className="text-sm font-semibold">{classItem.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {classItem.subject?.name ?? "No subject"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild>
              <Link to="/registration-codes" className="w-full justify-center">
                Manage Registration Codes
              </Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link to="/classes" className="w-full justify-center">
                Browse all classes
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Separator />
    </div>
  );
};

export default TeacherDashboard;
