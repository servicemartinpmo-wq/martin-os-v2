import { randomUUID } from "crypto";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { Router } from "express";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireApiAuth, resolveRequestIdentity } from "./authBridge";

type SupportTier = 1 | 2 | 3 | 4 | 5;
type ProviderTarget = "auto" | "gemini" | "chatgpt" | "cursor" | "autonomous";
type SelectedProvider = "gemini" | "chatgpt" | "cursor" | "autonomous";
type AgentLayer = "storage" | "backend" | "middleware" | "frontend";
type AgentCheckStatus = "pass" | "warn" | "fail";
type AgentStatus = "healthy" | "degraded" | "critical";

type AgentCheck = {
  check_name: string;
  status: AgentCheckStatus;
  message: string;
  remediation: string | null;
};

type AgentReport = {
  agent_id: string;
  layer: AgentLayer;
  role: string;
  status: AgentStatus;
  score: number;
  checks: AgentCheck[];
  meta?: Record<string, unknown>;
};

const router = Router();

const SUPPORT_TIER_LABELS: Record<SupportTier, string> = {
  1: "Tier 1 — Intake & scripted troubleshooting",
  2: "Tier 2 — Product specialist diagnostics",
  3: "Tier 3 — Engineering-assisted remediation",
  4: "Tier 4 — Senior engineer / architect escalation",
  5: "Tier 5 — Critical incident command",
};

const SupportRequestSchema = z.object({
  prompt: z.string().min(5),
  supportTier: z.number().int().min(1).max(5),
  providerTarget: z
    .enum(["auto", "gemini", "chatgpt", "cursor", "autonomous"])
    .default("auto"),
  enableAutonomousAgents: z.boolean().default(false),
  requireTeamViewer: z.boolean().default(false),
  internalAppBuilder: z
    .object({
      enabled: z.boolean().default(false),
      summary: z.string().optional(),
      targetUsers: z.string().optional(),
      preferredStack: z.string().optional(),
      internalUseConfirmed: z.boolean().default(false),
    })
    .optional(),
});

const LaunchReadinessRequestSchema = z.object({
  mission: z
    .string()
    .min(5)
    .default("Validate launch readiness across storage, backend, middleware, and frontend."),
  strictMode: z.boolean().default(true),
  runOrchestrationSmokeTest: z.boolean().default(true),
  supportTier: z.number().int().min(1).max(5).default(4),
  providerTarget: z
    .enum(["auto", "gemini", "chatgpt", "cursor", "autonomous"])
    .default("auto"),
  enableAutonomousAgents: z.boolean().default(true),
});

function toSupportTier(value: number): SupportTier {
  if (value <= 1) return 1;
  if (value === 2) return 2;
  if (value === 3) return 3;
  if (value === 4) return 4;
  return 5;
}

function selectProvider(
  supportTier: SupportTier,
  providerTarget: ProviderTarget,
  enableAutonomousAgents: boolean,
): SelectedProvider {
  if (providerTarget !== "auto") {
    if (providerTarget === "autonomous") {
      return enableAutonomousAgents ? "autonomous" : "cursor";
    }
    return providerTarget;
  }
  if (enableAutonomousAgents && supportTier >= 5) return "autonomous";
  if (supportTier >= 4) return "cursor";
  if (supportTier >= 3) return "chatgpt";
  return "gemini";
}

function buildTierRunbook(supportTier: SupportTier): string[] {
  if (supportTier === 1) {
    return [
      "Collect symptom + timestamp + impacted user count.",
      "Run scripted health checks against API, auth, and storage.",
      "Apply low-risk known fixes from approved playbooks.",
      "Escalate to Tier 2 if issue persists for more than 15 minutes.",
    ];
  }
  if (supportTier === 2) {
    return [
      "Correlate runtime signals with deployment + config history.",
      "Validate integration state across Supabase and middleware services.",
      "Prepare reproducible steps and fallback workaround for operators.",
      "Escalate to Tier 3 if customer-facing degradation continues.",
    ];
  }
  if (supportTier === 3) {
    return [
      "Execute engineering diagnostics and isolate failing component.",
      "Trigger guarded remediation workflow and verify blast radius.",
      "Publish operator-ready incident summary in plain language.",
      "Escalate to Tier 4 for architecture-level defects.",
    ];
  }
  if (supportTier === 4) {
    return [
      "Lead cross-service deep dive with architecture-level ownership.",
      "Approve targeted hotfix plan and rollback strategy.",
      "Coordinate TeamViewer handoff for guided operator execution.",
      "Escalate to Tier 5 if high-severity business continuity risk remains.",
    ];
  }
  return [
    "Activate critical incident command and assign ownership matrix.",
    "Run autonomous + senior-engineer collaboration workflow under guardrails.",
    "Stabilize service first, then execute root-cause and prevention work.",
    "Deliver final executive incident report and post-incident tasks.",
  ];
}

function getSupabaseAdminClient() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  if (!supabaseUrl || !serviceRoleKey) return null;
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function buildTeamViewerSession(identity: { profileId: string; email?: string }, prompt: string) {
  const baseUrl =
    process.env.TEAMVIEWER_QUICKSUPPORT_URL || "https://get.teamviewer.com/quicksupport";
  const sessionCode = randomUUID().slice(0, 8).toUpperCase();
  return {
    required: true,
    session_code: sessionCode,
    session_url: `${baseUrl}?session=${sessionCode}`,
    handoff_note: `Operator handoff prepared for ${identity.email ?? identity.profileId}.`,
    operator_script: `Open TeamViewer, provide session code ${sessionCode}, and follow guided steps tied to: "${prompt.slice(
      0,
      120,
    )}".`,
  };
}

function isInternalBuilderAllowed(args: {
  internalUseConfirmed: boolean;
  identity: { profileId: string; email?: string };
}): boolean {
  if (args.internalUseConfirmed) return true;
  const allowlistRaw = process.env.INTERNAL_BUILDER_ALLOWLIST || "";
  if (!allowlistRaw.trim()) return false;
  const allowlist = new Set(
    allowlistRaw
      .split(",")
      .map((x) => x.trim().toLowerCase())
      .filter(Boolean),
  );
  const email = (args.identity.email ?? "").toLowerCase();
  return email ? allowlist.has(email) : false;
}

function buildInternalAppBuilderPlan(input: {
  summary: string;
  targetUsers: string;
  preferredStack: string;
  provider: SelectedProvider;
}) {
  return {
    internal_only: true,
    execution_mode: "guarded_internal_builder",
    stack: input.preferredStack,
    target_users: input.targetUsers,
    feature_summary: input.summary,
    phases: [
      "Spec validation and architecture sketch",
      "Scaffold generation (Replit-like internal workspace)",
      "Iterative build loop with autonomous agent checkpoints",
      "QA + security checks + deployment gate",
    ],
    suggested_actions: [
      {
        tool_name: "plan_feature_bundle",
        operator_instruction: "Create scoped feature bundle with acceptance criteria.",
      },
      {
        tool_name: "execute_workflow_bundle",
        operator_instruction:
          "Run internal build workflow with engineer-in-the-loop approvals.",
      },
      {
        tool_name: "deploy_release_guarded",
        operator_instruction: "Deploy to internal environment only after checks pass.",
      },
    ],
    provider: input.provider,
  };
}

function resolveRepoRoot() {
  const cwd = process.cwd();
  if (existsSync(join(cwd, "src")) && existsSync(join(cwd, "server"))) return cwd;
  const parent = join(cwd, "..");
  if (existsSync(join(parent, "src")) && existsSync(join(parent, "server"))) return parent;
  return cwd;
}

function hasEnv(name: string) {
  const value = process.env[name];
  return typeof value === "string" && value.trim().length > 0;
}

function fileContains(path: string, needle: string) {
  if (!existsSync(path)) return false;
  try {
    const raw = readFileSync(path, "utf8");
    return raw.includes(needle);
  } catch {
    return false;
  }
}

function summarizeAgent(checks: AgentCheck[]): { status: AgentStatus; score: number } {
  const weight: Record<AgentCheckStatus, number> = {
    pass: 100,
    warn: 70,
    fail: 20,
  };
  const score =
    checks.length > 0
      ? Math.round(checks.reduce((sum, check) => sum + weight[check.status], 0) / checks.length)
      : 0;
  const failCount = checks.filter((check) => check.status === "fail").length;
  const warnCount = checks.filter((check) => check.status === "warn").length;
  if (failCount > 0 || score < 65) return { status: "critical", score };
  if (warnCount > 0 || score < 90) return { status: "degraded", score };
  return { status: "healthy", score };
}

function buildStorageAgentReport(args: {
  admin: ReturnType<typeof getSupabaseAdminClient>;
  repoRoot: string;
}): AgentReport {
  const checks: AgentCheck[] = [];
  checks.push({
    check_name: "supabase_url_configured",
    status: hasEnv("SUPABASE_URL") || hasEnv("VITE_SUPABASE_URL") ? "pass" : "fail",
    message:
      hasEnv("SUPABASE_URL") || hasEnv("VITE_SUPABASE_URL")
        ? "Supabase URL configured."
        : "Supabase URL is missing.",
    remediation: hasEnv("SUPABASE_URL") || hasEnv("VITE_SUPABASE_URL")
      ? null
      : "Set SUPABASE_URL (or VITE_SUPABASE_URL) in the middleware environment.",
  });
  checks.push({
    check_name: "supabase_service_role_configured",
    status: hasEnv("SUPABASE_SERVICE_ROLE_KEY") ? "pass" : "fail",
    message: hasEnv("SUPABASE_SERVICE_ROLE_KEY")
      ? "Supabase service role key configured."
      : "Supabase service role key is missing.",
    remediation: hasEnv("SUPABASE_SERVICE_ROLE_KEY")
      ? null
      : "Set SUPABASE_SERVICE_ROLE_KEY so middleware can invoke privileged functions.",
  });
  checks.push({
    check_name: "brain_migration_foundation_present",
    status: existsSync(join(args.repoRoot, "supabase", "migrations", "20260326000001_brain_layer_foundation.sql"))
      ? "pass"
      : "warn",
    message: existsSync(join(args.repoRoot, "supabase", "migrations", "20260326000001_brain_layer_foundation.sql"))
      ? "Brain layer foundation migration is present."
      : "Brain layer foundation migration file not found in repository.",
    remediation: existsSync(join(args.repoRoot, "supabase", "migrations", "20260326000001_brain_layer_foundation.sql"))
      ? null
      : "Commit the required brain foundation migration before launch.",
  });
  checks.push({
    check_name: "domain_migration_present",
    status: existsSync(join(args.repoRoot, "supabase", "migrations", "20260327000001_complete_brain_layer.sql"))
      ? "pass"
      : "warn",
    message: existsSync(join(args.repoRoot, "supabase", "migrations", "20260327000001_complete_brain_layer.sql"))
      ? "Domain-ready migration is present."
      : "Domain migration file is missing.",
    remediation: existsSync(join(args.repoRoot, "supabase", "migrations", "20260327000001_complete_brain_layer.sql"))
      ? null
      : "Add the domain migration if cross-domain brain tables are required at launch.",
  });
  checks.push({
    check_name: "admin_client_available",
    status: args.admin ? "pass" : "fail",
    message: args.admin
      ? "Supabase admin client initialized."
      : "Supabase admin client cannot be initialized.",
    remediation: args.admin
      ? null
      : "Configure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY together.",
  });
  const summary = summarizeAgent(checks);
  return {
    agent_id: "storage_sentinel",
    layer: "storage",
    role: "Storage integrity and migration guard",
    status: summary.status,
    score: summary.score,
    checks,
  };
}

function buildBackendAgentReport(args: {
  repoRoot: string;
  smokeStatus: AgentCheckStatus;
  smokeMessage: string;
}): AgentReport {
  const checks: AgentCheck[] = [];
  const routesFile = join(args.repoRoot, "server", "techOpsControlRoutes.ts");
  checks.push({
    check_name: "control_plane_routes_exist",
    status: existsSync(routesFile) ? "pass" : "fail",
    message: existsSync(routesFile)
      ? "Tech-Ops control plane routes exist."
      : "Tech-Ops control plane routes are missing.",
    remediation: existsSync(routesFile) ? null : "Restore server/techOpsControlRoutes.ts.",
  });
  checks.push({
    check_name: "workflow_route_exists",
    status: existsSync(join(args.repoRoot, "server", "workflowRoutes.ts")) ? "pass" : "fail",
    message: existsSync(join(args.repoRoot, "server", "workflowRoutes.ts"))
      ? "Workflow route exists."
      : "Workflow route is missing.",
    remediation: existsSync(join(args.repoRoot, "server", "workflowRoutes.ts"))
      ? null
      : "Restore server/workflowRoutes.ts.",
  });
  checks.push({
    check_name: "server_mounts_control_plane",
    status: fileContains(join(args.repoRoot, "server", "index.ts"), "app.use(techOpsControlRoutes);")
      ? "pass"
      : "fail",
    message: fileContains(join(args.repoRoot, "server", "index.ts"), "app.use(techOpsControlRoutes);")
      ? "Main server mounts Tech-Ops control routes."
      : "Main server does not mount Tech-Ops control routes.",
    remediation: fileContains(join(args.repoRoot, "server", "index.ts"), "app.use(techOpsControlRoutes);")
      ? null
      : "Mount techOpsControlRoutes in server/index.ts.",
  });
  checks.push({
    check_name: "orchestration_smoke_test",
    status: args.smokeStatus,
    message: args.smokeMessage,
    remediation: args.smokeStatus === "pass"
      ? null
      : "Verify Supabase function `orchestrate` is deployed and middleware has service role credentials.",
  });
  const summary = summarizeAgent(checks);
  return {
    agent_id: "backend_orchestrator",
    layer: "backend",
    role: "API + orchestration route integrity",
    status: summary.status,
    score: summary.score,
    checks,
  };
}

function buildMiddlewareAgentReport(args: { repoRoot: string; strictMode: boolean }): AgentReport {
  const checks: AgentCheck[] = [];
  const hasGemini = hasEnv("GEMINI_API_KEY");
  const hasOpenAi = hasEnv("OPENAI_API_KEY");
  checks.push({
    check_name: "provider_gemini_key",
    status: hasGemini ? "pass" : "warn",
    message: hasGemini ? "Gemini key configured." : "Gemini key not configured.",
    remediation: hasGemini ? null : "Set GEMINI_API_KEY to enable Gemini provider routing.",
  });
  checks.push({
    check_name: "provider_openai_key",
    status: hasOpenAi ? "pass" : "warn",
    message: hasOpenAi ? "OpenAI key configured." : "OpenAI key not configured.",
    remediation: hasOpenAi ? null : "Set OPENAI_API_KEY to enable ChatGPT provider routing.",
  });
  checks.push({
    check_name: "multi_provider_minimum",
    status: hasGemini || hasOpenAi ? "pass" : args.strictMode ? "fail" : "warn",
    message:
      hasGemini || hasOpenAi
        ? "At least one external model provider is configured."
        : "No external model provider configured.",
    remediation:
      hasGemini || hasOpenAi
        ? null
        : "Configure GEMINI_API_KEY and/or OPENAI_API_KEY before launch.",
  });
  checks.push({
    check_name: "brain_client_wrapper_exists",
    status: existsSync(join(args.repoRoot, "src", "lib", "brainClient.ts")) ? "pass" : "fail",
    message: existsSync(join(args.repoRoot, "src", "lib", "brainClient.ts"))
      ? "Frontend brain client wrapper exists."
      : "Frontend brain client wrapper is missing.",
    remediation: existsSync(join(args.repoRoot, "src", "lib", "brainClient.ts"))
      ? null
      : "Restore src/lib/brainClient.ts for stable middleware invocation from UI.",
  });
  checks.push({
    check_name: "edge_function_status_probe_available",
    status: existsSync(join(args.repoRoot, "supabase", "functions", "brain_status", "index.ts"))
      ? "pass"
      : "warn",
    message: existsSync(join(args.repoRoot, "supabase", "functions", "brain_status", "index.ts"))
      ? "brain_status edge function source exists."
      : "brain_status edge function source is missing.",
    remediation: existsSync(join(args.repoRoot, "supabase", "functions", "brain_status", "index.ts"))
      ? null
      : "Add brain_status function to improve runtime observability.",
  });
  const summary = summarizeAgent(checks);
  return {
    agent_id: "middleware_router",
    layer: "middleware",
    role: "Provider routing, edge orchestration, and integration guardrails",
    status: summary.status,
    score: summary.score,
    checks,
  };
}

function buildFrontendAgentReport(args: { repoRoot: string; strictMode: boolean }): AgentReport {
  const checks: AgentCheck[] = [];
  const techOpsPage = join(args.repoRoot, "src", "pages", "TechOpsAddOn.tsx");
  checks.push({
    check_name: "techops_page_exists",
    status: existsSync(techOpsPage) ? "pass" : "fail",
    message: existsSync(techOpsPage) ? "Tech-Ops page exists." : "Tech-Ops page is missing.",
    remediation: existsSync(techOpsPage) ? null : "Restore src/pages/TechOpsAddOn.tsx.",
  });
  checks.push({
    check_name: "techops_route_registered",
    status: fileContains(join(args.repoRoot, "src", "App.tsx"), "<Route path=\"/tech-ops/*\"")
      ? "pass"
      : "fail",
    message: fileContains(join(args.repoRoot, "src", "App.tsx"), "<Route path=\"/tech-ops/*\"")
      ? "Tech-Ops route is registered in app router."
      : "Tech-Ops route is not registered in app router.",
    remediation: fileContains(join(args.repoRoot, "src", "App.tsx"), "<Route path=\"/tech-ops/*\"")
      ? null
      : "Add /tech-ops route mapping in src/App.tsx.",
  });
  checks.push({
    check_name: "light_mode_sidebar_guard",
    status: fileContains(join(args.repoRoot, "src", "components", "AppLayout.tsx"), "mode-light-sidebar")
      ? "pass"
      : "warn",
    message: fileContains(join(args.repoRoot, "src", "components", "AppLayout.tsx"), "mode-light-sidebar")
      ? "Light-mode sidebar guard is present for non-creative modes."
      : "Light-mode sidebar guard missing for non-creative modes.",
    remediation: fileContains(join(args.repoRoot, "src", "components", "AppLayout.tsx"), "mode-light-sidebar")
      ? null
      : "Add non-creative light sidebar guard in AppLayout.",
  });
  checks.push({
    check_name: "creative_dark_guard",
    status: fileContains(join(args.repoRoot, "src", "index.css"), "[data-pmo-creative]")
      ? "pass"
      : "warn",
    message: fileContains(join(args.repoRoot, "src", "index.css"), "[data-pmo-creative]")
      ? "Creative dark-theme selector is present."
      : "Creative dark-theme selector is missing.",
    remediation: fileContains(join(args.repoRoot, "src", "index.css"), "[data-pmo-creative]")
      ? null
      : "Restore creative-specific dark mode selectors in src/index.css.",
  });
  checks.push({
    check_name: "techops_tests_present",
    status:
      existsSync(join(args.repoRoot, "src", "test", "techOpsAddOn.test.tsx")) &&
      existsSync(join(args.repoRoot, "src", "test", "techOpsControlClient.test.ts"))
        ? "pass"
        : args.strictMode
          ? "fail"
          : "warn",
    message:
      existsSync(join(args.repoRoot, "src", "test", "techOpsAddOn.test.tsx")) &&
      existsSync(join(args.repoRoot, "src", "test", "techOpsControlClient.test.ts"))
        ? "Focused Tech-Ops UI/client tests are present."
        : "Focused Tech-Ops tests are missing.",
    remediation:
      existsSync(join(args.repoRoot, "src", "test", "techOpsAddOn.test.tsx")) &&
      existsSync(join(args.repoRoot, "src", "test", "techOpsControlClient.test.ts"))
        ? null
        : "Add Tech-Ops UI + client tests before launch.",
  });
  const summary = summarizeAgent(checks);
  return {
    agent_id: "frontend_experience_guardian",
    layer: "frontend",
    role: "Launch UX consistency and control-center accessibility",
    status: summary.status,
    score: summary.score,
    checks,
  };
}

router.get("/api/techops/capabilities", requireApiAuth, (_req, res) => {
  const capabilities = {
    backend: {
      supabase: Boolean(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL),
      middleware: true,
    },
    providers: {
      gemini: Boolean(process.env.GEMINI_API_KEY),
      chatgpt: Boolean(process.env.OPENAI_API_KEY),
      cursor: true,
      autonomous: true,
    },
    remote_support: {
      teamviewer: true,
      teamviewer_url:
        process.env.TEAMVIEWER_QUICKSUPPORT_URL || "https://get.teamviewer.com/quicksupport",
    },
  };
  return res.json(capabilities);
});

router.post("/api/techops/teamviewer/session", requireApiAuth, async (req, res) => {
  const identity = await resolveRequestIdentity(req);
  if (!identity) {
    return res.status(401).json({ error: "Authentication required" });
  }
  const prompt = String(req.body?.prompt ?? "General support handoff");
  return res.json(buildTeamViewerSession(identity, prompt));
});

router.post("/api/techops/orchestrate", requireApiAuth, async (req, res) => {
  try {
    const identity = await resolveRequestIdentity(req);
    if (!identity) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const parsed = SupportRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: "Invalid payload",
        details: parsed.error.flatten(),
      });
    }

    const {
      prompt,
      supportTier: supportTierRaw,
      providerTarget,
      enableAutonomousAgents,
      requireTeamViewer,
      internalAppBuilder,
    } = parsed.data;

    const supportTier = toSupportTier(supportTierRaw);
    const selectedProvider = selectProvider(
      supportTier,
      providerTarget,
      enableAutonomousAgents,
    );
    const runbook = buildTierRunbook(supportTier);

    const orchestrationPrompt = [
      `[TECH_OPS_TIER]: ${supportTier}`,
      `[TECH_OPS_LABEL]: ${SUPPORT_TIER_LABELS[supportTier]}`,
      `[PROVIDER_SELECTED]: ${selectedProvider}`,
      `[AUTONOMOUS_ENABLED]: ${enableAutonomousAgents ? "yes" : "no"}`,
      `[TEAMVIEWER_REQUIRED]: ${requireTeamViewer ? "yes" : "no"}`,
      "",
      prompt,
    ].join("\n");

    const admin = getSupabaseAdminClient();
    let brainRun: Record<string, unknown> | null = null;
    let brainError: string | null = null;

    if (admin) {
      const requestId = randomUUID();
      const { data, error } = await admin.functions.invoke("orchestrate", {
        body: {
          request_id: requestId,
          profile_id: identity.profileId,
          input: orchestrationPrompt,
          started_at: new Date().toISOString(),
          actions: [
            {
              tool_name: "tech_ops_unified_orchestration",
              support_tier: supportTier,
              provider: selectedProvider,
            },
          ],
        },
        headers: {
          "x-idempotency-key": requestId,
        },
      });
      if (error) {
        brainError = error.message;
      } else {
        brainRun = (data as Record<string, unknown>) ?? null;
      }
    } else {
      brainError = "Supabase service role is not configured on the middleware server.";
    }

    let teamViewer = null;
    if (requireTeamViewer || supportTier >= 4) {
      teamViewer = buildTeamViewerSession(identity, prompt);
    }

    let appBuilderPlan: Record<string, unknown> | null = null;
    let appBuilderDeniedReason: string | null = null;
    if (internalAppBuilder?.enabled) {
      const allowed = isInternalBuilderAllowed({
        identity,
        internalUseConfirmed: internalAppBuilder.internalUseConfirmed,
      });
      if (!allowed) {
        appBuilderDeniedReason =
          "Internal app-building is restricted. Confirm internal use or add user to INTERNAL_BUILDER_ALLOWLIST.";
      } else {
        appBuilderPlan = buildInternalAppBuilderPlan({
          summary:
            internalAppBuilder.summary?.trim() ||
            "Internal app-building request from Tech-Ops support flow.",
          targetUsers: internalAppBuilder.targetUsers?.trim() || "Internal engineering and support teams",
          preferredStack: internalAppBuilder.preferredStack?.trim() || "TypeScript + Supabase + React",
          provider: selectedProvider,
        });
      }
    }

    return res.json({
      ok: true,
      request_id: randomUUID(),
      support_tier: supportTier,
      support_tier_label: SUPPORT_TIER_LABELS[supportTier],
      selected_provider: selectedProvider,
      provider_chain: ["supabase", "middleware", "cursor", "gemini", "chatgpt", "autonomous"],
      runbook,
      backend: {
        supabase_connected: Boolean(admin),
        brain_invocation_error: brainError,
      },
      brain_run: brainRun,
      teamviewer: teamViewer,
      app_builder: appBuilderPlan,
      app_builder_denied_reason: appBuilderDeniedReason,
      operator_summary:
        "Unified orchestration complete. Review runbook, provider routing, and optional handoff artifacts.",
    });
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Tech-Ops orchestration failed",
    });
  }
});

router.post("/api/techops/launch-readiness", requireApiAuth, async (req, res) => {
  try {
    const identity = await resolveRequestIdentity(req);
    if (!identity) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const parsed = LaunchReadinessRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: "Invalid payload",
        details: parsed.error.flatten(),
      });
    }

    const {
      mission,
      strictMode,
      runOrchestrationSmokeTest,
      supportTier: supportTierRaw,
      providerTarget,
      enableAutonomousAgents,
    } = parsed.data;
    const supportTier = toSupportTier(supportTierRaw);
    const selectedProvider = selectProvider(supportTier, providerTarget, enableAutonomousAgents);
    const repoRoot = resolveRepoRoot();
    const admin = getSupabaseAdminClient();

    const workflowTimeline: Array<{
      step_id: string;
      title: string;
      status: "completed" | "failed";
      started_at: string;
      ended_at: string;
      details: string;
    }> = [];

    const stepStarted = new Date().toISOString();
    const orchestrationPrompt = [
      "[LAUNCH_READINESS_SMOKE]: yes",
      `[TECH_OPS_TIER]: ${supportTier}`,
      `[PROVIDER_SELECTED]: ${selectedProvider}`,
      mission,
    ].join("\n");
    let smokeStatus: AgentCheckStatus = "warn";
    let smokeMessage = "Smoke test skipped.";
    let smokeRun: Record<string, unknown> | null = null;
    if (runOrchestrationSmokeTest) {
      if (!admin) {
        smokeStatus = strictMode ? "fail" : "warn";
        smokeMessage = "Smoke test skipped because Supabase admin client is unavailable.";
      } else {
        const requestId = randomUUID();
        const { data, error } = await admin.functions.invoke("orchestrate", {
          body: {
            request_id: requestId,
            profile_id: identity.profileId,
            input: orchestrationPrompt,
            started_at: new Date().toISOString(),
            actions: [
              {
                tool_name: "launch_readiness_smoke_test",
                support_tier: supportTier,
                provider: selectedProvider,
              },
            ],
          },
          headers: { "x-idempotency-key": requestId },
        });
        if (error) {
          smokeStatus = strictMode ? "fail" : "warn";
          smokeMessage = `Smoke test failed: ${error.message}`;
        } else {
          smokeStatus = "pass";
          smokeMessage = "Smoke test succeeded via orchestrate edge function.";
          smokeRun = (data as Record<string, unknown>) ?? null;
        }
      }
    }
    workflowTimeline.push({
      step_id: "smoke-test",
      title: "Orchestration smoke test",
      status: smokeStatus === "fail" ? "failed" : "completed",
      started_at: stepStarted,
      ended_at: new Date().toISOString(),
      details: smokeMessage,
    });

    const storageAgent = buildStorageAgentReport({ admin, repoRoot });
    workflowTimeline.push({
      step_id: "storage-agent",
      title: "Storage Sentinel validation",
      status: storageAgent.status === "critical" ? "failed" : "completed",
      started_at: new Date().toISOString(),
      ended_at: new Date().toISOString(),
      details: `Storage score ${storageAgent.score} (${storageAgent.status}).`,
    });

    const backendAgent = buildBackendAgentReport({
      repoRoot,
      smokeStatus,
      smokeMessage,
    });
    workflowTimeline.push({
      step_id: "backend-agent",
      title: "Backend Orchestrator validation",
      status: backendAgent.status === "critical" ? "failed" : "completed",
      started_at: new Date().toISOString(),
      ended_at: new Date().toISOString(),
      details: `Backend score ${backendAgent.score} (${backendAgent.status}).`,
    });

    const middlewareAgent = buildMiddlewareAgentReport({ repoRoot, strictMode });
    workflowTimeline.push({
      step_id: "middleware-agent",
      title: "Middleware Router validation",
      status: middlewareAgent.status === "critical" ? "failed" : "completed",
      started_at: new Date().toISOString(),
      ended_at: new Date().toISOString(),
      details: `Middleware score ${middlewareAgent.score} (${middlewareAgent.status}).`,
    });

    const frontendAgent = buildFrontendAgentReport({ repoRoot, strictMode });
    workflowTimeline.push({
      step_id: "frontend-agent",
      title: "Frontend Experience Guardian validation",
      status: frontendAgent.status === "critical" ? "failed" : "completed",
      started_at: new Date().toISOString(),
      ended_at: new Date().toISOString(),
      details: `Frontend score ${frontendAgent.score} (${frontendAgent.status}).`,
    });

    const reports = [storageAgent, backendAgent, middlewareAgent, frontendAgent];
    const overallScore = Math.round(
      reports.reduce((sum, report) => sum + report.score, 0) / reports.length,
    );
    const blockers = reports
      .flatMap((report) =>
        report.checks
          .filter((check) => check.status === "fail")
          .map((check) => `[${report.layer}] ${check.check_name}: ${check.message}`),
      );
    const launchReady = strictMode
      ? blockers.length === 0 && reports.every((report) => report.score >= 85)
      : blockers.length === 0 && overallScore >= 75;
    const recommendations = reports
      .flatMap((report) =>
        report.checks
          .filter((check) => check.status !== "pass" && check.remediation)
          .map((check) => check.remediation as string),
      )
      .filter((value, index, arr) => arr.indexOf(value) === index)
      .slice(0, 10);

    return res.json({
      ok: true,
      request_id: randomUUID(),
      mission,
      strict_mode: strictMode,
      launch_ready: launchReady,
      overall_score: overallScore,
      selected_provider: selectedProvider,
      support_tier: supportTier,
      orchestration_smoke_test: {
        invoked: runOrchestrationSmokeTest,
        status: smokeStatus,
        message: smokeMessage,
        run: smokeRun,
      },
      agent_mesh: {
        topology: "multi_agent_mesh_v1",
        layer_rollup: {
          storage: storageAgent.score,
          backend: backendAgent.score,
          middleware: middlewareAgent.score,
          frontend: frontendAgent.score,
        },
        agents: reports,
      },
      workflow_timeline: workflowTimeline,
      blockers,
      recommendations,
      operator_summary: launchReady
        ? "Launch readiness passed. Continue with deployment checklist and go-live."
        : "Launch readiness failed. Resolve blockers before production launch.",
    });
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Launch readiness evaluation failed",
    });
  }
});

export default router;
