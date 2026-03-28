'use client'

import AppShell from '../../src/features/shell/AppShell'
import { getContractsForDomain } from '../../src/requirements/contracts'
import PmoOpsLiveKpis from '../../src/features/pmo/PmoOpsLiveKpis'
import PmoOpsHeroBand from '../../src/features/pmo/PmoOpsHeroBand'
import { usePmoOrgDashboardData } from '../../src/features/pmo/usePmoOrgDashboardData'
import NextActionCard from '../../src/components/pmo/NextActionCard'
import { PageHeader, PageCard, PageSection, TileLink } from '@/components/page/PageChrome'
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
  const reduceMotion = useReducedMotion()
  const { kpis, orgHealth, loading, iniFallback, insFallback } = usePmoOrgDashboardData()

  return (
    <AppShell activeHref="/pmo-ops">
      <PageHeader
        kicker="PMO-Ops"
        title="Business command center"
        subtitle="Built around the PMO business operations plan: one place for project governance, financial control, advisory guidance,
          and operational readiness."
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

      <PageSection title="Operational modules">
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <TileLink href="/pmo-ops/initiatives">Initiatives</TileLink>
          <TileLink href="/pmo-ops/diagnostics">Diagnostics</TileLink>
          <TileLink href="/pmo-ops/reports">Reports</TileLink>
          <TileLink href="/pmo-ops/briefing">Daily briefing</TileLink>
          <TileLink href="/pmo-ops/command-center">Command center</TileLink>
          <TileLink href="/pmo-ops/decisions">Decision log</TileLink>
          <TileLink href="/pmo-ops/autopilot">Autopilot</TileLink>
        </div>
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
