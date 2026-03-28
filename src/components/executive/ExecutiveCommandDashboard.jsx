'use client'

import Link from 'next/link'

function ExecutiveNavItem({ active, href, icon, label }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors"
      style={{
        background: active ? 'linear-gradient(135deg, rgba(48, 110, 255, 0.95), rgba(24, 144, 255, 0.85))' : 'transparent',
        color: active ? '#ffffff' : 'rgba(226, 232, 240, 0.76)',
      }}
    >
      <span className="text-lg leading-none">{icon}</span>
      <span>{label}</span>
    </Link>
  )
}

function ProgressBar({ value, color }) {
  return (
    <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
      <div
        className="h-full rounded-full"
        style={{ width: `${Math.max(0, Math.min(100, value))}%`, background: color }}
      />
    </div>
  )
}

export default function ExecutiveCommandDashboard({
  pmo,
  tech,
  miiddle,
}) {
  const priorities = pmo.data.decisionBacklog.slice(0, 4)
  const criticalCount = pmo.data.decisionBacklog.filter((item) => item.impact === 'high').length
  const topInitiatives = pmo.data.spotlightInitiatives.slice(0, 4)
  const orgHealth = Number(String(pmo.data.kpis[0]?.value ?? '0').split('/')[0]) || 0
  const execLoad = Math.min(95, 45 + priorities.length * 10)
  const attentionLevel = orgHealth >= 85 ? 'Healthy' : orgHealth >= 70 ? 'Watch closely' : 'Needs attention'
  const attentionColor =
    orgHealth >= 85 ? 'linear-gradient(90deg, #22c55e, #14b8a6)' : orgHealth >= 70 ? 'linear-gradient(90deg, #f59e0b, #f97316)' : 'linear-gradient(90deg, #ef4444, #f97316)'

  return (
    <section
      className="overflow-hidden rounded-[28px] border shadow-2xl"
      style={{
        background: 'linear-gradient(180deg, #0b0f14 0%, #101720 100%)',
        borderColor: 'rgba(148, 163, 184, 0.16)',
      }}
    >
      <div className="flex min-h-[760px] flex-col lg:flex-row">
        <aside
          className="w-full border-b px-5 py-6 lg:w-72 lg:border-b-0 lg:border-r"
          style={{
            background: 'linear-gradient(180deg, rgba(18, 24, 33, 0.98), rgba(10, 14, 20, 0.98))',
            borderColor: 'rgba(71, 85, 105, 0.35)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-xl"
              style={{ background: 'linear-gradient(135deg, #facc15, #f97316)' }}
            />
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

        <div className="flex-1">
          <header
            className="flex flex-col gap-4 border-b px-6 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-8"
            style={{
              background: 'rgba(18, 24, 33, 0.86)',
              borderColor: 'rgba(71, 85, 105, 0.35)',
            }}
          >
            <div>
              <p className="text-sm text-white/55">Good morning, Executive</p>
              <h1 className="mt-1 text-2xl font-semibold text-white">Leadership command dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/pmo-ops"
                className="rounded-xl px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}
              >
                Open Martin PMO-Ops
              </Link>
              <div className="h-10 w-10 rounded-full border-2 border-emerald-400 bg-slate-500/70" />
            </div>
          </header>

          <div className="p-6 lg:p-8">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
              <div
                className="rounded-3xl p-6 shadow-lg lg:col-span-2"
                style={{ background: 'linear-gradient(135deg, #14b8a6, #0891b2)' }}
              >
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

              <div
                className="rounded-3xl border p-6 shadow-lg"
                style={{
                  background: 'rgba(26, 35, 50, 0.9)',
                  borderColor: 'rgba(71, 85, 105, 0.45)',
                }}
              >
                <p className="text-sm font-semibold text-slate-400">Operational status</p>
                <p className="mt-3 text-3xl font-bold text-amber-400">{attentionLevel}</p>
                <p className="mt-2 text-sm text-slate-300">
                  Business health is {orgHealth}/100 across planning signals.
                </p>
                <ProgressBar value={orgHealth} color={attentionColor} />
              </div>

              <div
                className="rounded-3xl p-6 shadow-lg"
                style={{ background: 'linear-gradient(135deg, #fb923c, #ef4444)' }}
              >
                <p className="text-sm font-semibold text-white/80">Executive load</p>
                <p className="mt-3 text-4xl font-bold text-white">{execLoad}%</p>
                <p className="mt-2 text-sm text-white/75">
                  {execLoad >= 80 ? 'Delegation recommended' : 'Current decision load is manageable'}
                </p>
              </div>

              <div
                className="rounded-3xl border p-6 shadow-lg lg:col-span-3"
                style={{
                  background: 'rgba(26, 35, 50, 0.9)',
                  borderColor: 'rgba(71, 85, 105, 0.45)',
                }}
              >
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
                      className="rounded-2xl border p-4"
                      style={{ borderColor: 'rgba(100, 116, 139, 0.35)', background: 'rgba(11, 15, 20, 0.46)' }}
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

              <div
                className="rounded-3xl border p-6 shadow-lg"
                style={{
                  background: 'rgba(26, 35, 50, 0.9)',
                  borderColor: 'rgba(71, 85, 105, 0.45)',
                }}
              >
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
