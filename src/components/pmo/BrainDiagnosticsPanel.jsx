'use client'

import { useEffect, useState } from 'react'
import { runBrain } from '@/brain/brainEngine'
import { useMartinOs } from '@/context/MartinOsProvider'

/**
 * Supplemental AI synthesis for diagnostics pages (does not replace Supabase signal rows).
 */
export default function BrainDiagnosticsPanel({ contextHint }) {
  const { appView } = useMartinOs()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState(null)

  useEffect(() => {
    let alive = true
    ;(async () => {
      setLoading(true)
      setErr(null)
      try {
        const out = await runBrain({
          appView,
          context: contextHint ?? 'Summarize diagnostic posture for operators.',
        })
        if (alive) setData(out)
      } catch (e) {
        if (alive) setErr(e instanceof Error ? e.message : 'brain error')
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [appView, contextHint])

  const priorities = Array.isArray(data?.priorities) ? data.priorities : []

  return (
    <section className="glass-panel p-5">
      <p className="text-xs uppercase tracking-[0.2em]" style={{ color: 'var(--accent)' }}>
        AI · Diagnostic synthesis
      </p>
      <h3 className="font-display mt-2 text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
        Operator brief
      </h3>
      <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
        {data?.mock ? 'Demo / offline model' : 'Live model'} · {loading ? 'Updating…' : 'Ready'}
      </p>
      {err ? (
        <p className="mt-2 text-sm" style={{ color: 'var(--error)' }}>
          {err}
        </p>
      ) : null}
      {!loading && data?.summary ? (
        <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
          {data.summary}
        </p>
      ) : null}
      {priorities.length > 0 ? (
        <ul className="mt-3 space-y-2">
          {priorities.slice(0, 4).map((p) => (
            <li
              key={p.title}
              className="rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
            >
              {p.title}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  )
}
