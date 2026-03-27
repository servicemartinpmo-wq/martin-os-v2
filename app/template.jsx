'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { fadeScaleFast } from '@/motion/presets'

export default function Template({ children }) {
  const pathname = usePathname() ?? '/'
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      key={pathname}
      initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={reduceMotion ? { duration: 0 } : fadeScaleFast}
    >
      {children}
    </motion.div>
  )
}
