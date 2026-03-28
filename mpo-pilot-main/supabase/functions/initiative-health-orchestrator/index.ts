import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import {
  handleCorsPreflight,
  jsonResponse,
  invokeFunction,
  restInsert,
  restPatch,
} from "../_shared/brain.ts";

type SignalRecord = {
  id: string;
  signal_code: string;
  severity: number;
  confidence_score: number;
  evidence: Record<string, unknown>;
};

type DiagnosticRecord = {
  id: string;
  summary: string;
  confidence_score: number;
  root_causes: Array<Record<string, unknown>>;
};

type RecommendationRecord = {
  id: string;
  action_type: string;
  title: string;
  rationale: string;
  owner_role: string | null;
  owner_profile_id: string | null;
  time_to_impact_days: number;
  auto_execute_eligible: boolean;
};

function appendTimelineEvent(
  timeline: Array<Record<string, unknown>>,
  state: string,
  message: string,
): Array<Record<string, unknown>> {
  return [
    ...timeline,
    {
      state,
      message,
      timestamp: new Date().toISOString(),
    },
  ];
}

serve(async (req) => {
  try {
    const preflight = handleCorsPreflight(req);
    if (preflight) return preflight;

    const idempotencyKey = req.headers.get("x-idempotency-key");
    const body = await req.json();

    const requestId = String(body?.request_id ?? crypto.randomUUID());
    const profileId = String(body?.profile_id ?? "");
    const organizationId = body?.organization_id ? String(body.organization_id) : null;
    const initiativeId = body?.initiative_id ? String(body.initiative_id) : null;
    const domain = String(body?.domain ?? "pmo_ops");
    const workflowKey = String(
      body?.workflow_key ?? "wf_pmo_035_initiative_health_diagnostics",
    );
    const milestone = body?.milestone ?? {};
    const backlogGrowthPercent = Number(body?.backlog_growth_percent ?? 0);

    if (!profileId || !initiativeId) {
      return jsonResponse({ error: "profile_id and initiative_id are required" }, 400);
    }
    if (!idempotencyKey || idempotencyKey !== requestId) {
      return jsonResponse(
        { error: "x-idempotency-key header must equal request_id" },
        400,
      );
    }

    const runId = crypto.randomUUID();
    let timeline: Array<Record<string, unknown>> = appendTimelineEvent(
      [],
      "queued",
      "Initiative health workflow queued.",
    );

    await restInsert("public.ai_worker_workflow_runs", {
      id: runId,
      request_id: requestId,
      profile_id: profileId,
      organization_id: organizationId,
      domain,
      workflow_key: workflowKey,
      state: "queued",
      initiative_id: initiativeId,
      timeline,
    });

    timeline = appendTimelineEvent(
      timeline,
      "running",
      "Detecting initiative health signals.",
    );
    await restPatch("public.ai_worker_workflow_runs", `id=eq.${runId}`, {
      state: "running",
      timeline,
      attempt_count: 1,
    });

    const signalResp = await invokeFunction("initiative-signal-detector", {
      request_id: requestId,
      profile_id: profileId,
      organization_id: organizationId,
      initiative_id: initiativeId,
      milestone,
      backlog_growth_percent: backlogGrowthPercent,
    });

    const signals = (Array.isArray(signalResp?.signals)
      ? signalResp.signals
      : []) as Array<SignalRecord>;

    if (signals.length === 0) {
      timeline = appendTimelineEvent(
        timeline,
        "completed",
        "No initiative-health signals emitted; workflow completed.",
      );
      await restPatch("public.ai_worker_workflow_runs", `id=eq.${runId}`, {
        state: "completed",
        timeline,
      });
      return jsonResponse({
        request_id: requestId,
        workflow_run_id: runId,
        state: "completed",
        signal_count: 0,
        diagnostic_count: 0,
        recommendation_count: 0,
        action_item_count: 0,
      });
    }

    const diagnosticIds: string[] = [];
    const recommendationIds: string[] = [];
    const actionItemIds: string[] = [];
    const processedSignalIds: string[] = [];

    for (const signal of signals) {
      processedSignalIds.push(signal.id);
      timeline = appendTimelineEvent(
        timeline,
        "running",
        `Diagnosing signal ${signal.signal_code}.`,
      );
      await restPatch("public.ai_worker_workflow_runs", `id=eq.${runId}`, {
        timeline,
      });

      const diagnosticResp = await invokeFunction("initiative-diagnostic-worker", {
        request_id: requestId,
        profile_id: profileId,
        organization_id: organizationId,
        workflow_run_id: runId,
        domain,
        signal,
      });
      const diagnostic = {
        id: String(diagnosticResp?.diagnostic_id ?? ""),
        summary: String(diagnosticResp?.summary ?? ""),
        confidence_score: Number(diagnosticResp?.confidence_score ?? 0),
        root_causes: Array.isArray(diagnosticResp?.root_causes) ? diagnosticResp.root_causes : [],
      } as DiagnosticRecord;
      const diagnosticId = String(diagnostic.id ?? "");
      if (diagnosticId) diagnosticIds.push(diagnosticId);

      const advisoryResp = await invokeFunction("initiative-advisory-worker", {
        request_id: requestId,
        profile_id: profileId,
        organization_id: organizationId,
        workflow_run_id: runId,
        initiative_id: initiativeId,
        domain,
        signal,
        diagnostic_id: diagnosticId,
        diagnostic_summary: diagnostic.summary,
        diagnostic_confidence_score: diagnostic.confidence_score,
        owner_profile_id: profileId,
      });

      const recommendation = {
        id: String(advisoryResp?.recommendation_id ?? ""),
        action_type: String(advisoryResp?.action_type ?? "quick_fix"),
        title: String(advisoryResp?.title ?? ""),
        rationale: String(advisoryResp?.rationale ?? ""),
        owner_role: advisoryResp?.owner_role ? String(advisoryResp.owner_role) : null,
        owner_profile_id: advisoryResp?.owner_profile_id ? String(advisoryResp.owner_profile_id) : null,
        time_to_impact_days: Number(advisoryResp?.time_to_impact_days ?? 7),
        auto_execute_eligible: Boolean(advisoryResp?.auto_execute_eligible ?? false),
      } as RecommendationRecord;
      const recommendationId = String(recommendation.id ?? "");
      if (recommendationId) recommendationIds.push(recommendationId);

      const executeResp = await invokeFunction("initiative-execution-worker", {
        request_id: requestId,
        profile_id: profileId,
        workflow_run_id: runId,
        recommendation,
        auto_execute_threshold: 0.85,
      });

      const actionItemId = String(executeResp?.action_item_id ?? "");
      if (actionItemId) actionItemIds.push(actionItemId);
    }

    const scoreResp = await invokeFunction("initiative-health-score-worker", {
      request_id: requestId,
      profile_id: profileId,
      organization_id: organizationId,
      initiative_id: initiativeId,
      workflow_run_id: runId,
      signal_ids: processedSignalIds,
      recommendation_ids: recommendationIds,
    });

    timeline = appendTimelineEvent(
      timeline,
      "completed",
      "Initiative health workflow completed.",
    );

    await restPatch("public.ai_worker_workflow_runs", `id=eq.${runId}`, {
      state: "completed",
      timeline,
      diagnostic_ids: diagnosticIds,
      recommendation_ids: recommendationIds,
      action_item_ids: actionItemIds,
    });

    return jsonResponse({
      request_id: requestId,
      workflow_run_id: runId,
      state: "completed",
      signal_count: processedSignalIds.length,
      diagnostic_count: diagnosticIds.length,
      recommendation_count: recommendationIds.length,
      action_item_count: actionItemIds.length,
      health_score: scoreResp?.score ?? null,
    });
  } catch (error) {
    return jsonResponse({ error: String(error) }, 500);
  }
});
