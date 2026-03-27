'use client'

import { Button as HUIButton } from '@headlessui/react'
import { cn } from '@/lib/cn'

/**
 * Catalyst-compatible primary button — Headless UI + theme tokens.
 */
export default function Button({ className, children, variant = 'solid', ...props }) {
  const base =
    'inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] disabled:opacity-50'

  const styles =
    variant === 'ghost'
      ? { color: 'var(--text-primary)', background: 'transparent' }
      : {
          background: 'var(--accent)',
          color: 'var(--text-on-accent)',
          border: '1px solid color-mix(in oklab, var(--accent) 60%, transparent)',
        }

  return (
    <HUIButton type="button" className={cn(base, className)} style={styles} {...props}>
      {children}
    </HUIButton>
  )
}
