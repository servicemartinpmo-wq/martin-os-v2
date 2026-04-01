'use client'

import { cn } from '@/lib/cn'

/**
 * Label + description stack — Catalyst-style composition without licensed markup copy.
 */
export default function Field({ label, description, children, className = '' }) {
  return (
    <div className={cn('space-y-1.5', className)}>
      {label ? (
        <label className="block text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
          {label}
        </label>
      ) : null}
      {children}
      {description ? (
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {description}
        </p>
      ) : null}
    </div>
  )
}
