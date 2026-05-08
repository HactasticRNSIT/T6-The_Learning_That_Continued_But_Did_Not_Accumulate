import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { Panel } from "@/components/Card";
import { students } from "@/lib/mock-data";

export const Route = createFileRoute("/teacher/compare")({
  head: () => ({ meta: [{ title: "Compare — EduAI" }, { name: "description", content: "Compare semesters and groups." }] }),
  component: Compare,
});

const tt = { background: "oklch(0.19 0.035 265)", border: "1px solid oklch(0.3 0.04 265)", borderRadius: 12 };

function Compare() {
  const [a, setA] = useState(1);
  const [b, setB] = useState(2);

  const data = useMemo(() => {
    const subs = ["Algebra","Calculus","Physics","Chemistry","Programming"];
    return subs.map((sub, i) => {
      const groupA = students.filter(s => s.semester === a);
      const groupB = students.filter(s => s.semester === b);
      const ax = Math.round(groupA.reduce((acc, s) => acc + s.retention, 0) / Math.max(1, groupA.length)) + ((i * 3) % 12) - 5;
      const bx = Math.round(groupB.reduce((acc, s) => acc + s.retention, 0) / Math.max(1, groupB.length)) + ((i * 5) % 12) - 5;
      return { subject: sub, [`Sem ${a}`]: Math.max(40, Math.min(100, ax)), [`Sem ${b}`]: Math.max(40, Math.min(100, bx)) };
    });
  }, [a, b]);

  const radarData = data.map(d => ({ subject: d.subject, A: (d as any)[`Sem ${a}`], B: (d as any)[`Sem ${b}`] }));

  return (
    <div className="space-y-10">
      <header className="space-y-1.5 pb-2 border-b border-border/40">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Group Comparison</h1>
        <p className="text-muted-foreground">Compare semesters and groups across subjects.</p>
      </header>

      <div className="flex flex-wrap gap-3">
        <SemPick label="Group A" value={a} onChange={setA} />
        <SemPick label="Group B" value={b} onChange={setB} />
      </div>

      <Panel title="Subject Comparison" subtitle={`Sem ${a} vs Sem ${b}`}>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.04 265 / 40%)" />
              <XAxis dataKey="subject" stroke="oklch(0.68 0.03 255)" fontSize={12} />
              <YAxis stroke="oklch(0.68 0.03 255)" fontSize={12} />
              <Tooltip contentStyle={tt} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey={`Sem ${a}`} fill="oklch(0.72 0.18 200)" radius={[8, 8, 0, 0]} />
              <Bar dataKey={`Sem ${b}`} fill="oklch(0.65 0.22 305)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <Panel title="Retention Profile" subtitle="Radar comparison">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="oklch(0.3 0.04 265 / 50%)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "oklch(0.68 0.03 255)", fontSize: 11 }} />
              <PolarRadiusAxis stroke="oklch(0.3 0.04 265)" tick={false} />
              <Radar name={`Sem ${a}`} dataKey="A" stroke="oklch(0.72 0.18 200)" fill="oklch(0.72 0.18 200)" fillOpacity={0.4} />
              <Radar name={`Sem ${b}`} dataKey="B" stroke="oklch(0.65 0.22 305)" fill="oklch(0.65 0.22 305)" fillOpacity={0.4} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </Panel>
    </div>
  );
}

function SemPick({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <div className="glass rounded-xl px-3 py-2 flex items-center gap-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <select value={value} onChange={(e) => onChange(Number(e.target.value))} className="bg-transparent text-sm outline-none cursor-pointer font-medium">
        {[1,2,3,4].map(n => <option key={n} value={n}>Semester {n}</option>)}
      </select>
    </div>
  );
}
