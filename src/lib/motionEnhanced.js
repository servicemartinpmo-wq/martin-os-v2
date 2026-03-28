/**
 * Enhanced Motion Presets
 * Comprehensive animation library for Martin OS
 * Integrates with Framer Motion
 */

import { springLayoutTransition, fadeScaleFast } from '@/motion/presets'

// ========================================
// TRANSITION PRESETS
// ========================================

export const TRANSITIONS = {
  // Fast micro-interactions
  instant: { duration: 0.1, ease: 'linear' },
  fast: { duration: 0.2, ease: [0.22, 1, 0.36, 1] },
  normal: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  slow: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  slower: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },

  // Bouncy
  bouncy: { duration: 0.4, ease: [0.68, -0.55, 0.265, 1.55] },
  spring: springLayoutTransition,
  gentleSpring: {
    type: 'spring',
    stiffness: 300,
    damping: 30,
    mass: 0.8,
  },

  // Entrance/Exit
  enter: { duration: 0.3, ease: 'easeOut' },
  exit: { duration: 0.2, ease: 'easeIn' },
  fadeScaleFast,
}

// ========================================
// VARIANTS
// ========================================

/**
 * Fade variants
 */
export const fadeVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
}

/**
 * Scale variants
 */
export const scaleVariants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { scale: 1, opacity: 1 },
  exit: { scale: 0.9, opacity: 0 },
}

/**
 * Slide up variants
 */
export const slideUpVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
  exit: { y: -20, opacity: 0 },
}

/**
 * Slide down variants
 */
export const slideDownVariants = {
  hidden: { y: -20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
  exit: { y: 20, opacity: 0 },
}

/**
 * Slide left variants
 */
export const slideLeftVariants = {
  hidden: { x: 20, opacity: 0 },
  visible: { x: 0, opacity: 1 },
  exit: { x: -20, opacity: 0 },
}

/**
 * Slide right variants
 */
export const slideRightVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: { x: 0, opacity: 1 },
  exit: { x: 20, opacity: 0 },
}

/**
 * Staggered list variants
 */
export const staggeredVariants = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  },
  item: {
    hidden: { y: 10, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  },
}

/**
 * Accordion variants
 */
export const accordionVariants = {
  open: {
    height: 'auto',
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: [0.04, 0.62, 0.23, 0.98],
    },
  },
  closed: {
    height: 0,
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: [0.04, 0.62, 0.23, 0.98],
    },
  },
}

/**
 * Drawer variants
 */
export const drawerVariants = {
  open: () => ({
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  }),
  closed: (direction = 'right') => {
    const closedStates = {
      right: { x: '100%' },
      left: { x: '-100%' },
      top: { y: '-100%' },
      bottom: { y: '100%' },
    }
    return {
      ...closedStates[direction],
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: 'easeIn',
      },
    }
  },
}

/**
 * Modal variants
 */
export const modalVariants = {
  backdrop: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  },
  content: {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
    exit: { scale: 0.9, opacity: 0 },
  },
}

/**
 * Toast variants
 */
export const toastVariants = {
  enter: () => ({
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  }),
  exit: (direction = 'right') => {
    const exitStates = {
      right: { x: '100%', opacity: 0 },
      left: { x: '-100%', opacity: 0 },
      top: { y: '-100%', opacity: 0 },
      bottom: { y: '100%', opacity: 0 },
    }
    return {
      ...exitStates[direction],
      transition: {
        duration: 0.2,
        ease: 'easeIn',
      },
    }
  },
}

/**
 * Tooltip variants
 */
export const tooltipVariants = {
  hidden: {
    scale: 0.9,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.15,
      ease: 'easeOut',
    },
  },
}

// ========================================
// HOVER EFFECTS
// ========================================

export const hoverEffects = {
  scale: {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  },
  lift: {
    hover: { y: -4 },
    tap: { y: 0 },
  },
  glow: {
    hover: { filter: 'brightness(1.1)' },
    tap: { filter: 'brightness(0.9)' },
  },
  rotate: {
    hover: { rotate: 5 },
    tap: { rotate: 0 },
  },
  flip: {
    hover: { rotateY: 180 },
    tap: { rotateY: 180 },
  },
}

// ========================================
// ANIMATION PROPS GENERATORS
// ========================================

/**
 * Generate fade-in animation props
 */
export function fadeIn(delay = 0) {
  return {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3, delay },
  }
}

/**
 * Generate slide-in animation props
 */
export function slideIn(direction = 'up', distance = 20, delay = 0) {
  const directions = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
  }

  return {
    initial: { opacity: 0, ...directions[direction] },
    animate: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, ...directions[direction] },
    transition: { duration: 0.3, delay },
  }
}

/**
 * Generate scale-in animation props
 */
export function scaleIn(delay = 0) {
  return {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.9, opacity: 0 },
    transition: { duration: 0.3, delay },
  }
}

/**
 * Generate staggered animation props for list items
 */
export function staggeredChildren(count, baseDelay = 0.05) {
  return {
    initial: { opacity: 0, y: 10 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: baseDelay,
      },
    },
  }
}

// ========================================
// LAYOUT ANIMATIONS
// ========================================

export const layoutAnimations = {
  // List item reorder
  reorder: {
    layout: true,
    transition: {
      type: 'spring',
      stiffness: 350,
      damping: 30,
    },
  },

  // Grid reflow
  grid: {
    layout: true,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
    },
  },

  // Flex reflow
  flex: {
    layout: true,
    transition: {
      type: 'spring',
      stiffness: 350,
      damping: 30,
    },
  },
}

// ========================================
// REDUCED MOTION SUPPORT
// ========================================

/**
 * Get reduced motion aware animation props
 */
export function reduceMotion(animateProps) {
  if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    return {
      ...animateProps,
      transition: { duration: 0 },
    }
  }
  return animateProps
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Generate animation delay based on index
 */
export function getStaggerDelay(index, baseDelay = 0.05) {
  return index * baseDelay
}

/**
 * Check if motion is reduced
 */
export function isMotionReduced() {
  if (typeof window === 'undefined') return false
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

/**
 * Get appropriate transition duration
 */
export function getTransitionDuration(speed = 'normal') {
  if (isMotionReduced()) return 0
  return TRANSITIONS[speed]?.duration || TRANSITIONS.normal.duration
}

// ========================================
// EXPORT ALL
// ========================================

export default {
  transitions: TRANSITIONS,
  variants: {
    fade: fadeVariants,
    scale: scaleVariants,
    slideUp: slideUpVariants,
    slideDown: slideDownVariants,
    slideLeft: slideLeftVariants,
    slideRight: slideRightVariants,
    staggered: staggeredVariants,
    accordion: accordionVariants,
    drawer: drawerVariants,
    modal: modalVariants,
    toast: toastVariants,
    tooltip: tooltipVariants,
  },
  hover: hoverEffects,
  layout: layoutAnimations,
  helpers: {
    fadeIn,
    slideIn,
    scaleIn,
    staggeredChildren,
    reduceMotion,
    isMotionReduced,
    getTransitionDuration,
    getStaggerDelay,
  },
}
