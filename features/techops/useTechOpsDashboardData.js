'use client'

import { useMemo } from 'react'
import { useSupabaseTable } from '@/hooks/useSupabaseTable'
import {
  fallbackAiDiagnostics,
  techConnectorHealth,
  techOpsSlaBoard,
  techWorkflowRuns,
} from '@/features/data/operationalData'

export function useTechOpsDashboardData() {
  const diagnosticsQuery = useSupabaseTable({
    table: 'ai_diagnostics',
    select: 'id,check_label,metric_value,detail,acknowledged',
    orderBy: 'id',
    ascending: true,
    limit: 100,
    fallback: fallbackAiDiagnostics,
  })

  const workflowsQuery = useSupabaseTable({
    table: 'workflows',
    select: 'id,workflow,stage,eta,state',
    orderBy: 'id',
    ascending: false,
    limit: 100,
    fallback: techWorkflowRuns,
  })

  const data = useMemo(() => {
    const diagnostics = diagnosticsQuery.rows
    const workflows = workflowsQuery.rows
    const acknowledgedCount = diagnostics.filter((row) => Boolean(row.acknowledged)).length
    const criticalDiagnostics = diagnostics.filter((row) =>
      String(row.metric_value ?? row.detail ?? '').toLowerCase().includes('critical'),
    ).length
    const warningWorkflows = workflows.filter(
      (row) => String(row.state).toLowerCase() === 'warning',
    ).length
    const unhealthyConnectors = techConnectorHealth.filter(
      (item) => item.state !== 'healthy',
    ).length

    const kpis = [
      {
        label: 'Diagnostics online',
        value: String(diagnostics.length),
        hint: diagnosticsQuery.usingFallback ? 'fallback diagnostic feed' : 'live diagnostic checks',
      },
      {
        label: 'Workflow runs',
        value: String(workflows.length),
        hint: workflowsQuery.usingFallback ? 'fallback workflow board' : 'live workflow board',
      },
      {
        label: 'Connectors degraded',
        value: String(unhealthyConnectors),
        hint: unhealthyConnectors ? 'intervention recommended' : 'all connectors nominal',
      },
      {
        label: 'Acknowledged checks',
        value: `${acknowledgedCount}/${diagnostics.length || 0}`,
        hint: criticalDiagnostics ? `${criticalDiagnostics} critical conditions` : 'no critical diagnostics',
      },
    ]

    return {
      kpis,
      diagnostics,
      workflows,
      connectorHealth: techConnectorHealth,
      slaBoard: techOpsSlaBoard,
      unhealthyConnectors,
      warningWorkflows,
      activeIncidents: diagnostics.slice(0, 4),
    }
  }, [
    diagnosticsQuery.rows,
    diagnosticsQuery.usingFallback,
    workflowsQuery.rows,
    workflowsQuery.usingFallback,
  ])

  return {
    data,
    loading: diagnosticsQuery.loading || workflowsQuery.loading,
    error: diagnosticsQuery.error || workflowsQuery.error,
    usingFallback: diagnosticsQuery.usingFallback || workflowsQuery.usingFallback,
  }
}
