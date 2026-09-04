import { useList, useGetIdentity } from "@refinedev/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { StatusState } from "@/components/ui/status-state";
import type { User } from "@/types";

type Report = {
  id: number;
  teacherId: string;
  studentId: string;
  classId: number;
  title: string;
  content: string;
  type: "performance" | "incident" | "progress";
  status: "draft" | "submitted" | "reviewed";
  submittedAt?: string | null;
  createdAt: string;
  teacher?: { id: string; name: string; email: string } | null;
  class?: { id: number; name: string } | null;
};

export default function AdminReportsPage() {
  const { data: identity } = useGetIdentity<User>();
  const { query: reportsQuery } = useList<Report>({
    resource: "reports",
    pagination: { mode: "off" },
    queryOptions: { enabled: identity?.role === "admin" },
  });

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

  const reports = reportsQuery.data?.data ?? [];

  if (reportsQuery.isLoading) {
    return <StatusState kind="loading" title="Loading reports" description="Collecting teacher-submitted reports." />;
  }

  if (reportsQuery.isError) {
    return <StatusState kind="error" title="Unable to load reports" description="Try again after checking the reports service." />;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "new":
        return <Clock className="h-4 w-4" />;
      case "under-review":
        return <AlertCircle className="h-4 w-4" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4" />;
      case "escalated":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge>New</Badge>;
      case "under-review":
        return <Badge variant="secondary">Under Review</Badge>;
      case "resolved":
        return <Badge className="bg-green-600">Resolved</Badge>;
      case "escalated":
        return <Badge className="bg-red-600">Escalated</Badge>;
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High</Badge>;
      case "critical":
        return <Badge className="bg-red-700">Critical</Badge>;
      case "medium":
        return <Badge variant="secondary">Medium</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b pb-6">
        <h1 className="text-4xl font-bold tracking-tight flex items-center gap-2">
          <AlertCircle className="h-8 w-8 text-red-600" />
          Teacher Reports
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Review reports submitted by teachers about students and classes
        </p>
      </div>

      {/* Report Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Total Reports</p>
            <p className="text-3xl font-bold">{reports.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">New</p>
            <p className="text-3xl font-bold">{reports.filter((report) => report.status === "submitted").length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Under Review</p>
            <p className="text-3xl font-bold">{reports.filter((report) => report.status === "draft").length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Escalated</p>
            <p className="text-3xl font-bold">{reports.filter((report) => report.type === "incident").length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Recent Reports</h2>
        {reports.length === 0 ? (
          <StatusState kind="empty" title="No reports yet" description="Teacher-submitted reports will appear here." />
        ) : reports.map((report) => (
          <Card key={report.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Header Row */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{report.type}: {report.title}</h3>
                      {getStatusBadge(report.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">Student: {report.studentId} · {report.class?.name ?? `Class ${report.classId}`}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{new Date(report.createdAt).toLocaleDateString()}</p>
                </div>

                {/* Details */}
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-sm">
                    <strong>Teacher:</strong> {report.teacher?.name ?? report.teacherId}
                  </p>
                  <p className="text-sm mt-2">{report.content}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button size="sm">Review</Button>
                  <Button size="sm" variant="outline">
                    Mark as Reviewed
                  </Button>
                  <Button size="sm" variant="outline" className="ml-auto">
                    Take Action
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
