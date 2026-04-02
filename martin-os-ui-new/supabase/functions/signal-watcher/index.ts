import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { google } from 'https://esm.sh/@ai-sdk/google'
import { generateText } from 'https://esm.sh/ai'

const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

Deno.serve(async (req) => {
  // 1. Audit PMO-Ops (Check for overdue tasks or budget drifts)
  const { data: projects } = await supabase.from('pmo_projects').select('*').eq('status', 'active');
  
  // 2. Audit Tech-Ops (Check system latency/logs)
  const { data: logs } = await supabase.from('system_health').select('*').order('created_at', { ascending: false }).limit(5);

  // 3. The "Thinking Engine" analyzes the raw data for Anomalies
  const { text: diagnosis, toolResults } = await generateText({
    model: google('gemini-2.0-flash-001'),
    system: "You are the MARTIN OS Watcher. Analyze the provided project and system data. If you find a bottleneck or risk, generate a 'Signal Alert'.",
    prompt: `Analyze these projects: ${JSON.stringify(projects)} and these logs: ${JSON.stringify(logs)}`,
  });

  // 4. If an anomaly is found, we "Signal" the Dashboard
  if (diagnosis.includes('ALERT')) {
    await supabase.from('os_alerts').insert({
      type: 'ANOMALY_DETECTED',
      severity: 'high',
      content: diagnosis,
      source: 'Signal Watcher v1.0'
    });
  }

  return new Response(JSON.stringify({ status: 'Audit Complete', signal: diagnosis }), { headers: { 'Content-Type': 'application/json' } });
})
