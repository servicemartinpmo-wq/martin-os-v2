'use client'

import { useState } from 'react'
import { orchestrateAgents } from '@/lib/api/orchestrator'
import { useMartinOs } from '@/context/MartinOsProvider'

/** Unified agent output — token styling only. */
export default function AgentPanel({ appView }) {
  const { cognitiveProfileId } = useMartinOs()
  const [out, setOut] = useState(null)
  const [busy, setBusy] = useState(false)

  async function run() {
    setBusy(true)
    try {
      const result = await orchestrateAgents({
        appView,
        cognitiveProfileId,
        snapshot: 'Demo snapshot: initiatives healthy; two escalations open.',
      })
      setOut(result)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="glass-panel p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
          Agents
        </p>
        <button
          type="button"
          onClick={run}
          disabled={busy}
          className="rounded-md border px-3 py-1.5 text-xs font-medium"
          style={{
            borderColor: 'var(--accent)',
            color: 'var(--text-primary)',
            opacity: busy ? 0.5 : 1,
          }}
        >
          {busy ? 'Running…' : 'Run orchestrator'}
        </button>
      </div>
      {out ? (
        <pre
          className="mt-3 max-h-64 overflow-auto rounded-md p-3 text-[11px] leading-relaxed"
          style={{
            background: 'var(--bg-elevated)',
            color: 'var(--text-muted)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          {JSON.stringify(out, null, 2)}
        </pre>
      ) : (
        <p className="mt-3 text-sm" style={{ color: 'var(--text-muted)' }}>
          Orchestrator merges role-specific passes (client demo).
        </p>
      )}
    </section>
  )
}
