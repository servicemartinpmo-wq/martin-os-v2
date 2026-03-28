'use client'

import { useState } from 'react'
import TechOpsHUD from '@/components/layouts/TechOpsHUD'
import { motion } from 'framer-motion'
import { slideIn } from '@/lib/motionEnhanced'
import {
  Activity,
  Cpu,
  Database,
  HardDrive,
  Network,
  Zap,
} from 'lucide-react'

/**
 * Tech Ops HUD Demo Page
 * Demonstrates the HUD layout mode with cyber-hud theme
 */
export default function TechOpsHUDPage() {
  const [selectedView, setSelectedView] = useState('overview')

  return (
    <TechOpsHUD>
      <motion.div {...slideIn('up', 20, 0.1)}>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-display font-bold text-4xl mb-2">
            Tech Operations Center
          </h1>
          <p className="text-[var(--text-muted)]">
            Real-time monitoring and incident management
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickStats.map((stat, index) => (
            <motion.div
              key={stat.id}
              {...slideIn('up', 20, index * 0.05)}
              className="glass-panel p-6 rounded-xl"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="p-2 rounded-lg"
                  style={{ background: `${stat.color}20` }}
                >
                  {stat.icon}
                </div>
                <span className="text-sm text-[var(--text-muted)]">
                  {stat.label}
                </span>
              </div>
              <div className="text-3xl font-bold mb-1" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div
                className={`text-sm font-medium ${
                  stat.trendPositive
                    ? 'text-[var(--success)]'
                    : 'text-[var(--error)]'
                }`}
              >
                {stat.trend}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* System Health */}
          <motion.div
            {...slideIn('up', 20, 0.25)}
            className="glass-panel p-6 rounded-xl"
          >
            <h2 className="font-semibold text-xl mb-4">System Health</h2>
            <div className="space-y-4">
              {systemHealth.map((system, index) => (
                <div key={system.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{system.name}</span>
                    <span
                      className={`text-sm ${
                        system.status === 'healthy'
                          ? 'text-[var(--success)]'
                          : system.status === 'warning'
                          ? 'text-[var(--warning)]'
                          : 'text-[var(--error)]'
                      }`}
                    >
                      {system.status}
                    </span>
                  </div>
                  <div className="h-2 bg-[var(--bg-subtle)] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${system.percentage}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="h-full rounded-full"
                      style={{
                        background:
                          system.status === 'healthy'
                            ? 'var(--success)'
                            : system.status === 'warning'
                            ? 'var(--warning)'
                            : 'var(--error)',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Incidents */}
          <motion.div
            {...slideIn('up', 20, 0.3)}
            className="glass-panel p-6 rounded-xl"
          >
            <h2 className="font-semibold text-xl mb-4">Recent Incidents</h2>
            <div className="space-y-3">
              {incidents.map((incident, index) => (
                <div
                  key={incident.id}
                  className="p-3 rounded-lg border border-[var(--border-subtle)] hover:border-[var(--accent)] transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        incident.severity === 'critical'
                          ? 'bg-[var(--error)]'
                          : incident.severity === 'warning'
                          ? 'bg-[var(--warning)]'
                          : 'bg-[var(--success)]'
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium mb-1">
                        {incident.title}
                      </p>
                      <p className="text-xs text-[var(--text-muted)] mb-2">
                        {incident.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--bg-subtle)]">
                          {incident.severity}
                        </span>
                        <span className="text-xs text-[var(--text-muted)]">
                          {incident.timeAgo}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </TechOpsHUD>
  )
}

// Data
const quickStats = [
  {
    id: 'uptime',
    label: 'System Uptime',
    value: '99.97%',
    trend: '↑ 0.02%',
    trendPositive: true,
    color: 'var(--success)',
    icon: <Activity className="w-5 h-5" />,
  },
  {
    id: 'response-time',
    label: 'Avg Response Time',
    value: '245ms',
    trend: '↓ 12ms',
    trendPositive: true,
    color: 'var(--accent)',
    icon: <Zap className="w-5 h-5" />,
  },
  {
    id: 'cpu-usage',
    label: 'CPU Usage',
    value: '67%',
    trend: '↑ 5%',
    trendPositive: false,
    color: 'var(--warning)',
    icon: <Cpu className="w-5 h-5" />,
  },
  {
    id: 'error-rate',
    label: 'Error Rate',
    value: '0.02%',
    trend: '↓ 0.01%',
    trendPositive: true,
    color: 'var(--error)',
    icon: <Network className="w-5 h-5" />,
  },
]

const systemHealth = [
  { id: 1, name: 'API Servers', status: 'healthy', percentage: 98 },
  { id: 2, name: 'Database', status: 'healthy', percentage: 95 },
  { id: 3, name: 'Cache Layer', status: 'warning', percentage: 78 },
  { id: 4, name: 'Storage', status: 'healthy', percentage: 92 },
  { id: 5, name: 'Network', status: 'healthy', percentage: 99 },
]

const incidents = [
  {
    id: 1,
    title: 'API latency spike',
    description: 'Increased latency on /api/v1/orders endpoint',
    severity: 'critical',
    timeAgo: '5 min ago',
  },
  {
    id: 2,
    title: 'Cache miss rate elevated',
    description: 'Redis cache miss rate increased to 35%',
    severity: 'warning',
    timeAgo: '15 min ago',
  },
  {
    id: 3,
    title: 'Deployment completed',
    description: 'Version 2.4.1 successfully deployed',
    severity: 'success',
    timeAgo: '1 hour ago',
  },
]
