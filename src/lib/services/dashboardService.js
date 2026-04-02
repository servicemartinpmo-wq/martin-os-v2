import { fallbackAiDiagnostics, fallbackInsightRecords, fallbackPmoInitiatives, fallbackStoryArtifacts, fallbackStoryJobs, miidleTimeline, techConnectorHealth, techOpsSlaBoard, techWorkflowRuns } from '@/features/data/operationalData'
import { getSupabaseServerClient } from '@/lib/services/supabaseServer'

function cloneRows(rows) {
  return Array.isArray(rows) ? rows.map((row) => ({ ...row })) : []
}

async function fetchRows({ table, select, orderBy = 'id', ascending = false, limit = 100 }) {
  const supabase = getSupabaseServerClient()
  if (!supabase) return { rows: [], source: 'fallback', error: null }

  try {
    const { data, error } = await supabase
      .from(table)
      .select(select)
      .order(orderBy, { ascending })
      .limit(limit)

    if (error || !Array.isArray(data)) {
      return { rows: [], source: 'fallback', error: error?.message ?? 'Invalid response' }
    }
    return { rows: data, source: 'supabase', error: null }
  } catch (error) {
    return {
      rows: [],
      source: 'fallback',
      error: error instanceof Error ? error.message : 'Unknown table query error',
    }
  }
}

function scoreSignal(raw) {
  const state = String(raw ?? '').toLowerCase()
  if (state === 'critical' || state === 'red') return 33
  if (state === 'warning' || state === 'yellow') return 66
  if (state === 'healthy' || state === 'green' || state === 'blue') return 100
  return 72
}

export async function getGoalsDashboardData() {
  const initiativesQuery = await fetchRows({
    table: 'initiatives',
    select:
      'id,name,status,priority_score,strategic_alignment,dependency_risk,completion_pct,owner,priority,alignment,risk,completion',
    orderBy: 'id',
    ascending: true,
    limit: 500,
  })
  const insightsQuery = await fetchRows({
    table: 'insights',
    select: 'id,signal,type,situation,summary',
    orderBy: 'id',
    ascending: false,
    limit: 200,
  })

  const initiativeRows = initiativesQuery.rows.length
    ? initiativesQuery.rows
    : cloneRows(fallbackPmoInitiatives)
  const insightRows = insightsQuery.rows.length ? insightsQuery.rows : cloneRows(fallbackInsightRecords)
  const usingFallback = !initiativesQuery.rows.length || !insightsQuery.rows.length

  const activeInitiatives = initiativeRows.filter((row) => row.status !== 'Completed').length
  const atRisk = initiativeRows.filter((row) =>
    ['at risk', 'delayed', 'abandoned'].includes(String(row.status).toLowerCase()),
  ).length
  const completions = initiativeRows
    .map((row) => Number(row.completion ?? row.completion_pct))
    .filter((value) => !Number.isNaN(value))
  const avgCompletion = completions.length
    ? Math.round(completions.reduce((acc, value) => acc + value, 0) / completions.length)
    : null
  const mappedSignals = insightRows.map((row) => scoreSignal(row.signal ?? row.state))
  const orgHealth = mappedSignals.length
    ? Math.round(mappedSignals.reduce((acc, value) => acc + value, 0) / mappedSignals.length)
    : 84

  return {
    source: usingFallback ? 'fallback' : 'supabase',
    diagnostics: { initiativesError: initiativesQuery.error, insightsError: insightsQuery.error },
    data: {
      kpis: [
        {
          label: 'Operational status composite',
          value: `${orgHealth}/100`,
          hint: initiativesQuery.rows.length && insightsQuery.rows.length ? 'live insight model' : 'fallback insight model',
        },
        {
          label: 'Active initiatives',
          value: String(activeInitiatives),
          hint: initiativesQuery.rows.length ? 'live initiative count' : 'fallback portfolio',
        },
        {
          label: 'Attention / delay / abandoned',
          value: String(atRisk),
          hint: atRisk > 0 ? 'leadership attention needed' : 'no current blockers',
        },
        {
          label: 'Avg initiative completion',
          value: avgCompletion != null ? `${avgCompletion}%` : '—',
          hint: initiativesQuery.rows.length ? 'live portfolio average' : 'fallback completion model',
        },
      ],
      orgHealth,
      activeInitiatives,
      atRisk,
      avgCompletion,
      initiativeRows,
      insightRows,
    },
  }
}

export async function getTechOpsDashboardData() {
  const diagnosticsQuery = await fetchRows({
    table: 'ai_diagnostics',
    select: 'id,check_label,metric_value,detail,acknowledged',
    orderBy: 'id',
    ascending: true,
    limit: 100,
  })
  const workflowsQuery = await fetchRows({
    table: 'workflows',
    select: 'id,workflow,stage,eta,state',
    orderBy: 'id',
    ascending: false,
    limit: 100,
  })

  const diagnostics = diagnosticsQuery.rows.length
    ? diagnosticsQuery.rows
    : cloneRows(fallbackAiDiagnostics)
  const workflows = workflowsQuery.rows.length ? workflowsQuery.rows : cloneRows(techWorkflowRuns)
  const unhealthyConnectors = techConnectorHealth.filter((item) => item.state !== 'healthy').length
  const acknowledgedCount = diagnostics.filter((row) => Boolean(row.acknowledged)).length

  return {
    source: diagnosticsQuery.rows.length && workflowsQuery.rows.length ? 'supabase' : 'fallback',
    diagnosticsMeta: { diagnosticsError: diagnosticsQuery.error, workflowsError: workflowsQuery.error },
    data: {
      kpis: [
        {
          label: 'Diagnostics online',
          value: String(diagnostics.length),
          hint: diagnosticsQuery.rows.length ? 'live diagnostic checks' : 'fallback diagnostic feed',
        },
        {
          label: 'Workflow runs',
          value: String(workflows.length),
          hint: workflowsQuery.rows.length ? 'live workflow board' : 'fallback workflow board',
        },
        {
          label: 'Connectors degraded',
          value: String(unhealthyConnectors),
          hint: unhealthyConnectors ? 'intervention recommended' : 'all connectors nominal',
        },
        {
          label: 'Acknowledged checks',
          value: `${acknowledgedCount}/${diagnostics.length || 0}`,
          hint: 'diagnostic acknowledgement coverage',
        },
      ],
      diagnostics,
      workflows,
      connectorHealth: cloneRows(techConnectorHealth),
      slaBoard: cloneRows(techOpsSlaBoard),
    },
  }
}

export async function getMiiddleDashboardData() {
  const activityQuery = await fetchRows({
    table: 'activity_logs',
    select: 'id,channel,event,actor,time,state,created_at',
    orderBy: 'id',
    ascending: false,
    limit: 100,
  })
  const jobsQuery = await fetchRows({
    table: 'story_jobs',
    select: 'id,name,format,status,source',
    orderBy: 'id',
    ascending: false,
    limit: 100,
  })
  const artifactsQuery = await fetchRows({
    table: 'story_artifacts',
    select: 'id,title,state,audience',
    orderBy: 'id',
    ascending: false,
    limit: 100,
  })

  const activities = activityQuery.rows.length ? activityQuery.rows : cloneRows(miidleTimeline)
  const jobs = jobsQuery.rows.length ? jobsQuery.rows : cloneRows(fallbackStoryJobs)
  const artifacts = artifactsQuery.rows.length ? artifactsQuery.rows : cloneRows(fallbackStoryArtifacts)
  const publishedArtifacts = artifacts.filter(
    (row) => String(row.state).toLowerCase() === 'published',
  ).length

  return {
    source:
      activityQuery.rows.length && jobsQuery.rows.length && artifactsQuery.rows.length
        ? 'supabase'
        : 'fallback',
    diagnosticsMeta: {
      activityError: activityQuery.error,
      jobsError: jobsQuery.error,
      artifactsError: artifactsQuery.error,
    },
    data: {
      kpis: [
        {
          label: 'Capture events',
          value: String(activities.length),
          hint: activityQuery.rows.length ? 'live execution stream' : 'fallback capture stream',
        },
        {
          label: 'Story jobs',
          value: String(jobs.length),
          hint: 'story render queue',
        },
        {
          label: 'Publish-ready artifacts',
          value: String(publishedArtifacts),
          hint: artifactsQuery.rows.length ? 'live artifact board' : 'fallback artifact board',
        },
      ],
      activities,
      jobs,
      artifacts,
    },
  }
}
