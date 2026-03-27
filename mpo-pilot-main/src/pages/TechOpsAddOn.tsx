import { Suspense, lazy, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import BrainConsole from "@/components/BrainConsole";
import { AlertTriangle, Bug, ChevronDown, ChevronUp, Clock3, Wrench, CheckCircle2, PlayCircle, WandSparkles, FileCheck2 } from "lucide-react";

const TechOpsMicrofrontend = lazy(() =>
  import("@/components/TechOpsEmbed/TechOpsMicrofrontend")
);

export default function TechOpsAddOn() {
  const { pathname } = useLocation();
  const [showAdvancedWorkspace, setShowAdvancedWorkspace] = useState(false);
  const [lastRunAt, setLastRunAt] = useState<string | null>(null);
  const [lastRoute, setLastRoute] = useState<string>("Awaiting triage");
  const [lastConfidence, setLastConfidence] = useState<string>("n/a");
  const [workflowStep, setWorkflowStep] = useState<"intake" | "diagnosing" | "fixed" | "reported">("intake");
  const [customerSummary, setCustomerSummary] = useState<string>(
    "Describe an issue in plain language and Martin will translate it into a fix plan."
  );

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
    <div className="w-full h-full space-y-4 depth-stage">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        <section className="xl:col-span-3 rounded-2xl depth-card p-4 space-y-3">
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
              const summary = String(result.summary ?? "");
              setLastRoute(String(decision.route ?? "unknown"));
              setLastConfidence(String(decision.confidence_score ?? "n/a"));
              setLastRunAt(new Date().toLocaleTimeString());
              setWorkflowStep("diagnosing");
              setCustomerSummary(
                summary ||
                  "We identified the likely root cause, prepared a safe fix, and queued validation checks."
              );
            }}
          />
          <div className="mt-3 rounded-2xl depth-card p-3">
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-2">Team Viewer-Style Fix Flow</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setWorkflowStep("diagnosing")}
                className="rounded-xl border px-3 py-2 text-left hover:bg-secondary/50"
              >
                <div className="flex items-center gap-2 text-sm font-semibold"><PlayCircle className="w-4 h-4" /> Diagnose</div>
                <p className="text-[11px] text-muted-foreground mt-1">Agent inspects logs, configs, and service health.</p>
              </button>
              <button
                type="button"
                onClick={() => setWorkflowStep("fixed")}
                className="rounded-xl border px-3 py-2 text-left hover:bg-secondary/50"
              >
                <div className="flex items-center gap-2 text-sm font-semibold"><WandSparkles className="w-4 h-4" /> Apply Fix</div>
                <p className="text-[11px] text-muted-foreground mt-1">Assisted or autonomous remediation with safeguards.</p>
              </button>
              <button
                type="button"
                onClick={() => setWorkflowStep("reported")}
                className="rounded-xl border px-3 py-2 text-left hover:bg-secondary/50"
              >
                <div className="flex items-center gap-2 text-sm font-semibold"><FileCheck2 className="w-4 h-4" /> Share Report</div>
                <p className="text-[11px] text-muted-foreground mt-1">Simple, non-technical status update for stakeholders.</p>
              </button>
            </div>
            <div className="mt-3 rounded-xl border bg-background/50 p-3">
              <p className="text-xs font-semibold mb-1">What happened (plain-language)</p>
              <p className="text-sm text-muted-foreground">{customerSummary}</p>
              <p className="text-[11px] text-muted-foreground mt-2">
                Current phase:{" "}
                <span className="font-semibold text-foreground capitalize">
                  {workflowStep === "intake" ? "Intake" : workflowStep === "diagnosing" ? "Diagnosing" : workflowStep === "fixed" ? "Fix Applied" : "Reported"}
                </span>
              </p>
            </div>
          </div>
        </section>

        <section className="xl:col-span-3 rounded-2xl depth-card p-4 space-y-3">
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
          <div className="rounded-xl border p-3 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground mb-1">Run Status</p>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              {workflowStep === "reported"
                ? "Customer report sent with outcome and next steps."
                : workflowStep === "fixed"
                ? "Fix validated. Ready to send customer-facing summary."
                : workflowStep === "diagnosing"
                ? "Diagnostics in progress with route confidence scoring."
                : "Awaiting incident intake."}
            </div>
          </div>
        </section>
      </div>
      <section className="rounded-2xl depth-card p-3">
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

