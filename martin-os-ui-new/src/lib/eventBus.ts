import { supabase } from "../../server/supabase.js";

export async function emitEvent(eventType: string, payload: any, userId: string) {
  if (!supabase) return;
  
  await supabase.from('events').insert({
    event_type: eventType,
    payload: payload,
    user_id: userId
  });
}
