/**
 * Martin OS curated theme and layout registry.
 * This is the single source of truth for preset metadata used by
 * the provider, settings UI, and route-aware defaults.
 */

/** @typedef {'PMO' | 'TECH_OPS' | 'MIIDLE'} AppView */
/** @typedef {'SIDEBAR_ADMIN' | 'HUD' | 'BENTO'} LayoutModeId */

export const THEME_PRESETS_V2 = [
  {
    id: 'enterprise-light',
    label: 'PMO Command',
    description: 'Clean executive command surface for planning, governance, and reporting.',
    category: 'light',
    defaultFor: ['PMO'],
    layoutMode: 'SIDEBAR_ADMIN',
    features: ['executive', 'clean', 'high-contrast'],
    preview: {
      background: 'oklch(0.98 0.005 264)',
      surface: 'oklch(1 0 0)',
      accent: 'oklch(0.55 0.2 250)',
      text: 'oklch(0.15 0.02 264)',
    },
  },
  {
    id: 'cyber-hud',
    label: 'Tech-Ops HUD',
    description: 'High-visibility neon operations view for live systems, alerts, and diagnostics.',
    category: 'dark',
    defaultFor: ['TECH_OPS'],
    layoutMode: 'HUD',
    features: ['neon-glow', 'monospace', 'operations'],
    preview: {
      background: 'oklch(0.08 0.02 270)',
      surface: 'oklch(0.12 0.025 270)',
      accent: 'oklch(0.7 0.25 170)',
      text: 'oklch(0.95 0.01 270)',
    },
  },
  {
    id: 'dark-glass',
    label: 'Miiddle Workspace',
    description: 'Glass-heavy creative workspace for capture streams, story building, and proof-of-work.',
    category: 'dark',
    defaultFor: ['MIIDLE'],
    layoutMode: 'BENTO',
    features: ['glassmorphism', 'editorial', 'creative'],
    preview: {
      background: 'oklch(0.14 0.015 260)',
      surface: 'oklch(0.22 0.03 260 / 0.7)',
      accent: 'oklch(0.68 0.16 300)',
      text: 'oklch(0.96 0.01 260)',
    },
  },
  {
    id: 'wellness-soft',
    label: 'Soft Focus',
    description: 'Low-friction warm preset for long operating sessions and calmer review modes.',
    category: 'light',
    defaultFor: [],
    layoutMode: 'SIDEBAR_ADMIN',
    features: ['calming', 'soft', 'accessible'],
    preview: {
      background: 'oklch(0.97 0.015 85)',
      surface: 'oklch(1 0 0)',
      accent: 'oklch(0.65 0.14 145)',
      text: 'oklch(0.18 0.02 85)',
    },
  },
  {
    id: 'assist-hc',
    label: 'Assist High Contrast',
    description: 'Large-target, high-contrast preset for reduced complexity and accessibility-first flows.',
    category: 'dark',
    defaultFor: [],
    layoutMode: 'SIDEBAR_ADMIN',
    features: ['accessibility', 'high-contrast', 'assistive'],
    preview: {
      background: 'oklch(0.08 0 0)',
      surface: 'oklch(0.16 0.02 260)',
      accent: 'oklch(0.75 0.2 250)',
      text: 'oklch(0.99 0 0)',
    },
  },
]

export const LAYOUT_MODES = [
  {
    id: 'SIDEBAR_ADMIN',
    label: 'Sidebar Admin',
    description: 'Structured command layout with fixed navigation and broad content grid.',
    icon: 'sidebar',
    features: ['sticky-sidebar', 'command-center', 'dense'],
  },
  {
    id: 'HUD',
    label: 'HUD',
    description: 'Heads-up display with floating operational chrome and high-visibility status regions.',
    icon: 'layout-dashboard',
    features: ['floating-panels', 'overlay', 'monitoring'],
  },
  {
    id: 'BENTO',
    label: 'Bento',
    description: 'Editorial workspace with interlocking cards for creative and knowledge-heavy flows.',
    icon: 'grid-3x3',
    features: ['editorial', 'responsive', 'creative'],
  },
]

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

export const MOTION_ANIMATIONS = [
  { id: 'fadeIn', label: 'Fade In', category: 'fade', duration: 'var(--duration-normal)' },
  { id: 'fadeOut', label: 'Fade Out', category: 'fade', duration: 'var(--duration-normal)' },
  { id: 'slideInUp', label: 'Slide Up', category: 'slide', duration: 'var(--duration-normal)' },
  { id: 'slideInDown', label: 'Slide Down', category: 'slide', duration: 'var(--duration-normal)' },
  { id: 'slideInLeft', label: 'Slide Left', category: 'slide', duration: 'var(--duration-normal)' },
  { id: 'slideInRight', label: 'Slide Right', category: 'slide', duration: 'var(--duration-normal)' },
  { id: 'scaleIn', label: 'Scale In', category: 'scale', duration: 'var(--duration-normal)' },
  { id: 'scaleOut', label: 'Scale Out', category: 'scale', duration: 'var(--duration-normal)' },
  { id: 'bounceIn', label: 'Bounce In', category: 'bounce', duration: '0.6s' },
  { id: 'flipInX', label: 'Flip X', category: 'flip', duration: '0.5s' },
  { id: 'flipInY', label: 'Flip Y', category: 'flip', duration: '0.5s' },
  { id: 'rotateIn', label: 'Rotate In', category: 'rotate', duration: '0.5s' },
  { id: 'shake', label: 'Shake', category: 'alert', duration: '0.4s' },
]

const LEGACY_THEME_ALIASES = {
  pmo: 'enterprise-light',
  tech_ops: 'cyber-hud',
  miidle: 'dark-glass',
  midnight: 'dark-glass',
  assist_hc: 'assist-hc',
}

/**
 * Map legacy or canonical theme ids to the curated registry.
 * @param {string | null | undefined} id
 */
export function resolveThemePresetId(id) {
  const raw = typeof id === 'string' ? id.trim() : ''
  if (!raw) return null
  return LEGACY_THEME_ALIASES[raw] ?? raw
}

/**
 * Get default theme preset for app view.
 * @param {AppView} appView
 */
export function getDefaultThemePresetForAppView(appView) {
  const preset = THEME_PRESETS_V2.find((row) => row.defaultFor.includes(appView))
  return preset?.id ?? 'enterprise-light'
}

/**
 * Get default layout mode for app view.
 * @param {AppView} appView
 * @returns {LayoutModeId}
 */
export function getDefaultLayoutModeForAppView(appView) {
  const preset = THEME_PRESETS_V2.find((row) => row.defaultFor.includes(appView))
  return /** @type {LayoutModeId} */ (preset?.layoutMode ?? 'SIDEBAR_ADMIN')
}

/**
 * Validate theme preset ID.
 * @param {string} id
 */
export function isValidThemePresetV2(id) {
  const resolved = resolveThemePresetId(id)
  return THEME_PRESETS_V2.some((preset) => preset.id === resolved)
}

/**
 * Validate layout mode ID.
 * @param {string} id
 */
export function isValidLayoutMode(id) {
  return LAYOUT_MODES.some((mode) => mode.id === id)
}

/**
 * Validate AI presence state.
 * @param {string} id
 */
export function isValidAIPresenceState(id) {
  return AI_PRESENCE_STATES.some((state) => state.id === id)
}

/**
 * Get theme preset by ID.
 * @param {string} id
 */
export function getThemePresetById(id) {
  const resolved = resolveThemePresetId(id)
  return THEME_PRESETS_V2.find((preset) => preset.id === resolved)
}

/**
 * Get layout mode by ID.
 * @param {string} id
 */
export function getLayoutModeById(id) {
  return LAYOUT_MODES.find((mode) => mode.id === id)
}

/**
 * Get AI presence state by ID.
 * @param {string} id
 */
export function getAIPresenceStateById(id) {
  return AI_PRESENCE_STATES.find((state) => state.id === id)
}

/**
 * Get animation by ID.
 * @param {string} id
 */
export function getAnimationById(id) {
  return MOTION_ANIMATIONS.find((animation) => animation.id === id)
}

/**
 * Get animations by category.
 * @param {string} category
 */
export function getAnimationsByCategory(category) {
  return MOTION_ANIMATIONS.filter((animation) => animation.category === category)
}
