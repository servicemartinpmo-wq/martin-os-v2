'use client'

import AppShell from '../../../src/features/shell/AppShell'
import { useMemo, useState } from 'react'
import { fallbackTechTickets } from '../../../src/features/data/operationalData'
import { useSupabaseTable } from '../../../src/hooks/useSupabaseTable'
import { useSupabaseMutation } from '../../../src/hooks/useSupabaseMutation'

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
      <header className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-sky-300">Tech-Ops / Tickets</p>
        <h2 className="mt-2 text-2xl font-semibold text-zinc-100">Ticket and tier routing queue</h2>
      </header>

      <section className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
        <div className="flex flex-wrap gap-2">
          {['All', 'Tier 1', 'Tier 2', 'Tier 3', 'Tier 4'].map((tier) => (
            <button
              key={tier}
              type="button"
              onClick={() => setTierFilter(tier)}
              className={`rounded-lg border px-3 py-2 text-xs ${
                tierFilter === tier ? 'border-cyan-400/50 bg-cyan-500/10 text-cyan-200' : 'border-zinc-700 text-zinc-300'
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {['All', 'Open', 'Investigating', 'Escalated', 'Resolved'].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`rounded-lg border px-3 py-2 text-xs ${
                statusFilter === status ? 'border-cyan-400/50 bg-cyan-500/10 text-cyan-200' : 'border-zinc-700 text-zinc-300'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-2 text-xs text-zinc-400">
        {loading
          ? 'Loading tickets...'
          : usingFallback
          ? 'Using local fallback data (configure Supabase env to load live records).'
          : 'Live Supabase data loaded.'}
        {saving ? ' Saving update...' : ''}
      </section>

      <section className="mt-6 grid gap-4 xl:grid-cols-4">
        {Object.entries(grouped).map(([lane, laneTickets]) => (
          <article key={lane} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-100">{lane}</h3>
              <span className="rounded border border-zinc-700 px-2 py-0.5 text-xs text-zinc-300">{laneTickets.length}</span>
            </div>
            <div className="space-y-3">
              {laneTickets.length === 0 && <p className="text-xs text-zinc-500">No tickets</p>}
              {laneTickets.map((ticket) => (
                <div key={ticket.id} className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3">
                  <p className="text-[11px] text-zinc-400">{ticket.id}</p>
                  <p className="mt-1 text-sm font-medium text-zinc-100">{ticket.title}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5 text-[11px] text-zinc-300">
                    <span className="rounded border border-zinc-700 px-1.5 py-0.5">Tier {ticket.tier}</span>
                    <span className="rounded border border-zinc-700 px-1.5 py-0.5">Conf {ticket.confidence}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => cycleStatus(ticket)}
                    className="mt-2 rounded border border-zinc-700 px-2 py-1 text-[11px] text-zinc-200 hover:border-zinc-500"
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
