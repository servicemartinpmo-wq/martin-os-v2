import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Bot,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Cpu,
  ExternalLink,
  Headset,
  Layers,
  Loader2,
  MonitorSmartphone,
  Sparkles,
  Wand2,
} from "lucide-react";
import {
  fetchTechOpsCapabilities,
  runTechOpsLaunchReadiness,
  runTechOpsOrchestration,
  type TechOpsCapabilities,
  type TechOpsLaunchReadinessResponse,
  type TechOpsOrchestrationResponse,
} from "@/lib/techOpsControlClient";

const TechOpsMicrofrontend = lazy(() =>
  import("@/components/TechOpsEmbed/TechOpsMicrofrontend")
);

export default function TechOpsAddOn() {
  const { pathname } = useLocation();
  const [showAdvancedWorkspace, setShowAdvancedWorkspace] = useState(false);
  const [capabilities, setCapabilities] = useState<TechOpsCapabilities | null>(null);
  const [capabilitiesError, setCapabilitiesError] = useState<string | null>(null);
  const [loadingCapabilities, setLoadingCapabilities] = useState(true);
  const [orchestration, setOrchestration] = useState<TechOpsOrchestrationResponse | null>(null);
  const [orchestrationError, setOrchestrationError] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [launchReadiness, setLaunchReadiness] = useState<TechOpsLaunchReadinessResponse | null>(null);
  const [launchReadinessError, setLaunchReadinessError] = useState<string | null>(null);
  const [runningLaunchReadiness, setRunningLaunchReadiness] = useState(false);

  const [rolePreset, setRolePreset] = useState<"support" | "engineer" | "developer">(
    "support",
  );
  const [supportTier, setSupportTier] = useState(3);
  const [providerTarget, setProviderTarget] = useState<
    "auto" | "gemini" | "chatgpt" | "cursor" | "autonomous"
  >("auto");
  const [prompt, setPrompt] = useState(
    "Users cannot complete onboarding after the latest release. Diagnose and provide a safe recovery plan.",
  );
  const [enableAutonomousAgents, setEnableAutonomousAgents] = useState(true);
  const [requireTeamViewer, setRequireTeamViewer] = useState(false);
  const [enableInternalBuilder, setEnableInternalBuilder] = useState(false);
  const [internalUseConfirmed, setInternalUseConfirmed] = useState(false);
  const [builderSummary, setBuilderSummary] = useState(
    "Internal app-builder for tech-ops teams: scaffold, iterate, and deploy guarded workflows.",
  );
  const [builderTargetUsers, setBuilderTargetUsers] = useState(
    "Tech support, software engineers, developers",
  );
  const [builderStack, setBuilderStack] = useState("TypeScript + Supabase + React");
  const [launchMission, setLaunchMission] = useState(
    "Ship a launch-ready multi-agent platform that outperforms category leaders across operations, reliability, and UX.",
  );
  const [launchStrictMode, setLaunchStrictMode] = useState(true);
  const [launchSmokeTest, setLaunchSmokeTest] = useState(true);

  // Host route is `/tech-ops/*`, but the embedded Tech-Ops UI expects paths like `/dashboard`, `/cases`, etc.
  const relative = pathname.replace(/^\/tech-ops\/?/, "");
  const microPath = relative ? `/${relative}` : "/dashboard";
  useEffect(() => {
    let active = true;
    setLoadingCapabilities(true);
    fetchTechOpsCapabilities()
      .then((data) => {
        if (!active) return;
        setCapabilities(data);
        setCapabilitiesError(null);
      })
      .catch((error) => {
        if (!active) return;
        setCapabilitiesError(error instanceof Error ? error.message : "Failed to load capabilities");
      })
      .finally(() => {
        if (active) setLoadingCapabilities(false);
      });
    return () => {
      active = false;
    };
  }, []);

  function applyRolePreset(preset: "support" | "engineer" | "developer") {
    setRolePreset(preset);
    if (preset === "support") {
      setSupportTier(2);
      setProviderTarget("gemini");
      setEnableAutonomousAgents(false);
      setRequireTeamViewer(true);
      setPrompt(
        "Tier 2 support triage: recurring login failures in production. Prepare guided fix steps and TeamViewer handoff.",
      );
      return;
    }
    if (preset === "engineer") {
      setSupportTier(4);
      setProviderTarget("cursor");
      setEnableAutonomousAgents(true);
      setRequireTeamViewer(true);
      setPrompt(
        "Tier 4 engineering escalation: API latency spikes after deploy. Coordinate diagnosis and guarded remediation.",
      );
      return;
    }
    setSupportTier(5);
    setProviderTarget("autonomous");
    setEnableAutonomousAgents(true);
    setRequireTeamViewer(false);
    setPrompt(
      "Tier 5 critical command: orchestrate autonomous recovery, protect uptime, and generate executive incident summary.",
    );
  }

  async function handleRunOrchestration() {
    setRunning(true);
    setOrchestrationError(null);
    try {
      const result = await runTechOpsOrchestration({
        prompt,
        supportTier,
        providerTarget,
        enableAutonomousAgents,
        requireTeamViewer,
        internalAppBuilder: {
          enabled: enableInternalBuilder,
          summary: builderSummary,
          targetUsers: builderTargetUsers,
          preferredStack: builderStack,
          internalUseConfirmed,
        },
      });
      setOrchestration(result);
    } catch (error) {
      setOrchestrationError(error instanceof Error ? error.message : "Failed to run orchestration");
    } finally {
      setRunning(false);
    }
  }

  async function handleRunLaunchReadiness() {
    setRunningLaunchReadiness(true);
    setLaunchReadinessError(null);
    try {
      const result = await runTechOpsLaunchReadiness({
        mission: launchMission,
        strictMode: launchStrictMode,
        runOrchestrationSmokeTest: launchSmokeTest,
        supportTier,
        providerTarget,
        enableAutonomousAgents,
      });
      setLaunchReadiness(result);
    } catch (error) {
      setLaunchReadinessError(
        error instanceof Error ? error.message : "Failed to run launch readiness validation",
      );
    } finally {
      setRunningLaunchReadiness(false);
    }
  }

  const connectionChips = useMemo(
    () => [
      {
        label: "Supabase",
        active: Boolean(capabilities?.backend.supabase),
      },
      {
        label: "Middleware",
        active: Boolean(capabilities?.backend.middleware),
      },
      {
        label: "Gemini",
        active: Boolean(capabilities?.providers.gemini),
      },
      {
        label: "ChatGPT",
        active: Boolean(capabilities?.providers.chatgpt),
      },
      {
        label: "Cursor",
        active: Boolean(capabilities?.providers.cursor),
      },
      {
        label: "Autonomous Agents",
        active: Boolean(capabilities?.providers.autonomous),
      },
    ],
    [capabilities],
  );

  return (
    <div className="w-full h-full space-y-4 text-foreground">
      <div className="rounded-2xl border bg-card p-4 md:p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Unified Tech-Ops Control Plane
            </p>
            <h2 className="text-lg font-black mt-1">Backend + Middleware + Agents + Frontend</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Orchestrates Supabase, Cursor middleware, Gemini, ChatGPT, TeamViewer, and autonomous agents from one prompt flow.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAdvancedWorkspace((v) => !v)}
            className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold hover:bg-muted/30"
          >
            <Layers className="w-3.5 h-3.5" />
            {showAdvancedWorkspace ? "Hide advanced workspace" : "Open advanced workspace"}
            {showAdvancedWorkspace ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-4 md:p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-primary" />
            <p className="text-sm font-bold">Connection Status</p>
          </div>
          {loadingCapabilities && (
            <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin" />
              Checking
            </span>
          )}
        </div>
        {capabilitiesError && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {capabilitiesError}
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          {connectionChips.map((chip) => (
            <span
              key={chip.label}
              className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px]"
              style={{
                borderColor: chip.active ? "hsl(160 56% 42% / 0.35)" : "hsl(var(--border))",
                background: chip.active ? "hsl(160 56% 42% / 0.10)" : "hsl(var(--muted))",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: chip.active ? "hsl(160 56% 42%)" : "hsl(var(--muted-foreground))" }}
              />
              {chip.label}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        <section className="xl:col-span-7 rounded-2xl border bg-card p-4 md:p-5 space-y-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
              Tiered Support Orchestration
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Run Tier 1–5 support via prompt, with optional TeamViewer handoff and autonomous execution.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { key: "support", label: "Tech Support Agent", icon: Headset },
              { key: "engineer", label: "Software Engineer", icon: Bot },
              { key: "developer", label: "Developer", icon: Sparkles },
            ].map((preset) => {
              const Icon = preset.icon;
              const active = rolePreset === preset.key;
              return (
                <button
                  key={preset.key}
                  type="button"
                  onClick={() => applyRolePreset(preset.key as "support" | "engineer" | "developer")}
                  className="inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors"
                  style={{
                    borderColor: active ? "hsl(var(--primary))" : "hsl(var(--border))",
                    background: active ? "hsl(var(--primary) / 0.10)" : "transparent",
                  }}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {preset.label}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <label className="text-xs font-semibold">
              Support tier
              <select
                value={supportTier}
                onChange={(e) => setSupportTier(Number(e.target.value))}
                className="mt-1 w-full rounded-md border bg-background px-2.5 py-2 text-sm"
                aria-label="Support tier"
              >
                <option value={1}>Tier 1</option>
                <option value={2}>Tier 2</option>
                <option value={3}>Tier 3</option>
                <option value={4}>Tier 4</option>
                <option value={5}>Tier 5</option>
              </select>
            </label>
            <label className="text-xs font-semibold">
              Provider routing
              <select
                value={providerTarget}
                onChange={(e) =>
                  setProviderTarget(
                    e.target.value as "auto" | "gemini" | "chatgpt" | "cursor" | "autonomous",
                  )
                }
                className="mt-1 w-full rounded-md border bg-background px-2.5 py-2 text-sm"
                aria-label="Provider routing"
              >
                <option value="auto">Auto</option>
                <option value="gemini">Gemini</option>
                <option value="chatgpt">ChatGPT</option>
                <option value="cursor">Cursor</option>
                <option value="autonomous">Autonomous Agents</option>
              </select>
            </label>
            <label className="text-xs font-semibold">
              Default stack (internal builder)
              <input
                value={builderStack}
                onChange={(e) => setBuilderStack(e.target.value)}
                className="mt-1 w-full rounded-md border bg-background px-2.5 py-2 text-sm"
              />
            </label>
          </div>

          <label className="block text-xs font-semibold">
            Tech-Ops prompt
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={5}
              className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
              placeholder="Describe the issue, impact, and required outcome."
            />
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="flex items-center gap-2 rounded-xl border p-3 text-xs font-medium">
              <input
                type="checkbox"
                checked={enableAutonomousAgents}
                onChange={(e) => setEnableAutonomousAgents(e.target.checked)}
              />
              Enable autonomous agents for execution
            </label>
            <label className="flex items-center gap-2 rounded-xl border p-3 text-xs font-medium">
              <input
                type="checkbox"
                checked={requireTeamViewer}
                onChange={(e) => setRequireTeamViewer(e.target.checked)}
              />
              Require TeamViewer remote handoff
            </label>
            <label className="flex items-center gap-2 rounded-xl border p-3 text-xs font-medium">
              <input
                type="checkbox"
                checked={enableInternalBuilder}
                onChange={(e) => setEnableInternalBuilder(e.target.checked)}
              />
              Enable internal app-builder (Replit-style, internal-only)
            </label>
            <label className="flex items-center gap-2 rounded-xl border p-3 text-xs font-medium">
              <input
                type="checkbox"
                checked={internalUseConfirmed}
                onChange={(e) => setInternalUseConfirmed(e.target.checked)}
              />
              Confirm internal-only usage
            </label>
          </div>

          {enableInternalBuilder && (
            <div className="rounded-xl border p-3 space-y-2">
              <label className="block text-xs font-semibold">
                Builder summary
                <textarea
                  value={builderSummary}
                  onChange={(e) => setBuilderSummary(e.target.value)}
                  rows={2}
                  className="mt-1 w-full rounded-md border bg-background px-2.5 py-2 text-sm"
                />
              </label>
              <label className="block text-xs font-semibold">
                Target users
                <input
                  value={builderTargetUsers}
                  onChange={(e) => setBuilderTargetUsers(e.target.value)}
                  className="mt-1 w-full rounded-md border bg-background px-2.5 py-2 text-sm"
                />
              </label>
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleRunOrchestration}
              disabled={running || !prompt.trim()}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground disabled:opacity-60"
            >
              {running ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
              Run unified orchestration
            </button>
            <span className="text-xs text-muted-foreground">
              This flow routes through Supabase + middleware and selected agents.
            </span>
          </div>

          {orchestrationError && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {orchestrationError}
            </div>
          )}
        </section>

        <section className="xl:col-span-5 rounded-2xl border bg-card p-4 md:p-5 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
            Latest Orchestration Output
          </h3>
          {!orchestration ? (
            <div className="rounded-xl border bg-muted/30 p-4 text-xs text-muted-foreground">
              Run a prompt to generate Tier 1–5 runbook, provider selection, TeamViewer handoff, and optional internal app-builder plan.
            </div>
          ) : (
            <>
              <div className="rounded-xl border p-3">
                <p className="text-sm font-semibold">{orchestration.support_tier_label}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Selected provider: <span className="font-semibold text-foreground">{orchestration.selected_provider}</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Chain: {orchestration.provider_chain.join(" → ")}
                </p>
                {orchestration.backend.brain_invocation_error ? (
                  <p className="text-xs text-destructive mt-2">{orchestration.backend.brain_invocation_error}</p>
                ) : (
                  <p className="text-xs text-signal-green mt-2 inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Brain orchestration invoked successfully
                  </p>
                )}
              </div>

              <div className="rounded-xl border p-3">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground mb-2">
                  Tier runbook
                </p>
                <ol className="space-y-1.5 text-sm">
                  {orchestration.runbook.map((step, idx) => (
                    <li key={step} className="flex gap-2">
                      <span className="text-xs font-bold text-primary mt-0.5">{idx + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {orchestration.teamviewer && (
                <div className="rounded-xl border p-3">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground mb-2 inline-flex items-center gap-1.5">
                    <MonitorSmartphone className="w-3.5 h-3.5" />
                    TeamViewer handoff
                  </p>
                  <p className="text-sm font-semibold">Session code: {orchestration.teamviewer.session_code}</p>
                  <a
                    href={orchestration.teamviewer.session_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1"
                  >
                    Open TeamViewer session <ExternalLink className="w-3 h-3" />
                  </a>
                  <p className="text-xs text-muted-foreground mt-2">{orchestration.teamviewer.operator_script}</p>
                </div>
              )}

              {orchestration.app_builder && (
                <div className="rounded-xl border p-3">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground mb-2 inline-flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Internal app-builder plan
                  </p>
                  <p className="text-sm font-semibold">{orchestration.app_builder.feature_summary}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Stack: {orchestration.app_builder.stack} · Users: {orchestration.app_builder.target_users}
                  </p>
                  <ul className="mt-2 space-y-1 text-xs text-muted-foreground list-disc pl-4">
                    {orchestration.app_builder.phases.map((phase) => (
                      <li key={phase}>{phase}</li>
                    ))}
                  </ul>
                </div>
              )}

              {orchestration.app_builder_denied_reason && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                  {orchestration.app_builder_denied_reason}
                </div>
              )}
            </>
          )}
        </section>
      </div>

      <div className="rounded-2xl border bg-card p-4 md:p-5 space-y-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
            Launch Readiness Agent Mesh
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Validates storage, backend, middleware, and frontend with coordinated agents and a launch gate.
          </p>
        </div>

        <label className="block text-xs font-semibold">
          Launch mission
          <textarea
            value={launchMission}
            onChange={(e) => setLaunchMission(e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
            placeholder="Describe launch intent and quality bar."
          />
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="flex items-center gap-2 rounded-xl border p-3 text-xs font-medium">
            <input
              type="checkbox"
              checked={launchStrictMode}
              onChange={(e) => setLaunchStrictMode(e.target.checked)}
            />
            Strict launch gate (blocks on critical findings)
          </label>
          <label className="flex items-center gap-2 rounded-xl border p-3 text-xs font-medium">
            <input
              type="checkbox"
              checked={launchSmokeTest}
              onChange={(e) => setLaunchSmokeTest(e.target.checked)}
            />
            Run orchestration smoke test during validation
          </label>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleRunLaunchReadiness}
            disabled={runningLaunchReadiness || !launchMission.trim()}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground disabled:opacity-60"
          >
            {runningLaunchReadiness ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            Run launch readiness mesh
          </button>
          <span className="text-xs text-muted-foreground">
            Generates blockers, recommendations, and per-layer readiness scores.
          </span>
        </div>

        {launchReadinessError && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {launchReadinessError}
          </div>
        )}

        {launchReadiness && (
          <div className="space-y-3">
            <div className="rounded-xl border p-3">
              <p className="text-sm font-semibold">
                Launch status:{" "}
                <span className={launchReadiness.launch_ready ? "text-signal-green" : "text-destructive"}>
                  {launchReadiness.launch_ready ? "READY" : "NOT READY"}
                </span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Overall score:{" "}
                <span className="font-semibold text-foreground">{launchReadiness.overall_score}</span> · Strict mode:{" "}
                {launchReadiness.strict_mode ? "On" : "Off"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{launchReadiness.operator_summary}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {Object.entries(launchReadiness.agent_mesh.layer_rollup).map(([layer, score]) => (
                <div key={layer} className="rounded-lg border p-2">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">{layer}</p>
                  <p className="text-lg font-black mt-1">{score}</p>
                </div>
              ))}
            </div>

            <div className="rounded-xl border p-3">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground mb-2">
                Agent workflow timeline
              </p>
              <ol className="space-y-2">
                {launchReadiness.workflow_timeline.map((step, index) => (
                  <li key={step.step_id} className="flex gap-2">
                    <span
                      className={`text-xs font-bold mt-0.5 ${
                        step.status === "failed" ? "text-destructive" : "text-signal-green"
                      }`}
                    >
                      {index + 1}.
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{step.title}</p>
                      <p className="text-xs text-muted-foreground">{step.details}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {launchReadiness.blockers.length > 0 && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-destructive mb-2">
                  Launch blockers
                </p>
                <ul className="space-y-1 text-xs text-destructive">
                  {launchReadiness.blockers.map((blocker) => (
                    <li key={blocker}>• {blocker}</li>
                  ))}
                </ul>
              </div>
            )}

            {launchReadiness.recommendations.length > 0 && (
              <div className="rounded-xl border p-3">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground mb-2">
                  Recommended next actions
                </p>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  {launchReadiness.recommendations.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {showAdvancedWorkspace && (
        <section className="rounded-2xl border bg-card p-3">
          <Suspense
            fallback={
              <div className="w-full min-h-[360px] flex items-center justify-center rounded-lg border bg-background/50">
                <div className="text-xs text-muted-foreground">Loading Tech-Ops workspace…</div>
              </div>
            }
          >
            <TechOpsMicrofrontend path={microPath} title="Tech-Ops Add-on" />
          </Suspense>
        </section>
      )}
    </div>
  );
}

