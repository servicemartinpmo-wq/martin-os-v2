'use client'

import { useState } from 'react'
import { useMartinOs } from '@/context/MartinOsProvider'

const HELP_COPY = {
  '/pmo-ops':
    'PMO-Ops is the executive command surface: initiatives, diagnostics, and AI-suggested next actions.',
  '/tech-ops': 'Tech-Ops tracks incidents, tiers, and workflow contracts with live log stubs.',
  '/miiddle': 'Miiddle captures execution proof and feeds streams the agents can read.',
  default: 'This screen is part of Martin OS. Use Settings to change operating mode and theme tokens.',
}

/** Assist / “Explain This” — static copy v1; later `/api/ai` micro-prompt. */
export default function ExplainThis({ pathname }) {
  const [open, setOpen] = useState(false)
  const { operatingMode } = useMartinOs()
  if (operatingMode !== 'assisted') return null

  const path = pathname ?? ''
  const key = ['/pmo-ops', '/tech-ops', '/miiddle'].find((p) => path.startsWith(p))
  const text = HELP_COPY[key] ?? HELP_COPY.default

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="mos-chip text-xs"
        style={{ borderColor: 'var(--accent)' }}
      >
        Explain this screen
      </button>
      {open ? (
        <p
          className="mt-2 max-w-xl rounded-md border p-3 text-sm"
          style={{
            borderColor: 'var(--border-subtle)',
            color: 'var(--text-muted)',
            background: 'var(--surface-elevated)',
          }}
        >
          {text}
        </p>
      ) : null}
    </div>
  )
}
