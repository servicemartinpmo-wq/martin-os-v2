'use client'

import { useState } from 'react'
import { fallbackTechTickets } from '@/features/data/operationalData'

const statusColors = {
  Open: { bg: 'color-mix(in oklab, var(--warning) 20%, transparent)', text: 'var(--warning)' },
  Investigating: { bg: 'color-mix(in oklab, var(--accent) 20%, transparent)', text: 'var(--accent)' },
  Escalated: { bg: 'color-mix(in oklab, var(--error) 20%, transparent)', text: 'var(--error)' },
  Resolved: { bg: 'color-mix(in oklab, var(--success) 20%, transparent)', text: 'var(--success)' },
}

const confidenceColors = {
  high: 'var(--success)',
  medium: 'var(--warning)',
  low: 'var(--error)',
}

export default function TicketList() {
  const [filter, setFilter] = useState('All')
  const statuses = ['All', ...new Set(fallbackTechTickets.map((ticket) => ticket.status))]

  const filtered =
    filter === 'All'
      ? fallbackTechTickets
      : fallbackTechTickets.filter((ticket) => ticket.status === filter)

  function confidenceBand(value) {
    if (value >= 0.8) return 'high'
    if (value >= 0.6) return 'medium'
    return 'low'
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2 mb-4">
        {statuses.map((f) => (
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
              <th className="px-4 py-3 text-left font-medium">Ticket</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Tier</th>
              <th className="px-4 py-3 text-left font-medium">AI confidence</th>
              <th className="px-4 py-3 text-left font-medium">Route</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((ticket) => (
              <tr key={ticket.id} className="mos-table-row">
                <td className="px-4 py-3">
                  <div>
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                      {ticket.title}
                    </span>
                    <span className="ml-2 text-xs font-mono-ui" style={{ color: 'var(--text-muted)' }}>
                      {ticket.id}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className="mos-chip text-xs"
                    style={{
                      backgroundColor: statusColors[ticket.status]?.bg,
                      color: statusColors[ticket.status]?.text,
                      borderColor: 'transparent',
                    }}
                  >
                    {ticket.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                    Tier {ticket.tier}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className="text-xs font-medium"
                    style={{ color: confidenceColors[confidenceBand(ticket.confidence)] }}
                  >
                    {Math.round(ticket.confidence * 100)}%
                  </span>
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                  {ticket.tier >= 3 ? 'Escalation queue' : 'Standard queue'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
