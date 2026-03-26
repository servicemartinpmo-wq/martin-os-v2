import { Suspense, lazy, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import BrainConsole from "@/components/BrainConsole";
import { AlertTriangle, Bug, ChevronDown, ChevronUp, Clock3, Wrench } from "lucide-react";

const TechOpsMicrofrontend = lazy(() =>
  import("@/components/TechOpsEmbed/TechOpsMicrofrontend")
);

export default function TechOpsAddOn() {
  const { pathname } = useLocation();
  const [showAdvancedWorkspace, setShowAdvancedWorkspace] = useState(false);
  const [lastRunAt, setLastRunAt] = useState<string | null>(null);
  const [lastRoute, setLastRoute] = useState<string>("Awaiting triage");
  const [lastConfidence, setLastConfidence] = useState<string>("n/a");

  // Host route is `/tech-ops/*`, but the embedded Tech-Ops UI expects paths like `/dashboard`, `/cases`, etc.
  const relative = pathname.replace(/^\/tech-ops\/?/, "");
  const microPath = relative ? `/${relative}` : "/dashboard";
  const liveIncidents = useMemo(() => {
    const base = [
      { title: "API 500 errors", sev: "High", age: "12m", icon: AlertTriangle },
      { title: "Spike in timeout rate", sev: "Medium", age: "26m", icon: Clock3 },
      { title: "Failed auth callbacks", sev: "Low", age: "48m", icon: Bug },
    ];
    if (!lastRunAt) return base;
    return [
      { title: `Latest run route: ${lastRoute}`, sev: "Live", age: lastRunAt, icon: AlertTriangle },
      { title: `Model confidence: ${lastConfidence}`, sev: "Live", age: "just now", icon: Clock3 },
      ...base.slice(0, 1),
    ];
  }, [lastConfidence, lastRoute, lastRunAt]);
  const playbook = useMemo(
    () =>
      lastRoute === "diagnostic_workflow"
        ? [
            "Pull logs for the exact failure window",
            "Verify dependency health and deploy diff",
            "Apply rollback/guardrail if customer impact is active",
            "Confirm recovery and update incident timeline",
          ]
        : [
            "Capture logs for last 15 minutes",
            "Check recent deploys and config changes",
            "Correlate spike timing with external dependencies",
            "Create/attach incident ticket and route owner",
          ],
    [lastRoute],
  );
  const quickPrompts = [
    "Customers see 500 errors when submitting checkout.",
    "Login callbacks fail intermittently after the latest release.",
    "Background jobs are timing out and queue depth is increasing.",
  ];

  return (
    <div className="w-full h-full space-y-4">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        <section className="xl:col-span-3 rounded-2xl border bg-card p-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Active Incidents</h3>
          {liveIncidents.map((i) => {
            const Icon = i.icon;
            return (
              <div key={i.title} className="rounded-xl border p-3">
                <div className="flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                  <p className="text-sm font-semibold">{i.title}</p>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">{i.sev} severity • {i.age} ago</p>
              </div>
            );
          })}
        </section>

        <section className="xl:col-span-6">
          <BrainConsole
            title="Tech-Ops Troubleshooting Console"
            placeholder="Describe the incident in plain language. Example: Customers see 500 errors when submitting checkout."
            adminOnlyTechnicalDetails
            quickPrompts={quickPrompts}
            onResult={(result) => {
              const machineView = (result.machine_view as Record<string, unknown> | undefined) ?? {};
              const decision = (machineView.decision as Record<string, unknown> | undefined) ?? {};
              setLastRoute(String(decision.route ?? "unknown"));
              setLastConfidence(String(decision.confidence_score ?? "n/a"));
              setLastRunAt(new Date().toLocaleTimeString());
            }}
          />
        </section>

        <section className="xl:col-span-3 rounded-2xl border bg-card p-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Operator Playbook</h3>
          {playbook.map((step, idx) => (
            <div key={step} className="flex items-start gap-2 rounded-xl border p-3">
              <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">{idx + 1}</div>
              <p className="text-sm">{step}</p>
            </div>
          ))}
          <div className="rounded-xl border p-3 text-xs text-muted-foreground flex items-center gap-2">
            <Wrench className="w-3.5 h-3.5" />
            Actions run only from allowlisted tools for safety.
          </div>
        </section>
      </div>
      <section className="rounded-2xl border bg-card p-3">
        <button
          type="button"
          onClick={() => setShowAdvancedWorkspace((v) => !v)}
          className="w-full flex items-center justify-between text-sm font-semibold"
        >
          <span>Advanced Tech-Ops workspace</span>
          {showAdvancedWorkspace ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {showAdvancedWorkspace && (
          <div className="mt-3">
            <Suspense
              fallback={
                <div className="w-full min-h-[360px] flex items-center justify-center rounded-lg border bg-background/50">
                  <div className="text-xs text-muted-foreground">Loading Tech-Ops workspace…</div>
                </div>
              }
            >
              <TechOpsMicrofrontend path={microPath} title="Tech-Ops Add-on" />
            </Suspense>
          </div>
        )}
      </section>
    </div>
  );
}

