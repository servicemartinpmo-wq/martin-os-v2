import { useEffect, useMemo, useState } from 'react'
import { hasSupabaseConfig, supabase } from '../lib/supabase/client'

export function useSupabaseTable({ table, select = '*', orderBy = 'id', ascending = true, fallback = [], limit = null }) {
  const live = hasSupabaseConfig && Boolean(supabase)

  const [fetchedRows, setFetchedRows] = useState(undefined)
  const [loading, setLoading] = useState(live)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!live) {
      return
    }

    let cancelled = false

    queueMicrotask(async () => {
      if (cancelled) return
      setLoading(true)
      setError(null)

      let query = supabase.from(table).select(select).order(orderBy, { ascending })
      if (typeof limit === 'number' && limit > 0) {
        query = query.limit(limit)
      }
      const { data, error: queryError } = await query

      if (cancelled) return

      if (queryError) {
        setError(queryError.message)
        setFetchedRows(undefined)
      } else {
        setError(null)
        setFetchedRows(Array.isArray(data) ? data : [])
      }
      setLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [live, table, select, orderBy, ascending, limit])

  const rows = useMemo(() => {
    const safeFallback = Array.isArray(fallback) ? fallback : []
    if (!live) {
      return safeFallback
    }
    if (error) {
      return safeFallback
    }
    if (fetchedRows !== undefined) {
      return fetchedRows
    }
    return safeFallback
  }, [live, fallback, error, fetchedRows])

  return {
    rows,
    loading: live ? loading : false,
    error: live ? error : null,
    usingFallback: !live || Boolean(error),
  }
}
