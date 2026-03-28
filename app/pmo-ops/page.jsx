'use client'

import AppShell from '@/features/shell/AppShell'
import NextActionCard from '@/components/pmo/NextActionCard'
import PmoOpsHeroBand from '@/features/pmo/PmoOpsHeroBand'
import PmoOpsLiveKpis from '@/features/pmo/PmoOpsLiveKpis'
import {
  PageCard,
  PageHeader,
  PageSection,
  TileLink,
} from '@/components/page/PageChrome'
import { useMartinOs } from '@/context/MartinOsProvider'
import { usePmoOrgDashboardData } from '@/features/pmo/usePmoOrgDashboardData'
import { getContractsForDomain } from '@/requirements/contracts'

const PMO_MODULE_LINKS = [
  { href: '/pmo-ops/initiatives', label: 'Big goals' },
  { href: '/pmo-ops/crm', label: 'Clients' },
  { href: '/pmo-ops/advisory', label: 'Guidance' },
  { href: '/pmo-ops/meetings', label: 'Meetings' },
  { href: '/pmo-ops/diagnostics', label: 'Warnings' },
  { href: '/pmo-ops/reports', label: 'Updates' },
  { href: '/pmo-ops/briefing', label: "Today's brief" },
  { href: '/pmo-ops/command-center', label: 'Overview board' },
  { href: '/pmo-ops/decisions', label: 'Decisions' },
]

function getModeCopy(userMode) {
  switch (userMode) {
    case 'executive':
      return {
        title: 'Executive strategy board',
        subtitle:
          'A presentation-ready PMO surface for portfolio movement, business risk, exceptions, and decision cadence.',
        labels: ['portfolio movement', 'executive summary', 'decisions'],
      }
    case 'admin_project':
      return {
        title: 'Project administration console',
        subtitle:
          'A task-and-table-heavy control layer for status tracking, sequencing, approvals, and delivery hygiene.',
        labels: ['workflow detail', 'delivery hygiene', 'status control'],
      }
    case 'startup':
      return {
        title: 'Launch and momentum board',
        subtitle:
          'A sharper PMO surface for launch readiness, growth bets, sequencing, and founder-grade intervention loops.',
        labels: ['velocity', 'launch readiness', 'growth bets'],
      }
    case 'freelance':
      return {
        title: 'Client and delivery board',
        subtitle:
          'A lighter PMO surface for deliverables, client commitments, and personal planning without losing business visibility.',
        labels: ['deliverables', 'commitments', 'client health'],
      }
    case 'healthcare':
      return {
        title: 'Service and readiness board',
        subtitle:
          'A calmer PMO surface for service readiness, handoffs, exceptions, and regulated coordination.',
        labels: ['handoffs', 'readiness', 'exceptions'],
      }
    case 'creative':
      return {
        title: 'Creative operating board',
        subtitle:
          'A narrative-friendly PMO surface that still tracks business health, approvals, and delivery pressure.',
        labels: ['proof of work', 'approvals', 'creative ops'],
      }
    default:
      return {
        title: 'Founder business command center',
        subtitle:
          'A high-signal operating surface for company health, initiative throughput, decision cadence, and owner intervention.',
        labels: ['org health', 'risk', 'owner actions'],
      }
  }
}

export default function PMOOpsPage() {
  const { userMode, themePresetId, layoutMode } = useMartinOs()
  const contracts = getContractsForDomain('pmo-ops')
  const { data, error, loading, usingFallback, iniFallback, insFallback } =
    usePmoOrgDashboardData()
  const copy = getModeCopy(userMode)

  return (
    <AppShell activeHref="/pmo-ops">
      <PageHeader
        kicker="Planning"
        title={copy.title}
        subtitle={copy.subtitle}
      >
        <div className="mt-5 grid gap-3 md:grid-cols-4">
          <div className="mos-metric-strip">
            <p className="text-[11px] uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
              Data status
            </p>
            <p className="mt-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              {usingFallback ? 'Using backup data safely' : 'Using live data'}
            </p>
          </div>
          <div className="mos-metric-strip">
            <p className="text-[11px] uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
              Work style
            </p>
            <p className="mt-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              {userMode}
            </p>
          </div>
          <div className="mos-metric-strip">
            <p className="text-[11px] uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
              Look / page style
            </p>
            <p className="mt-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              {themePresetId} · {layoutMode}
            </p>
          </div>
          <div className="mos-metric-strip">
            <p className="text-[11px] uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
              Focus
            </p>
            <p className="mt-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              {copy.labels.join(' · ')}
            </p>
          </div>
        </div>
      </PageHeader>

      <div className="mt-6">
        <PmoOpsHeroBand
          orgHealth={data.orgHealth}
          loading={loading}
          iniFallback={iniFallback}
          insFallback={insFallback}
        />
      </div>

      <PmoOpsLiveKpis kpis={data.kpis} loading={loading} />

      <section className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <PageSection title="Top priority right now">
          <div className="grid gap-3">
            {data.spotlightInitiatives.map((initiative) => (
              <article key={initiative.id} className="mos-surface-deep p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {initiative.name}
                    </p>
                    <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                      {initiative.owner} · {initiative.status}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                      Progress
                    </p>
                    <p className="mt-1 text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {initiative.completion}%
                    </p>
                  </div>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  {[
                    { label: 'Priority', value: initiative.priority },
                    { label: 'Fit', value: initiative.alignment },
                    { label: 'Risk', value: initiative.risk },
                  ].map((item) => (
                    <div key={item.label} className="mos-metric-strip">
                      <p className="text-[11px] uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                        {item.label}
                      </p>
                      <p className="mt-2 text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </PageSection>

        <div className="space-y-4">
          <NextActionCard />

          <PageCard title="What needs attention" subtitle="Top updates and watchouts">
            <div className="space-y-3">
              {data.insightFeed.map((item) => (
                <div key={item.id} className="mos-surface-deep p-4">
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {item.title}
                  </p>
                  <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                    {item.summary}
                  </p>
                  <p className="mt-3 text-[11px] uppercase tracking-wide" style={{ color: 'var(--accent)' }}>
                    {item.signal}
                  </p>
                </div>
              ))}
            </div>
          </PageCard>
        </div>
      </section>

      <section className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <PageSection title="Decisions waiting on you">
          <div className="grid gap-3">
            {data.decisionBacklog.map((item) => (
              <article key={item.id} className="mos-surface-deep flex items-center justify-between gap-4 p-4">
                <div>
                  <p className="text-xs font-mono-ui" style={{ color: 'var(--text-muted)' }}>
                    {item.id} · {item.category}
                  </p>
                  <p className="mt-1 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {item.title}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    Decide by
                  </p>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {item.decisionBy}
                  </p>
                  <p className="text-xs" style={{ color: item.impact === 'high' ? 'var(--warning)' : 'var(--text-muted)' }}>
                    {item.impact} impact
                  </p>
                </div>
              </article>
            ))}
          </div>
        </PageSection>

        <PageSection title="Work areas and launches">
          <div className="grid gap-3 md:grid-cols-2">
            {data.portfolioLanes.map((lane) => (
              <article key={lane.lane} className="mos-surface-deep p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {lane.lane}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {lane.owner} · {lane.focus}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {lane.score}
                    </p>
                    <p className="text-xs" style={{ color: lane.trend.startsWith('-') ? 'var(--warning)' : 'var(--success)' }}>
                      {lane.trend} this week
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {PMO_MODULE_LINKS.map((link) => (
              <TileLink key={link.href} href={link.href}>
                {link.label}
              </TileLink>
            ))}
          </div>

          <div className="mt-4 rounded-xl border p-4 text-sm" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}>
            {error ? `We found a data issue: ${error}` : 'This page uses live data first and switches to safe backup content if something is unavailable.'}
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
