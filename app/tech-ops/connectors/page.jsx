'use client'

import AppShell from '@/features/shell/AppShell'
import { PageCard, PageHeader, PageSection } from '@/components/page/PageChrome'
import { techConnectorHealth } from '@/features/data/operationalData'
import { useSupabaseTable } from '@/hooks/useSupabaseTable'

function connectorStateLabel(state) {
  if (state === 'critical' || state === 'down') return 'Needs help'
  if (state === 'warning' || state === 'degraded') return 'Watch closely'
  return 'Healthy'
}

export default function ConnectorsPage() {
  const connectors = useSupabaseTable({
    table: 'connector_health',
    select: 'id,name:connectorName,state:status,lagMs:responseTime,lastChecked,uptime',
    orderBy: 'lastChecked',
    ascending: false,
    fallback: techConnectorHealth,
  })

  return (
    <AppShell activeHref="/tech-ops">
      <PageHeader
        kicker="Support / Connected Apps"
        title="Connected app health"
        subtitle="See whether your connected tools are healthy, slow, or need attention before they start creating bigger problems."
      />

      <section className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <PageSection title="Connected services">
          <div className="grid gap-3">
            {connectors.rows.map((item, index) => (
              <article key={item.id ?? item.name ?? index} className="mos-surface-deep p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                      {item.lagMs}ms delay
                      {item.uptime != null ? ` · ${item.uptime.toFixed(2)}% uptime` : ''}
                    </p>
                  </div>
                  <span className="mos-chip">{connectorStateLabel(item.state)}</span>
                </div>
              </article>
            ))}
          </div>
        </PageSection>

        <PageCard title="What healthy looks like" subtitle="A simple rule of thumb">
          <div className="space-y-3">
            {[
              'Healthy means the app is responding on time and syncing as expected.',
              'Watch closely means there is delay or inconsistency, but things are still working.',
              'Needs help means a connection is failing badly enough to affect work.',
            ].map((line) => (
              <div key={line} className="mos-surface-deep p-4 text-sm" style={{ color: 'var(--text-muted)' }}>
                {line}
              </div>
            ))}
          </div>
        </PageCard>
      </section>
    </AppShell>
  )
}
