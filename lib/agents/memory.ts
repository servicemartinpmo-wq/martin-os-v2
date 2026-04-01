import { supabase } from "../../../server/supabase.js";

export async function storePattern(action: string, payload: any, result: any, userId: string) {
  if (!supabase) return;
  
  await supabase.from('agent_logs').insert({
    agent_name: 'orchestrator',
    input: { action, payload },
    output: result
  });
}
