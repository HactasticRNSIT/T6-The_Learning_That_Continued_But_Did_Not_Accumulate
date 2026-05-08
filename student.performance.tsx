import { createFileRoute } from "@tanstack/react-router";
import { AreaChart, Area, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { Panel } from "@/components/Card";
import { currentStudent, subjectMastery } from "@/lib/mock-data";

export const Route = createFileRoute("/student/performance")({
  head: () => ({ meta: [{ title: "Performance — EduAI" }, { name: "description", content: "Detailed performance graphs and growth." }] }),
  component: Performance,
});

const retention = currentStudent.performance.map((p, i) => ({ ...p, retention: Math.max(40, p.score - 5 + i), growth: 50 + i * 5 }));
const tooltipStyle = { background: "oklch(0.19 0.035 265)", border: "1px solid oklch(0.3 0.04 265)", borderRadius: 12 };

function Performance() {
  return (
    <div className="space-y-10">
      <header className="space-y-1.5 pb-2 border-b border-border/40">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Performance Analytics</h1>
        <p className="text-muted-foreground">Detailed view of your learning journey.</p>
      </header>

      <Panel title="Retention vs Score" subtitle="6-month trend">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={retention}>
              <defs>
                <linearGradient id="ar1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.72 0.18 200)" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="oklch(0.72 0.18 200)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="ar2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.65 0.22 305)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="oklch(0.65 0.22 305)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.04 265 / 40%)" />
              <XAxis dataKey="month" stroke="oklch(0.68 0.03 255)" fontSize={12} />
              <YAxis stroke="oklch(0.68 0.03 255)" fontSize={12} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="score" stroke="oklch(0.72 0.18 200)" fill="url(#ar1)" strokeWidth={2} />
              <Area type="monotone" dataKey="retention" stroke="oklch(0.65 0.22 305)" fill="url(#ar2)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <div className="grid lg:grid-cols-2 gap-6">
        <Panel title="Subject-wise Mastery" subtitle="Comparative view">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectMastery}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.04 265 / 40%)" />
                <XAxis dataKey="subject" stroke="oklch(0.68 0.03 255)" fontSize={11} />
                <YAxis stroke="oklch(0.68 0.03 255)" fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="mastery" radius={[8, 8, 0, 0]} fill="oklch(0.72 0.18 200)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Learning Growth" subtitle="Cumulative growth index">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={retention}>
                <defs>
                  <linearGradient id="ar3" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.72 0.17 155)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="oklch(0.72 0.17 155)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.04 265 / 40%)" />
                <XAxis dataKey="month" stroke="oklch(0.68 0.03 255)" fontSize={12} />
                <YAxis stroke="oklch(0.68 0.03 255)" fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="growth" stroke="oklch(0.72 0.17 155)" fill="url(#ar3)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>
    </div>
  );
}
