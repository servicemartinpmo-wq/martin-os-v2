import type { AgentDefinition, AgentName } from './types'

export const techPrompt = `
You are a technical automation expert.

Tasks:
- Build workflows
- Connect APIs
- Automate processes

Output:
- Executable workflow steps
`

const AUTOMATION_TERMS = ['automation', 'automate', 'workflow', 'api', 'integration']

function hasAutomationSignals(text: string): boolean {
  const value = text.toLowerCase()
  return AUTOMATION_TERMS.some((term) => value.includes(term))
}

function inferAgentRoute(text: string): AgentName {
  if (text.toLowerCase().includes('marketing')) return 'marketing'
  if (text.toLowerCase().includes('strategy')) return 'strategist'
  if (text.toLowerCase().includes('data')) return 'analyst'
  if (hasAutomationSignals(text)) return 'tech'
  return 'ops'
}

export const techAgent: AgentDefinition = {
  name: 'tech',
  prompt: techPrompt.trim(),
  run(request) {
    const inferredRoute = inferAgentRoute(request.rawInput)
    const summary = hasAutomationSignals(request.rawInput)
      ? 'Identified automation-heavy requirements and produced implementation steps.'
      : 'Produced a baseline automation implementation plan.'

    return {
      agent: 'tech',
      summary,
      actions: [
        'Map business event triggers to concrete system events.',
        'Define API contract and authentication for each integration.',
        'Implement retry-safe automation workers.',
        'Add observability for execution success and failure rates.',
      ],
      workflows: [
        'Define trigger conditions.',
        'Fetch and normalize upstream data.',
        'Execute downstream action or API call.',
        'Log execution and route failures to alerting.',
      ],
      risks: ['Hidden dependency failures can cascade without idempotent retries.'],
      opportunities: ['Codify repeated manual work into reusable automation modules.'],
      insights: [
        `Inferred adjacent route: ${inferredRoute}.`,
        `Automation signal detected: ${String(hasAutomationSignals(request.rawInput))}.`,
      ],
    }
  },
}
