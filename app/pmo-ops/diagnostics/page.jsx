'use client'

import AppShell from '@/features/shell/AppShell'
import { useMemo, useState } from 'react'
import { useSupabaseTable } from '@/hooks/useSupabaseTable'
import { fallbackDiagnosticsSignals } from '@/features/data/operationalData'
import { PageHeader, PageSection, PageCard, FilterChip } from '@/components/page/PageChrome'
import DiagnosticIntake from '@/components/pmo/DiagnosticIntake'
import DiagnosticEngine from '@/components/pmo/DiagnosticEngine'
import BrainDiagnosticsPanel from '@/components/pmo/BrainDiagnosticsPanel'
import { insightDetailText } from '@/lib/pmoInitiativeShape'

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
    select: 'id,type,signal,situation,diagnosis,recommendation,summary',
    orderBy: 'id',
    ascending: false,
    fallback: fallbackDiagnosticsSignals,
  })

  const signals = useMemo(() => {
    const mapped = rows.map((row) => {
      const raw = String(row.signal ?? row.state ?? '').toLowerCase()
      const state =
        raw === 'red'
          ? 'Critical'
          : raw === 'yellow'
            ? 'Warning'
            : raw === 'green' || raw === 'blue'
              ? 'Healthy'
              : row.state ?? 'Warning'
      return {
        id: row.id,
        area: row.area ?? row.type ?? 'Signal',
        state,
        detail: insightDetailText(row),
      }
    })
    return stateFilter === 'All' ? mapped : mapped.filter((item) => item.state === stateFilter)
  }, [rows, stateFilter])

  return (
    <AppShell activeHref="/pmo-ops">
      <PageHeader
        kicker="PMO-Ops / Diagnostics"
        title="Signal, diagnosis, guidance"
        subtitle="Live insights from Supabase (mpo-pilot-shaped rows), interactive brain-assisted runs, and portfolio health cards."
      />

      <div className="mt-6">
        <DiagnosticIntake />
      </div>

      <PageSection title="Portfolio diagnostics (brain-assisted)" className="mt-6">
        <DiagnosticEngine domain="pmo" />
      </PageSection>

      <div className="mt-6">
        <BrainDiagnosticsPanel contextHint="PMO diagnostics: synthesize portfolio risks and next governance moves from current signals." />
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

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <PageCard title="Health Indicators">
          <ul className="space-y-2 text-sm" style={{ color: 'var(--text-muted)' }}>
            <li className="flex justify-between">
              <span>Portfolio Health Score</span>
              <span style={{ color: 'var(--success)' }}>92%</span>
            </li>
            <li className="flex justify-between">
              <span>Initiatives On Track</span>
              <span>15/18</span>
            </li>
            <li className="flex justify-between">
              <span>At-Risk Items</span>
              <span style={{ color: 'var(--warning)' }}>3</span>
            </li>
            <li className="flex justify-between">
              <span>Blocked Dependencies</span>
              <span style={{ color: 'var(--error)' }}>2</span>
            </li>
          </ul>
        </PageCard>

        <PageCard title="Risk Summary">
          <ul className="space-y-2 text-sm" style={{ color: 'var(--text-muted)' }}>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: 'var(--error)' }} />
              <span>Schedule compression: Project Phoenix</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: 'var(--warning)' }} />
              <span>Budget variance: Customer Portal (+12%)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: 'var(--success)' }} />
              <span>Resource availability: Optimal</span>
            </li>
          </ul>
        </PageCard>
      </div>
    </AppShell>
  )
}
