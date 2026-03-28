'use client'

import { useMemo } from 'react'
import { fallbackInsightRecords, fallbackPmoInitiatives } from '../data/operationalData'
import { useSupabaseTable } from '../../hooks/useSupabaseTable'
import { normalizeInitiativeRow } from '@/lib/pmoInitiativeShape'

function signalScore(raw) {
  const state = String(raw ?? '').toLowerCase()
  if (state === 'critical' || state === 'red') return 33
  if (state === 'warning' || state === 'yellow') return 66
  if (state === 'healthy' || state === 'green' || state === 'blue') return 100
  return 72
}

/** Shared PMO initiatives + insights for hub KPIs and org health orb. */
export function usePmoOrgDashboardData() {
  const {
    rows: initiativeRowsRaw,
    loading: loadingIni,
    usingFallback: iniFallback,
  } = useSupabaseTable({
    table: 'initiatives',
    select: 'id,name,status,priority_score,strategic_alignment,dependency_risk,completion_pct,owner,priority,alignment,risk,completion',
    orderBy: 'id',
    ascending: true,
    limit: 500,
    fallback: fallbackPmoInitiatives,
  })

  const { rows: insightRows, loading: loadingIns, usingFallback: insFallback } = useSupabaseTable({
    table: 'insights',
    select: 'id,signal,type,situation,summary',
    orderBy: 'id',
    ascending: false,
    limit: 200,
    fallback: fallbackInsightRecords,
  })

  const initiativeRows = useMemo(
    () => initiativeRowsRaw.map((r) => normalizeInitiativeRow(r)),
    [initiativeRowsRaw],
  )

  const bundle = useMemo(() => {
    const activeInitiatives = initiativeRows.filter((row) => row.status !== 'Completed').length
    const atRisk = initiativeRows.filter((row) => row.status === 'At Risk' || row.status === 'Delayed').length
    const completions = initiativeRows.map((r) => Number(r.completion)).filter((n) => !Number.isNaN(n))
    const avgCompletion = completions.length ? Math.round(completions.reduce((a, b) => a + b, 0) / completions.length) : null

    const mappedSignals = insightRows.map((row) => signalScore(row.signal ?? row.state))
    const orgHealth = mappedSignals.length ? Math.round(mappedSignals.reduce((a, b) => a + b, 0) / mappedSignals.length) : 84

    const kpis = [
      { label: 'Org health composite', value: `${orgHealth}/100`, hint: insFallback ? 'demo signals' : 'from insights' },
      { label: 'Active initiatives', value: String(activeInitiatives), hint: iniFallback ? 'demo initiatives' : 'live count' },
      { label: 'At risk / delayed', value: String(atRisk), hint: 'status filter' },
      {
        label: 'Avg initiative completion',
        value: avgCompletion != null ? `${avgCompletion}%` : '—',
        hint: iniFallback ? 'demo cohort' : 'live average',
      },
    ]

    return { kpis, orgHealth, activeInitiatives, atRisk, avgCompletion }
  }, [initiativeRows, insightRows, iniFallback, insFallback])

  return {
    loading: loadingIni || loadingIns,
    iniFallback,
    insFallback,
    ...bundle,
  }
}
