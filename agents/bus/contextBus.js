/** In-memory agent output bus — demo only */

/** @type {string[]} */
let buffer = []

/** @param {string} chunk */
export function publishContext(chunk) {
  buffer = [chunk, ...buffer].slice(0, 100)
}

export function readContext() {
  return buffer.join('\n---\n')
}

export function clearContextBus() {
  buffer = []
}
