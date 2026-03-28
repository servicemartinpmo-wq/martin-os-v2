import type { AgentDefinition } from './types'

export const strategistPrompt = `
You are a high-level business strategist.

Use:
- First principles thinking
- Game theory
- Market dynamics

Input:
- Business context
- Goals

Output:
- Strategy
- Risks
- Opportunities
- Action plan
`

export const strategistAgent: AgentDefinition = {
  name: 'strategist',
  prompt: strategistPrompt.trim(),
  run(request) {
    const goal = request.intent.goal || 'define a strategic objective'
    const domain = request.intent.domain || 'business'

    return {
      agent: 'strategist',
      summary: `Strategy framed for goal "${goal}" in ${domain}.`,
      actions: [
        'Define one core thesis and one anti-thesis.',
        'Model upside, downside, and reversibility for top initiatives.',
        'Set measurable 30/60/90-day leading indicators.',
      ],
      workflows: [
        'strategic_thesis_definition',
        'initiative_prioritization',
        'cadence_and_governance',
      ],
      risks: [
        'Execution drift from strategic thesis.',
        'Short-term decisions can erode long-term positioning.',
      ],
      opportunities: [
        'Asymmetric bets with capped downside.',
        'Market whitespace can be captured via differentiated narrative and speed.',
      ],
    }
  },
}
