'use client'

import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'martin-os-unlock-banner-dismissed'

export default function MissionUnlockBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      setVisible(localStorage.getItem(STORAGE_KEY) !== '1')
    } catch {
      setVisible(true)
    }
  }, [])

  const dismiss = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, '1')
    } catch {
      /* ignore */
    }
    setVisible(false)
  }, [])

  if (!visible) return null

  return (
    <div
      className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-[#001F3F] px-4 py-2.5 text-sm text-white md:px-8"
      role="region"
      aria-label="Product notice"
    >
      <p className="min-w-0 flex-1 font-medium">
        Unlock more with Martin PMO-Ops — deeper diagnostics, portfolio views, and command workflows.
      </p>
      <button
        type="button"
        onClick={dismiss}
        className="shrink-0 rounded-full border border-white/30 px-3 py-1 text-xs font-semibold tracking-wide text-white uppercase transition-colors hover:bg-white/10"
      >
        Dismiss
      </button>
    </div>
  )
}
