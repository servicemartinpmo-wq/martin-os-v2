'use client'

import AppShell from '@/features/shell/AppShell'
import { useMartinOs } from '@/context/MartinOsProvider'
import { THEME_PRESETS } from '@/lib/themePresets'
import { INDUSTRIES, getIndustryRow } from '@/lib/industryMatrix'
import { listCognitiveProfiles } from '@/agents/cognitiveRouter'
import ApprovalPanel from '@/components/autonomy/ApprovalPanel'
import SystemPanel from '@/components/system/SystemPanel'
import Button from '@/components/catalyst/Button'

const MODES = [
  { id: 'assisted', label: 'Assisted' },
  { id: 'creative', label: 'Creative' },
  { id: 'project', label: 'Project' },
  { id: 'founder', label: 'Founder' },
]

export default function SettingsPage() {
  const {
    themePresetId,
    setThemePresetId,
    operatingMode,
    setOperatingMode,
    industryId,
    setIndustryId,
    cognitiveProfileId,
    setCognitiveProfileId,
  } = useMartinOs()

  const industryRow = getIndustryRow(industryId)
  const cognitiveProfiles = listCognitiveProfiles()

  return (
    <AppShell activeHref="/settings">
      <header className="glass-panel p-6">
        <p className="text-xs uppercase tracking-[0.2em]" style={{ color: 'var(--accent)' }}>
          Settings
        </p>
        <h1 className="font-display mt-2 text-3xl font-semibold">Experience & governance</h1>
        <p className="mt-2 max-w-3xl text-sm" style={{ color: 'var(--text-muted)' }}>
          Theme presets map to semantic tokens only — no raw Tailwind color utilities in chrome.
        </p>
      </header>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="glass-panel space-y-4 p-5">
          <h2 className="font-display text-lg font-semibold">Theme preset</h2>
          <div className="flex flex-col gap-2">
            {THEME_PRESETS.map((p) => (
              <label
                key={p.id}
                className="flex cursor-pointer items-center gap-3 rounded-md border px-3 py-2"
                style={{
                  borderColor: themePresetId === p.id ? 'var(--accent)' : 'var(--border-subtle)',
                }}
              >
                <input
                  type="radio"
                  name="theme"
                  checked={themePresetId === p.id}
                  onChange={() => setThemePresetId(p.id, { userInitiated: true })}
                />
                <span style={{ color: 'var(--text-primary)' }}>{p.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="glass-panel space-y-4 p-5">
          <h2 className="font-display text-lg font-semibold">Industry default</h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Sets recommended operating mode when you change industry (onboarding parity).
          </p>
          <select
            className="w-full rounded-md border bg-transparent px-3 py-2 text-sm"
            style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
            value={industryId}
            onChange={(e) => setIndustryId(e.target.value)}
          >
            {INDUSTRIES.map((i) => (
              <option key={i.id} value={i.id}>
                {i.label}
              </option>
            ))}
          </select>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            <strong style={{ color: 'var(--text-primary)' }}>Plus emphasis:</strong> {industryRow.plusEmphasis}
          </p>
        </div>

        <div className="glass-panel space-y-4 p-5 lg:col-span-2">
          <h2 className="font-display text-lg font-semibold">Cognitive router (agents)</h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Optional reasoning diversity — enable with <code className="font-mono-ui text-xs">NEXT_PUBLIC_COGNITIVE_ROUTER=1</code>.
            Not clinical user typing.
          </p>
          <select
            className="w-full max-w-md rounded-md border bg-transparent px-3 py-2 text-sm"
            style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
            value={cognitiveProfileId}
            onChange={(e) => setCognitiveProfileId(e.target.value)}
          >
            {cognitiveProfiles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.id} — {p.label}
              </option>
            ))}
          </select>
        </div>

        <div className="glass-panel space-y-2 p-5 lg:col-span-2 text-xs" style={{ color: 'var(--text-muted)' }}>
          <p className="font-display text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Feature flags (env)
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>NEXT_PUBLIC_MERGE_AGENT — multi-agent merge pass</li>
            <li>NEXT_PUBLIC_SYSTEM_PANEL — context bus inspector</li>
            <li>NEXT_PUBLIC_COGNITIVE_ROUTER — MBTI-style agent prompts</li>
            <li>NEXT_PUBLIC_AUTONOMY_ENABLED / HYPER_AUTONOMOUS_MODE — autonomy kill switches</li>
            <li>CRON_SECRET — secures /api/cron/techops-heartbeat</li>
          </ul>
        </div>

        <div className="glass-panel space-y-4 p-5 lg:col-span-2">
          <h2 className="font-display text-lg font-semibold">Operating mode</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setOperatingMode(/** @type {any} */ (m.id))}
                className="rounded-lg border px-4 py-3 text-left text-sm font-medium transition-colors"
                style={{
                  borderColor: operatingMode === m.id ? 'var(--accent)' : 'var(--border-subtle)',
                  background:
                    operatingMode === m.id ? 'var(--accent-muted)' : 'transparent',
                  color: 'var(--text-primary)',
                }}
              >
                {m.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="ghost"
              className="!shadow-none"
              onClick={() => {
                setThemePresetId('assist_hc', { userInitiated: true })
                setOperatingMode('assisted')
              }}
            >
              Enable assist high-contrast
            </Button>
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <ApprovalPanel />
        <SystemPanel />
      </div>
    </AppShell>
  )
}
