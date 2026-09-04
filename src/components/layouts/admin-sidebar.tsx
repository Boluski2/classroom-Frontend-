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
  BarChart3,
  Building2,
  ClipboardList,
  GraduationCap,
  Home,
  BookOpen,
  AlertCircle,
  Settings,
  LogOut,
  Users,
} from "lucide-react";
import type { User } from "@/types";
import { useLogout as useRefineLogout } from "@refinedev/core";

export function AdminSidebar() {
  const Link = useLink();
  const { mutate: logout } = useRefineLogout();
  const { data: identity } = useGetIdentity<User>();

  const adminMenuItems = [
    { icon: Home, label: "Dashboard", path: "/admin" },
    { icon: GraduationCap, label: "Teachers", path: "/admin/teachers" },
    { icon: Users, label: "Students", path: "/admin/students" },
    { icon: BookOpen, label: "Classes", path: "/admin/classes" },
    { icon: Building2, label: "Departments", path: "/admin/departments" },
    { icon: AlertCircle, label: "Reports", path: "/admin/reports" },
    { icon: BarChart3, label: "Analytics", path: "/admin/analytics" },
    { icon: Settings, label: "Settings", path: "/admin/settings" },
  ];

  return (
    <ShadcnSidebar collapsible="icon" className="border-none bg-linear-to-b from-slate-900 to-slate-800">
      <ShadcnSidebarRail />
      <ShadcnSidebarHeader className="px-4 py-6 border-b border-slate-700">
        <div className="text-lg font-bold text-white">Classroom</div>
        <div className="text-xs text-slate-400">Administration</div>
      </ShadcnSidebarHeader>
      <ShadcnSidebarContent className="flex flex-col gap-2 py-4 px-2">
        {adminMenuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.path} to={item.path}>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "w-full justify-start gap-3 text-slate-200 hover:text-white hover:bg-slate-700",
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
      <div className="mt-auto border-t border-slate-700 p-2">
        <Button
          onClick={() => logout()}
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-3 text-slate-200 hover:text-white hover:bg-red-500/10"
        >
          <LogOut className="h-4 w-4" />
          <span className="text-sm">Logout</span>
        </Button>
      </div>
    </ShadcnSidebar>
  );
}

AdminSidebar.displayName = "AdminSidebar";
