'use client'

import AppShell from '../../../src/features/shell/AppShell'
import { useMemo, useState } from 'react'
import { quarterlyReportData } from '../../../src/features/data/operationalData'
import { PageHeader, PageCard, PageSection, FilterChip, TileLink } from '@/components/page/PageChrome'

const reportBlocks = [
  { name: 'Executive Snapshot', metrics: ['Operational Status 84', 'Critical Signals 3', 'Open Actions 27'] },
  { name: 'Operations Report', metrics: ['Initiative Velocity +12%', 'Dependency Delays 4', 'SOP Coverage 78%'] },
  { name: 'Quarterly Trends', metrics: ['Revenue Run-Rate +9%', 'Maturity +4pts', 'Cost Variance 2.9%'] },
]

export default function PMOReportsPage() {
  const [selectedQuarter, setSelectedQuarter] = useState('Q4')
  const active = useMemo(
    () => quarterlyReportData.find((row) => row.quarter === selectedQuarter) ?? quarterlyReportData[quarterlyReportData.length - 1],
    [selectedQuarter],
  )

  return (
    <AppShell activeHref="/pmo-ops">
      <PageHeader kicker="PMO-Ops / Reports" title="Reporting and readiness packs" />

      <section className="glass-panel mt-6 p-5">
        <div className="flex flex-wrap gap-2">
          {quarterlyReportData.map((row) => (
            <FilterChip key={row.quarter} active={selectedQuarter === row.quarter} onClick={() => setSelectedQuarter(row.quarter)}>
              {row.quarter}
            </FilterChip>
          ))}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-4">
          {[
            { label: 'Operational status', value: active.health },
            { label: 'Velocity', value: active.initiativeVelocity },
            { label: 'Variance', value: `${active.variance}%` },
            { label: 'Incidents', value: active.incidents },
          ].map((cell) => (
            <article key={cell.label} className="mos-surface-deep p-3">
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {cell.label}
              </p>
              <p className="mt-1 text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                {cell.value}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        {reportBlocks.map((block) => (
          <PageCard key={block.name} title={block.name}>
            <ul className="space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
              {block.metrics.map((metric) => (
                <li key={metric}>- {metric}</li>
              ))}
            </ul>
          </PageCard>
        ))}
      </section>

      <PageSection title="Quarterly trend table">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="mos-table-head">
              <tr>
                <th className="px-3 py-2 text-left">Quarter</th>
                <th className="px-3 py-2 text-right">Health</th>
                <th className="px-3 py-2 text-right">Velocity</th>
                <th className="px-3 py-2 text-right">Variance</th>
                <th className="px-3 py-2 text-right">Incidents</th>
              </tr>
            </thead>
            <tbody>
              {quarterlyReportData.map((row) => (
                <tr key={row.quarter} className="mos-table-row">
                  <td className="px-3 py-2">{row.quarter}</td>
                  <td className="px-3 py-2 text-right font-mono">{row.health}</td>
                  <td className="px-3 py-2 text-right font-mono">{row.initiativeVelocity}</td>
                  <td className="px-3 py-2 text-right font-mono">{row.variance}%</td>
                  <td className="px-3 py-2 text-right font-mono">{row.incidents}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PageSection>

      <PageSection title="Distribution (demo)">
        <TileLink href="/reports/weekly">Weekly company report →</TileLink>
      </PageSection>
    </AppShell>
  )
}
