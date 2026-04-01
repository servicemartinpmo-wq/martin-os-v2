/**
 * Maps action types to server routes — stubs until APIs exist.
 * @typedef {{ type: string, payload?: Record<string, unknown> }} Action
 */

/** @param {Action} action */
export async function dispatchAction(action) {
  switch (action.type) {
    case 'notify':
      return { ok: true, stub: true, action }
    case 'open_route':
      return { ok: true, stub: true, action }
    default:
      return { ok: false, error: 'unknown_action', action }
  }
}
