'use client'

import { motion, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { caseDiagnosticPipelineStages } from '@/features/data/operationalData'
import { staggerChildren } from '@/motion/presets'

export default function TechOpsReadinessBand() {
  const reduceMotion = useReducedMotion()

  return (
    <motion.section
      className="glass-panel overflow-hidden p-6"
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em]" style={{ color: 'var(--accent)' }}>
            Tech-Ops · servicemartinpmo-wq/Tech-Ops
          </p>
          <h2 className="font-display mt-2 text-xl font-semibold md:text-2xl" style={{ color: 'var(--text-primary)' }}>
            Case diagnostic pipeline
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Mirrors the production Tech-Ops stack described in READINESS_REPORT: cases with SLA, knowledge graph, quality control signals, automation,
            and SSE-friendly multi-stage diagnostics. Martin OS surfaces tickets and assisted diagnostics here; full case engine remains in the
            Tech-Ops service when you wire APIs.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/tech-ops/tickets" className="mos-chip mos-chip-active text-xs">
              Ticket queue
            </Link>
            <Link href="/tech-ops/diagnostics" className="mos-chip text-xs">
              Assisted diagnostics
            </Link>
            <Link href="/tech-ops/workflows" className="mos-chip text-xs">
              Workflow contracts
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <p className="text-[11px] uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
          Twelve-stage reference pipeline
        </p>
        <ol className="mt-3 flex flex-wrap gap-2">
          {caseDiagnosticPipelineStages.map((stage, i) => (
            <motion.li
              key={stage}
              initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: reduceMotion ? 0 : i * staggerChildren }}
              className="rounded-md border px-2 py-1 text-[11px] font-medium"
              style={{
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-primary)',
                background: 'color-mix(in oklab, var(--bg-elevated) 50%, transparent)',
              }}
            >
              {i + 1}. {stage}
            </motion.li>
          ))}
        </ol>
      </div>
    </motion.section>
  )
}
