'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GlassCard from '@/components/ui/GlassCard'
import { useMartinStore } from '@/store/useMartinStore'
import {
  FRAMEWORK_REGISTRY,
  FRAMEWORK_CATEGORIES,
  getFrameworksForDomain,
} from '@/registry/frameworkRegistry'

export default function FrameworkGallery() {
  const { currentDomain, activeMode, setPresenceState } = useMartinStore()
  const [activeCategory, setActiveCategory] = useState(null)

  const frameworks = useMemo(() => {
    const all = getFrameworksForDomain(currentDomain)
    if (!activeCategory) return all
    return all.filter(([, fw]) => fw.category === activeCategory)
  }, [currentDomain, activeCategory])

  const handleExecute = () => {
    setPresenceState('thinking')
    setTimeout(() => setPresenceState('idle'), 2400)
  }

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap justify-between items-end gap-3 px-1">
        <div>
          <h2
            className="text-xl font-display font-semibold tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            Intelligence Gallery
          </h2>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            {frameworks.length} Active Decision Models in {currentDomain}
          </p>
        </div>
        <div
          className="px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.12em] font-medium"
          style={{
            border: '1px solid color-mix(in oklab, var(--accent) 30%, var(--border-subtle))',
            background: 'var(--accent-muted)',
            color: 'var(--accent)',
          }}
        >
          Mode: {activeMode}
        </div>
      </header>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory(null)}
          className="mos-chip"
          style={!activeCategory ? { borderColor: 'var(--accent)', background: 'var(--accent-muted)', color: 'var(--text-primary)' } : {}}
        >
          All
        </button>
        {FRAMEWORK_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
            className="mos-chip"
            style={activeCategory === cat ? { borderColor: 'var(--accent)', background: 'var(--accent-muted)', color: 'var(--text-primary)' } : {}}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {frameworks.map(([key, fw]) => (
            <motion.div
              key={key}
              layout
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <GlassCard title={fw.name} statusDot="active">
                <div className="flex flex-col justify-between space-y-4">
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    {fw.description}
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <span
                      className="text-[10px] px-2 py-1 rounded-md"
                      style={{
                        background: 'color-mix(in oklab, var(--surface-elevated) 50%, transparent)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-muted)',
                      }}
                    >
                      {fw.category}
                    </span>
                    <button
                      onClick={handleExecute}
                      className="text-xs font-medium transition-colors"
                      style={{ color: 'var(--accent)' }}
                    >
                      Execute Workflow →
                    </button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
