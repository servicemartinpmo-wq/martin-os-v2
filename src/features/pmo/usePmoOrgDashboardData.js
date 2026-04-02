'use client'

import { useMemo } from 'react'
import {
  fallbackInsightRecords,
  fallbackPmoInitiatives,
  pmoDecisionBacklog,
  pmoPortfolioLanes,
} from '../data/operationalData'
import { useEffect, useState } from 'react'
import { normalizeInitiativeRow } from '@/lib/pmoInitiativeShape'
import { fetchGoalsDashboard } from '@/lib/api/dashboard'

function signalScore(raw) {
  const state = String(raw ?? '').toLowerCase()
  if (state === 'critical' || state === 'red') return 33
  if (state === 'warning' || state === 'yellow') return 66
  if (state === 'healthy' || state === 'green' || state === 'blue') return 100
  return 72
}

/** Shared PMO initiatives + insights for hub KPIs and operational status. */
export function usePmoOrgDashboardData() {
  const [initiativeRowsRaw, setInitiativeRowsRaw] = useState(fallbackPmoInitiatives)
  const [insightRows, setInsightRows] = useState(fallbackInsightRecords)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [iniFallback, setIniFallback] = useState(true)
  const [insFallback, setInsFallback] = useState(true)

  useEffect(() => {
    let cancelled = false
    queueMicrotask(async () => {
      try {
        const payload = await fetchGoalsDashboard()
        if (cancelled) return
        setInitiativeRowsRaw(
          Array.isArray(payload?.data?.initiativeRows) ? payload.data.initiativeRows : fallbackPmoInitiatives,
        )
        setInsightRows(
          Array.isArray(payload?.data?.insightRows) ? payload.data.insightRows : fallbackInsightRecords,
        )
        const source = payload?.source === 'supabase' ? 'supabase' : 'fallback'
        setIniFallback(source !== 'supabase')
        setInsFallback(source !== 'supabase')
        setError(null)
      } catch (nextError) {
        if (cancelled) return
        setInitiativeRowsRaw(fallbackPmoInitiatives)
        setInsightRows(fallbackInsightRecords)
        setIniFallback(true)
        setInsFallback(true)
        setError(nextError instanceof Error ? nextError.message : 'goals fetch failed')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })

    return () => {
      cancelled = true
    }
  }, [])

  const initiativeRows = useMemo(
    () => initiativeRowsRaw.map((row) => normalizeInitiativeRow(row)),
    [initiativeRowsRaw],
  )

  const data = useMemo(() => {
    const activeInitiatives = initiativeRows.filter(
      (row) => row.status !== 'Completed',
    ).length
    const atRisk = initiativeRows.filter(
      (row) =>
        row.status === 'At Risk' || row.status === 'Delayed' || row.status === 'Abandoned',
    ).length
    const completions = initiativeRows
      .map((row) => Number(row.completion))
      .filter((value) => !Number.isNaN(value))
    const avgCompletion = completions.length
      ? Math.round(
          completions.reduce((acc, value) => acc + value, 0) / completions.length,
        )
      : null

    const mappedSignals = insightRows.map((row) => signalScore(row.signal ?? row.state))
    const orgHealth = mappedSignals.length
      ? Math.round(
          mappedSignals.reduce((acc, value) => acc + value, 0) / mappedSignals.length,
        )
      : 84

    const spotlightInitiatives = [...initiativeRows]
      .sort((a, b) => Number(b.priority) - Number(a.priority))
      .slice(0, 3)

    const insightFeed = insightRows.slice(0, 4).map((row) => ({
      id: row.id,
      title: row.type ?? 'Signal',
      summary: row.summary ?? row.situation ?? 'Insight available',
      signal: String(row.signal ?? 'yellow'),
    }))

    const kpis = [
      {
        label: 'Operational status composite',
        value: `${orgHealth}/100`,
        hint: insFallback ? 'fallback insight model' : 'live insight model',
      },
      {
        label: 'Active initiatives',
        value: String(activeInitiatives),
        hint: iniFallback ? 'fallback portfolio' : 'live initiative count',
      },
      {
        label: 'Attention / delay / abandoned',
        value: String(atRisk),
        hint: atRisk > 0 ? 'leadership attention needed' : 'no current blockers',
      },
      {
        label: 'Avg initiative completion',
        value: avgCompletion != null ? `${avgCompletion}%` : '—',
        hint: iniFallback ? 'fallback completion model' : 'live portfolio average',
      },
    ]

    return {
      kpis,
      orgHealth,
      activeInitiatives,
      atRisk,
      avgCompletion,
      initiativeRows,
      insightRows,
      spotlightInitiatives,
      insightFeed,
      decisionBacklog: pmoDecisionBacklog,
      portfolioLanes: pmoPortfolioLanes,
    }
  }, [initiativeRows, insightRows, iniFallback, insFallback])

  const usingFallback = iniFallback || insFallback

  return {
    data,
    loading,
    error,
    usingFallback,
    iniFallback,
    insFallback,
    kpis: data.kpis,
    orgHealth: data.orgHealth,
    activeInitiatives: data.activeInitiatives,
    atRisk: data.atRisk,
    avgCompletion: data.avgCompletion,
    initiativeRows: data.initiativeRows,
    insightRows: data.insightRows,
    spotlightInitiatives: data.spotlightInitiatives,
    insightFeed: data.insightFeed,
    decisionBacklog: data.decisionBacklog,
    portfolioLanes: data.portfolioLanes,
  }
}
