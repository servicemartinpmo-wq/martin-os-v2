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
  defaultLayoutForAppView,
  defaultThemeForAppView,
} from '@/lib/appViewFromPath'
import { getDefaultOperatingModeForIndustry } from '@/lib/industryMatrix'
import {
  getThemePresetById,
  isValidLayoutMode,
  isValidThemePresetV2,
  resolveThemePresetId,
} from '@/lib/themePresetsV2'

/**
 * Keeps `appView` + default theme/layout in sync with `?plugin=` on `/`.
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
  layout: 'martin-os-layout-mode',
  mode: 'martin-os-operating-mode',
  industry: 'martin-os-industry',
  themeUserSet: 'martin-os-theme-user-set',
  layoutUserSet: 'martin-os-layout-user-set',
  cognitive: 'martin-os-cognitive-profile',
  reducedMotion: 'martin-os-reduced-motion',
}

/** @typedef {'PMO' | 'TECH_OPS' | 'MIIDLE'} AppView */
/** @typedef {'assisted' | 'creative' | 'project' | 'founder'} OperatingMode */
/** @typedef {'SIDEBAR_ADMIN' | 'HUD' | 'BENTO'} LayoutMode */

/** @type {React.Context<null | MartinOsContextValue>} */
const MartinOsContext = createContext(null)

/**
 * @typedef {{
 *   appView: AppView,
 *   themePresetId: string,
 *   layoutMode: LayoutMode,
 *   operatingMode: OperatingMode,
 *   industryId: string,
 *   cognitiveProfileId: string,
 *   reducedMotion: boolean,
 *   setAppView: (v: AppView) => void,
 *   setThemePresetId: (id: string, opts?: { userInitiated?: boolean }) => void,
 *   setLayoutMode: (id: LayoutMode, opts?: { userInitiated?: boolean }) => void,
 *   setOperatingMode: (m: OperatingMode) => void,
 *   setIndustryId: (id: string) => void,
 *   setCognitiveProfileId: (id: string) => void,
 *   setReducedMotion: (value: boolean) => void,
 *   applyPerspective: (v: AppView) => void,
 * }} MartinOsContextValue
 */

function readStoredBoolean(key) {
  try {
    return localStorage.getItem(key) === '1'
  } catch {
    return false
  }
}

function getMotionPreference() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function MartinOsProvider({ children }) {
  const pathname = usePathname()
  const initialAppView = appViewFromPathname(
    pathname ?? '/',
    typeof window !== 'undefined' ? window.location.search : '',
  )
  const [appView, setAppViewState] = useState(initialAppView)
  const [themePresetId, setThemePresetIdState] = useState(
    defaultThemeForAppView(initialAppView),
  )
  const [layoutMode, setLayoutModeState] = useState(
    /** @type {LayoutMode} */ (defaultLayoutForAppView(initialAppView)),
  )
  const [operatingMode, setOperatingModeState] = useState(
    /** @type {OperatingMode} */ ('project'),
  )
  const [industryId, setIndustryIdState] = useState('saas')
  const [cognitiveProfileId, setCognitiveProfileIdState] = useState('DEFAULT')
  const [reducedMotion, setReducedMotionState] = useState(getMotionPreference)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const storedTheme = resolveThemePresetId(localStorage.getItem(STORAGE.theme))
      const storedLayout = localStorage.getItem(STORAGE.layout)
      const storedMode = localStorage.getItem(STORAGE.mode)
      const storedIndustry = localStorage.getItem(STORAGE.industry)
      const storedCognitive = localStorage.getItem(STORAGE.cognitive)
      const themeUserSet = localStorage.getItem(STORAGE.themeUserSet) === '1'
      const layoutUserSet = localStorage.getItem(STORAGE.layoutUserSet) === '1'
      const routeAppView = appViewFromPathname(
        pathname ?? '/',
        typeof window !== 'undefined' ? window.location.search : '',
      )

      if (storedIndustry) {
        setIndustryIdState(storedIndustry)
      }
      if (storedCognitive) {
        setCognitiveProfileIdState(storedCognitive)
      }
      if (
        storedMode &&
        ['assisted', 'creative', 'project', 'founder'].includes(storedMode)
      ) {
        setOperatingModeState(/** @type {OperatingMode} */ (storedMode))
      } else if (storedIndustry) {
        setOperatingModeState(
          /** @type {OperatingMode} */ (
            getDefaultOperatingModeForIndustry(storedIndustry)
          ),
        )
      }

      setReducedMotionState(
        localStorage.getItem(STORAGE.reducedMotion) != null
          ? readStoredBoolean(STORAGE.reducedMotion)
          : getMotionPreference(),
      )

      if (themeUserSet && storedTheme && isValidThemePresetV2(storedTheme)) {
        setThemePresetIdState(storedTheme)
      } else {
        setThemePresetIdState(defaultThemeForAppView(routeAppView))
      }

      if (layoutUserSet && storedLayout && isValidLayoutMode(storedLayout)) {
        setLayoutModeState(/** @type {LayoutMode} */ (storedLayout))
      } else {
        setLayoutModeState(
          /** @type {LayoutMode} */ (defaultLayoutForAppView(routeAppView)),
        )
      }
    } catch {
      /* ignore */
    }
    setHydrated(true)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps -- init once

  const syncAppViewFromUrl = useCallback((path, search, hydratedFlag) => {
    const nextAppView = appViewFromPathname(path, search)
    setAppViewState(nextAppView)
    if (!hydratedFlag) return
    try {
      const themeUserSet = localStorage.getItem(STORAGE.themeUserSet) === '1'
      const layoutUserSet = localStorage.getItem(STORAGE.layoutUserSet) === '1'
      if (!themeUserSet) {
        setThemePresetIdState(defaultThemeForAppView(nextAppView))
      }
      if (!layoutUserSet) {
        setLayoutModeState(
          /** @type {LayoutMode} */ (defaultLayoutForAppView(nextAppView)),
        )
      }
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    root.dataset.theme = themePresetId
    root.dataset.appView = appView
    root.dataset.industry = industryId
    root.dataset.operatingMode = operatingMode
    root.dataset.layoutMode = layoutMode
    root.dataset.layoutDensity =
      operatingMode === 'project' ? 'compact' : 'comfortable'
    root.dataset.reducedMotion = reducedMotion ? 'true' : 'false'
    root.style.colorScheme =
      getThemePresetById(themePresetId)?.category === 'light' ? 'light' : 'dark'
    if (operatingMode === 'assisted') {
      root.dataset.assisted = 'true'
    } else {
      delete root.dataset.assisted
    }
  }, [themePresetId, appView, industryId, operatingMode, layoutMode, reducedMotion])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE.theme, themePresetId)
      localStorage.setItem(STORAGE.layout, layoutMode)
      localStorage.setItem(STORAGE.mode, operatingMode)
      localStorage.setItem(STORAGE.industry, industryId)
      localStorage.setItem(STORAGE.cognitive, cognitiveProfileId)
      localStorage.setItem(STORAGE.reducedMotion, reducedMotion ? '1' : '0')
    } catch {
      /* ignore */
    }
  }, [
    themePresetId,
    layoutMode,
    operatingMode,
    industryId,
    cognitiveProfileId,
    reducedMotion,
    hydrated,
  ])

  const setThemePresetId = useCallback((id, opts = {}) => {
    const resolved = resolveThemePresetId(id)
    if (!resolved || !isValidThemePresetV2(resolved)) return
    setThemePresetIdState(resolved)
    if (opts.userInitiated) {
      try {
        localStorage.setItem(STORAGE.themeUserSet, '1')
      } catch {
        /* ignore */
      }
    }
  }, [])

  const setLayoutMode = useCallback((id, opts = {}) => {
    if (!isValidLayoutMode(id)) return
    setLayoutModeState(/** @type {LayoutMode} */ (id))
    if (opts.userInitiated) {
      try {
        localStorage.setItem(STORAGE.layoutUserSet, '1')
      } catch {
        /* ignore */
      }
    }
  }, [])

  const setOperatingMode = useCallback((mode) => {
    setOperatingModeState(mode)
  }, [])

  const setIndustryId = useCallback((id) => {
    setIndustryIdState(id)
    const defaultMode = getDefaultOperatingModeForIndustry(id)
    setOperatingModeState(/** @type {OperatingMode} */ (defaultMode))
  }, [])

  const setCognitiveProfileId = useCallback((id) => {
    setCognitiveProfileIdState(id || 'DEFAULT')
  }, [])

  const setReducedMotion = useCallback((value) => {
    setReducedMotionState(Boolean(value))
  }, [])

  const setAppView = useCallback((value) => {
    setAppViewState(value)
  }, [])

  /** Align theme + layout to perspective and clear explicit user locks. */
  const applyPerspective = useCallback((value) => {
    try {
      localStorage.removeItem(STORAGE.themeUserSet)
      localStorage.removeItem(STORAGE.layoutUserSet)
    } catch {
      /* ignore */
    }
    setAppViewState(value)
    setThemePresetIdState(defaultThemeForAppView(value))
    setLayoutModeState(
      /** @type {LayoutMode} */ (defaultLayoutForAppView(value)),
    )
  }, [])

  const value = useMemo(
    () => ({
      appView,
      themePresetId,
      layoutMode,
      operatingMode,
      industryId,
      cognitiveProfileId,
      reducedMotion,
      setAppView,
      setThemePresetId,
      setLayoutMode,
      setOperatingMode,
      setIndustryId,
      setCognitiveProfileId,
      setReducedMotion,
      applyPerspective,
    }),
    [
      appView,
      themePresetId,
      layoutMode,
      operatingMode,
      industryId,
      cognitiveProfileId,
      reducedMotion,
      setAppView,
      setThemePresetId,
      setLayoutMode,
      setOperatingMode,
      setIndustryId,
      setCognitiveProfileId,
      setReducedMotion,
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
