import type { AgentName, ParsedIntent } from '../agents/types'
import { routeTask } from '../agents/orchestrator'

/**
 * Resolves the agent that should handle a parsed intent.
 */
export function routeAgent(intent: ParsedIntent): AgentName {
  return routeTask(intent.originalInput)
}
