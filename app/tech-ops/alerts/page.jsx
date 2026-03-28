'use client'

import { useState } from 'react'
import AppShell from '@/features/shell/AppShell'
import { PageHeader, PageSection } from '@/components/page/PageChrome'
import { fallbackSystemAlerts } from '@/features/data/operationalData'
import { useSupabaseTable } from '@/hooks/useSupabaseTable'

function alertColor(severity) {
  if (severity === 'critical') return 'var(--error)'
  if (severity === 'warning') return 'var(--warning)'
  return 'var(--accent)'
}

export default function AlertsPage() {
  const [ackedIds, setAckedIds] = useState([])
  const alerts = useSupabaseTable({
    table: 'system_alerts',
    select: 'id,title,severity,acknowledged,created_at,detail',
    orderBy: 'created_at',
    ascending: false,
    fallback: fallbackSystemAlerts,
  })

  return (
    <AppShell activeHref="/tech-ops">
      <PageHeader
        kicker="Support / Alerts"
        title="Alerts and watchouts"
        subtitle="See what needs quick attention, what has already been reviewed, and which issues can wait until the next check-in."
      />

      <PageSection title="Recent alerts" className="mt-6">
        <div className="grid gap-3">
          {alerts.rows.map((alert) => {
            const acknowledged = Boolean(alert.acknowledged) || ackedIds.includes(alert.id)
            return (
              <article key={alert.id} className="mos-surface-deep p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block h-2.5 w-2.5 rounded-full"
                        style={{ background: alertColor(alert.severity) }}
                      />
                      <p className="text-sm font-semibold">{alert.title}</p>
                    </div>
                    <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                      {alert.detail}
                    </p>
                    <p className="mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                      {alert.created_at}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="mos-chip">{alert.severity}</span>
                    {!acknowledged ? (
                      <button
                        type="button"
                        className="mos-chip"
                        onClick={() => setAckedIds((prev) => [...prev, alert.id])}
                      >
                        Mark reviewed
                      </button>
                    ) : (
                      <span className="mos-chip">Reviewed</span>
                    )}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </PageSection>
    </AppShell>
  )
}
