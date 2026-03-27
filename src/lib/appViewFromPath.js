/** @typedef {'PMO' | 'TECH_OPS' | 'MIIDLE'} AppView */

/** @param {string} pathname */
export function appViewFromPathname(pathname) {
  if (pathname.startsWith('/tech-ops')) return 'TECH_OPS'
  if (pathname.startsWith('/miiddle')) return 'MIIDLE'
  if (pathname.startsWith('/pmo-ops')) return 'PMO'
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
