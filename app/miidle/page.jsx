'use client'

import AppShell from '@/features/shell/AppShell'
import MiiddleCommandBand from '@/features/miiddle/MiidleCommandBand'
import { getContractsForDomain } from '@/requirements/contracts'
import { PageHeader, TileLink } from '@/components/page/PageChrome'
import BentoGrid, { BentoCard } from '@/components/layouts/BentoGrid'
import { useMiiddleDashboardData } from '@/features/miiddle/useMiiddleDashboardData'

const MIIDDLE_MODULE_LINKS = [
  { href: '/miidle/capture', label: 'Capture' },
  { href: '/miidle/work-graph', label: 'Work Graph' },
  { href: '/miidle/story-engine', label: 'Story Engine' },
]

export default function MiidlePage() {
  const contracts = getContractsForDomain('miidle')
  const { data, error, usingFallback } = useMiiddleDashboardData()

  return (
    <AppShell activeHref="/miidle">
      <PageHeader
        kicker="Miiddle"
        title="Proof-of-work workspace"
        subtitle="Creative execution layer for capture streams, work graph context, story jobs, and publish-ready artifacts."
      >
        <div className="mt-5 grid gap-3 md:grid-cols-4">
          {data.kpis.map((kpi) => (
            <div key={kpi.label} className="mos-metric-strip">
              <p className="text-[11px] uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                {kpi.label}
              </p>
              <p className="mt-2 text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                {kpi.value}
              </p>
              <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                {kpi.hint}
              </p>
            </div>
          ))}
        </div>
      </PageHeader>

      <MiiddleCommandBand />

      <div className="mt-6">
        <BentoGrid columns={3} gap="md">
          <BentoCard title="Capture stream" large>
            <div className="space-y-3">
              {data.activities.slice(0, 4).map((event) => (
                <div key={event.id} className="mos-surface-deep p-4">
                  <p className="text-xs font-mono-ui" style={{ color: 'var(--text-muted)' }}>
                    {event.channel} · {event.time ?? event.created_at ?? 'live'}
                  </p>
                  <p className="mt-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {event.event}
                  </p>
                  <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                    by {event.actor}
                  </p>
                </div>
              ))}
            </div>
          </BentoCard>

          <BentoCard title="Story jobs">
            <div className="space-y-3">
              {data.jobs.map((job) => (
                <div key={job.id} className="mos-surface-deep p-4">
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {job.name}
                  </p>
                  <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                    {job.format} · {job.source}
                  </p>
                  <p className="mt-3 text-[11px] uppercase tracking-wide" style={{ color: 'var(--accent)' }}>
                    {job.status}
                  </p>
                </div>
              ))}
            </div>
          </BentoCard>

          <BentoCard title="Artifact board">
            <div className="space-y-3">
              {data.artifacts.map((artifact) => (
                <div key={artifact.id} className="mos-surface-deep p-4">
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {artifact.title}
                  </p>
                  <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                    Audience: {artifact.audience}
                  </p>
                  <p
                    className="mt-3 text-[11px] uppercase tracking-wide"
                    style={{
                      color:
                        String(artifact.state).toLowerCase() === 'published'
                          ? 'var(--success)'
                          : String(artifact.state).toLowerCase() === 'ready'
                            ? 'var(--accent)'
                            : 'var(--text-muted)',
                    }}
                  >
                    {artifact.state}
                  </p>
                </div>
              ))}
            </div>
          </BentoCard>

          <BentoCard title="Template library" large>
            <div className="grid gap-3 md:grid-cols-3">
              {data.templates.map((template) => (
                <div key={template.id} className="mos-surface-deep p-4">
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {template.label}
                  </p>
                  <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                    {template.output}
                  </p>
                  <p className="mt-3 text-[11px] uppercase tracking-wide" style={{ color: 'var(--accent)' }}>
                    Typical latency {template.latency}
                  </p>
                </div>
              ))}
            </div>
          </BentoCard>

          <BentoCard title="Route launches">
            <div className="grid gap-3">
              {MIIDDLE_MODULE_LINKS.map((link) => (
                <TileLink key={link.href} href={link.href}>
                  {link.label}
                </TileLink>
              ))}
            </div>
            <p className="mt-4 text-sm" style={{ color: 'var(--text-muted)' }}>
              {error
                ? `Data issue detected: ${error}`
                : usingFallback
                  ? 'Miiddle is resilient to missing live tables and preserves the creative flow with deterministic fallback content.'
                  : 'Miiddle is reading live capture, story job, and artifact data from Supabase.'}
            </p>
          </BentoCard>

          <BentoCard title="Document-aligned contracts" large>
            <div className="grid gap-3 md:grid-cols-2">
              {contracts.map((contract) => (
                <div key={contract.name} className="mos-surface-deep p-4">
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {contract.name}
                  </p>
                  <ul className="mt-2 space-y-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                    {contract.requirements.map((requirement) => (
                      <li key={requirement}>- {requirement}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </BentoCard>
        </BentoGrid>
      </div>
    </AppShell>
  )
}
