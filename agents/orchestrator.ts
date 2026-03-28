import { strategistAgent } from './strategist'
import { marketingAgent } from './marketing'
import { opsAgent } from './ops'
import { techAgent } from './tech'
import { analystAgent } from './analyst'
import type { AgentName, AgentRequest, AgentExecutionResult } from './types'

export const AGENT_PROMPTS = {
  strategist: strategistAgent.prompt,
  marketing: marketingAgent.prompt,
  ops: opsAgent.prompt,
  tech: techAgent.prompt,
  analyst: analystAgent.prompt,
}

export function routeTask(input: string): AgentName {
  const normalized = input.toLowerCase()

  if (normalized.includes('strategy')) return 'strategist'
  if (normalized.includes('marketing')) return 'marketing'
  if (normalized.includes('automation')) return 'tech'
  if (normalized.includes('data')) return 'analyst'
  return 'ops'
}

export function runAgent(agent: AgentName, request: AgentRequest): AgentExecutionResult {
  switch (agent) {
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
