import { useMemo } from "react";
import { useGetIdentity, useList, useLink, useLogout } from "@refinedev/core";
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BookOpen, Building2, GraduationCap, Layers, ShieldCheck, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Department, Subject, User } from "@/types";

const roleColors = ["#f97316", "#0ea5e9", "#22c55e", "#a855f7"];

const AdminDashboard = () => {
  const Link = useLink();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const { data: identity } = useGetIdentity<User>();

  const { query: usersQuery } = useList<User>({
    resource: "users",
    pagination: { mode: "off" },
  });
  const { query: subjectsQuery } = useList<Subject>({
    resource: "subjects",
    pagination: { mode: "off" },
  });
  const { query: departmentsQuery } = useList<Department>({
    resource: "departments",
    pagination: { mode: "off" },
  });
  const { query: classesQuery } = useList({
    resource: "classes",
    pagination: { mode: "off" },
  });

  const users = usersQuery.data?.data ?? [];
  const subjects = subjectsQuery.data?.data ?? [];
  const departments = departmentsQuery.data?.data ?? [];
  const classes = classesQuery.data?.data ?? [];

  const usersByRole = useMemo(() => {
    const counts = users.reduce<Record<string, number>>((acc, user) => {
      const role = user.role ?? "unknown";
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts).map(([role, total]) => ({ role, total }));
  }, [users]);

  const subjectsByDepartment = useMemo(() => {
    const counts = subjects.reduce<Record<string, number>>((acc, subject) => {
      const departmentName = (subject as { department?: string }).department ?? "Unassigned";
      acc[departmentName] = (acc[departmentName] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts).map(([departmentName, totalSubjects]) => ({
      departmentName,
      totalSubjects,
    }));
  }, [subjects]);

  const newestClasses = useMemo(() => {
    return [...classes]
      .sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTime - aTime;
      })
      .slice(0, 5);
  }, [classes]);

  if (identity?.role !== "admin") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Access Restricted</CardTitle>
        </CardHeader>
        <CardContent>
          You are not authorized to view the admin dashboard.
        </CardContent>
      </Card>
    );
  }

  const kpis = [
    {
      label: "Total Users",
      value: users.length,
      icon: Users,
      accent: "text-blue-600",
    },
    {
      label: "Teachers",
      value: users.filter((user) => user.role === "teacher").length,
      icon: GraduationCap,
      accent: "text-emerald-600",
    },
    {
      label: "Admins",
      value: users.filter((user) => user.role === "admin").length,
      icon: ShieldCheck,
      accent: "text-amber-600",
    },
    {
      label: "Subjects",
      value: subjects.length,
      icon: BookOpen,
      accent: "text-purple-600",
    },
    {
      label: "Departments",
      value: departments.length,
      icon: Building2,
      accent: "text-cyan-600",
    },
    {
      label: "Classes",
      value: classes.length,
      icon: Layers,
      accent: "text-rose-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage the portal, track adoption, and keep the school data in sync.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => logout()}>
          {isLoggingOut ? "Signing out..." : "Sign Out"}
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {kpis.map((kpi) => (
          <Card
            key={kpi.label}
            className="rounded-lg border border-border bg-muted/20 p-4 hover:border-primary/40 hover:bg-muted/40 transition-colors"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-muted-foreground">{kpi.label}</p>
              <kpi.icon className={`h-4 w-4 ${kpi.accent}`} />
            </div>
            <div className="mt-2 text-2xl font-semibold">{kpi.value}</div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Users by Role</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    dataKey="total"
                    nameKey="role"
                    data={usersByRole}
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                  >
                    {usersByRole.map((entry, index) => (
                      <Cell
                        key={`${entry.role}-${index}`}
                        fill={roleColors[index % roleColors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-2">
              {usersByRole.map((entry, index) => (
                <span
                  key={entry.role}
                  className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs font-medium"
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: roleColors[index % roleColors.length] }}
                  />
                  {entry.role} · {entry.total}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Student Portal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Open the student portal to review the classroom experience from a student perspective.
            </p>
            <Button asChild>
              <Link to="/student" className="w-full justify-center">
                Go to Student Dashboard
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle>Latest Classes</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {newestClasses.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent classes found.</p>
          ) : (
            newestClasses.map((item, index) => (
              <Link
                key={item.id}
                to={`/classes/show/${item.id}`}
                className="flex items-center justify-between rounded-md border border-transparent px-3 py-2 transition-colors hover:border-primary/30 hover:bg-muted/40"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-muted-foreground">#{index + 1}</span>
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.subject?.name ?? "No subject"} · {item.teacher?.name ?? "No teacher"}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary">New</Badge>
              </Link>
            ))
          )}
        </CardContent>
      </Card>

      <Separator />
    </div>
  );
};

export default AdminDashboard;
