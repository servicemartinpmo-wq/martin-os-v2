import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { clamp, handleCorsPreflight, jsonResponse, restInsert, restSelect } from "../_shared/brain.ts";

type SignalLike = {
  id: string;
  severity: number;
  signal_code: string;
};

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
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
    const initiativeId = body?.initiative_id ? String(body.initiative_id) : null;
    const domain = String(body?.domain ?? "pmo_ops");
    const signalIds = Array.isArray(body?.signal_ids)
      ? body.signal_ids.map((x: unknown) => String(x)).filter(Boolean)
      : [];

    if (!requestId || !profileId || !workflowRunId) {
      return jsonResponse(
        { error: "request_id, profile_id, and workflow_run_id are required" },
        400,
      );
    }

    let signals: SignalLike[] = [];
    if (signalIds.length > 0) {
      const rows = await restSelect(
        "public.ai_worker_signals",
        `id=in.(${signalIds.join(",")})&select=id,severity,signal_code`,
      );
      signals = rows as unknown as SignalLike[];
    }

    const severityValues = signals.map((signal) => Number(signal.severity ?? 0));
    const avgSeverity = average(severityValues);
    const delaySignals = signals.filter((signal) => signal.signal_code === "missed_deadline").length;
    const backlogSignals = signals.filter((signal) => signal.signal_code === "backlog_growth").length;

    const opsScore = clamp(100 - avgSeverity * 0.7, 0, 100);
    const productScore = clamp(100 - avgSeverity * 0.5, 0, 100);
    const teamScore = clamp(100 - delaySignals * 12 - backlogSignals * 8, 0, 100);
    const revenueScore = clamp(100 - avgSeverity * 0.35, 0, 100);
    const totalScore = clamp(
      0.4 * opsScore + 0.25 * productScore + 0.2 * teamScore + 0.15 * revenueScore,
      0,
      100,
    );

    const healthId = crypto.randomUUID();
    await restInsert("public.ai_worker_org_health_scores", {
      id: healthId,
      request_id: requestId,
      workflow_run_id: workflowRunId,
      profile_id: profileId,
      organization_id: organizationId,
      domain,
      initiative_id: initiativeId,
      score: Number(totalScore.toFixed(2)),
      ops_score: Number(opsScore.toFixed(2)),
      revenue_score: Number(revenueScore.toFixed(2)),
      product_score: Number(productScore.toFixed(2)),
      team_score: Number(teamScore.toFixed(2)),
      contributing_signal_ids: signalIds,
    });

    return jsonResponse({
      request_id: requestId,
      workflow_run_id: workflowRunId,
      health_id: healthId,
      score: {
        score: Number(totalScore.toFixed(2)),
        ops_score: Number(opsScore.toFixed(2)),
        revenue_score: Number(revenueScore.toFixed(2)),
        product_score: Number(productScore.toFixed(2)),
        team_score: Number(teamScore.toFixed(2)),
      },
      signal_count: signalIds.length,
    });
  } catch (error) {
    return jsonResponse({ error: String(error) }, 500);
  }
});
