import { runAgent } from '@/agents/runAgent'

/**
 * Branch agents by app perspective.
 * @param {{ appView: 'PMO' | 'TECH_OPS' | 'MIIDLE', snapshot?: string, cognitiveProfileId?: string }} input
 */
export async function runOrchestrator(input) {
  const snap = input.snapshot ?? ''
  const cog = input.cognitiveProfileId
  const tasks = []

  if (input.appView === 'PMO') {
    tasks.push(
      runAgent({
        role: 'PMO Strategist',
        cognitiveProfileId: cog,
        prompt: `Prioritize PMO actions.\n${snap}`,
      }),
    )
    tasks.push(
      runAgent({
        role: 'Growth Agent',
        cognitiveProfileId: cog,
        prompt: `List growth risks and experiments relevant to PMO context.\n${snap}`,
      }),
    )
  }
  if (input.appView === 'TECH_OPS') {
    tasks.push(
      runAgent({
        role: 'TechOps Agent',
        cognitiveProfileId: cog,
        prompt: `Summarize ops risk.\n${snap}`,
      }),
    )
  }
  if (input.appView === 'MIIDLE') {
    tasks.push(
      runAgent({
        role: 'Memory Agent',
        cognitiveProfileId: cog,
        prompt: `Execution patterns.\n${snap}`,
      }),
    )
  }

  const results = await Promise.all(tasks)
  return { appView: input.appView, results }
}
