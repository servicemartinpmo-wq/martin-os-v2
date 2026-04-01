'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'

export default function GlassCard({
  children,
  title,
  intensity = 'low',
  className,
  statusDot,
  action,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.008, boxShadow: '0 0 25px rgba(255,255,255,0.06)' }}
      className={cn(
        'relative overflow-hidden rounded-2xl',
        'border border-[var(--border-subtle)]',
        'backdrop-blur-xl shadow-[var(--shadow-inner-soft),var(--shadow-elevated)]',
        intensity === 'high'
          ? 'bg-[color-mix(in_oklab,var(--surface-glass)_85%,transparent)]'
          : 'bg-[var(--surface-glass)]',
        className,
      )}
    >
      <div
        className="absolute inset-0 pointer-events-none rounded-[inherit] opacity-40"
        style={{
          background:
            'linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.06) 50%, transparent 75%)',
        }}
      />

      {title && (
        <div
          className="px-5 py-3 flex justify-between items-center"
          style={{ borderBottom: '1px solid color-mix(in oklab, var(--border-subtle) 60%, transparent)' }}
        >
          <h3
            className="text-xs font-medium tracking-[0.12em] uppercase"
            style={{ color: 'var(--text-muted)' }}
          >
            {title}
          </h3>
          <div className="flex items-center gap-2">
            {action}
            {statusDot !== undefined && (
              <div
                className="h-2 w-2 rounded-full"
                style={{
                  background: statusDot === 'active' ? 'var(--accent)' : 'var(--text-muted)',
                  boxShadow:
                    statusDot === 'active'
                      ? '0 0 8px color-mix(in oklab, var(--accent) 50%, transparent)'
                      : 'none',
                }}
              />
            )}
          </div>
        </div>
      )}

      <div className="p-5 relative">{children}</div>
    </motion.div>
  )
}
