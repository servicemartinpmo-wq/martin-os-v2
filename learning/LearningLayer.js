/**
 * Learning layer — append-only decision/outcome events on server (`/api/learning`).
 * Demo store is in-memory in the API route; replace with DB / KV for production.
 */

export async function recordLearningEvent(payload) {
  const res = await fetch('/api/learning', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload ?? {}),
  })
  if (!res.ok) throw new Error(`learning ${res.status}`)
  return res.json()
}

export async function fetchLearningEvents() {
  const res = await fetch('/api/learning')
  if (!res.ok) throw new Error(`learning ${res.status}`)
  return res.json()
}

/** @deprecated use recordLearningEvent */
export async function recordDecisionStub() {
  return { ok: false, reason: 'use_recordLearningEvent' }
}
