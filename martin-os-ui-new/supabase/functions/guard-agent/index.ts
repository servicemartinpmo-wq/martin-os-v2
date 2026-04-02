import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

// Helper function to simulate Gemini call
async function askGemini(prompt: string): Promise<string> {
  // In a real implementation, this would call the Gemini API
  return "Technical fix: Check if the function environment variables are correctly set.";
}

serve(async () => {
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SERVICE_ROLE_KEY')!);
  
  const functionsToWatch = ['apphia-engine', 'import-agent', 'miidle-content'];
  
  for (const name of functionsToWatch) {
    const start = Date.now();
    const { error } = await supabase.functions.invoke(name, { body: { ping: true } });
    const latency = Date.now() - start;

    if (error) {
      // AI ANALYSIS: If function is down, ask Gemini why based on error
      const remedy = await askGemini(`Function ${name} failed with error: ${error.message}. Provide a 1-sentence technical fix.`);
      
      await supabase.from('system_health_logs').insert({
        function_name: name,
        status: 'down',
        error_payload: error,
        ai_remedy_suggestion: remedy,
        latency_ms: latency
      });
    } else {
      await supabase.from('system_health_logs').insert({ function_name: name, status: 'healthy', latency_ms: latency });
    }
  }
  return new Response("Monitoring Complete");
});
