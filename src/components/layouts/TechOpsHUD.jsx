'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  AlertOctagon,
  Activity,
  Terminal,
  GitBranch,
  ChevronUp,
  ChevronDown,
  X,
} from 'lucide-react'
import { getPanelsForDomain, getWidgetsForDomain } from '@/lib/domainDashboards'
import AIStatusIndicator from '@/components/ai/AIStatusIndicator'
import { cn } from '@/lib/cn'
import { fadeScaleFast } from '@/motion/presets'

/**
 * Tech Ops HUD Component
 * Heads-up display layout for Tech Operations domain
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Main content area
 * @param {Object} props.panels - Custom panel configuration
 * @param {Object} props.widgets - Custom widget data
 * @param {string} props.className - Additional classes
 */
export default function TechOpsHUD({
  children,
  panels,
  widgets,
  className = '',
}) {
  const defaultPanels = getPanelsForDomain('TECH_OPS')
  const defaultWidgets = getWidgetsForDomain('TECH_OPS')

  const [panelStates, setPanelStates] = useState(() => {
    const initial = {}
    defaultPanels.forEach((panel) => {
      initial[panel.id] = {
        collapsed: !panel.defaultExpanded,
        visible: true,
      }
    })
    return initial
  })

  const togglePanel = (panelId) => {
    setPanelStates((prev) => ({
      ...prev,
      [panelId]: {
        ...prev[panelId],
        collapsed: !prev[panelId].collapsed,
      },
    }))
  }

  const closePanel = (panelId) => {
    setPanelStates((prev) => ({
      ...prev,
      [panelId]: {
        ...prev[panelId],
        visible: false,
      },
    }))
  }

  const getPanelIcon = (iconName) => {
    const icons = {
      'alert-triangle': AlertTriangle,
      'alert-octagon': AlertOctagon,
      activity: Activity,
      terminal: Terminal,
      'git-branch': GitBranch,
    }
    const Icon = icons[iconName] || Activity
    return <Icon className="w-4 h-4" />
  }

  const getPanelSize = (size) => {
    const sizes = {
      small: 'h-48',
      medium: 'h-80',
      large: 'h-[30rem]',
    }
    return sizes[size] || 'h-80'
  }

  const renderPanel = (panel) => {
    const state = panelStates[panel.id] || { collapsed: false, visible: true }
    if (!state.visible) return null

    const IconComponent = getPanelIcon(panel.icon)

    return (
      <motion.div
        key={panel.id}
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        transition={fadeScaleFast}
        className={cn(
          'hud-panel glass-panel chrome-edge',
          getPanelSize(panel.size),
          state.collapsed && 'collapsed'
        )}
      >
        {/* Panel Header */}
        <div
          className={cn(
            'hud-panel__header',
            'flex items-center gap-2',
            'text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
            'transition-colors'
          )}
          onClick={() => panel.collapsible && togglePanel(panel.id)}
        >
          <IconComponent className="text-[var(--accent)]" />
          <span className="flex-1">{panel.title}</span>
          {panel.collapsible && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-1"
            >
              {state.collapsed ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </motion.button>
          )}
        </div>

        {/* Panel Content */}
        {!state.collapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="hud-panel__content"
          >
            {/* Placeholder content - replace with actual widgets */}
            <div className="space-y-4">
              {renderPlaceholderContent(panel.id)}
            </div>
          </motion.div>
        )}
      </motion.div>
    )
  }

  const renderPlaceholderContent = (panelId) => {
    const placeholderContent = {
      'alerts-panel': (
        <div className="space-y-2">
          <div className="flex items-start gap-2 p-2 rounded border border-[var(--border-subtle)] hover:border-[var(--warning)] transition-colors">
            <AlertTriangle className="w-4 h-4 text-[var(--warning)] mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium">High CPU usage</p>
              <p className="text-xs text-[var(--text-muted)]">server-01 • 2 min ago</p>
            </div>
          </div>
          <div className="flex items-start gap-2 p-2 rounded border border-[var(--border-subtle)] hover:border-[var(--error)] transition-colors">
            <AlertTriangle className="w-4 h-4 text-[var(--error)] mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium">Memory threshold exceeded</p>
              <p className="text-xs text-[var(--text-muted)]">database-02 • 5 min ago</p>
            </div>
          </div>
        </div>
      ),
      'incidents-panel': (
        <div className="space-y-2">
          <div className="flex items-start gap-2 p-2 rounded border border-[var(--border-subtle)]">
            <div className="w-2 h-2 rounded-full bg-[var(--error)] mt-2" />
            <div className="flex-1">
              <p className="text-sm font-medium">API latency spike</p>
              <p className="text-xs text-[var(--text-muted)]">Severity: Critical</p>
            </div>
          </div>
          <div className="flex items-start gap-2 p-2 rounded border border-[var(--border-subtle)]">
            <div className="w-2 h-2 rounded-full bg-[var(--warning)] mt-2" />
            <div className="flex-1">
              <p className="text-sm font-medium">Deployment rollback</p>
              <p className="text-xs text-[var(--text-muted)]">Severity: Warning</p>
            </div>
          </div>
        </div>
      ),
      'metrics-panel': (
        <div className="space-y-4">
          {defaultWidgets.slice(0, 3).map((widget) => (
            <div
              key={widget.id}
              className="p-3 rounded border border-[var(--border-subtle)]"
            >
              <p className="text-xs text-[var(--text-muted)] mb-1">
                {widget.title}
              </p>
              <p className="text-2xl font-bold">98.5%</p>
              <p className="text-xs text-[var(--success)] mt-1">↑ 2.3% vs last week</p>
            </div>
          ))}
        </div>
      ),
      'logs-panel': (
        <div className="font-mono text-xs space-y-1">
          <p className="text-[var(--text-muted)]">2024-03-28 14:32:01 [INFO] Server started</p>
          <p className="text-[var(--text-muted)]">2024-03-28 14:32:02 [INFO] Connected to database</p>
          <p className="text-[var(--warning)]">2024-03-28 14:32:05 [WARN] Slow query detected</p>
          <p className="text-[var(--success)]">2024-03-28 14:32:10 [INFO] Request processed</p>
          <p className="text-[var(--text-muted)]">2024-03-28 14:32:15 [INFO] Health check passed</p>
        </div>
      ),
      'deployments-panel': (
        <div className="space-y-2">
          <div className="flex items-center gap-2 p-2 rounded border border-[var(--border-subtle)]">
            <GitBranch className="w-3 h-3 text-[var(--success)]" />
            <span className="text-xs font-medium flex-1">v2.4.1</span>
            <span className="text-xs text-[var(--success)]">Success</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded border border-[var(--border-subtle)]">
            <GitBranch className="w-3 h-3 text-[var(--warning)]" />
            <span className="text-xs font-medium flex-1">v2.4.0</span>
            <span className="text-xs text-[var(--warning)]">Rollback</span>
          </div>
        </div>
      ),
    }

    return placeholderContent[panelId] || <p className="text-sm text-[var(--text-muted)]">No content</p>
  }

  return (
    <div className={cn('layout-hud', className)}>
      {/* Header */}
      <div className="layout-hud__header flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <h1 className="font-display font-semibold">Tech Ops HUD</h1>
          <AIStatusIndicator state="idle" />
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 text-xs rounded-full border border-[var(--border-subtle)]">
            All Systems Operational
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="layout-hud__main">
        <div className="container mx-auto px-4 py-6">
          {children}
        </div>
      </main>

      {/* HUD Panels */}
      <div className="layout-hud__panels">
        {defaultPanels.map(renderPanel)}
      </div>
    </div>
  )
}
