import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

async function callGemini(prompt: string) {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${Deno.env.get("GEMINI_API_KEY")}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });
  const result = await response.json();
  return JSON.parse(result.candidates[0].content.parts[0].text);
}

serve(async (req) => {
  const { workspace_id } = await req.json();

  // 1A. SIGNAL DETECTION: Scan for anomalies (Delays, Capacity, Conflicts)
  const { data: signals } = await supabase.rpc('detect_operational_signals', { ws_id: workspace_id });

  // 1B & 1C. DIAGNOSIS & ADVISORY: Loop signals through Gemini
  const insights = await Promise.all(signals.map(async (signal: any) => {
    const prompt = `
      SIGNAL: ${signal.description}
      TYPE: ${signal.type}
      FRAMEWORKS: Porter, Lean, TOC, OKR.
      TASK: Provide a 4-part JSON response:
      1. Diagnosis (Root Cause)
      2. Advisory (Immediate Action)
      3. Structural Remedy (Long-term Fix)
      4. Priority Score (0-100)
    `;
    
    const aiResponse = await callGemini(prompt);
    
    // 1D. STRUCTURAL REMEDIES: Log the long-term fix to the 'remedies' table
    return { ...signal, ...aiResponse };
  }));

  // Bulk insert into the 'insights' table for the frontend Insight Cards
  await supabase.from('insights').insert(insights);

  return new Response(JSON.stringify({ status: "success", signals_processed: insights.length }));
});
