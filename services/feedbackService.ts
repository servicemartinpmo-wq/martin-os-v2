import { supabase } from "../lib/supabase";

export async function logDecision(data: any) {
  await supabase.from("decision_logs").insert({
    intent: data.intent,
    decision: data.decision,
    workflow: data.workflow,
    result: data.result,
    created_at: new Date().toISOString(),
  });
}
