'use client'

import AppShell from '../../src/features/shell/AppShell'
import { getContractsForDomain } from '../../src/requirements/contracts'
import PmoOpsLiveKpis from '../../src/features/pmo/PmoOpsLiveKpis'
import PmoOpsHeroBand from '../../src/features/pmo/PmoOpsHeroBand'
import { usePmoOrgDashboardData } from '../../src/features/pmo/usePmoOrgDashboardData'
import NextActionCard from '../../src/components/pmo/NextActionCard'
import { PageHeader, PageCard, PageSection, TileLink } from '@/components/page/PageChrome'
import { pmoDecisionBacklog, pmoPortfolioLanes } from '@/features/data/operationalData'
import { motion, useReducedMotion } from 'framer-motion'
import { staggerChildren } from '@/motion/presets'

const pmoModules = [
  {
    name: 'Command Dashboard',
    detail: 'Organization health score, urgency queue, and mode switching for standard, creative, and focus views.',
  },
  {
    name: 'Finance Hub',
    detail: 'Budget variance, expenses, invoices, and P&L visibility tied directly to execution.',
  },
  {
    name: 'Projects & Initiatives',
    detail: 'Initiative ownership, risk, dependencies, action items, and decision logs in one flow.',
  },
  {
    name: 'Advisory Layer',
    detail: 'Structured operator guidance mapped to strategy, operations, PMO, and administration support lanes.',
  },
]

export default function PMOOpsPage() {
  const contracts = getContractsForDomain('pmo-ops')
  const atRiskCount = pmoPortfolioLanes.filter((lane) => lane.score < 82).length
  const reduceMotion = useReducedMotion()
  const { kpis, orgHealth, loading, iniFallback, insFallback } = usePmoOrgDashboardData()

  return (
    <AppShell activeHref="/pmo-ops">
      <PageHeader
        kicker="PMO-Ops"
        title="Business command center"
        subtitle="Rebuilt from PMO pilot patterns: strategy execution, finance controls, governance cadence, and delivery risk in one command layer."
      />

      <div className="mt-6">
        <PmoOpsHeroBand
          orgHealth={orgHealth}
          loading={loading}
          iniFallback={iniFallback}
          insFallback={insFallback}
        />
      </div>

      <PmoOpsLiveKpis kpis={kpis} loading={loading} />

      <div className="mt-6">
        <NextActionCard />
      </div>

      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        {pmoModules.map((module, i) => (
          <motion.div
            key={module.name}
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduceMotion ? 0 : i * staggerChildren, duration: 0.3 }}
          >
            <PageCard title={module.name}>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {module.detail}
              </p>
            </PageCard>
          </motion.div>
        ))}
      </section>

      <PageSection title="Portfolio lanes (live operating view)">
        <div className="grid gap-4 lg:grid-cols-2">
          {pmoPortfolioLanes.map((lane) => (
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
                  <p
                    className="text-xs"
                    style={{ color: lane.trend.startsWith('-') ? 'var(--warning)' : 'var(--success)' }}
                  >
                    {lane.trend} this week
                  </p>
                </div>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full" style={{ background: 'var(--border-subtle)' }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${lane.score}%`,
                    background: 'linear-gradient(90deg, var(--accent), color-mix(in oklab, var(--success) 60%, var(--accent)))',
                  }}
                />
              </div>
            </article>
          ))}
        </div>
      </PageSection>

      <PageSection title="Operational modules">
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <TileLink href="/pmo-ops/initiatives">Initiatives</TileLink>
          <TileLink href="/pmo-ops/diagnostics">Diagnostics</TileLink>
          <TileLink href="/pmo-ops/reports">Reports</TileLink>
          <TileLink href="/pmo-ops/briefing">Daily briefing</TileLink>
          <TileLink href="/pmo-ops/command-center">Command center</TileLink>
          <TileLink href="/pmo-ops/decisions">Decision log</TileLink>
          <TileLink href="/pmo-ops/autopilot">Autopilot</TileLink>
          <TileLink href="/pmo-ops/frameworks">Framework Gallery</TileLink>
        </div>
      </PageSection>

      <PageSection title="Pending decision queue">
        <div className="grid gap-3">
          {pmoDecisionBacklog.map((item) => (
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
                  Decision by
                </p>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {item.decisionBy}
                </p>
                <p
                  className="text-xs"
                  style={{ color: item.impact === 'high' ? 'var(--warning)' : 'var(--text-muted)' }}
                >
                  {item.impact} impact
                </p>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-4 text-xs" style={{ color: 'var(--text-muted)' }}>
          {atRiskCount} portfolio lanes currently require leadership intervention.
        </p>
      </PageSection>

      <PageSection title="Document-aligned contracts">
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
