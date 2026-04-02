import { generateText } from 'ai'
import {
  AiOrchestrateRequestSchema,
  AiOrchestrateResponseSchema,
} from '@/lib/contracts/aiContracts'
import { buildOrchestrationPlan } from '@/lib/services/aiOrchestrationService'
import { jsonRoute } from '@/lib/http/zodRoute'

export const runtime = 'nodejs'

async function runAgentPass(task) {
  try {
    const { text } = await generateText({
      model: 'openai/gpt-5.4-mini',
      system:
        'You are a helpful assistant for Martin OS. Return concise JSON only: {"summary":string,"priorities":[{"title":string,"confidence":number}],"risks":[{"label":string,"severity":"warning"|"error"}]}. No markdown.',
      prompt: `Role: ${task.role}\n\n${task.prompt}`,
    })
    try {
      const parsed = JSON.parse(text)
      return { role: task.role, ...parsed, mock: false }
    } catch {
      return { role: task.role, raw: text, parseError: true, mock: false }
    }
  } catch {
    return {
      role: task.role,
      mock: true,
      summary: `Offline fallback for ${task.role}.`,
      priorities: [{ title: `Review ${task.role} output manually`, confidence: 0.5 }],
      risks: [{ label: 'AI gateway unavailable', severity: 'warning' }],
    }
  }
}

async function handler({ body }) {
  const plan = buildOrchestrationPlan(body.appView, body.snapshot)
  const results = await Promise.all(plan.map((task) => runAgentPass(task)))
  return {
    appView: body.appView,
    mode: 'orchestrate',
    source: 'next-api',
    results,
  }
}

export const POST = jsonRoute({
  requestSchema: AiOrchestrateRequestSchema,
  responseSchema: AiOrchestrateResponseSchema,
  handler,
})
