'use client'

import { useEffect, useState } from 'react'
import { runBrain } from '@/brain/brainEngine'
import { useMartinOs } from '@/context/MartinOsProvider'
import { pushMemoryEvent } from '@/lib/api/memory'
import Link from 'next/link'

export default function NextActionCard() {
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
          context: 'Synthesize next actions for executive PMO context.',
        })
        if (!alive) return
        setData(out)
        await pushMemoryEvent({
          type: 'brain',
          summary: out.summary?.slice?.(0, 120) ?? 'brain refresh',
        }).catch(() => null)
      } catch (e) {
        if (!alive) return
        setErr(e instanceof Error ? e.message : 'brain error')
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [appView])

  const priorities = Array.isArray(data?.priorities) ? data.priorities : []

  return (
    <section className="glass-panel p-6">
      <p className="text-xs uppercase tracking-[0.2em]" style={{ color: 'var(--accent)' }}>
        Suggested next actions
      </p>
      <h2 className="font-display mt-2 text-xl font-semibold">Chief of staff</h2>
      <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
        {data?.mock ? 'Demo / offline model' : 'Live synthesis'} · {loading ? 'Updating…' : 'Ready'}
      </p>
      {err ? (
        <p className="mt-3 text-sm" style={{ color: 'var(--error)' }}>
          {err}
        </p>
      ) : null}
      {!loading && data?.summary ? (
        <p className="mt-4 text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
          {data.summary}
        </p>
      ) : null}
      <ul className="mt-4 space-y-2">
        {priorities.slice(0, 3).map((p) => (
          <li
            key={p.title}
            className="rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
          >
            <span className="font-medium">{p.title}</span>
            {p.confidence != null ? (
              <span className="ml-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                {Math.round(Number(p.confidence) * 100)}% conf.
              </span>
            ) : null}
          </li>
        ))}
      </ul>
      <Link
        href="/settings"
        className="mt-5 inline-block text-sm font-medium"
        style={{ color: 'var(--accent)' }}
      >
        Tune autonomy & operating mode →
      </Link>
    </section>
  )
}
