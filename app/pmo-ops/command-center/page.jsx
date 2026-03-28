import AppShell from '@/features/shell/AppShell'
import { PageHeader, PageSection, PageCard } from '@/components/page/PageChrome'
import HealthScoreRing from '@/components/founder/HealthScoreRing'
import RiskAlertFeed from '@/components/founder/RiskAlertFeed'

export default function CommandCenterPage() {
  return (
    <AppShell activeHref="/pmo-ops">
      <PageHeader
        kicker="Founder mode surface"
        title="Strategy command center"
        subtitle="Executive strip: health score and risk alerts use demo-friendly mock data — labeled in components where applicable."
      />
      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <PageCard title="Company health">
          <HealthScoreRing />
        </PageCard>
        <PageCard title="Risk alerts">
          <RiskAlertFeed />
        </PageCard>
      </section>
      <PageSection title="North star narrative">
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Wire KPI breakdown (Ops / Revenue / Product / Team) to the same scoring engine as Health Score when backend metrics
          are available.
        </p>
      </PageSection>
    </AppShell>
  )
}
