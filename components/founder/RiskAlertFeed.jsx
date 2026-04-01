'use client'

const MOCK = [
 { id: '1', label: 'Project Phoenix — schedule slip', level: 'warning' },
 { id: '2', label: 'Hiring pipeline below target', level: 'error' },
 { id: '3', label: 'Vendor renewal in 14 days', level: 'warning' },
]

export default function RiskAlertFeed() {
  return (
    <ul className="space-y-2 text-sm">
      {MOCK.map((r) => (
        <li
          key={r.id}
          className="flex items-center justify-between gap-2 rounded-md border px-3 py-2"
          style={{
            borderColor: 'var(--border-subtle)',
            color: 'var(--text-primary)',
          }}
        >
          <span>{r.label}</span>
          <span
            className="shrink-0 text-xs font-medium uppercase tracking-wide"
            style={{
              color: r.level === 'error' ? 'var(--error)' : 'var(--warning)',
            }}
          >
            {r.level}
          </span>
        </li>
      ))}
    </ul>
  )
}
