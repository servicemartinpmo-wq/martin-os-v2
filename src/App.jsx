/**
 * Martin OS tri-native operating hub.
 */
'use client'

import AppShell from '@/features/shell/AppShell'
import { PageCard, PageHeader, PageSection, TileLink } from '@/components/page/PageChrome'
import { appSections } from '@/features/shell/appModel'
import { useMartinOs } from '@/context/MartinOsProvider'
import ExecutiveCommandDashboard from '@/components/executive/ExecutiveCommandDashboard'
import {
  getLayoutModeById,
  getThemePresetById,
  getUserModeById,
} from '@/lib/themePresetsV2'
import { usePmoOrgDashboardData } from '@/features/pmo/usePmoOrgDashboardData'
import { useTechOpsDashboardData } from '@/features/techops/useTechOpsDashboardData'
import { useMiiddleDashboardData } from '@/features/miiddle/useMiiddleDashboardData'

const DOMAIN_FROM_PLUGIN = {
  dashboard: 'PMO',
  'tech-ops': 'TECH_OPS',
  miidle: 'MIIDLE',
}

const DOMAIN_LABELS = {
  PMO: 'Planning',
  TECH_OPS: 'Support',
  MIIDLE: 'Studio',
}

function getModeHeadline(modeId) {
  switch (modeId) {
    case 'executive':
      return 'Board-ready operating picture'
    case 'creative':
      return 'Creative system with operational backbone'
    case 'admin_project':
      return 'Execution console for structured delivery'
    case 'healthcare':
      return 'Calm service layer with clear operational status'
    case 'startup':
      return 'Momentum board for launch and growth'
    case 'freelance':
      return 'Solo operator workspace with proof and delivery'
    default:
      return 'Operating system for founder-led execution'
  }
}

function getModeNarrative(modeId) {
  switch (modeId) {
    case 'executive':
      return 'Summaries, exceptions, and portfolio movement take priority. The shell should help you understand what matters without hunting through detail.'
    case 'creative':
      return 'Story, capture, artifacts, and proof-of-work move to the center. The shell should feel like a live studio, not a spreadsheet.'
    case 'admin_project':
      return 'Tasks, queues, and handoffs dominate the experience. The shell should privilege clarity, sequence, and accountability.'
    case 'healthcare':
      return 'Status clarity, comfort, and handoff readiness matter most. The shell should reduce strain while preserving operational visibility.'
    case 'startup':
      return 'Growth, launch, investor readiness, and product velocity shape the surface. The shell should feel energized and forward-moving.'
    case 'freelance':
      return 'Clients, deliverables, and proof become the organizing frame. The shell should feel lightweight, fast, and personal.'
    default:
      return 'Health, risk, revenue, throughput, and intervention cues stay visible across every domain so the owner can steer the whole system from one place.'
  }
}

function getWidgetLabel(widget) {
  return widget
    .replaceAll('-', ' ')
    .replace('org health', 'business health')
    .replace('decision queue', 'decisions to make')
    .replace('workflow health', 'automation health')
    .replace('top actions', 'next best actions')
    .replace('executive summary', 'top summary')
    .replace('portfolio overview', 'big picture')
    .replace('sla board', 'service targets')
    .replace('time boxes', 'schedule')
}

/**
 * @param {{
 *   activePlugin?: 'dashboard' | 'tech-ops' | 'miidle',
 *   onActivePluginChange?: (plugin: 'dashboard' | 'tech-ops' | 'miidle') => void,
 * }} props
 */
export default function App({ activePlugin = 'dashboard', onActivePluginChange }) {
  const {
    appView,
    layoutMode,
    userMode,
    reducedMotion,
    themePresetId,
    presetRecommendation,
  } = useMartinOs()
  const pmo = usePmoOrgDashboardData()
  const tech = useTechOpsDashboardData()
  const miiddle = useMiiddleDashboardData()

  const activeDomain = DOMAIN_FROM_PLUGIN[activePlugin] ?? appView
  const activeTheme = getThemePresetById(themePresetId)
  const activeLayout = getLayoutModeById(layoutMode)
  const activeMode = getUserModeById(userMode)

  const domainCards = [
    {
      id: 'dashboard',
      title: 'Planning',
      href: '/pmo-ops',
      subtitle: 'Goals, operational status, projects, and decisions in one place',
      metric: pmo.data.kpis[0]?.value ?? '—',
      detail: `${pmo.data.kpis[1]?.value ?? '0'} active priorities`,
      status: pmo.usingFallback ? 'Backup-ready' : 'Up to date',
    },
    {
      id: 'tech-ops',
      title: 'Support',
      href: '/tech-ops',
      subtitle: 'Health checks, automations, requests, and recent activity',
      metric: tech.data.kpis[2]?.value ?? '—',
      detail: `${tech.data.kpis[1]?.value ?? '0'} automation runs`,
      status: tech.usingFallback ? 'Backup-ready' : 'Up to date',
    },
    {
      id: 'miidle',
      title: 'Studio',
      href: '/miidle',
      subtitle: 'Capture work, build stories, and collect proof you can share',
      metric: miiddle.data.kpis[2]?.value ?? '—',
      detail: `${miiddle.data.kpis[0]?.value ?? '0'} captured moments`,
      status: miiddle.usingFallback ? 'Backup-ready' : 'Up to date',
    },
  ]

  const currentFocusItems =
    activeDomain === 'TECH_OPS'
      ? tech.data.kpis
      : activeDomain === 'MIIDLE'
        ? miiddle.data.kpis
        : pmo.data.kpis

  if (userMode === 'executive' && activePlugin === 'dashboard') {
    return (
      <AppShell activeHref="/">
        <ExecutiveCommandDashboard pmo={pmo} tech={tech} miiddle={miiddle} />
      </AppShell>
    )
  }

  return (
    <AppShell activeHref="/">
      <PageHeader
        kicker="Martin OS"
        title={getModeHeadline(userMode)}
        subtitle={getModeNarrative(userMode)}
      >
        <div className="mt-5 grid gap-3 md:grid-cols-4">
          <div className="mos-metric-strip">
            <p className="text-[11px] uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
              Active mode
            </p>
            <p className="mt-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              {activeMode?.label ?? userMode}
            </p>
          </div>
          <div className="mos-metric-strip">
            <p className="text-[11px] uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
              Active look
            </p>
            <p className="mt-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              {activeTheme?.label ?? themePresetId}
            </p>
          </div>
          <div className="mos-metric-strip">
            <p className="text-[11px] uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
              Page style
            </p>
            <p className="mt-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              {activeLayout?.label ?? layoutMode}
            </p>
          </div>
          <div className="mos-metric-strip">
            <p className="text-[11px] uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
              Suggested look
            </p>
            <p className="mt-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              {getThemePresetById(presetRecommendation.recommendedPresetId)?.label ?? 'Recommended look'}
              {reducedMotion ? ' · reduced motion' : ''}
            </p>
          </div>
        </div>
      </PageHeader>

      <section className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <PageSection title="Open a workspace">
          <div className="grid gap-4 lg:grid-cols-3">
            {domainCards.map((card) => {
              const active = card.id === activePlugin
              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => onActivePluginChange?.(/** @type {'dashboard' | 'tech-ops' | 'miidle'} */ (card.id))}
                  className="glass-panel p-5 text-left transition-transform hover:-translate-y-0.5"
                  style={{
                    borderColor: active ? 'var(--accent)' : 'var(--border-subtle)',
                    background: active ? 'var(--accent-muted)' : undefined,
                  }}
                >
                  <p className="text-xs uppercase tracking-[0.2em]" style={{ color: 'var(--text-muted)' }}>
                    {card.status}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                    {card.subtitle}
                  </p>
                  <div className="mt-5 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {card.metric}
                      </p>
                      <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                        {card.detail}
                      </p>
                    </div>
                    <span className="mos-chip">{DOMAIN_LABELS[activeDomain] === card.title ? 'In focus' : 'Open'}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </PageSection>

        <PageCard title="What matters most right now" subtitle="This work style changes what the app keeps in focus">
          <div className="space-y-3">
            {activeMode?.priorityWidgets.map((widget) => (
              <div key={widget} className="mos-surface-deep p-4">
                <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                  Focus area
                </p>
                <p className="mt-1 text-sm font-semibold capitalize" style={{ color: 'var(--text-primary)' }}>
                  {getWidgetLabel(widget)}
                </p>
              </div>
            ))}
          </div>
        </PageCard>
      </section>

      <section className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <PageCard title={`Current ${DOMAIN_LABELS[activeDomain]} focus`} subtitle="Quick summary">
          <div className="space-y-3">
            {currentFocusItems.map((kpi) => (
              <div key={kpi.label} className="mos-surface-deep p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                      {kpi.label}
                    </p>
                    <p className="mt-1 text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {kpi.value}
                    </p>
                  </div>
                  <p className="max-w-[14rem] text-right text-xs" style={{ color: 'var(--text-muted)' }}>
                    {kpi.hint}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </PageCard>

        <PageCard title="Open pages" subtitle="Jump into the areas you use most">
          <div className="grid gap-3">
            <TileLink href="/pmo-ops">Open Planning</TileLink>
            <TileLink href="/tech-ops">Open Support</TileLink>
            <TileLink href="/miidle">Open Studio</TileLink>
            <TileLink href="/settings">Open Preferences</TileLink>
          </div>
          <div className="mt-5 grid gap-3">
            {appSections.map((section) => (
              <div key={section.id} className="mos-surface-deep p-4">
                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {section.title}
                </p>
                <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                  {section.summary}
                </p>
              </div>
            ))}
          </div>
        </PageCard>
      </section>
    </AppShell>
  )
}
