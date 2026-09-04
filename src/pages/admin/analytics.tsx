import { useGetIdentity } from "@refinedev/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from "recharts";
import { BarChart3 } from "lucide-react";
import type { User } from "@/types";

export default function AdminAnalyticsPage() {
  const { data: identity } = useGetIdentity<User>();

  if (identity?.role !== "admin") {
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

  // Mock analytics data
  const enrollmentTrendData = [
    { month: "Jan", students: 150, teachers: 10, classes: 8 },
    { month: "Feb", students: 180, teachers: 12, classes: 10 },
    { month: "Mar", students: 220, teachers: 14, classes: 12 },
    { month: "Apr", students: 250, teachers: 15, classes: 14 },
    { month: "May", students: 280, teachers: 16, classes: 15 },
    { month: "Jun", students: 310, teachers: 18, classes: 18 },
  ];

  const departmentData = [
    { name: "Computer Science", value: 85, fill: "#3b82f6" },
    { name: "Business", value: 65, fill: "#10b981" },
    { name: "Engineering", value: 45, fill: "#f59e0b" },
    { name: "Science", value: 55, fill: "#8b5cf6" },
    { name: "Arts", value: 30, fill: "#ec4899" },
  ];

  const attendanceData = [
    { week: "Week 1", attendance: 92 },
    { week: "Week 2", attendance: 88 },
    { week: "Week 3", attendance: 90 },
    { week: "Week 4", attendance: 85 },
    { week: "Week 5", attendance: 89 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b pb-6">
        <h1 className="text-4xl font-bold tracking-tight flex items-center gap-2">
          <BarChart3 className="h-8 w-8 text-blue-600" />
          Analytics & Insights
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          View institutional analytics and performance trends
        </p>
      </div>

      {/* Enrollment Trends */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="border-b">
          <CardTitle>Enrollment Trends</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={enrollmentTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="students" stroke="#3b82f6" name="Students" />
              <Line type="monotone" dataKey="teachers" stroke="#10b981" name="Teachers" />
              <Line type="monotone" dataKey="classes" stroke="#f59e0b" name="Classes" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Department Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="border-b">
            <CardTitle>Students by Department</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="border-b">
            <CardTitle>Weekly Attendance Rate</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="attendance" fill="#10b981" name="Attendance %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Key Insights */}
      <Card className="border-l-4 border-blue-500">
        <CardHeader>
          <CardTitle>Key Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="text-2xl">📈</span>
            <div>
              <p className="font-medium">Growth Trend</p>
              <p className="text-sm text-muted-foreground">
                Student enrollment has increased by 107% in the last 6 months
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">👥</span>
            <div>
              <p className="font-medium">Faculty Expansion</p>
              <p className="text-sm text-muted-foreground">
                Teacher count has grown proportionally with student enrollment
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className="font-medium">Attendance Performance</p>
              <p className="text-sm text-muted-foreground">
                Average attendance rate is 88.8% across all classes
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
