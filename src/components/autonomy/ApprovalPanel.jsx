'use client'

import { useState } from 'react'
import { approve, listQueue, runAutonomy } from '@/autonomy'
import { AUTONOMY_ENABLED } from '@/autonomy/flags'

export default function ApprovalPanel() {
  const [tick, setTick] = useState(0)
  void tick
  const items = listQueue()

  return (
    <section className="glass-panel space-y-3 p-4">
      <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
        Approvals {AUTONOMY_ENABLED ? '(autonomy on)' : '(autonomy off)'}
      </p>
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
        Queue is in-memory for demo. Enable with NEXT_PUBLIC_AUTONOMY_ENABLED=1 only after audit.
      </p>
      <ul className="space-y-2 text-sm">
        {items.map((q) => (
          <li
            key={q.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-md border px-3 py-2"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            <span style={{ color: 'var(--text-primary)' }}>{q.id}</span>
            <span style={{ color: 'var(--text-muted)' }}>{q.status}</span>
            {q.status === 'pending' ? (
              <button
                type="button"
                className="text-xs font-medium"
                style={{ color: 'var(--accent)' }}
                onClick={() => {
                  approve(q.id)
                  setTick((x) => x + 1)
                }}
              >
                Approve
              </button>
            ) : null}
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="rounded-md border px-3 py-2 text-xs"
        style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
        onClick={async () => {
          await runAutonomy({ type: 'mutate_task', confidence: 0.5 })
          setTick((x) => x + 1)
        }}
      >
        Simulate guarded action (should queue)
      </button>
    </section>
  )
}
