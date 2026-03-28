'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { staggerChildren } from '@/motion/presets'

/**
 * @param {{ kpis: Array<{ label: string, value: string, hint: string }>, loading: boolean }} props
 */
export default function PmoOpsLiveKpis({ kpis, loading: busy }) {
  const reduceMotion = useReducedMotion()

  return (
    <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi, i) => (
        <motion.article
          key={kpi.label}
          className="glass-panel p-4"
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reduceMotion ? 0 : i * staggerChildren, duration: 0.25 }}
        >
          <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
            {kpi.label}
          </p>
          <p className="mt-2 text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            {busy ? '…' : kpi.value}
          </p>
          <p className="mt-1 text-[11px]" style={{ color: 'var(--text-muted)' }}>
            {kpi.hint}
          </p>
        </motion.article>
      ))}
    </section>
  )
}
