import { useGetIdentity } from "@refinedev/core";
import type { User } from "@/types";
import { AdminLayout } from "@/components/layouts/admin-layout";
import { TeacherLayout } from "@/components/layouts/teacher-layout";
import { StudentLayout } from "@/components/layouts/student-layout";
import type { PropsWithChildren } from "react";

export function RoleBasedLayout({ children }: PropsWithChildren) {
  const { data: identity } = useGetIdentity<User>();

  const role = identity?.role;

  if (role === "admin") {
    return <AdminLayout>{children}</AdminLayout>;
  }

  if (role === "teacher") {
    return <TeacherLayout>{children}</TeacherLayout>;
  }

  if (role === "student") {
    return <StudentLayout>{children}</StudentLayout>;
  }

  // Fallback for unknown role
  return <StudentLayout>{children}</StudentLayout>;
}

RoleBasedLayout.displayName = "RoleBasedLayout";
