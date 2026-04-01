'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Target,
  Building2,
  BarChart2,
  Activity,
  CheckSquare,
  Database,
  Users,
  Plug,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
} from 'lucide-react'
import { getDashboardByDomain } from '@/lib/domainDashboards'
import AIStatusIndicator from '@/components/ai/AIStatusIndicator'
import { cn } from '@/lib/cn'
import { fadeScaleFast } from '@/motion/presets'

/**
 * PMO Dashboard Component
 * Classic sidebar admin layout for PMO domain
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Main content area
 * @param {string} props.activeNavItem - Currently active navigation item
 * @param {function} props.onNavItemClick - Callback when nav item clicked
 * @param {string} props.className - Additional classes
 */
export default function PmoDashboard({
  children,
  activeNavItem = 'dashboard',
  onNavItemClick,
  className = '',
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const dashboard = getDashboardByDomain('PMO')
  const sidebarConfig = dashboard?.sidebar || { sections: [] }

  const getNavIcon = (iconName) => {
    const icons = {
      'layout-dashboard': LayoutDashboard,
      target: Target,
      'building-2': Building2,
      'bar-chart-2': BarChart2,
      activity: Activity,
      'check-square': CheckSquare,
      database: Database,
      users: Users,
      plug: Plug,
      settings: Settings,
    }
    const Icon = icons[iconName] || LayoutDashboard
    return <Icon className="w-4 h-4" />
  }

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  return (
    <div className={cn('layout-sidebar-admin', className)}>
      {/* Sidebar */}
      <aside
        className={cn(
          'layout-sidebar-admin__sidebar',
          'transition-all duration-300 ease-out',
          sidebarCollapsed ? 'w-16' : 'w-72'
        )}
      >
        {/* Logo / Brand */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-subtle)]">
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-display font-bold text-lg"
            >
              PMO
            </motion.div>
          )}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded hover:bg-[var(--bg-subtle)] transition-colors"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-6 overflow-y-auto flex-1">
          {sidebarConfig.sections.map((section) => (
            <div key={section.id}>
              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2 px-3"
                >
                  {section.title}
                </motion.div>
              )}

              <ul className="space-y-1">
                {section.items.map((item) => (
                  <li key={item.id}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onNavItemClick?.(item.id)}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all',
                        'text-sm font-medium',
                        activeNavItem === item.id
                          ? 'bg-[var(--accent)] text-[var(--text-on-accent)]'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]'
                      )}
                    >
                      {getNavIcon(item.icon)}
                      {!sidebarCollapsed && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </motion.button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* AI Status in Sidebar */}
        {!sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 border-t border-[var(--border-subtle)]"
          >
            <AIStatusIndicator state="idle" />
          </motion.div>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header
          className="sticky top-0 z-10 px-6 py-4 border-b border-[var(--border-subtle)]"
          style={{ background: 'var(--header-bg)' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="lg:hidden p-2 rounded hover:bg-[var(--bg-subtle)]">
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="font-display font-semibold text-xl">
                {activeNavItem.charAt(0).toUpperCase() + activeNavItem.slice(1)}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              {/* Quick actions */}
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 text-sm rounded-lg border border-[var(--border-subtle)] hover:border-[var(--accent)] transition-colors">
                  Quick Actions
                </button>
              </div>

              {/* User profile */}
              <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center text-[var(--text-on-accent)] font-semibold text-sm">
                PM
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={fadeScaleFast}
          >
            {children}
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="px-6 py-4 border-t border-[var(--border-subtle)] text-xs text-[var(--text-muted)]">
          <div className="flex items-center justify-between">
            <span>© 2024 Martin OS. All rights reserved.</span>
            <span>v1.0.0</span>
          </div>
        </footer>
      </div>
    </div>
  )
}

/**
 * PMO Widget Card Component
 * Reusable card component for dashboard widgets
 *
 * @param {Object} props
 * @param {string} props.title - Card title
 * @param {string} props.value - Primary value
 * @param {string} props.trend - Trend indicator (e.g., "↑ 12%")
 * @param {boolean} props.trendPositive - Is trend positive
 * @param {string} props.className - Additional classes
 */
export function PmoWidgetCard({
  title,
  value,
  trend,
  trendPositive = true,
  className = '',
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className={cn(
        'glass-panel p-4 rounded-xl',
        'transition-all duration-300',
        className
      )}
    >
      <p className="text-xs text-[var(--text-muted)] mb-1">{title}</p>
      <p className="text-2xl font-bold mb-1">{value}</p>
      {trend && (
        <p
          className={cn(
            'text-xs font-medium',
            trendPositive ? 'text-[var(--success)]' : 'text-[var(--error)]'
          )}
        >
          {trend}
        </p>
      )}
    </motion.div>
  )
}

/**
 * PMO Stats Row Component
 * Row of widget cards for quick stats
 *
 * @param {Object} props
 * @param {Array} props.stats - Array of stat objects
 */
export function PmoStatsRow({ stats = [] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.id || index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <PmoWidgetCard
            title={stat.title}
            value={stat.value}
            trend={stat.trend}
            trendPositive={stat.trendPositive}
          />
        </motion.div>
      ))}
    </div>
  )
}
