/** @typedef {{ type: string, requiresApproval: boolean, minConfidence?: number }} RegistryEntry */

/** @type {Record<string, RegistryEntry>} */
export const actionRegistry = {
  notify: { type: 'notify', requiresApproval: false, minConfidence: 0.5 },
  mutate_task: { type: 'mutate_task', requiresApproval: true, minConfidence: 0.85 },
  bulk_import: { type: 'bulk_import', requiresApproval: true, minConfidence: 0.95 },
}

/** @param {string} actionType */
export function getRegistryEntry(actionType) {
  return actionRegistry[actionType] ?? {
    type: actionType,
    requiresApproval: true,
    minConfidence: 0.99,
  }
}
