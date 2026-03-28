import AppShell from '../../src/features/shell/AppShell'
import Miidle from '../../src/components/Miidle'
import MiidleCommandBand from '../../src/features/miiddle/MiidleCommandBand'
import { getContractsForDomain } from '../../src/requirements/contracts'
import { PageHeader, PageCard, PageSection, TileLink } from '@/components/page/PageChrome'
import { miidleTimeline, miidleNarrativeTemplates } from '@/features/data/operationalData'

const miidlePillars = [
  {
    title: 'Execution Capture',
    detail: 'Record meaningful work events and convert them into structured proof-of-work timelines.',
  },
  {
    title: 'Work Graph',
    detail: 'Map contributors, outputs, projects, and skills into a live relationship model.',
  },
  {
    title: 'Build Story Engine',
    detail: 'Auto-package execution streams into consumable narratives: visual, written, and summary artifacts.',
  },
  {
    title: 'Spectator Layer',
    detail: 'Publish selected activity streams for passive observers without exposing internal complexity.',
  },
]

const integrationTargets = [
  'PMO initiative context',
  'Tech-Ops incident and resolution links',
  'Portfolio and proof-of-work exports',
  'Cross-team visibility feeds',
]

export default function MiidlePage() {
  const contracts = getContractsForDomain('miidle')
  const publishedCount = miidleTimeline.filter((row) => row.state === 'published').length

  return (
    <AppShell activeHref="/miidle">
      <PageHeader
        kicker="Miiddle"
        title="Where the work actually happens"
        subtitle="Rebuilt with Miiddle execution patterns: capture streams, work graph context, narrative generation, and publish-ready proof-of-work."
      />

      <div className="mt-6">
        <Miidle />
      </div>

      <MiidleCommandBand />

      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        {miidlePillars.map((pillar) => (
          <PageCard key={pillar.title} title={pillar.title}>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {pillar.detail}
            </p>
          </PageCard>
        ))}
      </section>

      <PageSection title="Cross-app relevance (pragmatic B-Stage filter)">
        <ul className="grid gap-2 text-sm sm:grid-cols-2" style={{ color: 'var(--text-muted)' }}>
          {integrationTargets.map((target) => (
            <li key={target}>- {target}</li>
          ))}
        </ul>
      </PageSection>

      <PageSection title="Miiddle modules">
        <div className="grid gap-3 sm:grid-cols-3">
          <TileLink href="/miidle/capture">Capture</TileLink>
          <TileLink href="/miidle/work-graph">Work Graph</TileLink>
          <TileLink href="/miidle/story-engine">Story Engine</TileLink>
        </div>
      </PageSection>

      <PageSection title="Execution timeline">
        <div className="grid gap-3">
          {miidleTimeline.map((event) => (
            <article key={event.id} className="mos-surface-deep flex items-center justify-between gap-3 p-4">
              <div>
                <p className="text-xs font-mono-ui" style={{ color: 'var(--text-muted)' }}>
                  {event.id} · {event.channel} · {event.time}
                </p>
                <p className="mt-1 text-sm" style={{ color: 'var(--text-primary)' }}>
                  {event.event}
                </p>
                <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                  by {event.actor}
                </p>
              </div>
              <span
                className="text-xs capitalize"
                style={{
                  color:
                    event.state === 'published'
                      ? 'var(--success)'
                      : event.state === 'queued'
                        ? 'var(--warning)'
                        : 'var(--text-muted)',
                }}
              >
                {event.state}
              </span>
            </article>
          ))}
        </div>
        <p className="mt-4 text-xs" style={{ color: 'var(--text-muted)' }}>
          {publishedCount} timeline event(s) are currently publish-ready.
        </p>
      </PageSection>

      <PageSection title="Narrative templates">
        <div className="grid gap-4 md:grid-cols-3">
          {miidleNarrativeTemplates.map((template) => (
            <PageCard key={template.id} title={template.label}>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {template.output}
              </p>
              <p className="mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                Typical generation latency: {template.latency}
              </p>
            </PageCard>
          ))}
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
