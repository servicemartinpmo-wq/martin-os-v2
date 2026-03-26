import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import {
  jsonResponse,
  restInsert,
  restSelect,
  rpc,
} from "../_shared/brain.ts";

serve(async (req) => {
  try {
    const body = await req.json();
    const runId = String(body?.run_id ?? "");
    const requestId = String(body?.request_id ?? "");
    const profileId = String(body?.profile_id ?? "");
    const input = String(body?.input ?? "");
    if (!runId || !requestId || !profileId) {
      return jsonResponse({ error: "run_id, request_id, profile_id required" }, 400);
    }

    const recentMemory = await restSelect(
      "brain_memory_logs",
      `select=id,stage,status,output_payload,created_at&profile_id=eq.${profileId}&order=created_at.desc&limit=8`,
    );

    let vectorContext: unknown[] = [];
    const embedding = body?.query_embedding;
    if (embedding && Array.isArray(embedding) && embedding.length === 1536) {
      const result = await rpc("match_brain_chunks", {
        in_profile_id: profileId,
        in_query_embedding: embedding,
        in_top_k: Number(body?.top_k ?? 8),
      });
      vectorContext = Array.isArray(result) ? result : [];
    }

    const contextPack = {
      recent_memory: recentMemory,
      vector_hits: vectorContext,
      retrieval_meta: {
        top_k: Number(body?.top_k ?? 8),
        generated_at: new Date().toISOString(),
      },
      input_excerpt: input.slice(0, 300),
    };

    await restInsert("brain_memory_logs", {
      run_id: runId,
      request_id: requestId,
      profile_id: profileId,
      stage: "retrieve_context",
      status: "completed",
      input_payload: { input },
      output_payload: contextPack,
    });

    return jsonResponse({ run_id: runId, context_pack: contextPack });
  } catch (error) {
    return jsonResponse({ error: String(error) }, 500);
  }
});
