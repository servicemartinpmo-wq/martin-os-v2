import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' } })
  }

  try {
    const { intent, current_page, context_data } = await req.json();
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. CLASSIFY & ROUTE (The Brain)
    const brainPrompt = `User Intent: "${intent}" on page "${current_page}".
      Context: ${JSON.stringify(context_data)}.
      Available Pipelines: [Tech-Ops 12-Stage, PMO-Ops 4-Layer, miidle Build Story].
      Task: Identify the correct pipeline, execute the next logic step, and return a UI-ready state update.
      Respond ONLY with a valid JSON object containing: db_updates (boolean), target_table (string), payload (object), summary (string), ui_patch (object). Do not use markdown blocks.`;

    // Using Gemini API
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro-preview:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: brainPrompt }] }]
      })
    });
    
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    const cleanText = text.replace(/```json\n?|\n?```/g, '');
    const aiAction = JSON.parse(cleanText);

    // 2. EXECUTE DATA CHANGES
    if (aiAction.db_updates && aiAction.target_table) {
      await supabase.from(aiAction.target_table).upsert(aiAction.payload);
    }

    // 3. LOG TO TRACE (For monitoring)
    await supabase.from('agent_traces').insert({ intent, resolution: aiAction.summary });

    return new Response(JSON.stringify(aiAction.ui_patch || { status_message: aiAction.summary }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message, status_message: 'System Error' }), { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
  }
})
