'use client'

import AppShell from '../../../src/features/shell/AppShell'
import { useMemo, useState } from 'react'
import { emptyTableFallback, miidleCaptureFeed } from '../../../src/features/data/operationalData'
import { useSupabaseTable } from '../../../src/hooks/useSupabaseTable'

export default function MiidleCapturePage() {
  const [mode, setMode] = useState('all')
  const { rows, loading, usingFallback } = useSupabaseTable({
    table: 'activity_logs',
    select: 'id,created_at as time,actor,action as title,metadata as detail',
    orderBy: 'created_at',
    ascending: false,
    fallback: emptyTableFallback,
  })

  const liveFeed = useMemo(() => {
    return rows.map((row) => ({
      mode: row.actor === 'system' ? 'spectator' : 'builder',
      time: row.time ?? 'n/a',
      title: row.title ?? 'Activity event',
      detail: typeof row.detail === 'string' ? row.detail : JSON.stringify(row.detail ?? {}),
    }))
  }, [rows])

  const filteredFeed = useMemo(
    () => {
      const base = liveFeed.length > 0 ? liveFeed : miidleCaptureFeed
      return mode === 'all' ? base : base.filter((event) => event.mode === mode)
    },
    [mode, liveFeed]
  )

  return (
    <AppShell activeHref="/miidle">
      <header className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-fuchsia-300">Miidle / Capture</p>
        <h2 className="mt-2 text-2xl font-semibold text-zinc-100">Execution capture stream</h2>
      </header>

      <section className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
        <div className="flex flex-wrap gap-2">
          {['all', 'builder', 'spectator'].map((entryMode) => (
            <button
              key={entryMode}
              type="button"
              onClick={() => setMode(entryMode)}
              className={`rounded-lg border px-3 py-2 text-xs capitalize ${
                mode === entryMode ? 'border-cyan-400/50 bg-cyan-500/10 text-cyan-200' : 'border-zinc-700 text-zinc-300'
              }`}
            >
              {entryMode}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-2 text-xs text-zinc-400">
        {loading ? 'Loading capture feed...' : usingFallback ? 'Using local fallback feed (configure Supabase env to load live records).' : 'Live activity feed loaded from Supabase.'}
      </section>

      <section className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
        <div className="space-y-3">
          {filteredFeed.map((event) => (
            <article key={`${event.time}-${event.title}`} className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-mono text-zinc-400">{event.time}</p>
                <p className="text-xs capitalize text-zinc-400">{event.mode}</p>
              </div>
              <p className="mt-2 text-sm font-medium text-zinc-100">{event.title}</p>
              <p className="mt-1 text-xs text-zinc-300">{event.detail}</p>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  )
}
