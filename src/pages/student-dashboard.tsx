import { useMemo } from "react";
import { useGetIdentity, useList, useLink } from "@refinedev/core";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, FileText, BarChart3, Calendar, Bell, Plus } from "lucide-react";
import type { ClassDetails, Subject, User } from "@/types";

const StudentDashboard = () => {
  const Link = useLink();
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

  // For demo purposes: filter classes where capacity > 0 (enrolled students)
  const myClasses = useMemo(() => {
    return classes.filter((c) => c.capacity && c.capacity > 0).slice(0, 6);
  }, [classes]);

  const stats = useMemo(() => {
    return {
      enrolledClasses: myClasses.length,
      pendingAssignments: 5,
      averageGrade: 85,
      attendance: 92,
    };
  }, [myClasses]);

  if (identity?.role !== "student") {
    return (
      <Card className="mt-10 mx-auto w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-red-600">Access Restricted</CardTitle>
        </CardHeader>
        <CardContent>
          This is a learning portal for students. Please sign in with your student account.
        </CardContent>
      </Card>
    );
  }

  const StatCard = ({ icon: Icon, label, value, unit }: any) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground font-medium">{label}</p>
            <p className="text-3xl font-bold mt-1">
              {value}
              <span className="text-lg text-muted-foreground ml-1">{unit}</span>
            </p>
          </div>
          <div className="p-3 rounded-lg bg-teal-500 opacity-20">
            <Icon className="h-6 w-6 text-teal-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b pb-6">
        <h1 className="text-4xl font-bold tracking-tight">Welcome, {identity?.name}!</h1>
        <p className="text-lg text-muted-foreground mt-2">Your personalized learning portal</p>
      </div>

      {/* Quick Stats */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={BookOpen}
            label="Enrolled Classes"
            value={stats.enrolledClasses}
            unit=""
          />
          <StatCard
            icon={FileText}
            label="Pending Assignments"
            value={stats.pendingAssignments}
            unit=""
          />
          <StatCard
            icon={BarChart3}
            label="Average Grade"
            value={stats.averageGrade}
            unit="%"
          />
          <StatCard
            icon={Calendar}
            label="Attendance"
            value={stats.attendance}
            unit="%"
          />
        </div>
      </div>

      {/* Next Class & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Next Class */}
        <div className="lg:col-span-2">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-teal-600" />
                Next Class
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {myClasses.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No classes yet</p>
                  <Link to="/student/classes">
                    <Button size="sm">Join Your First Class</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="border-l-4 border-teal-500 pl-4 py-2">
                    <p className="text-lg font-semibold">{myClasses[0].name}</p>
                    <p className="text-sm text-muted-foreground">{myClasses[0].subject?.name}</p>
                    <p className="text-sm text-muted-foreground mt-1">Teacher: {myClasses[0].teacher?.name}</p>
                    {myClasses[0].status === "active" && (
                      <Badge className="mt-3 bg-teal-600">Class Starting Soon</Badge>
                    )}
                  </div>
                  <Link to={`/student/classes`}>
                    <Button className="w-full bg-teal-600 hover:bg-teal-700">
                      Open Classes
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="border-b">
            <CardTitle className="text-lg">Quick Links</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-3">
            <Link to="/student/classes">
              <Button className="w-full bg-teal-600 hover:bg-teal-700 gap-2">
                <Plus className="h-4 w-4" />
                Join Class
              </Button>
            </Link>
            <Link to="/student/assignments">
              <Button variant="outline" className="w-full">
                My Assignments
              </Button>
            </Link>
            <Link to="/student/grades">
              <Button variant="outline" className="w-full">
                View Grades
              </Button>
            </Link>
            <Link to="/student/notifications">
              <Button variant="outline" className="w-full gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* My Classes */}
      {myClasses.length > 0 && (
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-teal-600" />
              My Classes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer bg-linear-to-br from-teal-50 to-cyan-50"
                >
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-base">{cls.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{cls.subject?.name}</p>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p className="text-muted-foreground">
                        <strong>Teacher:</strong> {cls.teacher?.name || "TBA"}
                      </p>
                      {cls.status === "active" && (
                        <Badge className="mt-2 bg-teal-600 text-xs">🔴 Active Now</Badge>
                      )}
                    </div>
                    <Link to={`/student/classes`}>
                      <Button size="sm" variant="outline" className="w-full">
                        Open Class
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Learning Resources */}
      <Card className="hover:shadow-lg transition-shadow border-l-4 border-teal-500">
        <CardHeader className="border-b">
          <CardTitle>Learning Tips</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>✓ Check your assignments regularly and submit on time</li>
            <li>✓ Join live classes to interact with your teacher</li>
            <li>✓ Review your grades and feedback to improve</li>
            <li>✓ Ask questions during class sessions</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;
