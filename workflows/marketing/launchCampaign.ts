import type { WorkflowStep } from '../../agents/types'

export const launchCampaign: WorkflowStep[] = [
  { step: 'define audience' },
  { step: 'generate content' },
  { step: 'publish' },
  { step: 'track metrics' },
]
