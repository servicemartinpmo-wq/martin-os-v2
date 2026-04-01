import { isAutonomyEnabled } from '@/autonomy/flags'
import { validateAction } from '@/autonomy/validateAction'
import { addToQueue } from '@/autonomy/approvalQueue'
import { execute } from '@/autonomy/executor'

/**
 * @param {{ type: string, confidence?: number, payload?: unknown }} decision
 */
export async function runAutonomy(decision) {
  if (!isAutonomyEnabled()) {
    return { ran: false, reason: 'autonomy_disabled' }
  }

  const v = validateAction(decision)
  if (!v.ok) {
    return { ran: false, reason: v.reason }
  }

  if (v.entry.requiresApproval) {
    const item = addToQueue(decision)
    return { ran: false, queued: item }
  }

  const out = await execute(decision)
  return { ran: true, out }
}
