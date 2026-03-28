import AppShell from '../../src/features/shell/AppShell'
import { getContractsForDomain } from '../../src/requirements/contracts'
import LiveLogs from '../../src/components/LiveLogs'
import { PageHeader, PageCard, PageSection, TileLink } from '@/components/page/PageChrome'
import { techConnectorHealth, techOpsSlaBoard, techWorkflowRuns } from '@/features/data/operationalData'

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
  const unhealthyConnectors = techConnectorHealth.filter((item) => item.state !== 'healthy').length

  return (
    <AppShell activeHref="/tech-ops">
      <PageHeader
        kicker="Tech-Ops Native"
        title="Canonical integration surface"
        subtitle="Rebuilt from Tech-Ops repo patterns: ticket operations, SLA control, connector reliability, and diagnostic workflow traces."
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

      <PageSection title="SLA board">
        <div className="grid gap-3 md:grid-cols-2">
          {techOpsSlaBoard.map((sla) => (
            <article key={sla.label} className="mos-surface-deep p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {sla.label}
                </p>
                <span
                  className="text-xs"
                  style={{ color: sla.state === 'warning' ? 'var(--warning)' : 'var(--success)' }}
                >
                  {sla.state}
                </span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                <p>Target</p>
                <p className="text-right">{sla.target}</p>
                <p>Actual</p>
                <p className="text-right" style={{ color: 'var(--text-primary)' }}>
                  {sla.actual}
                </p>
              </div>
            </article>
          ))}
        </div>
      </PageSection>

      <PageSection title="Tech-Ops modules">
        <div className="grid gap-3 sm:grid-cols-3">
          <TileLink href="/tech-ops/tickets">Tickets</TileLink>
          <TileLink href="/tech-ops/diagnostics">Diagnostics</TileLink>
          <TileLink href="/tech-ops/workflows">Workflows</TileLink>
        </div>
      </PageSection>

      <PageSection title="Connector and workflow reliability">
        <div className="grid gap-4 lg:grid-cols-2">
          <article className="mos-surface-deep p-4">
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              Connector health
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              {techConnectorHealth.map((row) => (
                <li key={row.name} className="flex items-center justify-between gap-3">
                  <span style={{ color: 'var(--text-primary)' }}>{row.name}</span>
                  <span style={{ color: 'var(--text-muted)' }}>
                    {row.uptime.toFixed(2)}% · {row.lagMs}ms
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs" style={{ color: 'var(--text-muted)' }}>
              {unhealthyConnectors} connector(s) currently degraded.
            </p>
          </article>
          <article className="mos-surface-deep p-4">
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              Active workflow runs
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              {techWorkflowRuns.map((run) => (
                <li key={run.id} className="flex items-center justify-between gap-3">
                  <div>
                    <p style={{ color: 'var(--text-primary)' }}>{run.workflow}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {run.id} · {run.stage}
                    </p>
                  </div>
                  <span style={{ color: run.state === 'warning' ? 'var(--warning)' : 'var(--text-muted)' }}>
                    {run.eta}
                  </span>
                </li>
              ))}
            </ul>
          </article>
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
