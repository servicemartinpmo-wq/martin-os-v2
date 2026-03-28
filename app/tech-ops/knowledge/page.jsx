'use client'

import { useMemo, useState } from 'react'
import AppShell from '@/features/shell/AppShell'
import Input from '@/components/catalyst/Input'
import { PageHeader, PageSection } from '@/components/page/PageChrome'
import { fallbackKnowledgeEntries } from '@/features/data/operationalData'
import { useSupabaseTable } from '@/hooks/useSupabaseTable'

export default function KnowledgePage() {
  const [search, setSearch] = useState('')
  const knowledge = useSupabaseTable({
    table: 'knowledge_nodes',
    select: 'id,domain,title,description,type,confidence_score,estimated_time,tags',
    orderBy: 'id',
    ascending: true,
    fallback: fallbackKnowledgeEntries,
  })

  const filtered = useMemo(() => {
    return knowledge.rows.filter((row) => {
      const haystack = `${row.title} ${row.description} ${(row.tags || []).join(' ')}`.toLowerCase()
      return haystack.includes(search.toLowerCase())
    })
  }, [knowledge.rows, search])

  return (
    <AppShell activeHref="/tech-ops">
      <PageHeader
        kicker="Support / Knowledge"
        title="Help library"
        subtitle="Find practical answers, repeatable fixes, and simple how-to guides without digging through technical documents."
      />

      <section className="glass-panel mt-6 flex flex-wrap items-center gap-3 p-4">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search for a guide or answer..."
          className="w-full sm:w-80"
        />
        <span className="mos-chip">
          {knowledge.usingFallback ? 'Using backup data safely' : 'Using live data'}
        </span>
      </section>

      <PageSection title="Recommended articles" className="mt-6">
        <div className="grid gap-3">
          {filtered.map((entry) => (
            <article key={entry.id} className="mos-surface-deep p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm font-semibold">{entry.title}</p>
                  <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                    {entry.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(entry.tags || []).map((tag) => (
                      <span key={tag} className="mos-chip">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {entry.type}
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    {Math.round(Number(entry.confidence_score || 0) * 100)}% match
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {entry.estimated_time}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </PageSection>
    </AppShell>
  )
}
