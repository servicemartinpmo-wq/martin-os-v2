import OpenAI from "openai";
import { analyzeData } from "./analysis";
import { makeDecision } from "./decision";
import { executeAutomation } from "./automation";
import { storePattern } from "./memory";

const getOpenAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({ apiKey });
};

export interface WorkflowStep {
  id: string;
  description: string;
  agent: 'openai';
  prompt: string;
  dependencies?: string[];
}

export const orchestrator = {
  orchestrate: async (action: string, payload: any, userId: string) => {
    const analysis = await analyzeData(action, payload);
    const decision = await makeDecision(action, payload, analysis);
    const automation = await executeAutomation(action, payload, decision);
    await storePattern(action, payload, { analysis, decision, automation }, userId);
    return { analysis, decision, automation };
  },
  executeWorkflow: async (steps: WorkflowStep[], initialContext: any = {}) => {
    const results: Record<string, any> = { ...initialContext };
    
    for (const step of steps) {
      console.log(`[Apphia] Executing step: ${step.id} (${step.description})`);
      
      // Build prompt from context
      let finalPrompt = step.prompt;
      for (const [key, value] of Object.entries(results)) {
        const placeholder = `{{${key}}}`;
        if (finalPrompt.includes(placeholder)) {
          finalPrompt = finalPrompt.replace(placeholder, typeof value === 'string' ? value : JSON.stringify(value));
        }
      }

      const openai = getOpenAIClient();
      if (!openai) throw new Error('OpenAI API Key is not configured on the server.');
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: finalPrompt }],
      });
      const response = completion.choices[0].message.content;

      results[step.id] = response;
    }

    return results;
  },
  supervise: async (agentOutput: string, criteria: string) => {
    const openai = getOpenAIClient();
    if (!openai) throw new Error('OpenAI API Key is not configured on the server.');
    const prompt = `As the Apphia Orchestrator, supervise the following agent output based on these criteria: ${criteria}. 
    Output: ${agentOutput}
    Provide a score (0-100) and feedback in JSON format with keys: score, feedback, approved.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: "json_object" }
    });

    return JSON.parse(completion.choices[0].message.content || '{}');
  }
};
