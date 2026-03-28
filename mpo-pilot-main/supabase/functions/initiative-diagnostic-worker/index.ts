import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import {
  clamp,
  handleCorsPreflight,
  jsonResponse,
  restInsert,
} from "../_shared/brain.ts";

type SignalRecord = {
  id: string;
  signal_code: string;
  severity: number;
  confidence_score: number;
  evidence?: Record<string, unknown>;
};

function buildRootCauses(signal: SignalRecord) {
  const evidence = signal.evidence ?? {};
  const causes: Array<Record<string, unknown>> = [];

  if (signal.signal_code === "missed_deadline") {
    causes.push({
      level: "surface",
      cause_code: "late_milestone",
      explanation: "Milestone due date passed without completion.",
      confidence: clamp(signal.confidence_score, 0, 1),
      evidence,
    });
    causes.push({
      level: "immediate",
      cause_code: "execution_slippage",
      explanation: "Execution pace did not match planned timeline.",
      confidence: clamp(signal.confidence_score - 0.05, 0, 1),
      evidence,
    });
    causes.push({
      level: "systemic",
      cause_code: "insufficient_buffering",
      explanation: "Plan lacked enough contingency for variance.",
      confidence: clamp(signal.confidence_score - 0.12, 0, 1),
      evidence,
    });
  } else if (signal.signal_code === "milestone_delay") {
    causes.push({
      level: "surface",
      cause_code: "delayed_delivery",
      explanation: "Milestone is delayed beyond acceptable threshold.",
      confidence: clamp(signal.confidence_score, 0, 1),
      evidence,
    });
    causes.push({
      level: "systemic",
      cause_code: "dependency_friction",
      explanation: "Cross-team dependencies are increasing wait states.",
      confidence: clamp(signal.confidence_score - 0.08, 0, 1),
      evidence,
    });
  } else if (signal.signal_code === "backlog_growth") {
    causes.push({
      level: "surface",
      cause_code: "queue_growth",
      explanation: "Incoming work exceeded completion throughput.",
      confidence: clamp(signal.confidence_score, 0, 1),
      evidence,
    });
    causes.push({
      level: "structural",
      cause_code: "capacity_mismatch",
      explanation: "Current capacity mix cannot absorb incoming demand.",
      confidence: clamp(signal.confidence_score - 0.1, 0, 1),
      evidence,
    });
  } else {
    causes.push({
      level: "surface",
      cause_code: "unknown_signal",
      explanation: "Signal requires generic triage.",
      confidence: clamp(signal.confidence_score * 0.7, 0, 1),
      evidence,
    });
  }

  return causes;
}

serve(async (req) => {
  try {
    const preflight = handleCorsPreflight(req);
    if (preflight) return preflight;

    const body = await req.json();
    const requestId = String(body?.request_id ?? "");
    const profileId = String(body?.profile_id ?? "");
    const organizationId = body?.organization_id ? String(body.organization_id) : null;
    const workflowRunId = String(body?.workflow_run_id ?? "");
    const domain = String(body?.domain ?? "pmo_ops");
    const signalObj = (body?.signal ?? {}) as Record<string, unknown>;
    const signalId = String(body?.signal_id ?? signalObj.id ?? "");
    const signalCode = String(body?.signal_code ?? signalObj.signal_code ?? "");
    const signalSeverity = Number(body?.signal_severity ?? signalObj.severity ?? 0);
    const signalConfidence = Number(
      body?.signal_confidence_score ?? signalObj.confidence_score ?? 0,
    );
    const evidence = ((body?.evidence ?? signalObj.evidence ?? {}) as Record<string, unknown>);

    if (!requestId || !profileId || !workflowRunId || !signalId || !signalCode) {
      return jsonResponse(
        { error: "request_id, profile_id, workflow_run_id, signal_id, and signal_code are required" },
        400,
      );
    }

    const signal: SignalRecord = {
      id: signalId,
      signal_code: signalCode,
      severity: signalSeverity,
      confidence_score: signalConfidence,
      evidence,
    };

    const rootCauses = buildRootCauses(signal);
    const avgConfidence =
      rootCauses.length > 0
        ? rootCauses.reduce((sum, c) => sum + Number(c.confidence ?? 0), 0) / rootCauses.length
        : 0.6;

    const diagnosticId = crypto.randomUUID();
    const summary =
      signal.signal_code === "missed_deadline"
        ? "Initiative deadline slippage detected with execution and planning gaps."
        : signal.signal_code === "milestone_delay"
        ? "Milestone delay indicates dependency and flow friction."
        : signal.signal_code === "backlog_growth"
        ? "Backlog growth indicates throughput/capacity imbalance."
        : "Generic initiative triage diagnosis generated.";

    await restInsert("public.ai_worker_diagnostics", {
      id: diagnosticId,
      request_id: requestId,
      workflow_run_id: workflowRunId,
      signal_id: signal.id,
      profile_id: profileId,
      organization_id: organizationId,
      domain,
      framework_bundle: "PMBOK+TOC+Lean",
      root_causes: rootCauses,
      confidence_score: clamp(avgConfidence, 0, 1),
      summary,
    });

    const confidenceScore = Number(clamp(avgConfidence, 0, 1).toFixed(4));
    return jsonResponse({
      request_id: requestId,
      workflow_run_id: workflowRunId,
      diagnostic_id: diagnosticId,
      signal_id: signal.id,
      summary,
      confidence_score: confidenceScore,
      root_causes: rootCauses,
      diagnostic: {
        id: diagnosticId,
        signal_id: signal.id,
        summary,
        confidence_score: confidenceScore,
        root_causes: rootCauses,
      },
    });
  } catch (error) {
    return jsonResponse({ error: String(error) }, 500);
  }
});
