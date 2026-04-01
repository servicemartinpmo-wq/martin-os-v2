import { IMPLEMENTATION_INDEX, PLATFORM_FEATURES } from './platformFeatureCatalog'

function statusFrom(required, evidence) {
  if (!required) return 'not_required'
  if (evidence.length > 0) return 'implemented'
  return 'missing'
}

export function getPlatformCoverageRows() {
  return PLATFORM_FEATURES.map((feature) => {
    const evidence = IMPLEMENTATION_INDEX[feature.id] ?? { ui: [], middle: [], backend: [] }
    const uiStatus = statusFrom(feature.required.ui, evidence.ui)
    const middleStatus = statusFrom(feature.required.middle, evidence.middle)
    const backendStatus = statusFrom(feature.required.backend, evidence.backend)

    const implementedCount = [uiStatus, middleStatus, backendStatus].filter((s) => s === 'implemented').length
    const requiredCount = [feature.required.ui, feature.required.middle, feature.required.backend].filter(Boolean).length

    return {
      ...feature,
      evidence,
      status: { ui: uiStatus, middle: middleStatus, backend: backendStatus },
      readiness: requiredCount ? Math.round((implementedCount / requiredCount) * 100) : 100,
    }
  })
}

export function getPlatformCoverageSummary() {
  const rows = getPlatformCoverageRows()
  const totals = {
    total: rows.length,
    fullyReady: rows.filter((row) => row.readiness === 100).length,
    partial: rows.filter((row) => row.readiness > 0 && row.readiness < 100).length,
    missing: rows.filter((row) => row.readiness === 0).length,
  }

  return { totals, rows }
}
