'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Accessibility,
  Layout,
  Moon,
  Palette,
  RefreshCw,
  Sparkles,
  Sun,
  Zap,
} from 'lucide-react'
import AppShell from '@/features/shell/AppShell'
import { PageCard, PageHeader, PageSection } from '@/components/page/PageChrome'
import { useMartinOs } from '@/context/MartinOsProvider'
import {
  getLayoutModeById,
  getThemePresetById,
  LAYOUT_MODES,
  THEME_PRESETS_V2,
} from '@/lib/themePresetsV2'
import { DOMAIN_DASHBOARDS } from '@/lib/domainDashboards'
import { INDUSTRIES } from '@/lib/industryMatrix'
import { cn } from '@/lib/cn'

const OPERATING_MODES = [
  {
    id: 'project',
    label: 'Project',
    description: 'Dense command UI for operators working across active queues.',
  },
  {
    id: 'creative',
    label: 'Creative',
    description: 'Editorial rhythm for storytelling, visuals, and asymmetric composition.',
  },
  {
    id: 'founder',
    label: 'Founder',
    description: 'Executive view with health, risk, and high-priority intervention framing.',
  },
  {
    id: 'assisted',
    label: 'Assisted',
    description: 'Simplified navigation, larger targets, and lower-friction interaction.',
  },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('appearance')
  const {
    appView,
    themePresetId,
    layoutMode,
    operatingMode,
    industryId,
    reducedMotion,
    applyPerspective,
    setIndustryId,
    setLayoutMode,
    setOperatingMode,
    setReducedMotion,
    setThemePresetId,
  } = useMartinOs()

  const selectedTheme = getThemePresetById(themePresetId)
  const selectedLayout = getLayoutModeById(layoutMode)

  return (
    <AppShell activeHref="/settings">
      <div className="mx-auto min-h-screen max-w-[1500px]">
        <PageHeader
          kicker="Settings"
          title="Control plane"
          subtitle="Manage preset skinning, route-aware layout defaults, operating mode, and accessibility from one provider-backed interface."
        >
          <div className="mt-5 flex flex-wrap gap-2">
            {[
              { id: 'appearance', label: 'Appearance', icon: Palette },
              { id: 'behavior', label: 'Behavior', icon: Sparkles },
              { id: 'accessibility', label: 'Accessibility', icon: Accessibility },
            ].map((tab) => {
              const Icon = tab.icon
              const active = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn('mos-chip', active && 'mos-chip-active')}
                >
                  <span className="inline-flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </span>
                </button>
              )
            })}
            <button
              type="button"
              onClick={() => applyPerspective(appView)}
              className="mos-chip"
            >
              <span className="inline-flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Reset current route defaults
              </span>
            </button>
          </div>
        </PageHeader>

        {activeTab === 'appearance' ? (
          <div className="mt-6 space-y-6">
            <PageSection title="Curated preset library">
              <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                {THEME_PRESETS_V2.map((theme) => {
                  const active = theme.id === themePresetId
                  return (
                    <motion.button
                      key={theme.id}
                      type="button"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setThemePresetId(theme.id, { userInitiated: true })}
                      className="glass-panel p-5 text-left"
                      style={{
                        borderColor: active ? 'var(--accent)' : 'var(--border-subtle)',
                        background: active ? 'var(--accent-muted)' : undefined,
                      }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs uppercase tracking-[0.2em]" style={{ color: 'var(--text-muted)' }}>
                            {theme.layoutMode.replace('_', ' ')}
                          </p>
                          <h2 className="mt-2 text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                            {theme.label}
                          </h2>
                          <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                            {theme.description}
                          </p>
                        </div>
                        {theme.category === 'dark' ? (
                          <Moon className="h-5 w-5" />
                        ) : (
                          <Sun className="h-5 w-5" />
                        )}
                      </div>

                      <div className="mt-4 grid grid-cols-4 gap-2">
                        {[
                          theme.preview.background,
                          theme.preview.surface,
                          theme.preview.accent,
                          theme.preview.text,
                        ].map((swatch) => (
                          <div
                            key={swatch}
                            className="aspect-square rounded-xl border"
                            style={{
                              background: swatch,
                              borderColor: 'var(--border-subtle)',
                            }}
                          />
                        ))}
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {theme.features.map((feature) => (
                          <span
                            key={feature}
                            className="rounded-full px-2 py-1 text-[11px]"
                            style={{
                              background: 'color-mix(in oklab, var(--surface-elevated) 70%, transparent)',
                              color: 'var(--text-muted)',
                            }}
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </PageSection>

            <PageSection title="Layout mode">
              <div className="grid gap-4 lg:grid-cols-3">
                {LAYOUT_MODES.map((mode) => {
                  const active = mode.id === layoutMode
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setLayoutMode(mode.id, { userInitiated: true })}
                      className="glass-panel p-5 text-left"
                      style={{
                        borderColor: active ? 'var(--accent)' : 'var(--border-subtle)',
                        background: active ? 'var(--accent-muted)' : undefined,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="rounded-xl p-3"
                          style={{ background: 'color-mix(in oklab, var(--surface-elevated) 75%, transparent)' }}
                        >
                          <Layout className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                            {mode.label}
                          </p>
                          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                            {mode.description}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {mode.features.map((feature) => (
                          <span key={feature} className="mos-chip">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </button>
                  )
                })}
              </div>
            </PageSection>

            <PageSection title="Current provider state">
              <div className="grid gap-4 md:grid-cols-4">
                {[
                  { label: 'App view', value: appView },
                  { label: 'Theme', value: selectedTheme?.label ?? themePresetId },
                  { label: 'Layout', value: selectedLayout?.label ?? layoutMode },
                  { label: 'Operating mode', value: operatingMode },
                ].map((item) => (
                  <div key={item.label} className="mos-metric-strip">
                    <p className="text-[11px] uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                      {item.label}
                    </p>
                    <p className="mt-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </PageSection>
          </div>
        ) : null}

        {activeTab === 'behavior' ? (
          <div className="mt-6 space-y-6">
            <PageSection title="Industry defaults">
              <div className="grid gap-4 lg:grid-cols-3">
                {INDUSTRIES.map((industry) => {
                  const active = industry.id === industryId
                  return (
                    <button
                      key={industry.id}
                      type="button"
                      onClick={() => setIndustryId(industry.id)}
                      className="glass-panel p-5 text-left"
                      style={{
                        borderColor: active ? 'var(--accent)' : 'var(--border-subtle)',
                        background: active ? 'var(--accent-muted)' : undefined,
                      }}
                    >
                      <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {industry.label}
                      </p>
                      <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                        {industry.plusEmphasis}
                      </p>
                      <p className="mt-4 text-xs uppercase tracking-wide" style={{ color: 'var(--accent)' }}>
                        Default mode: {industry.defaultOperatingMode}
                      </p>
                    </button>
                  )
                })}
              </div>
            </PageSection>

            <PageSection title="Operating mode">
              <div className="grid gap-4 lg:grid-cols-2">
                {OPERATING_MODES.map((mode) => {
                  const active = mode.id === operatingMode
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() =>
                        setOperatingMode(
                          /** @type {'project' | 'creative' | 'founder' | 'assisted'} */ (mode.id),
                        )
                      }
                      className="glass-panel p-5 text-left"
                      style={{
                        borderColor: active ? 'var(--accent)' : 'var(--border-subtle)',
                        background: active ? 'var(--accent-muted)' : undefined,
                      }}
                    >
                      <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {mode.label}
                      </p>
                      <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                        {mode.description}
                      </p>
                    </button>
                  )
                })}
              </div>
            </PageSection>

            <PageSection title="Route-aware recommendations">
              <div className="grid gap-4 lg:grid-cols-3">
                {Object.values(DOMAIN_DASHBOARDS).map((domain) => (
                  <PageCard key={domain.id} title={domain.name}>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      {domain.description}
                    </p>
                    <div className="mt-4 grid gap-2">
                      <div className="mos-surface-deep p-3">
                        <p className="text-[11px] uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                          Default preset
                        </p>
                        <p className="mt-1 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {getThemePresetById(domain.defaultTheme)?.label ?? domain.defaultTheme}
                        </p>
                      </div>
                      <div className="mos-surface-deep p-3">
                        <p className="text-[11px] uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                          Default layout
                        </p>
                        <p className="mt-1 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {getLayoutModeById(domain.defaultLayout)?.label ?? domain.defaultLayout}
                        </p>
                      </div>
                    </div>
                  </PageCard>
                ))}
              </div>
            </PageSection>
          </div>
        ) : null}

        {activeTab === 'accessibility' ? (
          <div className="mt-6 space-y-6">
            <PageSection title="Motion and readability">
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)]">
                <div className="glass-panel p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                        Reduced motion
                      </p>
                      <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                        Simplifies animations and keeps the experience comfortable for sensitive users and long sessions.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setReducedMotion(!reducedMotion)}
                      className="relative h-8 w-14 rounded-full"
                      style={{
                        background: reducedMotion ? 'var(--accent)' : 'var(--surface-elevated)',
                      }}
                    >
                      <motion.span
                        className="absolute top-1 h-6 w-6 rounded-full bg-white"
                        animate={{ x: reducedMotion ? 30 : 4 }}
                        transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                      />
                    </button>
                  </div>
                </div>

                <div className="glass-panel p-5">
                  <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Accessibility guidance
                  </p>
                  <div className="mt-4 space-y-3">
                    {[
                      'Choose Assist High Contrast for the most legible preset.',
                      'Use Assisted mode for larger targets and simplified navigation.',
                      'Reset route defaults any time if a custom theme/layout stops matching the current surface.',
                    ].map((tip) => (
                      <div key={tip} className="mos-surface-deep p-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                        {tip}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </PageSection>

            <PageSection title="Recommended combinations">
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  {
                    title: 'Executive command',
                    icon: Palette,
                    body: 'PMO Command + Sidebar Admin + Founder mode',
                  },
                  {
                    title: 'Operations floor',
                    icon: Zap,
                    body: 'Tech-Ops HUD + HUD layout + Project mode',
                  },
                  {
                    title: 'Creative proof-of-work',
                    icon: Sparkles,
                    body: 'Miiddle Workspace + Bento layout + Creative mode',
                  },
                ].map((item) => {
                  const Icon = item.icon
                  return (
                    <PageCard key={item.title} title={item.title}>
                      <div className="inline-flex rounded-xl p-3" style={{ background: 'var(--accent-muted)' }}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <p className="mt-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                        {item.body}
                      </p>
                    </PageCard>
                  )
                })}
              </div>
            </PageSection>
          </div>
        ) : null}
      </div>
    </AppShell>
  )
}
