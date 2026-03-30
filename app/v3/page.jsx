'use client'

import dynamic from 'next/dynamic'

const V3AppClient = dynamic(() => import('@/v3/V3AppClient'), { ssr: false })

export default function V3Page() {
  return <V3AppClient />
}
