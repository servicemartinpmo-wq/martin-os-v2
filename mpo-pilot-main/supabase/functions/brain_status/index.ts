import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { jsonResponse, restSelect } from "../_shared/brain.ts";

const labels: Record<string, string> = {
  queued: "Waiting to start",
  running: "In progress",
  waiting_review: "Needs human check",
  retrying: "Trying again",
  completed: "Done",
  failed: "Stopped with issue",
  fallback: "Used backup path",
};

serve(async (req) => {
  try {
    const url = new URL(req.url);
    const runId = url.searchParams.get("run_id") ?? "";
    const profileId = url.searchParams.get("profile_id") ?? "";
    if (!runId || !profileId) return jsonResponse({ error: "run_id and profile_id required" }, 400);

    const rows = await restSelect(
      "brain_runs",
      `select=id,state,confidence,updated_at&profile_id=eq.${profileId}&id=eq.${runId}&limit=1`,
    );
    const run = rows?.[0] as Record<string, unknown> | undefined;
    if (!run) return jsonResponse({ error: "run not found" }, 404);

    const state = String(run.state ?? "queued");
    return jsonResponse({
      run_id: run.id,
      state,
      confidence: run.confidence ?? null,
      updated_at: run.updated_at ?? null,
      operator_status_label: labels[state] ?? "In progress",
    });
  } catch (error) {
    return jsonResponse({ error: String(error) }, 500);
  }
});
