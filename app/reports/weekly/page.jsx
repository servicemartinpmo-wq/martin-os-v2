import AppShell from '@/features/shell/AppShell'
import { PageHeader, PageSection } from '@/components/page/PageChrome'

export default function WeeklyReportPage() {
  return (
    <AppShell activeHref="/pmo-ops">
      <PageHeader
        kicker="Distribution (demo)"
        title="Weekly company report"
        subtitle="Auto summary: completed work, revenue delta, overdue count, top risk, recommended action — queued jobs for PDF / Slack / email in Phase K."
      />
      <PageSection title="Stub payload">
        <pre
          className="overflow-x-auto rounded-md p-4 text-xs"
          style={{
            background: 'var(--bg-elevated)',
            color: 'var(--text-muted)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          {JSON.stringify(
            {
              week: '2026-W13',
              demo: true,
              completedProjects: 3,
              revenueDeltaPct: 2.1,
              overdueTasks: 14,
              topRisk: 'Vendor dependency on API partner',
              recommendedAction: 'Negotiate SLA extension or secondary vendor',
            },
            null,
            2,
          )}
        </pre>
      </PageSection>
    </AppShell>
  )
}
