import { createFileRoute, Outlet, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { DashboardShell } from "@/components/Sidebar";

export const Route = createFileRoute("/teacher")({ component: TeacherLayout });

function TeacherLayout() {
  const { user } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!user) router.navigate({ to: "/login" });
    else if (user.role !== "teacher") router.navigate({ to: "/student" });
  }, [user, router]);
  if (!user || user.role !== "teacher") return null;
  return <DashboardShell><Outlet /></DashboardShell>;
}
