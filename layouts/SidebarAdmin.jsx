'use client'

/**
 * Primary admin sidebar shell — Catalyst-compatible region.
 * @param {{ children: React.ReactNode, className?: string }} props
 */
export default function SidebarAdmin({ children, className = '' }) {
  return (
    <aside
      className={`w-full shrink-0 lg:w-72 ${className}`}
      style={{
        borderColor: 'var(--border-subtle)',
        background: 'var(--surface-glass)',
      }}
    >
      {children}
    </aside>
  )
}
