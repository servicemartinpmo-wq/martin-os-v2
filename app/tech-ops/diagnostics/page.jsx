'use client'

import AppShell from '../../../src/features/shell/AppShell'
import { useMemo, useState } from 'react'
import { fallbackAiDiagnostics } from '../../../src/features/data/operationalData'
import { useSupabaseTable } from '../../../src/hooks/useSupabaseTable'
import { useSupabaseMutation } from '../../../src/hooks/useSupabaseMutation'
import { PageHeader } from '@/components/page/PageChrome'

function normalizeDiagnostic(row, index) {
  const id = row.id != null ? String(row.id) : `diag-${index}`
  const check = row.check_label ?? row.check ?? 'Diagnostic check'
  const value = row.metric_value ?? row.value ?? '—'
  const note = row.detail ?? row.note ?? ''
  const acknowledged = Boolean(row.acknowledged)
  return { id, check, value, note, acknowledged }
}

const codeStyle = {
  borderRadius: '0.25rem',
  padding: '0.125rem 0.25rem',
  fontSize: '0.75rem',
  background: 'var(--bg-elevated)',
  border: '1px solid var(--border-subtle)',
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
      <PageHeader
        kicker="Tech-Ops / Diagnostics"
        title="System diagnostic stream"
        subtitle={
          <>
            Live rows load from Supabase <code style={codeStyle}>ai_diagnostics</code>. Acknowledgments persist when RLS
            allows updates on <code style={codeStyle}>id</code>.
          </>
        }
      />

      <section
        className="glass-panel mt-4 px-4 py-2 text-xs"
        style={{ color: 'var(--text-muted)' }}
      >
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
            className="rounded-xl border p-5"
            style={{
              borderColor: 'var(--border-subtle)',
              background: item.acknowledged ? 'color-mix(in oklab, var(--bg-elevated) 60%, transparent)' : 'var(--surface-glass)',
              opacity: item.acknowledged ? 0.92 : 1,
            }}
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                {item.check}
              </p>
              {item.acknowledged ? (
                <span
                  className="rounded px-2 py-0.5 text-[11px]"
                  style={{
                    border: '1px solid color-mix(in oklab, var(--success) 40%, transparent)',
                    background: 'color-mix(in oklab, var(--success) 12%, transparent)',
                    color: 'var(--success)',
                  }}
                >
                  Acknowledged
                </span>
              ) : null}
            </div>
            <p className="mt-2 text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              {item.value}
            </p>
            <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
              {item.note}
            </p>
            {!item.acknowledged ? (
              <button
                type="button"
                onClick={() => acknowledge(item)}
                className="mt-3 rounded border px-3 py-1.5 text-xs"
                style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)', background: 'transparent' }}
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
