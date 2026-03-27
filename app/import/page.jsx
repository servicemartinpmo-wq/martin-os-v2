'use client'

import AppShell from '@/features/shell/AppShell'
import Link from 'next/link'
import { IMPORT_CONNECTORS } from '@/lib/importConnectors'
import Button from '@/components/catalyst/Button'

const CHECKLIST = [
  'Pick source: Asana, Jira, Trello, Monday, or ClickUp',
  'Authenticate (OAuth) or paste API key',
  'Map workspace → Martin ontology (projects, tasks, statuses)',
  'Dry-run preview + confirm',
  'Incremental re-sync enabled',
]

export default function ImportPage() {
  return (
    <AppShell activeHref="/import">
      <header className="glass-panel p-6">
        <p className="text-xs uppercase tracking-[0.2em]" style={{ color: 'var(--accent)' }}>
          60-second switch
        </p>
        <h1 className="font-display mt-2 text-3xl font-semibold">
          Import from your current tool
        </h1>
        <p className="mt-2 max-w-3xl text-sm" style={{ color: 'var(--text-muted)' }}>
          Connectors are stubbed — UI and checklist match the adoption wedge. Wire OAuth + mapping routes next.
        </p>
      </header>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="glass-panel p-5">
          <h2 className="font-display text-lg font-semibold">Connectors</h2>
          <ul className="mt-4 space-y-2">
            {IMPORT_CONNECTORS.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
                style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
              >
                <span>{c.label}</span>
                <span className="text-xs uppercase" style={{ color: 'var(--text-muted)' }}>
                  {c.status}
                </span>
              </li>
            ))}
          </ul>
          <Button className="mt-4" disabled>
            Start import (soon)
          </Button>
        </div>
        <div className="glass-panel p-5">
          <h2 className="font-display text-lg font-semibold">Checklist</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm" style={{ color: 'var(--text-muted)' }}>
            {CHECKLIST.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <Link href="/settings" className="mt-6 inline-block text-sm font-medium" style={{ color: 'var(--accent)' }}>
            Industry & operating mode →
          </Link>
        </div>
      </section>
    </AppShell>
  )
}
