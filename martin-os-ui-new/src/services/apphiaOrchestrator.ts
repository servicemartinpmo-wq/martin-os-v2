import { fetchWithLogging } from '../lib/api';

export interface WorkflowStep {
  id: string;
  description: string;
  agent: 'gemini' | 'openai';
  prompt: string;
  dependencies?: string[];
}

export interface SupervisionResult {
  score: number;
  feedback: string;
  approved: boolean;
}

export interface RoutingResult {
  route: string;
  reasoning: string;
}

export const apphiaOrchestrator = {
  /**
   * Executes a multi-step workflow.
   */
  async executeWorkflow(steps: WorkflowStep[], context: any = {}) {
    return await fetchWithLogging('/api/apphia/workflow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ steps, context }),
    });
  },

  /**
   * Supervises an agent's output.
   */
  async supervise(output: string, criteria: string): Promise<SupervisionResult> {
    return await fetchWithLogging('/api/apphia/supervise', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ output, criteria }),
    });
  },

  /**
   * Routes a user query to the appropriate agent.
   */
  async routeQuery(query: string): Promise<RoutingResult> {
    return await fetchWithLogging('/api/apphia/route', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
  },
};
