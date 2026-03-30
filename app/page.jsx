'use client'

import dynamic from 'next/dynamic'

const V3AppClient = dynamic(() => import('@/v3/V3AppClient'), { ssr: false })

/** Default experience now serves the v3 Next.js + Tailwind workspace. */
export default function HomePage() {
  return <V3AppClient />
}
