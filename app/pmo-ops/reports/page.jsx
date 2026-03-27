'use client'

import AppShell from '../../../src/features/shell/AppShell'
import { useMemo, useState } from 'react'
import { quarterlyReportData } from '../../../src/features/data/operationalData'

const reportBlocks = [
  { name: 'Executive Snapshot', metrics: ['Org Health 84', 'Critical Signals 3', 'Open Actions 27'] },
  { name: 'Operations Report', metrics: ['Initiative Velocity +12%', 'Dependency Delays 4', 'SOP Coverage 78%'] },
  { name: 'Quarterly Trends', metrics: ['Revenue Run-Rate +9%', 'Maturity +4pts', 'Cost Variance 2.9%'] },
]

export default function PMOReportsPage() {
  const [selectedQuarter, setSelectedQuarter] = useState('Q4')
  const active = useMemo(
    () => quarterlyReportData.find((row) => row.quarter === selectedQuarter) ?? quarterlyReportData[quarterlyReportData.length - 1],
    [selectedQuarter]
  )

  return (
    <AppShell activeHref="/pmo-ops">
      <header className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">PMO-Ops / Reports</p>
        <h2 className="mt-2 text-2xl font-semibold text-zinc-100">Reporting and readiness packs</h2>
      </header>

      <section className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
        <div className="flex flex-wrap gap-2">
          {quarterlyReportData.map((row) => (
            <button
              key={row.quarter}
              type="button"
              onClick={() => setSelectedQuarter(row.quarter)}
              className={`rounded-lg border px-3 py-2 text-xs ${
                selectedQuarter === row.quarter ? 'border-cyan-400/50 bg-cyan-500/10 text-cyan-200' : 'border-zinc-700 text-zinc-300'
              }`}
            >
              {row.quarter}
            </button>
          ))}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-4">
          <article className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-3">
            <p className="text-xs text-zinc-400">Org health</p>
            <p className="mt-1 text-xl font-semibold text-zinc-100">{active.health}</p>
          </article>
          <article className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-3">
            <p className="text-xs text-zinc-400">Velocity</p>
            <p className="mt-1 text-xl font-semibold text-zinc-100">{active.initiativeVelocity}</p>
          </article>
          <article className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-3">
            <p className="text-xs text-zinc-400">Variance</p>
            <p className="mt-1 text-xl font-semibold text-zinc-100">{active.variance}%</p>
          </article>
          <article className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-3">
            <p className="text-xs text-zinc-400">Incidents</p>
            <p className="mt-1 text-xl font-semibold text-zinc-100">{active.incidents}</p>
          </article>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        {reportBlocks.map((block) => (
          <article key={block.name} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
            <h3 className="text-base font-semibold text-zinc-100">{block.name}</h3>
            <ul className="mt-3 space-y-1 text-sm text-zinc-300">
              {block.metrics.map((metric) => (
                <li key={metric}>- {metric}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h3 className="text-base font-semibold text-zinc-100">Quarterly trend table</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="border-b border-zinc-800 text-zinc-400">
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
                <tr key={row.quarter} className="border-b border-zinc-800/70 text-zinc-200">
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
      </section>
    </AppShell>
  )
}
