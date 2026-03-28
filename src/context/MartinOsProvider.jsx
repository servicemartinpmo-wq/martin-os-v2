'use client'

/* eslint-disable react-hooks/set-state-in-effect -- provider hydrates persisted experience state and route-aware defaults */
import {
  createContext,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { appViewFromPathname } from '@/lib/appViewFromPath'
import { getDefaultOperatingModeForIndustry } from '@/lib/industryMatrix'
import {
  DEFAULT_BRAND_PROFILE,
  getDefaultLayoutModeForAppView,
  getDefaultThemePresetForAppView,
  getThemePresetById,
  getUserModeById,
  isValidLayoutMode,
  isValidThemePresetV2,
  isValidUserMode,
  normalizeBrandProfile,
  recommendPresetLibrary,
  resolveLayoutModeId,
  resolveThemePresetId,
  resolveUserModeId,
} from '@/lib/themePresetsV2'

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
  userMode: 'martin-os-user-mode',
  legacyMode: 'martin-os-operating-mode',
  industry: 'martin-os-industry',
  cognitive: 'martin-os-cognitive-profile',
  reducedMotion: 'martin-os-reduced-motion',
  brandProfile: 'martin-os-brand-profile',
  themeUserSet: 'martin-os-theme-user-set',
  layoutUserSet: 'martin-os-layout-user-set',
  modeUserSet: 'martin-os-mode-user-set',
}

const MartinOsContext = createContext(null)

function readStoredBoolean(key) {
  try {
    return localStorage.getItem(key) === '1'
  } catch {
    return false
  }
}

function readStoredJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

function getMotionPreference() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function buildPersistedPayload(state) {
  return {
    profileKey: 'default',
    appView: state.appView,
    userMode: state.userMode,
    themePresetId: state.themePresetId,
    layoutMode: state.layoutMode,
    industryId: state.industryId,
    reducedMotion: state.reducedMotion,
    brandProfile: state.brandProfile,
    overrideFlags: state.overrideFlags,
  }
}

export function MartinOsProvider({ children }) {
  const pathname = usePathname()
  const initialAppView = appViewFromPathname(
    pathname ?? '/',
    typeof window !== 'undefined' ? window.location.search : '',
  )
  const [appView, setAppViewState] = useState(initialAppView)
  const [industryId, setIndustryIdState] = useState('saas')
  const [userMode, setUserModeState] = useState('founder_operator_smb')
  const [themePresetId, setThemePresetIdState] = useState(
    getDefaultThemePresetForAppView(initialAppView, 'founder_operator_smb'),
  )
  const [layoutMode, setLayoutModeState] = useState(
    getDefaultLayoutModeForAppView(initialAppView, 'founder_operator_smb'),
  )
  const [brandProfile, setBrandProfileState] = useState(DEFAULT_BRAND_PROFILE)
  const [cognitiveProfileId, setCognitiveProfileIdState] = useState('DEFAULT')
  const [reducedMotion, setReducedMotionState] = useState(getMotionPreference)
  const [overrideFlags, setOverrideFlags] = useState({
    theme: false,
    layout: false,
    mode: false,
  })
  const [hydrated, setHydrated] = useState(false)
  const serverAppliedRef = useRef(false)

  const resolveDefaults = useCallback((nextAppView, nextUserMode) => {
    const resolvedMode =
      resolveUserModeId(nextUserMode) ??
      getDefaultOperatingModeForIndustry(industryId)
    return {
      userMode: resolvedMode,
      themePresetId: getDefaultThemePresetForAppView(nextAppView, resolvedMode),
      layoutMode: getDefaultLayoutModeForAppView(nextAppView, resolvedMode),
    }
  }, [industryId])

  useEffect(() => {
    try {
      const storedIndustry = localStorage.getItem(STORAGE.industry) || 'saas'
      const storedMode = resolveUserModeId(
        localStorage.getItem(STORAGE.userMode) ??
          localStorage.getItem(STORAGE.legacyMode),
      )
      const storedTheme = resolveThemePresetId(localStorage.getItem(STORAGE.theme))
      const storedLayout = resolveLayoutModeId(localStorage.getItem(STORAGE.layout))
      const storedCognitive = localStorage.getItem(STORAGE.cognitive)
      const storedBrandProfile = normalizeBrandProfile(
        readStoredJson(STORAGE.brandProfile, DEFAULT_BRAND_PROFILE),
      )
      const themeUserSet = localStorage.getItem(STORAGE.themeUserSet) === '1'
      const layoutUserSet = localStorage.getItem(STORAGE.layoutUserSet) === '1'
      const modeUserSet = localStorage.getItem(STORAGE.modeUserSet) === '1'
      const routeAppView = appViewFromPathname(
        pathname ?? '/',
        typeof window !== 'undefined' ? window.location.search : '',
      )
      const defaultMode = getDefaultOperatingModeForIndustry(storedIndustry)
      const resolvedMode =
        storedMode && isValidUserMode(storedMode) ? storedMode : defaultMode
      const defaults = {
        themePresetId: getDefaultThemePresetForAppView(routeAppView, resolvedMode),
        layoutMode: getDefaultLayoutModeForAppView(routeAppView, resolvedMode),
      }

      setIndustryIdState(storedIndustry)
      setUserModeState(resolvedMode)
      setBrandProfileState(storedBrandProfile)
      setCognitiveProfileIdState(storedCognitive || 'DEFAULT')
      setReducedMotionState(
        localStorage.getItem(STORAGE.reducedMotion) != null
          ? readStoredBoolean(STORAGE.reducedMotion)
          : getMotionPreference(),
      )
      setOverrideFlags({
        theme: themeUserSet,
        layout: layoutUserSet,
        mode: modeUserSet,
      })

      if (themeUserSet && storedTheme && isValidThemePresetV2(storedTheme)) {
        setThemePresetIdState(storedTheme)
      } else {
        setThemePresetIdState(defaults.themePresetId)
      }

      if (layoutUserSet && storedLayout && isValidLayoutMode(storedLayout)) {
        setLayoutModeState(storedLayout)
      } else {
        setLayoutModeState(defaults.layoutMode)
      }
    } catch {
      /* ignore hydrate failures */
    }
    setHydrated(true)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps -- init once

  useEffect(() => {
    if (!hydrated || serverAppliedRef.current) return
    serverAppliedRef.current = true
    let cancelled = false

    queueMicrotask(async () => {
      try {
        const response = await fetch('/api/preferences?profileKey=default', {
          cache: 'no-store',
        })
        if (!response.ok || cancelled) return
        const payload = await response.json()
        if (cancelled || !payload?.profile) return

        const localThemeOverride = readStoredBoolean(STORAGE.themeUserSet)
        const localLayoutOverride = readStoredBoolean(STORAGE.layoutUserSet)
        const localModeOverride = readStoredBoolean(STORAGE.modeUserSet)
        const localIndustry = localStorage.getItem(STORAGE.industry)
        const localTheme = localStorage.getItem(STORAGE.theme)
        const localLayout = localStorage.getItem(STORAGE.layout)
        const localMode =
          localStorage.getItem(STORAGE.userMode) ?? localStorage.getItem(STORAGE.legacyMode)

        const serverProfile = payload.profile
        const nextIndustry = localIndustry || serverProfile.industryId || 'saas'
        const nextMode =
          resolveUserModeId(localMode || serverProfile.userMode) ??
          getDefaultOperatingModeForIndustry(nextIndustry)
        const nextDefaults = {
          themePresetId: getDefaultThemePresetForAppView(appView, nextMode),
          layoutMode: getDefaultLayoutModeForAppView(appView, nextMode),
        }

        setIndustryIdState((current) => current || nextIndustry)
        setBrandProfileState((current) =>
          normalizeBrandProfile(serverProfile.brandProfile ?? current),
        )
        setReducedMotionState((current) =>
          typeof serverProfile.reducedMotion === 'boolean'
            ? serverProfile.reducedMotion
            : current,
        )

        if (!localModeOverride && !localMode && isValidUserMode(serverProfile.userMode)) {
          setUserModeState(serverProfile.userMode)
        }
        if (!localThemeOverride && !localTheme && isValidThemePresetV2(serverProfile.themePresetId)) {
          setThemePresetIdState(serverProfile.themePresetId)
        } else if (!localThemeOverride && !localTheme) {
          setThemePresetIdState(nextDefaults.themePresetId)
        }
        if (!localLayoutOverride && !localLayout && isValidLayoutMode(serverProfile.layoutMode)) {
          setLayoutModeState(serverProfile.layoutMode)
        } else if (!localLayoutOverride && !localLayout) {
          setLayoutModeState(nextDefaults.layoutMode)
        }
      } catch {
        /* ignore remote preference failures */
      }
    })

    return () => {
      cancelled = true
    }
  }, [appView, hydrated])

  const syncAppViewFromUrl = useCallback(
    (path, search, hydratedFlag) => {
      const nextAppView = appViewFromPathname(path, search)
      setAppViewState(nextAppView)
      if (!hydratedFlag) return

      setThemePresetIdState((current) => {
        if (overrideFlags.theme) return current
        return getDefaultThemePresetForAppView(nextAppView, userMode)
      })
      setLayoutModeState((current) => {
        if (overrideFlags.layout) return current
        return getDefaultLayoutModeForAppView(nextAppView, userMode)
      })
    },
    [overrideFlags.layout, overrideFlags.theme, userMode],
  )

  const recommendation = useMemo(
    () => recommendPresetLibrary({ ...brandProfile, industry: industryId }, userMode),
    [brandProfile, industryId, userMode],
  )

  useEffect(() => {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    const theme = getThemePresetById(themePresetId)
    const mode = getUserModeById(userMode)
    root.dataset.theme = themePresetId
    root.dataset.appView = appView
    root.dataset.industry = industryId
    root.dataset.userMode = userMode
    root.dataset.operatingMode = userMode
    root.dataset.layoutMode = layoutMode
    root.dataset.layoutDensity = mode?.density ?? 'balanced'
    root.dataset.reducedMotion = reducedMotion ? 'true' : 'false'
    root.dataset.modeTone = mode?.tone ?? 'command'
    root.style.colorScheme = theme?.category === 'light' ? 'light' : 'dark'
    if (userMode === 'healthcare' || userMode === 'freelance') {
      root.dataset.assisted = 'true'
    } else {
      delete root.dataset.assisted
    }
    root.style.setProperty(
      '--brand-accent',
      recommendation.derivedThemeOverrides['--brand-accent'],
    )
    root.style.setProperty(
      '--brand-density',
      recommendation.derivedThemeOverrides['--brand-density'],
    )
  }, [themePresetId, appView, industryId, userMode, layoutMode, reducedMotion, recommendation])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE.theme, themePresetId)
      localStorage.setItem(STORAGE.layout, layoutMode)
      localStorage.setItem(STORAGE.userMode, userMode)
      localStorage.setItem(STORAGE.legacyMode, userMode)
      localStorage.setItem(STORAGE.industry, industryId)
      localStorage.setItem(STORAGE.cognitive, cognitiveProfileId)
      localStorage.setItem(STORAGE.reducedMotion, reducedMotion ? '1' : '0')
      localStorage.setItem(STORAGE.brandProfile, JSON.stringify(brandProfile))
      localStorage.setItem(STORAGE.themeUserSet, overrideFlags.theme ? '1' : '0')
      localStorage.setItem(STORAGE.layoutUserSet, overrideFlags.layout ? '1' : '0')
      localStorage.setItem(STORAGE.modeUserSet, overrideFlags.mode ? '1' : '0')
    } catch {
      /* ignore */
    }
  }, [
    themePresetId,
    layoutMode,
    userMode,
    industryId,
    cognitiveProfileId,
    reducedMotion,
    brandProfile,
    overrideFlags,
    hydrated,
  ])

  useEffect(() => {
    if (!hydrated) return
    const timeout = window.setTimeout(async () => {
      try {
        await fetch('/api/preferences', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(
            buildPersistedPayload({
              appView,
              userMode,
              themePresetId,
              layoutMode,
              industryId,
              reducedMotion,
              brandProfile,
              overrideFlags,
            }),
          ),
        })
      } catch {
        /* ignore */
      }
    }, 250)

    return () => {
      window.clearTimeout(timeout)
    }
  }, [
    appView,
    userMode,
    themePresetId,
    layoutMode,
    industryId,
    reducedMotion,
    brandProfile,
    overrideFlags,
    hydrated,
  ])

  const setThemePresetId = useCallback((id, opts = {}) => {
    const resolved = resolveThemePresetId(id)
    if (!resolved || !isValidThemePresetV2(resolved)) return
    setThemePresetIdState(resolved)
    if (opts.userInitiated) {
      setOverrideFlags((current) => ({ ...current, theme: true }))
    }
  }, [])

  const setLayoutMode = useCallback((id, opts = {}) => {
    const resolved = resolveLayoutModeId(id)
    if (!resolved || !isValidLayoutMode(resolved)) return
    setLayoutModeState(resolved)
    if (opts.userInitiated) {
      setOverrideFlags((current) => ({ ...current, layout: true }))
    }
  }, [])

  const setUserMode = useCallback(
    (id, opts = {}) => {
      const resolved = resolveUserModeId(id)
      if (!resolved || !isValidUserMode(resolved)) return
      setUserModeState(resolved)
      if (opts.userInitiated) {
        setOverrideFlags((current) => ({ ...current, mode: true }))
      }
      if (!overrideFlags.theme || opts.resetTheme === true) {
        setThemePresetIdState(getDefaultThemePresetForAppView(appView, resolved))
      }
      if (!overrideFlags.layout || opts.resetLayout === true) {
        setLayoutModeState(getDefaultLayoutModeForAppView(appView, resolved))
      }
    },
    [appView, overrideFlags.layout, overrideFlags.theme],
  )

  const setOperatingMode = useCallback(
    (id) => {
      setUserMode(id, { userInitiated: true })
    },
    [setUserMode],
  )

  const setIndustryId = useCallback(
    (id) => {
      const nextIndustry = id || 'saas'
      const nextProfile = normalizeBrandProfile({ ...brandProfile, industry: nextIndustry })
      setIndustryIdState(nextIndustry)
      setBrandProfileState(nextProfile)

      if (!overrideFlags.mode) {
        const nextMode = getDefaultOperatingModeForIndustry(nextIndustry)
        setUserModeState(nextMode)
        if (!overrideFlags.theme) {
          setThemePresetIdState(getDefaultThemePresetForAppView(appView, nextMode))
        }
        if (!overrideFlags.layout) {
          setLayoutModeState(getDefaultLayoutModeForAppView(appView, nextMode))
        }
      }
    },
    [appView, brandProfile, overrideFlags.layout, overrideFlags.mode, overrideFlags.theme],
  )

  const setBrandProfile = useCallback((patch) => {
    setBrandProfileState((current) => normalizeBrandProfile({ ...current, ...patch }))
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

  const clearOverrideLocks = useCallback(() => {
    setOverrideFlags({ theme: false, layout: false, mode: false })
  }, [])

  const applyPerspective = useCallback(
    (value) => {
      const defaults = resolveDefaults(value, userMode)
      setAppViewState(value)
      setOverrideFlags((current) => ({ ...current, theme: false, layout: false }))
      setThemePresetIdState(defaults.themePresetId)
      setLayoutModeState(defaults.layoutMode)
    },
    [resolveDefaults, userMode],
  )

  const resetToModeDefaults = useCallback(
    (nextMode = userMode) => {
      const defaults = resolveDefaults(appView, nextMode)
      clearOverrideLocks()
      setUserModeState(defaults.userMode)
      setThemePresetIdState(defaults.themePresetId)
      setLayoutModeState(defaults.layoutMode)
    },
    [appView, clearOverrideLocks, resolveDefaults, userMode],
  )

  const value = useMemo(
    () => ({
      appView,
      themePresetId,
      layoutMode,
      userMode,
      operatingMode: userMode,
      industryId,
      brandProfile,
      cognitiveProfileId,
      reducedMotion,
      overrideFlags,
      presetRecommendation: recommendation,
      setAppView,
      setThemePresetId,
      setLayoutMode,
      setUserMode,
      setOperatingMode,
      setIndustryId,
      setBrandProfile,
      setCognitiveProfileId,
      setReducedMotion,
      applyPerspective,
      resetToModeDefaults,
      clearOverrideLocks,
    }),
    [
      appView,
      themePresetId,
      layoutMode,
      userMode,
      industryId,
      brandProfile,
      cognitiveProfileId,
      reducedMotion,
      overrideFlags,
      recommendation,
      setAppView,
      setThemePresetId,
      setLayoutMode,
      setUserMode,
      setOperatingMode,
      setIndustryId,
      setBrandProfile,
      setCognitiveProfileId,
      setReducedMotion,
      applyPerspective,
      resetToModeDefaults,
      clearOverrideLocks,
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
