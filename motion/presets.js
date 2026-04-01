/**
 * Motion presets — luxury / snappy micro-interactions.
 * Prefer transform + opacity; respect reduced motion in components.
 */

/** @type {import('framer-motion').Transition} */
export const springLayoutTransition = {
  type: 'spring',
  stiffness: 520,
  damping: 38,
  mass: 0.7,
}

/** @type {import('framer-motion').Transition} */
export const fadeScaleFast = {
  duration: 0.2,
  ease: [0.22, 1, 0.36, 1],
}

/** Stagger for list children (seconds) */
export const staggerChildren = 0.04
