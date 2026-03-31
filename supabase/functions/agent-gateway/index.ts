import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

// Helper function to simulate Gemini call
async function askGemini(prompt: string): Promise<string> {
  // In a real implementation, this would call the Gemini API
  return "deploy_fix";
}

serve(async (req) => {
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SERVICE_ROLE_KEY')!);
  const { intent, context } = await req.json();

  // 1. Gemini Decides the Route
  const route = await askGemini(`User wants to: "${intent}". 
    Available Tools: [deploy_fix, create_project, generate_report, update_mbti]. 
    Pick the best tool and return ONLY the tool name.`);

  // 2. Dynamic Execution
  const { data, error } = await supabase.functions.invoke(route, { body: context });

  return new Response(JSON.stringify({ 
    message: `Agent ${route} executed successfully.`,
    result: data 
  }));
});
