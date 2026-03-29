'use client'

import AppShell from '@/features/shell/AppShell'
import { useMemo, useState } from 'react'
import { fallbackPmoInitiatives } from '@/features/data/operationalData'
import { useSupabaseTable } from '@/hooks/useSupabaseTable'
import { useSupabaseMutation } from '@/hooks/useSupabaseMutation'
import { PageHeader, FilterChip } from '@/components/page/PageChrome'
import Input from '@/components/catalyst/Input'
import { normalizeInitiativeRow } from '@/lib/pmoInitiativeShape'
import { getMaturityBand } from '@/lib/maturityBand'
import {
  initiativeStatusBadgeClass,
  initiativeStatusLabel,
} from '@/lib/initiativeStatusDisplay'
import { cn } from '@/lib/cn'

export default function PMOInitiativesPage() {
  const [statusFilter, setStatusFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [localRows, setLocalRows] = useState(fallbackPmoInitiatives)
  const [statusById, setStatusById] = useState({})
  const { updateRow, loading: saving } = useSupabaseMutation()
  const { rows, loading, usingFallback } = useSupabaseTable({
    table: 'initiatives',
    select:
      'id,name,status,priority_score,strategic_alignment,dependency_risk,completion_pct,owner,priority,alignment,risk,completion',
    orderBy: 'name',
    fallback: localRows,
  })

  const filteredRows = useMemo(() => {
    return rows
      .map((row) => normalizeInitiativeRow(row))
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
      <PageHeader
        kicker="PMO-Ops / Initiatives"
        title="Initiative control table"
        subtitle="Aligned to mpo-pilot Supabase columns (priority_score, strategic_alignment, dependency_risk, completion_pct) with local fallback when env is unset."
      />

      <section className="glass-panel mt-6 flex flex-wrap items-center gap-3 p-4">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search initiatives..."
          className="w-full sm:w-64"
        />
        <div className="flex flex-wrap gap-2">
          {['All', 'On Track', 'At Risk', 'Delayed', 'Abandoned', 'Completed'].map((status) => (
            <FilterChip key={status} active={statusFilter === status} onClick={() => setStatusFilter(status)}>
              {status === 'All' ? 'All' : status === 'At Risk' ? 'Needs attention' : status}
            </FilterChip>
          ))}
        </div>
      </section>

      <section
        className="glass-panel mt-4 px-4 py-2 text-xs"
        style={{ color: 'var(--text-muted)' }}
      >
        {loading
          ? 'Loading initiatives...'
          : usingFallback
            ? 'Using local fallback data (configure Supabase env to load live records).'
            : 'Live Supabase data loaded.'}
        {saving ? ' Saving update...' : ''}
      </section>

      <section className="glass-panel mt-6 overflow-x-auto p-0">
        <table className="min-w-full text-sm">
          <thead className="mos-table-head">
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
              <tr key={String(row.id ?? row.name)} className="mos-table-row">
                <td className="px-4 py-3 font-medium">{row.name ?? '—'}</td>
                <td className="px-4 py-3">
                  <span className={initiativeStatusBadgeClass(row.status)}>{initiativeStatusLabel(row.status)}</span>
                </td>
                <td className="px-4 py-3 text-right font-mono">{row.priority}</td>
                <td className="px-4 py-3 text-right font-mono">{row.alignment}</td>
                <td className="px-4 py-3 text-right font-mono">{row.risk}</td>
                <td className="px-4 py-3 text-right">
                  {(() => {
                    const n = Number(row.completion)
                    const band = getMaturityBand(Number.isNaN(n) ? 0 : n)
                    return (
                      <span className={cn('font-mono font-semibold tabular-nums', band.textClass)}>
                        {row.completion}%
                      </span>
                    )
                  })()}
                </td>
                <td className="px-4 py-3">{row.owner}</td>
                <td className="px-4 py-3">
                  <select
                    value={row.status ?? 'On Track'}
                    onChange={(event) => setInitiativeStatus(row, event.target.value)}
                    className="rounded border px-2 py-1 text-xs"
                    style={{
                      borderColor: 'var(--border-subtle)',
                      background: 'var(--bg-elevated)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <option value="On Track">On track</option>
                    <option value="At Risk">Needs attention</option>
                    <option value="Delayed">Delayed</option>
                    <option value="Abandoned">Abandoned</option>
                    <option value="Completed">Completed</option>
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
