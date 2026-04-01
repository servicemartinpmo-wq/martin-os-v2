'use client'

import { useReducedMotion } from 'framer-motion'
import { useCallback } from 'react'

/**
 * Pointer-reactive glow (--glow-x, --glow-y, --glow-opacity) on host element.
 * Disabled for reduced motion / coarse pointer.
 * @param {React.RefObject<HTMLElement | null>} hostRef
 */
export function useCursorGlow(hostRef) {
  const reduceMotion = useReducedMotion()

  return useCallback(
    (e) => {
      const el = hostRef.current
      if (!el || reduceMotion) return
      if (window.matchMedia('(pointer: coarse)').matches) return
      const r = el.getBoundingClientRect()
      const x = ((e.clientX - r.left) / r.width) * 100
      const y = ((e.clientY - r.top) / r.height) * 100
      el.style.setProperty('--glow-x', `${x}%`)
      el.style.setProperty('--glow-y', `${y}%`)
      el.style.setProperty('--glow-opacity', '0.55')
    },
    [hostRef, reduceMotion],
  )
}

export function useCursorGlowLeave(hostRef) {
  const reduceMotion = useReducedMotion()

  return useCallback(() => {
    const el = hostRef.current
    if (!el || reduceMotion) return
    el.style.setProperty('--glow-opacity', '0')
  }, [hostRef, reduceMotion])
}
