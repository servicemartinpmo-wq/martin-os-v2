import { PageHeader, PageSection, PageCard, TileLink } from '@/components/page/PageChrome'
import AppShell from '@/features/shell/AppShell'

export default function CapturePage() {
  const recentCaptures = [
    { id: '1', type: 'milestone', title: 'Platform migration Phase 1 complete', time: '2 hours ago' },
    { id: '2', type: 'progress', title: 'Sprint 42 completed - 23 points delivered', time: '1 day ago' },
    { id: '3', type: 'achievement', title: 'Customer satisfaction score reached 4.8', time: '2 days ago' },
  ]

  return (
    <AppShell activeHref="/miiddle/capture">
      <PageHeader
        kicker="Miiddle"
        title="Execution Capture"
        subtitle="Record meaningful work events and convert them into structured proof-of-work timelines."
      />

      <PageSection title="Quick Capture" className="mt-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <button className="mos-link-tile text-left">
            <span className="font-medium" style={{ color: 'var(--text-primary)' }}>Log Milestone</span>
            <span className="mt-1 block text-xs" style={{ color: 'var(--text-muted)' }}>
              Mark a significant achievement
            </span>
          </button>
          <button className="mos-link-tile text-left">
            <span className="font-medium" style={{ color: 'var(--text-primary)' }}>Record Progress</span>
            <span className="mt-1 block text-xs" style={{ color: 'var(--text-muted)' }}>
              Update on work in progress
            </span>
          </button>
          <button className="mos-link-tile text-left">
            <span className="font-medium" style={{ color: 'var(--text-primary)' }}>Add Evidence</span>
            <span className="mt-1 block text-xs" style={{ color: 'var(--text-muted)' }}>
              Attach files or links as proof
            </span>
          </button>
          <button className="mos-link-tile text-left">
            <span className="font-medium" style={{ color: 'var(--text-primary)' }}>AI Transcription</span>
            <span className="mt-1 block text-xs" style={{ color: 'var(--text-muted)' }}>
              Voice note or meeting notes
            </span>
          </button>
        </div>
      </PageSection>

      <PageSection title="Recent Captures" className="mt-6">
        <div className="space-y-3">
          {recentCaptures.map((capture) => (
            <div 
              key={capture.id}
              className="glass-panel p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span 
                  className="w-2 h-2 rounded-full"
                  style={{ 
                    backgroundColor: capture.type === 'milestone' ? 'var(--success)' :
                    capture.type === 'progress' ? 'var(--accent)' : 'var(--warning)'
                  }}
                />
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {capture.title}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {capture.time}
                  </p>
                </div>
              </div>
              <button className="mos-chip text-xs">
                View Details
              </button>
            </div>
          ))}
        </div>
      </PageSection>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <PageCard title="Capture Types">
          <ul className="space-y-2 text-sm" style={{ color: 'var(--text-muted)' }}>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--success)' }} />
              Milestones - Key achievements and deliverables
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--accent)' }} />
              Progress - Regular status updates
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--warning)' }} />
              Achievements - Recognitions and wins
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--text-muted)' }} />
              Blockers - Issues requiring attention
            </li>
          </ul>
        </PageCard>

        <PageCard title="Integration Status">
          <ul className="space-y-2 text-sm" style={{ color: 'var(--text-muted)' }}>
            <li className="flex justify-between">
              <span>PMO Initiatives</span>
              <span style={{ color: 'var(--success)' }}>Connected</span>
            </li>
            <li className="flex justify-between">
              <span>Tech-Ops Tickets</span>
              <span style={{ color: 'var(--success)' }}>Connected</span>
            </li>
            <li className="flex justify-between">
              <span>GitHub Activity</span>
              <span style={{ color: 'var(--warning)' }}>Partial</span>
            </li>
            <li className="flex justify-between">
              <span>Calendar Events</span>
              <span style={{ color: 'var(--success)' }}>Connected</span>
            </li>
          </ul>
        </PageCard>
      </div>
    </AppShell>
  )
}
