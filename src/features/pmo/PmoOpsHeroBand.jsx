'use client'

import { motion, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import PexelsBackdrop from '@/components/media/PexelsBackdrop'
import OrgHealthOrb from '@/components/pmo/OrgHealthOrb'
import { getPexelsPreset } from '@/lib/pexelsPresets'
import { staggerChildren } from '@/motion/presets'

/**
 * @param {{ orgHealth: number, loading: boolean, iniFallback: boolean, insFallback: boolean }} props
 */
export default function PmoOpsHeroBand({ orgHealth, loading, iniFallback, insFallback }) {
  const reduceMotion = useReducedMotion()
  const preset = getPexelsPreset('hero-office-4k')

  return (
    <motion.section
      className="relative overflow-hidden rounded-[var(--radius-panel)] border"
      style={{ borderColor: 'var(--border-subtle)' }}
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {preset ? (
        <div className="absolute inset-0 min-h-[200px]">
          <PexelsBackdrop preset={preset} className="h-full min-h-[200px]" priority />
        </div>
      ) : null}
      <div
        className="relative z-[1] flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between"
        style={{
          background: preset
            ? 'color-mix(in oklab, var(--bg-base) 55%, transparent)'
            : 'color-mix(in oklab, var(--surface-glass) 40%, transparent)',
        }}
      >
        <div className="max-w-xl">
          <p className="text-xs uppercase tracking-[0.2em]" style={{ color: 'var(--accent)' }}>
            PMO-Ops · mpo-pilot alignment
          </p>
          <h2 className="font-display mt-2 text-2xl font-semibold md:text-3xl" style={{ color: 'var(--text-primary)' }}>
            Organization health pulse
          </h2>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Composite score blends initiative telemetry with PMO insight signals — same data model as{' '}
            <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
              servicemartinpmo-wq/mpo-pilot
            </span>{' '}
            Supabase shapes.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              { href: '/pmo-ops/initiatives', label: 'Initiatives' },
              { href: '/pmo-ops/diagnostics', label: 'Diagnostics' },
              { href: '/pmo-ops/command-center', label: 'Command center' },
            ].map((l, i) => (
              <motion.div
                key={l.href}
                initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reduceMotion ? 0 : i * staggerChildren }}
              >
                <Link
                  href={l.href}
                  className="mos-link-tile inline-block text-center text-xs font-medium"
                  style={{ padding: '0.5rem 0.75rem' }}
                >
                  {l.label}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          {loading ? (
            <div className="font-display text-sm" style={{ color: 'var(--text-muted)' }}>
              Loading…
            </div>
          ) : (
            <OrgHealthOrb key={`org-health-${orgHealth}`} score={orgHealth} size="lg" />
          )}
          <p className="text-center text-[11px]" style={{ color: 'var(--text-muted)' }}>
            {iniFallback || insFallback ? 'Demo cohort · connect Supabase for live mpo-pilot data' : 'Live composite'}
          </p>
        </div>
      </div>
    </motion.section>
  )
}
