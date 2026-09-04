"use client";

import { Header } from "@/components/refine-ui/layout/header";
import { ThemeProvider } from "@/components/refine-ui/theme/theme-provider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import type { PropsWithChildren } from "react";
import { TeacherSidebar } from "./teacher-sidebar";

export function TeacherLayout({ children }: PropsWithChildren) {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <TeacherSidebar />
        <SidebarInset data-role="teacher">
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

TeacherLayout.displayName = "TeacherLayout";
