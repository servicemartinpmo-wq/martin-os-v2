'use client'

import AppShell from '../../../src/features/shell/AppShell'
import { useMemo, useState } from 'react'
import { fallbackPmoInitiatives } from '../../../src/features/data/operationalData'
import { useSupabaseTable } from '../../../src/hooks/useSupabaseTable'
import { useSupabaseMutation } from '../../../src/hooks/useSupabaseMutation'

export default function PMOInitiativesPage() {
  const [statusFilter, setStatusFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [localRows, setLocalRows] = useState(fallbackPmoInitiatives)
  const [statusById, setStatusById] = useState({})
  const { updateRow, loading: saving } = useSupabaseMutation()
  const { rows, loading, usingFallback } = useSupabaseTable({
    table: 'initiatives',
    select: 'id,name,status,priority,alignment,risk,completion,owner',
    orderBy: 'name',
    fallback: localRows,
  })

  const filteredRows = useMemo(() => {
    return rows
      .map((row) => {
        const id = String(row.id ?? row.name)
        return { ...row, status: statusById[id] ?? row.status }
      })
      .filter((row) => {
        const statusOk = statusFilter === 'All' || row.status === statusFilter
        const searchOk = String(row.name ?? '')
          .toLowerCase()
          .includes(search.toLowerCase())
        return statusOk && searchOk
      })
  }, [rows, statusFilter, search, statusById])

  async function setInitiativeStatus(row, nextStatus) {
    const result = await updateRow({ table: 'initiatives', id: row.id, patch: { status: nextStatus } })
    if (result.ok || result.fallback) {
      const id = String(row.id ?? row.name)
      setStatusById((prev) => ({ ...prev, [id]: nextStatus }))
    }
    if (result.fallback) {
      setLocalRows((prev) => prev.map((item) => (String(item.id) === String(row.id) ? { ...item, status: nextStatus } : item)))
    }
  }

  return (
    <AppShell activeHref="/pmo-ops">
      <header className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">PMO-Ops / Initiatives</p>
        <h2 className="mt-2 text-2xl font-semibold text-zinc-100">Initiative control table</h2>
        <p className="mt-2 text-sm text-zinc-300">
          Ported from legacy initiative management patterns: priority, alignment, dependency risk, ownership, and completion in one view.
        </p>
      </header>

      <section className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search initiatives..."
          className="w-full rounded-lg border border-zinc-700 bg-zinc-950/50 px-3 py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 sm:w-64"
        />
        <div className="flex flex-wrap gap-2">
          {['All', 'On Track', 'At Risk', 'Delayed'].map((status) => (
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
          ? 'Loading initiatives...'
          : usingFallback
          ? 'Using local fallback data (configure Supabase env to load live records).'
          : 'Live Supabase data loaded.'}
        {saving ? ' Saving update...' : ''}
      </section>

      <section className="mt-6 overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900/50">
        <table className="min-w-full text-sm">
          <thead className="border-b border-zinc-800 bg-zinc-950/60 text-zinc-400">
            <tr>
              <th className="px-4 py-3 text-left">Initiative</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-right">Priority</th>
              <th className="px-4 py-3 text-right">Alignment</th>
              <th className="px-4 py-3 text-right">Risk</th>
              <th className="px-4 py-3 text-right">Completion</th>
              <th className="px-4 py-3 text-left">Owner</th>
              <th className="px-4 py-3 text-left">Update</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row) => (
              <tr key={String(row.id ?? row.name)} className="border-b border-zinc-800/70 text-zinc-200">
                <td className="px-4 py-3 font-medium">{row.name ?? '—'}</td>
                <td className="px-4 py-3">{row.status}</td>
                <td className="px-4 py-3 text-right font-mono">{row.priority}</td>
                <td className="px-4 py-3 text-right font-mono">{row.alignment}</td>
                <td className="px-4 py-3 text-right font-mono">{row.risk}</td>
                <td className="px-4 py-3 text-right font-mono">{row.completion}%</td>
                <td className="px-4 py-3">{row.owner}</td>
                <td className="px-4 py-3">
                  <select
                    value={row.status ?? 'On Track'}
                    onChange={(event) => setInitiativeStatus(row, event.target.value)}
                    className="rounded border border-zinc-700 bg-zinc-950/60 px-2 py-1 text-xs text-zinc-200"
                  >
                    <option>On Track</option>
                    <option>At Risk</option>
                    <option>Delayed</option>
                    <option>Completed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </AppShell>
  )
}
