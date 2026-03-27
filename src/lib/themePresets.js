/** User-selectable theme presets → data-theme on <html> */

export const THEME_PRESETS = [
  { id: 'pmo', label: 'Command (PMO)' },
  { id: 'tech_ops', label: 'Operations (Tech)' },
  { id: 'miidle', label: 'Miidle' },
  { id: 'midnight', label: 'Midnight' },
  { id: 'assist_hc', label: 'Assist — high contrast' },
]

/** @param {string} id */
export function isValidThemePreset(id) {
  return THEME_PRESETS.some((p) => p.id === id)
}
