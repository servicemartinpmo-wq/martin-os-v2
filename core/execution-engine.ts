import { runAgent } from '../agents/orchestrator'
import type { BrainExecutionResult } from '../agents/types'
import type { SupabaseLikeClient } from './knowledge-retriever'
import { routeAgent } from './agent-router'
import { parseIntent } from './intent-parser'
import { getKnowledge } from './knowledge-retriever'
import { buildResponse } from './response-builder'

/**
 * Main "brain" path:
 * parse intent -> route -> gather knowledge -> run selected agent -> build response.
 */
export async function executeBrain(
  input: string,
  supabaseClient?: SupabaseLikeClient,
): Promise<BrainExecutionResult> {
  const intent = parseIntent(input)
  const selectedAgent = routeAgent(intent)
  const knowledge = await getKnowledge(selectedAgent, supabaseClient)
  const agentOutput = runAgent(selectedAgent, { rawInput: input, intent, knowledge })
  const response = buildResponse([agentOutput])

  return {
    intent,
    selectedAgent,
    knowledge,
    agentOutput,
    response,
  }
}
