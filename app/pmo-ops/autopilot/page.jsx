'use client'

import { useState } from 'react'
import AppShell from '@/features/shell/AppShell'
import { PageHeader, PageSection } from '@/components/page/PageChrome'
import Button from '@/components/catalyst/Button'
import Field from '@/components/catalyst/Field'
import Input from '@/components/catalyst/Input'

export default function AutopilotPage() {
  const [goal, setGoal] = useState('')
  const [plan, setPlan] = useState(null)

  async function runStub() {
    setPlan({
      demo: true,
      phases: ['Discovery', 'Milestones', 'Task breakdown', 'KPI hooks'],
      note: 'NL → roadmap approvals gate mass writes. Wire /api/ai structured output + templates.',
    })
  }

  return (
    <AppShell activeHref="/pmo-ops">
      <PageHeader
        kicker="Project autopilot (demo)"
        title="Describe a goal — preview a plan"
        subtitle="Human approval required before bulk persistence. This page runs a local stub only."
      />
      <PageSection title="Goal">
        <div className="mx-auto max-w-xl space-y-3">
          <Field label="What are we shipping?">
            <Input value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="e.g. Launch analytics v2 in 8 weeks" />
          </Field>
          <Button type="button" onClick={runStub} disabled={!goal.trim()}>
            Generate preview (stub)
          </Button>
        </div>
      </PageSection>
      {plan ? (
        <PageSection title="Preview">
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {plan.note}
          </p>
          <ol className="mt-3 list-decimal pl-5 text-sm" style={{ color: 'var(--text-primary)' }}>
            {plan.phases.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ol>
        </PageSection>
      ) : null}
    </AppShell>
  )
}
