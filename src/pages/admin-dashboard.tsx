import { useMemo } from "react";
import { useGetIdentity, useList } from "@refinedev/core";
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, LineChart, Line } from "recharts";
import { AlertCircle, BookOpen, Building2, GraduationCap, TrendingUp, Users, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Department, Subject, User, ClassDetails } from "@/types";
import { useLink } from "@refinedev/core";
import { StatusState } from "@/components/ui/status-state";

const AdminDashboard = () => {
  const Link = useLink();
  const { data: identity } = useGetIdentity<User>();

  const isAdmin = identity?.role === "admin";

  const { query: usersQuery } = useList<User>({
    resource: "users",
    pagination: { mode: "off" },
    queryOptions: { enabled: isAdmin },
  });
  const { query: subjectsQuery } = useList<Subject>({
    resource: "subjects",
    pagination: { mode: "off" },
    queryOptions: { enabled: isAdmin },
  });
  const { query: departmentsQuery } = useList<Department>({
    resource: "departments",
    pagination: { mode: "off" },
    queryOptions: { enabled: isAdmin },
  });
  const { query: classesQuery } = useList<ClassDetails>({
    resource: "classes",
    pagination: { mode: "off" },
    queryOptions: { enabled: isAdmin },
  });

  const users = usersQuery.data?.data ?? [];
  const subjects = subjectsQuery.data?.data ?? [];
  const departments = departmentsQuery.data?.data ?? [];
  const classes = classesQuery.data?.data ?? [];

  const stats = useMemo(() => {
    const totalTeachers = users.filter((u) => u.role === "teacher").length;
    const totalStudents = users.filter((u) => u.role === "student").length;
    const totalClasses = classes.length;
    const activeClasses = classes.filter((c) => c.status === "active").length;

    return {
      totalTeachers,
      totalStudents,
      totalClasses,
      activeClasses,
      totalDepartments: departments.length,
      totalSubjects: subjects.length,
      studentsPerTeacher: totalTeachers > 0 ? Math.round(totalStudents / totalTeachers) : 0,
    };
  }, [users, classes, departments, subjects]);

  const teacherDistribution = useMemo(() => {
    const counts = users
      .filter((u) => u.role === "teacher")
      .map((u) => ({
        name: u.name,
        email: u.email,
        studentCount: users.filter((s) => s.role === "student").length,
      }))
      .slice(0, 5);
    return counts;
  }, [users]);

  if (!isAdmin) {
    return (
      <Card className="mt-10 mx-auto w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-red-600">Access Restricted</CardTitle>
        </CardHeader>
        <CardContent>
          You are not authorized to view this dashboard. Please sign in with an admin account.
        </CardContent>
      </Card>
    );
  }

  const queries = [usersQuery, subjectsQuery, departmentsQuery, classesQuery];
  if (queries.some((query) => query.isError)) {
    return (
      <StatusState
        kind="error"
        title="Unable to load administration data"
        description="Some dashboard data could not be loaded. Try again in a moment."
      />
    );
  }

  if (queries.some((query) => query.isLoading)) {
    return (
      <StatusState
        kind="loading"
        title="Loading administration data"
        description="Collecting current institution metrics."
      />
    );
  }

  const KPICard = ({ label, value, icon: Icon, accent, description }: any) => (
    <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground font-medium mb-1">{label}</p>
            <h3 className="text-4xl font-bold tracking-tight">{value}</h3>
            {description && <p className="text-xs text-muted-foreground mt-2">{description}</p>}
          </div>
          <div className={`p-3 rounded-lg ${accent} opacity-20`}>
            <Icon className={`h-6 w-6 ${accent.replace("bg-", "text-")}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b pb-6">
        <h1 className="text-4xl font-bold tracking-tight">Administration Dashboard</h1>
        <p className="text-lg text-muted-foreground mt-2">Overview of your academic institution</p>
      </div>

      {/* Key Performance Indicators */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-slate-600" />
          Key Metrics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            label="Total Teachers"
            value={stats.totalTeachers}
            icon={GraduationCap}
            accent="bg-emerald-500"
            description="Active teaching staff"
          />
          <KPICard
            label="Total Students"
            value={stats.totalStudents}
            icon={Users}
            accent="bg-blue-500"
            description={`${stats.studentsPerTeacher} avg per teacher`}
          />
          <KPICard
            label="Active Classes"
            value={stats.activeClasses}
            icon={BookOpen}
            accent="bg-orange-500"
            description={`of ${stats.totalClasses} total`}
          />
          <KPICard
            label="Departments"
            value={stats.totalDepartments}
            icon={Building2}
            accent="bg-purple-500"
            description={`${stats.totalSubjects} subjects`}
          />
        </div>
      </div>

      {/* Management Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Teachers Management */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-emerald-600" />
                Teachers Management
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <p className="text-sm text-muted-foreground">
              Manage your teaching staff, monitor performance, and oversee class assignments.
            </p>
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center text-sm">
                <span>Active Teachers:</span>
                <Badge variant="outline">{stats.totalTeachers}</Badge>
              </div>
            </div>
            <Link to="/admin/teachers">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                View Teachers
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Students Management */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Students Management
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <p className="text-sm text-muted-foreground">
              Monitor student enrollment, academic progress, and attendance patterns.
            </p>
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center text-sm">
                <span>Enrolled Students:</span>
                <Badge variant="outline">{stats.totalStudents}</Badge>
              </div>
            </div>
            <Link to="/admin/students">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                View Students
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Classes and Academic Structure */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-orange-600" />
              Classes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <p className="text-sm text-muted-foreground">
              Manage all classes, view enrollment, and monitor activity.
            </p>
            <Link to="/classes">
              <Button variant="outline" className="w-full">
                Manage Classes
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-purple-600" />
              Departments
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <p className="text-sm text-muted-foreground">
              Create and manage departments, assign teachers and subjects.
            </p>
            <Link to="/departments">
              <Button variant="outline" className="w-full">
                Manage Departments
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              Reports
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <p className="text-sm text-muted-foreground">
              Review teacher-submitted reports about students and classes.
            </p>
            <Link to="/admin/reports">
              <Button variant="outline" className="w-full">
                View Reports
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
