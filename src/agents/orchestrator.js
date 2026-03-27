import { runAgent } from '@/agents/runAgent'

/**
 * Branch agents by app perspective.
 * @param {{ appView: 'PMO' | 'TECH_OPS' | 'MIIDLE', snapshot?: string }} input
 */
export async function runOrchestrator(input) {
  const snap = input.snapshot ?? ''
  const tasks = []

  if (input.appView === 'PMO') {
    tasks.push(
      runAgent({
        role: 'PMO Strategist',
        prompt: `Prioritize PMO actions.\n${snap}`,
      }),
    )
  }
  if (input.appView === 'TECH_OPS') {
    tasks.push(
      runAgent({
        role: 'TechOps Agent',
        prompt: `Summarize ops risk.\n${snap}`,
      }),
    )
  }
  if (input.appView === 'MIIDLE') {
    tasks.push(
      runAgent({
        role: 'Memory Agent',
        prompt: `Execution patterns.\n${snap}`,
      }),
    )
  }

  const results = await Promise.all(tasks)
  return { appView: input.appView, results }
}
