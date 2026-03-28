import type { K2WKnowledgeInput, K2WWorkflowStep } from './types'

function mapFormulaStep(
  formula: K2WKnowledgeInput,
  index: number,
  dependsOn: string[],
): K2WWorkflowStep {
  const formulaId = formula.id || `formula_${index + 1}`
  const name = formula.name || `Formula ${index + 1}`
  const inputKeys = formula.inputs?.length ? formula.inputs : ['input']
  const outputKeys = formula.outputs?.length ? formula.outputs : ['result']

  return {
    step_id: `f${index + 1}`,
    name,
    type: 'formula',
    formula_id: formulaId,
    formula: formula.formula || `${inputKeys[0]} -> ${outputKeys[0]}`,
    inputs: Object.fromEntries(inputKeys.map((key) => [key, key])),
    outputs: Object.fromEntries(outputKeys.map((key) => [key, key])),
    depends_on: dependsOn,
  }
}

export function integrateFormulas(
  formulas: K2WKnowledgeInput[],
  methodStepIds: string[],
): K2WWorkflowStep[] {
  return formulas.map((formula, index) =>
    mapFormulaStep(formula, index, methodStepIds.length ? [methodStepIds[methodStepIds.length - 1]] : []),
  )
}
