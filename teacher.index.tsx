import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, Legend } from "recharts";
import { StatCard } from "@/components/StatCard";
import { Panel } from "@/components/Card";
import { students, teacherAlerts, teacherInsights } from "@/lib/mock-data";
import { Users, Brain, AlertTriangle, GraduationCap, Sparkles, Filter } from "lucide-react";

export const Route = createFileRoute("/teacher/")({
  head: () => ({ meta: [{ title: "Class Overview — EduAI" }, { name: "description", content: "Class-wide AI educational analytics." }] }),
  component: TeacherOverview,
});

const tooltipStyle = { background: "oklch(0.19 0.035 265)", border: "1px solid oklch(0.3 0.04 265)", borderRadius: 12 };

function TeacherOverview() {
  const [sem, setSem] = useState<number | "all">("all");
  const filtered = useMemo(() => sem === "all" ? students : students.filter(s => s.semester === sem), [sem]);

  const avgRetention = Math.round(filtered.reduce((a, s) => a + s.retention, 0) / filtered.length);
  const avgAttendance = Math.round(filtered.reduce((a, s) => a + s.attendance, 0) / filtered.length);
  const atRisk = filtered.filter(s => s.risk === "high").length;

  const subjectAgg = ["Algebra", "Calculus", "Physics", "Chemistry", "Programming"].map((sub) => ({
    subject: sub,
    avg: Math.round(50 + (sub.length * 7) % 40),
  }));

  const trend = ["Jan","Feb","Mar","Apr","May","Jun"].map((m, i) => ({
    month: m,
    retention: Math.round(60 + i * 2 + (sem === "all" ? 5 : Number(sem) * 2)),
    attendance: Math.round(75 + i * 1.5),
  }));

  return (
    <div className="space-y-10">
      <header className="flex flex-wrap items-end justify-between gap-4 pb-2 border-b border-border/40">
        <div className="space-y-1.5">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Class Overview</h1>
          <p className="text-muted-foreground">AI-driven analytics across your students.</p>
        </div>
        <div className="flex items-center gap-2 glass rounded-xl p-1.5">
          <Filter className="size-4 text-muted-foreground ml-2" />
          <select value={String(sem)} onChange={(e) => setSem(e.target.value === "all" ? "all" : Number(e.target.value))} className="bg-transparent text-sm px-2 py-1.5 outline-none cursor-pointer">
            <option value="all">All semesters</option>
            <option value="1">Semester 1</option>
            <option value="2">Semester 2</option>
            <option value="3">Semester 3</option>
            <option value="4">Semester 4</option>
          </select>
        </div>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard label="Total students" value={filtered.length} icon={Users} delta={4} tone="primary" />
        <StatCard label="Avg retention" value={avgRetention} suffix="%" icon={Brain} delta={2} tone="accent" />
        <StatCard label="Avg attendance" value={avgAttendance} suffix="%" icon={GraduationCap} delta={1} tone="success" />
        <StatCard label="At-risk" value={atRisk} icon={AlertTriangle} delta={-12} tone="destructive" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Panel title="Class Trend" subtitle="Retention vs Attendance" >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.04 265 / 40%)" />
                <XAxis dataKey="month" stroke="oklch(0.68 0.03 255)" fontSize={12} />
                <YAxis stroke="oklch(0.68 0.03 255)" fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="retention" stroke="oklch(0.72 0.18 200)" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="attendance" stroke="oklch(0.65 0.22 305)" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Subject Performance" subtitle="Class average">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectAgg}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.04 265 / 40%)" />
                <XAxis dataKey="subject" stroke="oklch(0.68 0.03 255)" fontSize={11} />
                <YAxis stroke="oklch(0.68 0.03 255)" fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="avg" radius={[8, 8, 0, 0]} fill="oklch(0.72 0.18 200)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="AI Teacher Insights" subtitle="Generated from class data">
          <ul className="space-y-3">
            {teacherInsights.map((t, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <Sparkles className="size-4 text-accent shrink-0 mt-0.5" />
                <span className="text-muted-foreground leading-relaxed">{t}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel title="Live Alerts" subtitle="Class-wide AI alerts">
        <div className="grid md:grid-cols-2 gap-4">
          {teacherAlerts.map((a, i) => {
            const tone = a.type === "high" ? "destructive" : a.type === "medium" ? "warning" : "success";
            return (
              <div key={i} className={`flex items-start gap-3 p-3 rounded-xl bg-${tone}/10 border border-${tone}/30`}>
                <AlertTriangle className={`size-4 shrink-0 mt-0.5 text-${tone}`} />
                <span className="text-sm">{a.text}</span>
              </div>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}
