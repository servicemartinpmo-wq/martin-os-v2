'use client'

import { useMemo } from 'react'
import {
  fallbackInsightRecords,
  fallbackPmoInitiatives,
  pmoDecisionBacklog,
  pmoPortfolioLanes,
} from '../data/operationalData'
import { useSupabaseTable } from '../../hooks/useSupabaseTable'
import { normalizeInitiativeRow } from '@/lib/pmoInitiativeShape'

function signalScore(raw) {
  const state = String(raw ?? '').toLowerCase()
  if (state === 'critical' || state === 'red') return 33
  if (state === 'warning' || state === 'yellow') return 66
  if (state === 'healthy' || state === 'green' || state === 'blue') return 100
  return 72
}

/** Shared PMO initiatives + insights for hub KPIs and operational status. */
export function usePmoOrgDashboardData() {
  const {
    rows: initiativeRowsRaw,
    loading: loadingIni,
    error: initiativeError,
    usingFallback: iniFallback,
  } = useSupabaseTable({
    table: 'initiatives',
    select:
      'id,name,status,priority_score,strategic_alignment,dependency_risk,completion_pct,owner,priority,alignment,risk,completion',
    orderBy: 'id',
    ascending: true,
    limit: 500,
    fallback: fallbackPmoInitiatives,
  })

  const {
    rows: insightRows,
    loading: loadingIns,
    error: insightError,
    usingFallback: insFallback,
  } = useSupabaseTable({
    table: 'insights',
    select: 'id,signal,type,situation,summary',
    orderBy: 'id',
    ascending: false,
    limit: 200,
    fallback: fallbackInsightRecords,
  })

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

  const loading = loadingIni || loadingIns
  const error = initiativeError || insightError
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
