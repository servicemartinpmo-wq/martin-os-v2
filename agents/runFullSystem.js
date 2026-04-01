import { runOrchestrator } from '@/agents/orchestrator'
import { publishContext } from '@/agents/bus/contextBus'
import { isMergeAgentEnabled } from '@/lib/featureFlags'

/**
 * Initial orchestration + publish to context bus (demo).
 * Do not call in tight render loops — debounce from UI.
 */
export async function runFullSystem(snapshot, appView, opts = {}) {
  const out = await runOrchestrator({
    appView,
    snapshot,
    cognitiveProfileId: opts.cognitiveProfileId,
  })
  let mergeLayer = null
  if (isMergeAgentEnabled() && out.results?.length > 1) {
    try {
      const res = await fetch('/api/merge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payloads: out.results }),
      })
      if (res.ok) mergeLayer = await res.json()
    } catch {
      /* non-fatal */
    }
  }
  const toBus = mergeLayer?.merged ? { ...out, merged: mergeLayer.merged } : out
  publishContext(JSON.stringify(toBus ?? {}).slice(0, 8000))
  return mergeLayer ? { ...out, mergeResult: mergeLayer } : out
}
