import { useGetIdentity } from "@refinedev/core";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLink } from "@refinedev/core";
import type { User } from "@/types";

const Home = () => {
  const { data: identity } = useGetIdentity<User>();
  const Link = useLink();

  const role = identity?.role ?? "guest";
  const name = identity?.name ?? "Student";

  const portalRoute =
    role === "admin"
      ? "/admin"
      : role === "teacher"
      ? "/teacher"
      : role === "student"
      ? "/student"
      : "/";
  const portalLabel =
    role === "admin"
      ? "Admin Dashboard"
      : role === "teacher"
      ? "Teacher Dashboard"
      : "Student Dashboard";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Welcome back, {name}</h1>
        <p className="text-muted-foreground">
          Your classroom workspace is ready. Use the portal below to continue.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Role</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{role}</div>
            <p className="text-sm text-muted-foreground mt-2">
              Your account is configured for {role === "guest" ? "general access" : `${role} access`}.
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Next Step</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Continue to your personalized portal or review classroom resources.
            </p>
            <Button asChild>
              <Link to={portalRoute} className="w-full justify-center">
                Open {portalLabel}
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Resources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Badge variant="secondary">Subjects</Badge>
            <Badge variant="secondary">Classes</Badge>
            <Badge variant="secondary">Departments</Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;
