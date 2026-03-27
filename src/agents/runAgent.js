/**
 * Generic agent runner — role + data → /api/ai text mode.
 * @param {{ role: string, prompt: string }} input
 */
export async function runAgent(input) {
  const res = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      mode: 'agent',
      context: `Role: ${input.role}\n\n${input.prompt}`,
    }),
  })
  if (!res.ok) throw new Error(`agent ${res.status}`)
  return res.json()
}
