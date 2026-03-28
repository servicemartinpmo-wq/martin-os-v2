'use client'

import { useMemo } from 'react'
import { fallbackInsightRecords, fallbackPmoInitiatives } from '../data/operationalData'
import { useSupabaseTable } from '../../hooks/useSupabaseTable'

function signalScore(raw) {
  const state = String(raw ?? '').toLowerCase()
  if (state === 'critical' || state === 'red') return 33
  if (state === 'warning' || state === 'yellow') return 66
  if (state === 'healthy' || state === 'green') return 100
  return 72
}

export default function PmoOpsLiveKpis() {
  const { rows: initiativeRows, loading: loadingIni, usingFallback: iniFallback } = useSupabaseTable({
    table: 'initiatives',
    select: 'id,status,completion,risk',
    orderBy: 'id',
    ascending: true,
    limit: 500,
    fallback: fallbackPmoInitiatives,
  })

  const { rows: insightRows, loading: loadingIns, usingFallback: insFallback } = useSupabaseTable({
    table: 'insights',
    select: 'id,signal,summary',
    orderBy: 'id',
    ascending: false,
    limit: 200,
    fallback: fallbackInsightRecords,
  })

  const kpis = useMemo(() => {
    const activeInitiatives = initiativeRows.filter((row) => row.status !== 'Completed').length
    const atRisk = initiativeRows.filter((row) => row.status === 'At Risk' || row.status === 'Delayed').length
    const completions = initiativeRows.map((r) => Number(r.completion)).filter((n) => !Number.isNaN(n))
    const avgCompletion = completions.length ? Math.round(completions.reduce((a, b) => a + b, 0) / completions.length) : null

    const mappedSignals = insightRows.map((row) => signalScore(row.signal ?? row.state))
    const orgHealth = mappedSignals.length ? Math.round(mappedSignals.reduce((a, b) => a + b, 0) / mappedSignals.length) : 84

    return [
      { label: 'Org health composite', value: `${orgHealth}/100`, hint: insFallback ? 'demo signals' : 'from insights' },
      { label: 'Active initiatives', value: String(activeInitiatives), hint: iniFallback ? 'demo initiatives' : 'live count' },
      { label: 'At risk / delayed', value: String(atRisk), hint: 'status filter' },
      {
        label: 'Avg initiative completion',
        value: avgCompletion != null ? `${avgCompletion}%` : '—',
        hint: iniFallback ? 'demo cohort' : 'live average',
      },
    ]
  }, [initiativeRows, insightRows, iniFallback, insFallback])

  const busy = loadingIni || loadingIns

  return (
    <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi) => (
        <article key={kpi.label} className="glass-panel p-4">
          <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
            {kpi.label}
          </p>
          <p className="mt-2 text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            {busy ? '…' : kpi.value}
          </p>
          <p className="mt-1 text-[11px]" style={{ color: 'var(--text-muted)' }}>
            {kpi.hint}
          </p>
        </article>
      ))}
    </section>
  )
}
