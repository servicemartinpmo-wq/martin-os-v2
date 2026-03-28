'use client'

import AppShell from '@/features/shell/AppShell'
import MiiddleCommandBand from '@/features/miiddle/MiidleCommandBand'
import { getContractsForDomain } from '@/requirements/contracts'
import { PageCard, PageHeader, PageSection, TileLink } from '@/components/page/PageChrome'
import BentoGrid, { BentoCard } from '@/components/layouts/BentoGrid'
import { useMartinOs } from '@/context/MartinOsProvider'
import { useMiiddleDashboardData } from '@/features/miiddle/useMiiddleDashboardData'

const MIIDDLE_MODULE_LINKS = [
  { href: '/miidle/capture', label: 'Capture' },
  { href: '/miidle/work-graph', label: 'Work map' },
  { href: '/miidle/story-engine', label: 'Story builder' },
]

function getModeCopy(userMode) {
  switch (userMode) {
    case 'executive':
      return {
        title: 'Narrative proof board',
        subtitle:
          'A cleaner Miiddle surface for executive-grade proof, strategic storytelling, and artifact readiness.',
      }
    case 'admin_project':
      return {
        title: 'Creative operations board',
        subtitle:
          'A more structured Miiddle surface for workflow reliability, handoffs, and publish-track execution.',
      }
    case 'healthcare':
      return {
        title: 'Calm knowledge and proof workspace',
        subtitle:
          'A softer workspace for service documentation, artifact readiness, and narrative continuity without visual overload.',
      }
    case 'startup':
      return {
        title: 'Momentum story workspace',
        subtitle:
          'A sharper creative system for launch proof, demos, social-ready artifacts, and product storytelling.',
      }
    case 'freelance':
      return {
        title: 'Solo studio workspace',
        subtitle:
          'A lightweight creative environment for client proof, artifacts, deliverables, and portfolio-ready story cards.',
      }
    default:
      return {
        title: 'Proof-of-work workspace',
        subtitle:
          'Creative execution layer for capture streams, work graph context, story jobs, and publish-ready artifacts.',
      }
  }
}

export default function MiidlePage() {
  const { userMode } = useMartinOs()
  const contracts = getContractsForDomain('miidle')
  const { data, error, usingFallback } = useMiiddleDashboardData()
  const copy = getModeCopy(userMode)

  return (
    <AppShell activeHref="/miidle">
      <PageHeader
        kicker="Studio"
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
          <BentoCard title="Recent captures" large>
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

          <BentoCard title="Stories in progress">
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

          <BentoCard title="Proof and shareables">
            <div className="space-y-3">
              {data.artifacts.map((artifact) => (
                <div key={artifact.id} className="mos-surface-deep p-4">
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {artifact.title}
                  </p>
                  <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                    For: {artifact.audience}
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

          <BentoCard title="Starting points" large>
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
                    Usual speed {template.latency}
                  </p>
                </div>
              ))}
            </div>
          </BentoCard>

          <BentoCard title="Open pages">
            <div className="grid gap-3">
              {MIIDDLE_MODULE_LINKS.map((link) => (
                <TileLink key={link.href} href={link.href}>
                  {link.label}
                </TileLink>
              ))}
            </div>
            <p className="mt-4 text-sm" style={{ color: 'var(--text-muted)' }}>
              {error
                ? `We found a data issue: ${error}`
                : usingFallback
                  ? 'This page is keeping things moving with safe backup content.'
                  : 'This page is using live data.'}
            </p>
          </BentoCard>

          <BentoCard title="Behind-the-scenes checklist" large>
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
