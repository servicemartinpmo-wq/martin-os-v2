'use client'

import { useState } from 'react'

/** @typedef {{ id: string, title: string, status: 'planning' | 'running' | 'completed' | 'at-risk', owner: string, progress: number, riskLevel: 'low' | 'medium' | 'high' | null, updatedAt: string }} Initiative */

const mockInitiatives = [
  { id: '1', title: 'Q1 Platform Migration', status: 'running', owner: 'Sarah K.', progress: 65, riskLevel: 'medium', updatedAt: '2024-02-15' },
  { id: '2', title: 'Customer Portal Redesign', status: 'at-risk', owner: 'Mike R.', progress: 40, riskLevel: 'high', updatedAt: '2024-02-14' },
  { id: '3', title: 'Analytics Dashboard v2', status: 'planning', owner: 'Lisa M.', progress: 15, riskLevel: null, updatedAt: '2024-02-13' },
  { id: '4', title: 'Mobile App Launch', status: 'completed', owner: 'Tom H.', progress: 100, riskLevel: null, updatedAt: '2024-02-10' },
  { id: '5', title: 'Security Audit Remediation', status: 'running', owner: 'Alex P.', progress: 80, riskLevel: 'low', updatedAt: '2024-02-15' },
]

const statusColors = {
  planning: { bg: 'var(--accent-muted)', text: 'var(--accent)' },
  running: { bg: 'color-mix(in oklab, var(--success) 20%, transparent)', text: 'var(--success)' },
  completed: { bg: 'color-mix(in oklab, var(--text-muted) 20%, transparent)', text: 'var(--text-muted)' },
  'at-risk': { bg: 'color-mix(in oklab, var(--error) 20%, transparent)', text: 'var(--error)' },
}

const riskColors = {
  low: 'var(--success)',
  medium: 'var(--warning)',
  high: 'var(--error)',
}

export default function InitiativeList() {
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' 
    ? mockInitiatives 
    : mockInitiatives.filter(i => i.status === filter)

  return (
    <div className="space-y-3">
      <div className="flex gap-2 mb-4">
        {['all', 'running', 'at-risk', 'completed'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`mos-chip ${filter === f ? 'mos-chip-active' : ''}`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
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
              <th className="px-4 py-3 text-left font-medium">Updated</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((initiative) => (
              <tr key={initiative.id} className="mos-table-row">
                <td className="px-4 py-3 font-medium" style={{ color: 'var(--text-primary)' }}>
                  {initiative.title}
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
                      borderColor: 'transparent'
                    }}
                  >
                    {initiative.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 rounded-full bg-[var(--border-subtle)] overflow-hidden">
                      <div 
                        className="h-full rounded-full"
                        style={{ 
                          width: `${initiative.progress}%`,
                          backgroundColor: 'var(--accent)'
                        }}
                      />
                    </div>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {initiative.progress}%
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {initiative.riskLevel ? (
                    <span 
                      className="text-xs font-medium"
                      style={{ color: riskColors[initiative.riskLevel] }}
                    >
                      {initiative.riskLevel.toUpperCase()}
                    </span>
                  ) : (
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                  {initiative.updatedAt}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
