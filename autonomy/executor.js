import { dispatchAction } from '@/brain/actionEngine'

/** Server-only in production — stub executes no external side effects. */
export async function execute(action) {
  return dispatchAction(
    /** @type {{ type: string, payload?: Record<string, unknown> }} */ (action),
  )
}
