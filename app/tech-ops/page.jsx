'use client'

import { motion, useReducedMotion } from 'framer-motion'
import AppShell from '@/features/shell/AppShell'
import { getContractsForDomain } from '@/requirements/contracts'
import LiveLogs from '@/components/LiveLogs'
import TechOpsReadinessBand from '@/features/techops/TechOpsReadinessBand'
import {
  PageCard,
  PageHeader,
  PageSection,
  TileLink,
} from '@/components/page/PageChrome'
import { useTechOpsDashboardData } from '@/features/techops/useTechOpsDashboardData'
import { staggerChildren } from '@/motion/presets'

const TECH_MODULE_LINKS = [
  { href: '/tech-ops/tickets', label: 'Tickets' },
  { href: '/tech-ops/diagnostics', label: 'Diagnostics' },
  { href: '/tech-ops/workflows', label: 'Workflows' },
]

export default function TechOpsPage() {
  const reduceMotion = useReducedMotion()
  const contracts = getContractsForDomain('tech-ops')
  const { data, error, loading, usingFallback } = useTechOpsDashboardData()

  return (
    <AppShell activeHref="/tech-ops">
      <PageHeader
        kicker="Tech-Ops"
        title="Canonical integration surface"
        subtitle="A clearer operator HUD for diagnostics, workflow automation, connector reliability, and live operational traces."
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
        <PageSection title="AI diagnostic board">
          <div className="grid gap-3">
            {data.diagnostics.map((row, index) => (
              <motion.article
                key={row.id}
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reduceMotion ? 0 : index * staggerChildren, duration: 0.24 }}
                className="mos-surface-deep p-4"
              >
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
                      Value
                    </p>
                    <p className="mt-1 text-lg font-semibold" style={{ color: 'var(--accent)' }}>
                      {row.metric_value}
                    </p>
                    <p className="mt-1 text-[11px]" style={{ color: row.acknowledged ? 'var(--success)' : 'var(--warning)' }}>
                      {row.acknowledged ? 'acknowledged' : 'requires review'}
                    </p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </PageSection>

        <div className="space-y-4">
          <LiveLogs />

          <PageCard title="Workflow runs" subtitle="Automation pipeline view">
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
                    <p
                      className="text-xs uppercase"
                      style={{
                        color:
                          String(run.state).toLowerCase() === 'warning'
                            ? 'var(--warning)'
                            : String(run.state).toLowerCase() === 'completed'
                              ? 'var(--success)'
                              : 'var(--text-muted)',
                      }}
                    >
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
        <PageSection title="Connector reliability">
          <div className="grid gap-3">
            {data.connectorHealth.map((row) => (
              <article key={row.name} className="mos-surface-deep flex items-center justify-between gap-4 p-4">
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {row.name}
                  </p>
                  <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                    {row.uptime.toFixed(2)}% uptime · {row.lagMs}ms lag
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

        <PageSection title="SLA board and routes">
          <div className="grid gap-3 md:grid-cols-2">
            {data.slaBoard.map((sla) => (
              <article key={sla.label} className="mos-surface-deep p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {sla.label}
                  </p>
                  <span
                    className="text-xs uppercase"
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

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {TECH_MODULE_LINKS.map((link) => (
              <TileLink key={link.href} href={link.href}>
                {link.label}
              </TileLink>
            ))}
          </div>

          <div className="mt-4 rounded-xl border p-4 text-sm" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}>
            {error
              ? `Data issue detected: ${error}`
              : usingFallback
                ? 'Tech-Ops top-level surface is using resilient fallback contracts where live data is unavailable.'
                : 'Tech-Ops top-level surface is pulling live Supabase data for diagnostics and workflow status.'}
          </div>
        </PageSection>
      </section>

      <PageSection title="Source and contract traceability">
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
