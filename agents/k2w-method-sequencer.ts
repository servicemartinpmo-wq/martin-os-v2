import type {
  K2WConstraints,
  K2WKnowledgeInput,
  K2WStepTemplate,
} from './types'

function complexityBoost(complexity?: K2WConstraints['complexity']): number {
  if (complexity === 'high') return 2
  if (complexity === 'medium') return 1
  return 0
}

export function sequenceMethods(
  methods: K2WKnowledgeInput[],
  frameworkSteps: K2WStepTemplate[],
  constraints?: K2WConstraints,
): K2WStepTemplate[] {
  const boost = complexityBoost(constraints?.complexity)

  const sorted = methods
    .slice()
    .sort(
      (a, b) =>
        (a.dependencies?.length ?? 0) +
        boost -
        ((b.dependencies?.length ?? 0) + boost),
    )

  const steps: K2WStepTemplate[] = sorted.map((method, index) => ({
    id: method.id,
    name: method.name,
    type: 'method',
    order: frameworkSteps.length + index + 1,
    inputs: method.requiredInputs ?? ['context'],
    outputs: method.outputs ?? ['method_output'],
    references: {
      methodId: method.id,
    },
    dependsOn: method.dependencies ?? [],
  }))

  return steps
}
