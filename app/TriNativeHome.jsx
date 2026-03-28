'use client'

import { useCallback, useEffect, useMemo, useRef, useState, startTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import App from '../src/App'

/** @typedef {'dashboard' | 'tech-ops' | 'miidle'} ActivePlugin */

/** @param {string | null} raw */
function pluginFromSearchParam(raw) {
  if (raw === 'miiddle') return 'miidle'
  if (raw === 'tech-ops' || raw === 'miidle' || raw === 'dashboard') return raw
  return null
}

function readStoredPlugin() {
  try {
    const saved = localStorage.getItem('martin-os-active-plugin')
    if (saved === 'miiddle') return 'miidle'
    if (saved === 'tech-ops' || saved === 'miidle' || saved === 'dashboard') return saved
  } catch {
    /* ignore */
  }
  return null
}

/** URL is in sync with this plugin choice (dashboard clears `plugin` query). */
function urlMatchesChosenPlugin(urlPlugin, chosen) {
  if (chosen === 'dashboard') return urlPlugin === null
  return urlPlugin === chosen
}

export default function TriNativeHome() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlPlugin = useMemo(
    () => pluginFromSearchParam(searchParams.get('plugin')),
    [searchParams],
  )

  useEffect(() => {
    if (searchParams.get('plugin') !== 'miiddle') return
    const next = new URLSearchParams(searchParams.toString())
    next.set('plugin', 'miidle')
    const qs = next.toString()
    router.replace(qs ? `/?${qs}` : '/', { scroll: false })
  }, [router, searchParams])

  const [activePlugin, setActivePluginState] = useState(/** @type {ActivePlugin} */ ('dashboard'))
  /** Plugin the user picked; ignore stale URL / localStorage until `router.replace` catches up. */
  const pendingChoiceRef = useRef(/** @type {ActivePlugin | null} */ (null))

  useEffect(() => {
    startTransition(() => {
      const pending = pendingChoiceRef.current
      if (pending !== null) {
        if (!urlMatchesChosenPlugin(urlPlugin, pending)) {
          return
        }
        pendingChoiceRef.current = null
        setActivePluginState(pending)
        return
      }

      if (urlPlugin) {
        setActivePluginState(urlPlugin)
        return
      }
      const stored = readStoredPlugin()
      if (stored) setActivePluginState(stored)
    })
  }, [urlPlugin])

  const setActivePlugin = useCallback(
    (/** @type {ActivePlugin} */ plugin) => {
      pendingChoiceRef.current = plugin
      setActivePluginState(plugin)
      const next = new URLSearchParams(searchParams.toString())
      if (plugin === 'dashboard') {
        next.delete('plugin')
      } else {
        next.set('plugin', plugin)
      }
      const qs = next.toString()
      router.replace(qs ? `/?${qs}` : '/', { scroll: false })
    },
    [router, searchParams],
  )

  return <App activePlugin={activePlugin} onActivePluginChange={setActivePlugin} />
}
