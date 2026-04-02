import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const getOpenAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({ apiKey });
};

export interface AgentTask {
  agent: 'openai';
  task: string;
  context?: any;
}

export interface WorkflowStep {
  id: string;
  description: string;
  agent: 'openai';
  prompt: string;
  dependencies?: string[];
}

export class ApphiaOrchestrator {
  /**
   * Orchestrates a multi-step workflow using OpenAI agents.
   */
  async executeWorkflow(steps: WorkflowStep[], initialContext: any = {}) {
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
  }

  /**
   * Supervise and analyze agent performance or output.
   */
  async supervise(agentOutput: string, criteria: string) {
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
}

export const orchestrator = new ApphiaOrchestrator();
