import type { WorkflowStep } from '../../agents/types'

export const opsExecutionWorkflow: WorkflowStep[] = [
  { step: 'break strategy into deliverables' },
  { step: 'assign owners and deadlines' },
  { step: 'map dependencies and blockers' },
  { step: 'run execution cadence and status reviews' },
]
