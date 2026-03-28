'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import App from '@/App'

/** @typedef {'dashboard' | 'tech-ops' | 'miidle'} ActivePlugin */

/** @param {string | null} raw */
function pluginFromSearchParam(raw) {
  if (raw === 'tech-ops' || raw === 'miidle' || raw === 'dashboard') return raw
  return null
}

export default function TriNativeHome() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activePlugin, setActivePluginState] = useState(/** @type {ActivePlugin} */ ('dashboard'))

  useEffect(() => {
    const fromUrl = pluginFromSearchParam(searchParams.get('plugin'))
    if (fromUrl) {
      setActivePluginState(fromUrl)
      return
    }
    try {
      const saved = localStorage.getItem('martin-os-active-plugin')
      if (saved === 'tech-ops' || saved === 'miidle' || saved === 'dashboard') {
        setActivePluginState(saved)
      }
    } catch {
      /* ignore */
    }
  }, [searchParams])

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
