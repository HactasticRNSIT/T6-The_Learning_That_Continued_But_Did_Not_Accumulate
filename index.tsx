import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/")({ component: Index });

function Index() {
  const { user } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!user) router.navigate({ to: "/login" });
    else router.navigate({ to: user.role === "student" ? "/student" : "/teacher" });
  }, [user, router]);
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="size-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );
}
