'use client'

import { PageHeader, PageSection, PageCard, TileLink } from '@/components/page/PageChrome'
import AppShell from '@/features/shell/AppShell'
import InitiativeList from '@/components/pmo/InitiativeList'
import InitiativeForm from '@/components/pmo/InitiativeForm'
import { useState } from 'react'

export default function InitiativesPage() {
  const [showForm, setShowForm] = useState(false)

  return (
    <AppShell activeHref="/pmo-ops/initiatives">
      <PageHeader
        kicker="PMO-Ops"
        title="Initiatives & Programs"
        subtitle="Track program milestones, ownership, risk flags, and cross-program dependencies."
      />

      <div className="mt-6 flex justify-end">
        <button
          onClick={() => setShowForm(!showForm)}
          className="mos-chip mos-chip-active"
        >
          {showForm ? 'View List' : '+ New Initiative'}
        </button>
      </div>

      {showForm ? (
        <div className="mt-6">
          <PageCard title="New Initiative">
            <InitiativeForm onClose={() => setShowForm(false)} />
          </PageCard>
        </div>
      ) : (
        <div className="mt-6">
          <InitiativeList />
        </div>
      )}

      <PageSection title="Quick filters" className="mt-6">
        <div className="flex flex-wrap gap-2">
          <TileLink href="/pmo-ops/initiatives?filter=running">Running</TileLink>
          <TileLink href="/pmo-ops/initiatives?filter=at-risk">At Risk</TileLink>
          <TileLink href="/pmo-ops/initiatives?filter=completed">Completed</TileLink>
          <TileLink href="/pmo-ops/initiatives?filter=all">All Initiatives</TileLink>
        </div>
      </PageSection>
    </AppShell>
  )
}
