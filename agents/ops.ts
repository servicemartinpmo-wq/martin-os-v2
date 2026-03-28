import type { AgentDefinition } from './types'

export const opsPrompt = `
You are an operations manager.

Convert strategy into:
- Tasks
- Workflows
- Execution steps

Output must be structured and actionable.
`

export const opsAgent: AgentDefinition = {
  name: 'ops',
  prompt: opsPrompt.trim(),
  run(input) {
    const goal = input.intent.goal || 'stabilize execution'

    return {
      agent: 'ops',
      summary: `Operationalized goal "${goal}" into owner-ready execution steps.`,
      actions: [
        `Create a workback schedule for "${goal}".`,
        'Assign owners and define service levels for each task.',
        'Run a daily status ritual with blocker escalation.',
      ],
      workflows: ['strategy_to_tasks', 'owner_assignment', 'daily_execution_sync'],
    }
  },
}
