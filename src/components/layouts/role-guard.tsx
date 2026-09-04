import { useGetIdentity } from "@refinedev/core";
import { Navigate, Outlet } from "react-router-dom";
import { UserRole, type User } from "@/types";

type RoleGuardProps = {
  allowedRoles: UserRole[];
};

export function RoleGuard({ allowedRoles }: RoleGuardProps) {
  const { data: identity, isLoading } = useGetIdentity<User>();

  if (isLoading) {
    return null;
  }

  if (!identity || !allowedRoles.includes(identity.role)) {
    const redirectPath =
      identity?.role === "admin"
        ? "/admin"
        : identity?.role === "teacher"
          ? "/teacher"
          : "/student";

    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
}
