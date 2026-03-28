'use client'

import { Suspense } from 'react'
import TriNativeHome from './TriNativeHome'

function TriNativeFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center text-sm text-neutral-500">
      Loading…
    </div>
  )
}

/**
 * Tri-native MARTIN OS home: PMO-Ops host with Tech-Ops and Miidle as native plugins.
 * Plugin: `/?plugin=tech-ops` | `miidle` (PMO when omitted). Chrome is `AppShell` in `app/providers.jsx`.
 */
export default function HomePage() {
  return (
    <Suspense fallback={<TriNativeFallback />}>
      <TriNativeHome />
    </Suspense>
  )
}
