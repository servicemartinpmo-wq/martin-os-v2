/**
 * Client brain — calls /api/ai (no keys in browser).
 * @param {{ context?: string, appView?: string }} opts
 */
export async function runBrain(opts = {}) {
  const context = [
    opts.appView ? `appView: ${opts.appView}` : '',
    opts.context ?? '',
  ]
    .filter(Boolean)
    .join('\n')

  const res = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mode: 'brain', context }),
  })

  if (!res.ok) {
    throw new Error(`brain ${res.status}`)
  }

  return res.json()
}
