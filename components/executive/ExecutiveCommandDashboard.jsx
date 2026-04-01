'use client'

/**
 * Executive home dashboard — Next.js App Router client component, styled with Tailwind CSS.
 */
import Link from 'next/link'
import { buildCompanyIntelligencePillars } from '@/lib/companyIntelligence'
import { cn } from '@/lib/cn'

function ExecutiveNavItem({ active, href, icon, label }) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors',
        active
          ? 'bg-gradient-to-br from-[#306eff] to-[#1890ff] text-white shadow-lg shadow-blue-900/20'
          : 'text-slate-300/80 hover:bg-white/5 hover:text-slate-100',
      )}
    >
      <span className="text-lg leading-none">{icon}</span>
      <span>{label}</span>
    </Link>
  )
}

/** @param {{ value: number, variant: 'healthy' | 'watch' | 'critical' }} props */
function ProgressBar({ value, variant }) {
  const barClass =
    variant === 'healthy'
      ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
      : variant === 'watch'
        ? 'bg-gradient-to-r from-amber-500 to-orange-500'
        : 'bg-gradient-to-r from-red-500 to-orange-500'
  const w = Math.max(0, Math.min(100, value))
  return (
    <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
      <div className={cn('h-full max-w-full rounded-full transition-[width]', barClass)} style={{ width: `${w}%` }} />
    </div>
  )
}

const PILLAR_GRADIENTS = {
  Ops: 'bg-gradient-to-br from-sky-500 to-sky-800',
  Revenue: 'bg-gradient-to-br from-indigo-500 to-indigo-800',
  Product: 'bg-gradient-to-br from-purple-500 to-violet-800',
  Team: 'bg-gradient-to-br from-amber-500 to-amber-700',
}

export default function ExecutiveCommandDashboard({
  pmo,
  tech,
  miiddle,
}) {
  const priorities = pmo.data.decisionBacklog.slice(0, 4)
  const criticalCount = pmo.data.decisionBacklog.filter((item) => item.impact === 'high').length
  const topInitiatives = pmo.data.spotlightInitiatives.slice(0, 4)
  const orgHealth = Math.max(0, Math.min(100, Number(pmo.data.orgHealth) || 0))
  const pillars = buildCompanyIntelligencePillars({
    orgHealth: pmo.data.orgHealth,
    atRisk: pmo.data.atRisk,
    avgCompletion: pmo.data.avgCompletion,
    activeInitiatives: pmo.data.activeInitiatives,
  })
  const execLoad = Math.min(95, 45 + priorities.length * 10)
  const attentionLevel = orgHealth >= 85 ? 'Healthy' : orgHealth >= 70 ? 'Watch closely' : 'Needs attention'
  const statusVariant = orgHealth >= 85 ? 'healthy' : orgHealth >= 70 ? 'watch' : 'critical'

  const pillarEntries = [
    { label: 'Ops', value: pillars.ops },
    { label: 'Revenue', value: pillars.revenue },
    { label: 'Product', value: pillars.product },
    { label: 'Team', value: pillars.team },
  ]

  return (
    <section className="overflow-hidden rounded-[28px] border border-slate-700/25 bg-gradient-to-b from-[#0b0f14] to-[#101720] shadow-2xl">
      <div className="flex min-h-[760px] flex-col lg:flex-row">
        <aside className="w-full border-b border-slate-600/35 bg-gradient-to-b from-[#121821]/98 to-[#0a0e14]/98 px-5 py-6 lg:w-72 lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br from-amber-300 to-orange-500 shadow-md" />
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-white/45">Martin OS</p>
              <h2 className="text-lg font-semibold text-white">Executive view</h2>
            </div>
          </div>

          <nav className="mt-8 space-y-2">
            <ExecutiveNavItem active href="/" icon="📊" label="Dashboard" />
            <ExecutiveNavItem href="/pmo-ops/initiatives" icon="🎯" label="Big goals" />
            <ExecutiveNavItem href="/pmo-ops/diagnostics" icon="🔍" label="Warnings" />
            <ExecutiveNavItem href="/pmo-ops/reports" icon="🏢" label="Departments" />
            <ExecutiveNavItem href="/tech-ops" icon="⚙️" label="Systems" />
          </nav>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-white/45">Executive focus</p>
            <p className="mt-3 text-sm text-white/80">
              Keep today&apos;s decisions, business health, and system risks visible without digging through technical detail.
            </p>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="flex flex-col gap-4 border-b border-slate-600/35 bg-[#121821]/90 px-6 py-5 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between lg:px-8">
            <div>
              <p className="text-sm text-white/55">Good morning, Executive</p>
              <h1 className="mt-1 text-2xl font-semibold text-white">Leadership command dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/pmo-ops"
                className="rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-950/40 transition-opacity hover:opacity-90"
              >
                Open Martin PMO-Ops
              </Link>
              <div className="h-10 w-10 rounded-full border-2 border-emerald-400 bg-slate-500/70" />
            </div>
          </header>

          <div className="p-6 lg:p-8">
            <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {pillarEntries.map((p) => (
                <div
                  key={p.label}
                  className={cn(
                    'rounded-2xl border border-white/10 p-4 shadow-md',
                    PILLAR_GRADIENTS[p.label],
                  )}
                >
                  <p className="text-xs font-semibold text-white/75 uppercase">{p.label}</p>
                  <p className="mt-2 text-3xl font-bold text-white">{p.value}</p>
                  <p className="mt-1 text-[11px] text-white/70">Company intelligence pillar</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
              <div className="rounded-3xl bg-gradient-to-br from-teal-500 to-cyan-700 p-6 shadow-lg lg:col-span-2">
                <p className="text-sm font-semibold text-white/80">Today&apos;s priorities</p>
                <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="text-4xl font-bold text-white">{priorities.length} action items</p>
                    <p className="mt-2 text-sm text-white/80">
                      Decisions, approvals, and leadership actions waiting for a clear answer.
                    </p>
                  </div>
                  <span className="inline-flex w-fit rounded-full bg-white/20 px-3 py-1 text-sm font-semibold text-white">
                    {criticalCount} critical
                  </span>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-600/45 bg-slate-900/90 p-6 shadow-lg">
                <p className="text-sm font-semibold text-slate-400">Operational status</p>
                <p className="mt-3 text-3xl font-bold text-amber-400">{attentionLevel}</p>
                <p className="mt-2 text-sm text-slate-300">
                  Business health is {orgHealth}/100 across planning signals.
                </p>
                <ProgressBar value={orgHealth} variant={statusVariant} />
              </div>

              <div className="rounded-3xl bg-gradient-to-br from-orange-400 to-red-500 p-6 shadow-lg">
                <p className="text-sm font-semibold text-white/80">Executive load</p>
                <p className="mt-3 text-4xl font-bold text-white">{execLoad}%</p>
                <p className="mt-2 text-sm text-white/75">
                  {execLoad >= 80 ? 'Delegation recommended' : 'Current decision load is manageable'}
                </p>
              </div>

              <div className="rounded-3xl border border-slate-600/45 bg-slate-900/90 p-6 shadow-lg lg:col-span-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-400">Initiative health monitoring</p>
                    <p className="mt-1 text-sm text-slate-300">
                      Four high-priority workstreams with completion, fit, and risk in one view.
                    </p>
                  </div>
                  <Link href="/pmo-ops/initiatives" className="text-sm font-medium text-cyan-300 hover:text-cyan-200">
                    View all
                  </Link>
                </div>
                <div className="mt-6 grid gap-4 xl:grid-cols-2">
                  {topInitiatives.map((initiative) => (
                    <div
                      key={initiative.id}
                      className="rounded-2xl border border-slate-500/35 bg-[#0b0f14]/75 p-4 backdrop-blur-sm"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-base font-semibold text-white">{initiative.name}</p>
                          <p className="mt-1 text-xs text-slate-400">
                            {initiative.owner} · {initiative.status}
                          </p>
                        </div>
                        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-200">
                          {initiative.completion}%
                        </span>
                      </div>
                      <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                        <div>
                          <p className="text-slate-500">Priority</p>
                          <p className="mt-1 font-semibold text-white">{initiative.priority}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Fit</p>
                          <p className="mt-1 font-semibold text-white">{initiative.alignment}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Risk</p>
                          <p className="mt-1 font-semibold text-white">{initiative.risk}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-600/45 bg-slate-900/90 p-6 shadow-lg">
                <p className="flex items-center gap-2 text-sm font-semibold text-blue-300">
                  <span>✨</span> AI advisory
                </p>
                <p className="mt-4 text-sm leading-7 text-slate-200">
                  {pmo.data.insightFeed[0]?.summary ??
                    'Several priorities share the same owner and may cause delays. Consider shifting one decision or budget approval this week.'}
                </p>
                <div className="mt-5 space-y-3">
                  <div className="rounded-2xl bg-white/5 p-3 text-xs text-slate-300">
                    {tech.data.kpis[2]?.value ?? '0'} connected apps need support attention.
                  </div>
                  <div className="rounded-2xl bg-white/5 p-3 text-xs text-slate-300">
                    {miiddle.data.kpis[2]?.value ?? '0'} studio items are ready to share with leadership.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
