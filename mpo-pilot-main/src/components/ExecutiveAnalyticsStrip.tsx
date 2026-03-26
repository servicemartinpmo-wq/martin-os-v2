import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

type StripMetric = {
  id: string;
  label: string;
  value: string;
  sub?: string;
  barPct: number;
  accent: "red" | "black" | "blue";
  href?: string;
};

const accentBar: Record<StripMetric["accent"], string> = {
  red: "hsl(350 70% 48%)",
  black: "hsl(225 30% 12%)",
  blue: "hsl(222 72% 48%)",
};

/**
 * Adobe Analytics / Windsor-style KPI row: bold totals + horizontal comparison bars.
 */
export default function ExecutiveAnalyticsStrip({
  metrics,
  className,
}: {
  metrics: StripMetric[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border overflow-hidden martin-analytics-strip",
        className
      )}
      style={{
        background: "hsl(var(--card))",
        borderColor: "hsl(var(--border))",
        boxShadow: "var(--shadow-elevated)",
      }}
    >
      <div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 py-3 border-b"
        style={{
          borderColor: "hsl(var(--border))",
          background: "linear-gradient(90deg, hsl(222 55% 18%) 0%, hsl(222 50% 14%) 100%)",
        }}
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/90">
          Executive analytics
        </span>
        <Link
          to="/reports"
          className="text-[10px] font-semibold uppercase tracking-wide text-white/55 hover:text-white flex items-center gap-1"
        >
          Open reports <ArrowUpRight className="w-3 h-3" />
        </Link>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 divide-x divide-y lg:divide-y-0"
        style={{ borderColor: "hsl(var(--border))" }}>
        {metrics.map((m) => {
          const inner = (
            <>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                {m.label}
              </p>
              <p className="text-2xl font-black font-mono tracking-tight text-foreground leading-none mb-2">
                {m.value}
              </p>
              {m.sub && (
                <p className="text-[10px] text-muted-foreground mb-3 line-clamp-2">{m.sub}</p>
              )}
              <div
                className="h-1.5 rounded-full overflow-hidden"
                style={{ background: "hsl(var(--muted))" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, Math.max(0, m.barPct))}%`,
                    background: accentBar[m.accent],
                  }}
                />
              </div>
            </>
          );
          const pad = "p-4";
          if (m.href) {
            return (
              <Link
                key={m.id}
                to={m.href}
                className={cn(pad, "block hover:bg-muted/40 transition-colors")}
              >
                {inner}
              </Link>
            );
          }
          return (
            <div key={m.id} className={pad}>
              {inner}
            </div>
          );
        })}
      </div>
    </div>
  );
}
