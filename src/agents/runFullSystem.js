import { runOrchestrator } from '@/agents/orchestrator'
import { publishContext } from '@/agents/bus/contextBus'

/**
 * Initial orchestration + publish to context bus (demo).
 * Do not call in tight render loops — debounce from UI.
 */
export async function runFullSystem(snapshot, appView) {
  const out = await runOrchestrator({ appView, snapshot })
  publishContext(JSON.stringify(out.results ?? []).slice(0, 8000))
  return out
}
