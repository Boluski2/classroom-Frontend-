"use client";

import { Header } from "@/components/refine-ui/layout/header";
import { ThemeProvider } from "@/components/refine-ui/theme/theme-provider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import type { PropsWithChildren } from "react";
import { AdminSidebar } from "./admin-sidebar";

export function AdminLayout({ children }: PropsWithChildren) {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset data-role="admin">
          <Header />
          <main
            className={cn(
              "@container/main",
              "mx-auto",
              "relative",
              "w-full",
              "flex",
              "flex-col",
              "flex-1",
              "px-3",
              "pt-4",
              "md:px-6",
              "md:pt-6",
              "max-w-7xl"
            )}
          >
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
}

AdminLayout.displayName = "AdminLayout";
