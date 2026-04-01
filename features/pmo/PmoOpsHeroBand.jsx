'use client'

import { motion, useReducedMotion } from 'framer-motion'
import OperationalStatusCard from '@/components/pmo/OperationalStatusCard'
import { staggerChildren } from '@/motion/presets'

/**
 * @param {{ orgHealth: number, loading: boolean, iniFallback: boolean, insFallback: boolean }} props
 */
export default function PmoOpsHeroBand({ orgHealth, loading, iniFallback, insFallback }) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.section
      className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative z-[1] flex flex-col gap-8 p-6 md:flex-row md:items-center md:justify-between md:p-8">
        <div className="max-w-xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-[#001F3F]/80 uppercase">
            PMO-Ops · mpo-pilot alignment
          </p>
          <h2 className="font-display mt-2 text-2xl font-semibold text-[#001F3F] md:text-3xl">
            Operational status pulse
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Executive-ready composite score with maturity signaling (red through green bands). Same initiative
            and insight contract as{' '}
            <span className="font-medium text-[#001F3F]">servicemartinpmo-wq/mpo-pilot</span> Supabase shapes.
          </p>
        </div>
        <motion.div
          className="flex w-full justify-center md:w-auto md:justify-end"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: reduceMotion ? 0 : staggerChildren, duration: 0.4 }}
        >
          <OperationalStatusCard
            score={orgHealth}
            loading={loading}
            iniFallback={iniFallback}
            insFallback={insFallback}
          />
        </motion.div>
      </div>
    </motion.section>
  )
}
