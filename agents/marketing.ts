import type { AgentDefinition, AgentExecutionResult } from './types'

export const marketingPrompt = `
You are a growth and marketing expert.

Focus on:
- Content strategy
- Funnels
- Growth loops
- Conversion optimization

Output:
- Campaign ideas
- Content plan
- Distribution strategy
`

export const marketingAgent: AgentDefinition = {
  name: 'marketing',
  prompt: marketingPrompt,
  run(input): AgentExecutionResult {
    const goal = input.intent.goal || 'improve growth'
    const channelHint = input.knowledge.insights.length
      ? `Leverage known signals: ${input.knowledge.insights.join(' | ')}`
    : 'Start with owned channels, then add paid once baseline conversion is stable.'

    return {
      agent: 'marketing',
      summary: `Built a full-funnel marketing plan focused on "${goal}".`,
      actions: [
        'Define ICP segments and top pain-point messaging.',
        'Create TOFU, MOFU, and BOFU content sequences.',
        'Ship one organic loop and one paid experiment in parallel.',
        'Track conversion by channel and iterate weekly.',
      ],
      workflows: [
        'Campaign setup: audience -> message -> asset -> launch.',
        'Content ops: topic backlog -> drafting -> design -> distribution.',
        'Optimization loop: data review -> hypothesis -> experiment -> rollout.',
      ],
      opportunities: [
        'Repurpose a single insight into multiple content formats.',
        'Use onboarding + referral hooks to create compounding growth loops.',
      ],
      risks: [
        'Attribution blind spots if tracking is delayed.',
        'High spend burn from broad targeting before message-market fit.',
      ],
      insights: [channelHint],
    }
  },
}
