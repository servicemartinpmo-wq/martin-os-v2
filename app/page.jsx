import Link from 'next/link'
import AppShell from '../src/features/shell/AppShell'
import { appSections, sourceOfTruth } from '../src/features/shell/appModel'

export default function Page() {
  return (
    <AppShell activeHref="/">
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Recovery Mode</p>
        <h2 className="mt-2 text-3xl font-semibold text-zinc-100">Legacy structure restored into a modern shell</h2>
        <p className="mt-3 max-w-3xl text-zinc-300">
          This workspace now treats each native app as a first-class domain with routed surfaces and module-level planning.
          Tech-Ops uses the Tech-Ops repository as canonical behavior guidance.
        </p>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        {appSections.map((section) => (
          <article key={section.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
            <h3 className="text-lg font-semibold text-zinc-100">{section.title}</h3>
            <p className="mt-2 text-sm text-zinc-300">{section.summary}</p>
            <ul className="mt-4 space-y-1 text-sm text-zinc-400">
              {section.modules.slice(0, 4).map((moduleName) => (
                <li key={moduleName}>- {moduleName}</li>
              ))}
            </ul>
            <Link href={section.href} className="mt-5 inline-block text-sm font-medium text-cyan-300 hover:text-cyan-200">
              Open {section.title} {'->'}
            </Link>
          </article>
        ))}
      </section>

      <section className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h3 className="text-lg font-semibold text-zinc-100">Source-of-truth mapping</h3>
        <ul className="mt-3 space-y-2 text-sm text-zinc-300">
          <li>PMO-Ops: {sourceOfTruth.pmoOps}</li>
          <li>Tech-Ops: {sourceOfTruth.techOps}</li>
          <li>Miidle: {sourceOfTruth.miidle}</li>
        </ul>
      </section>
    </AppShell>
  )
}
