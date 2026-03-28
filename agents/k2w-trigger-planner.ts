import type {
  K2WConstraints,
  K2WKnowledgeInput,
  K2WStepTemplate,
  K2WWorkflowStep,
} from './types'

function timingByPriority(priority: K2WConstraints['priority']) {
  if (priority === 'high') return 'before_step'
  if (priority === 'low') return 'after_step'
  return 'parallel'
}

function listToInputRecord(values: string[] | undefined) {
  return (values ?? ['workflow_context']).reduce(
    (acc, value) => {
      acc[value] = value
      return acc
    },
    {} as Record<string, string>,
  )
}

function listToOutputRecord(values: string[] | undefined) {
  return (values ?? ['trigger_result']).reduce(
    (acc, value) => {
      acc[value] = value
      return acc
    },
    {} as Record<string, string>,
  )
}

export function planTriggers(
  triggers: K2WKnowledgeInput[],
  methodPlan: K2WStepTemplate[],
  constraints?: K2WConstraints,
): K2WWorkflowStep[] {
  if (!triggers.length) return []

  const defaultAttach = methodPlan[methodPlan.length - 1]?.id
  const timing = timingByPriority(constraints?.priority)

  return triggers.map((trigger, index) => {
    const attachTo =
      methodPlan[Math.min(index, Math.max(methodPlan.length - 1, 0))]?.id ??
      defaultAttach

    return {
      step_id: `t${index + 1}`,
      name: trigger.name,
      type: 'trigger',
      trigger_id: trigger.id,
      inputs: Object.fromEntries(
        (trigger.inputs ?? ['workflow_context']).map((key) => [key, key]),
      ),
      outputs: Object.fromEntries(
        (trigger.outputs ?? ['trigger_result']).map((key) => [key, key]),
      ),
      inputs: listToInputRecord(trigger.inputs),
      outputs: listToOutputRecord(trigger.outputs),
      action: trigger.action ?? (attachTo ? `run_step:${attachTo}` : 'run_workflow'),
      // Keep the timing hint in condition for simple downstream handling.
      depends_on: attachTo ? [attachTo] : undefined,
      condition: {
        ...(trigger.condition ?? { enabled: true }),
        timing,
      },
    }
  })
}
