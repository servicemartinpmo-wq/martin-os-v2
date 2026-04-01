/** Client-safe feature flags (NEXT_PUBLIC_*). */

export function isMergeAgentEnabled() {
  return typeof process !== 'undefined' && process.env.NEXT_PUBLIC_MERGE_AGENT === '1'
}

export function isSystemPanelEnabled() {
  return typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SYSTEM_PANEL === '1'
}

export function isCognitiveRouterEnabled() {
  return typeof process !== 'undefined' && process.env.NEXT_PUBLIC_COGNITIVE_ROUTER === '1'
}
