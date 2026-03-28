'use client'

import { useMartinOs } from '@/context/MartinOsProvider'

/** Static registry: expand from CMS later */
export const DESCRIPTION_REGISTRY = {
  'nav-perspective': 'Switch between PMO, Tech-Ops, and Miiddle command surfaces.',
  'nav-settings': 'Theme preset, industry default layout, and operating mode.',
  'main-outlet': 'Primary workspace for the current route.',
}

/**
 * Wraps children with title/tooltip semantics for Assisted mode.
 * @param {{ id: keyof typeof DESCRIPTION_REGISTRY, children: React.ReactNode }} props
 */
export default function DescriptionLayer({ id, children }) {
  const { operatingMode } = useMartinOs()
  const text = DESCRIPTION_REGISTRY[id] ?? ''
  const assisted = operatingMode === 'healthcare' || operatingMode === 'freelance'

  return (
    <div title={assisted && text ? text : undefined}>
      {children}
    </div>
  )
}
