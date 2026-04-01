import { useState } from 'react'
import { hasSupabaseConfig, supabase } from '../lib/supabase/client'

export function useSupabaseMutation() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function updateRow({ table, id, patch }) {
    if (!hasSupabaseConfig || !supabase) {
      return { ok: false, fallback: true, message: 'Supabase not configured' }
    }

    setLoading(true)
    setError(null)
    const { error: updateError } = await supabase.from(table).update(patch).eq('id', id)
    setLoading(false)

    if (updateError) {
      setError(updateError.message)
      return { ok: false, fallback: false, message: updateError.message }
    }

    return { ok: true, fallback: false, message: 'Updated' }
  }

  return { updateRow, loading, error }
}
