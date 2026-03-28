/**
 * Route ↔ Martin OS perspective sync.
 * URL is source of truth: pathname + optional `?plugin=` on `/` drive `appView`.
 */
export { appViewFromPathname, defaultThemeForAppView } from '@/lib/appViewFromPath'

/** Human-readable: which path prefixes map to which app view. */
export const ROUTE_PERSPECTIVE_RULES = [
  { prefix: '/', appView: 'PMO', note: 'tri-native; use ?plugin=tech-ops | miiddle' },
  { prefix: '/pmo-ops', appView: 'PMO' },
  { prefix: '/tech-ops', appView: 'TECH_OPS' },
  { prefix: '/miidle', appView: 'MIIDLE' },
]
