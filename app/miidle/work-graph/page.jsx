'use client'

import AppShell from '../../../src/features/shell/AppShell'
import { useMemo } from 'react'
import { emptyTableFallback, fallbackPmoInitiatives, fallbackStoryArtifacts } from '../../../src/features/data/operationalData'
import { useSupabaseTable } from '../../../src/hooks/useSupabaseTable'

const edges = [
  'Initiatives -> Contributors (ownership)',
  'Contributors -> Artifacts (output)',
  'Artifacts -> Skills (demonstrated)',
  'Skills -> Initiatives (fit scoring)',
]

export default function MiidleWorkGraphPage() {
  const { rows: initiatives, loading: loadingIni } = useSupabaseTable({
    table: 'initiatives',
    select: 'id,status',
    orderBy: 'id',
    ascending: true,
    limit: 500,
    fallback: fallbackPmoInitiatives,
  })

  const { rows: activityRows, loading: loadingAct } = useSupabaseTable({
    table: 'activity_logs',
    select: 'id,actor',
    orderBy: 'created_at',
    ascending: false,
    limit: 500,
    fallback: emptyTableFallback,
  })

  const { rows: artifacts, loading: loadingArt } = useSupabaseTable({
    table: 'story_artifacts',
    select: 'id',
    orderBy: 'id',
    ascending: true,
    limit: 500,
    fallback: fallbackStoryArtifacts,
  })

  const graphNodes = useMemo(() => {
    const activeInitiatives = initiatives.filter((row) => row.status !== 'Completed').length
    const artifactCount = artifacts.length
    const contributorCount = activityRows.length
      ? new Set(activityRows.map((row) => row.actor).filter(Boolean)).size
      : 42

    return [
      { label: 'Initiatives', detail: `${activeInitiatives} active` },
      { label: 'Contributors', detail: `${contributorCount} linked` },
      { label: 'Artifacts', detail: `${artifactCount} tracked` },
      { label: 'Skills', detail: '31 mapped', note: 'Taxonomy seed (connect Supabase skills table when available).' },
    ]
  }, [initiatives, activityRows, artifacts])

  const loading = loadingIni || loadingAct || loadingArt

  return (
    <AppShell activeHref="/miidle">
      <header className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-fuchsia-300">Miidle / Work Graph</p>
        <h2 className="mt-2 text-2xl font-semibold text-zinc-100">Relationship map</h2>
        <p className="mt-2 max-w-3xl text-sm text-zinc-400">
          Counts hydrate from Supabase when configured: initiatives, activity log actors, and story artifacts. Empty activity feeds
          fall back to a placeholder contributor count so the graph still reads coherently.
        </p>
      </header>

      {loading ? (
        <p className="mt-4 text-xs text-zinc-500">Loading graph metrics…</p>
      ) : null}

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
          <h3 className="text-base font-semibold text-zinc-100">Nodes</h3>
          <ul className="mt-3 space-y-2 text-sm text-zinc-300">
            {graphNodes.map((node) => (
              <li key={node.label} className="rounded border border-zinc-800 bg-zinc-950/50 px-3 py-2">
                <div className="flex items-center justify-between gap-2">
                  <span>{node.label}</span>
                  <span className="text-zinc-400">{node.detail}</span>
                </div>
                {node.note ? <p className="mt-1 text-[11px] text-zinc-500">{node.note}</p> : null}
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
          <h3 className="text-base font-semibold text-zinc-100">Edges</h3>
          <ul className="mt-3 space-y-2 text-sm text-zinc-300">
            {edges.map((edge) => (
              <li key={edge} className="rounded border border-zinc-800 bg-zinc-950/50 px-3 py-2">
                {edge}
              </li>
            ))}
          </ul>
        </article>
      </section>
    </AppShell>
  )
}
