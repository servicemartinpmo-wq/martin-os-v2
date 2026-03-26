import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import {
  handleCorsPreflight,
  invokeFunction,
  jsonResponse,
  restPatch,
  restSelect,
} from "../_shared/brain.ts";

serve(async (req) => {
  try {
    const preflight = handleCorsPreflight(req);
    if (preflight) return preflight;
    const idempotencyKey = req.headers.get("x-idempotency-key");
    const body = await req.json();
    const requestId = String(body?.request_id ?? crypto.randomUUID());
    const profileId = String(body?.profile_id ?? "");
    const organizationId = body?.organization_id ? String(body.organization_id) : null;
    const input = String(body?.input ?? "");
    const actions = Array.isArray(body?.actions) ? body.actions : [];
    if (!profileId || !input) {
      return jsonResponse({ error: "profile_id and input are required" }, 400);
    }
    if (!idempotencyKey || idempotencyKey !== requestId) {
      return jsonResponse({ error: "x-idempotency-key header must equal request_id" }, 400);
    }
    if (actions.length > 25) {
      return jsonResponse({ error: "actions exceeds max of 25" }, 400);
    }

    const classified = await invokeFunction("classifier", {
      request_id: requestId,
      profile_id: profileId,
      organization_id: organizationId,
      input,
    });

    const runId = String(classified?.run_id ?? "");
    if (!runId) return jsonResponse({ error: "classifier did not return run_id" }, 500);

    if (classified?.next_state === "waiting_review") {
      return jsonResponse({
        request_id: requestId,
        run_id: runId,
        state: "waiting_review",
        operator_status_label: "Needs human check",
        classification: classified?.classification ?? {},
      });
    }

    const contextResp = await invokeFunction("retrieve_context", {
      run_id: runId,
      request_id: requestId,
      profile_id: profileId,
      input,
    });

    const decisionResp = await invokeFunction("decide", {
      run_id: runId,
      request_id: requestId,
      profile_id: profileId,
      classification: classified?.classification ?? {},
      context_pack: contextResp?.context_pack ?? {},
      input,
    });

    const resolvedActions =
      actions.length > 0
        ? actions
        : (Array.isArray(decisionResp?.decision?.suggested_actions)
            ? decisionResp.decision.suggested_actions
            : []);

    const executeResp = await invokeFunction("execute", {
      run_id: runId,
      request_id: requestId,
      profile_id: profileId,
      decision: decisionResp?.decision ?? {},
      actions: resolvedActions,
    });

    const success = Array.isArray(executeResp?.outcome?.action_results)
      ? executeResp.outcome.action_results.every((r: Record<string, unknown>) => {
        const status = String(r?.status ?? "");
        return status !== "failed";
      })
      : true;

    const storeResp = await invokeFunction("store_result", {
      run_id: runId,
      request_id: requestId,
      profile_id: profileId,
      success,
      output_payload: {
        classification: classified?.classification ?? {},
        context_pack: contextResp?.context_pack ?? {},
        decision: decisionResp?.decision ?? {},
        outcome: executeResp?.outcome ?? {},
      },
      started_at: body?.started_at ?? new Date().toISOString(),
      feedback: body?.feedback ?? null,
    });

    await restPatch("brain_runs", `id=eq.${runId}`, { state: storeResp?.state ?? "completed" });

    return jsonResponse({
      request_id: requestId,
      run_id: runId,
      state: storeResp?.state ?? "completed",
      operator_status_label: storeResp?.state === "completed" ? "Done" : "Stopped with issue",
      machine_view: {
        classification: classified?.classification ?? {},
        context_pack: contextResp?.context_pack ?? {},
        decision: decisionResp?.decision ?? {},
        outcome: executeResp?.outcome ?? {},
      },
      operator_view: {
        status: storeResp?.state ?? "completed",
        message: storeResp?.state === "completed"
          ? "Request was processed successfully."
          : "Request stopped with an issue.",
      },
    });
  } catch (error) {
    return jsonResponse({ error: String(error) }, 500);
  }
});
