"use client";

import { Button } from "@/components/ui/button";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent as ShadcnSidebarContent,
  SidebarHeader as ShadcnSidebarHeader,
  SidebarRail as ShadcnSidebarRail,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useGetIdentity, useLink } from "@refinedev/core";
import {
  Home,
  BookOpen,
  Clock,
  Users,
  ClipboardList,
  CheckSquare,
  BarChart3,
  AlertCircle,
  Settings,
  LogOut,
} from "lucide-react";
import type { User } from "@/types";
import { useLogout as useRefineLogout } from "@refinedev/core";

export function TeacherSidebar() {
  const Link = useLink();
  const { mutate: logout } = useRefineLogout();
  const { data: identity } = useGetIdentity<User>();

  const teacherMenuItems = [
    { icon: Home, label: "Dashboard", path: "/teacher" },
    { icon: BookOpen, label: "My Classes", path: "/teacher/classes" },
    { icon: Clock, label: "Schedule", path: "/teacher/schedule" },
    { icon: Users, label: "Students", path: "/teacher/students" },
    { icon: ClipboardList, label: "Assignments", path: "/teacher/assignments" },
    { icon: CheckSquare, label: "Grading", path: "/teacher/grading" },
    { icon: BarChart3, label: "Attendance", path: "/teacher/attendance" },
    { icon: AlertCircle, label: "Reports", path: "/teacher/reports" },
    { icon: Settings, label: "Settings", path: "/teacher/settings" },
  ];

  return (
    <ShadcnSidebar collapsible="icon" className="border-none bg-linear-to-b from-indigo-900 to-blue-900">
      <ShadcnSidebarRail />
      <ShadcnSidebarHeader className="px-4 py-6 border-b border-indigo-700">
        <div className="text-lg font-bold text-white">Classroom</div>
        <div className="text-xs text-indigo-200">Teaching Hub</div>
      </ShadcnSidebarHeader>
      <ShadcnSidebarContent className="flex flex-col gap-2 py-4 px-2">
        {teacherMenuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.path} to={item.path}>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "w-full justify-start gap-3 text-indigo-100 hover:text-white hover:bg-indigo-700",
                  "transition-colors duration-200"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm">{item.label}</span>
              </Button>
            </Link>
          );
        })}
      </ShadcnSidebarContent>
      <div className="mt-auto border-t border-indigo-700 p-2">
        <Button
          onClick={() => logout()}
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-3 text-indigo-100 hover:text-white hover:bg-red-500/10"
        >
          <LogOut className="h-4 w-4" />
          <span className="text-sm">Logout</span>
        </Button>
      </div>
    </ShadcnSidebar>
  );
}

TeacherSidebar.displayName = "TeacherSidebar";
