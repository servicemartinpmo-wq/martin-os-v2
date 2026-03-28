import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import {
  clamp,
  handleCorsPreflight,
  jsonResponse,
  restInsert,
  restPatch,
  restSelect,
} from "../_shared/brain.ts";

type RecommendationLike = {
  id: string;
  request_id: string;
  workflow_run_id: string;
  signal_id: string;
  profile_id: string;
  organization_id: string | null;
  domain: "pmo_ops" | "tech_ops" | "miiddle";
  action_type: "quick_fix" | "structural" | "strategic";
  title: string;
  rationale: string;
  impact_score: number;
  effort_score: number;
  risk_reduction_score: number;
  expected_roi: number | null;
  time_to_impact_days: number | null;
  owner_role: string | null;
  owner_profile_id: string | null;
  auto_execute_eligible: boolean;
  confidence_score: number;
  status: "new" | "accepted" | "rejected" | "executing" | "completed";
};

function asNum(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function computeExecutionScore(rec: RecommendationLike): number {
  const confidence = Math.min(1, Math.max(0, asNum(rec.confidence_score)));
  const ownerCapacity = rec.owner_profile_id ? 1 : 0.5;
  const policySafety = rec.domain === "pmo_ops" ? 0.95 : 0.9;
  const timeSensitivity = Math.min(1, Math.max(0, 1 - (asNum(rec.time_to_impact_days, 7) / 14)));
  return (
    0.4 * confidence +
    0.3 * ownerCapacity +
    0.2 * policySafety +
    0.1 * timeSensitivity
  );
}

function canAutoExecute(rec: RecommendationLike, threshold: number): boolean {
  if (!rec.auto_execute_eligible) return false;
  if (asNum(rec.confidence_score) < 0.7) return false;
  if (!rec.owner_profile_id) return false;
  return computeExecutionScore(rec) >= threshold;
}

serve(async (req) => {
  try {
    const preflight = handleCorsPreflight(req);
    if (preflight) return preflight;

    const body = await req.json();
    const requestId = String(body?.request_id ?? "");
    const profileId = String(body?.profile_id ?? "");
    const workflowRunId = String(body?.workflow_run_id ?? "");
    const recommendation = body?.recommendation
      ? (body.recommendation as RecommendationLike)
      : null;
    const recommendationIds = Array.isArray(body?.recommendation_ids)
      ? body.recommendation_ids.map((x: unknown) => String(x)).filter(Boolean)
      : [];
    const autoExecuteThreshold = asNum(body?.auto_execute_threshold, 0.85);

    if (!requestId || !profileId || !workflowRunId) {
      return jsonResponse(
        { error: "request_id, profile_id, and workflow_run_id are required" },
        400,
      );
    }

    let effectiveRecommendation: RecommendationLike | null = recommendation;
    if (!effectiveRecommendation?.id && recommendationIds.length > 0) {
      const recRows = await restSelect(
        "public.ai_worker_recommendations",
        `id=in.(${recommendationIds.join(",")})&workflow_run_id=eq.${workflowRunId}&profile_id=eq.${profileId}&select=*`,
      );
      if (Array.isArray(recRows) && recRows.length > 0) {
        effectiveRecommendation = recRows[0] as RecommendationLike;
      }
    }
    if (!effectiveRecommendation?.id) {
      return jsonResponse(
        {
          request_id: requestId,
          workflow_run_id: workflowRunId,
          action_item_id: null,
          recommendation_id: null,
          auto_executed: false,
        },
      );
    }

    if (
      String(effectiveRecommendation.workflow_run_id) !== workflowRunId ||
      String(effectiveRecommendation.profile_id) !== profileId
    ) {
      return jsonResponse(
        { error: "Recommendation does not belong to provided workflow_run_id/profile_id" },
        400,
      );
    }
    if (effectiveRecommendation.status === "rejected") {
      return jsonResponse(
        {
          request_id: requestId,
          workflow_run_id: workflowRunId,
          action_item_id: null,
          recommendation_id: effectiveRecommendation.id,
          auto_executed: false,
        },
      );
    }

    const shouldExecute = canAutoExecute(effectiveRecommendation, autoExecuteThreshold);
    const actionId = crypto.randomUUID();
    const dueDate = new Date(
      Date.now() +
        1000 * 60 * 60 * 24 * Math.max(1, asNum(effectiveRecommendation.time_to_impact_days, 3)),
    );
    const priority =
      asNum(effectiveRecommendation.impact_score) >= 80 ||
      asNum(effectiveRecommendation.risk_reduction_score) >= 75
        ? "high"
        : asNum(effectiveRecommendation.impact_score) >= 55
        ? "medium"
        : "low";
    const executionScore = clamp(computeExecutionScore(effectiveRecommendation), 0, 1);

    await restInsert("public.ai_worker_action_items", {
      id: actionId,
      request_id: effectiveRecommendation.request_id,
      workflow_run_id: effectiveRecommendation.workflow_run_id,
      signal_id: effectiveRecommendation.signal_id,
      recommendation_id: effectiveRecommendation.id,
      profile_id: effectiveRecommendation.profile_id,
      organization_id: effectiveRecommendation.organization_id,
      domain: effectiveRecommendation.domain,
      initiative_id: null,
      title: effectiveRecommendation.title,
      description: effectiveRecommendation.rationale,
      assigned_to: effectiveRecommendation.owner_profile_id,
      due_date: dueDate.toISOString().slice(0, 10),
      priority,
      status: shouldExecute ? "in_progress" : "pending",
      execution_payload: {
        recommendation_type: effectiveRecommendation.action_type,
        auto_execute: shouldExecute,
        execution_score: executionScore,
      },
    });

    await restPatch(
      "public.ai_worker_recommendations",
      `id=eq.${effectiveRecommendation.id}`,
      {
        status: shouldExecute ? "executing" : "accepted",
        updated_at: new Date().toISOString(),
      },
    );

    const nowIso = new Date().toISOString();
    const runRows = await restSelect(
      "public.ai_worker_workflow_runs",
      `id=eq.${workflowRunId}&select=timeline,action_item_ids`,
    );
    const currentRun = (runRows?.[0] ?? {}) as {
      timeline?: unknown;
      action_item_ids?: unknown;
    };
    const previousTimeline = Array.isArray(currentRun.timeline) ? currentRun.timeline : [];
    const previousActionItemIds = Array.isArray(currentRun.action_item_ids)
      ? currentRun.action_item_ids.map((x) => String(x))
      : [];

    await restPatch(
      "public.ai_worker_workflow_runs",
      `id=eq.${workflowRunId}`,
      {
        action_item_ids: [...previousActionItemIds, actionId],
        timeline: [
          ...previousTimeline,
          {
            state: "running",
            stage: "execution",
            action_item_id: actionId,
            auto_executed: shouldExecute,
            at: nowIso,
          },
        ],
        updated_at: nowIso,
      },
    );

    return jsonResponse({
      request_id: requestId,
      workflow_run_id: workflowRunId,
      action_item_id: actionId,
      recommendation_id: effectiveRecommendation.id,
      auto_executed: shouldExecute,
      execution_score: Number(executionScore.toFixed(4)),
    });
  } catch (error) {
    return jsonResponse({ error: String(error) }, 500);
  }
});
