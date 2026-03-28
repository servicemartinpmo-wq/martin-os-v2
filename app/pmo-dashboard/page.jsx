'use client'

import { useState } from 'react'
import PmoDashboard, { PmoStatsRow } from '@/components/layouts/PmoDashboard'
import { motion } from 'framer-motion'
import { fadeIn } from '@/lib/motionEnhanced'
import BentoGrid, {
  BentoMetricCard,
  BentoListCard,
  BentoChartCard,
} from '@/components/layouts/BentoGrid'
import {
  Target,
  TrendingUp,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  BarChart3,
} from 'lucide-react'

/**
 * PMO Dashboard Demo Page
 * Demonstrates sidebar admin layout with enterprise-light theme
 */
export default function PmoDashboardPage() {
  const [activeNavItem, setActiveNavItem] = useState('dashboard')

  const handleNavItemClick = (itemId) => {
    setActiveNavItem(itemId)
  }

  return (
    <PmoDashboard
      activeNavItem={activeNavItem}
      onNavItemClick={handleNavItemClick}
    >
      <motion.div {...fadeIn(0.1)}>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-display font-bold text-4xl mb-2">
            PMO Dashboard
          </h1>
          <p className="text-[var(--text-muted)]">
            Strategic oversight and project management
          </p>
        </div>

        {/* Quick Stats Row */}
        <PmoStatsRow stats={quickStats} />

        {/* Main Content */}
        <div className="space-y-6">
          {/* Initiatives Overview */}
          <motion.div {...fadeIn(0.2)}>
            <h2 className="font-semibold text-xl mb-4">Initiatives Overview</h2>
            <BentoGrid columns={3} gap="md">
              {/* Featured Initiative */}
              <BentoMetricCard
                title="Active Initiatives"
                value="24"
                trend="↑ 3 this quarter"
                trendPositive={true}
                icon={<Target className="w-5 h-5" />}
                color="var(--accent)"
                size="large"
              />

              {/* Budget Utilization */}
              <BentoMetricCard
                title="Budget Utilization"
                value="78%"
                trend="↑ 5% vs plan"
                trendPositive={false}
                icon={<BarChart3 className="w-5 h-5" />}
                color="var(--warning)"
                size="medium"
              />

              {/* Team Capacity */}
              <BentoMetricCard
                title="Team Capacity"
                value="92%"
                trend="Optimal"
                trendPositive={true}
                icon={<Users className="w-5 h-5" />}
                color="var(--success)"
                size="medium"
              />

              {/* Risk Alerts */}
              <BentoListCard
                title="Risk Alerts"
                icon={<AlertTriangle className="w-5 h-5" />}
                color="var(--error)"
                size="large"
                items={riskAlerts}
              />

              {/* Milestones */}
              <BentoListCard
                title="Upcoming Milestones"
                icon={<Calendar className="w-5 h-5" />}
                color="var(--accent)"
                size="tall"
                items={milestones}
              />

              {/* Action Items */}
              <BentoListCard
                title="Next Actions"
                icon={<CheckCircle className="w-5 h-5" />}
                color="var(--success)"
                size="medium"
                items={actionItems}
              />
            </BentoGrid>
          </motion.div>

          {/* Department Performance */}
          <motion.div {...fadeIn(0.3)}>
            <h2 className="font-semibold text-xl mb-4">Department Performance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {departments.map((dept, index) => (
                <motion.div
                  key={dept.id}
                  {...fadeIn(0.1)}
                  className="glass-panel p-5 rounded-xl"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">{dept.name}</h3>
                      <p className="text-sm text-[var(--text-muted)]">
                        {dept.initiatives} initiatives
                      </p>
                    </div>
                    <div
                      className="px-3 py-1 rounded-full text-sm font-medium"
                      style={{
                        background: `${dept.statusColor}20`,
                        color: dept.statusColor,
                      }}
                    >
                      {dept.status}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span className="font-medium">{dept.progress}%</span>
                      </div>
                      <div className="h-2 bg-[var(--bg-subtle)] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${dept.progress}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          className="h-full rounded-full"
                          style={{ background: dept.statusColor }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-[var(--text-muted)]">On Track</p>
                        <p className="font-semibold">{dept.onTrack}</p>
                      </div>
                      <div>
                        <p className="text-[var(--text-muted)]">At Risk</p>
                        <p className="font-semibold">{dept.atRisk}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </PmoDashboard>
  )
}

// Data
const quickStats = [
  {
    id: 'initiatives',
    title: 'Total Initiatives',
    value: '24',
    trend: '↑ 3 this quarter',
    trendPositive: true,
  },
  {
    id: 'health-score',
    title: 'Health Score',
    value: '87',
    trend: '↑ 2 vs last month',
    trendPositive: true,
  },
  {
    id: 'capacity',
    title: 'Team Capacity',
    value: '92%',
    trend: 'Optimal',
    trendPositive: true,
  },
  {
    id: 'risks',
    title: 'Active Risks',
    value: '5',
    trend: '↓ 2 this week',
    trendPositive: true,
  },
]

const riskAlerts = [
  {
    title: 'Budget overrun risk',
    description: 'Q2 projected to exceed by 8%',
    color: 'var(--error)',
  },
  {
    title: 'Resource constraint',
    description: 'Engineering team at 95% capacity',
    color: 'var(--warning)',
  },
  {
    title: 'Timeline variance',
    description: '2 initiatives delayed 2+ weeks',
    color: 'var(--warning)',
  },
]

const milestones = [
  {
    title: 'Q1 Review',
    description: 'April 15, 2024',
    color: 'var(--accent)',
  },
  {
    title: 'Platform Launch',
    description: 'May 1, 2024',
    color: 'var(--accent)',
  },
  {
    title: 'Team Expansion',
    description: 'May 15, 2024',
    color: 'var(--success)',
  },
]

const actionItems = [
  {
    title: 'Review Q2 budget',
    description: 'Due tomorrow',
    color: 'var(--error)',
  },
  {
    title: 'Update risk register',
    description: 'Due this week',
    color: 'var(--warning)',
  },
  {
    title: 'Schedule stakeholder meeting',
    description: 'Due next week',
    color: 'var(--accent)',
  },
]

const departments = [
  {
    id: 1,
    name: 'Engineering',
    initiatives: 8,
    status: 'On Track',
    statusColor: 'var(--success)',
    progress: 85,
    onTrack: 6,
    atRisk: 2,
  },
  {
    id: 2,
    name: 'Product',
    initiatives: 5,
    status: 'On Track',
    statusColor: 'var(--success)',
    progress: 78,
    onTrack: 4,
    atRisk: 1,
  },
  {
    id: 3,
    name: 'Marketing',
    initiatives: 6,
    status: 'At Risk',
    statusColor: 'var(--warning)',
    progress: 65,
    onTrack: 3,
    atRisk: 3,
  },
  {
    id: 4,
    name: 'Operations',
    initiatives: 5,
    status: 'On Track',
    statusColor: 'var(--success)',
    progress: 90,
    onTrack: 5,
    atRisk: 0,
  },
]
