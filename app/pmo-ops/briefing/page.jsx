import AppShell from '@/features/shell/AppShell'
import { PageHeader, PageSection } from '@/components/page/PageChrome'
import NextActionCard from '@/components/pmo/NextActionCard'

export default function BriefingPage() {
  return (
    <AppShell activeHref="/pmo-ops">
      <PageHeader
        kicker="Chief of staff (demo)"
        title="Daily briefing"
        subtitle="Top priorities, risk taxonomy, and suggested actions — powered by the same brain stub as Next Action until live company data backs this surface."
      />
      <div className="mt-6">
        <NextActionCard />
      </div>
      <PageSection title="Risk categories (schema)">
        <ul className="list-disc space-y-1 pl-5 text-sm" style={{ color: 'var(--text-muted)' }}>
          <li>Revenue — pipeline, churn, collections</li>
          <li>Project delay — blocked work, dependency drift</li>
          <li>Hiring — open roles vs. capacity plans</li>
        </ul>
      </PageSection>
    </AppShell>
  )
}
