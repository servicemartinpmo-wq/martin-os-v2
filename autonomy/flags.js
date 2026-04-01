/** Global kill switch — default off until audit. */
export const AUTONOMY_ENABLED =
  typeof process !== 'undefined' &&
  process.env.NEXT_PUBLIC_AUTONOMY_ENABLED === '1'

export const HYPER_AUTONOMOUS_MODE =
  typeof process !== 'undefined' &&
  process.env.NEXT_PUBLIC_HYPER_AUTONOMOUS_MODE === '1'

export function isAutonomyEnabled() {
  return AUTONOMY_ENABLED
}
