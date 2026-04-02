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

  const res = await fetch('/api/ai/orchestrate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      appView: opts.appView ?? 'PMO',
      snapshot: context,
      stream: false,
    }),
  })

  if (!res.ok) {
    throw new Error(`brain ${res.status}`)
  }

  const payload = await res.json()
  const first = Array.isArray(payload?.results) ? payload.results[0] : null
  return first ?? { mock: true, summary: 'No orchestration result returned.' }
}
