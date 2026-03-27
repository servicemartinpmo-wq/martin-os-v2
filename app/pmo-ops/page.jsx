import AppShell from '../../src/features/shell/AppShell'
import Link from 'next/link'
import { getContractsForDomain } from '../../src/requirements/contracts'
import PmoOpsLiveKpis from '../../src/features/pmo/PmoOpsLiveKpis'
import NextActionCard from '../../src/components/pmo/NextActionCard'

const pmoModules = [
  {
    name: 'Command Dashboard',
    detail: 'Organization health score, urgency queue, and mode switching for standard, creative, and focus views.',
  },
  {
    name: 'Finance Hub',
    detail: 'Budget variance, expenses, invoices, and P&L visibility tied directly to execution.',
  },
  {
    name: 'Projects & Initiatives',
    detail: 'Initiative ownership, risk, dependencies, action items, and decision logs in one flow.',
  },
  {
    name: 'Advisory Layer',
    detail: 'Structured operator guidance mapped to strategy, operations, PMO, and administration support lanes.',
  },
]

export default function PMOOpsPage() {
  const contracts = getContractsForDomain('pmo-ops')

  return (
    <AppShell activeHref="/pmo-ops">
      <header className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">PMO-Ops</p>
        <h2 className="mt-2 text-3xl font-semibold text-zinc-100">Business command center</h2>
        <p className="mt-3 max-w-3xl text-zinc-300">
          Built around the PMO business operations plan: one place for project governance, financial control, advisory guidance,
          and operational readiness.
        </p>
      </header>

      <PmoOpsLiveKpis />

      <div className="mt-6">
        <NextActionCard />
      </div>

      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        {pmoModules.map((module) => (
          <article key={module.name} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
            <h3 className="text-lg font-semibold text-zinc-100">{module.name}</h3>
            <p className="mt-2 text-sm text-zinc-300">{module.detail}</p>
          </article>
        ))}
      </section>

      <section className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h3 className="text-lg font-semibold text-zinc-100">Operational modules</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Link href="/pmo-ops/initiatives" className="rounded-lg border border-zinc-700 bg-zinc-950/50 px-4 py-3 text-sm text-zinc-200 hover:border-zinc-500">
            Initiatives
          </Link>
          <Link href="/pmo-ops/diagnostics" className="rounded-lg border border-zinc-700 bg-zinc-950/50 px-4 py-3 text-sm text-zinc-200 hover:border-zinc-500">
            Diagnostics
          </Link>
          <Link href="/pmo-ops/reports" className="rounded-lg border border-zinc-700 bg-zinc-950/50 px-4 py-3 text-sm text-zinc-200 hover:border-zinc-500">
            Reports
          </Link>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h3 className="text-lg font-semibold text-zinc-100">Document-aligned contracts</h3>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {contracts.map((contract) => (
            <article key={contract.name} className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
              <p className="text-sm font-medium text-zinc-100">{contract.name}</p>
              <ul className="mt-2 space-y-1 text-xs text-zinc-400">
                {contract.requirements.map((req) => (
                  <li key={req}>- {req}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  )
}
