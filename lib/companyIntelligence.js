/**
 * Company Intelligence — deterministic 0–100 pillars and risk lanes from PMO dashboard inputs.
 * Replaces ad-hoc math in UI; swap for model-backed scores when APIs exist.
 */

/**
 * @param {{
 *   orgHealth: number
 *   atRisk: number
 *   avgCompletion: number | null
 *   activeInitiatives: number
 * }} input
 * @returns {{ ops: number, revenue: number, product: number, team: number }}
 */
export function buildCompanyIntelligencePillars({
  orgHealth,
  atRisk,
  avgCompletion,
  activeInitiatives,
}) {
  const base = Math.max(0, Math.min(100, Number(orgHealth) || 0))
  const riskPenalty = Math.min(24, (Number(atRisk) || 0) * 5)
  const completion = avgCompletion != null ? Number(avgCompletion) : base

  const ops = Math.round(
    Math.max(0, Math.min(100, base - riskPenalty * 0.6 + (activeInitiatives > 0 ? 2 : -4))),
  )
  const revenue = Math.round(
    Math.max(0, Math.min(100, base + (atRisk === 0 ? 5 : -8) + (completion >= 70 ? 3 : -2))),
  )
  const product = Math.round(
    Math.max(0, Math.min(100, completion * 0.45 + base * 0.55 - riskPenalty * 0.25)),
  )
  const team = Math.round(Math.max(0, Math.min(100, base - riskPenalty * 0.85 + 4)))

  return { ops, revenue, product, team }
}

/** @typedef {'ok' | 'watch' | 'act'} RiskLevel */

/**
 * @param {{
 *   orgHealth: number
 *   atRisk: number
 *   avgCompletion: number | null
 *   insightFeed: Array<{ title?: string, summary?: string, signal?: string }>
 * }} input
 * @returns {{ id: string, label: string, level: RiskLevel, detail: string }[]}
 */
export function buildRiskAlertLanes({ orgHealth, atRisk, avgCompletion, insightFeed }) {
  const base = Math.max(0, Math.min(100, Number(orgHealth) || 0))
  const completion = avgCompletion != null ? Number(avgCompletion) : 50

  const revenueText =
    insightFeed.find((i) => /revenue|pipeline|cash|forecast/i.test(String(i.title ?? i.summary ?? '')))
      ?.summary ?? 'Pipeline and collections vs. plan — review forecast if coverage lags target.'

  let revenueLevel = /** @type {RiskLevel} */ ('ok')
  if (base < 65 || /critical|red/i.test(String(insightFeed[0]?.signal))) revenueLevel = 'act'
  else if (base < 78) revenueLevel = 'watch'

  let delayLevel = /** @type {RiskLevel} */ ('ok')
  if (atRisk >= 2) delayLevel = 'act'
  else if (atRisk === 1 || completion < 55) delayLevel = 'watch'
  const delayDetail =
    atRisk > 0
      ? `${atRisk} initiative(s) need attention on dates or ownership.`
      : 'No active delay signals in the portfolio snapshot.'

  let hiringLevel = /** @type {RiskLevel} */ ('watch')
  if (base >= 82 && atRisk === 0) hiringLevel = 'ok'
  if (base < 60 || atRisk >= 3) hiringLevel = 'act'
  const hiringDetail =
    'Match hiring pace to delivery load — capacity stress shows up before revenue does.'

  return [
    { id: 'revenue', label: 'Revenue & cash', level: revenueLevel, detail: revenueText },
    { id: 'delays', label: 'Delivery & delays', level: delayLevel, detail: delayDetail },
    { id: 'hiring', label: 'Hiring & capacity', level: hiringLevel, detail: hiringDetail },
  ]
}
