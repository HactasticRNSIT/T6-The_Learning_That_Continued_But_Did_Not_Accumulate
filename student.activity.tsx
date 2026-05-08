import { createFileRoute } from "@tanstack/react-router";
import { Panel } from "@/components/Card";
import { studentActivity } from "@/lib/mock-data";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/student/activity")({
  head: () => ({ meta: [{ title: "Activity — EduAI" }, { name: "description", content: "Your learning activity timeline." }] }),
  component: Activity,
});

function Activity() {
  return (
    <div className="space-y-10">
      <header className="space-y-1.5 pb-2 border-b border-border/40">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Activity Timeline</h1>
        <p className="text-muted-foreground">Recent quizzes, revisions and improvements.</p>
      </header>
      <Panel>
        <ol className="relative border-l border-border ml-3 space-y-6">
          {studentActivity.map((a, i) => (
            <li key={i} className="ml-6">
              <span className="absolute -left-[9px] flex size-4 items-center justify-center rounded-full bg-primary glow">
                <CheckCircle2 className="size-3 text-primary-foreground" />
              </span>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-medium">{a.event}</div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-success/15 text-success border border-success/30">{a.delta}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">{a.date}</div>
            </li>
          ))}
        </ol>
      </Panel>
    </div>
  );
}
