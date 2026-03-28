/** @typedef {'PMO' | 'TECH_OPS' | 'MIIDLE'} AppView */

/**
 * Map URL to OS perspective. Tri-native home uses `/?plugin=tech-ops` | `miiddle` (PMO when omitted).
 *
 * @param {string} pathname
 * @param {string} [search] query string, with or without leading `?`
 */
export function appViewFromPathname(pathname, search = '') {
  const path = pathname || '/'
  if (path === '/' || path === '') {
    const q = search.startsWith('?') ? search.slice(1) : search
    const plugin = new URLSearchParams(q).get('plugin')
    if (plugin === 'tech-ops') return 'TECH_OPS'
    if (plugin === 'miidle') return 'MIIDLE'
    return 'PMO'
  }
  if (path.startsWith('/tech-ops')) return 'TECH_OPS'
  if (path.startsWith('/miiddle')) return 'MIIDLE'
  if (path.startsWith('/pmo-ops')) return 'PMO'
  return 'PMO'
}

/** Theme skin tied to perspective */
/** @param {AppView} appView */
export function defaultThemeForAppView(appView) {
  switch (appView) {
    case 'TECH_OPS':
      return 'tech_ops'
    case 'MIIDLE':
      return 'miidle'
    default:
      return 'pmo'
  }
}
