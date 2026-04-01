/** In-memory queue — must become persistent for multi-instance. */

/** @typedef {{ id: string, action: unknown, status: 'pending' | 'approved' | 'rejected' }} QueueItem */

/** @type {QueueItem[]} */
let queue = []

/** @param {unknown} action */
export function addToQueue(action) {
  const item = {
    id: `q-${Date.now()}`,
    action,
    status: /** @type {'pending'} */ ('pending'),
  }
  queue = [...queue, item]
  return item
}

export function listQueue() {
  return [...queue]
}

/** @param {string} id */
export function approve(id) {
  queue = queue.map((q) =>
    q.id === id ? { ...q, status: /** @type {'approved'} */ ('approved') } : q,
  )
}
