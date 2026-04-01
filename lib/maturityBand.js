/**
 * Maturity / health score bands for executive signaling (0–100).
 * Red 0–40, Yellow 41–60, Orange 61–80, Green 81–100.
 */

/** @param {number} score */
export function getMaturityBand(score) {
  const n = Math.max(0, Math.min(100, Number(score) || 0))
  if (n <= 40) {
    return {
      key: 'critical',
      label: 'Attention',
      barClass: 'bg-red-500',
      textClass: 'text-red-700',
      softBg: 'bg-red-50',
      borderClass: 'border-red-200',
    }
  }
  if (n <= 60) {
    return {
      key: 'developing',
      label: 'Developing',
      barClass: 'bg-yellow-400',
      textClass: 'text-yellow-800',
      softBg: 'bg-yellow-50',
      borderClass: 'border-yellow-200',
    }
  }
  if (n <= 80) {
    return {
      key: 'strengthening',
      label: 'Strengthening',
      barClass: 'bg-orange-500',
      textClass: 'text-orange-800',
      softBg: 'bg-orange-50',
      borderClass: 'border-orange-200',
    }
  }
  return {
    key: 'strong',
    label: 'Strong',
    barClass: 'bg-emerald-500',
    textClass: 'text-emerald-800',
    softBg: 'bg-emerald-50',
    borderClass: 'border-emerald-200',
  }
}

/**
 * Parse "84/100", "84%", or number-like strings for band styling.
 * @param {string} raw
 * @returns {number | null}
 */
export function parseScoreValue(raw) {
  if (raw == null) return null
  const s = String(raw).trim()
  const slash = s.match(/^(\d+)\s*\/\s*100/)
  if (slash) return Number(slash[1])
  const pct = s.match(/^(\d+)\s*%/)
  if (pct) return Number(pct[1])
  return null
}
