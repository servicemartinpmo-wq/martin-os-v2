'use client'

import { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMartinStore } from '@/store/useMartinStore'

const DEMO_SIGNALS = [
  {
    id: 'sig-1',
    type: 'capacity_alert',
    priority: 'high',
    title: 'Marketing Team Overload',
    description: 'Marketing initiative capacity at 112%. Delegation gaps detected in Q3 campaigns.',
    suggestedFramework: 'raci_matrix',
  },
  {
    id: 'sig-2',
    type: 'deadline_risk',
    priority: 'medium',
    title: 'Milestone Slip: Platform v2.1',
    description: 'Sprint velocity indicates 4-day overrun on API integration milestone.',
    suggestedFramework: 'risk_register',
  },
  {
    id: 'sig-3',
    type: 'performance_drop',
    priority: 'critical',
    title: 'Revenue Conversion Stalling',
    description: 'MRR growth slowed to 1.2% vs target 3.5%. Funnel analysis recommended.',
    suggestedFramework: 'dupont_analysis',
  },
  {
    id: 'sig-4',
    type: 'stalled_initiative',
    priority: 'low',
    title: 'Knowledge Base Audit Pending',
    description: 'Tech-Ops KB refresh stalled for 14 days. No owner assigned.',
    suggestedFramework: 'raci_matrix',
  },
]

const PRIORITY_STYLES = {
  low: { border: 'var(--border-subtle)', glow: 'none' },
  medium: { border: 'color-mix(in oklab, var(--accent) 40%, var(--border-subtle))', glow: 'none' },
  high: { border: 'color-mix(in oklab, var(--warning) 50%, var(--border-subtle))', glow: '0 0 12px color-mix(in oklab, var(--warning) 15%, transparent)' },
  critical: { border: 'color-mix(in oklab, var(--error) 60%, var(--border-subtle))', glow: '0 0 16px color-mix(in oklab, var(--error) 20%, transparent)' },
}

function SignalCard({ signal, onDismiss }) {
  const st = PRIORITY_STYLES[signal.priority] || PRIORITY_STYLES.low
  const { setPresenceState } = useMartinStore()

  return (
    <motion.div
      initial={{ x: 320, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 320, opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="pointer-events-auto"
    >
      <div
        className="p-4 rounded-2xl backdrop-blur-2xl transition-all duration-500"
        style={{
          background: 'var(--surface-glass)',
          border: `1px solid ${st.border}`,
          boxShadow: `var(--shadow-inner-soft), ${st.glow}`,
        }}
      >
        <div className="flex justify-between items-start mb-2">
          <span
            className="text-[10px] uppercase tracking-[0.08em]"
            style={{ color: 'var(--text-muted)' }}
          >
            {signal.type.replace(/_/g, ' ')}
          </span>
          <div
            className="h-1.5 w-1.5 rounded-full"
            style={{
              background: signal.priority === 'critical' ? 'var(--error)' : 'var(--accent)',
              animation: signal.priority === 'critical' ? 'pulse 1.5s ease-in-out infinite' : 'none',
            }}
          />
        </div>

        <h4 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
          {signal.title}
        </h4>
        <p
          className="text-xs mb-4"
          style={{
            color: 'var(--text-muted)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {signal.description}
        </p>

        <div className="flex gap-2">
          <button
            onClick={() => {
              setPresenceState('thinking')
              setTimeout(() => setPresenceState('idle'), 2000)
            }}
            className="flex-1 py-2 rounded-xl text-[11px] font-medium transition-all"
            style={{
              background: 'color-mix(in oklab, var(--accent) 12%, transparent)',
              border: '1px solid color-mix(in oklab, var(--accent) 25%, var(--border-subtle))',
              color: 'var(--accent)',
            }}
          >
            Run Diagnosis
          </button>
          <button
            onClick={() => onDismiss(signal.id)}
            className="px-3 py-2 rounded-xl text-[11px] transition-all"
            style={{
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-muted)',
            }}
          >
            ×
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default function SignalFeed() {
  const { signals, addSignal, removeSignal } = useMartinStore()

  const spawnDemoSignal = useCallback(() => {
    const template = DEMO_SIGNALS[Math.floor(Math.random() * DEMO_SIGNALS.length)]
    const sig = {
      ...template,
      id: `sig-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
    }
    addSignal(sig)
    setTimeout(() => removeSignal(sig.id), 15000)
  }, [addSignal, removeSignal])

  useEffect(() => {
    const initial = setTimeout(spawnDemoSignal, 3000)
    const interval = setInterval(spawnDemoSignal, 20000)
    return () => {
      clearTimeout(initial)
      clearInterval(interval)
    }
  }, [spawnDemoSignal])

  return (
    <aside className="fixed right-4 top-20 bottom-6 w-80 z-30 flex flex-col gap-3 pointer-events-none overflow-hidden">
      <AnimatePresence>
        {signals.slice(0, 3).map((signal) => (
          <SignalCard key={signal.id} signal={signal} onDismiss={removeSignal} />
        ))}
      </AnimatePresence>
    </aside>
  )
}
