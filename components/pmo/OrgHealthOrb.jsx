'use client'

import { useEffect, useRef, useState } from 'react'

function tierLabel(score) {
  if (score < 20) return 'Unstructured'
  if (score < 40) return 'Foundational'
  if (score < 55) return 'Developing'
  if (score < 70) return 'Structured'
  if (score < 85) return 'Managed'
  return 'Optimized'
}

/**
 * Living orb visual from mpo-pilot, using Martin OS semantic tokens (no extra Tailwind palette).
 * @param {{ score: number, size?: 'sm'|'md'|'lg', showLabel?: boolean, animated?: boolean }} props
 */
export default function OrgHealthOrb({ score, size = 'md', showLabel = true, animated = true }) {
  const clamped = Math.max(0, Math.min(100, Number(score) || 0))
  const [displayed, setDisplayed] = useState(0)
  const rafRef = useRef(null)

  useEffect(() => {
    if (!animated) return
    let current = 0
    const step = () => {
      current = Math.min(current + 1.2, clamped)
      setDisplayed(Math.round(current))
      if (current < clamped) rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [clamped, animated])

  const shown = animated ? displayed : clamped
  const sat = Math.round((shown / 100) * 100)
  const greyBlend = Math.max(0, 1 - shown / 100)

  const px = { sm: 80, md: 128, lg: 176 }[size]
  const fontSize = { sm: '1.25rem', md: '1.875rem', lg: '2.5rem' }[size]

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="relative flex items-center justify-center rounded-full"
        style={{ width: px, height: px }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle at 50% 50%, color-mix(in oklab, var(--accent) ${25 + shown * 0.25}%, transparent), transparent 70%)`,
            filter: `blur(${4 + shown / 10}px)`,
            transform: 'scale(1.25)',
          }}
        />
        <div
          className="absolute inset-0 rounded-full transition-all duration-300"
          style={{
            background: `radial-gradient(circle at 35% 32%,
              color-mix(in oklab, var(--accent) ${Math.round(sat * 0.6)}%, white ${Math.round(greyBlend * 40)}%) 0%,
              color-mix(in oklab, var(--accent) ${sat}%, var(--bg-elevated) ${Math.round(greyBlend * 80)}%) 45%,
              var(--surface-elevated) 100%)`,
            boxShadow: `inset 0 1px 0 color-mix(in oklab, white 20%, transparent), 0 8px 32px color-mix(in oklab, var(--accent) ${15 + shown * 0.15}%, transparent)`,
          }}
        />
        <span
          className="relative z-[1] font-display font-semibold tabular-nums"
          style={{ fontSize, color: 'var(--text-primary)' }}
        >
          {shown}
        </span>
      </div>
      {showLabel ? (
        <p className="text-center text-xs" style={{ color: 'var(--text-muted)' }}>
          {tierLabel(shown)}
        </p>
      ) : null}
    </div>
  )
}
