/**
 * Martin OS tri-native home.
 * Mounted from the App Router (`app/TriNativeHome.jsx`) and aligned with the
 * same provider-driven shell used by the domain routes.
 */
'use client'

import AppShell from '@/features/shell/AppShell'
import { PageCard, PageHeader, PageSection, TileLink } from '@/components/page/PageChrome'
import { appSections, sourceOfTruth } from '@/features/shell/appModel'
import { useMartinOs } from '@/context/MartinOsProvider'
import {
  getLayoutModeById,
  getThemePresetById,
} from '@/lib/themePresetsV2'
import { usePmoOrgDashboardData } from '@/features/pmo/usePmoOrgDashboardData'
import { useTechOpsDashboardData } from '@/features/techops/useTechOpsDashboardData'
import { useMiiddleDashboardData } from '@/features/miiddle/useMiiddleDashboardData'

const DOMAIN_FROM_PLUGIN = {
  dashboard: 'PMO',
  'tech-ops': 'TECH_OPS',
  miidle: 'MIIDLE',
}

const PLUGIN_LABELS = {
  dashboard: 'PMO Command',
  'tech-ops': 'Tech-Ops HUD',
  miidle: 'Miiddle Workspace',
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
    operatingMode,
    reducedMotion,
    themePresetId,
  } = useMartinOs()
  const pmo = usePmoOrgDashboardData()
  const tech = useTechOpsDashboardData()
  const miiddle = useMiiddleDashboardData()

  const activeDomain = DOMAIN_FROM_PLUGIN[activePlugin] ?? appView
  const activeTheme = getThemePresetById(themePresetId)
  const activeLayout = getLayoutModeById(layoutMode)

  const crossAppCards = [
    {
      id: 'dashboard',
      title: 'PMO command',
      subtitle: 'Strategy, governance, finance, and execution',
      href: '/pmo-ops',
      metric: pmo.kpis[0]?.value ?? '—',
      detail: `${pmo.kpis[1]?.value ?? '0'} active initiatives`,
      status: pmo.usingFallback ? 'Fallback-ready' : 'Live',
      accent: 'var(--accent)',
    },
    {
      id: 'tech-ops',
      title: 'Tech-Ops HUD',
      subtitle: 'Diagnostics, workflows, logs, and reliability',
      href: '/tech-ops',
      metric: tech.data.kpis[2]?.value ?? '—',
      detail: `${tech.data.kpis[1]?.value ?? '0'} workflow runs`,
      status: tech.usingFallback ? 'Fallback-ready' : 'Live',
      accent: 'var(--info)',
    },
    {
      id: 'miidle',
      title: 'Miiddle workspace',
      subtitle: 'Capture, proof-of-work, and story generation',
      href: '/miidle',
      metric: miiddle.data.kpis[2]?.value ?? '—',
      detail: `${miiddle.data.kpis[0]?.value ?? '0'} capture events`,
      status: miiddle.usingFallback ? 'Fallback-ready' : 'Live',
      accent: 'var(--success)',
    },
  ]

  return (
    <AppShell activeHref="/">
      <PageHeader
        kicker="Martin OS"
        title="Tri-native command environment"
        subtitle="PMO-Ops, Tech-Ops, and Miiddle now share one provider-driven shell, one preset library, and Supabase-first dashboard contracts."
      >
        <div className="mt-5 grid gap-3 md:grid-cols-4">
          <div className="mos-metric-strip">
            <p className="text-[11px] uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
              Active perspective
            </p>
            <p className="mt-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              {PLUGIN_LABELS[activePlugin] ?? PLUGIN_LABELS.dashboard}
            </p>
          </div>
          <div className="mos-metric-strip">
            <p className="text-[11px] uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
              Theme preset
            </p>
            <p className="mt-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              {activeTheme?.label ?? themePresetId}
            </p>
          </div>
          <div className="mos-metric-strip">
            <p className="text-[11px] uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
              Layout mode
            </p>
            <p className="mt-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              {activeLayout?.label ?? layoutMode}
            </p>
          </div>
          <div className="mos-metric-strip">
            <p className="text-[11px] uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
              Operating mode
            </p>
            <p className="mt-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              {operatingMode}
              {reducedMotion ? ' · reduced motion' : ''}
            </p>
          </div>
        </div>
      </PageHeader>

      <PageSection title="Choose your current focus">
        <div className="grid gap-4 lg:grid-cols-3">
          {crossAppCards.map((card) => {
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
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em]" style={{ color: 'var(--text-muted)' }}>
                      {card.status}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {card.title}
                    </h3>
                    <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                      {card.subtitle}
                    </p>
                  </div>
                  <span
                    className="rounded-full px-3 py-1 text-xs font-semibold"
                    style={{
                      background: 'color-mix(in oklab, var(--surface-elevated) 70%, transparent)',
                      color: card.accent,
                    }}
                  >
                    {card.metric}
                  </span>
                </div>
                <p className="mt-4 text-sm" style={{ color: 'var(--text-primary)' }}>
                  {card.detail}
                </p>
                <p className="mt-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                  Open {card.title.toLowerCase()} in the shared shell or stay on this route and change perspective with one click.
                </p>
              </button>
            )
          })}
        </div>
      </PageSection>

      <section className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,0.9fr)]">
        <PageCard title="Current focus summary" subtitle="What matters most right now">
          {activeDomain === 'TECH_OPS' ? (
            <div className="space-y-3">
              {tech.data.kpis.map((kpi) => (
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
          ) : activeDomain === 'MIIDLE' ? (
            <div className="space-y-3">
              {miiddle.data.kpis.map((kpi) => (
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
          ) : (
            <div className="space-y-3">
              {pmo.kpis.map((kpi) => (
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
          )}
        </PageCard>

        <PageCard title="Launch surfaces" subtitle="Primary routes in the production shell">
          <div className="grid gap-3">
            <TileLink href="/pmo-ops">Open PMO command center</TileLink>
            <TileLink href="/tech-ops">Open Tech-Ops HUD</TileLink>
            <TileLink href="/miidle">Open Miiddle workspace</TileLink>
            <TileLink href="/settings">Open Settings control plane</TileLink>
          </div>
          <div className="mt-5 space-y-3">
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

      <PageSection title="Cross-app brief">
        <div className="grid gap-4 lg:grid-cols-3">
          <PageCard title="PMO signal">
            <p className="text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              {pmo.orgHealth}/100
            </p>
            <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
              Org health composite with {pmo.data.atRisk} at-risk initiatives requiring operator attention.
            </p>
          </PageCard>
          <PageCard title="Tech-Ops signal">
            <p className="text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              {tech.data.unhealthyConnectors}
            </p>
            <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
              Connectors degraded across live reliability monitoring and workflow traces.
            </p>
          </PageCard>
          <PageCard title="Miiddle signal">
            <p className="text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              {miiddle.data.publishedArtifacts}
            </p>
            <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
              Publish-ready artifacts waiting to become stakeholder-ready proof-of-work.
            </p>
          </PageCard>
        </div>
      </PageSection>

      <PageSection title="Source-of-truth contracts">
        <div className="grid gap-4 lg:grid-cols-3">
          {Object.entries(sourceOfTruth).map(([key, value]) => (
            <PageCard key={key} title={key}>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {value}
              </p>
            </PageCard>
          ))}
        </div>
      </PageSection>
    </AppShell>
  )
}
