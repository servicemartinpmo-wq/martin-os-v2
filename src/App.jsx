/**
 * PMO-Ops host shell: orchestrates native plugins (dashboard | tech-ops | miidle).
 * Mounted from the App Router (`app/TriNativeHome.jsx`); use `npm run dev` (Next.js).
 */
'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import ExplanationPanel from './components/ExplanationPanel'
import Miidle from './components/Miidle'
import PMOOpsCore from './components/PMOOpsCore'
import PreferencesPanel from './components/PreferencesPanel'
import TechOps from './components/TechOps'
import { pluginContent } from './data/contentRegistry'
import { appVisualProfiles } from './data/visualPresets'
import { useNotificationSound } from './hooks/useNotificationSound'
import './App.css'

const appMeta = {
  dashboard: { chip: 'Core System', title: 'PMO-Ops Control', section: 'Host System' },
  'tech-ops': { chip: 'Plugin Active', title: 'Tech-Ops Engine', section: 'Native Apps' },
  miidle: { chip: 'Plugin Active', title: 'Miidle Content Layer', section: 'Native Apps' },
}

const defaultPreferences = {
  themePreset: 'chrome-luxe',
  density: 'comfortable',
  glow: 55,
  pagePreset: 'executive-grid',
  cornerPreset: 'rounded',
  animationPreset: 'standard',
  lockscreenId: appVisualProfiles.dashboard.lockscreen[0].id,
}

/** @typedef {'dashboard' | 'tech-ops' | 'miidle'} ActivePlugin */

/**
 * @param {{
 *   activePlugin?: ActivePlugin,
 *   onActivePluginChange?: (plugin: ActivePlugin) => void,
 * }} props
 */
function App({ activePlugin: activePluginProp, onActivePluginChange }) {
  const playNotification = useNotificationSound()
  const [internalPlugin, setInternalPlugin] = useState(() => {
    if (typeof window === 'undefined') return 'dashboard'
    const saved = localStorage.getItem('martin-os-active-plugin')
    if (saved === 'miiddle') return 'miidle'
    return saved === 'tech-ops' || saved === 'miidle' ? saved : 'dashboard'
  })
  const controlled =
    activePluginProp !== undefined && typeof onActivePluginChange === 'function'
  const activePlugin = controlled ? activePluginProp : internalPlugin
  const setActivePlugin = (/** @type {ActivePlugin} */ plugin) => {
    if (controlled) onActivePluginChange(plugin)
    else setInternalPlugin(plugin)
  }
  const [isPrefsOpen, setIsPrefsOpen] = useState(false)
  const [isLocked, setIsLocked] = useState(false)
  const [preferences, setPreferences] = useState(() => {
    if (typeof window === 'undefined') return defaultPreferences
    try {
      const saved = localStorage.getItem('martin-os-visual-preferences')
      return saved ? { ...defaultPreferences, ...JSON.parse(saved) } : defaultPreferences
    } catch {
      return defaultPreferences
    }
  })

  const activeMeta = appMeta[activePlugin] ?? appMeta.dashboard
  const activeCopy = pluginContent[activePlugin] ?? pluginContent.dashboard
  const activeProfile = appVisualProfiles[activePlugin] ?? appVisualProfiles.dashboard
  const lockscreenOptions = activeProfile.lockscreen
  const activeLockscreenId = lockscreenOptions.some((option) => option.id === preferences.lockscreenId)
    ? preferences.lockscreenId
    : lockscreenOptions[0].id
  const activeLockscreen = lockscreenOptions.find((item) => item.id === activeLockscreenId) || lockscreenOptions[0]

  const pluginView = useMemo(() => {
    if (activePlugin === 'tech-ops') return <TechOps pagePreset={preferences.pagePreset} />
    if (activePlugin === 'miidle') {
      return <Miidle pagePreset={preferences.pagePreset} animationPreset={preferences.animationPreset} />
    }
    return <PMOOpsCore pagePreset={preferences.pagePreset} />
  }, [activePlugin, preferences.pagePreset, preferences.animationPreset])

  useEffect(() => {
    if (typeof window === 'undefined') return
    localStorage.setItem('martin-os-active-plugin', activePlugin)
  }, [activePlugin])

  useEffect(() => {
    if (typeof window === 'undefined') return
    localStorage.setItem('martin-os-visual-preferences', JSON.stringify(preferences))
  }, [preferences])

  const onPreferenceChange = (key, value) => {
    setPreferences((prev) => ({ ...prev, [key]: value }))
  }

  const shellClass = [
    'app-shell',
    'laminated',
    `density-${preferences.density}`,
    `corners-${preferences.cornerPreset}`,
    `ui-preset-${preferences.themePreset}`,
  ].join(' ')

  return (
    <div
      className={shellClass}
      data-active-plugin={activePlugin}
      data-shell-profile={activeProfile.shellTheme}
      style={{ '--shell-glow': String(preferences.glow / 100) }}
    >
      <aside className="sidebar laminated chrome-frame">
        <h2>MARTIN OS</h2>
        <p className="section-label">Host System</p>
        <button
          type="button"
          className={`nav-button ${activePlugin === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActivePlugin('dashboard')}
        >
          PMO-Ops Core
        </button>

        <p className="section-label">Native Plugins</p>
        <button
          type="button"
          className={`nav-button ${activePlugin === 'tech-ops' ? 'active' : ''}`}
          onClick={() => setActivePlugin('tech-ops')}
        >
          Tech-Ops
        </button>
        <button
          type="button"
          className={`nav-button ${activePlugin === 'miidle' ? 'active' : ''}`}
          onClick={() => setActivePlugin('miidle')}
        >
          Miidle
        </button>

        <div className="assistant-block">
          <span className="voice-dot" />
          <span>AI Voice Assistant</span>
        </div>
      </aside>

      <main className="main-area">
        <header className="main-header laminated chrome-frame">
          <div>
            <span className="chip">{activeMeta.chip}</span>
            <h1>{activeMeta.title}</h1>
          </div>
          <div className="top-actions">
            <button type="button" onClick={playNotification}>
              Notify
            </button>
            <button type="button" onClick={() => setIsPrefsOpen(true)}>
              Preferences
            </button>
            <button type="button" onClick={() => setIsLocked(true)}>
              Lock Screen
            </button>
          </div>
        </header>

        <nav
          className="tri-deep-routes laminated chrome-frame"
          aria-label="Deep routes"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            padding: '0.65rem 1rem',
            marginTop: '0.75rem',
            alignItems: 'center',
          }}
        >
          <span className="section-label" style={{ margin: 0, marginRight: '0.25rem' }}>
            Open in App Shell
          </span>
          <Link href="/pmo-ops" className="nav-button" prefetch={false}>
            PMO-Ops hub
          </Link>
          <Link href="/tech-ops" className="nav-button" prefetch={false}>
            Tech-Ops hub
          </Link>
          <Link href="/miidle" className="nav-button" prefetch={false}>
            Miidle hub
          </Link>
          <Link href="/settings" className="nav-button" prefetch={false}>
            Settings
          </Link>
        </nav>

        <ExplanationPanel copy={activeCopy.explanation} />
        <section className="plugin-stage laminated chrome-frame">{pluginView}</section>
      </main>

      <PreferencesPanel
        isOpen={isPrefsOpen}
        onClose={() => setIsPrefsOpen(false)}
        preferences={preferences}
        onPreferenceChange={onPreferenceChange}
        lockscreenOptions={lockscreenOptions}
      />

      {isLocked && (
        <div className="lockscreen-overlay" role="dialog" aria-label="Lock screen preview">
          <img src={activeLockscreen.image} alt={activeLockscreen.label} />
          <div className="lockscreen-content">
            <p>{activeLockscreen.label}</p>
            <h2>MARTIN OS SECURE</h2>
            <button type="button" onClick={() => setIsLocked(false)}>
              Unlock
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
