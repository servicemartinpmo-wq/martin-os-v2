import AppShell from '../../src/features/shell/AppShell'
import Miidle from '../../src/components/Miidle'
import MiidleCommandBand from '../../src/features/miiddle/MiidleCommandBand'
import Link from 'next/link'
import { getContractsForDomain } from '../../src/requirements/contracts'

const miidlePillars = [
  {
    title: 'Execution Capture',
    detail: 'Record meaningful work events and convert them into structured proof-of-work timelines.',
  },
  {
    title: 'Work Graph',
    detail: 'Map contributors, outputs, projects, and skills into a live relationship model.',
  },
  {
    title: 'Build Story Engine',
    detail: 'Auto-package execution streams into consumable narratives: visual, written, and summary artifacts.',
  },
  {
    title: 'Spectator Layer',
    detail: 'Publish selected activity streams for passive observers without exposing internal complexity.',
  },
]

const integrationTargets = [
  'PMO initiative context',
  'Tech-Ops incident and resolution links',
  'Portfolio and proof-of-work exports',
  'Cross-team visibility feeds',
]

export default function MiidlePage() {
  const contracts = getContractsForDomain('miidle')

  return (
    <AppShell activeHref="/miidle">
      <header className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-fuchsia-300">Miidle</p>
        <h2 className="mt-2 text-3xl font-semibold text-zinc-100">Where the work actually happens</h2>
        <p className="mt-3 max-w-3xl text-zinc-300">
          Miidle is restored as an execution-to-story layer that captures real work, generates structured output, and plugs directly
          into PMO-Ops and Tech-Ops operating flows.
        </p>
      </header>

      <div className="mt-6">
        <Miidle />
      </div>

      <MiidleCommandBand />

      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        {miidlePillars.map((pillar) => (
          <article key={pillar.title} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
            <h3 className="text-lg font-semibold text-zinc-100">{pillar.title}</h3>
            <p className="mt-2 text-sm text-zinc-300">{pillar.detail}</p>
          </article>
        ))}
      </section>

      <section className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h3 className="text-lg font-semibold text-zinc-100">Cross-app relevance (pragmatic B-Stage filter)</h3>
        <ul className="mt-3 grid gap-2 text-sm text-zinc-300 sm:grid-cols-2">
          {integrationTargets.map((target) => (
            <li key={target}>- {target}</li>
          ))}
        </ul>
      </section>

      <section className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h3 className="text-lg font-semibold text-zinc-100">Miidle modules</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Link href="/miidle/capture" className="rounded-lg border border-zinc-700 bg-zinc-950/50 px-4 py-3 text-sm text-zinc-200 hover:border-zinc-500">
            Capture
          </Link>
          <Link href="/miidle/work-graph" className="rounded-lg border border-zinc-700 bg-zinc-950/50 px-4 py-3 text-sm text-zinc-200 hover:border-zinc-500">
            Work Graph
          </Link>
          <Link href="/miidle/story-engine" className="rounded-lg border border-zinc-700 bg-zinc-950/50 px-4 py-3 text-sm text-zinc-200 hover:border-zinc-500">
            Story Engine
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
