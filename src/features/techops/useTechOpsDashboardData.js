'use client'

import { useEffect, useMemo, useState } from 'react'
import { fetchTechOpsDashboard } from '@/lib/api/dashboard'

export function useTechOpsDashboardData() {
  const [payload, setPayload] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let alive = true
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const next = await fetchTechOpsDashboard()
        if (alive) setPayload(next)
      } catch (e) {
        if (!alive) return
        setError(e instanceof Error ? e.message : 'Unable to load tech-ops dashboard')
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  const data = useMemo(() => {
    const responseData = payload?.data
    const diagnostics = Array.isArray(responseData?.diagnostics) ? responseData.diagnostics : []
    const workflows = Array.isArray(responseData?.workflows) ? responseData.workflows : []
    const connectorHealth = Array.isArray(responseData?.connectorHealth) ? responseData.connectorHealth : []
    const kpis = Array.isArray(responseData?.kpis) ? responseData.kpis : []
    const unhealthyConnectors = connectorHealth.filter((item) => item.state !== 'healthy').length
    const warningWorkflows = workflows.filter((row) => String(row.state).toLowerCase() === 'warning').length
    return {
      kpis,
      diagnostics,
      workflows,
      connectorHealth,
      slaBoard: Array.isArray(responseData?.slaBoard) ? responseData.slaBoard : [],
      unhealthyConnectors,
      warningWorkflows,
      activeIncidents: diagnostics.slice(0, 4),
    }
  }, [payload])

  return {
    data,
    loading,
    error,
    usingFallback: payload?.source !== 'supabase',
  }
}
