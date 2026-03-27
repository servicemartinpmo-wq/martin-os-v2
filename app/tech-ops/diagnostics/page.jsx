'use client'

import AppShell from '../../../src/features/shell/AppShell'
import { useMemo, useState } from 'react'
import { fallbackAiDiagnostics } from '../../../src/features/data/operationalData'
import { useSupabaseTable } from '../../../src/hooks/useSupabaseTable'
import { useSupabaseMutation } from '../../../src/hooks/useSupabaseMutation'

function normalizeDiagnostic(row, index) {
  const id = row.id != null ? String(row.id) : `diag-${index}`
  const check = row.check_label ?? row.check ?? 'Diagnostic check'
  const value = row.metric_value ?? row.value ?? '—'
  const note = row.detail ?? row.note ?? ''
  const acknowledged = Boolean(row.acknowledged)
  return { id, check, value, note, acknowledged }
}

export default function TechOpsDiagnosticsPage() {
  const [localDiagnostics, setLocalDiagnostics] = useState(fallbackAiDiagnostics)
  const [ackOverrides, setAckOverrides] = useState({})
  const { updateRow, loading: saving } = useSupabaseMutation()
  const { rows, loading, usingFallback } = useSupabaseTable({
    table: 'ai_diagnostics',
    select: 'id,check_label,metric_value,detail,acknowledged',
    orderBy: 'id',
    ascending: true,
    fallback: localDiagnostics,
  })

  const items = useMemo(() => {
    const base = rows.length > 0 ? rows : localDiagnostics
    return base.map((row, index) => normalizeDiagnostic(row, index)).map((row) => ({
      ...row,
      acknowledged: ackOverrides[row.id] ?? row.acknowledged,
    }))
  }, [rows, localDiagnostics, ackOverrides])

  async function acknowledge(row) {
    const result = await updateRow({
      table: 'ai_diagnostics',
      id: row.id,
      patch: { acknowledged: true },
    })
    if (result.ok) {
      setAckOverrides((prev) => ({ ...prev, [row.id]: true }))
      return
    }
    if (result.fallback) {
      setAckOverrides((prev) => ({ ...prev, [row.id]: true }))
      setLocalDiagnostics((prev) =>
        prev.map((item) => (String(item.id) === String(row.id) ? { ...item, acknowledged: true } : item)),
      )
    }
  }

  return (
    <AppShell activeHref="/tech-ops">
      <header className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-sky-300">Tech-Ops / Diagnostics</p>
        <h2 className="mt-2 text-2xl font-semibold text-zinc-100">System diagnostic stream</h2>
        <p className="mt-2 max-w-3xl text-sm text-zinc-400">
          Live rows load from Supabase <code className="rounded bg-zinc-950 px-1 py-0.5 text-xs text-zinc-300">ai_diagnostics</code>.
          Acknowledgments persist when RLS allows updates on <code className="rounded bg-zinc-950 px-1 py-0.5 text-xs">id</code>.
        </p>
      </header>

      <section className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-2 text-xs text-zinc-400">
        {loading
          ? 'Loading diagnostics...'
          : usingFallback
          ? 'Using fallback checklist (configure Supabase or seed ai_diagnostics).'
          : 'Live Supabase data loaded.'}
        {saving ? ' Saving…' : ''}
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <article
            key={item.id}
            className={`rounded-xl border p-5 ${
              item.acknowledged ? 'border-zinc-700/80 bg-zinc-950/40 opacity-90' : 'border-zinc-800 bg-zinc-900/50'
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <p className="text-xs uppercase tracking-wide text-zinc-400">{item.check}</p>
              {item.acknowledged ? (
                <span className="rounded border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-200">
                  Acknowledged
                </span>
              ) : null}
            </div>
            <p className="mt-2 text-2xl font-semibold text-zinc-100">{item.value}</p>
            <p className="mt-2 text-sm text-zinc-300">{item.note}</p>
            {!item.acknowledged ? (
              <button
                type="button"
                onClick={() => acknowledge(item)}
                className="mt-3 rounded border border-zinc-600 px-3 py-1.5 text-xs text-zinc-200 hover:border-zinc-500"
              >
                Acknowledge
              </button>
            ) : null}
          </article>
        ))}
      </section>
    </AppShell>
  )
}
