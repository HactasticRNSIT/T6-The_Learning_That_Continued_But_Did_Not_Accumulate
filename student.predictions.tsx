import { createFileRoute } from "@tanstack/react-router";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from "recharts";
import { Panel } from "@/components/Card";
import { Sparkles, AlertTriangle, TrendingDown } from "lucide-react";

export const Route = createFileRoute("/student/predictions")({
  head: () => ({ meta: [{ title: "AI Predictions — EduAI" }, { name: "description", content: "AI-powered forecasts for your retention and performance." }] }),
  component: Predictions,
});

const forecast = [
  { week: "W1", actual: 78, predicted: 78 },
  { week: "W2", actual: 76, predicted: 77 },
  { week: "W3", actual: 74, predicted: 75 },
  { week: "W4", actual: null as number | null, predicted: 72 },
  { week: "W5", actual: null, predicted: 69 },
  { week: "W6", actual: null, predicted: 66 },
  { week: "W7", actual: null, predicted: 63 },
];

const explanations = [
  { subject: "Mathematics", risk: 64, msg: "Your retention in Mathematics may decline due to low reinforcement frequency." },
  { subject: "Chemistry", risk: 48, msg: "Spaced repetition gap detected — schedule a recap to maintain mastery." },
  { subject: "Programming", risk: 18, msg: "Strong reinforcement pattern — retention will likely stay above 90%." },
];

function Predictions() {
  return (
    <div className="space-y-10">
      <header className="space-y-1.5 pb-2 border-b border-border/40">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight flex items-center gap-3">AI Predictions <Sparkles className="size-7 text-accent" /></h1>
        <p className="text-muted-foreground">Forecasts generated from your learning patterns.</p>
      </header>

      <Panel title="Retention Decay Forecast" subtitle="Next 4 weeks (predicted)">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={forecast}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.04 265 / 40%)" />
              <XAxis dataKey="week" stroke="oklch(0.68 0.03 255)" fontSize={12} />
              <YAxis domain={[40, 100]} stroke="oklch(0.68 0.03 255)" fontSize={12} />
              <Tooltip contentStyle={{ background: "oklch(0.19 0.035 265)", border: "1px solid oklch(0.3 0.04 265)", borderRadius: 12 }} />
              <ReferenceLine x="W3" stroke="oklch(0.78 0.17 75)" strokeDasharray="4 4" label={{ value: "Now", fill: "oklch(0.78 0.17 75)", fontSize: 11 }} />
              <Line type="monotone" dataKey="actual" stroke="oklch(0.72 0.18 200)" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="predicted" stroke="oklch(0.65 0.22 305)" strokeWidth={3} strokeDasharray="6 4" dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <div className="grid md:grid-cols-3 gap-6">
        {explanations.map((e) => (
          <div key={e.subject} className="glass rounded-2xl p-6 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{e.subject}</h3>
              {e.risk > 50 ? (
                <span className="text-xs px-2 py-0.5 rounded-full bg-destructive/15 text-destructive border border-destructive/30 flex items-center gap-1">
                  <AlertTriangle className="size-3" /> High risk
                </span>
              ) : e.risk > 30 ? (
                <span className="text-xs px-2 py-0.5 rounded-full bg-warning/15 text-warning border border-warning/30 flex items-center gap-1">
                  <TrendingDown className="size-3" /> Watch
                </span>
              ) : (
                <span className="text-xs px-2 py-0.5 rounded-full bg-success/15 text-success border border-success/30">Stable</span>
              )}
            </div>
            <div className="mt-3 text-3xl font-bold tabular-nums">{e.risk}%</div>
            <div className="text-xs text-muted-foreground">Risk probability</div>
            <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-success via-warning to-destructive" style={{ width: `${e.risk}%` }} />
            </div>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed flex gap-2">
              <Sparkles className="size-4 text-accent shrink-0 mt-0.5" />
              {e.msg}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
