import type { K2WConstraints, K2WKnowledgeCollection, K2WGeneratedWorkflow, K2WWorkflowStep } from './types'
import { analyzeFrameworks } from './k2w-framework-analyzer'
import { sequenceMethods } from './k2w-method-sequencer'
import { planTriggers } from './k2w-trigger-planner'
import { integrateFormulas } from './k2w-formula-integrator'

function inferWorkflowName(constraints?: K2WConstraints): string {
  const domain = constraints?.domain
  if (domain) return `${domain} knowledge workflow`
  return 'Knowledge workflow'
}

function toCursorPlan(steps: K2WWorkflowStep[]): string[] {
  return steps.map(
    (step) =>
      `run_step id=${step.step_id} type=${step.type} depends_on=${(step.depends_on ?? []).join(',')}`,
  )
}

function validateCompatibility(steps: K2WWorkflowStep[]) {
  const warnings: string[] = []
  const produced = new Set<string>()

  for (const step of steps) {
    for (const inputName of Object.keys(step.inputs ?? {})) {
      if (inputName !== 'context' && !produced.has(inputName)) {
        warnings.push(`Input "${inputName}" for ${step.step_id} is not produced by prior steps.`)
      }
    }
    for (const outputName of Object.keys(step.outputs ?? {})) {
      produced.add(outputName)
    }
  }

  return {
    compatible: warnings.length === 0,
    warnings,
  }
}

function buildDag(steps: K2WWorkflowStep[]) {
  const nodes = steps.map((step) => ({
    id: step.step_id,
    label: step.name,
    type: step.type,
  }))

  const edges = steps.flatMap((step) =>
    (step.depends_on ?? []).map((dep) => ({
      from: dep,
      to: step.step_id,
    })),
  )

  return { nodes, edges }
}

export const k2wWorkflowAssemblerPrompt = `
You are the Workflow Assembler (Master Agent).

Combine outputs from:
- Framework Analyzer
- Method Sequencer
- Trigger Planner
- Formula Integrator

Output:
- Final workflow JSON
- Visual DAG representation
- Cursor-executable plan
`

export function buildWorkflowFromKnowledge(
  knowledge: K2WKnowledgeCollection,
  constraints?: K2WConstraints,
): K2WGeneratedWorkflow {
  const frameworkAnalysis = analyzeFrameworks(knowledge.frameworks, constraints?.domain)
  const methodSequence = sequenceMethods(knowledge.methods, [], constraints)

  const frameworkSteps: K2WWorkflowStep[] = frameworkAnalysis.orderedSteps.map((step) => ({
    step_id: step.step_id,
    name: step.name,
    type: 'framework_step',
    reference_id: step.reference_id,
    inputs: step.inputs,
    outputs: step.outputs,
  }))

  const methodSteps: K2WWorkflowStep[] = methodSequence.sequencedMethods.map((step) => ({
    step_id: step.id,
    name: step.name,
    type: 'method',
    reference_id: step.references?.methodId ?? step.id,
    inputs: Object.fromEntries(step.inputs.map((input) => [input, input])),
    outputs: Object.fromEntries(step.outputs.map((output) => [output, output])),
    depends_on: step.dependsOn,
  }))

  const formulaSteps = integrateFormulas(
    knowledge.formulas,
    methodSequence.sequencedMethods.map((step) => step.id),
  )
  const triggerSteps = planTriggers(
    knowledge.triggers,
    methodSequence.sequencedMethods,
    constraints,
  )

  const steps = [...frameworkSteps, ...methodSteps, ...formulaSteps, ...triggerSteps]
  const validation = validateCompatibility(steps)

  return {
    workflow_name: inferWorkflowName(constraints),
    steps,
    dag: buildDag(steps),
    cursor_plan: toCursorPlan(steps),
    meta: {
      priority: constraints?.priority ?? 'medium',
      complexity: constraints?.complexity ?? 'medium',
      optimize_for: constraints?.optimize_for ?? 'execution',
      domain: constraints?.domain,
      goals: constraints?.goals ?? [],
      validation,
    },
  }
}
