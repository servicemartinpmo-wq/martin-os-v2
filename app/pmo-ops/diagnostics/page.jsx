'use client'

import AppShell from '../../../src/features/shell/AppShell'
import { useMemo, useState } from 'react'
import { useSupabaseTable } from '../../../src/hooks/useSupabaseTable'
import { fallbackDiagnosticsSignals } from '../../../src/features/data/operationalData'

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
      <header className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">PMO-Ops / Diagnostics</p>
        <h2 className="mt-2 text-2xl font-semibold text-zinc-100">Signal, diagnosis, guidance</h2>
      </header>

      <section className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
        <div className="flex flex-wrap gap-2">
          {['All', 'Healthy', 'Warning', 'Critical'].map((state) => (
            <button
              key={state}
              type="button"
              onClick={() => setStateFilter(state)}
              className={`rounded-lg border px-3 py-2 text-xs ${
                stateFilter === state ? 'border-cyan-400/50 bg-cyan-500/10 text-cyan-200' : 'border-zinc-700 text-zinc-300'
              }`}
            >
              {state}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-2 text-xs text-zinc-400">
        {loading ? 'Loading diagnostics...' : usingFallback ? 'Using local fallback diagnostics (configure Supabase env to load live records).' : 'Live Supabase diagnostics loaded.'}
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        {signals.map((item) => (
          <article key={item.id ?? item.area} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-zinc-100">{item.area}</h3>
              <span className="rounded border border-zinc-700 px-2 py-1 text-xs text-zinc-300">{item.state}</span>
            </div>
            <p className="mt-2 text-sm text-zinc-300">{item.detail}</p>
          </article>
        ))}
      </section>

      <section className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h3 className="text-base font-semibold text-zinc-100">4-stage diagnostics pipeline</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {pipeline.map((step, idx) => (
            <article key={step.stage} className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
              <p className="text-[11px] uppercase tracking-wide text-zinc-500">Stage {idx + 1}</p>
              <h4 className="mt-1 text-sm font-semibold text-zinc-100">{step.stage}</h4>
              <p className="mt-1 text-xs text-zinc-300">{step.note}</p>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  )
}
