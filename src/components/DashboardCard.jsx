'use client'

import { useMartinOs } from '@/context/MartinOsProvider'
import { cn } from '@/lib/cn'
import Image from 'next/image'

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
  const creative = operatingMode === 'creative'
  const showCover = creative && coverImageUrl

  if (creative && !coverImageUrl) {
    /* Creative contract: cover placeholder uses chrome gradient */
  }

  return (
    <article
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
