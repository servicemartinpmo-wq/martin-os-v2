import { runAgent } from '@/agents/runAgent'
import { readContext } from '@/agents/bus/contextBus'

/** Second pass with shared context string — client-safe. */
export async function runAwareAgent(role, prompt) {
  const ctx = readContext()
  return runAgent({
    role,
    prompt: `${prompt}\n\nShared context:\n${ctx.slice(0, 4000)}`,
  })
}
