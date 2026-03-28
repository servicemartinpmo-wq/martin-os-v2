import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import TechOpsAddOn from "@/pages/TechOpsAddOn";

vi.mock("@/components/TechOpsEmbed/TechOpsMicrofrontend", () => ({
  default: ({ path }: { path: string }) => <div data-testid="techops-microfrontend">micro:{path}</div>,
}));

describe("TechOpsAddOn page behaviors", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("keeps advanced workspace collapsed by default and toggles open", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes("/api/techops/capabilities")) {
        return new Response(
          JSON.stringify({
            backend: { supabase: true, middleware: true },
            providers: { gemini: true, chatgpt: true, cursor: true, autonomous: true },
            remote_support: { teamviewer: true, teamviewer_url: "https://example.com/teamviewer" },
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      }
      return new Response(JSON.stringify({}), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    });

    render(
      <MemoryRouter initialEntries={["/tech-ops"]}>
        <TechOpsAddOn />
      </MemoryRouter>,
    );

    expect(screen.queryByTestId("techops-microfrontend")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Open advanced workspace/i }));
    expect(await screen.findByTestId("techops-microfrontend")).toHaveTextContent("micro:/dashboard");
  });

  it("runs orchestration and renders tier/provider output", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes("/api/techops/capabilities")) {
        return new Response(
          JSON.stringify({
            backend: { supabase: true, middleware: true },
            providers: { gemini: true, chatgpt: true, cursor: true, autonomous: true },
            remote_support: { teamviewer: true, teamviewer_url: "https://example.com/teamviewer" },
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      }
      if (url.includes("/api/techops/orchestrate")) {
        return new Response(
          JSON.stringify({
            ok: true,
            request_id: "req-1",
            support_tier: 4,
            support_tier_label: "Tier 4 — Senior engineer / architect escalation",
            selected_provider: "cursor",
            provider_chain: ["supabase", "middleware", "cursor", "gemini", "chatgpt", "autonomous"],
            runbook: ["Step A", "Step B"],
            backend: { supabase_connected: true, brain_invocation_error: null },
            brain_run: {},
            teamviewer: {
              required: true,
              session_code: "ABC12345",
              session_url: "https://example.com/teamviewer?session=ABC12345",
              handoff_note: "handoff",
              operator_script: "operator script",
            },
            app_builder: null,
            app_builder_denied_reason: null,
            operator_summary: "done",
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      }
      if (url.includes("/api/techops/launch-readiness")) {
        return new Response(
          JSON.stringify({
            ok: true,
            request_id: "launch-1",
            mission: "launch",
            strict_mode: true,
            launch_ready: false,
            overall_score: 78,
            selected_provider: "cursor",
            support_tier: 4,
            orchestration_smoke_test: {
              invoked: true,
              status: "warn",
              message: "Smoke test skipped",
              run: null,
            },
            agent_mesh: {
              topology: "multi_agent_mesh_v1",
              layer_rollup: { storage: 90, backend: 80, middleware: 70, frontend: 72 },
              agents: [],
            },
            workflow_timeline: [
              {
                step_id: "storage-agent",
                title: "Storage Sentinel validation",
                status: "completed",
                started_at: new Date().toISOString(),
                ended_at: new Date().toISOString(),
                details: "Storage score 90.",
              },
            ],
            blockers: ["[backend] orchestration_smoke_test: Smoke test skipped"],
            recommendations: ["Set SUPABASE_SERVICE_ROLE_KEY."],
            operator_summary: "Launch readiness failed.",
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      }
      return new Response(JSON.stringify({}), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    });

    render(
      <MemoryRouter initialEntries={["/tech-ops"]}>
        <TechOpsAddOn />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText(/Support tier/i), { target: { value: "4" } });
    fireEvent.change(screen.getByLabelText(/Provider routing/i), { target: { value: "cursor" } });
    fireEvent.click(screen.getByRole("button", { name: /Run unified orchestration/i }));

    expect(await screen.findByText(/Tier 4 — Senior engineer \/ architect escalation/i)).toBeInTheDocument();
    expect(screen.getByText(/Selected provider:/i)).toBeInTheDocument();
    expect(screen.getByText(/Session code: ABC12345/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Run launch readiness mesh/i }));
    expect(await screen.findByText(/Launch status:/i)).toBeInTheDocument();
    expect(screen.getByText(/NOT READY/i)).toBeInTheDocument();
    expect(screen.getByText(/Launch blockers/i)).toBeInTheDocument();
  });
});

