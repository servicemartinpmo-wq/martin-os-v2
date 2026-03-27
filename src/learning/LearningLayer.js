/**
 * Learning layer — append-only decision/outcome events belong on the server.
 * Do not use a client singleton array for production learning.
 */

export async function recordDecisionStub() {
  return { ok: false, reason: 'configure_persistent_learning_store' }
}
