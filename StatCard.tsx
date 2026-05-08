import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";

export function StatCard({
  label,
  value,
  icon: Icon,
  delta,
  tone = "primary",
  suffix,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  delta?: number;
  tone?: "primary" | "accent" | "success" | "warning" | "destructive";
  suffix?: string;
}) {
  const toneMap = {
    primary: "from-primary/20 to-primary/5 text-primary",
    accent: "from-accent/20 to-accent/5 text-accent",
    success: "from-success/20 to-success/5 text-success",
    warning: "from-warning/20 to-warning/5 text-warning",
    destructive: "from-destructive/20 to-destructive/5 text-destructive",
  } as const;

  return (
    <div className="glass rounded-2xl p-5 relative overflow-hidden group hover:border-primary/40 transition-all">
      <div className={`absolute -top-10 -right-10 size-32 rounded-full bg-gradient-to-br ${toneMap[tone]} blur-2xl opacity-50 group-hover:opacity-80 transition-opacity`} />
      <div className="flex items-start justify-between relative">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
          <div className="mt-2 text-3xl font-bold tabular-nums">
            {value}
            {suffix && <span className="text-base text-muted-foreground ml-1">{suffix}</span>}
          </div>
          {delta !== undefined && (
            <div className={`mt-1 inline-flex items-center gap-1 text-xs ${delta >= 0 ? "text-success" : "text-destructive"}`}>
              {delta >= 0 ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
              {delta >= 0 ? "+" : ""}{delta}% vs last
            </div>
          )}
        </div>
        <div className={`size-11 rounded-xl bg-gradient-to-br ${toneMap[tone]} flex items-center justify-center`}>
          <Icon className="size-5" />
        </div>
      </div>
    </div>
  );
}
