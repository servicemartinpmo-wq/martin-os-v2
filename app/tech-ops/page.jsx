'use client'

import AppShell from '@/features/shell/AppShell'
import LiveLogs from '@/components/LiveLogs'
import TechOpsReadinessBand from '@/features/techops/TechOpsReadinessBand'
import {
  PageCard,
  PageHeader,
  PageSection,
  TileLink,
} from '@/components/page/PageChrome'
import { useMartinOs } from '@/context/MartinOsProvider'
import { useTechOpsDashboardData } from '@/features/techops/useTechOpsDashboardData'
import { getContractsForDomain } from '@/requirements/contracts'

const TECH_MODULE_LINKS = [
  { href: '/tech-ops/tickets', label: 'Requests' },
  { href: '/tech-ops/diagnostics', label: 'Checks' },
  { href: '/tech-ops/alerts', label: 'Alerts' },
  { href: '/tech-ops/knowledge', label: 'Help library' },
  { href: '/tech-ops/connectors', label: 'Connected apps' },
  { href: '/tech-ops/workflows', label: 'Automations' },
]

function getModeCopy(userMode) {
  switch (userMode) {
    case 'executive':
      return {
        title: 'Executive technology oversight',
        subtitle:
          'A clearer oversight surface for reliability posture, automation health, and only the exceptions that need leadership attention.',
      }
    case 'admin_project':
      return {
        title: 'Operational systems console',
        subtitle:
          'A structured console for workflow runs, connector health, SLA posture, and accountable follow-through.',
      }
    case 'healthcare':
      return {
        title: 'Clinical operations systems board',
        subtitle:
          'A calmer monitoring layer for service readiness, diagnostic drift, workflow stability, and handoff confidence.',
      }
    case 'creative':
      return {
        title: 'Creative systems stage',
        subtitle:
          'A more visual operations surface where automations, tools, and status signals still stay legible for makers.',
      }
    case 'startup':
      return {
        title: 'Launch reliability command',
        subtitle:
          'A sharper command-center for launch posture, connector issues, workflow acceleration, and incident readiness.',
      }
    case 'freelance':
      return {
        title: 'Solo systems board',
        subtitle:
          'A lightweight monitoring layer for the tools, automations, and support signals a solo operator needs every day.',
      }
    default:
      return {
        title: 'Operator command center',
        subtitle:
          'A high-visibility surface for diagnostics, workflow automation, live traces, and connector reliability across the stack.',
      }
  }
}

export default function TechOpsPage() {
  const { userMode } = useMartinOs()
  const contracts = getContractsForDomain('tech-ops')
  const { data, error, loading, usingFallback } = useTechOpsDashboardData()
  const copy = getModeCopy(userMode)

  return (
    <AppShell activeHref="/tech-ops">
      <PageHeader
        kicker="Support"
        title={copy.title}
        subtitle={copy.subtitle}
      >
        <div className="mt-5 grid gap-3 md:grid-cols-4">
          {data.kpis.map((kpi) => (
            <div key={kpi.label} className="mos-metric-strip">
              <p className="text-[11px] uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                {kpi.label}
              </p>
              <p className="mt-2 text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                {loading ? '…' : kpi.value}
              </p>
              <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                {kpi.hint}
              </p>
            </div>
          ))}
        </div>
      </PageHeader>

      <div className="mt-6">
        <TechOpsReadinessBand />
      </div>

      <section className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <PageSection title="What needs attention">
          <div className="grid gap-3">
            {data.diagnostics.map((row) => (
              <article key={row.id} className="mos-surface-deep p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {row.check_label}
                    </p>
                    <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                      {row.detail}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                      Reading
                    </p>
                    <p className="mt-1 text-lg font-semibold" style={{ color: 'var(--accent)' }}>
                      {row.metric_value}
                    </p>
                    <p className="mt-1 text-[11px]" style={{ color: row.acknowledged ? 'var(--success)' : 'var(--warning)' }}>
                      {row.acknowledged ? 'reviewed' : 'needs review'}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </PageSection>

        <div className="space-y-4">
          <LiveLogs />

          <PageCard title="Automation runs" subtitle="What your helpers are doing right now">
            <div className="space-y-3">
              {data.workflows.map((run) => (
                <div key={run.id} className="mos-surface-deep flex items-center justify-between gap-4 p-4">
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {run.workflow}
                    </p>
                    <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                      {run.id} · {run.stage}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      {run.eta}
                    </p>
                    <p className="text-xs uppercase" style={{ color: String(run.state).toLowerCase() === 'warning' ? 'var(--warning)' : String(run.state).toLowerCase() === 'completed' ? 'var(--success)' : 'var(--text-muted)' }}>
                      {run.state}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </PageCard>
        </div>
      </section>

      <section className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <PageSection title="Connected app health">
          <div className="grid gap-3">
            {data.connectorHealth.map((row) => (
              <article key={row.name} className="mos-surface-deep flex items-center justify-between gap-4 p-4">
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {row.name}
                  </p>
                  <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                    {row.uptime.toFixed(2)}% uptime · {row.lagMs}ms delay
                  </p>
                </div>
                <span
                  className="rounded-full px-3 py-1 text-[11px] uppercase font-semibold"
                  style={{
                    background: 'color-mix(in oklab, var(--surface-elevated) 78%, transparent)',
                    color:
                      row.state === 'critical'
                        ? 'var(--error)'
                        : row.state === 'warning'
                          ? 'var(--warning)'
                          : 'var(--success)',
                  }}
                >
                  {row.state}
                </span>
              </article>
            ))}
          </div>
        </PageSection>

        <PageSection title="Response goals and quick links">
          <div className="grid gap-3 md:grid-cols-2">
            {data.slaBoard.map((sla) => (
              <article key={sla.label} className="mos-surface-deep p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {sla.label}
                  </p>
                  <span className="text-xs uppercase" style={{ color: sla.state === 'warning' ? 'var(--warning)' : 'var(--success)' }}>
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

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {TECH_MODULE_LINKS.map((link) => (
              <TileLink key={link.href} href={link.href}>
                {link.label}
              </TileLink>
            ))}
          </div>

          <div className="mt-4 rounded-xl border p-4 text-sm" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}>
            {error
              ? `We found a data issue: ${error}`
              : usingFallback
                ? 'This page is using safe backup content right now.'
                : 'This page is using live data.'}
          </div>
        </PageSection>
      </section>

      <PageSection title="Behind-the-scenes checklist">
        <div className="grid gap-4 lg:grid-cols-2">
          {contracts.map((contract) => (
            <article key={contract.name} className="mos-surface-deep p-4">
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                {contract.name}
              </p>
              <ul className="mt-2 space-y-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                {contract.requirements.map((requirement) => (
                  <li key={requirement}>- {requirement}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </PageSection>
    </AppShell>
  )
}
