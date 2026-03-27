/**
 * In-memory event bus for demo / Miiddle stream.
 * Replace with POST /api/memory + persistence.
 */

/** @typedef {{ id: string, ts: number, type: string, summary: string }} MemoryEvent */

/** @type {MemoryEvent[]} */
let events = []

const MAX = 200

/** @param {Omit<MemoryEvent, 'id' | 'ts'> & { id?: string }} e */
export function pushMemoryEvent(e) {
  const row = {
    id: e.id ?? `mem-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    ts: Date.now(),
    type: e.type,
    summary: e.summary,
  }
  events = [row, ...events].slice(0, MAX)
  return row
}

export function getRecentMemory(limit = 50) {
  return events.slice(0, limit)
}

export function clearMemoryDemo() {
  events = []
}
