import { getRegistryEntry } from '@/autonomy/actionRegistry'

/**
 * @param {{ type: string, confidence?: number }} action
 */
export function validateAction(action) {
  const entry = getRegistryEntry(action.type)
  const conf = action.confidence ?? 0
  if (entry.minConfidence != null && conf < entry.minConfidence) {
    return { ok: false, reason: 'below_confidence', entry }
  }
  return { ok: true, entry }
}
