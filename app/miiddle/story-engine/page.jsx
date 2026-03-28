import { PageHeader, PageSection, PageCard, TileLink } from '@/components/page/PageChrome'
import AppShell from '@/features/shell/AppShell'
import StoryEngine from '@/components/miiddle/StoryEngine'

export default function StoryEnginePage() {
  return (
    <AppShell activeHref="/miiddle/story-engine">
      <PageHeader
        kicker="Miiddle"
        title="Story Engine"
        subtitle="Auto-package execution streams into consumable narratives: visual, written, and summary artifacts."
      />

      <PageSection title="Generate Story" className="mt-6">
        <StoryEngine />
      </PageSection>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <PageCard title="Recent Stories">
          <ul className="space-y-3 text-sm" style={{ color: 'var(--text-muted)' }}>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full mt-1.5" style={{ backgroundColor: 'var(--success)' }} />
              <div>
                <span style={{ color: 'var(--text-primary)' }}>Q1 Platform Migration - Week 4</span>
                <span className="block text-xs">Generated 2 hours ago</span>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full mt-1.5" style={{ backgroundColor: 'var(--accent)' }} />
              <div>
                <span style={{ color: 'var(--text-primary)' }}>Customer Portal Launch Summary</span>
                <span className="block text-xs">Generated yesterday</span>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full mt-1.5" style={{ backgroundColor: 'var(--text-muted)' }} />
              <div>
                <span style={{ color: 'var(--text-primary)' }}>Sprint 42 Retrospective</span>
                <span className="block text-xs">Generated 3 days ago</span>
              </div>
            </li>
          </ul>
        </PageCard>

        <PageCard title="Story Templates">
          <ul className="space-y-2 text-sm" style={{ color: 'var(--text-muted)' }}>
            <li>- Executive Summary</li>
            <li>- Progress Report</li>
            <li>- Milestone Celebration</li>
            <li>- Lessons Learned</li>
            <li>- Stakeholder Brief</li>
          </ul>
        </PageCard>
      </div>
    </AppShell>
  )
}
