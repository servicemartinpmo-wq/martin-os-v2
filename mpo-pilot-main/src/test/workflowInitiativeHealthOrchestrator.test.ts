import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import express from "express";
import request from "supertest";

type TableRows = Record<string, Array<Record<string, unknown>>>;
type TableSingles = Record<string, Record<string, unknown>>;

const tableRows: TableRows = {
  departments: [],
  initiatives: [{ id: "ini-1", status: "On Track" }],
  action_items: [],
  insights: [],
};

const tableSingles: TableSingles = {
  profiles: {
    id: "profile-1",
    organization_id: "org-1",
    user_name: "Test User",
  },
};

vi.mock("../../server/authBridge", () => ({
  requireApiAuth: (req: express.Request, _res: express.Response, next: express.NextFunction) => {
    (req as unknown as { authProfileId?: string }).authProfileId = "profile-1";
    next();
  },
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    from: (tableName: string) => {
      const rows = tableRows[tableName] ?? [];
      const single = tableSingles[tableName] ?? rows[0] ?? null;
      const chain = {
        select: vi.fn(() => chain),
        eq: vi.fn(() => chain),
        order: vi.fn(async () => ({ data: rows, error: null })),
        or: vi.fn(async () => ({ data: rows, error: null })),
        in: vi.fn(async () => ({ data: rows, error: null })),
        single: vi.fn(async () => ({ data: single, error: null })),
        upsert: vi.fn(async () => ({ data: null, error: null })),
      };
      return chain;
    },
  }),
}));

describe("workflow run route - initiative orchestrator path", () => {
  const originalEnv = { ...process.env };
  let fetchSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.resetModules();
    process.env.SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_ANON_KEY = "anon-key";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role-key";
    fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          run_id: "run-1",
          state: "completed",
          workflow_run_id: "wf-run-1",
          signals_emitted: 1,
          diagnostics_created: 1,
          recommendations_created: 1,
          actions_created: 1,
          health_score: {
            score: 82,
            ops_score: 80,
            revenue_score: 79,
            product_score: 85,
            team_score: 81,
          },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );
  });

  afterEach(() => {
    fetchSpy.mockRestore();
    process.env = { ...originalEnv };
  });

  it("routes organizational health workflow IDs to initiative-health-orchestrator", async () => {
    const workflowRoutes = (await import("../../server/workflowRoutes")).default;
    const app = express();
    app.use(express.json());
    app.use(workflowRoutes);

    const response = await request(app)
      .post("/api/workflows/run")
      .send({ workflowId: "w086", deployTarget: "Diagnostics" });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.mode).toBe("initiative_health_orchestrator");
    expect(response.body.initiativeId).toBe("ini-1");

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [url, options] = fetchSpy.mock.calls[0] as [string, RequestInit];
    expect(url).toContain("/functions/v1/initiative-health-orchestrator");
    const payload = JSON.parse(String(options.body));
    expect(payload.profile_id).toBe("profile-1");
    expect(payload.initiative_id).toBe("ini-1");
    expect(payload.workflow_key).toBe("wf_pmo_035_initiative_health_diagnostics");
    expect(options.headers).toMatchObject({
      "x-idempotency-key": payload.request_id,
    });
  });
});
