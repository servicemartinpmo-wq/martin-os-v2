'use client'

import { useState } from 'react'
import { fallbackPmoInitiatives } from '@/features/data/operationalData'

/** @typedef {{ id: string, title: string, status: 'planning' | 'running' | 'completed' | 'at-risk', owner: string, progress: number, riskLevel: 'low' | 'medium' | 'high' | null, updatedAt: string }} Initiative */

const statusColors = {
  'On Track': { bg: 'color-mix(in oklab, var(--success) 22%, transparent)', text: 'var(--success)' },
  'At Risk': { bg: 'color-mix(in oklab, var(--warning) 22%, transparent)', text: 'var(--warning)' },
  Delayed: { bg: 'color-mix(in oklab, var(--error) 22%, transparent)', text: 'var(--error)' },
}

function getRiskLevel(score) {
  if (score >= 50) return 'high'
  if (score >= 30) return 'medium'
  return 'low'
}

const riskColors = {
  low: 'var(--success)',
  medium: 'var(--warning)',
  high: 'var(--error)',
}

export default function InitiativeList() {
  const [filter, setFilter] = useState('All')

  const filtered =
    filter === 'All'
      ? fallbackPmoInitiatives
      : fallbackPmoInitiatives.filter((initiative) => initiative.status === filter)

  return (
    <div className="space-y-3">
      <div className="flex gap-2 mb-4">
        {['All', 'On Track', 'At Risk', 'Delayed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`mos-chip ${filter === f ? 'mos-chip-active' : ''}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="glass-panel overflow-hidden">
        <table className="w-full text-sm">
          <thead className="mos-table-head">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Initiative</th>
              <th className="px-4 py-3 text-left font-medium">Owner</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Progress</th>
              <th className="px-4 py-3 text-left font-medium">Risk</th>
              <th className="px-4 py-3 text-left font-medium">Alignment</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((initiative) => (
              <tr key={initiative.id} className="mos-table-row">
                <td className="px-4 py-3 font-medium" style={{ color: 'var(--text-primary)' }}>
                  <p>{initiative.name}</p>
                  <p className="text-xs font-mono-ui" style={{ color: 'var(--text-muted)' }}>
                    {initiative.id}
                  </p>
                </td>
                <td className="px-4 py-3" style={{ color: 'var(--text-muted)' }}>
                  {initiative.owner}
                </td>
                <td className="px-4 py-3">
                  <span
                    className="mos-chip"
                    style={{
                      backgroundColor: statusColors[initiative.status]?.bg,
                      color: statusColors[initiative.status]?.text,
                      borderColor: 'transparent',
                    }}
                  >
                    {initiative.status.toLowerCase()}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 rounded-full bg-[var(--border-subtle)] overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${initiative.completion}%`,
                          backgroundColor: 'var(--accent)',
                        }}
                      />
                    </div>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {initiative.completion}%
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className="text-xs font-medium"
                    style={{ color: riskColors[getRiskLevel(initiative.risk)] }}
                  >
                    {initiative.risk}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {initiative.alignment}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
