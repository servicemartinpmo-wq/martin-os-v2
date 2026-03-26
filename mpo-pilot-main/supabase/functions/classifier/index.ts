import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import {
  assertClassifierSchema,
  callModel,
  chooseModel,
  ensureRun,
  getPrompt,
  jsonResponse,
  restInsert,
  restPatch,
} from "../_shared/brain.ts";

serve(async (req) => {
  try {
    const body = await req.json();
    const input = String(body?.input ?? "").trim();
    const requestId = String(body?.request_id ?? crypto.randomUUID());
    const profileId = String(body?.profile_id ?? "");
    const organizationId = body?.organization_id ? String(body.organization_id) : null;
    if (!input || !profileId) {
      return jsonResponse({ error: "input and profile_id are required" }, 400);
    }

    const runId = await ensureRun(requestId, profileId, organizationId, { input });
    const template = await getPrompt("classifier");
    const prompt = `${template}\nInput:\n${input}`;
    const model = chooseModel();
    const classification = await callModel(prompt, model);
    assertClassifierSchema(classification);

    await restInsert("brain_memory_logs", {
      run_id: runId,
      request_id: requestId,
      profile_id: profileId,
      organization_id: organizationId,
      stage: "classify",
      status: "completed",
      input_payload: { input },
      output_payload: classification,
      classification,
      chosen_model: model,
      confidence: classification.confidence,
    });

    await restPatch("brain_runs", `id=eq.${runId}`, {
      chosen_model: model,
      confidence: classification.confidence,
      state: Number(classification.confidence) < 0.6 ? "waiting_review" : "running",
      trace: [
        { stage: "classify", status: "completed", model, confidence: classification.confidence, at: new Date().toISOString() },
      ],
    });

    return jsonResponse({
      request_id: requestId,
      run_id: runId,
      classification,
      next_state: Number(classification.confidence) < 0.6 ? "waiting_review" : "running",
    });
  } catch (error) {
    return jsonResponse({ error: String(error) }, 500);
  }
});
