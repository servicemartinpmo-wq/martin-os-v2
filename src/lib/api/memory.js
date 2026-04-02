import { fetchJson } from '@/lib/api/http'

export function fetchMemory(limit = 100) {
  return fetchJson(`/api/memory?limit=${Math.max(1, Number(limit) || 100)}`)
}

export function pushMemoryEvent(payload) {
  return fetchJson('/api/memory', {
    method: 'POST',
    body: JSON.stringify(payload ?? {}),
  })
}
