import { isCognitiveRouterEnabled } from '@/lib/featureFlags'
import { getCognitiveProfile } from '@/agents/cognitiveRouter'

/**
 * Generic agent runner — role + data → /api/ai text mode.
 * @param {{ role: string, prompt: string, cognitiveProfileId?: string }} input
 */
export async function runAgent(input) {
  let cognitiveLine = ''
  if (isCognitiveRouterEnabled() && input.cognitiveProfileId) {
    const p = getCognitiveProfile(input.cognitiveProfileId)
    if (p.systemAddendum) cognitiveLine = `Reasoning style: ${p.systemAddendum}\n\n`
  }

  const res = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      mode: 'agent',
      context: `Role: ${input.role}\n\n${cognitiveLine}${input.prompt}`,
    }),
  })
  if (!res.ok) throw new Error(`agent ${res.status}`)
  return res.json()
}
