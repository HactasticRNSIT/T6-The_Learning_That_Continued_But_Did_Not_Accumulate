import { createFileRoute, Outlet, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { DashboardShell } from "@/components/Sidebar";

export const Route = createFileRoute("/student")({ component: StudentLayout });

function StudentLayout() {
  const { user } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!user) router.navigate({ to: "/login" });
    else if (user.role !== "student") router.navigate({ to: "/teacher" });
  }, [user, router]);
  if (!user || user.role !== "student") return null;
  return <DashboardShell><Outlet /></DashboardShell>;
}
