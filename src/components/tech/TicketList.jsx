'use client'

import { useState } from 'react'

const mockTickets = [
  { 
    id: 'TKT-001', 
    title: 'Login failure on mobile app', 
    status: 'open', 
    priority: 'high',
    tier: 1,
    assignee: 'Unassigned',
    createdAt: '2024-02-15 14:32',
    source: 'customer'
  },
  { 
    id: 'TKT-002', 
    title: 'API rate limit exceeded', 
    status: 'in-progress', 
    priority: 'medium',
    tier: 2,
    assignee: 'Sarah K.',
    createdAt: '2024-02-15 13:15',
    source: 'system'
  },
  { 
    id: 'TKT-003', 
    title: 'Dashboard loading slowly', 
    status: 'open', 
    priority: 'low',
    tier: 1,
    assignee: 'Mike R.',
    createdAt: '2024-02-15 12:00',
    source: 'customer'
  },
  { 
    id: 'TKT-004', 
    title: 'Data export not working', 
    status: 'resolved', 
    priority: 'medium',
    tier: 2,
    assignee: 'Lisa M.',
    createdAt: '2024-02-14 16:45',
    source: 'internal'
  },
  { 
    id: 'TKT-005', 
    title: 'Integration webhook timeout', 
    status: 'in-progress', 
    priority: 'high',
    tier: 3,
    assignee: 'Tom H.',
    createdAt: '2024-02-14 15:20',
    source: 'system'
  },
]

const statusColors = {
  open: { bg: 'color-mix(in oklab, var(--warning) 20%, transparent)', text: 'var(--warning)' },
  'in-progress': { bg: 'color-mix(in oklab, var(--accent) 20%, transparent)', text: 'var(--accent)' },
  resolved: { bg: 'color-mix(in oklab, var(--success) 20%, transparent)', text: 'var(--success)' },
}

const priorityColors = {
  high: 'var(--error)',
  medium: 'var(--warning)',
  low: 'var(--success)',
}

export default function TicketList() {
  const [filter, setFilter] = useState('all')
  
  const filtered = filter === 'all' 
    ? mockTickets 
    : mockTickets.filter(t => t.status === filter)

  return (
    <div className="space-y-3">
      <div className="flex gap-2 mb-4">
        {['all', 'open', 'in-progress', 'resolved'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`mos-chip ${filter === f ? 'mos-chip-active' : ''}`}
          >
            {f === 'all' ? 'All' : f.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </button>
        ))}
      </div>

      <div className="glass-panel overflow-hidden">
        <table className="w-full text-sm">
          <thead className="mos-table-head">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Ticket</th>
              <th className="px-4 py-3 text-left font-medium">Source</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Priority</th>
              <th className="px-4 py-3 text-left font-medium">Tier</th>
              <th className="px-4 py-3 text-left font-medium">Assignee</th>
              <th className="px-4 py-3 text-left font-medium">Created</th>
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
                  <span className="mos-chip text-xs" style={{ borderColor: 'var(--border-subtle)' }}>
                    {ticket.source}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span 
                    className="mos-chip text-xs"
                    style={{ 
                      backgroundColor: statusColors[ticket.status]?.bg,
                      color: statusColors[ticket.status]?.text,
                      borderColor: 'transparent'
                    }}
                  >
                    {ticket.status.replace('-', ' ')}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span 
                    className="text-xs font-medium uppercase"
                    style={{ color: priorityColors[ticket.priority] }}
                  >
                    {ticket.priority}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    Tier {ticket.tier}
                  </span>
                </td>
                <td className="px-4 py-3" style={{ color: 'var(--text-muted)' }}>
                  {ticket.assignee}
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                  {ticket.createdAt}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
