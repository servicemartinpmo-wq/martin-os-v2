'use client'

import { useEffect, useState } from 'react'

export default function LiveLogs() {
  const [lines, setLines] = useState(['Connecting…'])

  useEffect(() => {
    let cancel = false

    async function pull() {
      try {
        const res = await fetch('/api/logs')
        const body = await res.json()
        if (!cancel && Array.isArray(body.lines)) setLines(body.lines)
      } catch {
        if (!cancel) setLines(['Log fetch failed (stub)'])
      }
    }

    pull()
    const t = setInterval(pull, 20000)
    return () => {
      cancel = true
      clearInterval(t)
    }
  }, [])

  return (
    <section className="glass-panel p-4 font-mono-ui">
      <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
        Live logs (stub poll 20s)
      </p>
      <ul className="mt-3 max-h-48 space-y-1 overflow-y-auto text-xs leading-relaxed">
        {lines.map((l) => (
          <li key={l} style={{ color: 'var(--text-muted)' }}>
            {l}
          </li>
        ))}
      </ul>
    </section>
  )
}
