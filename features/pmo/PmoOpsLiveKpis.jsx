'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { staggerChildren } from '@/motion/presets'
import { getMaturityBand, parseScoreValue } from '@/lib/maturityBand'
import { cn } from '@/lib/cn'

/**
 * @param {{ kpis: Array<{ label: string, value: string, hint: string }>, loading: boolean }} props
 */
export default function PmoOpsLiveKpis({ kpis, loading: busy }) {
  const reduceMotion = useReducedMotion()

  return (
    <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi, i) => {
        const parsed = !busy ? parseScoreValue(kpi.value) : null
        const band = parsed != null ? getMaturityBand(parsed) : null
        return (
          <motion.article
            key={kpi.label}
            className={cn(
              'glass-panel p-4',
              band && 'border border-slate-200',
              band?.softBg,
            )}
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduceMotion ? 0 : i * staggerChildren, duration: 0.25 }}
          >
            <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
              {kpi.label}
            </p>
            <p
              className={cn(
                'mt-2 text-2xl font-semibold tabular-nums',
                band ? band.textClass : '',
                !band && 'text-[#001F3F]',
              )}
              style={!band ? { color: 'var(--text-primary)' } : undefined}
            >
              {busy ? '…' : kpi.value}
            </p>
            {band ? (
              <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-slate-200/80">
                <div className={cn('h-full rounded-full', band.barClass)} style={{ width: `${parsed}%` }} />
              </div>
            ) : null}
            <p className="mt-1 text-[11px]" style={{ color: 'var(--text-muted)' }}>
              {kpi.hint}
            </p>
          </motion.article>
        )
      })}
    </section>
  )
}
