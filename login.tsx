import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { Brain, GraduationCap, ArrowRight, Sparkles } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Choose your portal — Smart Spark Insight" },
      { name: "description", content: "An AI engine that tracks how knowledge builds — and where it quietly slips away." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const go = (role: "student" | "teacher") => {
    login(role);
    router.navigate({ to: role === "student" ? "/student" : "/teacher" });
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[oklch(0.13_0.04_280)] text-foreground">
      {/* Grid background */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(to right, oklch(0.7 0.15 280 / 0.25) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.7 0.15 280 / 0.25) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      {/* Glow */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 size-[700px] rounded-full blur-3xl -z-10"
        style={{ background: "radial-gradient(circle, oklch(0.55 0.22 295 / 0.35), transparent 60%)" }} />

      {/* Top bar */}
      <header className="flex items-center justify-between px-6 md:px-10 py-6">
        <div className="flex items-center gap-3">
          <div className="size-11 rounded-2xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, oklch(0.7 0.18 280), oklch(0.65 0.22 320))" }}>
            <Brain className="size-6 text-white" />
          </div>
          <div className="leading-tight">
            <div className="text-lg font-semibold">Smart Spark Insight</div>
            <div className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase">AI Learning Retention</div>
          </div>
        </div>
        <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur text-xs text-muted-foreground">
          <Sparkles className="size-3 text-[oklch(0.75_0.18_180)]" />
          v2.0 · Hackathon edition
        </div>
      </header>

      {/* Hero */}
      <section className="px-6 md:px-10 pt-10 md:pt-20 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs">
          <span className="size-1.5 rounded-full bg-[oklch(0.75_0.2_160)]" />
          <span className="text-muted-foreground">Learning that</span>
          <span className="text-[oklch(0.78_0.18_320)]">accumulates</span>
        </div>
        <h1 className="mt-6 text-5xl md:text-7xl font-bold tracking-tight">
          Choose your{" "}
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(90deg, oklch(0.78 0.16 295), oklch(0.78 0.18 320))" }}>
            portal
          </span>
        </h1>
        <p className="mt-5 text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
          An AI engine that tracks how knowledge builds — and where it quietly slips away.
        </p>
      </section>

      {/* Portal cards */}
      <section className="px-6 md:px-10 mt-12 md:mt-16 max-w-6xl mx-auto grid md:grid-cols-2 gap-6 pb-16">
        <PortalCard
          title="Student Portal"
          description="Track your growth, retention, and predicted trajectory."
          icon={GraduationCap}
          features={["Retention analysis", "Personalized plan", "Risk prediction"]}
          gradient="linear-gradient(135deg, oklch(0.75 0.16 250), oklch(0.7 0.18 290))"
          accent="oklch(0.7 0.2 235)"
          onClick={() => go("student")}
        />
        <PortalCard
          title="Teacher Portal"
          description="Class-wide insights, at-risk alerts, and intervention plans."
          icon={Brain}
          features={["Cohort analytics", "Early warnings", "Recommendations"]}
          gradient="linear-gradient(135deg, oklch(0.78 0.18 30), oklch(0.72 0.2 350))"
          accent="oklch(0.75 0.2 25)"
          onClick={() => go("teacher")}
        />
      </section>

      <footer className="text-center text-xs text-muted-foreground pb-8">
        Built for the "Learning That Continued, But Did Not Accumulate" challenge.
      </footer>
    </div>
  );
}

function PortalCard({
  title, description, icon: Icon, features, gradient, accent, onClick,
}: {
  title: string;
  description: string;
  icon: typeof Brain;
  features: string[];
  gradient: string;
  accent: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group relative text-left rounded-3xl p-8 md:p-10 border border-white/10 bg-[oklch(0.18_0.03_280/0.6)] backdrop-blur-xl overflow-hidden transition-all hover:border-white/20 hover:translate-y-[-2px]"
    >
      <div
        className="absolute -top-24 -right-24 size-72 rounded-full blur-3xl opacity-30 group-hover:opacity-60 transition-opacity"
        style={{ background: gradient }}
      />
      <div className="size-14 rounded-2xl flex items-center justify-center mb-10" style={{ background: gradient }}>
        <Icon className="size-7 text-white" />
      </div>
      <h2 className="text-3xl font-semibold">{title}</h2>
      <p className="mt-2 text-muted-foreground">{description}</p>

      <ul className="mt-6 space-y-2.5">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2.5 text-sm">
            <span className="size-1.5 rounded-full" style={{ background: accent }} />
            {f}
          </li>
        ))}
      </ul>

      <div className="mt-8 inline-flex items-center gap-2 font-medium" style={{ color: accent }}>
        Enter portal
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
      </div>
    </button>
  );
}
