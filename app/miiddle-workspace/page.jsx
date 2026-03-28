'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import BentoGrid, {
  BentoCard,
  BentoMetricCard,
  BentoListCard,
  BentoActionCard,
} from '@/components/layouts/BentoGrid'
import AIPresenceLayer from '@/components/ai/AIPresenceLayer'
import { slideIn } from '@/lib/motionEnhanced'
import {
  Workflow,
  BookOpen,
  Zap,
  MessageSquare,
  Clock,
  TrendingUp,
  Play,
  Plus,
  Search,
} from 'lucide-react'

/**
 * Miiddle Workspace Demo Page
 * Demonstrates bento grid layout with wellness-soft theme
 */
export default function MiiddleWorkspacePage() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="min-h-screen">
      {/* AI Presence Layer */}
      <AIPresenceLayer
        domain="MIIDLE"
        appView="MIIDLE"
        initialState="idle"
      />

      <div className="layout-bento">
        <motion.div {...slideIn('up', 20, 0.1)} className="mb-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display font-bold text-4xl mb-2">
              Miiddle Workspace
            </h1>
            <p className="text-[var(--text-muted)]">
              Workflow automation and knowledge management
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search workflows, knowledge, or actions..."
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-muted)] transition-all text-lg"
            />
          </div>

          {/* Bento Grid */}
          <BentoGrid columns={4} gap="md">
            {/* Quick Actions */}
            <BentoCard
              title="Quick Actions"
              icon={<Zap className="w-5 h-5" />}
              color="var(--accent)"
              size="large"
              large
            >
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action) => (
                  <motion.button
                    key={action.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 p-3 rounded-lg border border-[var(--border-subtle)] hover:border-[var(--accent)] hover:bg-[var(--accent-muted)] transition-all"
                  >
                    <div className="p-1.5 rounded" style={{ background: `${action.color}20` }}>
                      {action.icon}
                    </div>
                    <span className="text-sm font-medium">{action.label}</span>
                  </motion.button>
                ))}
              </div>
            </BentoCard>

            {/* Active Workflows */}
            <BentoListCard
              title="Active Workflows"
              icon={<Workflow className="w-5 h-5" />}
              color="var(--success)"
              size="tall"
              items={activeWorkflows}
            />

            {/* Automation Stats */}
            <BentoMetricCard
              title="Automations Run Today"
              value="247"
              trend="↑ 18% vs yesterday"
              trendPositive={true}
              icon={<Play className="w-5 h-5" />}
              color="var(--success)"
              size="medium"
            />

            {/* Time Saved */}
            <BentoMetricCard
              title="Time Saved"
              value="42h"
              trend="↑ 6h this week"
              trendPositive={true}
              icon={<Clock className="w-5 h-5" />}
              color="var(--accent)"
              size="medium"
            />

            {/* Knowledge Base */}
            <BentoCard
              title="Knowledge Base"
              icon={<BookOpen className="w-5 h-5" />}
              color="var(--accent)"
              size="large"
              large
            >
              <div className="space-y-4">
                {/* Search within knowledge */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                  <input
                    type="text"
                    placeholder="Search knowledge..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] focus:outline-none focus:border-[var(--accent)] transition-all text-sm"
                  />
                </div>

                {/* Popular articles */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                    Popular
                  </p>
                  {knowledgeArticles.map((article, index) => (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer"
                    >
                      {article.icon}
                      <span className="text-sm font-medium flex-1">
                        {article.title}
                      </span>
                      <span className="text-xs text-[var(--text-muted)]">
                        {article.views} views
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </BentoCard>

            {/* Recent Activities */}
            <BentoListCard
              title="Recent Activities"
              icon={<MessageSquare className="w-5 h-5" />}
              color="var(--accent)"
              size="tall"
              items={recentActivities}
            />

            {/* Efficiency Metrics */}
            <BentoMetricCard
              title="Efficiency Gain"
              value="+34%"
              trend="↑ 8% vs last month"
              trendPositive={true}
              icon={<TrendingUp className="w-5 h-5" />}
              color="var(--success)"
              size="medium"
            />

            {/* Create New */}
            <BentoActionCard
              title="Create New"
              description="Start a new workflow, knowledge article, or automation"
              buttonText="Create Something"
              onAction={() => console.log('Create new')}
              icon={<Plus className="w-5 h-5" />}
              color="var(--accent)"
              size="medium"
            />
          </BentoGrid>
        </motion.div>
      </div>
    </div>
  )
}

// Data
const quickActions = [
  {
    id: 'new-workflow',
    label: 'New Workflow',
    icon: <Workflow className="w-4 h-4" />,
    color: 'var(--accent)',
  },
  {
    id: 'new-article',
    label: 'New Article',
    icon: <BookOpen className="w-4 h-4" />,
    color: 'var(--success)',
  },
  {
    id: 'new-automation',
    label: 'New Automation',
    icon: <Zap className="w-4 h-4" />,
    color: 'var(--warning)',
  },
  {
    id: 'ask-ai',
    label: 'Ask AI',
    icon: <MessageSquare className="w-4 h-4" />,
    color: 'var(--accent)',
  },
]

const activeWorkflows = [
  {
    title: 'Onboarding Process',
    description: 'Running for 2h 34m',
    color: 'var(--success)',
  },
  {
    title: 'Invoice Processing',
    description: 'Running for 45m',
    color: 'var(--accent)',
  },
  {
    title: 'Customer Feedback Loop',
    description: 'Running for 1h 12m',
    color: 'var(--warning)',
  },
  {
    title: 'Report Generation',
    description: 'Running for 23m',
    color: 'var(--success)',
  },
]

const knowledgeArticles = [
  {
    id: 1,
    title: 'Getting Started with Workflows',
    views: 1240,
    icon: <BookOpen className="w-4 h-4 text-[var(--accent)]" />,
  },
  {
    id: 2,
    title: 'Automating Email Workflows',
    views: 892,
    icon: <Workflow className="w-4 h-4 text-[var(--accent)]" />,
  },
  {
    id: 3,
    title: 'Knowledge Base Best Practices',
    views: 756,
    icon: <BookOpen className="w-4 h-4 text-[var(--accent)]" />,
  },
  {
    id: 4,
    title: 'AI Integration Guide',
    views: 623,
    icon: <Zap className="w-4 h-4 text-[var(--accent)]" />,
  },
]

const recentActivities = [
  {
    title: 'Onboarding workflow completed',
    description: '5 min ago',
    color: 'var(--success)',
  },
  {
    title: 'New article added',
    description: '23 min ago',
    color: 'var(--accent)',
  },
  {
    title: 'Automation rule updated',
    description: '1 hour ago',
    color: 'var(--warning)',
  },
  {
    title: 'Knowledge search performed',
    description: '2 hours ago',
    color: 'var(--accent)',
  },
]
