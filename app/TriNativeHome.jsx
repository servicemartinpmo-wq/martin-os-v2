'use client'

import { useCallback, useEffect, useMemo, useState, startTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import App from '@/App'

/** @typedef {'dashboard' | 'tech-ops' | 'miidle'} ActivePlugin */

/** @param {string | null} raw */
function pluginFromSearchParam(raw) {
  if (raw === 'tech-ops' || raw === 'miidle' || raw === 'dashboard') return raw
  return null
}

function readStoredPlugin() {
  try {
    const saved = localStorage.getItem('martin-os-active-plugin')
    if (saved === 'tech-ops' || saved === 'miidle' || saved === 'dashboard') return saved
  } catch {
    /* ignore */
  }
  return null
}

export default function TriNativeHome() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlPlugin = useMemo(
    () => pluginFromSearchParam(searchParams.get('plugin')),
    [searchParams],
  )

  const [activePlugin, setActivePluginState] = useState(/** @type {ActivePlugin} */ ('dashboard'))

  useEffect(() => {
    startTransition(() => {
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
