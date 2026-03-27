'use client'

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

function App() {
  const playNotification = useNotificationSound()
  const [activeApp, setActiveApp] = useState(() => {
    if (typeof window === 'undefined') return 'dashboard'
    const saved = localStorage.getItem('martin-os-active-plugin')
    return saved === 'tech-ops' || saved === 'miidle' ? saved : 'dashboard'
  })
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

  const activeMeta = appMeta[activeApp] ?? appMeta.dashboard
  const activeCopy = pluginContent[activeApp] ?? pluginContent.dashboard
  const activeProfile = appVisualProfiles[activeApp] ?? appVisualProfiles.dashboard
  const lockscreenOptions = activeProfile.lockscreen
  const activeLockscreenId = lockscreenOptions.some((option) => option.id === preferences.lockscreenId)
    ? preferences.lockscreenId
    : lockscreenOptions[0].id
  const activeLockscreen = lockscreenOptions.find((item) => item.id === activeLockscreenId) || lockscreenOptions[0]

  const appView = useMemo(() => {
    if (activeApp === 'tech-ops') return <TechOps pagePreset={preferences.pagePreset} />
    if (activeApp === 'miidle') {
      return <Miidle pagePreset={preferences.pagePreset} animationPreset={preferences.animationPreset} />
    }
    return <PMOOpsCore pagePreset={preferences.pagePreset} />
  }, [activeApp, preferences.pagePreset, preferences.animationPreset])

  useEffect(() => {
    localStorage.setItem('martin-os-active-plugin', activeApp)
  }, [activeApp])

  useEffect(() => {
    localStorage.setItem('martin-os-visual-preferences', JSON.stringify(preferences))
  }, [preferences])

  const onPreferenceChange = (key, value) => {
    setPreferences((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="app-shell">
      <aside className="sidebar laminated chrome-frame">
        <h2>MARTIN OS</h2>
        <p className="section-label">Host System</p>
        <button
          type="button"
          className={`nav-button ${activeApp === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveApp('dashboard')}
        >
          PMO-Ops
        </button>

        <p className="section-label">Native Apps</p>
        <button
          type="button"
          className={`nav-button ${activeApp === 'tech-ops' ? 'active' : ''}`}
          onClick={() => setActiveApp('tech-ops')}
        >
          Tech-Ops
        </button>
        <button
          type="button"
          className={`nav-button ${activeApp === 'miidle' ? 'active' : ''}`}
          onClick={() => setActiveApp('miidle')}
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

        <ExplanationPanel copy={activeCopy.explanation} />
        <section className="plugin-stage laminated chrome-frame">{appView}</section>
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
