/**
 * Martin OS experience registry.
 * Single source of truth for user modes, layout archetypes, curated presets,
 * and deterministic intake-driven preset recommendations.
 */

/** @typedef {'PMO' | 'TECH_OPS' | 'MIIDLE'} AppView */
/** @typedef {'SIDEBAR_COMMAND' | 'FILTER_GRID' | 'EDGE_TILE' | 'ENTERPRISE_GRID' | 'COMMAND_CENTER' | 'FLOATING_WORKSPACE' | 'CREATIVE_ASYMMETRIC' | 'MOBILE_STACK'} LayoutModeId */
/** @typedef {'founder_operator_smb' | 'executive' | 'creative' | 'admin_project' | 'healthcare' | 'startup' | 'freelance'} UserModeId */

export const USER_MODES = [
  {
    id: 'founder_operator_smb',
    label: 'Founder / Operator / SMB',
    description:
      'High-signal operating mode for owners balancing company health, execution, revenue, and intervention queues.',
    tone: 'command',
    density: 'high',
    workflowEmphasis: ['health', 'risk', 'cash', 'throughput'],
    priorityWidgets: ['org-health', 'decision-queue', 'workflow-health', 'top-actions'],
    defaultThemePresetId: 'founder-command',
    defaultLayoutMode: 'SIDEBAR_COMMAND',
    defaultForAppViews: {
      PMO: { themePresetId: 'founder-command', layoutMode: 'SIDEBAR_COMMAND' },
      TECH_OPS: { themePresetId: 'industrial-command', layoutMode: 'COMMAND_CENTER' },
      MIIDLE: { themePresetId: 'creator-nightshift', layoutMode: 'CREATIVE_ASYMMETRIC' },
    },
  },
  {
    id: 'executive',
    label: 'Executive',
    description:
      'Presentation-ready mode that prioritizes strategic narrative, top-line metrics, summaries, and portfolio clarity.',
    tone: 'briefing',
    density: 'balanced',
    workflowEmphasis: ['summary', 'forecast', 'exceptions', 'governance'],
    priorityWidgets: ['executive-summary', 'forecast', 'exceptions', 'portfolio-overview'],
    defaultThemePresetId: 'executive-brief',
    defaultLayoutMode: 'ENTERPRISE_GRID',
    defaultForAppViews: {
      PMO: { themePresetId: 'executive-brief', layoutMode: 'ENTERPRISE_GRID' },
      TECH_OPS: { themePresetId: 'executive-brief', layoutMode: 'ENTERPRISE_GRID' },
      MIIDLE: { themePresetId: 'executive-brief', layoutMode: 'FLOATING_WORKSPACE' },
    },
  },
  {
    id: 'creative',
    label: 'Creative',
    description:
      'Editorial and story-driven workspace for proof-of-work, media, bento layouts, and asymmetrical composition.',
    tone: 'editorial',
    density: 'expressive',
    workflowEmphasis: ['story', 'proof', 'capture', 'portfolio'],
    priorityWidgets: ['capture-stream', 'artifact-board', 'story-jobs', 'templates'],
    defaultThemePresetId: 'creator-nightshift',
    defaultLayoutMode: 'CREATIVE_ASYMMETRIC',
    defaultForAppViews: {
      PMO: { themePresetId: 'creator-nightshift', layoutMode: 'EDGE_TILE' },
      TECH_OPS: { themePresetId: 'creator-nightshift', layoutMode: 'FLOATING_WORKSPACE' },
      MIIDLE: { themePresetId: 'creator-nightshift', layoutMode: 'CREATIVE_ASYMMETRIC' },
    },
  },
  {
    id: 'admin_project',
    label: 'Admin / Project',
    description:
      'Structured task-and-table-heavy mode for formal execution management, governance routines, and operational follow-through.',
    tone: 'structured',
    density: 'high',
    workflowEmphasis: ['tasks', 'tables', 'sops', 'compliance'],
    priorityWidgets: ['task-board', 'status-table', 'sla-board', 'routing'],
    defaultThemePresetId: 'admin-blueprint',
    defaultLayoutMode: 'ENTERPRISE_GRID',
    defaultForAppViews: {
      PMO: { themePresetId: 'admin-blueprint', layoutMode: 'ENTERPRISE_GRID' },
      TECH_OPS: { themePresetId: 'admin-blueprint', layoutMode: 'FILTER_GRID' },
      MIIDLE: { themePresetId: 'admin-blueprint', layoutMode: 'SIDEBAR_COMMAND' },
    },
  },
  {
    id: 'healthcare',
    label: 'Healthcare',
    description:
      'Softer, clearer operating mode tuned for regulated workflows, patient-like status clarity, and reduced cognitive friction.',
    tone: 'calm',
    density: 'comfortable',
    workflowEmphasis: ['status', 'compliance', 'handoffs', 'service'],
    priorityWidgets: ['care-status', 'service-queue', 'alerts', 'readiness'],
    defaultThemePresetId: 'care-soft',
    defaultLayoutMode: 'FLOATING_WORKSPACE',
    defaultForAppViews: {
      PMO: { themePresetId: 'care-soft', layoutMode: 'ENTERPRISE_GRID' },
      TECH_OPS: { themePresetId: 'care-soft', layoutMode: 'FLOATING_WORKSPACE' },
      MIIDLE: { themePresetId: 'care-soft', layoutMode: 'MOBILE_STACK' },
    },
  },
  {
    id: 'startup',
    label: 'Start-Up',
    description:
      'Momentum-oriented mode for investor readiness, launch metrics, product progress, and rapid iteration loops.',
    tone: 'energetic',
    density: 'balanced',
    workflowEmphasis: ['growth', 'launch', 'product', 'velocity'],
    priorityWidgets: ['growth', 'fundraising', 'experiments', 'velocity'],
    defaultThemePresetId: 'startup-pulse',
    defaultLayoutMode: 'EDGE_TILE',
    defaultForAppViews: {
      PMO: { themePresetId: 'startup-pulse', layoutMode: 'SIDEBAR_COMMAND' },
      TECH_OPS: { themePresetId: 'startup-pulse', layoutMode: 'COMMAND_CENTER' },
      MIIDLE: { themePresetId: 'startup-pulse', layoutMode: 'EDGE_TILE' },
    },
  },
  {
    id: 'freelance',
    label: 'Freelance',
    description:
      'Lightweight solo-operator mode for client work, schedules, deliverables, proof, and personal workload management.',
    tone: 'personal',
    density: 'comfortable',
    workflowEmphasis: ['clients', 'deliverables', 'calendar', 'proof'],
    priorityWidgets: ['client-roster', 'deliverables', 'time-boxes', 'artifacts'],
    defaultThemePresetId: 'freelance-studio',
    defaultLayoutMode: 'MOBILE_STACK',
    defaultForAppViews: {
      PMO: { themePresetId: 'freelance-studio', layoutMode: 'MOBILE_STACK' },
      TECH_OPS: { themePresetId: 'freelance-studio', layoutMode: 'FILTER_GRID' },
      MIIDLE: { themePresetId: 'freelance-studio', layoutMode: 'CREATIVE_ASYMMETRIC' },
    },
  },
]

export const LAYOUT_MODES = [
  {
    id: 'SIDEBAR_COMMAND',
    label: 'Sidebar Command',
    description: 'Fixed navigation and a strong analytics grid for command-style execution.',
    icon: 'sidebar',
    features: ['sticky-sidebar', 'high-signal', 'dashboard'],
  },
  {
    id: 'FILTER_GRID',
    label: 'Filter Grid',
    description: 'Commerce-style layout with a slim navigation rail, filters, and repeated product/service cards.',
    icon: 'panels-top-left',
    features: ['filter-bar', 'repeatable-cards', 'browse'],
  },
  {
    id: 'EDGE_TILE',
    label: 'Edge Tile',
    description: 'Dense tile matrix with bold cards, minimal gutters, and high-contrast module seams.',
    icon: 'grid-3x3',
    features: ['tile-first', 'dense', 'metro'],
  },
  {
    id: 'ENTERPRISE_GRID',
    label: 'Enterprise Grid',
    description: 'Uniform enterprise dashboard with breadcrumb header, KPI strips, and table-heavy workflow sections.',
    icon: 'layout-grid',
    features: ['uniform-grid', 'enterprise', 'table-heavy'],
  },
  {
    id: 'COMMAND_CENTER',
    label: 'Command Center',
    description: 'Full-screen monitoring surface with symmetric side panels and a data-dense center stage.',
    icon: 'monitor-up',
    features: ['monitoring', 'map-center', 'operator'],
  },
  {
    id: 'FLOATING_WORKSPACE',
    label: 'Floating Workspace',
    description: 'Detached islands floating over a backdrop with softer transitions and modular work zones.',
    icon: 'panel-right-open',
    features: ['floating-panels', 'soft-shell', 'modular'],
  },
  {
    id: 'CREATIVE_ASYMMETRIC',
    label: 'Creative Asymmetric',
    description: 'Editorial layout with large hero cards, interlocking modules, and intentionally varied proportions.',
    icon: 'gallery-vertical',
    features: ['editorial', 'asymmetric', 'story-driven'],
  },
  {
    id: 'MOBILE_STACK',
    label: 'Mobile Stack',
    description: 'Single-column or soft multi-column rhythm for lighter-weight, touch-friendly workflows.',
    icon: 'smartphone',
    features: ['single-column', 'touch-friendly', 'personal'],
  },
]

export const THEME_PRESETS_V2 = [
  {
    id: 'founder-command',
    label: 'Founder Command',
    description: 'Dark operational command surface inspired by bold monitoring dashboards and business control rooms.',
    kind: 'core',
    category: 'dark',
    defaultFor: ['PMO'],
    supportedModes: ['founder_operator_smb', 'executive', 'startup'],
    layoutMode: 'SIDEBAR_COMMAND',
    preview: {
      background: 'oklch(0.14 0.03 255)',
      surface: 'oklch(0.22 0.04 250)',
      accent: 'oklch(0.72 0.18 180)',
      text: 'oklch(0.96 0.01 255)',
    },
    themeVars: {
      accent: 'oklch(0.72 0.18 180)',
      radius: '18px',
      density: '0.96rem',
    },
    composition: {
      hero: 'status-kpis',
      chartStyle: 'clean-lines',
      tileStyle: 'status-blocks',
      density: 'high',
    },
    eligibilityRules: {
      industries: ['saas', 'ops', 'consulting', 'other'],
      tones: ['command', 'energetic', 'structured'],
      colorBias: ['blue', 'cyan', 'green'],
    },
    features: ['status-cards', 'ops-grid', 'high-contrast'],
  },
  {
    id: 'executive-brief',
    label: 'Executive Brief',
    description: 'Bright, polished boardroom preset with gradient KPI cards and presentation-ready summaries.',
    kind: 'core',
    category: 'light',
    defaultFor: [],
    supportedModes: ['executive', 'founder_operator_smb', 'admin_project'],
    layoutMode: 'ENTERPRISE_GRID',
    preview: {
      background: 'oklch(0.97 0.01 330)',
      surface: 'oklch(1 0 0)',
      accent: 'oklch(0.68 0.22 310)',
      text: 'oklch(0.18 0.02 270)',
    },
    themeVars: {
      accent: 'linear-gradient(90deg, oklch(0.71 0.18 265), oklch(0.78 0.18 355))',
      radius: '20px',
      density: '1rem',
    },
    composition: {
      hero: 'gradient-strip',
      chartStyle: 'smooth-area',
      tileStyle: 'soft-cards',
      density: 'balanced',
    },
    eligibilityRules: {
      industries: ['saas', 'consulting', 'other'],
      tones: ['briefing', 'structured', 'calm'],
      colorBias: ['purple', 'pink', 'blue'],
    },
    features: ['boardroom', 'gradient-kpis', 'presentation'],
  },
  {
    id: 'creator-nightshift',
    label: 'Creator Nightshift',
    description: 'Immersive dark creative preset for story assembly, NFT-like showcase modules, and proof-of-work boards.',
    kind: 'core',
    category: 'dark',
    defaultFor: ['MIIDLE'],
    supportedModes: ['creative', 'startup', 'freelance', 'founder_operator_smb'],
    layoutMode: 'CREATIVE_ASYMMETRIC',
    preview: {
      background: 'oklch(0.17 0.03 275)',
      surface: 'oklch(0.23 0.04 275)',
      accent: 'oklch(0.74 0.24 310)',
      text: 'oklch(0.96 0.01 275)',
    },
    themeVars: {
      accent: 'oklch(0.74 0.24 310)',
      radius: '24px',
      density: '1rem',
    },
    composition: {
      hero: 'media-feature',
      chartStyle: 'glow-lines',
      tileStyle: 'editorial-bento',
      density: 'expressive',
    },
    eligibilityRules: {
      industries: ['agency', 'startup', 'other'],
      tones: ['editorial', 'energetic', 'personal'],
      colorBias: ['pink', 'purple', 'blue'],
    },
    features: ['glass-panels', 'creative', 'media-led'],
  },
  {
    id: 'admin-blueprint',
    label: 'Admin Blueprint',
    description: 'Structured enterprise preset inspired by classic blue admin systems and table-first workflow consoles.',
    kind: 'core',
    category: 'light',
    defaultFor: [],
    supportedModes: ['admin_project', 'executive', 'founder_operator_smb'],
    layoutMode: 'ENTERPRISE_GRID',
    preview: {
      background: 'oklch(0.94 0.02 240)',
      surface: 'oklch(0.98 0.01 240)',
      accent: 'oklch(0.61 0.2 245)',
      text: 'oklch(0.2 0.02 245)',
    },
    themeVars: {
      accent: 'oklch(0.61 0.2 245)',
      radius: '14px',
      density: '0.94rem',
    },
    composition: {
      hero: 'summary-table',
      chartStyle: 'structured-bars',
      tileStyle: 'table-panels',
      density: 'high',
    },
    eligibilityRules: {
      industries: ['saas', 'ops', 'consulting', 'other'],
      tones: ['structured', 'command', 'briefing'],
      colorBias: ['blue', 'slate'],
    },
    features: ['enterprise', 'table-first', 'breadcrumb-shell'],
  },
  {
    id: 'care-soft',
    label: 'Care Soft',
    description: 'Warm and operational preset for regulated teams that need status clarity without visual overload.',
    kind: 'core',
    category: 'light',
    defaultFor: [],
    supportedModes: ['healthcare', 'freelance', 'executive'],
    layoutMode: 'FLOATING_WORKSPACE',
    preview: {
      background: 'oklch(0.97 0.01 210)',
      surface: 'oklch(1 0 0)',
      accent: 'oklch(0.73 0.15 160)',
      text: 'oklch(0.22 0.02 220)',
    },
    themeVars: {
      accent: 'oklch(0.73 0.15 160)',
      radius: '26px',
      density: '1rem',
    },
    composition: {
      hero: 'service-board',
      chartStyle: 'soft-rings',
      tileStyle: 'care-cards',
      density: 'comfortable',
    },
    eligibilityRules: {
      industries: ['healthcare', 'consulting', 'other'],
      tones: ['calm', 'briefing'],
      colorBias: ['green', 'teal', 'peach'],
    },
    features: ['clinical-soft', 'status-first', 'calmer-reading'],
  },
  {
    id: 'startup-pulse',
    label: 'Startup Pulse',
    description: 'Energetic preset with bright gradients, launch momentum, and investor-update rhythm.',
    kind: 'core',
    category: 'light',
    defaultFor: [],
    supportedModes: ['startup', 'founder_operator_smb', 'creative'],
    layoutMode: 'EDGE_TILE',
    preview: {
      background: 'oklch(0.95 0.03 20)',
      surface: 'oklch(0.99 0.01 0)',
      accent: 'oklch(0.74 0.24 30)',
      text: 'oklch(0.2 0.03 320)',
    },
    themeVars: {
      accent: 'linear-gradient(90deg, oklch(0.75 0.22 15), oklch(0.74 0.2 330))',
      radius: '16px',
      density: '0.98rem',
    },
    composition: {
      hero: 'launch-board',
      chartStyle: 'stacked-growth',
      tileStyle: 'momentum-cards',
      density: 'balanced',
    },
    eligibilityRules: {
      industries: ['saas', 'agency', 'other'],
      tones: ['energetic', 'editorial', 'command'],
      colorBias: ['pink', 'orange', 'purple'],
    },
    features: ['growth-mode', 'launch-kpis', 'bright-gradients'],
  },
  {
    id: 'freelance-studio',
    label: 'Freelance Studio',
    description: 'A lighter-weight, client-friendly preset for solo delivery, schedules, and artifact sharing.',
    kind: 'core',
    category: 'light',
    defaultFor: [],
    supportedModes: ['freelance', 'creative', 'healthcare'],
    layoutMode: 'MOBILE_STACK',
    preview: {
      background: 'oklch(0.96 0.01 95)',
      surface: 'oklch(1 0 0)',
      accent: 'oklch(0.71 0.16 255)',
      text: 'oklch(0.25 0.02 90)',
    },
    themeVars: {
      accent: 'oklch(0.71 0.16 255)',
      radius: '28px',
      density: '1rem',
    },
    composition: {
      hero: 'client-overview',
      chartStyle: 'minimal-lines',
      tileStyle: 'pill-cards',
      density: 'comfortable',
    },
    eligibilityRules: {
      industries: ['agency', 'consulting', 'other'],
      tones: ['personal', 'calm', 'editorial'],
      colorBias: ['blue', 'teal', 'peach'],
    },
    features: ['solo-workflow', 'client-ready', 'mobile-friendly'],
  },
  {
    id: 'industrial-command',
    label: 'Industrial Command',
    description: 'Operations-floor preset with neon data dials, dense telemetry, and shift-board visibility.',
    kind: 'library',
    category: 'dark',
    defaultFor: ['TECH_OPS'],
    supportedModes: ['founder_operator_smb', 'admin_project', 'startup'],
    layoutMode: 'COMMAND_CENTER',
    preview: {
      background: 'oklch(0.09 0.03 260)',
      surface: 'oklch(0.14 0.03 260)',
      accent: 'oklch(0.81 0.18 145)',
      text: 'oklch(0.96 0.01 260)',
    },
    themeVars: {
      accent: 'oklch(0.81 0.18 145)',
      radius: '10px',
      density: '0.92rem',
    },
    composition: {
      hero: 'telemetry-wall',
      chartStyle: 'radial-dials',
      tileStyle: 'operator-panels',
      density: 'high',
    },
    eligibilityRules: {
      industries: ['ops', 'saas', 'healthcare'],
      tones: ['command', 'structured'],
      colorBias: ['green', 'cyan', 'blue'],
    },
    features: ['telemetry', 'glow-lines', 'operator-floor'],
  },
  {
    id: 'storefront-stealth',
    label: 'Storefront Stealth',
    description: 'Sharp, dark browsing preset with cut-corner cards and marketplace-style filter flows.',
    kind: 'library',
    category: 'dark',
    defaultFor: [],
    supportedModes: ['creative', 'freelance', 'startup'],
    layoutMode: 'FILTER_GRID',
    preview: {
      background: 'oklch(0.08 0 0)',
      surface: 'oklch(0.14 0 0)',
      accent: 'oklch(0.86 0.18 100)',
      text: 'oklch(0.95 0 0)',
    },
    themeVars: {
      accent: 'oklch(0.86 0.18 100)',
      radius: '8px',
      density: '0.95rem',
    },
    composition: {
      hero: 'catalog-feature',
      chartStyle: 'none',
      tileStyle: 'cut-corner',
      density: 'high',
    },
    eligibilityRules: {
      industries: ['agency', 'startup', 'other'],
      tones: ['editorial', 'energetic', 'personal'],
      colorBias: ['yellow', 'white', 'orange'],
    },
    features: ['catalog', 'hover-states', 'cut-corner-cards'],
  },
  {
    id: 'social-grid',
    label: 'Social Grid',
    description: 'Dense high-contrast tile preset for social metrics, media highlights, and fast scanning.',
    kind: 'library',
    category: 'dark',
    defaultFor: [],
    supportedModes: ['creative', 'startup', 'executive'],
    layoutMode: 'EDGE_TILE',
    preview: {
      background: 'oklch(0.1 0 0)',
      surface: 'oklch(0.16 0.02 300)',
      accent: 'oklch(0.74 0.23 330)',
      text: 'oklch(0.96 0 0)',
    },
    themeVars: {
      accent: 'oklch(0.74 0.23 330)',
      radius: '10px',
      density: '0.92rem',
    },
    composition: {
      hero: 'tile-matrix',
      chartStyle: 'neon-bars',
      tileStyle: 'metric-tiles',
      density: 'high',
    },
    eligibilityRules: {
      industries: ['agency', 'saas', 'other'],
      tones: ['editorial', 'energetic'],
      colorBias: ['pink', 'purple', 'orange'],
    },
    features: ['tile-density', 'social-metrics', 'neon-analytics'],
  },
  {
    id: 'story-tiles',
    label: 'Story Tiles',
    description: 'Editorial mosaic for narrative-led workflows, image-first storytelling, and asymmetric discovery.',
    kind: 'library',
    category: 'dark',
    defaultFor: [],
    supportedModes: ['creative', 'freelance', 'startup'],
    layoutMode: 'CREATIVE_ASYMMETRIC',
    preview: {
      background: 'oklch(0.22 0.02 245)',
      surface: 'oklch(0.35 0.03 230)',
      accent: 'oklch(0.84 0.17 90)',
      text: 'oklch(0.96 0.01 245)',
    },
    themeVars: {
      accent: 'oklch(0.84 0.17 90)',
      radius: '14px',
      density: '1rem',
    },
    composition: {
      hero: 'editorial-banner',
      chartStyle: 'story-overlays',
      tileStyle: 'mosaic',
      density: 'expressive',
    },
    eligibilityRules: {
      industries: ['agency', 'other'],
      tones: ['editorial', 'personal'],
      colorBias: ['yellow', 'teal', 'blue'],
    },
    features: ['mosaic', 'narrative', 'image-led'],
  },
]

export const AI_PRESENCE_STATES = [
  { id: 'idle', label: 'Ready', description: 'AI is available and waiting', color: 'var(--ai-idle)' },
  { id: 'active', label: 'Active', description: 'AI is processing your request', color: 'var(--ai-active)' },
  { id: 'processing', label: 'Thinking', description: 'AI is analyzing data', color: 'var(--ai-processing)' },
  { id: 'typing', label: 'Typing', description: 'AI is generating a response', color: 'var(--ai-active)' },
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

export const DEFAULT_BRAND_PROFILE = {
  industry: 'saas',
  mission: '',
  vision: '',
  logoUrl: '',
  brandKeywords: '',
  audience: '',
  tone: 'command',
  colorBias: 'blue',
  densityPreference: 'balanced',
}

const LEGACY_THEME_ALIASES = {
  pmo: 'founder-command',
  tech_ops: 'industrial-command',
  miidle: 'creator-nightshift',
  midnight: 'creator-nightshift',
  assist_hc: 'care-soft',
  'enterprise-light': 'executive-brief',
  'cyber-hud': 'industrial-command',
  'dark-glass': 'creator-nightshift',
  'wellness-soft': 'care-soft',
}

const LEGACY_LAYOUT_ALIASES = {
  SIDEBAR_ADMIN: 'SIDEBAR_COMMAND',
  HUD: 'COMMAND_CENTER',
  BENTO: 'CREATIVE_ASYMMETRIC',
}

const LEGACY_MODE_ALIASES = {
  founder: 'founder_operator_smb',
  creative: 'creative',
  project: 'admin_project',
  assisted: 'healthcare',
}

const INDUSTRY_DEFAULT_MODE = {
  saas: 'founder_operator_smb',
  agency: 'creative',
  consulting: 'executive',
  ops: 'admin_project',
  healthcare: 'healthcare',
  startup: 'startup',
  freelance: 'freelance',
  other: 'founder_operator_smb',
}

const COLOR_BIAS_TO_ACCENT = {
  blue: 'oklch(0.66 0.18 250)',
  cyan: 'oklch(0.76 0.17 190)',
  green: 'oklch(0.75 0.16 150)',
  teal: 'oklch(0.73 0.15 180)',
  purple: 'oklch(0.7 0.2 300)',
  pink: 'oklch(0.76 0.2 350)',
  orange: 'oklch(0.78 0.18 55)',
  yellow: 'oklch(0.84 0.16 95)',
  peach: 'oklch(0.83 0.13 45)',
  slate: 'oklch(0.58 0.04 255)',
}

/**
 * @param {string | null | undefined} id
 */
export function resolveThemePresetId(id) {
  const raw = typeof id === 'string' ? id.trim() : ''
  if (!raw) return null
  return LEGACY_THEME_ALIASES[raw] ?? raw
}

/**
 * @param {string | null | undefined} id
 * @returns {LayoutModeId | null}
 */
export function resolveLayoutModeId(id) {
  const raw = typeof id === 'string' ? id.trim() : ''
  if (!raw) return null
  return /** @type {LayoutModeId | null} */ (LEGACY_LAYOUT_ALIASES[raw] ?? raw)
}

/**
 * @param {string | null | undefined} id
 * @returns {UserModeId | null}
 */
export function resolveUserModeId(id) {
  const raw = typeof id === 'string' ? id.trim() : ''
  if (!raw) return null
  return /** @type {UserModeId | null} */ (LEGACY_MODE_ALIASES[raw] ?? raw)
}

/**
 * @param {string} id
 */
export function getThemePresetById(id) {
  const resolved = resolveThemePresetId(id)
  return THEME_PRESETS_V2.find((preset) => preset.id === resolved)
}

/**
 * @param {string} id
 */
export function getLayoutModeById(id) {
  const resolved = resolveLayoutModeId(id)
  return LAYOUT_MODES.find((mode) => mode.id === resolved)
}

/**
 * @param {string} id
 */
export function getUserModeById(id) {
  const resolved = resolveUserModeId(id)
  return USER_MODES.find((mode) => mode.id === resolved)
}

/**
 * @param {string} id
 */
export function isValidThemePresetV2(id) {
  return Boolean(getThemePresetById(id))
}

/**
 * @param {string} id
 */
export function isValidLayoutMode(id) {
  return Boolean(getLayoutModeById(id))
}

/**
 * @param {string} id
 */
export function isValidUserMode(id) {
  return Boolean(getUserModeById(id))
}

/**
 * @param {string} id
 */
export function getAIPresenceStateById(id) {
  return AI_PRESENCE_STATES.find((state) => state.id === id)
}

/**
 * @param {string} id
 */
export function getAnimationById(id) {
  return MOTION_ANIMATIONS.find((animation) => animation.id === id)
}

/**
 * @param {string} category
 */
export function getAnimationsByCategory(category) {
  return MOTION_ANIMATIONS.filter((animation) => animation.category === category)
}

/**
 * @param {string} industryId
 * @returns {UserModeId}
 */
export function getDefaultUserModeForIndustry(industryId) {
  return /** @type {UserModeId} */ (INDUSTRY_DEFAULT_MODE[industryId] ?? 'founder_operator_smb')
}

/**
 * @param {AppView} appView
 * @param {string | null | undefined} [userModeId]
 */
export function getModeDefaultsForAppView(appView, userModeId) {
  const mode =
    getUserModeById(userModeId ?? '') ??
    getUserModeById(getDefaultUserModeForIndustry('saas')) ??
    USER_MODES[0]
  return (
    mode.defaultForAppViews[appView] ?? {
      themePresetId: mode.defaultThemePresetId,
      layoutMode: mode.defaultLayoutMode,
    }
  )
}

/**
 * Get default theme preset for app view + active user mode.
 * @param {AppView} appView
 * @param {string | null | undefined} [userModeId]
 */
export function getDefaultThemePresetForAppView(appView, userModeId) {
  return getModeDefaultsForAppView(appView, userModeId).themePresetId
}

/**
 * Get default layout mode for app view + active user mode.
 * @param {AppView} appView
 * @param {string | null | undefined} [userModeId]
 * @returns {LayoutModeId}
 */
export function getDefaultLayoutModeForAppView(appView, userModeId) {
  return /** @type {LayoutModeId} */ (
    getModeDefaultsForAppView(appView, userModeId).layoutMode
  )
}

/**
 * @param {Partial<typeof DEFAULT_BRAND_PROFILE> | null | undefined} raw
 */
export function normalizeBrandProfile(raw) {
  const next = { ...DEFAULT_BRAND_PROFILE, ...(raw ?? {}) }
  return {
    industry: next.industry || DEFAULT_BRAND_PROFILE.industry,
    mission: String(next.mission || ''),
    vision: String(next.vision || ''),
    logoUrl: String(next.logoUrl || ''),
    brandKeywords: String(next.brandKeywords || ''),
    audience: String(next.audience || ''),
    tone: String(next.tone || DEFAULT_BRAND_PROFILE.tone),
    colorBias: String(next.colorBias || DEFAULT_BRAND_PROFILE.colorBias),
    densityPreference: String(
      next.densityPreference || DEFAULT_BRAND_PROFILE.densityPreference,
    ),
  }
}

function listFromKeywords(value) {
  return String(value || '')
    .split(',')
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean)
}

/**
 * Deterministic theme recommendation engine from intake profile.
 * @param {Partial<typeof DEFAULT_BRAND_PROFILE> | null | undefined} rawProfile
 * @param {string | null | undefined} userModeId
 */
export function recommendPresetLibrary(rawProfile, userModeId) {
  const profile = normalizeBrandProfile(rawProfile)
  const modeId =
    resolveUserModeId(userModeId) ?? getDefaultUserModeForIndustry(profile.industry)
  const keywords = new Set([
    ...listFromKeywords(profile.brandKeywords),
    ...listFromKeywords(profile.mission),
    ...listFromKeywords(profile.vision),
    ...listFromKeywords(profile.audience),
  ])

  const scored = THEME_PRESETS_V2.map((preset) => {
    let score = preset.kind === 'core' ? 12 : 8
    const reasons = []
    if (preset.supportedModes.includes(modeId)) {
      score += 18
      reasons.push('supports selected mode')
    }
    if (preset.eligibilityRules?.industries?.includes(profile.industry)) {
      score += 14
      reasons.push(`fits ${profile.industry}`)
    }
    if (preset.eligibilityRules?.tones?.includes(profile.tone)) {
      score += 10
      reasons.push(`matches ${profile.tone} tone`)
    }
    if (preset.eligibilityRules?.colorBias?.includes(profile.colorBias)) {
      score += 8
      reasons.push(`${profile.colorBias} brand bias`)
    }
    if (preset.composition?.density === profile.densityPreference) {
      score += 8
      reasons.push(`${profile.densityPreference} density`)
    }

    if (keywords.has('health') || keywords.has('wellness') || keywords.has('care')) {
      if (preset.id === 'care-soft') {
        score += 10
        reasons.push('health-oriented keywords')
      }
    }
    if (keywords.has('story') || keywords.has('portfolio') || keywords.has('creative')) {
      if (['creator-nightshift', 'story-tiles'].includes(preset.id)) {
        score += 10
        reasons.push('creative storytelling fit')
      }
    }
    if (keywords.has('ops') || keywords.has('operations') || keywords.has('compliance')) {
      if (['industrial-command', 'admin-blueprint', 'founder-command'].includes(preset.id)) {
        score += 10
        reasons.push('operations-heavy profile')
      }
    }
    if (keywords.has('growth') || keywords.has('launch') || keywords.has('startup')) {
      if (['startup-pulse', 'founder-command', 'social-grid'].includes(preset.id)) {
        score += 10
        reasons.push('momentum-oriented profile')
      }
    }

    return {
      preset,
      score,
      reasons,
    }
  }).sort((a, b) => b.score - a.score)

  const rankedPresetIds = scored.map((entry) => entry.preset.id)
  const top = scored[0]?.preset ?? THEME_PRESETS_V2[0]
  const derivedThemeOverrides = {
    '--brand-accent': COLOR_BIAS_TO_ACCENT[profile.colorBias] ?? COLOR_BIAS_TO_ACCENT.blue,
    '--brand-density':
      profile.densityPreference === 'high'
        ? '0.94rem'
        : profile.densityPreference === 'comfortable'
          ? '1.02rem'
          : '0.98rem',
  }

  return {
    recommendedPresetId: top.id,
    rankedPresetIds,
    supportedModes: top.supportedModes,
    reasons: scored[0]?.reasons ?? ['default recommendation'],
    derivedThemeOverrides,
  }
}
