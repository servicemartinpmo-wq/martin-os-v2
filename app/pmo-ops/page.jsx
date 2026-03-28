'use client'

import { motion, useReducedMotion } from 'framer-motion'
import AppShell from '@/features/shell/AppShell'
import { getContractsForDomain } from '@/requirements/contracts'
import NextActionCard from '@/components/pmo/NextActionCard'
import PmoOpsHeroBand from '@/features/pmo/PmoOpsHeroBand'
import PmoOpsLiveKpis from '@/features/pmo/PmoOpsLiveKpis'
import {
  PageCard,
  PageHeader,
  PageSection,
  TileLink,
} from '@/components/page/PageChrome'
import { usePmoOrgDashboardData } from '@/features/pmo/usePmoOrgDashboardData'
import { staggerChildren } from '@/motion/presets'

const PMO_MODULE_LINKS = [
  { href: '/pmo-ops/initiatives', label: 'Initiatives' },
  { href: '/pmo-ops/diagnostics', label: 'Diagnostics' },
  { href: '/pmo-ops/reports', label: 'Reports' },
  { href: '/pmo-ops/briefing', label: 'Daily briefing' },
  { href: '/pmo-ops/command-center', label: 'Command center' },
  { href: '/pmo-ops/decisions', label: 'Decision log' },
]

function signalColor(signal) {
  const value = String(signal ?? '').toLowerCase()
  if (value === 'red' || value === 'critical') return 'var(--error)'
  if (value === 'yellow' || value === 'warning') return 'var(--warning)'
  return 'var(--success)'
}

export default function PMOOpsPage() {
  const reduceMotion = useReducedMotion()
  const contracts = getContractsForDomain('pmo-ops')
  const {
    data,
    error,
    loading,
    usingFallback,
    iniFallback,
    insFallback,
  } = usePmoOrgDashboardData()

  return (
    <AppShell activeHref="/pmo-ops">
      <PageHeader
        kicker="PMO-Ops"
        title="Business command center"
        subtitle="A cleaner executive control surface for organization health, decision cadence, initiative throughput, and operator guidance."
      >
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="mos-metric-strip">
            <p className="text-[11px] uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
              Data source
            </p>
            <p className="mt-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              {usingFallback ? 'Hybrid fallback mode' : 'Supabase live mode'}
            </p>
          </div>
          <div className="mos-metric-strip">
            <p className="text-[11px] uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
              Initiative cohort
            </p>
            <p className="mt-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              {iniFallback ? 'Fallback initiatives' : 'Live initiatives'}
            </p>
          </div>
          <div className="mos-metric-strip">
            <p className="text-[11px] uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
              Insight stream
            </p>
            <p className="mt-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              {insFallback ? 'Fallback insights' : 'Live insights'}
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

      <section className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <PageSection title="Priority initiative spotlight">
          <div className="grid gap-3">
            {data.spotlightInitiatives.map((initiative, index) => (
              <motion.article
                key={initiative.id}
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reduceMotion ? 0 : index * staggerChildren, duration: 0.25 }}
                className="mos-surface-deep p-4"
              >
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
                      Completion
                    </p>
                    <p className="mt-1 text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {initiative.completion}%
                    </p>
                  </div>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  {[
                    { label: 'Priority', value: initiative.priority },
                    { label: 'Alignment', value: initiative.alignment },
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
              </motion.article>
            ))}
          </div>
        </PageSection>

        <div className="space-y-4">
          <NextActionCard />

          <PageCard title="Signal feed" subtitle="Top operating insights">
            <div className="space-y-3">
              {data.insightFeed.map((item) => (
                <div key={item.id} className="mos-surface-deep p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {item.title}
                      </p>
                      <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                        {item.summary}
                      </p>
                    </div>
                    <span
                      className="rounded-full px-3 py-1 text-[11px] font-semibold uppercase"
                      style={{
                        background: 'color-mix(in oklab, var(--surface-elevated) 75%, transparent)',
                        color: signalColor(item.signal),
                      }}
                    >
                      {item.signal}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </PageCard>
        </div>
      </section>

      <PageSection title="Portfolio lanes">
        <div className="grid gap-4 lg:grid-cols-2">
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
                  <p
                    className="text-xs"
                    style={{ color: lane.trend.startsWith('-') ? 'var(--warning)' : 'var(--success)' }}
                  >
                    {lane.trend} this week
                  </p>
                </div>
              </div>
              <div className="mt-3 mos-meter">
                <span style={{ width: `${lane.score}%` }} />
              </div>
            </article>
          ))}
        </div>
      </PageSection>

      <section className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <PageSection title="Decision queue">
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
        </PageSection>

        <PageSection title="Operational modules">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {[...PMO_MODULE_LINKS, { href: '/pmo-ops/autopilot', label: 'Autopilot' }, { href: '/pmo-ops/frameworks', label: 'Framework Gallery' }].map((link) => (
              <TileLink key={link.href} href={link.href}>
                {link.label}
              </TileLink>
            ))}
          </div>
          <div className="mt-4 rounded-xl border p-4 text-sm" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}>
            {error ? `Data issue detected: ${error}` : 'Top-level PMO surface is wired for Supabase-first loading with fallback continuity.'}
          </div>
        </PageSection>
      </section>

      <PageSection title="Document-aligned contracts">
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
