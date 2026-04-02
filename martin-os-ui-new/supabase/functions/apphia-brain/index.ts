import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Helper function to call Gemini
async function callGemini(prompt: string) {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${Deno.env.get("GEMINI_API_KEY")}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json" }
    }),
  });
  const result = await response.json();
  return JSON.parse(result.candidates[0].content.parts[0].text);
}

serve(async (req) => {
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SERVICE_ROLE_KEY')!);
  const { intent, context } = await req.json();

  // 1. FILL GAPS: Pull relevant framework context
  const { data: frameworks } = await supabase
    .from('frameworks')
    .select('name, execution_module, notes')
    .ilike('name', `%${context.type}%`);

  // 2. EXECUTE PIPELINE: Call Gemini with the specific Pipeline Instructions
  const prompt = `Use the ${context.pipelineType} Diagnostic Pipeline. 
                 Context: ${JSON.stringify(context)}. 
                 Frameworks: ${JSON.stringify(frameworks)}.
                 Task: Fill all missing UI data fields and provide a recommendation. Return JSON.`;

  const result = await callGemini(prompt);

  // 3. MAKE LIVE: Update the 'operational_signals' or 'tasks' table
  if (context.signalId) {
    await supabase
      .from('operational_signals')
      .update({ context_data: { ...context, diagnosis: result }, status: 'executed' })
      .eq('id', context.signalId);
  }

  return new Response(JSON.stringify(result), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
});
