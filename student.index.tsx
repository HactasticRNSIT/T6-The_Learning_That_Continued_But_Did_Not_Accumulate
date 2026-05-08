import { createFileRoute } from "@tanstack/react-router";
import { Brain, Flame, Target, TrendingUp, Award, BookOpen, Zap, Sparkles } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { StatCard } from "@/components/StatCard";
import { Panel, RiskBadge } from "@/components/Card";
import { currentStudent, subjectMastery, aiSuggestions } from "@/lib/mock-data";

export const Route = createFileRoute("/student/")({
  head: () => ({ meta: [{ title: "Your Dashboard — EduAI" }, { name: "description", content: "Personal AI-powered learning analytics." }] }),
  component: StudentOverview,
});

function StudentOverview() {
  const s = currentStudent;
  return (
    <div className="space-y-10">
      <header className="flex flex-wrap items-end justify-between gap-4 pb-2 border-b border-border/40">
        <div className="space-y-1.5">
          <div className="text-sm text-muted-foreground uppercase tracking-wider">Welcome back</div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{s.name} <span className="gradient-text">·</span> <span className="text-muted-foreground text-xl font-normal">Sem {s.semester}</span></h1>
        </div>
        <RiskBadge level={s.risk} />
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard label="Retention" value={s.retention} suffix="%" icon={Brain} delta={s.trend} tone="primary" />
        <StatCard label="Consistency" value={84} suffix="%" icon={Target} delta={3} tone="accent" />
        <StatCard label="Attendance" value={s.attendance} suffix="%" icon={TrendingUp} delta={2} tone="success" />
        <StatCard label="Streak" value={12} suffix="d" icon={Flame} delta={20} tone="warning" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Panel title="Performance Trend" subtitle="Last 6 months" >
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={s.performance}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="oklch(0.72 0.18 200)" />
                    <stop offset="100%" stopColor="oklch(0.65 0.22 305)" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.04 265 / 40%)" />
                <XAxis dataKey="month" stroke="oklch(0.68 0.03 255)" fontSize={12} />
                <YAxis stroke="oklch(0.68 0.03 255)" fontSize={12} domain={[40, 100]} />
                <Tooltip contentStyle={{ background: "oklch(0.19 0.035 265)", border: "1px solid oklch(0.3 0.04 265)", borderRadius: 12 }} />
                <Line type="monotone" dataKey="score" stroke="url(#g1)" strokeWidth={3} dot={{ r: 4, fill: "oklch(0.72 0.18 200)" }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Subject Mastery" subtitle="Across enrolled subjects">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={subjectMastery}>
                <PolarGrid stroke="oklch(0.3 0.04 265 / 50%)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "oklch(0.68 0.03 255)", fontSize: 11 }} />
                <PolarRadiusAxis stroke="oklch(0.3 0.04 265)" tick={false} />
                <Radar dataKey="mastery" stroke="oklch(0.72 0.18 200)" fill="oklch(0.72 0.18 200)" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="AI Suggestions" subtitle="Personalized for you" >
          <ul className="space-y-3">
            {aiSuggestions.map((t, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <div className="size-7 shrink-0 rounded-lg bg-accent/15 text-accent flex items-center justify-center">
                  <Sparkles className="size-3.5" />
                </div>
                <span className="text-muted-foreground leading-relaxed">{t}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {subjectMastery.slice(0, 3).map((sub) => (
          <Panel key={sub.subject} title={sub.subject} subtitle="Mastery level">
            <div className="flex items-center gap-3">
              <div className="text-3xl font-bold tabular-nums">{sub.mastery}%</div>
              <div className="flex-1">
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent" style={{ width: `${sub.mastery}%` }} />
                </div>
                <div className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                  <BookOpen className="size-3" /> 12 topics tracked
                </div>
              </div>
            </div>
          </Panel>
        ))}
      </div>

      <Panel title="Achievements" subtitle="Gamified progression">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { name: "7-Day Streak", icon: Flame, tone: "warning" },
            { name: "Quiz Champion", icon: Award, tone: "primary" },
            { name: "Fast Learner", icon: Zap, tone: "accent" },
            { name: "Consistency Star", icon: Target, tone: "success" },
          ].map((a) => {
            const Icon = a.icon;
            return (
              <div key={a.name} className="glass rounded-xl p-4 text-center hover:scale-105 transition-transform">
                <div className={`mx-auto size-12 rounded-xl flex items-center justify-center text-${a.tone} bg-${a.tone}/15 mb-2`}>
                  <Icon className="size-6" />
                </div>
                <div className="text-sm font-medium">{a.name}</div>
              </div>
            );
          })}
        </div>
        <div className="mt-5">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Level 7 · Scholar</span>
            <span className="font-medium">2,340 / 3,000 XP</span>
          </div>
          <div className="h-3 rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-warning animate-pulse-glow" style={{ width: "78%" }} />
          </div>
        </div>
      </Panel>
    </div>
  );
}
