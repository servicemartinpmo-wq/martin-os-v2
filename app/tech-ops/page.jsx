import AppShell from '../../src/features/shell/AppShell'
import Link from 'next/link'
import { getContractsForDomain } from '../../src/requirements/contracts'
import LiveLogs from '../../src/components/LiveLogs'

const architectureLayers = [
  { layer: 'Data Layer', items: ['tickets', 'support_tiers', 'ticket_tier_mapping', 'ai_diagnostics', 'activity_logs', 'knowledge_base'] },
  { layer: 'Logic Layer', items: ['Tier assignment function', 'Escalation trigger', 'Knowledge update trigger', 'RLS policies'] },
  { layer: 'AI Layer', items: ['Issue detection', 'Tier recommendation', 'Confidence scoring', 'Reasoning trace'] },
  { layer: 'Workflow Layer', items: ['Event automation', 'Integration sync', 'Escalation workflows', 'Operator review queue'] },
]

const techOpsStreams = [
  {
    title: 'Ticket Ops',
    text: 'Unified intake, priority management, owner assignment, and lifecycle status from open to resolved.',
  },
  {
    title: 'Tier Routing',
    text: 'Deterministic confidence-based assignment and escalation for predictable incident handling.',
  },
  {
    title: 'Knowledge Loop',
    text: 'Resolved tickets update reusable patterns so future diagnostics become faster and more accurate.',
  },
  {
    title: 'Integration Control',
    text: 'Sync health visibility and runbook triggers for connected sources and support systems.',
  },
]

export default function TechOpsPage() {
  const contracts = getContractsForDomain('tech-ops')

  return (
    <AppShell activeHref="/tech-ops">
      <header className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-sky-300">Tech-Ops Native</p>
        <h2 className="mt-2 text-3xl font-semibold text-zinc-100">Canonical integration surface</h2>
        <p className="mt-3 max-w-3xl text-zinc-300">
          This module is aligned to the Tech-Ops repo and Tech-OPS build references: support architecture, AI-assisted routing,
          escalation automation, and auditable activity trails.
        </p>
      </header>

      <section className="mt-6">
        <LiveLogs />
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        {architectureLayers.map((row) => (
          <article key={row.layer} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
            <h3 className="text-lg font-semibold text-zinc-100">{row.layer}</h3>
            <ul className="mt-3 space-y-1 text-sm text-zinc-300">
              {row.items.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        {techOpsStreams.map((stream) => (
          <article key={stream.title} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
            <h3 className="text-base font-semibold text-zinc-100">{stream.title}</h3>
            <p className="mt-2 text-sm text-zinc-300">{stream.text}</p>
          </article>
        ))}
      </section>

      <section className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h3 className="text-lg font-semibold text-zinc-100">Tech-Ops modules</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Link href="/tech-ops/tickets" className="rounded-lg border border-zinc-700 bg-zinc-950/50 px-4 py-3 text-sm text-zinc-200 hover:border-zinc-500">
            Tickets
          </Link>
          <Link href="/tech-ops/diagnostics" className="rounded-lg border border-zinc-700 bg-zinc-950/50 px-4 py-3 text-sm text-zinc-200 hover:border-zinc-500">
            Diagnostics
          </Link>
          <Link href="/tech-ops/workflows" className="rounded-lg border border-zinc-700 bg-zinc-950/50 px-4 py-3 text-sm text-zinc-200 hover:border-zinc-500">
            Workflows
          </Link>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h3 className="text-lg font-semibold text-zinc-100">Source and contract traceability</h3>
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
