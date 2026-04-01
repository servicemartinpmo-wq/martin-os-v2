'use client'

import Image from 'next/image'
import { useReducedMotion } from 'framer-motion'

/** Hero / splash still from curated presets (4K source, responsive delivery). */
export default function PexelsBackdrop({ preset, className = '', priority = false }) {
  const reduceMotion = useReducedMotion()
  if (!preset || preset.type !== 'image') return null

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={preset.src}
        alt={preset.alt}
        fill
        sizes="100vw"
        priority={priority}
        className="object-cover"
        style={{ objectPosition: 'center' }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: reduceMotion
            ? 'var(--overlay-scrim)'
            : 'color-mix(in oklab, var(--bg-base) 35%, var(--overlay-scrim))',
        }}
        aria-hidden
      />
    </div>
  )
}
