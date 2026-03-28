/**
 * Normalize initiative rows from mpo-pilot Supabase (`priority_score`, `completion_pct`, …)
 * and legacy Martin OS fallbacks (`priority`, `completion`, …).
 * @param {Record<string, unknown>} row
 */
export function normalizeInitiativeRow(row) {
  return {
    ...row,
    priority: row.priority ?? row.priority_score,
    alignment: row.alignment ?? row.strategic_alignment,
    risk: row.risk ?? row.dependency_risk,
    completion: row.completion ?? row.completion_pct,
  }
}

/**
 * Map `insights` rows from mpo-pilot (situation/diagnosis/recommendation) + signal.
 * @param {Record<string, unknown>} row
 */
export function insightDetailText(row) {
  const parts = [row.summary, row.situation, row.diagnosis, row.recommendation, row.detail].filter(
    (p) => typeof p === 'string' && p.trim(),
  )
  return parts[0] ?? 'No summary available.'
}
