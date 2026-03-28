'use client'

import { useEffect, useState, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMartinStore } from '@/store/useMartinStore'
import { FRAMEWORK_REGISTRY } from '@/registry/frameworkRegistry'

const WORKFLOW_COMMANDS = [
  { id: 'strat_prioritize', label: 'Strategy: Prioritize Initiatives', group: 'Workflows' },
  { id: 'ops_capacity', label: 'Operations: Capacity Load Check', group: 'Workflows' },
  { id: 'risk_audit', label: 'Risk: Run Full Audit', group: 'Workflows' },
  { id: 'finance_health', label: 'Finance: Health Score Recalculation', group: 'Workflows' },
  { id: 'team_raci', label: 'Governance: Generate RACI for Active Projects', group: 'Workflows' },
]

const NAV_COMMANDS = [
  { id: 'nav_pmo', label: 'Navigate to PMO-Ops', group: 'Navigation', href: '/pmo-ops' },
  { id: 'nav_tech', label: 'Navigate to Tech-Ops', group: 'Navigation', href: '/tech-ops' },
  { id: 'nav_miidle', label: 'Navigate to Miidle', group: 'Navigation', href: '/miidle' },
  { id: 'nav_settings', label: 'Open Settings', group: 'Navigation', href: '/settings' },
  { id: 'nav_gallery', label: 'Open Framework Gallery', group: 'Navigation', href: '/pmo-ops' },
]

const FRAMEWORK_COMMANDS = Object.entries(FRAMEWORK_REGISTRY).map(([key, fw]) => ({
  id: `fw_${key}`,
  label: `Open ${fw.name}`,
  group: 'Intelligence Tools',
}))

const ALL_COMMANDS = [...WORKFLOW_COMMANDS, ...FRAMEWORK_COMMANDS, ...NAV_COMMANDS]

export default function CommandCenter() {
  const { commandOpen, setCommandOpen, setPresenceState } = useMartinStore()
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef(null)
  const prevOpenRef = useRef(false)

  useEffect(() => {
    if (commandOpen && !prevOpenRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
    prevOpenRef.current = commandOpen
  }, [commandOpen])

  const filtered = useMemo(() => {
    if (!query.trim()) return ALL_COMMANDS
    const q = query.toLowerCase()
    return ALL_COMMANDS.filter(
      (cmd) =>
        cmd.label.toLowerCase().includes(q) ||
        cmd.group.toLowerCase().includes(q),
    )
  }, [query])

  const grouped = useMemo(() => {
    const groups = {}
    filtered.forEach((cmd) => {
      if (!groups[cmd.group]) groups[cmd.group] = []
      groups[cmd.group].push(cmd)
    })
    return groups
  }, [filtered])

  const handleSelect = (cmd) => {
    setCommandOpen(false)
    if (cmd.href) {
      window.location.href = cmd.href
      return
    }
    setPresenceState('executing')
    setTimeout(() => setPresenceState('idle'), 2000)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      handleSelect(filtered[selectedIndex])
    }
  }

  return (
    <AnimatePresence>
      {commandOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[600] flex items-start justify-center pt-[14vh] px-4"
          style={{ background: 'var(--overlay-scrim)' }}
          onClick={() => setCommandOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-2xl overflow-hidden rounded-2xl backdrop-blur-2xl"
            style={{
              background: 'var(--surface-glass)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-elevated)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="flex items-center gap-3 px-5 py-4"
              style={{ borderBottom: '1px solid color-mix(in oklab, var(--border-subtle) 60%, transparent)' }}
            >
              <div
                className="h-2 w-2 rounded-full flex-shrink-0"
                style={{
                  background: 'var(--accent)',
                  boxShadow: '0 0 8px color-mix(in oklab, var(--accent) 40%, transparent)',
                }}
              />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setSelectedIndex(0)
                }}
                onKeyDown={handleKeyDown}
                placeholder="Ask Apphia or trigger a workflow…"
                className="flex-1 bg-transparent text-base outline-none"
                style={{ color: 'var(--text-primary)', caretColor: 'var(--accent)' }}
              />
              <kbd
                className="text-[10px] px-1.5 py-0.5 rounded"
                style={{ border: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}
              >
                ESC
              </kbd>
            </div>

            <div className="max-h-[50vh] overflow-y-auto p-2 custom-scrollbar">
              {filtered.length === 0 && (
                <p
                  className="py-10 text-center text-sm"
                  style={{ color: 'var(--text-muted)' }}
                >
                  No match. Try &quot;Risk Audit&quot; or &quot;Health Check&quot;.
                </p>
              )}

              {Object.entries(grouped).map(([group, commands]) => (
                <div key={group} className="mb-2">
                  <p
                    className="px-3 pt-2 pb-1 text-[10px] uppercase tracking-[0.1em] font-medium"
                    style={{ color: 'var(--accent)' }}
                  >
                    {group}
                  </p>
                  {commands.map((cmd) => {
                    const globalIdx = filtered.indexOf(cmd)
                    const isSelected = globalIdx === selectedIndex
                    return (
                      <button
                        key={cmd.id}
                        onClick={() => handleSelect(cmd)}
                        onMouseEnter={() => setSelectedIndex(globalIdx)}
                        className="w-full flex items-center px-3 py-2.5 rounded-xl text-sm text-left transition-all"
                        style={{
                          background: isSelected
                            ? 'color-mix(in oklab, var(--accent) 10%, transparent)'
                            : 'transparent',
                          color: 'var(--text-primary)',
                        }}
                      >
                        {cmd.label}
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>

            <div
              className="px-5 py-3 flex justify-between items-center"
              style={{
                background: 'color-mix(in oklab, var(--surface-elevated) 40%, transparent)',
                borderTop: '1px solid color-mix(in oklab, var(--border-subtle) 60%, transparent)',
              }}
            >
              <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                Apphia Intelligence Engine v1.0
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                  ⌘K to toggle
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
