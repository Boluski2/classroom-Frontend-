import { useList, useGetIdentity } from "@refinedev/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GraduationCap, Search, Mail, Building2 } from "lucide-react";
import type { User } from "@/types";
import { useState, useMemo } from "react";

export default function AdminTeachersPage() {
  const { data: identity } = useGetIdentity<User>();
  const [search, setSearch] = useState("");

  const { query: usersQuery } = useList<User>({
    resource: "users",
    pagination: { mode: "off" },
  });

  const teachers = useMemo(() => {
    const allTeachers = (usersQuery.data?.data ?? []).filter((u) => u.role === "teacher");
    if (!search) return allTeachers;
    return allTeachers.filter(
      (t) =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.email.toLowerCase().includes(search.toLowerCase())
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
          <GraduationCap className="h-8 w-8 text-emerald-600" />
          Teachers Management
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          View and manage teaching staff in your institution
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

      {/* Teachers Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">All Teachers ({teachers.length})</h2>
        </div>

        {teachers.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground mb-4">No teachers found</p>
              <Button>Invite Teacher</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teachers.map((teacher) => (
              <Card key={teacher.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Teacher Image & Name */}
                    <div className="flex items-start gap-4">
                      {teacher.image ? (
                        <img
                          src={teacher.image}
                          alt={teacher.name}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                          <GraduationCap className="h-6 w-6 text-emerald-600" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold">{teacher.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          Teacher
                        </Badge>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span className="truncate">{teacher.email}</span>
                      </div>
                      {teacher.department && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Building2 className="h-4 w-4" />
                          <span>{teacher.department}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4">
                      <Button size="sm" variant="outline" className="flex-1">
                        View Profile
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        Actions
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
