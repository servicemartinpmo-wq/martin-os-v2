'use client'

import { useEffect, useState } from 'react'
import AppShell from '@/features/shell/AppShell'
import { PageHeader, PageSection } from '@/components/page/PageChrome'
import Button from '@/components/catalyst/Button'
import Field from '@/components/catalyst/Field'
import Input from '@/components/catalyst/Input'
import { fetchLearningEvents, recordLearningEvent } from '@/learning/LearningLayer'

export default function DecisionsPage() {
  const [events, setEvents] = useState([])
  const [decision, setDecision] = useState('')
  const [owner, setOwner] = useState('')
  const [expected, setExpected] = useState('')

  async function refresh() {
    try {
      const j = await fetchLearningEvents()
      setEvents(j.events ?? [])
    } catch {
      setEvents([])
    }
  }

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const j = await fetchLearningEvents()
        if (!cancelled) setEvents(j.events ?? [])
      } catch {
        if (!cancelled) setEvents([])
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  async function submit(e) {
    e.preventDefault()
    await recordLearningEvent({ decision, owner, expected })
    setDecision('')
    setExpected('')
    await refresh()
  }

  return (
    <AppShell activeHref="/pmo-ops">
      <PageHeader
        kicker="Corporate memory (v1)"
        title="Decision log"
        subtitle="Append-only events post to /api/learning (in-memory demo store). Replace with durable DB for production."
      />
      <PageSection title="Record a decision">
        <form onSubmit={submit} className="mx-auto max-w-xl space-y-3">
          <Field label="Decision">
            <Input value={decision} onChange={(e) => setDecision(e.target.value)} required />
          </Field>
          <Field label="Owner">
            <Input value={owner} onChange={(e) => setOwner(e.target.value)} />
          </Field>
          <Field label="Expected outcome">
            <Input value={expected} onChange={(e) => setExpected(e.target.value)} />
          </Field>
          <Button type="submit">Save (demo)</Button>
        </form>
      </PageSection>
      <PageSection title="Recent entries">
        <ul className="space-y-2 text-sm" style={{ color: 'var(--text-muted)' }}>
          {events.length === 0 ? <li>No entries yet.</li> : null}
          {events.map((ev) => (
            <li key={ev.id} className="rounded border p-2" style={{ borderColor: 'var(--border-subtle)' }}>
              <span className="font-mono-ui text-xs">{ev.at}</span> — {ev.decision || '(empty)'}
            </li>
          ))}
        </ul>
      </PageSection>
    </AppShell>
  )
}
