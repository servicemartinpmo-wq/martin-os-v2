/**
 * Enhanced Theme Presets v2.0
 * 4 presets: enterprise-light, cyber-hud, dark-glass, wellness-soft
 */

export const THEME_PRESETS_V2 = [
  {
    id: 'enterprise-light',
    label: 'Enterprise Light',
    description: 'Clean, professional interface for corporate environments',
    category: 'light',
    defaultFor: ['PMO', 'MIIDLE'],
    features: ['high-contrast', 'accessibility', 'print-friendly'],
  },
  {
    id: 'cyber-hud',
    label: 'Cyber HUD',
    description: 'Futuristic dark interface with neon accents',
    category: 'dark',
    defaultFor: ['TECH_OPS'],
    features: ['scanlines', 'neon-glow', 'cyberpunk'],
  },
  {
    id: 'dark-glass',
    label: 'Dark Glass',
    description: 'Sophisticated glassmorphism with purple accents',
    category: 'dark',
    defaultFor: [],
    features: ['glassmorphism', 'subtle', 'modern'],
  },
  {
    id: 'wellness-soft',
    label: 'Wellness Soft',
    description: 'Calming interface with warm tones and sage accents',
    category: 'light',
    defaultFor: [],
    features: ['calming', 'soft', 'accessible'],
  },
]

/**
 * Layout modes
 */
export const LAYOUT_MODES = [
  {
    id: 'SIDEBAR_ADMIN',
    label: 'Sidebar Admin',
    description: 'Classic admin layout with sidebar navigation',
    icon: 'sidebar',
    features: ['sticky-sidebar', 'structured', 'hierarchical'],
  },
  {
    id: 'HUD',
    label: 'HUD Mode',
    description: 'Heads-up display with floating panels',
    icon: 'layout-dashboard',
    features: ['floating-panels', 'collapsible', 'tech-ops'],
  },
  {
    id: 'BENTO',
    label: 'Bento Grid',
    description: 'Editorial grid layout with flexible cards',
    icon: 'grid-3x3',
    features: ['editorial', 'responsive', 'creative'],
  },
]

/**
 * AI presence states
 */
export const AI_PRESENCE_STATES = [
  {
    id: 'idle',
    label: 'Ready',
    description: 'AI is available and waiting',
    color: 'var(--ai-idle)',
  },
  {
    id: 'active',
    label: 'Active',
    description: 'AI is processing your request',
    color: 'var(--ai-active)',
  },
  {
    id: 'processing',
    label: 'Thinking',
    description: 'AI is analyzing data',
    color: 'var(--ai-processing)',
  },
  {
    id: 'typing',
    label: 'Typing',
    description: 'AI is generating a response',
    color: 'var(--ai-active)',
  },
]

/**
 * Motion animations
 */
export const MOTION_ANIMATIONS = [
  {
    id: 'fadeIn',
    label: 'Fade In',
    category: 'fade',
    duration: 'var(--duration-normal)',
  },
  {
    id: 'fadeOut',
    label: 'Fade Out',
    category: 'fade',
    duration: 'var(--duration-normal)',
  },
  {
    id: 'slideInUp',
    label: 'Slide Up',
    category: 'slide',
    duration: 'var(--duration-normal)',
  },
  {
    id: 'slideInDown',
    label: 'Slide Down',
    category: 'slide',
    duration: 'var(--duration-normal)',
  },
  {
    id: 'slideInLeft',
    label: 'Slide Left',
    category: 'slide',
    duration: 'var(--duration-normal)',
  },
  {
    id: 'slideInRight',
    label: 'Slide Right',
    category: 'slide',
    duration: 'var(--duration-normal)',
  },
  {
    id: 'scaleIn',
    label: 'Scale In',
    category: 'scale',
    duration: 'var(--duration-normal)',
  },
  {
    id: 'scaleOut',
    label: 'Scale Out',
    category: 'scale',
    duration: 'var(--duration-normal)',
  },
  {
    id: 'bounceIn',
    label: 'Bounce In',
    category: 'bounce',
    duration: '0.6s',
  },
  {
    id: 'flipInX',
    label: 'Flip X',
    category: 'flip',
    duration: '0.5s',
  },
  {
    id: 'flipInY',
    label: 'Flip Y',
    category: 'flip',
    duration: '0.5s',
  },
  {
    id: 'rotateIn',
    label: 'Rotate In',
    category: 'rotate',
    duration: '0.5s',
  },
  {
    id: 'shake',
    label: 'Shake',
    category: 'alert',
    duration: '0.4s',
  },
]

/**
 * Get default theme preset for app view
 */
export function getDefaultThemePresetForAppView(appView) {
  const preset = THEME_PRESETS_V2.find((p) => p.defaultFor.includes(appView))
  return preset?.id || 'enterprise-light'
}

/**
 * Get default layout mode for app view
 */
export function getDefaultLayoutModeForAppView(appView) {
  switch (appView) {
    case 'TECH_OPS':
      return 'HUD'
    case 'PMO':
    case 'MIIDLE':
    default:
      return 'SIDEBAR_ADMIN'
  }
}

/**
 * Validate theme preset ID
 */
export function isValidThemePresetV2(id) {
  return THEME_PRESETS_V2.some((p) => p.id === id)
}

/**
 * Validate layout mode ID
 */
export function isValidLayoutMode(id) {
  return LAYOUT_MODES.some((m) => m.id === id)
}

/**
 * Validate AI presence state
 */
export function isValidAIPresenceState(id) {
  return AI_PRESENCE_STATES.some((s) => s.id === id)
}

/**
 * Get theme preset by ID
 */
export function getThemePresetById(id) {
  return THEME_PRESETS_V2.find((p) => p.id === id)
}

/**
 * Get layout mode by ID
 */
export function getLayoutModeById(id) {
  return LAYOUT_MODES.find((m) => m.id === id)
}

/**
 * Get AI presence state by ID
 */
export function getAIPresenceStateById(id) {
  return AI_PRESENCE_STATES.find((s) => s.id === id)
}

/**
 * Get animation by ID
 */
export function getAnimationById(id) {
  return MOTION_ANIMATIONS.find((a) => a.id === id)
}

/**
 * Get animations by category
 */
export function getAnimationsByCategory(category) {
  return MOTION_ANIMATIONS.filter((a) => a.category === category)
}
