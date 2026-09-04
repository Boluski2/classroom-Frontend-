import { useMemo } from "react";
import { useGetIdentity, useList, useLink } from "@refinedev/core";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, BookOpen, Users, AlertCircle, Plus, Play } from "lucide-react";
import type { ClassDetails, User } from "@/types";

const TeacherDashboard = () => {
  const Link = useLink();
  const { data: identity } = useGetIdentity<User>();
  const { query: classesQuery } = useList<ClassDetails>({
    resource: "classes",
    pagination: { mode: "off" },
  });

  const classes = classesQuery.data?.data ?? [];

  const ownClasses = useMemo(() => {
    return classes.filter((classItem) => classItem.teacher?.id === identity?.id);
  }, [classes, identity?.id]);

  const classStats = useMemo(() => {
    return {
      totalClasses: ownClasses.length,
      activeClasses: ownClasses.filter((c) => c.status === "active").length,
      totalStudents: ownClasses.reduce((sum, c) => sum + (c.capacity || 0), 0),
      totalSchedules: ownClasses.reduce((sum, c) => sum + (c.schedules?.length || 0), 0),
    };
  }, [ownClasses]);

  if (identity?.role !== "teacher") {
    return (
      <Card className="mt-10 mx-auto w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-red-600">Access Restricted</CardTitle>
        </CardHeader>
        <CardContent>
          This dashboard is only available for teachers. Please sign in with a teacher account.
        </CardContent>
      </Card>
    );
  }

  const StatCard = ({ icon: Icon, label, value, color }: any) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground font-medium">{label}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
          </div>
          <div className={`p-3 rounded-lg ${color} opacity-20`}>
            <Icon className={`h-6 w-6 ${color.replace("bg-", "text-")}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b pb-6">
        <h1 className="text-4xl font-bold tracking-tight">Welcome back, {identity?.name}!</h1>
        <p className="text-lg text-muted-foreground mt-2">Manage your classes and track student progress</p>
      </div>

      {/* Quick Stats */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={BookOpen}
            label="My Classes"
            value={classStats.totalClasses}
            color="bg-indigo-500"
          />
          <StatCard
            icon={Users}
            label="Total Students"
            value={classStats.totalStudents}
            color="bg-blue-500"
          />
          <StatCard
            icon={Clock}
            label="Scheduled Sessions"
            value={classStats.totalSchedules}
            color="bg-green-500"
          />
          <StatCard
            icon={AlertCircle}
            label="Pending Tasks"
            value="0"
            color="bg-orange-500"
          />
        </div>
      </div>

      {/* Today's Schedule & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-2">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-indigo-600" />
                Today's Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {ownClasses.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No classes yet</p>
                  <Link to="/teacher/classes">
                    <Button size="sm">Create Your First Class</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {ownClasses.slice(0, 5).map((cls) => (
                    <div
                      key={cls.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{cls.name}</p>
                        <p className="text-sm text-muted-foreground">{cls.subject?.name || "Subject TBA"}</p>
                      </div>
                      <Badge variant={cls.status === "active" ? "default" : "outline"}>
                        {cls.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="border-b">
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-3">
            <Link to="/teacher/classes">
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 gap-2">
                <Plus className="h-4 w-4" />
                Create Class
              </Button>
            </Link>
            <Link to="/teacher/assignments">
              <Button variant="outline" className="w-full">
                Create Assignment
              </Button>
            </Link>
            <Link to="/teacher/grading">
              <Button variant="outline" className="w-full">
                Grade Submissions
              </Button>
            </Link>
            <Link to="/teacher/attendance">
              <Button variant="outline" className="w-full gap-2">
                <Play className="h-4 w-4" />
                Start Class Session
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* My Classes */}
      {ownClasses.length > 0 && (
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-indigo-600" />
              My Classes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ownClasses.map((cls) => (
                <Card key={cls.id} className="border hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base">{cls.name}</CardTitle>
                        <p className="text-xs text-muted-foreground mt-1">{cls.subject?.name}</p>
                      </div>
                      <Badge variant={cls.status === "active" ? "default" : "outline"} className="text-xs">
                        {cls.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Code:</span>
                        <Badge variant="secondary">{cls.inviteCode || "N/A"}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Capacity:</span>
                        <span>{cls.capacity || 0} students</span>
                      </div>
                    </div>
                    <Link to={`/classes/show/${cls.id}`}>
                      <Button size="sm" variant="outline" className="w-full">
                        View Details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TeacherDashboard;
