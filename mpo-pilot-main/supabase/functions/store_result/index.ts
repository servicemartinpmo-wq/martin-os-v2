import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import {
  jsonResponse,
  restInsert,
  restPatch,
} from "../_shared/brain.ts";

serve(async (req) => {
  try {
    const body = await req.json();
    const runId = String(body?.run_id ?? "");
    const requestId = String(body?.request_id ?? "");
    const profileId = String(body?.profile_id ?? "");
    if (!runId || !requestId || !profileId) {
      return jsonResponse({ error: "run_id, request_id, profile_id required" }, 400);
    }

    const success = Boolean(body?.success ?? false);
    const outputPayload = (body?.output_payload ?? {}) as Record<string, unknown>;
    const feedback = body?.feedback ? String(body.feedback) : null;
    const startedAt = body?.started_at ? String(body.started_at) : null;
    const resolvedAt = new Date().toISOString();
    const ttr = startedAt
      ? Math.max(0, Math.floor((Date.parse(resolvedAt) - Date.parse(startedAt)) / 1000))
      : null;

    await restInsert("brain_outcomes", {
      run_id: runId,
      profile_id: profileId,
      success,
      feedback,
      time_to_resolve_seconds: ttr,
      output_payload: outputPayload,
    });

    await restInsert("brain_memory_logs", {
      run_id: runId,
      request_id: requestId,
      profile_id: profileId,
      stage: "store_result",
      status: "completed",
      output_payload: outputPayload,
      success,
    });

    await restPatch("brain_runs", `id=eq.${runId}`, {
      state: success ? "completed" : "failed",
      updated_at: resolvedAt,
    });

    return jsonResponse({
      run_id: runId,
      state: success ? "completed" : "failed",
      time_to_resolve_seconds: ttr,
    });
  } catch (error) {
    return jsonResponse({ error: String(error) }, 500);
  }
});
