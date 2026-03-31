import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Verify the request is coming from an authorized Cursor Agent / Middleware
    const authHeader = req.headers.get('Authorization');
    const expectedToken = Deno.env.get('CURSOR_AGENT_SECRET');
    
    if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    const payload = await req.json();
    const { action, task_id, user_id, metadata, tool = 'Cursor Agent' } = payload;

    // Initialize Supabase client with Service Role to bypass RLS for system-level inserts
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // 1. Log the execution (The "Messy Middle" capture)
    const { data: logData, error: logError } = await supabaseClient
      .from('execution_logs')
      .insert({
        task_id,
        user_id,
        action_type: action, // e.g., 'code_generated', 'bug_fixed', 'refactored'
        tool,
        metadata, // Store the raw diffs, prompts, or agent reasoning here
      })
      .select()
      .single();

    if (logError) throw logError;

    // 2. Optionally update the Task status if the agent resolved it
    if (action === 'task_resolved' && task_id) {
      await supabaseClient
        .from('tasks')
        .update({ status: 'done', updated_at: new Date().toISOString() })
        .eq('id', task_id);
    }

    return new Response(JSON.stringify({ success: true, log: logData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
