import AppShell from '../../src/features/shell/AppShell'
import { getContractsForDomain } from '../../src/requirements/contracts'
import LiveLogs from '../../src/components/LiveLogs'
import { PageHeader, PageCard, PageSection, TileLink } from '@/components/page/PageChrome'

const architectureLayers = [
  { layer: 'Data Layer', items: ['tickets', 'support_tiers', 'ticket_tier_mapping', 'ai_diagnostics', 'activity_logs', 'knowledge_base'] },
  { layer: 'Logic Layer', items: ['Tier assignment function', 'Escalation trigger', 'Knowledge update trigger', 'RLS policies'] },
  { layer: 'AI Layer', items: ['Issue detection', 'Tier recommendation', 'Confidence scoring', 'Reasoning trace'] },
  { layer: 'Workflow Layer', items: ['Event automation', 'Integration sync', 'Escalation workflows', 'Operator review queue'] },
]

const techOpsStreams = [
  {
    title: 'Ticket Ops',
    text: 'Unified intake, priority management, owner assignment, and lifecycle status from open to resolved.',
  },
  {
    title: 'Tier Routing',
    text: 'Deterministic confidence-based assignment and escalation for predictable incident handling.',
  },
  {
    title: 'Knowledge Loop',
    text: 'Resolved tickets update reusable patterns so future diagnostics become faster and more accurate.',
  },
  {
    title: 'Integration Control',
    text: 'Sync health visibility and runbook triggers for connected sources and support systems.',
  },
]

export default function TechOpsPage() {
  const contracts = getContractsForDomain('tech-ops')

  return (
    <AppShell activeHref="/tech-ops">
      <PageHeader
        kicker="Tech-Ops Native"
        title="Canonical integration surface"
        subtitle="This module is aligned to the Tech-Ops repo and Tech-OPS build references: support architecture, AI-assisted routing,
          escalation automation, and auditable activity trails."
      />

      <section className="mt-6">
        <LiveLogs />
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        {architectureLayers.map((row) => (
          <PageCard key={row.layer} title={row.layer}>
            <ul className="space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
              {row.items.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </PageCard>
        ))}
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        {techOpsStreams.map((stream) => (
          <PageCard key={stream.title} title={stream.title}>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {stream.text}
            </p>
          </PageCard>
        ))}
      </section>

      <PageSection title="Tech-Ops modules">
        <div className="grid gap-3 sm:grid-cols-3">
          <TileLink href="/tech-ops/tickets">Tickets</TileLink>
          <TileLink href="/tech-ops/diagnostics">Diagnostics</TileLink>
          <TileLink href="/tech-ops/workflows">Workflows</TileLink>
        </div>
      </PageSection>

      <PageSection title="Source and contract traceability">
        <div className="grid gap-4 lg:grid-cols-2">
          {contracts.map((contract) => (
            <article key={contract.name} className="mos-surface-deep p-4">
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                {contract.name}
              </p>
              <ul className="mt-2 space-y-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                {contract.requirements.map((req) => (
                  <li key={req}>- {req}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </PageSection>
    </AppShell>
  )
}
