import { PageHeader, PageSection, PageCard } from '@/components/page/PageChrome'
import AppShell from '@/features/shell/AppShell'
import DiagnosticEngine from '@/components/pmo/DiagnosticEngine'

export default function DiagnosticsPage() {
  return (
    <AppShell activeHref="/pmo-ops/diagnostics">
      <PageHeader
        kicker="PMO-Ops"
        title="Diagnostic Engine"
        subtitle="Run AI-assisted diagnostics on portfolio health, initiative risk, and execution velocity."
      />

      <PageSection title="Portfolio Diagnostics" className="mt-6">
        <DiagnosticEngine domain="pmo" />
      </PageSection>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <PageCard title="Health Indicators">
          <ul className="space-y-2 text-sm" style={{ color: 'var(--text-muted)' }}>
            <li className="flex justify-between">
              <span>Portfolio Health Score</span>
              <span style={{ color: 'var(--success)' }}>92%</span>
            </li>
            <li className="flex justify-between">
              <span>Initiatives On Track</span>
              <span>15/18</span>
            </li>
            <li className="flex justify-between">
              <span>At-Risk Items</span>
              <span style={{ color: 'var(--warning)' }}>3</span>
            </li>
            <li className="flex justify-between">
              <span>Blocked Dependencies</span>
              <span style={{ color: 'var(--error)' }}>2</span>
            </li>
          </ul>
        </PageCard>

        <PageCard title="Risk Summary">
          <ul className="space-y-2 text-sm" style={{ color: 'var(--text-muted)' }}>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--error)' }} />
              <span>Schedule compression: Project Phoenix</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--warning)' }} />
              <span>Budget variance: Customer Portal (+12%)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--success)' }} />
              <span>Resource availability: Optimal</span>
            </li>
          </ul>
        </PageCard>
      </div>
    </AppShell>
  )
}
