'use client'

/* eslint-disable react-hooks/set-state-in-effect -- hydrate from localStorage and sync app view from pathname on mount/navigation */
import {
  createContext,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import {
  appViewFromPathname,
  defaultThemeForAppView,
} from '@/lib/appViewFromPath'
import { getDefaultOperatingModeForIndustry } from '@/lib/industryMatrix'
import { isValidThemePreset } from '@/lib/themePresets'

/**
 * Keeps `appView` + default theme in sync with `?plugin=` on `/` (tri-native home).
 * @param {{ onSync: (path: string, search: string, hydratedFlag: boolean) => void, hydratedFlag: boolean }} props
 */
function MartinOsAppViewFromRoute({ onSync, hydratedFlag }) {
  const pathname = usePathname() ?? '/'
  const searchParams = useSearchParams()
  useEffect(() => {
    const qs = searchParams.toString()
    const search = qs ? `?${qs}` : ''
    onSync(pathname, search, hydratedFlag)
  }, [pathname, searchParams, onSync, hydratedFlag])
  return null
}

const STORAGE = {
  theme: 'martin-os-theme-preset',
  mode: 'martin-os-operating-mode',
  industry: 'martin-os-industry',
  themeUserSet: 'martin-os-theme-user-set',
  cognitive: 'martin-os-cognitive-profile',
}

/** @typedef {'PMO' | 'TECH_OPS' | 'MIIDLE'} AppView */
/** @typedef {'assisted' | 'creative' | 'project' | 'founder'} OperatingMode */

/** @type {React.Context<null | MartinOsContextValue>} */
const MartinOsContext = createContext(null)

/**
 * @typedef {{
 *   appView: AppView,
 *   themePresetId: string,
 *   operatingMode: OperatingMode,
 *   industryId: string,
 *   cognitiveProfileId: string,
 *   setAppView: (v: AppView) => void,
 *   setThemePresetId: (id: string, opts?: { userInitiated?: boolean }) => void,
 *   setOperatingMode: (m: OperatingMode) => void,
 *   setIndustryId: (id: string) => void,
 *   setCognitiveProfileId: (id: string) => void,
 *   applyPerspective: (v: AppView) => void,
 * }} MartinOsContextValue
 */

export function MartinOsProvider({ children }) {
  const pathname = usePathname()
  const [appView, setAppViewState] = useState(() =>
    appViewFromPathname(
      pathname ?? '/',
      typeof window !== 'undefined' ? window.location.search : '',
    ),
  )
  const [themePresetId, setThemePresetIdState] = useState('pmo')
  const [operatingMode, setOperatingModeState] = useState(
    /** @type {OperatingMode} */ ('project'),
  )
  const [industryId, setIndustryIdState] = useState('saas')
  const [cognitiveProfileId, setCognitiveProfileIdState] = useState('DEFAULT')
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const t = localStorage.getItem(STORAGE.theme)
      const m = localStorage.getItem(STORAGE.mode)
      const i = localStorage.getItem(STORAGE.industry)
      const cog = localStorage.getItem(STORAGE.cognitive)
      const userSet = localStorage.getItem(STORAGE.themeUserSet) === '1'
      if (t && isValidThemePreset(t)) setThemePresetIdState(t)
      if (i) setIndustryIdState(i)
      if (cog) setCognitiveProfileIdState(cog)
      if (m && ['assisted', 'creative', 'project', 'founder'].includes(m)) {
        setOperatingModeState(/** @type {OperatingMode} */ (m))
      } else if (i) {
        setOperatingModeState(
          /** @type {OperatingMode} */ (
            getDefaultOperatingModeForIndustry(i)
          ),
        )
      }
      if (!userSet && (!t || !isValidThemePreset(t))) {
        const search =
          typeof window !== 'undefined' ? window.location.search : ''
        const av = appViewFromPathname(pathname ?? '/', search)
        setThemePresetIdState(defaultThemeForAppView(av))
      }
    } catch {
      /* ignore */
    }
    setHydrated(true)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps -- init once

  const syncAppViewFromUrl = useCallback(
    (path, search, hydratedFlag) => {
      const av = appViewFromPathname(path, search)
      setAppViewState(av)
      if (!hydratedFlag) return
      try {
        const userSet = localStorage.getItem(STORAGE.themeUserSet) === '1'
        if (!userSet) {
          setThemePresetIdState(defaultThemeForAppView(av))
        }
      } catch {
        /* ignore */
      }
    },
    [],
  )

  useEffect(() => {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    root.dataset.theme = themePresetId
    root.dataset.appView = appView
    root.dataset.industry = industryId
    root.dataset.operatingMode = operatingMode
    root.dataset.layoutDensity =
      operatingMode === 'project' ? 'compact' : 'comfortable'
    const assisted = operatingMode === 'assisted'
    if (assisted) {
      root.dataset.assisted = 'true'
    } else {
      delete root.dataset.assisted
    }
  }, [themePresetId, appView, operatingMode, industryId])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE.theme, themePresetId)
      localStorage.setItem(STORAGE.mode, operatingMode)
      localStorage.setItem(STORAGE.industry, industryId)
      localStorage.setItem(STORAGE.cognitive, cognitiveProfileId)
    } catch {
      /* ignore */
    }
  }, [themePresetId, operatingMode, industryId, cognitiveProfileId, hydrated])

  const setThemePresetId = useCallback(
    (id, opts = {}) => {
      if (!isValidThemePreset(id)) return
      setThemePresetIdState(id)
      if (opts.userInitiated) {
        try {
          localStorage.setItem(STORAGE.themeUserSet, '1')
        } catch {
          /* ignore */
        }
      }
    },
    [],
  )

  const setOperatingMode = useCallback((m) => {
    setOperatingModeState(m)
  }, [])

  const setIndustryId = useCallback((id) => {
    setIndustryIdState(id)
    const def = getDefaultOperatingModeForIndustry(id)
    setOperatingModeState(/** @type {OperatingMode} */ (def))
  }, [])

  const setCognitiveProfileId = useCallback((id) => {
    setCognitiveProfileIdState(id || 'DEFAULT')
  }, [])

  const setAppView = useCallback((v) => {
    setAppViewState(v)
  }, [])

  /** Align theme to perspective (OS nav / keyboard) — clears “user locked” accent */
  const applyPerspective = useCallback((v) => {
    try {
      localStorage.removeItem(STORAGE.themeUserSet)
    } catch {
      /* ignore */
    }
    setAppViewState(v)
    setThemePresetIdState(defaultThemeForAppView(v))
  }, [])

  const value = useMemo(
    () => ({
      appView,
      themePresetId,
      operatingMode,
      industryId,
      cognitiveProfileId,
      setAppView,
      setThemePresetId,
      setOperatingMode,
      setIndustryId,
      setCognitiveProfileId,
      applyPerspective,
    }),
    [
      appView,
      themePresetId,
      operatingMode,
      industryId,
      cognitiveProfileId,
      setAppView,
      setThemePresetId,
      setOperatingMode,
      setIndustryId,
      setCognitiveProfileId,
      applyPerspective,
    ],
  )

  return (
    <MartinOsContext.Provider value={value}>
      <Suspense fallback={null}>
        <MartinOsAppViewFromRoute
          onSync={syncAppViewFromUrl}
          hydratedFlag={hydrated}
        />
      </Suspense>
      {children}
    </MartinOsContext.Provider>
  )
}

export function useMartinOs() {
  const ctx = useContext(MartinOsContext)
  if (!ctx) {
    throw new Error('useMartinOs must be used within MartinOsProvider')
  }
  return ctx
}
