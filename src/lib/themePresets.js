/** User-selectable theme presets → data-theme on <html> */

export const THEME_PRESETS = [
  { id: 'pmo', label: 'Command (PMO)' },
  { id: 'tech_ops', label: 'Operations (Tech)' },
  { id: 'miidle', label: 'Miidle' },
  { id: 'midnight', label: 'Midnight' },
  { id: 'assist_hc', label: 'Assist — high contrast' },
  { id: 'enterprise-light', label: 'Enterprise Light' },
  { id: 'cyber-hud', label: 'Cyber HUD' },
  { id: 'dark-glass', label: 'Dark Glass' },
  { id: 'wellness-soft', label: 'Wellness Soft' },
]

/** @param {string} id */
export function isValidThemePreset(id) {
  return THEME_PRESETS.some((p) => p.id === id)
}
