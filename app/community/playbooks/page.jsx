import AppShell from '@/features/shell/AppShell'
import { PageHeader, PageCard, TileLink } from '@/components/page/PageChrome'

const PLAYBOOKS = [
  { id: 'saas-launch', title: 'SaaS launch', detail: 'GTM, pricing, and success metrics checklist.' },
  { id: 'hiring', title: 'Hiring sprint', detail: 'Role brief, scorecard, and panel workflow.' },
  { id: 'fundraise', title: 'Fundraising prep', detail: 'Data room, narrative, and diligence streams.' },
]

export default function PlaybooksPage() {
  return (
    <AppShell activeHref="/">
      <PageHeader
        kicker="Community"
        title="Playbook library"
        subtitle="Public / shared workflow templates — import into your workspace when connector graph lands (Phase K)."
      />
      <section className="mt-6 grid gap-4 md:grid-cols-3">
        {PLAYBOOKS.map((p) => (
          <PageCard key={p.id} title={p.title}>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {p.detail}
            </p>
            <p className="mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
              Demo entry — versioning + attribution TBD.
            </p>
          </PageCard>
        ))}
      </section>
      <div className="mt-6">
        <TileLink href="/import">Import checklist (60s switch) →</TileLink>
      </div>
    </AppShell>
  )
}
