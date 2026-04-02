import { createClient } from '@supabase/supabase-js'

let cached = null

export function getSupabaseServerClient() {
  if (cached) return cached
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseAnonKey) return null
  cached = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
  return cached
}

export async function querySupabaseWithFallback(queryFactory, fallbackValue) {
  const supabase = getSupabaseServerClient()
  if (!supabase) {
    return { data: fallbackValue, source: 'fallback', usingFallback: true, error: null }
  }
  try {
    const result = await queryFactory(supabase)
    if (result?.error) {
      return {
        data: fallbackValue,
        source: 'fallback',
        usingFallback: true,
        error: result.error.message ?? 'Unknown Supabase error',
      }
    }
    return { data: result?.data ?? fallbackValue, source: 'supabase', usingFallback: false, error: null }
  } catch (error) {
    return {
      data: fallbackValue,
      source: 'fallback',
      usingFallback: true,
      error: error instanceof Error ? error.message : 'Unknown Supabase exception',
    }
  }
}
