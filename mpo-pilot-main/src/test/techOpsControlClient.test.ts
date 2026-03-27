import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  fetchTechOpsCapabilities,
  runTechOpsOrchestration,
  createTechOpsTeamViewerSession,
  runTechOpsLaunchReadiness,
} from "@/lib/techOpsControlClient";

describe("techOpsControlClient", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("loads capabilities from middleware api", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          backend: { supabase: true, middleware: true },
          providers: { gemini: true, chatgpt: false, cursor: true, autonomous: true },
          remote_support: { teamviewer: true, teamviewer_url: "https://example.com/tv" },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );

    const result = await fetchTechOpsCapabilities();
    expect(result.backend.supabase).toBe(true);
    expect(result.providers.gemini).toBe(true);
    expect(result.providers.chatgpt).toBe(false);
  });

  it("posts orchestration payload and returns parsed result", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          ok: true,
          request_id: "req-123",
          support_tier: 5,
          support_tier_label: "Tier 5 — Critical incident command",
          selected_provider: "autonomous",
          provider_chain: ["supabase", "middleware", "cursor", "gemini", "chatgpt", "autonomous"],
          runbook: ["a", "b"],
          backend: { supabase_connected: true, brain_invocation_error: null },
          brain_run: null,
          teamviewer: null,
          app_builder: null,
          app_builder_denied_reason: null,
          operator_summary: "ok",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );

    const result = await runTechOpsOrchestration({
      prompt: "incident",
      supportTier: 5,
      providerTarget: "autonomous",
      enableAutonomousAgents: true,
      requireTeamViewer: false,
      internalAppBuilder: {
        enabled: false,
        internalUseConfirmed: false,
      },
    });

    expect(result.ok).toBe(true);
    expect(result.selected_provider).toBe("autonomous");
  });

  it("throws error when api responds non-2xx", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({ error: "Authentication required" }),
        { status: 401, headers: { "Content-Type": "application/json" } },
      ),
    );

    await expect(createTechOpsTeamViewerSession("help")).rejects.toThrow(
      /Authentication required/i,
    );
  });

  it("runs launch readiness and returns mesh summary", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          ok: true,
          request_id: "launch-req",
          mission: "launch",
          strict_mode: true,
          launch_ready: true,
          overall_score: 91,
          selected_provider: "cursor",
          support_tier: 4,
          orchestration_smoke_test: {
            invoked: true,
            status: "pass",
            message: "Smoke test succeeded",
            run: {},
          },
          agent_mesh: {
            topology: "multi_agent_mesh_v1",
            layer_rollup: { storage: 95, backend: 90, middleware: 88, frontend: 91 },
            agents: [],
          },
          workflow_timeline: [],
          blockers: [],
          recommendations: [],
          operator_summary: "ready",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );

    const result = await runTechOpsLaunchReadiness({
      mission: "launch",
      strictMode: true,
      runOrchestrationSmokeTest: true,
      supportTier: 4,
      providerTarget: "cursor",
      enableAutonomousAgents: true,
    });

    expect(result.ok).toBe(true);
    expect(result.launch_ready).toBe(true);
    expect(result.agent_mesh.layer_rollup.backend).toBe(90);
  });
});
