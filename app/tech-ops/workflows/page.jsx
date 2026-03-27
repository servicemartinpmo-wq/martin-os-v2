'use client'

import AppShell from '../../../src/features/shell/AppShell'
import { useState } from 'react'
import { emptyTableFallback, workflowStateContracts } from '../../../src/features/data/operationalData'
import { useSupabaseTable } from '../../../src/hooks/useSupabaseTable'

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
      <header className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-sky-300">Tech-Ops / Workflows</p>
        <h2 className="mt-2 text-2xl font-semibold text-zinc-100">Deterministic workflow contracts</h2>
      </header>

      <section className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
        <div className="flex flex-wrap gap-2">
          {workflowStateContracts.map((workflow) => (
            <button
              key={workflow.name}
              type="button"
              onClick={() => setSelected(workflow.name)}
              className={`rounded-lg border px-3 py-2 text-xs ${
                selected === workflow.name ? 'border-cyan-400/50 bg-cyan-500/10 text-cyan-200' : 'border-zinc-700 text-zinc-300'
              }`}
            >
              {workflow.name}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-2 text-xs text-zinc-400">
        {loading ? 'Loading workflow runs...' : usingFallback ? 'Workflow contracts running in local mode.' : 'Live workflow runs loaded from Supabase.'}
      </section>

      <section className="mt-6 grid gap-4">
        <article className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
          <h3 className="text-base font-semibold text-zinc-100">{active.name}</h3>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {active.states.map((state, index) => (
              <div key={state} className="flex items-center gap-2">
                <span className="rounded border border-zinc-700 bg-zinc-950/50 px-2 py-1 text-xs text-zinc-300">{state}</span>
                {index < active.states.length - 1 && <span className="text-zinc-500">{'->'}</span>}
              </div>
            ))}
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-3">
              <p className="text-xs text-zinc-400">Retry policy</p>
              <p className="mt-1 text-sm text-zinc-200">{active.retries}</p>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-3">
              <p className="text-xs text-zinc-400">Fallback</p>
              <p className="mt-1 text-sm text-zinc-200">{active.fallback}</p>
            </div>
          </div>
        </article>
      </section>

      <section className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h3 className="text-base font-semibold text-zinc-100">Recent workflow runs</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="border-b border-zinc-800 text-zinc-400">
              <tr>
                <th className="px-3 py-2 text-left">ID</th>
                <th className="px-3 py-2 text-left">Name</th>
                <th className="px-3 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {(rows.length > 0 ? rows : [{ id: 'local-1', name: active.name, status: 'contract-preview' }]).map((row) => (
                <tr key={row.id} className="border-b border-zinc-800/70 text-zinc-200">
                  <td className="px-3 py-2 font-mono text-xs">{row.id}</td>
                  <td className="px-3 py-2">{row.name}</td>
                  <td className="px-3 py-2">{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  )
}
