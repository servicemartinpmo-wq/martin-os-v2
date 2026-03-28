import type { K2WKnowledgeInput, K2WWorkflowStep } from './types'

export interface K2WFrameworkAnalysis {
  orderedSteps: K2WWorkflowStep[]
  requiredInputs: string[]
  diagnostics: string[]
}

function toFrameworkStep(
  framework: K2WKnowledgeInput,
  index: number,
): K2WWorkflowStep {
  const inputs = framework.requiredInputs ?? ['context']
  const outputs = framework.outputs ?? [`${framework.id}_output`]

  return {
    step_id: `fw${index + 1}`,
    name: framework.name,
    type: 'framework_step',
    reference_id: framework.id,
    inputs: Object.fromEntries(inputs.map((key) => [key, key])),
    outputs: Object.fromEntries(outputs.map((key) => [key, key])),
  }
}

export function analyzeFrameworks(
  frameworks: K2WKnowledgeInput[],
  domain?: string,
): K2WFrameworkAnalysis {
  const scoped = domain
    ? frameworks.filter((framework) => !framework.domain || framework.domain === domain)
    : frameworks
  const selected = scoped.length ? scoped : frameworks

  const orderedSteps = selected.map((framework, index) =>
    toFrameworkStep(framework, index),
  )

  return {
    orderedSteps,
    requiredInputs: Array.from(
      new Set(selected.flatMap((framework) => framework.requiredInputs ?? ['context'])),
    ),
    diagnostics: [`Analyzed ${selected.length} frameworks.`],
  }
}
