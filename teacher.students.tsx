import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Panel, RiskBadge } from "@/components/Card";
import { students } from "@/lib/mock-data";
import { Search, Filter, TrendingDown, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/teacher/students")({
  head: () => ({ meta: [{ title: "Students — EduAI" }, { name: "description", content: "Search and filter students with AI risk scoring." }] }),
  component: StudentsList,
});

function StudentsList() {
  const [q, setQ] = useState("");
  const [sem, setSem] = useState<number | "all">("all");
  const [risk, setRisk] = useState<"all" | "low" | "medium" | "high">("all");
  const [sortKey, setSortKey] = useState<"retention" | "attendance" | "name">("retention");

  const list = useMemo(() => {
    let arr = [...students];
    if (sem !== "all") arr = arr.filter(s => s.semester === sem);
    if (risk !== "all") arr = arr.filter(s => s.risk === risk);
    if (q) arr = arr.filter(s => s.name.toLowerCase().includes(q.toLowerCase()));
    arr.sort((a, b) => {
      if (sortKey === "name") return a.name.localeCompare(b.name);
      return (b as any)[sortKey] - (a as any)[sortKey];
    });
    return arr;
  }, [q, sem, risk, sortKey]);

  return (
    <div className="space-y-10">
      <header className="space-y-1.5 pb-2 border-b border-border/40">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Students</h1>
        <p className="text-muted-foreground">Detailed analytics and AI risk detection per student.</p>
      </header>

      <Panel>
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search students…" className="w-full pl-9 pr-3 py-2 rounded-lg bg-input border border-border text-sm outline-none focus:border-primary" />
          </div>
          <SelectChip icon={Filter} value={String(sem)} onChange={(v) => setSem(v === "all" ? "all" : Number(v))} options={[
            ["all","All semesters"],["1","Semester 1"],["2","Semester 2"],["3","Semester 3"],["4","Semester 4"],
          ]} />
          <SelectChip value={risk} onChange={(v) => setRisk(v as any)} options={[["all","All risk"],["low","Low risk"],["medium","Medium risk"],["high","High risk"]]} />
          <SelectChip value={sortKey} onChange={(v) => setSortKey(v as any)} options={[["retention","Sort: Retention"],["attendance","Sort: Attendance"],["name","Sort: Name"]]} />
        </div>

        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground uppercase tracking-wider">
              <tr className="text-left">
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Sem</th>
                <th className="px-3 py-2">Retention</th>
                <th className="px-3 py-2">Attendance</th>
                <th className="px-3 py-2">Risk</th>
                <th className="px-3 py-2">Trend</th>
                <th className="px-3 py-2">Weak subjects</th>
              </tr>
            </thead>
            <tbody>
              {list.map((s) => (
                <tr key={s.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                  <td className="px-3 py-3 font-medium">{s.name}</td>
                  <td className="px-3 py-3 text-muted-foreground">{s.semester}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <span className="tabular-nums w-8">{s.retention}%</span>
                      <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary to-accent" style={{ width: `${s.retention}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 tabular-nums">{s.attendance}%</td>
                  <td className="px-3 py-3"><RiskBadge level={s.risk} /></td>
                  <td className="px-3 py-3">
                    <span className={`inline-flex items-center gap-1 text-xs ${s.trend >= 0 ? "text-success" : "text-destructive"}`}>
                      {s.trend >= 0 ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                      {s.trend >= 0 ? "+" : ""}{s.trend}%
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-1">
                      {s.weakSubjects.map((w) => (
                        <span key={w} className="text-xs px-2 py-0.5 rounded-md bg-warning/10 text-warning border border-warning/30">{w}</span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length === 0 && <div className="text-center py-12 text-muted-foreground">No students match these filters.</div>}
        </div>
      </Panel>
    </div>
  );
}

function SelectChip({ value, onChange, options, icon: Icon }: { value: string; onChange: (v: string) => void; options: [string, string][]; icon?: typeof Filter }) {
  return (
    <div className="flex items-center glass rounded-lg pl-2.5">
      {Icon && <Icon className="size-3.5 text-muted-foreground" />}
      <select value={value} onChange={(e) => onChange(e.target.value)} className="bg-transparent text-sm px-2 py-2 outline-none cursor-pointer">
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </div>
  );
}
