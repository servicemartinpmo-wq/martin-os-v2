import { PageHeader, PageSection, PageCard, TileLink } from '@/components/page/PageChrome'
import AppShell from '@/features/shell/AppShell'

export default function DecisionsPage() {
  const decisions = [
    { id: '1', title: 'Approve Q2 Budget Allocation', date: '2024-02-15', status: 'approved', category: 'Budget' },
    { id: '2', title: 'Go/No-Go: Platform Migration', date: '2024-02-14', status: 'approved', category: 'Strategy' },
    { id: '3', title: 'Resource Reallocation: Engineering', date: '2024-02-13', status: 'pending', category: 'Resources' },
    { id: '4', title: 'Vendor Selection: CRM Integration', date: '2024-02-12', status: 'approved', category: 'Procurement' },
    { id: '5', title: 'Timeline Adjustment: Mobile App', date: '2024-02-11', status: 'rejected', category: 'Timeline' },
  ]

  const statusStyles = {
    approved: { bg: 'color-mix(in oklab, var(--success) 15%, transparent)', text: 'var(--success)', label: 'Approved' },
    pending: { bg: 'color-mix(in oklab, var(--warning) 15%, transparent)', text: 'var(--warning)', label: 'Pending' },
    rejected: { bg: 'color-mix(in oklab, var(--error) 15%, transparent)', text: 'var(--error)', label: 'Rejected' },
  }

  return (
    <AppShell activeHref="/pmo-ops/decisions">
      <PageHeader
        kicker="PMO-Ops"
        title="Decision Log"
        subtitle="Track and review key organizational decisions with full audit trail."
      />

      <div className="mt-6">
        <PageCard>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-display text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Recent Decisions
            </h3>
            <button className="mos-chip mos-chip-active">
              + New Decision
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="mos-table-head">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Decision</th>
                  <th className="px-4 py-3 text-left font-medium">Category</th>
                  <th className="px-4 py-3 text-left font-medium">Date</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {decisions.map((decision) => (
                  <tr key={decision.id} className="mos-table-row">
                    <td className="px-4 py-3 font-medium" style={{ color: 'var(--text-primary)' }}>
                      {decision.title}
                    </td>
                    <td className="px-4 py-3" style={{ color: 'var(--text-muted)' }}>
                      {decision.category}
                    </td>
                    <td className="px-4 py-3" style={{ color: 'var(--text-muted)' }}>
                      {decision.date}
                    </td>
                    <td className="px-4 py-3">
                      <span 
                        className="mos-chip text-xs"
                        style={{ 
                          backgroundColor: statusStyles[decision.status]?.bg,
                          color: statusStyles[decision.status]?.text,
                          borderColor: 'transparent'
                        }}
                      >
                        {statusStyles[decision.status]?.label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </PageCard>
      </div>

      <PageSection title="Decision Categories" className="mt-6">
        <div className="grid gap-3 sm:grid-cols-3">
          <TileLink href="/pmo-ops/decisions?category=budget">Budget & Finance</TileLink>
          <TileLink href="/pmo-ops/decisions?category=strategy">Strategy</TileLink>
          <TileLink href="/pmo-ops/decisions?category=resources">Resources</TileLink>
          <TileLink href="/pmo-ops/decisions?category=procurement">Procurement</TileLink>
          <TileLink href="/pmo-ops/decisions?category=timeline">Timeline</TileLink>
          <TileLink href="/pmo-ops/decisions?category=governance">Governance</TileLink>
        </div>
      </PageSection>
    </AppShell>
  )
}
