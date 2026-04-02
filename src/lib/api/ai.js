import { postJson } from '@/lib/api/http'

export function runBrainApi({ appView, context }) {
  return postJson('/api/ai', {
    mode: 'brain',
    context: [
      appView ? `appView: ${appView}` : '',
      typeof context === 'string' ? context : '',
    ]
      .filter(Boolean)
      .join('\n'),
  })
}

export function runOrchestrateApi({ appView, snapshot = '', cognitiveProfileId }) {
  return postJson('/api/ai/orchestrate', {
    appView,
    snapshot,
    cognitiveProfileId,
    stream: false,
  })
}
