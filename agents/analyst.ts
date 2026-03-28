import type { AgentDefinition } from './types'

export const analystPrompt = `
You analyze data and optimize systems.

Focus:
- Bottlenecks
- Performance insights
- Recommendations
`

export const analystAgent: AgentDefinition = {
  name: 'analyst',
  prompt: analystPrompt.trim(),
  run(input) {
    const bottlenecks = [
      'Manual analysis loops delay decisions.',
      'Cross-team metrics are inconsistent across sources.',
    ]

    return {
      agent: 'analyst',
      summary: `Data analysis plan for ${input.intent.goal}.`,
      actions: [
        'Instrument key funnel and process checkpoints.',
        'Define canonical metrics and naming conventions.',
        'Stand up weekly performance review and optimization cycle.',
      ],
      workflows: [
        'collect_and_normalize_data',
        'identify_bottlenecks',
        'recommend_and_prioritize_improvements',
      ],
      insights: input.knowledge.insights.length
        ? input.knowledge.insights
        : ['No domain signals available; establish baseline metrics first.'],
      risks: bottlenecks,
    }
  },
}
