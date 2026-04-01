import { createClient } from '@supabase/supabase-js'

const runtimeEnv = globalThis?.process?.env ?? {}
const supabaseUrl = runtimeEnv.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = runtimeEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase = hasSupabaseConfig ? createClient(supabaseUrl, supabaseAnonKey) : null
