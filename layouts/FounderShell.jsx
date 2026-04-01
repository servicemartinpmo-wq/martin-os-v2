'use client'

import { usePathname } from 'next/navigation'
import DashboardCard from '@/components/DashboardCard'
import HealthScoreRing from '@/components/founder/HealthScoreRing'
import RiskAlertFeed from '@/components/founder/RiskAlertFeed'

/**
 * Strategy command center — health strip + risk feed + main grid.
 * Home (`/`) uses `LaminatedCommandCanvas` for health + risk; avoid duplicate strips here.
 */
export default function FounderShell({ sidebar, children }) {
  const pathname = usePathname() ?? '/'
  const isHome = pathname === '/' || pathname === ''

  return (
    <div className="space-y-6">
      {!isHome ? (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,280px)_1fr]">
          <DashboardCard title="Operational status" subtitle="Demo data">
            <HealthScoreRing score={72} />
          </DashboardCard>
          <DashboardCard title="Risk alerts" subtitle="Severity-sorted">
            <RiskAlertFeed />
          </DashboardCard>
        </div>
      ) : null}
      <div className="flex flex-col gap-6 lg:flex-row">
        <aside
          className="shrink-0 lg:w-56"
          style={{ color: 'var(--text-muted)' }}
        >
          {sidebar}
        </aside>
        <div className="min-w-0 flex-1 space-y-4">{children}</div>
      </div>
    </div>
  )
}
