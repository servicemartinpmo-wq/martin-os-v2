import { GoogleGenAI } from "@google/genai";
import { supabase } from "../../../server/supabase.js";

const isPlaceholderKey = (key: string | undefined) => {
  if (!key) return true;
  const k = key.trim();
  return k === 'MY_GEMINI_API_KEY' || k === 'YOUR_API_KEY' || k === 'PASTE_YOUR_KEY_HERE' || k === 'sk-...' || k === 'AIza...';
};

export async function runLearningEngine() {
  console.log("[LearningEngine] Starting analysis...");

  if (!supabase) {
    console.error("[LearningEngine] Supabase not configured.");
    return;
  }

  const apiKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY)?.trim();
  if (isPlaceholderKey(apiKey)) {
    console.warn("[LearningEngine] Gemini API Key is not configured or is a placeholder.");
    return;
  }
  const ai = new GoogleGenAI({ apiKey: apiKey! });

  // 1. Fetch recent logs and actions
  const { data: logs } = await supabase.from('agent_logs').select('*').limit(50);
  const { data: actions } = await supabase.from('user_actions').select('*').limit(50);

  // 2. Analyze patterns
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `Analyze these logs and actions to find repeating patterns or bottlenecks: 
    Logs: ${JSON.stringify(logs)}
    Actions: ${JSON.stringify(actions)}
    If a pattern repeats > 5 times, suggest a workflow.`,
    config: {
      responseMimeType: "application/json",
    }
  });

  const analysis = JSON.parse(response.text || "{}");

  // 3. Adapt: If pattern found, create workflow
  if (analysis.suggestedWorkflow) {
    await supabase.from('workflows').insert({
      trigger_event: analysis.suggestedWorkflow.trigger,
      actions: analysis.suggestedWorkflow.actions
    });
    console.log("[LearningEngine] Created new workflow:", analysis.suggestedWorkflow);
  }
}
