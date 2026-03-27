import { useState, useEffect, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Zap,
  Target,
  Users,
  TrendingUp,
  Clock,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Activity,
  BarChart3,
  Shield,
  AppWindow,
  FolderKanban,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Initiative } from "@/lib/pmoData";

function getTimeOfDay(): "morning" | "afternoon" | "evening" | "night" {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  if (h < 21) return "evening";
  return "night";
}

const greetings: Record<
  ReturnType<typeof getTimeOfDay>,
  { text: string; subtext: string }
> = {
  morning: { text: "Good morning", subtext: "Your command center is ready for the day ahead." },
  afternoon: { text: "Good afternoon", subtext: "Stay focused. Here's your operational pulse." },
  evening: { text: "Good evening", subtext: "Wrapping up the day. Here's where things stand." },
  night: { text: "Good evening", subtext: "The engine continues monitoring while you rest." },
};

export interface MartinCommandCenterPanelProps {
  firstName: string;
  orgName?: string;
  onTrackCount: number;
  atRiskCount: number;
  pendingActions: number;
  criticalCount: number;
  orgHealthPct: number;
  initiatives: Initiative[];
  activityItems: { title: string; description?: string; priority?: string }[];
  /** Optional: Tech-Ops backup/sync summary for subtitle */
  techOpsSubtitle?: string;
  /** compact: stats + integration tiles only (for other dashboard modes) */
  variant?: "full" | "compact";
  /** Optional lockscreen hero (full-width photo header); hides duplicate greeting below */
  lockscreen?: ReactNode;
}

function statusForInitiative(status: string | undefined | null): "completed" | "on-track" | "attention" | "delayed" {
  const s = String(status ?? "").toLowerCase();
  if (s.includes("complete")) return "completed";
  if (s.includes("risk") || s.includes("block")) return "attention";
  if (s.includes("delay")) return "delayed";
  return "on-track";
}

function statusColorDot(status: ReturnType<typeof statusForInitiative>) {
  switch (status) {
    case "completed":
      return "bg-emerald-500";
    case "on-track":
      return "bg-amber-500";
    case "attention":
      return "bg-orange-500";
    case "delayed":
      return "bg-purple-500";
    default:
      return "bg-gray-400";
  }
}

function statusBadgeClass(status: ReturnType<typeof statusForInitiative>) {
  switch (status) {
    case "completed":
      return "bg-emerald-500/10 text-emerald-800 border-emerald-500/25";
    case "on-track":
      return "bg-amber-500/10 text-amber-900 border-amber-500/25";
    case "attention":
      return "bg-orange-500/10 text-orange-900 border-orange-500/25";
    case "delayed":
      return "bg-purple-500/10 text-purple-900 border-purple-500/25";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
}

/**
 * Martin OS Command Center — light “Martin OS” shell merged into PMO-Ops.
 * Sits inside AppLayout (no duplicate app chrome). Uses live KPIs and routes.
 */
export default function MartinCommandCenterPanel({
  firstName,
  orgName,
  onTrackCount,
  atRiskCount,
  pendingActions,
  criticalCount,
  orgHealthPct,
  initiatives,
  activityItems,
  techOpsSubtitle,
  variant = "full",
  lockscreen,
}: MartinCommandCenterPanelProps) {
  const [mounted, setMounted] = useState(false);
  const tod = getTimeOfDay();
  const g = greetings[tod];
  const displayName = firstName?.trim() || "there";
  const orgLine = orgName?.trim() ? `${orgName} · ` : "";

  useEffect(() => {
    setMounted(true);
  }, []);

  const stats = [
    {
      label: "On-track initiatives",
      value: onTrackCount,
      change: onTrackCount > 0 ? `+${Math.min(onTrackCount, 9)}` : "0",
      positive: true,
      icon: Target,
    },
    {
      label: "Needs attention",
      value: atRiskCount,
      change: atRiskCount > 0 ? String(atRiskCount) : "0",
      positive: atRiskCount === 0,
      icon: Clock,
    },
    {
      label: "Open actions",
      value: pendingActions,
      change: pendingActions > 0 ? `${pendingActions}` : "0",
      positive: pendingActions < 12,
      icon: CheckCircle2,
    },
    {
      label: "Critical signals",
      value: criticalCount,
      change: criticalCount === 0 ? "Clear" : String(criticalCount),
      positive: criticalCount === 0,
      icon: TrendingUp,
    },
  ];

  const topInitiatives = initiatives.slice(0, 4).map((ini) => ({
    id: ini.id,
    name: ini.name,
    progress: typeof ini.completionPct === "number" ? ini.completionPct : 0,
    status: statusForInitiative(ini.status),
    due: ini.targetDate || "—",
  }));

  const activities = activityItems.slice(0, 4).map((item, i) => ({
    id: i,
    action: item.title,
    target: item.description ?? item.priority ?? "PMO-Ops",
    time: item.priority ? String(item.priority) : "Now",
    type: item.priority === "high" || item.priority === "critical" ? "warning" : "info",
  }));

  const quickActions: {
    icon: typeof LayoutDashboard;
    label: string;
    to: string;
    color: string;
  }[] = [
    { icon: Target, label: "Initiatives", to: "/initiatives", color: "bg-blue-50 text-blue-900 ring-1 ring-blue-200/80" },
    { icon: Users, label: "Members", to: "/members", color: "bg-amber-50 text-amber-900 ring-1 ring-amber-200/80" },
    { icon: FileText, label: "Reports", to: "/reports", color: "bg-indigo-50 text-indigo-900 ring-1 ring-indigo-200/80" },
    { icon: FolderKanban, label: "Projects", to: "/projects", color: "bg-emerald-50 text-emerald-900 ring-1 ring-emerald-200/80" },
    { icon: Shield, label: "Tech-Ops", to: "/tech-ops", color: "bg-sky-50 text-sky-900 ring-1 ring-sky-200/90 shadow-[inset_0_1px_0_0_hsl(0_0%_100%_/_0.8)]" },
    { icon: AppWindow, label: "Miiddle", to: "/miiddle", color: "bg-violet-50 text-violet-900 ring-1 ring-violet-200/80" },
  ];

  const integrationsCard = (
    <div className="rounded-xl border border-border bg-card p-5 sm:p-6 shadow-[var(--shadow-card)]">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-2 rounded-lg bg-indigo-50 ring-1 ring-indigo-100">
          <Sparkles className="w-4 h-4 text-indigo-600" />
        </div>
        <h4 className="text-sm font-semibold text-foreground">Workspace & integrations</h4>
      </div>
      <p className="text-xs text-muted-foreground mb-3">
        Tech-Ops and Miiddle are embedded native routes — same session and navigation as PMO-Ops.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {quickActions.map((action) => (
          <Link
            key={action.to}
            to={action.to}
            className="flex flex-col items-center gap-2 p-3 rounded-xl border border-border/90 bg-card hover:border-primary/30 hover:shadow-[var(--shadow-card)] transition-all text-center"
          >
            <div className={cn("p-2.5 rounded-lg", action.color)}>
              <action.icon className="w-4 h-4" />
            </div>
            <span className="text-xs font-medium text-foreground">{action.label}</span>
          </Link>
        ))}
      </div>
      {techOpsSubtitle && (
        <p className="text-[10px] text-muted-foreground mt-3 flex items-center gap-1">
          <Shield className="w-3 h-3 shrink-0" />
          {techOpsSubtitle}
        </p>
      )}
    </div>
  );

  return (
    <div className="rounded-2xl depth-card depth-card-strong overflow-hidden">
      {lockscreen && <div className="border-b border-border overflow-hidden bg-card/70">{lockscreen}</div>}
      <div className="border-b border-border bg-card/75 px-4 sm:px-6 py-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[hsl(265_85%_52%)] via-[hsl(var(--primary))] to-[hsl(195_90%_42%)] flex items-center justify-center shadow-[var(--shadow-blue)] shrink-0 ring-1 ring-white/40">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-base font-semibold font-display text-foreground tracking-tight">Martin OS</h2>
            <p className="text-xs text-muted-foreground">
              {orgLine}Command Center · native workspace
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-6">
        {!lockscreen && (
          <div
            className={cn(
              "transition-all duration-500",
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            )}
          >
            <h3 className="text-2xl sm:text-3xl font-bold font-display text-foreground tracking-tight">
              {g.text}, <span className="font-semibold text-primary">{displayName}</span>
            </h3>
            <p className="text-muted-foreground mt-1 text-sm">{g.subtext}</p>
          </div>
        )}

        <div
          className={cn(
            "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 transition-all duration-500 delay-75",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          )}
        >
          {stats.map((stat, i) => (
            <Link
              key={stat.label}
              to={
                i === 0
                  ? "/initiatives"
                  : i === 1
                    ? "/initiatives"
                    : i === 2
                      ? "/action-items"
                      : "/diagnostics"
              }
              className="rounded-xl border border-border bg-card/80 p-4 shadow-[var(--shadow-card)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-prism)] transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-colors ring-1 ring-primary/10">
                  <stat.icon className="w-4 h-4 text-primary" />
                </div>
                <span
                  className={cn(
                    "text-xs font-medium flex items-center gap-0.5",
                    stat.positive ? "text-emerald-600" : "text-rose-500"
                  )}
                >
                  {stat.change}
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">{stat.value}</div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{stat.label}</p>
            </Link>
          ))}
        </div>

        {variant === "compact" ? (
          integrationsCard
        ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-xl border border-border bg-card/80 p-5 sm:p-6 shadow-[var(--shadow-prism)]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-amber-50 ring-1 ring-amber-100">
                    <Zap className="w-4 h-4 text-amber-700" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">Active initiatives</h4>
                    <p className="text-xs text-muted-foreground">
                      {initiatives.length} in portfolio ·{" "}
                      <Link to="/initiatives" className="text-primary font-medium hover:underline">
                        View all
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
              {topInitiatives.length === 0 ? (
                <p className="text-sm text-muted-foreground">No initiatives yet — start in Initiatives.</p>
              ) : (
                <div className="space-y-3">
                  {topInitiatives.map((ini) => (
                    <Link
                      key={String(ini.id)}
                      to="/initiatives"
                      className="block p-3 rounded-xl border border-border/90 hover:border-primary/35 hover:shadow-[var(--shadow-card)] transition-all"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-foreground text-sm">{ini.name}</span>
                        <span
                          className={cn(
                            "px-2 py-0.5 text-[10px] font-medium rounded-full border capitalize",
                            statusBadgeClass(ini.status)
                          )}
                        >
                          {ini.status.replace("-", " ")}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden ring-1 ring-border/40">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[hsl(195_90%_42%)] via-primary to-[hsl(268_78%_55%)]"
                            style={{ width: `${Math.min(100, Math.max(0, ini.progress))}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono tabular-nums font-medium text-muted-foreground w-9 text-right">
                          {Math.round(ini.progress)}%
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1">Target: {ini.due}</p>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {integrationsCard}
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card/80 p-5 sm:p-6 shadow-[var(--shadow-prism)]">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-lg bg-emerald-50 ring-1 ring-emerald-100">
                  <Activity className="w-4 h-4 text-emerald-700" />
                </div>
                <h4 className="text-sm font-semibold text-foreground">Signals & next steps</h4>
              </div>
              {activities.length === 0 ? (
                <p className="text-xs text-muted-foreground">You're caught up.</p>
              ) : (
                <div className="space-y-3">
                  {activities.map((a) => (
                    <div key={a.id} className="flex gap-2">
                      <div
                        className={cn(
                          "mt-1.5 w-2 h-2 rounded-full shrink-0",
                          a.type === "warning" ? "bg-amber-500" : "bg-[hsl(var(--signal-blue))]"
                        )}
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-foreground leading-snug">{a.action}</p>
                        <p className="text-[10px] text-muted-foreground">{a.target}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-xl border border-border bg-card/80 p-5 sm:p-6 shadow-[var(--shadow-prism)]">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-lg bg-card ring-1 ring-border/80">
                  <BarChart3 className="w-4 h-4 text-primary" />
                </div>
                <h4 className="text-sm font-semibold text-foreground">Operational health</h4>
              </div>
              <div className="flex items-center justify-center py-2">
                <div className="relative w-28 h-28">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-border" />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="url(#ccHealthGrad)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${(orgHealthPct / 100) * 264} 264`}
                    />
                    <defs>
                      <linearGradient id="ccHealthGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="hsl(195 90% 45%)" />
                        <stop offset="100%" stopColor="hsl(268 78% 55%)" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold font-mono tabular-nums bg-gradient-to-r from-[hsl(195_90%_38%)] to-[hsl(268_72%_48%)] bg-clip-text text-transparent">
                      {orgHealthPct}
                    </span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">score</span>
                  </div>
                </div>
              </div>
              <Link
                to="/diagnostics"
                className="block text-center text-xs font-medium text-primary hover:underline"
              >
                Open diagnostics
              </Link>
            </div>

            <div className="rounded-xl border border-border bg-card/80 p-5 sm:p-6 shadow-[var(--shadow-prism)]">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-lg bg-card ring-1 ring-primary/15">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <h4 className="text-sm font-semibold text-foreground">Apphia / Brain</h4>
              </div>
              <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                Deep reasoning and org intelligence live in your existing PMO surfaces — use Command Palette (⌘K) or Brain
                console routes.
              </p>
              <Link
                to="/knowledge"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold shadow-[var(--shadow-card)] hover:opacity-95 transition-opacity ring-1 ring-primary/20"
              >
                <Zap className="w-3.5 h-3.5" />
                Resource hub
              </Link>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
