'use client'

import { PageHeader, PageSection, PageCard, TileLink } from '@/components/page/PageChrome'
import AppShell from '@/features/shell/AppShell'
import TicketList from '@/components/tech/TicketList'
import TicketForm from '@/components/tech/TicketForm'
import { useState } from 'react'

export default function TicketsPage() {
  const [showForm, setShowForm] = useState(false)

  return (
    <AppShell activeHref="/tech-ops/tickets">
      <PageHeader
        kicker="Tech-Ops"
        title="Support Tickets"
        subtitle="Unified intake, priority management, and lifecycle tracking."
      />

      <div className="mt-6 flex justify-end">
        <button
          onClick={() => setShowForm(!showForm)}
          className="mos-chip mos-chip-active"
        >
          {showForm ? 'View Tickets' : '+ New Ticket'}
        </button>
      </div>

      {showForm ? (
        <div className="mt-6">
          <PageCard title="Create Ticket">
            <TicketForm onClose={() => setShowForm(false)} />
          </PageCard>
        </div>
      ) : (
        <div className="mt-6">
          <TicketList />
        </div>
      )}

      <PageSection title="Quick Filters" className="mt-6">
        <div className="flex flex-wrap gap-2">
          <TileLink href="/tech-ops/tickets?filter=open">Open</TileLink>
          <TileLink href="/tech-ops/tickets?filter=in-progress">In Progress</TileLink>
          <TileLink href="/tech-ops/tickets?filter=resolved">Resolved</TileLink>
          <TileLink href="/tech-ops/tickets?filter=all">All Tickets</TileLink>
        </div>
      </PageSection>
    </AppShell>
  )
}
