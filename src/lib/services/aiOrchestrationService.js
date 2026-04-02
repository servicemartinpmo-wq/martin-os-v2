const VALID_VIEWS = new Set(['PMO', 'TECH_OPS', 'MIIDLE'])

export function buildOrchestrationPlan(appView, snapshot = '') {
  const view = VALID_VIEWS.has(appView) ? appView : 'PMO'
  const snap = typeof snapshot === 'string' ? snapshot : ''
  if (view === 'PMO') {
    return [
      { role: 'PMO Strategist', prompt: `Prioritize PMO actions.\n${snap}` },
      { role: 'Growth Agent', prompt: `List growth risks and experiments relevant to PMO context.\n${snap}` },
    ]
  }
  if (view === 'TECH_OPS') {
    return [{ role: 'TechOps Agent', prompt: `Summarize ops risk.\n${snap}` }]
  }
  return [{ role: 'Memory Agent', prompt: `Execution patterns.\n${snap}` }]
}
