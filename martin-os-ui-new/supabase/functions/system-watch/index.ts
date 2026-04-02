import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

serve(async (req) => {
  // 1. Scan memory_logs for repeated failures
  const { data: failures, error: failureError } = await supabase
    .from("memory_logs")
    .select("*")
    .eq("success", false)
    .gte("created_at", new Date(Date.now() - 5 * 60 * 1000).toISOString());

  if (failureError) return new Response(JSON.stringify({ error: failureError }), { status: 500 });

  // 2. Auto-generate structural remedy recommendation
  if (failures && failures.length > 3) {
    const remedy = "Structural failure detected in workspace. Recommend reviewing connector health and workflow dependencies.";
    
    // 3. Create insight card
    await supabase.from("operational_signals").insert({
      workspace_id: failures[0].workspace_id,
      source_app: "system_watch",
      signal_type: "remedy_recommendation",
      context_data: { remedy },
      status: "pending",
    });
  }

  return new Response(JSON.stringify({ success: true, failures: failures?.length }), { status: 200 });
});
