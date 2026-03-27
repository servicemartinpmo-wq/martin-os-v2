'use client'

import { useMartinOs } from '@/context/MartinOsProvider'
import AssistedShell from '@/layouts/AssistedShell'
import CreativeShell from '@/layouts/CreativeShell'
import ProjectShell from '@/layouts/ProjectShell'
import FounderShell from '@/layouts/FounderShell'
import { AnimatePresence, motion } from 'framer-motion'
import { fadeScaleFast } from '@/motion/presets'
import { useReducedMotion } from 'framer-motion'

/**
 * @param {{ sidebar: React.ReactNode, children: React.ReactNode, layoutKey?: string }} props
 */
export default function LayoutOrchestrator({ sidebar, children, layoutKey = 'main' }) {
  const { operatingMode } = useMartinOs()
  const reduceMotion = useReducedMotion()

  const Shell =
    operatingMode === 'assisted'
      ? AssistedShell
      : operatingMode === 'creative'
        ? CreativeShell
        : operatingMode === 'founder'
          ? FounderShell
          : ProjectShell

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${operatingMode}-${layoutKey}`}
        initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={reduceMotion ? undefined : { opacity: 0, scale: 0.98 }}
        transition={reduceMotion ? { duration: 0 } : fadeScaleFast}
      >
        <Shell sidebar={sidebar}>{children}</Shell>
      </motion.div>
    </AnimatePresence>
  )
}
