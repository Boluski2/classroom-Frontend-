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
  FileText,
  BarChart3,
  Calendar,
  Bell,
  Settings,
  LogOut,
} from "lucide-react";
import type { User } from "@/types";
import { useLogout as useRefineLogout } from "@refinedev/core";

export function StudentSidebar() {
  const Link = useLink();
  const { mutate: logout } = useRefineLogout();
  const { data: identity } = useGetIdentity<User>();

  const studentMenuItems = [
    { icon: Home, label: "Dashboard", path: "/student" },
    { icon: BookOpen, label: "My Classes", path: "/student/classes" },
    { icon: FileText, label: "Assignments", path: "/student/assignments" },
    { icon: BarChart3, label: "Grades", path: "/student/grades" },
    { icon: Calendar, label: "Schedule", path: "/student/schedule" },
    { icon: Bell, label: "Notifications", path: "/student/notifications" },
    { icon: Settings, label: "Settings", path: "/student/settings" },
  ];

  return (
    <ShadcnSidebar collapsible="icon" className="border-none bg-linear-to-b from-teal-700 to-cyan-700">
      <ShadcnSidebarRail />
      <ShadcnSidebarHeader className="px-4 py-6 border-b border-teal-600">
        <div className="text-lg font-bold text-white">Classroom</div>
        <div className="text-xs text-teal-100">Learning Portal</div>
      </ShadcnSidebarHeader>
      <ShadcnSidebarContent className="flex flex-col gap-2 py-4 px-2">
        {studentMenuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.path} to={item.path}>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "w-full justify-start gap-3 text-teal-50 hover:text-white hover:bg-teal-600",
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
      <div className="mt-auto border-t border-teal-600 p-2">
        <Button
          onClick={() => logout()}
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-3 text-teal-50 hover:text-white hover:bg-red-500/10"
        >
          <LogOut className="h-4 w-4" />
          <span className="text-sm">Logout</span>
        </Button>
      </div>
    </ShadcnSidebar>
  );
}

StudentSidebar.displayName = "StudentSidebar";
