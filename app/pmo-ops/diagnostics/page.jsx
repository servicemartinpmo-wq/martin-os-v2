'use client'

import AppShell from '../../../src/features/shell/AppShell'
import { useMemo, useState } from 'react'
import { useSupabaseTable } from '../../../src/hooks/useSupabaseTable'
import { fallbackDiagnosticsSignals } from '../../../src/features/data/operationalData'
import { PageHeader, PageSection, FilterChip } from '@/components/page/PageChrome'
import DiagnosticIntake from '@/components/pmo/DiagnosticIntake'

const pipeline = [
  { stage: 'Signal Detection', note: 'Cross-module telemetry and blockers are detected and scored.' },
  { stage: 'Diagnosis', note: 'Root-cause context is assembled with initiative and governance traces.' },
  { stage: 'Guidance', note: 'Operator actions are generated with priority and ownership suggestions.' },
  { stage: 'Structural Remedy', note: 'Long-term process fixes are logged into governance backlog.' },
]

export default function PMODiagnosticsPage() {
  const [stateFilter, setStateFilter] = useState('All')
  const { rows, loading, usingFallback } = useSupabaseTable({
    table: 'insights',
    select: 'id,type as area,signal as state,summary as detail',
    orderBy: 'id',
    ascending: false,
    fallback: fallbackDiagnosticsSignals,
  })

  const signals = useMemo(() => {
    const mapped = rows.map((row) => ({
      id: row.id,
      area: row.area ?? row.type ?? 'Signal',
      state:
        row.state === 'red'
          ? 'Critical'
          : row.state === 'yellow'
            ? 'Warning'
            : row.state === 'green'
              ? 'Healthy'
              : row.state ?? 'Warning',
      detail: row.detail ?? row.summary ?? 'No summary available.',
    }))
    return stateFilter === 'All' ? mapped : mapped.filter((item) => item.state === stateFilter)
  }, [rows, stateFilter])

  return (
    <AppShell activeHref="/pmo-ops">
      <PageHeader kicker="PMO-Ops / Diagnostics" title="Signal, diagnosis, guidance" />

      <div className="mt-6">
        <DiagnosticIntake />
      </div>

      <section className="glass-panel mt-6 p-4">
        <div className="flex flex-wrap gap-2">
          {['All', 'Healthy', 'Warning', 'Critical'].map((state) => (
            <FilterChip key={state} active={stateFilter === state} onClick={() => setStateFilter(state)}>
              {state}
            </FilterChip>
          ))}
        </div>
      </section>

      <section
        className="glass-panel mt-4 px-4 py-2 text-xs"
        style={{ color: 'var(--text-muted)' }}
      >
        {loading ? 'Loading diagnostics...' : usingFallback ? 'Using local fallback diagnostics (configure Supabase env to load live records).' : 'Live Supabase diagnostics loaded.'}
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        {signals.map((item) => (
          <article key={item.id ?? item.area} className="glass-panel p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                {item.area}
              </h3>
              <span className="rounded px-2 py-1 text-xs" style={{ border: '1px solid var(--border-subtle)' }}>
                {item.state}
              </span>
            </div>
            <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
              {item.detail}
            </p>
          </article>
        ))}
      </section>

      <PageSection title="4-stage diagnostics pipeline">
        <div className="grid gap-3 md:grid-cols-2">
          {pipeline.map((step, idx) => (
            <article key={step.stage} className="mos-surface-deep p-4">
              <p className="text-[11px] uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                Stage {idx + 1}
              </p>
              <h4 className="mt-1 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                {step.stage}
              </h4>
              <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                {step.note}
              </p>
            </article>
          ))}
        </div>
      </PageSection>
    </AppShell>
  )
}
