import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import {
  clamp,
  chooseModel,
  jsonResponse,
  restInsert,
  restPatch,
} from "../_shared/brain.ts";

function priorityScore(impact: number, urgency: number, value: number): number {
  return clamp(100 * (0.5 * impact + 0.3 * urgency + 0.2 * value), 0, 100);
}

function riskScore(likelihood: number, severity: number): number {
  return clamp(100 * (0.6 * likelihood + 0.4 * severity), 0, 100);
}

function confidenceScore(evidence: number, missingFields: number, conflicts: number): number {
  return clamp(evidence - missingFields * 0.08 - conflicts, 0, 1);
}

serve(async (req) => {
  try {
    const body = await req.json();
    const runId = String(body?.run_id ?? "");
    const requestId = String(body?.request_id ?? "");
    const profileId = String(body?.profile_id ?? "");
    const classification = (body?.classification ?? {}) as Record<string, unknown>;
    const contextPack = (body?.context_pack ?? {}) as Record<string, unknown>;
    if (!runId || !requestId || !profileId) {
      return jsonResponse({ error: "run_id, request_id, profile_id required" }, 400);
    }

    const impact = Number(body?.impact ?? 0.7);
    const urgency = Number(body?.urgency ?? (classification.priority === "high" ? 0.9 : 0.5));
    const businessValue = Number(body?.business_value ?? 0.6);
    const likelihood = Number(body?.likelihood ?? 0.5);
    const severity = Number(body?.severity ?? 0.6);
    const evidenceCoverage = Number(body?.evidence_coverage ?? 0.8);
    const missingFields = Number(body?.missing_fields ?? 0);
    const conflictPenalty = Number(body?.conflict_penalty ?? 0);

    const priority = priorityScore(impact, urgency, businessValue);
    const risk = riskScore(likelihood, severity);
    const confidence = confidenceScore(evidenceCoverage, missingFields, conflictPenalty);

    const model = chooseModel({ ...classification, confidence });
    const route = confidence < 0.6
      ? "human_review"
      : String(classification.type) === "ticket"
      ? "diagnostic_workflow"
      : String(classification.type) === "action"
      ? "execution_workflow"
      : "triage_workflow";

    const decision = {
      route,
      chosen_model: model,
      priority_score: priority,
      risk_score: risk,
      confidence_score: confidence,
      execution_order: ["classify", "retrieve_context", "decide", "execute", "store_result"],
    };

    await restInsert("brain_decision_runs", {
      run_id: runId,
      profile_id: profileId,
      classification,
      context_pack: contextPack,
      decision,
      priority_score: priority,
      risk_score: risk,
      confidence_score: confidence,
    });

    await restInsert("brain_memory_logs", {
      run_id: runId,
      request_id: requestId,
      profile_id: profileId,
      stage: "decide",
      status: "completed",
      output_payload: decision,
      decision_trace: decision,
      chosen_model: model,
      confidence,
    });

    await restPatch("brain_runs", `id=eq.${runId}`, {
      chosen_model: model,
      confidence,
      state: route === "human_review" ? "waiting_review" : "running",
    });

    return jsonResponse({ run_id: runId, decision });
  } catch (error) {
    return jsonResponse({ error: String(error) }, 500);
  }
});
