import type { AgentExecutionResult, BrainResponse } from '../agents/types'

export function buildResponse(outputs: AgentExecutionResult[]): BrainResponse {
  if (!outputs.length) {
    return {
      summary: '',
      actions: [],
      workflows: [],
    }
  }

  const actions = outputs.flatMap((output) => output.actions)
  const workflows = outputs.flatMap((output) => output.workflows)

  return {
    summary: outputs.map((output) => output.summary).join(' '),
    actions,
    workflows,
  }
}
