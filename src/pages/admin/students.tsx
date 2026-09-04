import { useList, useGetIdentity } from "@refinedev/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Search, Mail, TrendingDown } from "lucide-react";
import type { User } from "@/types";
import { useState, useMemo } from "react";

export default function AdminStudentsPage() {
  const { data: identity } = useGetIdentity<User>();
  const [search, setSearch] = useState("");

  const { query: usersQuery } = useList<User>({
    resource: "users",
    pagination: { mode: "off" },
  });

  const students = useMemo(() => {
    const allStudents = (usersQuery.data?.data ?? []).filter((u) => u.role === "student");
    if (!search) return allStudents;
    return allStudents.filter(
      (s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [usersQuery.data?.data, search]);

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b pb-6">
        <h1 className="text-4xl font-bold tracking-tight flex items-center gap-2">
          <Users className="h-8 w-8 text-blue-600" />
          Students Management
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Monitor student enrollment, performance, and academic status
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button>Filter</Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Students</p>
              <p className="text-3xl font-bold">{students.length}</p>
            </div>
            <Users className="h-12 w-12 text-blue-600 opacity-20" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Requiring Attention</p>
              <p className="text-3xl font-bold">0</p>
            </div>
            <TrendingDown className="h-12 w-12 text-red-600 opacity-20" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active This Week</p>
              <p className="text-3xl font-bold">{Math.floor(students.length * 0.85)}</p>
            </div>
            <Badge>85%</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Students List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">All Students ({students.length})</h2>
        </div>

        {students.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground mb-4">No students found</p>
              <Button>Invite Student</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-4 px-4 font-semibold">Name</th>
                  <th className="text-left py-4 px-4 font-semibold">Email</th>
                  <th className="text-left py-4 px-4 font-semibold">Classes</th>
                  <th className="text-left py-4 px-4 font-semibold">Status</th>
                  <th className="text-left py-4 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="border-b hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        {student.image ? (
                          <img
                            src={student.image}
                            alt={student.name}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-blue-100" />
                        )}
                        <span className="font-medium">{student.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-muted-foreground">{student.email}</td>
                    <td className="py-4 px-4">
                      <Badge variant="outline">0</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge>Active</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Button size="sm" variant="outline">
                        View Profile
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
