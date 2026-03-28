'use client'

import { useRef } from 'react'
import { useMartinOs } from '@/context/MartinOsProvider'
import { cn } from '@/lib/cn'
import Image from 'next/image'
import { useCursorGlow, useCursorGlowLeave } from '@/hooks/useCursorGlow'

/**
 * @param {{
 *   title: string,
 *   subtitle?: string,
 *   children?: React.ReactNode,
 *   coverImageUrl?: string,
 *   coverAlt?: string,
 *   className?: string,
 *   glow?: boolean,
 * }} props
 */
export default function DashboardCard({
  title,
  subtitle,
  children,
  coverImageUrl,
  coverAlt = '',
  className = '',
  glow = false,
}) {
  const { operatingMode } = useMartinOs()
  const hostRef = useRef(/** @type {HTMLElement | null} */ (null))
  const onGlowMove = useCursorGlow(hostRef)
  const onGlowLeave = useCursorGlowLeave(hostRef)
  const creative = operatingMode === 'creative'
  const showCover = creative && coverImageUrl

  if (creative && !coverImageUrl) {
    /* Creative contract: cover placeholder uses chrome gradient */
  }

  return (
    <article
      ref={hostRef}
      onMouseMove={glow ? onGlowMove : undefined}
      onMouseLeave={glow ? onGlowLeave : undefined}
      className={cn('glass-panel overflow-hidden', glow && 'glow-host relative', className)}
    >
      {showCover ? (
        <div className="relative aspect-[21/9] w-full max-h-48">
          <Image
            src={coverImageUrl}
            alt={coverAlt}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
            style={{ objectPosition: 'center' }}
          />
          <div
            className="absolute inset-0"
            style={{ background: 'var(--overlay-scrim)' }}
          />
        </div>
      ) : creative ? (
        <div
          className="h-28 w-full"
          style={{ background: 'var(--edge-chrome)' }}
          aria-hidden
        />
      ) : null}
      <div className="p-5">
        <header>
          <h3 className="font-display text-lg font-semibold">{title}</h3>
          {subtitle ? (
            <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
              {subtitle}
            </p>
          ) : null}
        </header>
        {children ? <div className="mt-4">{children}</div> : null}
      </div>
    </article>
  )
}
