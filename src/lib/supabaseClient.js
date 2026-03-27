import { createClient } from '@supabase/supabase-js'

const supabaseUrl = globalThis.process?.env?.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = globalThis.process?.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null
