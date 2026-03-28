import {
  getDefaultLayoutModeForAppView,
  getDefaultThemePresetForAppView,
} from '@/lib/themePresetsV2'

/** @typedef {'PMO' | 'TECH_OPS' | 'MIIDLE'} AppView */

/**
 * Map URL to OS perspective. Tri-native home uses `/?plugin=tech-ops` | `miidle`
 * (PMO when omitted). Legacy `plugin=miiddle` is treated as Miiddle.
 *
 * @param {string} pathname
 * @param {string} [search] query string, with or without leading `?`
 * @returns {AppView}
 */
export function appViewFromPathname(pathname, search = '') {
  const path = pathname || '/'
  if (path === '/' || path === '') {
    const q = search.startsWith('?') ? search.slice(1) : search
    const plugin = new URLSearchParams(q).get('plugin')
    if (plugin === 'tech-ops') return 'TECH_OPS'
    if (plugin === 'miidle' || plugin === 'miiddle') return 'MIIDLE'
    return 'PMO'
  }
  if (path.startsWith('/tech-ops')) return 'TECH_OPS'
  if (path.startsWith('/miidle') || path.startsWith('/miiddle')) return 'MIIDLE'
  if (path.startsWith('/pmo-ops')) return 'PMO'
  return 'PMO'
}

/**
 * Default theme skin tied to perspective.
 * @param {AppView} appView
 * @param {string | null | undefined} [userModeId]
 */
export function defaultThemeForAppView(appView, userModeId) {
  return getDefaultThemePresetForAppView(appView, userModeId)
}

/**
 * Default layout tied to perspective.
 * @param {AppView} appView
 * @param {string | null | undefined} [userModeId]
 */
export function defaultLayoutForAppView(appView, userModeId) {
  return getDefaultLayoutModeForAppView(appView, userModeId)
}
