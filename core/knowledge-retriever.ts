import type { AgentName, KnowledgePacket } from '../agents/types'

export interface SupabaseLikeClient {
  from: (table: string) => {
    select: (columns: string) => {
      eq: (column: string, value: string) => Promise<{ data: unknown[] | null; error: unknown }>
    }
  }
}

const VALID_DOMAINS: AgentName[] = ['strategist', 'marketing', 'ops', 'tech', 'analyst']

const STATIC_KNOWLEDGE: Record<string, string[]> = {
  marketing: [
    'Use a full-funnel model that ties channels to activation metrics.',
    'Run one paid and one organic experiment per cycle for signal diversity.',
  ],
  strategist: [
    'Clarify strategic thesis before selecting initiatives.',
    'Model upside and downside with explicit assumptions.',
  ],
  tech: [
    'Treat automation workflows as idempotent and observable.',
    'Define retries, backoff, and dead-letter handling before launch.',
  ],
  analyst: [
    'Instrument event taxonomy first to prevent data fragmentation.',
    'Prioritize leading indicators over lagging-only dashboards.',
  ],
  ops: [
    'Assign explicit owners and SLAs for each workflow stage.',
    'Use daily execution checks and weekly retrospective reviews.',
  ],
}

function normalizeRows(data: unknown[] | null): string[] {
  if (!data) return []

  return data
    .map((row) => {
      if (!row || typeof row !== 'object') return ''
      const rowRecord = row as Record<string, unknown>
      const text = rowRecord.content ?? rowRecord.summary ?? rowRecord.note
      return typeof text === 'string' ? text.trim() : ''
    })
    .filter(Boolean)
}

/**
 * Fetches knowledge from Supabase when a client is provided, then falls back to static defaults.
 */
export async function getKnowledge(
  domain: string,
  supabaseClient?: SupabaseLikeClient,
): Promise<KnowledgePacket> {
  const candidate = domain.trim().toLowerCase()
  const normalizedDomain = VALID_DOMAINS.includes(candidate as AgentName)
    ? (candidate as AgentName)
    : 'ops'

  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('knowledge')
        .select('content,summary,note')
        .eq('domain', normalizedDomain)

      if (!error) {
        const insights = normalizeRows(data)
        if (insights.length) {
          return { domain: normalizedDomain, insights, source: 'supabase' }
        }
      }
    } catch {
      // Non-fatal fallback to static knowledge.
    }
  }

  return {
    domain: normalizedDomain,
    insights: STATIC_KNOWLEDGE[normalizedDomain] ?? STATIC_KNOWLEDGE.ops,
    source: 'static',
  }
}

