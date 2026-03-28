'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Accessibility,
  BadgePlus,
  Compass,
  Layout,
  Palette,
  RefreshCw,
  Sparkles,
} from 'lucide-react'
import AppShell from '@/features/shell/AppShell'
import { PageCard, PageHeader, PageSection } from '@/components/page/PageChrome'
import { useMartinOs } from '@/context/MartinOsProvider'
import { cn } from '@/lib/cn'
import { INDUSTRIES } from '@/lib/industryMatrix'
import {
  DEFAULT_BRAND_PROFILE,
  getLayoutModeById,
  getThemePresetById,
  getUserModeById,
  LAYOUT_MODES,
  THEME_PRESETS_V2,
  USER_MODES,
} from '@/lib/themePresetsV2'

const TABS = [
  { id: 'mode', label: 'Modes', icon: Compass },
  { id: 'library', label: 'Preset Library', icon: Palette },
  { id: 'intake', label: 'Brand Intake', icon: BadgePlus },
  { id: 'behavior', label: 'Behavior', icon: Layout },
  { id: 'accessibility', label: 'Accessibility', icon: Accessibility },
]

const TONE_OPTIONS = ['command', 'briefing', 'editorial', 'structured', 'calm', 'energetic', 'personal']
const COLOR_OPTIONS = ['blue', 'cyan', 'green', 'teal', 'purple', 'pink', 'orange', 'yellow', 'peach', 'slate']
const DENSITY_OPTIONS = ['high', 'balanced', 'comfortable']

function TokenPreview({ preset, active, onSelect }) {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onSelect}
      className="glass-panel p-5 text-left"
      style={{
        borderColor: active ? 'var(--accent)' : 'var(--border-subtle)',
        background: active ? 'var(--accent-muted)' : undefined,
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em]" style={{ color: 'var(--text-muted)' }}>
            {preset.kind} · {preset.layoutMode.replaceAll('_', ' ')}
          </p>
          <h3 className="mt-2 text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            {preset.label}
          </h3>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
            {preset.description}
          </p>
        </div>
        <span className="mos-chip">{preset.supportedModes.length} modes</span>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2">
        {[preset.preview.background, preset.preview.surface, preset.preview.accent, preset.preview.text].map((swatch) => (
          <div
            key={swatch}
            className="aspect-square rounded-xl border"
            style={{ background: swatch, borderColor: 'var(--border-subtle)' }}
          />
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {preset.features.map((feature) => (
          <span key={feature} className="mos-chip">
            {feature}
          </span>
        ))}
      </div>
    </motion.button>
  )
}

function FieldLabel({ title, body }) {
  return (
    <div className="mb-2">
      <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
        {title}
      </p>
      <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
        {body}
      </p>
    </div>
  )
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('mode')
  const {
    appView,
    userMode,
    themePresetId,
    layoutMode,
    industryId,
    brandProfile,
    reducedMotion,
    overrideFlags,
    presetRecommendation,
    applyPerspective,
    clearOverrideLocks,
    resetToModeDefaults,
    setBrandProfile,
    setIndustryId,
    setLayoutMode,
    setReducedMotion,
    setThemePresetId,
    setUserMode,
  } = useMartinOs()

  const activeMode = getUserModeById(userMode)
  const activeTheme = getThemePresetById(themePresetId)
  const activeLayout = getLayoutModeById(layoutMode)
  const recommendedPreset = getThemePresetById(presetRecommendation.recommendedPresetId)
  const libraryPresets = useMemo(
    () => THEME_PRESETS_V2.filter((preset) => preset.kind === 'library'),
    [],
  )

  const mergedBrandProfile = { ...DEFAULT_BRAND_PROFILE, ...brandProfile, industry: industryId }

  return (
    <AppShell activeHref="/settings">
      <div className="mx-auto min-h-screen max-w-[1540px]">
        <PageHeader
          kicker="Settings"
          title="Experience control plane"
          subtitle="Control the active user mode, choose or pin an experience kit, edit brand intake, and let Martin OS reshape each domain around the way you work."
        >
          <div className="mt-5 flex flex-wrap gap-2">
            {TABS.map((tab) => {
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
            <button type="button" onClick={() => resetToModeDefaults()} className="mos-chip">
              <span className="inline-flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Reset to mode defaults
              </span>
            </button>
            <button type="button" onClick={clearOverrideLocks} className="mos-chip">
              Clear pinned overrides
            </button>
            <button type="button" onClick={() => applyPerspective(appView)} className="mos-chip">
              Reset current route defaults
            </button>
          </div>
        </PageHeader>

        <section className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <PageSection title="Active experience">
            <div className="grid gap-4 md:grid-cols-4">
              {[
                { label: 'App view', value: appView },
                { label: 'User mode', value: activeMode?.label ?? userMode },
                { label: 'Preset', value: activeTheme?.label ?? themePresetId },
                { label: 'Layout', value: activeLayout?.label ?? layoutMode },
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
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="mos-surface-deep p-4 text-sm" style={{ color: 'var(--text-muted)' }}>
                Mode override: <span style={{ color: 'var(--text-primary)' }}>{overrideFlags.mode ? 'Pinned' : 'Auto from profile'}</span>
              </div>
              <div className="mos-surface-deep p-4 text-sm" style={{ color: 'var(--text-muted)' }}>
                Preset override: <span style={{ color: 'var(--text-primary)' }}>{overrideFlags.theme ? 'Pinned' : 'Recommended'}</span>
              </div>
              <div className="mos-surface-deep p-4 text-sm" style={{ color: 'var(--text-muted)' }}>
                Layout override: <span style={{ color: 'var(--text-primary)' }}>{overrideFlags.layout ? 'Pinned' : 'Mode default'}</span>
              </div>
            </div>
          </PageSection>

          <PageCard title="Recommended kit" subtitle="Rules-first recommendation from your intake profile">
            <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--border-subtle)' }}>
              <p className="text-xs uppercase tracking-[0.2em]" style={{ color: 'var(--text-muted)' }}>
                Recommended preset
              </p>
              <h3 className="mt-2 text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                {recommendedPreset?.label ?? presetRecommendation.recommendedPresetId}
              </h3>
              <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                {recommendedPreset?.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {presetRecommendation.reasons.map((reason) => (
                  <span key={reason} className="mos-chip">
                    {reason}
                  </span>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setThemePresetId(presetRecommendation.recommendedPresetId, { userInitiated: true })}
                className="mt-4 rounded-xl px-4 py-2 text-sm font-semibold"
                style={{ background: 'var(--accent)', color: 'var(--text-on-accent)' }}
              >
                Apply recommended kit
              </button>
            </div>
          </PageCard>
        </section>

        {activeTab === 'mode' ? (
          <div className="mt-6 space-y-6">
            <PageSection title="Core user modes">
              <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                {USER_MODES.map((mode) => {
                  const active = mode.id === userMode
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setUserMode(mode.id, { userInitiated: true, resetTheme: true, resetLayout: true })}
                      className="glass-panel p-5 text-left"
                      style={{
                        borderColor: active ? 'var(--accent)' : 'var(--border-subtle)',
                        background: active ? 'var(--accent-muted)' : undefined,
                      }}
                    >
                      <p className="text-xs uppercase tracking-[0.2em]" style={{ color: 'var(--text-muted)' }}>
                        {mode.tone} · {mode.density}
                      </p>
                      <h2 className="mt-2 text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {mode.label}
                      </h2>
                      <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                        {mode.description}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {mode.workflowEmphasis.map((item) => (
                          <span key={item} className="mos-chip">
                            {item}
                          </span>
                        ))}
                      </div>
                    </button>
                  )
                })}
              </div>
            </PageSection>

            <PageSection title="Route-aware mode defaults">
              <div className="grid gap-4 md:grid-cols-3">
                {Object.entries(activeMode?.defaultForAppViews ?? {}).map(([view, defaults]) => (
                  <div key={view} className="mos-surface-deep p-4">
                    <p className="text-[11px] uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                      {view}
                    </p>
                    <p className="mt-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {getThemePresetById(defaults.themePresetId)?.label ?? defaults.themePresetId}
                    </p>
                    <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                      {getLayoutModeById(defaults.layoutMode)?.label ?? defaults.layoutMode}
                    </p>
                  </div>
                ))}
              </div>
            </PageSection>
          </div>
        ) : null}

        {activeTab === 'library' ? (
          <div className="mt-6 space-y-6">
            <PageSection title="Core presets">
              <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                {THEME_PRESETS_V2.filter((preset) => preset.kind === 'core').map((preset) => (
                  <TokenPreview
                    key={preset.id}
                    preset={preset}
                    active={preset.id === themePresetId}
                    onSelect={() => setThemePresetId(preset.id, { userInitiated: true })}
                  />
                ))}
              </div>
            </PageSection>

            <PageSection title="Optional plug-and-deploy kits">
              <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                {libraryPresets.map((preset) => (
                  <TokenPreview
                    key={preset.id}
                    preset={preset}
                    active={preset.id === themePresetId}
                    onSelect={() => setThemePresetId(preset.id, { userInitiated: true })}
                  />
                ))}
              </div>
            </PageSection>
          </div>
        ) : null}

        {activeTab === 'intake' ? (
          <div className="mt-6 space-y-6">
            <PageSection title="Brand and intake profile">
              <div className="grid gap-5 lg:grid-cols-2">
                <div>
                  <FieldLabel title="Industry" body="Used for default mode, preset scoring, and route composition hints." />
                  <select
                    value={industryId}
                    onChange={(event) => setIndustryId(event.target.value)}
                    className="w-full rounded-2xl border px-4 py-3"
                    style={{
                      borderColor: 'var(--border-subtle)',
                      background: 'var(--surface-elevated)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {INDUSTRIES.map((industry) => (
                      <option key={industry.id} value={industry.id}>
                        {industry.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <FieldLabel title="Audience" body="Who the product is for; influences voice and display emphasis." />
                  <input
                    value={mergedBrandProfile.audience}
                    onChange={(event) => setBrandProfile({ audience: event.target.value })}
                    className="w-full rounded-2xl border px-4 py-3"
                    style={{
                      borderColor: 'var(--border-subtle)',
                      background: 'var(--surface-elevated)',
                      color: 'var(--text-primary)',
                    }}
                    placeholder="Founders, operators, clients, patients, creators..."
                  />
                </div>

                <div className="lg:col-span-2">
                  <FieldLabel title="Mission" body="Used to inform recommended themes and route messaging." />
                  <textarea
                    value={mergedBrandProfile.mission}
                    onChange={(event) => setBrandProfile({ mission: event.target.value })}
                    rows={4}
                    className="w-full rounded-2xl border px-4 py-3"
                    style={{
                      borderColor: 'var(--border-subtle)',
                      background: 'var(--surface-elevated)',
                      color: 'var(--text-primary)',
                    }}
                    placeholder="Describe what the company exists to do."
                  />
                </div>

                <div className="lg:col-span-2">
                  <FieldLabel title="Vision" body="Used to bias the system toward calm, energetic, narrative, or command-heavy kits." />
                  <textarea
                    value={mergedBrandProfile.vision}
                    onChange={(event) => setBrandProfile({ vision: event.target.value })}
                    rows={4}
                    className="w-full rounded-2xl border px-4 py-3"
                    style={{
                      borderColor: 'var(--border-subtle)',
                      background: 'var(--surface-elevated)',
                      color: 'var(--text-primary)',
                    }}
                    placeholder="Describe the future state the app should communicate."
                  />
                </div>

                <div>
                  <FieldLabel title="Logo URL" body="Stored as part of the intake profile for future branding and shell personalization." />
                  <input
                    value={mergedBrandProfile.logoUrl}
                    onChange={(event) => setBrandProfile({ logoUrl: event.target.value })}
                    className="w-full rounded-2xl border px-4 py-3"
                    style={{
                      borderColor: 'var(--border-subtle)',
                      background: 'var(--surface-elevated)',
                      color: 'var(--text-primary)',
                    }}
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <FieldLabel title="Brand keywords" body="Comma-separated traits like resilient, clinical, premium, creator-led, bold." />
                  <input
                    value={mergedBrandProfile.brandKeywords}
                    onChange={(event) => setBrandProfile({ brandKeywords: event.target.value })}
                    className="w-full rounded-2xl border px-4 py-3"
                    style={{
                      borderColor: 'var(--border-subtle)',
                      background: 'var(--surface-elevated)',
                      color: 'var(--text-primary)',
                    }}
                    placeholder="clinical, trustworthy, premium..."
                  />
                </div>

                <div>
                  <FieldLabel title="Tone bias" body="Feeds the deterministic recommendation engine." />
                  <select
                    value={mergedBrandProfile.tone}
                    onChange={(event) => setBrandProfile({ tone: event.target.value })}
                    className="w-full rounded-2xl border px-4 py-3"
                    style={{
                      borderColor: 'var(--border-subtle)',
                      background: 'var(--surface-elevated)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {TONE_OPTIONS.map((tone) => (
                      <option key={tone} value={tone}>
                        {tone}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <FieldLabel title="Color bias" body="Used to choose recommended kits and future accent overrides." />
                  <select
                    value={mergedBrandProfile.colorBias}
                    onChange={(event) => setBrandProfile({ colorBias: event.target.value })}
                    className="w-full rounded-2xl border px-4 py-3"
                    style={{
                      borderColor: 'var(--border-subtle)',
                      background: 'var(--surface-elevated)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {COLOR_OPTIONS.map((tone) => (
                      <option key={tone} value={tone}>
                        {tone}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <FieldLabel title="Density preference" body="Biases the system toward dense command surfaces or calmer reading modes." />
                  <select
                    value={mergedBrandProfile.densityPreference}
                    onChange={(event) => setBrandProfile({ densityPreference: event.target.value })}
                    className="w-full rounded-2xl border px-4 py-3"
                    style={{
                      borderColor: 'var(--border-subtle)',
                      background: 'var(--surface-elevated)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {DENSITY_OPTIONS.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </PageSection>

            <PageSection title="Recommendation trace">
              <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                <PageCard title="Why this kit" subtitle="Top recommendation drivers">
                  <div className="space-y-3">
                    {presetRecommendation.reasons.map((reason) => (
                      <div key={reason} className="mos-surface-deep p-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                        {reason}
                      </div>
                    ))}
                  </div>
                </PageCard>

                <PageCard title="Ranked preset candidates" subtitle="Scored library output">
                  <div className="grid gap-3 md:grid-cols-2">
                    {presetRecommendation.rankedPresetIds.slice(0, 6).map((id, index) => (
                      <div key={id} className="mos-surface-deep p-4">
                        <p className="text-[11px] uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                          Rank {index + 1}
                        </p>
                        <p className="mt-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {getThemePresetById(id)?.label ?? id}
                        </p>
                      </div>
                    ))}
                  </div>
                </PageCard>
              </div>
            </PageSection>
          </div>
        ) : null}

        {activeTab === 'behavior' ? (
          <div className="mt-6 space-y-6">
            <PageSection title="Layout archetypes">
              <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
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
                      <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {mode.label}
                      </p>
                      <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                        {mode.description}
                      </p>
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

            <PageSection title="Mode-to-route guidance">
              <div className="grid gap-4 lg:grid-cols-3">
                {[
                  {
                    title: 'PMO-Ops',
                    body: 'Structured planning, business health, decision cadence, initiative control, and executive intervention surfaces.',
                  },
                  {
                    title: 'Tech-Ops',
                    body: 'Diagnostics, workflow automations, logs, SLA posture, and connector reliability viewed through your chosen mode.',
                  },
                  {
                    title: 'Miiddle',
                    body: 'Capture streams, proof-of-work artifacts, story jobs, and templates rendered with mode-aware composition.',
                  },
                ].map((card) => (
                  <PageCard key={card.title} title={card.title}>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      {card.body}
                    </p>
                  </PageCard>
                ))}
              </div>
            </PageSection>
          </div>
        ) : null}

        {activeTab === 'accessibility' ? (
          <div className="mt-6 space-y-6">
            <PageSection title="Motion and comfort">
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)]">
                <div className="glass-panel p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                        Reduced motion
                      </p>
                      <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                        Simplifies transitions across every layout archetype while keeping the rest of the mode system intact.
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
                      'Care Soft and Freelance Studio are the calmest visual presets.',
                      'Founder Command and Industrial Command are the densest and best for monitoring-heavy workflows.',
                      'Use Reset to mode defaults if manual overrides stop matching the current route.',
                    ].map((tip) => (
                      <div key={tip} className="mos-surface-deep p-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                        {tip}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </PageSection>

            <PageSection title="Suggested combinations">
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  {
                    title: 'Founder control',
                    body: 'Founder / Operator / SMB + Founder Command + Sidebar Command',
                    icon: Sparkles,
                  },
                  {
                    title: 'Executive board',
                    body: 'Executive + Executive Brief + Enterprise Grid',
                    icon: Palette,
                  },
                  {
                    title: 'Care ops',
                    body: 'Healthcare + Care Soft + Floating Workspace',
                    icon: Accessibility,
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
