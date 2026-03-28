'use client'

import AppShell from '../../../src/features/shell/AppShell'
import { useMemo, useState } from 'react'
import { fallbackTechTickets } from '../../../src/features/data/operationalData'
import { useSupabaseTable } from '../../../src/hooks/useSupabaseTable'
import { useSupabaseMutation } from '../../../src/hooks/useSupabaseMutation'
import { PageHeader, FilterChip } from '@/components/page/PageChrome'

const badgeStyle = {
  border: '1px solid var(--border-subtle)',
}

export default function TechOpsTicketsPage() {
  const [tierFilter, setTierFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [localRows, setLocalRows] = useState(fallbackTechTickets)
  const [statusById, setStatusById] = useState({})
  const { updateRow, loading: saving } = useSupabaseMutation()
  const { rows, loading, usingFallback } = useSupabaseTable({
    table: 'tickets',
    select: 'id,title,status',
    orderBy: 'id',
    ascending: false,
    fallback: localRows,
  })

  const tickets = useMemo(() => {
    return rows.map((row) => {
      const id = String(row.id)
      return {
        id: row.id,
        title: row.title ?? 'Untitled ticket',
        status: statusById[id] ?? row.status ?? 'Open',
        tier: row.tier ?? 2,
        confidence: row.confidence ?? 0.7,
      }
    })
  }, [rows, statusById])

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const tierOk = tierFilter === 'All' || `Tier ${ticket.tier}` === tierFilter
      const statusOk = statusFilter === 'All' || ticket.status === statusFilter
      return tierOk && statusOk
    })
  }, [tickets, tierFilter, statusFilter])

  const grouped = useMemo(() => {
    return {
      Open: filteredTickets.filter((ticket) => ticket.status === 'Open'),
      Investigating: filteredTickets.filter((ticket) => ticket.status === 'Investigating'),
      Escalated: filteredTickets.filter((ticket) => ticket.status === 'Escalated'),
      Resolved: filteredTickets.filter((ticket) => ticket.status === 'Resolved'),
    }
  }, [filteredTickets])

  async function cycleStatus(ticket) {
    const order = ['Open', 'Investigating', 'Escalated', 'Resolved']
    const currentIndex = order.indexOf(ticket.status)
    const nextStatus = order[(currentIndex + 1) % order.length]
    const result = await updateRow({ table: 'tickets', id: ticket.id, patch: { status: nextStatus } })

    if (result.ok || result.fallback) {
      const id = String(ticket.id)
      setStatusById((prev) => ({ ...prev, [id]: nextStatus }))
    }
    if (result.fallback) {
      setLocalRows((prev) => prev.map((row) => (String(row.id) === String(ticket.id) ? { ...row, status: nextStatus } : row)))
    }
  }

  return (
    <AppShell activeHref="/tech-ops">
      <PageHeader kicker="Tech-Ops / Tickets" title="Ticket and tier routing queue" />

      <section className="glass-panel mt-6 space-y-3 p-4">
        <div className="flex flex-wrap gap-2">
          {['All', 'Tier 1', 'Tier 2', 'Tier 3', 'Tier 4'].map((tier) => (
            <FilterChip key={tier} active={tierFilter === tier} onClick={() => setTierFilter(tier)}>
              {tier}
            </FilterChip>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {['All', 'Open', 'Investigating', 'Escalated', 'Resolved'].map((status) => (
            <FilterChip key={status} active={statusFilter === status} onClick={() => setStatusFilter(status)}>
              {status}
            </FilterChip>
          ))}
        </div>
      </section>

      <section
        className="glass-panel mt-4 px-4 py-2 text-xs"
        style={{ color: 'var(--text-muted)' }}
      >
        {loading
          ? 'Loading tickets...'
          : usingFallback
            ? 'Using local fallback data (configure Supabase env to load live records).'
            : 'Live Supabase data loaded.'}
        {saving ? ' Saving update...' : ''}
      </section>

      <section className="mt-6 grid gap-4 xl:grid-cols-4">
        {Object.entries(grouped).map(([lane, laneTickets]) => (
          <article key={lane} className="glass-panel p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                {lane}
              </h3>
              <span className="rounded px-2 py-0.5 text-xs" style={badgeStyle}>
                {laneTickets.length}
              </span>
            </div>
            <div className="space-y-3">
              {laneTickets.length === 0 && (
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  No tickets
                </p>
              )}
              {laneTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="rounded-lg p-3"
                  style={{ border: '1px solid var(--border-subtle)', background: 'var(--bg-elevated)' }}
                >
                  <p className="text-[11px] font-mono-ui" style={{ color: 'var(--text-muted)' }}>
                    {ticket.id}
                  </p>
                  <p className="mt-1 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {ticket.title}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]" style={{ color: 'var(--text-muted)' }}>
                    <span className="rounded px-1.5 py-0.5" style={badgeStyle}>
                      Tier {ticket.tier}
                    </span>
                    <span className="rounded px-1.5 py-0.5" style={badgeStyle}>
                      Conf {ticket.confidence}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => cycleStatus(ticket)}
                    className="mt-2 rounded px-2 py-1 text-[11px]"
                    style={{
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      background: 'transparent',
                    }}
                  >
                    Advance Status
                  </button>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>
    </AppShell>
  )
}
