import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

let cachedSupabase = null

function getSupabaseServerClient() {
  if (cachedSupabase) return cachedSupabase
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseAnonKey) return null
  cachedSupabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
  return cachedSupabase
}

function buildFallbackLines() {
  const now = new Date().toISOString()
  return [
    `[${now}] dispatcher: health ok`,
    `[${now}] tier-router: cache warm`,
    `[${now}] kb-sync: idle`,
  ]
}

// Note: getSupabaseServerClient is cached above to avoid creating
// a new Supabase client for every polling tick.

/** Supabase-first Tech-Ops logs endpoint with deterministic fallback. */
export async function GET() {
  const fallback = buildFallbackLines()
  const supabase = getSupabaseServerClient()

  if (!supabase) {
    return Response.json({ lines: fallback, source: 'fallback' })
  }

  try {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('id,channel,event,actor,created_at,state')
      .order('id', { ascending: false })
      .limit(12)

    if (error || !Array.isArray(data) || data.length === 0) {
      return Response.json({
        lines: fallback,
        source: 'fallback',
        error: error?.message ?? null,
      })
    }

    const lines = data.map((row) => {
      const timestamp = row.created_at
        ? new Date(row.created_at).toISOString()
        : new Date().toISOString()
      const state = row.state ? ` state=${row.state}` : ''
      return `[${timestamp}] ${row.channel ?? 'activity'}: ${row.event ?? 'event'}${state} actor=${row.actor ?? 'system'}`
    })

    return Response.json({ lines, source: 'supabase' })
  } catch (error) {
    return Response.json({
      lines: fallback,
      source: 'fallback',
      error: error instanceof Error ? error.message : 'Unknown logs error',
    })
  }
}
