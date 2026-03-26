import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { handleCorsPreflight, jsonResponse, restSelect } from "../_shared/brain.ts";

serve(async (req) => {
  try {
    const preflight = handleCorsPreflight(req);
    if (preflight) return preflight;
    const url = new URL(req.url);
    const runId = url.searchParams.get("run_id") ?? "";
    const profileId = url.searchParams.get("profile_id") ?? "";
    if (!runId || !profileId) return jsonResponse({ error: "run_id and profile_id required" }, 400);

    const runRows = await restSelect(
      "brain_runs",
      `select=id,state,request_id,chosen_model,confidence,trace,created_at,updated_at&profile_id=eq.${profileId}&id=eq.${runId}&limit=1`,
    );
    const decisionRows = await restSelect(
      "brain_decision_runs",
      `select=decision,classification,context_pack,priority_score,risk_score,confidence_score&profile_id=eq.${profileId}&run_id=eq.${runId}&order=created_at.desc&limit=1`,
    );
    const outcomeRows = await restSelect(
      "brain_outcomes",
      `select=success,feedback,time_to_resolve_seconds,output_payload,created_at&profile_id=eq.${profileId}&run_id=eq.${runId}&order=created_at.desc&limit=1`,
    );

    const run = runRows?.[0] as Record<string, unknown> | undefined;
    if (!run) return jsonResponse({ error: "run not found" }, 404);

    const decision = (decisionRows?.[0] ?? {}) as Record<string, unknown>;
    const outcome = (outcomeRows?.[0] ?? {}) as Record<string, unknown>;

    return jsonResponse({
      run_id: run.id,
      machine_view: {
        run,
        decision,
        outcome,
      },
      operator_view: {
        status: String(run.state ?? "running"),
        message: String(run.state) === "completed"
          ? "Request finished successfully."
          : "Request is still processing or needs review.",
      },
      trace_id: String(run.id),
    });
  } catch (error) {
    return jsonResponse({ error: String(error) }, 500);
  }
});
