'use client'

import AppShell from '../../../src/features/shell/AppShell'
import { useMemo, useState } from 'react'
import { emptyTableFallback, miidleCaptureFeed } from '../../../src/features/data/operationalData'
import { useSupabaseTable } from '../../../src/hooks/useSupabaseTable'
import { PageHeader, FilterChip } from '@/components/page/PageChrome'

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

  const filteredFeed = useMemo(() => {
    const base = liveFeed.length > 0 ? liveFeed : miidleCaptureFeed
    return mode === 'all' ? base : base.filter((event) => event.mode === mode)
  }, [mode, liveFeed])

  return (
    <AppShell activeHref="/miidle">
      <PageHeader kicker="Miiddle / Capture" title="Execution capture stream" />

      <section className="glass-panel mt-6 p-4">
        <div className="flex flex-wrap gap-2">
          {['all', 'builder', 'spectator'].map((entryMode) => (
            <FilterChip key={entryMode} active={mode === entryMode} onClick={() => setMode(entryMode)} className="capitalize">
              {entryMode}
            </FilterChip>
          ))}
        </div>
      </section>

      <section
        className="glass-panel mt-4 px-4 py-2 text-xs"
        style={{ color: 'var(--text-muted)' }}
      >
        {loading ? 'Loading capture feed...' : usingFallback ? 'Using local fallback feed (configure Supabase env to load live records).' : 'Live activity feed loaded from Supabase.'}
      </section>

      <section className="glass-panel mt-6 p-4">
        <div className="space-y-3">
          {filteredFeed.map((event) => (
            <article
              key={`${event.time}-${event.title}`}
              className="rounded-xl p-4"
              style={{ border: '1px solid var(--border-subtle)', background: 'var(--bg-elevated)' }}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-mono-ui text-xs" style={{ color: 'var(--text-muted)' }}>
                  {event.time}
                </p>
                <p className="text-xs capitalize" style={{ color: 'var(--text-muted)' }}>
                  {event.mode}
                </p>
              </div>
              <p className="mt-2 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                {event.title}
              </p>
              <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                {event.detail}
              </p>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  )
}
