'use client'

import AppShell from '../../../src/features/shell/AppShell'
import { useState } from 'react'
import { emptyTableFallback, workflowStateContracts } from '../../../src/features/data/operationalData'
import { useSupabaseTable } from '../../../src/hooks/useSupabaseTable'
import { PageHeader, FilterChip, PageSection } from '@/components/page/PageChrome'
import { caseDiagnosticPipelineStages } from '@/features/data/operationalData'

const inner = {
  border: '1px solid var(--border-subtle)',
  background: 'var(--bg-elevated)',
}

export default function TechOpsWorkflowsPage() {
  const { rows, loading, usingFallback } = useSupabaseTable({
    table: 'workflows',
    select: 'id,name,status',
    orderBy: 'id',
    ascending: false,
    fallback: emptyTableFallback,
  })
  const [selected, setSelected] = useState(workflowStateContracts[0].name)
  const active = workflowStateContracts.find((workflow) => workflow.name === selected) ?? workflowStateContracts[0]

  return (
    <AppShell activeHref="/tech-ops">
      <PageHeader kicker="Tech-Ops / Workflows" title="Deterministic workflow contracts" />

      <section className="glass-panel mt-6 p-5">
        <div className="flex flex-wrap gap-2">
          {workflowStateContracts.map((workflow) => (
            <FilterChip key={workflow.name} active={selected === workflow.name} onClick={() => setSelected(workflow.name)}>
              {workflow.name}
            </FilterChip>
          ))}
        </div>
      </section>

      <section
        className="glass-panel mt-4 px-4 py-2 text-xs"
        style={{ color: 'var(--text-muted)' }}
      >
        {loading ? 'Loading workflow runs...' : usingFallback ? 'Workflow contracts running in local mode.' : 'Live workflow runs loaded from Supabase.'}
      </section>

      <section className="mt-6 grid gap-4">
        <article className="glass-panel p-5">
          <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
            {active.name}
          </h3>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {active.states.map((state, index) => (
              <div key={state} className="flex items-center gap-2">
                <span className="rounded px-2 py-1 text-xs" style={inner}>
                  {state}
                </span>
                {index < active.states.length - 1 && (
                  <span style={{ color: 'var(--text-muted)' }}>{'->'}</span>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg p-3" style={inner}>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Retry policy
              </p>
              <p className="mt-1 text-sm" style={{ color: 'var(--text-primary)' }}>
                {active.retries}
              </p>
            </div>
            <div className="rounded-lg p-3" style={inner}>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Fallback
              </p>
              <p className="mt-1 text-sm" style={{ color: 'var(--text-primary)' }}>
                {active.fallback}
              </p>
            </div>
          </div>
        </article>
      </section>

      <PageSection title="Case pipeline reference (Tech-Ops READINESS)">
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Twelve SSE-friendly stages used in the full Tech-Ops platform for guided diagnostics. Martin OS workflow contracts below map
          onto automation around these stages.
        </p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {caseDiagnosticPipelineStages.map((stage, index) => (
            <li
              key={stage}
              className="rounded-md border px-2 py-1 text-[11px]"
              style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
            >
              {index + 1}. {stage}
            </li>
          ))}
        </ul>
      </PageSection>

      <PageSection title="Recent workflow runs">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="mos-table-head">
              <tr>
                <th className="px-3 py-2 text-left">ID</th>
                <th className="px-3 py-2 text-left">Name</th>
                <th className="px-3 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {(rows.length > 0 ? rows : [{ id: 'local-1', name: active.name, status: 'contract-preview' }]).map((row) => (
                <tr key={row.id} className="mos-table-row">
                  <td className="px-3 py-2 font-mono text-xs">{row.id}</td>
                  <td className="px-3 py-2">{row.name}</td>
                  <td className="px-3 py-2">{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PageSection>
    </AppShell>
  )
}
