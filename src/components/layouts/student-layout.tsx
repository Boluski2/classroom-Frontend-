"use client";

import { Header } from "@/components/refine-ui/layout/header";
import { ThemeProvider } from "@/components/refine-ui/theme/theme-provider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import type { PropsWithChildren } from "react";
import { StudentSidebar } from "./student-sidebar";

export function StudentLayout({ children }: PropsWithChildren) {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <StudentSidebar />
        <SidebarInset data-role="student">
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

StudentLayout.displayName = "StudentLayout";
