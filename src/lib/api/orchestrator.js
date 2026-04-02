import { postJson } from '@/lib/api/http'

/**
 * Universal orchestration entrypoint for React + future WeWeb.
 */
export async function runOrchestratorApi(input) {
  const appView = input?.appView ?? 'PMO'
  const payload = {
    appView,
    cognitiveProfileId: input?.cognitiveProfileId,
    snapshot: input?.snapshot ?? '',
  }
  return postJson('/api/ai/orchestrate', payload)
}
