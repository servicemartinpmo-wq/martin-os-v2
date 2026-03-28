'use client'

import AppShell from '../../../src/features/shell/AppShell'
import { useMemo } from 'react'
import { emptyTableFallback, fallbackPmoInitiatives, fallbackStoryArtifacts } from '../../../src/features/data/operationalData'
import { useSupabaseTable } from '../../../src/hooks/useSupabaseTable'
import { PageHeader, PageCard } from '@/components/page/PageChrome'

const edges = [
  'Initiatives -> Contributors (ownership)',
  'Contributors -> Artifacts (output)',
  'Artifacts -> Skills (demonstrated)',
  'Skills -> Initiatives (fit scoring)',
]

const cellStyle = {
  border: '1px solid var(--border-subtle)',
  background: 'var(--bg-elevated)',
}

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
    <AppShell activeHref="/miiddle">
      <PageHeader
        kicker="Miiddle / Work Graph"
        title="Relationship map"
        subtitle="Counts hydrate from Supabase when configured: initiatives, activity log actors, and story artifacts. Empty activity feeds
          fall back to a placeholder contributor count so the graph still reads coherently."
      />

      {loading ? (
        <p className="mt-4 text-xs" style={{ color: 'var(--text-muted)' }}>
          Loading graph metrics…
        </p>
      ) : null}

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <PageCard title="Nodes">
          <ul className="space-y-2 text-sm" style={{ color: 'var(--text-muted)' }}>
            {graphNodes.map((node) => (
              <li key={node.label} className="rounded px-3 py-2" style={cellStyle}>
                <div className="flex items-center justify-between gap-2">
                  <span style={{ color: 'var(--text-primary)' }}>{node.label}</span>
                  <span>{node.detail}</span>
                </div>
                {node.note ? <p className="mt-1 text-[11px]">{node.note}</p> : null}
              </li>
            ))}
          </ul>
        </PageCard>

        <PageCard title="Edges">
          <ul className="space-y-2 text-sm" style={{ color: 'var(--text-muted)' }}>
            {edges.map((edge) => (
              <li key={edge} className="rounded px-3 py-2" style={cellStyle}>
                {edge}
              </li>
            ))}
          </ul>
        </PageCard>
      </section>
    </AppShell>
  )
}
