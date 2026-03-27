import { randomUUID } from "crypto";
import { Router } from "express";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireApiAuth, resolveRequestIdentity } from "./authBridge";

type SupportTier = 1 | 2 | 3 | 4 | 5;
type ProviderTarget = "auto" | "gemini" | "chatgpt" | "cursor" | "autonomous";
type SelectedProvider = "gemini" | "chatgpt" | "cursor" | "autonomous";

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

export default router;
