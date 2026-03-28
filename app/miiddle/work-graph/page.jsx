import { PageHeader, PageSection, PageCard, TileLink } from '@/components/page/PageChrome'
import AppShell from '@/features/shell/AppShell'
import WorkGraph from '@/components/miiddle/WorkGraph'

export default function WorkGraphPage() {
  return (
    <AppShell activeHref="/miiddle/work-graph">
      <PageHeader
        kicker="Miiddle"
        title="Work Graph"
        subtitle="Visualize contributors, outputs, projects, and skills as a live relationship model."
      />

      <PageSection title="Relationship Map" className="mt-6">
        <WorkGraph />
      </PageSection>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <PageCard title="Top Contributors">
          <ul className="space-y-2 text-sm" style={{ color: 'var(--text-muted)' }}>
            <li className="flex justify-between">
              <span>Sarah K.</span>
              <span>42 contributions</span>
            </li>
            <li className="flex justify-between">
              <span>Mike R.</span>
              <span>38 contributions</span>
            </li>
            <li className="flex justify-between">
              <span>Lisa M.</span>
              <span>31 contributions</span>
            </li>
          </ul>
        </PageCard>

        <PageCard title="Active Projects">
          <ul className="space-y-2 text-sm" style={{ color: 'var(--text-muted)' }}>
            <li>- Q1 Platform Migration</li>
            <li>- Customer Portal v2</li>
            <li>- Analytics Dashboard</li>
            <li>- Security Audit</li>
          </ul>
        </PageCard>

        <PageCard title="Skill Distribution">
          <ul className="space-y-2 text-sm" style={{ color: 'var(--text-muted)' }}>
            <li>React: 8 engineers</li>
            <li>Python: 5 engineers</li>
            <li>DevOps: 3 engineers</li>
            <li>Design: 2 designers</li>
          </ul>
        </PageCard>
      </div>
    </AppShell>
  )
}
