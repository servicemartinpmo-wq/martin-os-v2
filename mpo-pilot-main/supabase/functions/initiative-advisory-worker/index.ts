import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { clamp, handleCorsPreflight, jsonResponse, restInsert } from "../_shared/brain.ts";

type DiagnosticLike = {
  id?: string;
  signal_id?: string;
  confidence_score?: number;
  root_causes?: Array<Record<string, unknown>>;
  summary?: string;
};

function pickActionType(severity: number): "quick_fix" | "structural" | "strategic" {
  if (severity >= 75) return "structural";
  if (severity >= 50) return "quick_fix";
  return "strategic";
}

function impactScore(severity: number): number {
  return clamp(0.6 * severity + 20, 0, 100);
}

function effortScore(severity: number): number {
  return clamp(30 + severity * 0.35, 0, 100);
}

function riskReductionScore(severity: number, confidence: number): number {
  return clamp(0.55 * severity + confidence * 35, 0, 100);
}

serve(async (req) => {
  try {
    const preflight = handleCorsPreflight(req);
    if (preflight) return preflight;

    const body = await req.json();
    const requestId = String(body?.request_id ?? "");
    const workflowRunId = String(body?.workflow_run_id ?? "");
    const profileId = String(body?.profile_id ?? "");
    const organizationId = body?.organization_id ? String(body.organization_id) : null;
    const initiativeId = body?.initiative_id ? String(body.initiative_id) : null;
    const domain = String(body?.domain ?? "pmo_ops");
    const signalId = String(body?.signal_id ?? "");
    const signalCode = String(body?.signal_code ?? "initiative_at_risk");
    const signalSeverity = Number(body?.signal_severity ?? 50);
    const diagnosticId = String(body?.diagnostic_id ?? "");
    const diagnosticSummary = String(body?.diagnostic_summary ?? "");
    const diagnosticConfidence = Number(body?.diagnostic_confidence_score ?? 0.75);

    if (!requestId || !workflowRunId || !profileId || !signalId || !diagnosticId) {
      return jsonResponse(
        {
          error:
            "request_id, workflow_run_id, profile_id, signal_id, and diagnostic_id are required",
        },
        400,
      );
    }

    const severity = signalSeverity;
    const confidence = clamp(diagnosticConfidence, 0, 1);
    const actionType = pickActionType(severity);
    const impact = impactScore(severity);
    const effort = effortScore(severity);
    const riskReduction = riskReductionScore(severity, confidence);
    const expectedRoi = Math.max(0, Math.round((impact - effort) * 120) / 100);
    const autoExecuteEligible = confidence >= 0.85 && severity >= 60;

    const title =
      signalCode === "missed_deadline"
        ? "Recover delayed milestone and unblock delivery"
        : signalCode === "milestone_delay"
        ? "Stabilize milestone execution path"
        : "Reduce backlog pressure and restore flow";
    const rationale =
      diagnosticSummary ||
      "Signal and diagnostic evidence indicate initiative execution risk requiring immediate correction.";
    const ownerProfileId = String(body?.owner_profile_id ?? "");
    const normalizedOwnerProfileId = ownerProfileId.length > 0 ? ownerProfileId : null;

    const recommendationId = crypto.randomUUID();
    await restInsert("public.ai_worker_recommendations", {
      id: recommendationId,
      request_id: requestId,
      workflow_run_id: workflowRunId,
      signal_id: signalId,
      diagnostic_id: diagnosticId,
      profile_id: profileId,
      organization_id: organizationId,
      domain,
      action_type: actionType,
      title,
      rationale,
      impact_score: impact,
      effort_score: effort,
      risk_reduction_score: riskReduction,
      expected_roi: expectedRoi,
      time_to_impact_days: actionType === "quick_fix" ? 2 : actionType === "structural" ? 7 : 14,
      owner_role: "initiative_owner",
      owner_profile_id: normalizedOwnerProfileId,
      auto_execute_eligible: autoExecuteEligible,
      confidence_score: confidence,
      status: "new",
    });

    return jsonResponse({
      request_id: requestId,
      workflow_run_id: workflowRunId,
      recommendation_id: recommendationId,
      action_type: actionType,
      title,
      rationale,
      owner_role: "initiative_owner",
      owner_profile_id: normalizedOwnerProfileId,
      time_to_impact_days: actionType === "quick_fix" ? 2 : actionType === "structural" ? 7 : 14,
      auto_execute_eligible: autoExecuteEligible,
      confidence_score: confidence,
      recommendation: {
        id: recommendationId,
        signal_id: signalId,
        diagnostic_id: diagnosticId,
        action_type: actionType,
        title,
        rationale,
        impact_score: impact,
        effort_score: effort,
        risk_reduction_score: riskReduction,
        expected_roi: expectedRoi,
        owner_profile_id: normalizedOwnerProfileId,
        auto_execute_eligible: autoExecuteEligible,
        confidence_score: confidence,
      },
      operator_view: {
        status: "recommendation_generated",
        message: "Recommendation generated for initiative health recovery.",
      },
      context: {
        initiative_id: initiativeId,
        signal_code: signalCode,
      },
    });
  } catch (error) {
    return jsonResponse({ error: String(error) }, 500);
  }
});
