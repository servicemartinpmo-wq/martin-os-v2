'use client'

/** Detached floating panel. */
export default function FloatingIsland({ children, className = '' }) {
  return (
    <div
      className={`glass-panel p-4 ${className}`}
      style={{ boxShadow: 'var(--shadow-elevated)' }}
    >
      {children}
    </div>
  )
}
