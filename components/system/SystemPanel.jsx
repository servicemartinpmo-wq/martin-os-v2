'use client'

import { readContext } from '@/agents/bus/contextBus'

/** Debug / exec — hide behind settings flag in production builds. */
export default function SystemPanel() {
  const enabled =
    typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SYSTEM_PANEL === '1'

  if (!enabled) return null

  const ctx = typeof window !== 'undefined' ? readContext() : ''

  return (
    <section
      className="glass-panel p-4 text-xs"
      style={{ color: 'var(--text-muted)' }}
    >
      <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
        System panel
      </p>
      <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap">{ctx || 'Context bus empty'}</pre>
    </section>
  )
}
