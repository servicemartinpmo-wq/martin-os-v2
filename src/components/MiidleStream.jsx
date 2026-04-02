'use client'

import { useEffect, useState } from 'react'
import { listMemoryEvents } from '@/lib/api/memory'

export default function MiidleStream() {
  const [rows, setRows] = useState([])

  useEffect(() => {
    let cancelled = false
    async function pull() {
      try {
        const events = await listMemoryEvents(30)
        if (!cancelled) setRows(events)
      } catch {
        if (!cancelled) setRows([])
      }
    }
    pull()
    const t = setInterval(pull, 4000)
    return () => {
      cancelled = true
      clearInterval(t)
    }
  }, [])

  return (
    <section className="glass-panel p-4">
      <div className="flex items-center gap-2">
        <span
          className="inline-block size-2 animate-pulse rounded-full"
          style={{ background: 'var(--accent)' }}
          aria-hidden
        />
        <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
          Miidle stream
        </p>
      </div>
      <ul className="mt-3 max-h-64 space-y-2 overflow-y-auto text-sm">
        {rows.length === 0 ? (
          <li style={{ color: 'var(--text-muted)' }}>No bus events yet.</li>
        ) : (
          rows.map((r) => (
            <li
              key={r.id}
              className="flex flex-wrap items-baseline gap-2 border-b pb-2 last:border-b-0"
              style={{ borderColor: 'var(--border-subtle)' }}
            >
              <time className="font-mono-ui text-[11px]" style={{ color: 'var(--text-muted)' }}>
                {new Date(r.ts).toLocaleTimeString()}
              </time>
              <span
                className="rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase"
                style={{
                  background: 'var(--accent-muted)',
                  color: 'var(--text-primary)',
                }}
              >
                {r.type}
              </span>
              <span style={{ color: 'var(--text-primary)' }}>{r.summary}</span>
            </li>
          ))
        )}
      </ul>
    </section>
  )
}
