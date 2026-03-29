'use client'

import { Suspense } from 'react'
import TriNativeHome from '../TriNativeHome'

function TriNativeFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center text-sm text-neutral-500">
      Loading…
    </div>
  )
}

/**
 * Legacy tri-native MARTIN OS home preserved at /legacy.
 */
export default function LegacyHomePage() {
  return (
    <Suspense fallback={<TriNativeFallback />}>
      <TriNativeHome />
    </Suspense>
  )
}
