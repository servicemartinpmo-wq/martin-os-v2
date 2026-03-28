import { strategistAgent } from './strategist'
import { marketingAgent } from './marketing'
import { opsAgent } from './ops'
import { techAgent } from './tech'
import { analystAgent } from './analyst'
import type { AgentName, AgentRequest, AgentExecutionResult } from './types'
import { k2wWorkflowAssemblerPrompt } from './k2w-workflow-assembler'

export const AGENT_PROMPTS = {
  strategist: strategistAgent.prompt,
  marketing: marketingAgent.prompt,
  ops: opsAgent.prompt,
  tech: techAgent.prompt,
  analyst: analystAgent.prompt,
  k2w_workflow_assembler: k2wWorkflowAssemblerPrompt,
} as const

export function routeTask(input: string): AgentName {
  const normalized = input.toLowerCase()

  if (
    normalized.includes('knowledge') ||
    normalized.includes('framework') ||
    normalized.includes('method') ||
    normalized.includes('trigger') ||
    normalized.includes('formula') ||
    normalized.includes('workflow')
  ) {
    return 'k2w'
  }
  if (normalized.includes('strategy')) return 'strategist'
  if (normalized.includes('marketing')) return 'marketing'
  if (normalized.includes('automation')) return 'tech'
  if (normalized.includes('data')) return 'analyst'
  return 'ops'
}

export function runAgent(agent: AgentName, request: AgentRequest): AgentExecutionResult {
  switch (agent) {
    case 'k2w':
      return {
        agent: 'k2w',
        summary:
          'K2W routes through buildWorkflowFromKnowledge in core/knowledge-engine.ts.',
        actions: ['Use getKnowledgeByType + buildWorkflowFromKnowledge + runWorkflow'],
        workflows: ['k2w_generation_pipeline'],
        insights: ['Framework Analyzer -> Method Sequencer -> Trigger Planner -> Formula Integrator -> Assembler'],
      }
    case 'strategist':
      return strategistAgent.run(request)
    case 'marketing':
      return marketingAgent.run(request)
    case 'tech':
      return techAgent.run(request)
    case 'analyst':
      return analystAgent.run(request)
    case 'ops':
    default:
      return opsAgent.run(request)
  }
}
