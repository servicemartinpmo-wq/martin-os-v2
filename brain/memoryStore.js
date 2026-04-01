/**
 * Persistent brain memory store.
 * 
 * RUNTIME WARNING: This module uses server-side RPC helpers. 
 * It should only be imported in Server Components, Server Actions, or Edge Functions.
 * If you need to access this from the browser, use a Server Action or an API route as a proxy.
 */

import { rpc } from "../lib/supabaseUtils.js";

/**
 * @typedef {{
 *   id?: string,
 *   ts?: number,
 *   type: string,
 *   summary: string
 * }} MemoryEventInput
 */

const DEFAULT_STAGE = "memory_event";

/**
 * Persist a memory log entry via Supabase RPC.
 * @param {Omit<MemoryEventInput, "id" | "ts"> & { id?: string }} e
 */
export async function pushMemoryEvent(e) {
  const type = e.type ?? DEFAULT_STAGE;
  const summary = e.summary ?? "";

  // Signature matches the persist_brain_memory_log PostgreSQL function
  const res = await rpc("persist_brain_memory_log", {
    p_stage: type,
    p_status: "completed",
    p_input_payload: { type },
    p_output_payload: { summary },
    p_classification: null,
    p_decision_trace: null,
    p_chosen_model: null,
    p_confidence: null,
    p_success: true,
    p_request_id: null,
    p_run_id: null,
  });

  return res;
}

/**
 * Fetch recent memory logs and normalize to the application shape:
 * { id, ts, type, summary }
 */
export async function getRecentMemory(limit = 50) {
  const res = await rpc("get_brain_memory_logs", {
    p_stage: null,
    p_limit: limit,
  });

  // Handle potential data wrapping from the rpc helper
  const rows = Array.isArray(res) ? res : res?.data ?? [];

  return rows.map((x) => ({
    id: x.id,
    ts: x.created_at ? new Date(x.created_at).getTime() : Date.now(),
    type: x.input_payload?.type ?? x.stage ?? DEFAULT_STAGE,
    summary:
      x.output_payload?.summary ??
      (typeof x.output_payload === "string"
        ? x.output_payload
        : JSON.stringify(x.output_payload ?? {})),
  }));
}

/**
 * No-op: Persistence is now handled by the database.
 */
export function clearMemoryDemo() {
  console.warn("clearMemoryDemo: Local clear ignored. Database records must be deleted via RPC.");
}
