import { PageHeader, PageSection, PageCard } from '@/components/page/PageChrome'
import AppShell from '@/features/shell/AppShell'
import DiagnosticEngine from '@/components/pmo/DiagnosticEngine'

export default function TechDiagnosticsPage() {
  return (
    <AppShell activeHref="/tech-ops/diagnostics">
      <PageHeader
        kicker="Tech-Ops"
        title="Technical Diagnostics"
        subtitle="AI-powered issue detection, tier recommendation, and confidence scoring."
      />

      <PageSection title="Tech Diagnostics" className="mt-6">
        <DiagnosticEngine domain="tech" />
      </PageSection>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <PageCard title="System Health">
          <ul className="space-y-2 text-sm" style={{ color: 'var(--text-muted)' }}>
            <li className="flex justify-between">
              <span>API Availability</span>
              <span style={{ color: 'var(--success)' }}>99.9%</span>
            </li>
            <li className="flex justify-between">
              <span>Avg Response Time</span>
              <span>145ms</span>
            </li>
            <li className="flex justify-between">
              <span>Error Rate</span>
              <span style={{ color: 'var(--success)' }}>0.12%</span>
            </li>
            <li className="flex justify-between">
              <span>Active Incidents</span>
              <span style={{ color: 'var(--warning)' }}>2</span>
            </li>
          </ul>
        </PageCard>

        <PageCard title="Support Queue">
          <ul className="space-y-2 text-sm" style={{ color: 'var(--text-muted)' }}>
            <li className="flex justify-between">
              <span>Open Tickets</span>
              <span>12</span>
            </li>
            <li className="flex justify-between">
              <span>Avg Resolution Time</span>
              <span>4.2 hrs</span>
            </li>
            <li className="flex justify-between">
              <span>Customer Satisfaction</span>
              <span style={{ color: 'var(--success)' }}>4.6/5</span>
            </li>
            <li className="flex justify-between">
              <span>Escalations Today</span>
              <span>3</span>
            </li>
          </ul>
        </PageCard>
      </div>
    </AppShell>
  )
}
