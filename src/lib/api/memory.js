import { fetchJson } from '@/lib/api/http'

export function fetchMemory(limit = 100) {
  return fetchJson(`/api/memory?limit=${Math.max(1, Number(limit) || 100)}`)
}

export async function listMemoryEvents(limit = 100) {
  const payload = await fetchMemory(limit)
  return Array.isArray(payload?.events) ? payload.events : []
}

export function pushMemoryEvent(payload) {
  return fetchJson('/api/memory', {
    method: 'POST',
    body: JSON.stringify(payload ?? {}),
  })
}
