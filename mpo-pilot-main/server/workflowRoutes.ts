import { Router, Request, Response, RequestHandler } from "express";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

import type { CompanyProfile } from "../src/lib/companyStore";
import type { EngineDataSnapshot } from "../src/lib/engine/runtimeData";
import { runFullEngineWithProfileAndData } from "../src/lib/engine/systemChains";

// Note: server routes avoid frontend path aliases in runtime. This import works only
// if TS path mapping is enabled for the server build. If it fails, replace with
// the appropriate relative import for CompanyProfile.

const router = Router();

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

function getAdminClient() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return null;
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function getSessionProfileId(req: Request): string | null {
  const user = (req as any).user as { claims?: { sub?: string } } | undefined;
  const profileId = user?.claims?.sub;
  if (!profileId) return null;
  return profileId;
}

const requireAuth: RequestHandler = (req, res, next) => {
  const profileId = getSessionProfileId(req);
  if (!profileId) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }
  // @ts-expect-error attach for convenience
  req.profileId = profileId;
  next();
};

function mapDbProfileToCompanyProfile(raw: any): CompanyProfile {
  return {
    userName: raw?.user_name ?? "",
    orgName: raw?.org_name ?? "",
    orgType: raw?.org_type ?? "",
    industry: raw?.industry ?? "",
    teamSize: raw?.team_size != null ? String(raw.team_size) : "",
    revenueRange: raw?.revenue_range ?? "",
    currentState: raw?.current_state ?? "",
    futureState: raw?.future_state ?? "",
    departments: raw?.departments ?? [],
    hasSops: raw?.has_sops ?? false,
    accentHue: raw?.accent_hue ?? 210,
    font: (raw?.font ?? "inter") as CompanyProfile["font"],
    density: (raw?.density ?? "comfortable") as CompanyProfile["density"],
    fontSize: (raw?.font_size ?? "medium") as CompanyProfile["fontSize"],
    analyticsEnabled: true,
    onboardingComplete: raw?.onboarding_complete ?? false,
  };
}

function mapSignalSeverityToUrgency(severity: string): number {
  if (severity === "Critical") return 96;
  if (severity === "High") return 80;
  if (severity === "Medium") return 60;
  return 30;
}

router.post("/api/workflows/run", requireAuth, async (req, res) => {
  try {
    const admin = getAdminClient();
    if (!admin) return res.status(500).json({ error: "Supabase admin client not configured" });

    const profileId = (req as any).profileId as string;
    const { workflowId, deployTarget, triggerEvent } = (req.body ?? {}) as {
      workflowId?: string;
      deployTarget?: string;
      triggerEvent?: any;
    };

    // Load profile + org snapshot from Supabase
    const { data: profileRaw, error: profileErr } = await admin
      .from("profiles")
      .select("*")
      .eq("id", profileId)
      .single();
    if (profileErr) return res.status(400).json({ error: profileErr.message });

    const companyProfile = mapDbProfileToCompanyProfile(profileRaw);

    const [{ data: departments }, { data: initiatives }, { data: actionItems }, { data: insights }] =
      await Promise.all([
        admin.from("departments").select("*").eq("profile_id", profileId).order("name"),
        admin.from("initiatives").select("*").eq("profile_id", profileId).order("priority_score", { ascending: false } as any),
        admin
          .from("action_items")
          .select("*")
          .or(`user_id.eq.${profileId},owner_id.eq.${profileId},assigned_to.eq.${profileId}`),
        admin.from("insights").select("*").eq("profile_id", profileId).order("executive_priority_score", { ascending: false } as any),
      ]);

    const snapshot: EngineDataSnapshot = {
      departments: (departments ?? []).map((d: any) => ({
        id: d.id,
        name: d.name,
        head: d.head,
        headcount: d.headcount,
        capacityUsed: d.capacity_used,
        riskScore: d.risk_score,
        executionHealth: d.execution_health,
        maturityScore: d.maturity_score,
        maturityTier: d.maturity_tier,
        activeInitiatives: d.active_initiatives,
        blockedTasks: d.blocked_tasks,
        signal: d.signal,
        keyKPIs: d.key_kpis,
        coreResponsibilities: d.core_responsibilities,
        keyFunctions: d.key_functions,
        authorityLevel: d.authority_level,
        sopAdherence: d.sop_adherence,
        decisionRights: d.decision_rights,
        frameworks: d.frameworks,
      })) as any,
      initiatives: (initiatives ?? []).map((i: any) => ({
        id: i.id,
        name: i.name,
        department: i.department,
        category: i.category,
        owner: i.owner,
        executiveOwner: i.executive_owner,
        strategicPillar: i.strategic_pillar,
        status: i.status,
        healthStatus: i.health_status,
        priorityScore: i.priority_score,
        strategicAlignment: i.strategic_alignment,
        dependencyRisk: i.dependency_risk,
        estimatedImpact: i.estimated_impact,
        budget: i.budget,
        budgetUsed: i.budget_used,
        startDate: i.start_date,
        targetDate: i.target_date,
        completionPct: i.completion_pct,
        signal: i.signal,
        frameworks: i.frameworks,
        dependencies: i.dependencies,
        description: i.description,
        kpis: i.kpis,
        risks: i.risks,
        raci: i.raci,
      })) as any,
      actionItems: (actionItems ?? []).map((a: any) => ({
        id: a.id,
        title: a.title,
        initiativeId: a.initiative_id,
        assignedTo: a.assigned_to ?? a.owner_id,
        dueDate: a.due_date,
        status: a.status,
        priority: a.priority,
        description: a.description,
        completedDate: a.completed_at ?? undefined,
      })) as any,
      insights: (insights ?? []).map((ins: any) => ({
        id: ins.id,
        type: ins.type,
        department: ins.department,
        situation: ins.situation,
        diagnosis: ins.diagnosis,
        recommendation: ins.recommendation,
        systemRemedy: ins.system_remedy,
        executivePriorityScore: ins.executive_priority_score,
        strategicImpact: ins.strategic_impact,
        urgency: ins.urgency,
        operationalRisk: ins.operational_risk,
        leverage: ins.leverage,
        framework: ins.framework,
        signal: ins.signal,
        createdAt: ins.created_at,
      })) as any,
    };

    // Create workflow run record (best-effort; schema may vary)
    const workflowRunId = randomUUID();
    const runInsert = {
      id: workflowRunId,
      status: "running",
      started_at: new Date().toISOString(),
      state: "running",
      trigger_event: { workflowId: workflowId ?? null, deployTarget: deployTarget ?? null, triggerEvent: triggerEvent ?? null },
      workflow_template_id: null,
      organization_id: null,
    };

    await admin.from("workflow_runs").upsert(runInsert as any, { onConflict: "id" });

    const engineState = runFullEngineWithProfileAndData(companyProfile, snapshot);

    // Persist: action_items + insights + departments (MVP focus)
    const recById = new Map(engineState.recommendations.map(r => [r.id, r]));
    const insightById = new Map(snapshot.insights.map(i => [i.id, i]));
    const diagBySignalId = new Map(engineState.diagnoses.map(d => [d.signalId, d]));
    const deptById = new Map(snapshot.departments.map(d => [d.id, d]));
    const initiativeById = new Map(snapshot.initiatives.map(i => [i.id, i]));
    const recBySignalId = new Map<string, typeof engineState.recommendations[number]>();
    for (const r of engineState.recommendations) {
      // Keep only the highest priority recommendation per signal
      if (!recBySignalId.has(r.signalId)) {
        recBySignalId.set(r.signalId, r);
      } else {
        const cur = recBySignalId.get(r.signalId)!;
        const pr = (p: string) => (p === "Immediate" ? 4 : p === "This Week" ? 3 : p === "This Month" ? 2 : 1);
        if (pr(r.priority) > pr(cur.priority)) recBySignalId.set(r.signalId, r);
      }
    }

    const now = new Date();

    // Action items (upsert by deterministic id)
    const actionIds = engineState.generatedActions.map(a => a.id);
    const { data: existingActions } = await admin
      .from("action_items")
      .select("id,status")
      .in("id", actionIds);
    const existingActionStatus = new Map((existingActions ?? []).map((a: any) => [a.id, a.status]));

    const actionUpserts = engineState.generatedActions.map(a => {
      const rec = recById.get(a.recommendationId);
      const priority =
        rec?.priority === "Immediate" || rec?.priority === "This Week" ? "High" :
        rec?.priority === "This Month" ? "Medium" :
        "Low";
      const priorityScore =
        rec?.priority === "Immediate" ? 90 :
        rec?.priority === "This Week" ? 70 :
        rec?.priority === "This Month" ? 55 :
        40;

      const existingStatus = existingActionStatus.get(a.id);
      const status = existingStatus === "Completed" ? "Completed" : "In Progress";

      return {
        id: a.id,
        user_id: profileId,
        title: a.title,
        initiative_id: a.outputModule === "Initiatives" ? null : null,
        assigned_to: a.assignedTo,
        due_date: a.dueDate,
        status,
        priority,
        priority_score: priorityScore,
        description: rec?.action ?? "",
      } as any;
    });

    await admin.from("action_items").upsert(actionUpserts as any, { onConflict: "id" });

    // Insights (upsert; idempotent by deterministic IDs)
    const INSIGHT_TYPES = new Set([
      "Risk Escalation",
      "Strategic Misalignment",
      "Capacity Constraint",
      "Dependency Bottleneck",
      "Performance Anomaly",
      "Execution Delay",
    ]);

    const insightSignals = engineState.signals.filter(sig => INSIGHT_TYPES.has(sig.category));
    const insightUpserts = insightSignals.map(sig => {
      // Update existing insight when it comes from an existing insight row; otherwise create a new deterministic one.
      const fromExistingInsight =
        sig.category === "Strategic Misalignment" ||
        sig.category === "Dependency Bottleneck" ||
        sig.category === "Performance Anomaly" ||
        sig.category === "Risk Escalation";

      const insightId = fromExistingInsight ? String(sig.sourceId) : `ins-${sig.id}`;

      const existing = insightById.get(insightId);
      const diag = diagBySignalId.get(sig.id);
      const rec = recBySignalId.get(sig.id);
      const department =
        existing?.department ??
        deptById.get(String(sig.sourceId))?.name ??
        initiativeById.get(String(sig.sourceId))?.department ??
        "General";

      return {
        id: insightId,
        profile_id: profileId,
        type: sig.category,
        department,
        situation: sig.description,
        diagnosis: diag?.rootCauseDescription ?? existing?.diagnosis ?? "",
        recommendation: rec?.action ?? existing?.recommendation ?? "",
        system_remedy: rec?.behavioralInsight ?? existing?.systemRemedy ?? "",
        executive_priority_score: sig.score,
        strategic_impact: sig.score,
        urgency: mapSignalSeverityToUrgency(sig.severity),
        operational_risk: sig.score,
        leverage: 50,
        framework: (sig.recommendedFrameworks?.includes("toc")
          ? "TOC"
          : sig.recommendedFrameworks?.includes("lean")
            ? "Lean"
            : sig.recommendedFrameworks?.includes("bsc")
              ? "BSC"
              : sig.recommendedFrameworks?.includes("okr")
                ? "OKR"
                : sig.recommendedFrameworks?.includes("sixSigmaDMAIC") || sig.recommendedFrameworks?.includes("sixSigma")
                  ? "Six Sigma"
                  : "TOC"),
        signal: sig.level,
        created_at: existing?.createdAt ?? new Date(sig.triggeredAt).toISOString(),
      } as any;
    });

    await admin.from("insights").upsert(insightUpserts as any, { onConflict: "id" });

    // Departments: update maturity_score + maturity_tier
    const deptUpserts = engineState.maturityScores.map(ms => ({
      id: ms.departmentId,
      profile_id: profileId,
      maturity_score: ms.overall,
      maturity_tier: ms.tier,
    }));
    await admin.from("departments").upsert(deptUpserts as any, { onConflict: "id" });

    // Update workflow run record to complete
    await admin.from("workflow_runs").upsert({
      id: workflowRunId,
      status: "complete",
      finished_at: new Date().toISOString(),
      state: "complete",
      result: engineState as any,
    } as any, { onConflict: "id" });

    return res.json({
      success: true,
      workflowRunId,
      actionItemsUpserted: actionUpserts.length,
      insightsUpserted: insightUpserts.length,
      departmentsUpdated: deptUpserts.length,
    });
  } catch (err: any) {
    console.error("[Workflows] run error:", err?.message ?? err);
    return res.status(500).json({ error: err instanceof Error ? err.message : "Workflow run failed" });
  }
});

export default router;

