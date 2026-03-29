'use client'

/**
 * Home dashboard — mockup-aligned: work graph, signals + EXECUTE, glass right rail (KPIs / AI).
 * Next.js (`next/link`) + Tailwind CSS.
 */
import { useMemo } from 'react'
import Link from 'next/link'
import {
  Activity,
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  Search,
  ShieldAlert,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
import WorkGraphPreview from '@/components/dashboard/WorkGraphPreview'
import MetricStoryCards from '@/components/dashboard/MetricStoryCards'
import QuickitDashboardSkin from '@/components/dashboard/QuickitDashboardSkin'
import EnvironmentalSection from '@/components/dashboard/EnvironmentalSection'
import DashboardLegalFooter from '@/components/dashboard/DashboardLegalFooter'
import { usePmoOrgDashboardData } from '@/features/pmo/usePmoOrgDashboardData'
import {
  buildCompanyIntelligencePillars,
  buildRiskAlertLanes,
} from '@/lib/companyIntelligence'
import { getMaturityBand } from '@/lib/maturityBand'
import { useMartinStore } from '@/store/useMartinStore'
import { useMartinOs } from '@/context/MartinOsProvider'
import { cn } from '@/lib/cn'

const MODE_INTRO = {
  founder_operator_smb: {
    title: 'Founder / office oversight',
    body: 'Finances, day-to-day operations, and “no surprises” — balls in flight surface here first.',
  },
  executive: {
    title: 'Executive command picture',
    body: 'Org-level visibility: exceptions, trajectory, and what needs a decision — not every task.',
  },
  assisted: {
    title: 'Simple today view',
    body: 'Hover any label for a short explanation. Green means good, amber means watch, red means act soon.',
  },
  admin_project: {
    title: 'Project & compliance posture',
    body: 'Delivery detail, PMBOK-style hygiene, and initiative health in one scan.',
  },
  freelance: {
    title: 'Solo operator pulse',
    body: 'Clients, pipeline, and delivery — keep the hobby or practice organized without enterprise bloat.',
  },
  creative: {
    title: 'Creative studio pulse',
    body: 'Story, proof, and marketing signals — operational backbone without spreadsheet energy.',
  },
  healthcare: {
    title: 'Service & readiness',
    body: 'Calm oversight similar to founder mode — handoffs, exceptions, and operational status.',
  },
  startup: {
    title: 'Launch & momentum',
    body: 'Velocity, risks, and where to intervene this week as you scale.',
  },
  creative_default: {
    title: 'Operating command',
    body: 'Closed loop: data → signals → diagnosis → next actions → follow-through.',
  },
}

function riskLaneChrome(level) {
  switch (level) {
    case 'ok':
      return {
        border: 'border-emerald-200',
        bg: 'bg-emerald-50/90',
        chip: 'bg-emerald-600 text-white',
        label: 'On track',
      }
    case 'watch':
      return {
        border: 'border-amber-200',
        bg: 'bg-amber-50/90',
        chip: 'bg-amber-600 text-white',
        label: 'Watch',
      }
    case 'act':
    default:
      return {
        border: 'border-red-200',
        bg: 'bg-red-50/90',
        chip: 'bg-red-600 text-white',
        label: 'Act',
      }
  }
}

const PILLAR_HELP = {
  Ops: 'How smoothly work moves: throughput, blockers, and operational load.',
  Revenue: 'Cash and pipeline health vs. plan.',
  Product: 'Delivery progress across active initiatives.',
  Team: 'Capacity and ownership clarity.',
}

/** Mockup-style frosted panels (glassmorphism-lite). */
const GLASS =
  'rounded-3xl border border-white/70 bg-white/55 p-5 shadow-[0_24px_60px_-28px_rgba(15,23,42,0.14)] backdrop-blur-xl ring-1 ring-slate-200/40'

export default function LaminatedCommandCanvas() {
  const { data, loading } = usePmoOrgDashboardData()
  const homeDashboardSkin = useMartinStore((s) => s.homeDashboardSkin)
  const { userMode } = useMartinOs()
  const setCommandOpen = useMartinStore((s) => s.setCommandOpen)

  const score = Math.max(0, Math.min(100, Number(data.orgHealth) || 0))

  if (homeDashboardSkin === 'quickit') {
    return <QuickitDashboardSkin orgHealth={data.orgHealth} loading={loading} />
  }
  const band = getMaturityBand(score)
  const intro = MODE_INTRO[userMode] ?? MODE_INTRO.creative_default
  const assisted = userMode === 'assisted'

  const pillars = useMemo(
    () =>
      buildCompanyIntelligencePillars({
        orgHealth: data.orgHealth,
        atRisk: data.atRisk,
        avgCompletion: data.avgCompletion,
        activeInitiatives: data.activeInitiatives,
      }),
    [data.orgHealth, data.atRisk, data.avgCompletion, data.activeInitiatives],
  )

  const pillarCards = useMemo(
    () => [
      { key: 'ops', label: 'Ops', value: pillars.ops, accent: 'border-cyan-200/80 bg-cyan-50/70' },
      { key: 'revenue', label: 'Revenue', value: pillars.revenue, accent: 'border-blue-200/80 bg-blue-50/70' },
      { key: 'product', label: 'Product', value: pillars.product, accent: 'border-violet-200/80 bg-violet-50/70' },
      { key: 'team', label: 'Team', value: pillars.team, accent: 'border-amber-200/80 bg-amber-50/60' },
    ],
    [pillars],
  )

  const riskLanes = useMemo(
    () =>
      buildRiskAlertLanes({
        orgHealth: data.orgHealth,
        atRisk: data.atRisk,
        avgCompletion: data.avgCompletion,
        insightFeed: data.insightFeed,
      }),
    [data.orgHealth, data.atRisk, data.avgCompletion, data.insightFeed],
  )

  const signals = useMemo(() => {
    const base = data.insightFeed.slice(0, 4)
    const fill = [
      {
        id: 'demo-0',
        title: 'Marketing capacity',
        summary: 'Campaign throughput vs. team load — rebalance owners before deadlines slip.',
        signal: 'yellow',
      },
      {
        id: 'demo-1',
        title: 'Revenue signal',
        summary: 'Pipeline coverage vs. target — review forecast assumptions.',
        signal: 'watch',
      },
      {
        id: 'demo-2',
        title: 'Customer retention',
        summary: 'Renewal cohort stable; watch onboarding NPS for early churn.',
        signal: 'green',
      },
      {
        id: 'demo-3',
        title: 'Security posture',
        summary: 'Ownership stack checks green; schedule quarterly audit.',
        signal: 'healthy',
      },
    ]
    const out = [...base]
    let i = 0
    while (out.length < 4 && i < fill.length) {
      if (!out.some((x) => x.id === fill[i].id)) out.push(fill[i])
      i += 1
    }
    return out.slice(0, 4)
  }, [data.insightFeed])

  const briefing = data.spotlightInitiatives.slice(0, 3)
  const decisions = data.decisionBacklog.slice(0, 4)
  const diagnosis =
    data.insightFeed[0]?.summary ??
    'Reallocate focus from reactive support to milestone-critical path work to protect delivery dates.'

  const textScale = assisted ? 'text-base' : 'text-sm'
  const headingScale = assisted ? 'text-sm' : 'text-[11px]'

  const signalHealthy = (sig) =>
    /green|healthy|blue|ok/i.test(String(sig ?? ''))

  return (
    <div className={cn('mb-8 space-y-5', assisted && 'text-[1.05rem]')}>
      {/* Top bar — mockup: breadcrumbs + search pill */}
      <div
        className={cn(
          'flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between lg:gap-6',
          GLASS,
        )}
      >
        <div className="min-w-0" title={assisted ? intro.body : undefined}>
          <p className="text-[11px] font-semibold tracking-wide text-slate-400">
            Internalized <span className="text-slate-300">/</span>{' '}
            <span className="text-[#001F3F]">Action board</span>
          </p>
          <p className={cn('mt-1 font-display font-bold text-[#001F3F]', assisted ? 'text-xl' : 'text-lg')}>
            {intro.title}
          </p>
          <p className={cn('mt-1 max-w-xl text-slate-600', textScale)}>{intro.body}</p>
        </div>
        <button
          type="button"
          onClick={() => setCommandOpen(true)}
          className="flex w-full max-w-md items-center gap-3 rounded-full border border-slate-200/90 bg-slate-50/80 px-4 py-2.5 text-left text-sm text-slate-400 shadow-inner transition hover:border-[#001F3F]/20 hover:bg-white sm:w-72"
        >
          <Search className="h-4 w-4 shrink-0 opacity-60" aria-hidden />
          <span>Type to search…</span>
          <kbd className="ml-auto hidden rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-mono text-slate-500 sm:inline">
            ⌘K
          </kbd>
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_minmax(17.5rem,20rem)] xl:grid-cols-[1fr_22rem]">
        {/* Main column */}
        <div className="space-y-5">
          <WorkGraphPreview />

          <MetricStoryCards orgHealth={score} activeInitiatives={data.activeInitiatives} />

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {pillarCards.map((p) => (
              <div
                key={p.key}
                title={assisted ? PILLAR_HELP[p.label] : undefined}
                className={cn(
                  'rounded-2xl border px-2 py-3 text-center shadow-sm backdrop-blur-sm',
                  p.accent,
                )}
              >
                <p className={cn('font-bold text-slate-500 uppercase', headingScale)}>{p.label}</p>
                <p className="mt-1 font-display text-xl font-black tabular-nums text-[#001F3F]">
                  {loading ? '—' : p.value}
                </p>
              </div>
            ))}
          </div>

          <section className={cn(GLASS, 'relative')}>
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-[#001F3F]">
                <TrendingUp className="h-4 w-4" aria-hidden />
                Signals
              </h3>
              <span className="text-[10px] font-semibold text-slate-400">Live feed</span>
            </div>
            <ul className="space-y-2">
              {signals.map((s) => {
                const ok = signalHealthy(s.signal)
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => setCommandOpen(true)}
                      className="flex w-full items-start gap-3 rounded-2xl border border-slate-100/90 bg-slate-50/50 p-3 text-left transition hover:border-[#001F3F]/15 hover:bg-white/80"
                      title={assisted ? `${s.title}. ${s.summary}` : undefined}
                    >
                      {ok ? (
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" aria-hidden />
                      ) : (
                        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" aria-hidden />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-[#001F3F]">{s.title}</p>
                        <p className={cn('mt-1 text-slate-600', assisted ? 'text-sm' : 'text-xs')}>
                          {s.summary}
                        </p>
                      </div>
                      <span
                        className={cn(
                          'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase',
                          ok ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900',
                        )}
                      >
                        {ok ? 'Stable' : 'Watch'}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
            <div className="mt-4 flex justify-end border-t border-slate-100/80 pt-4">
              <button
                type="button"
                onClick={() => setCommandOpen(true)}
                className="rounded-full bg-[#001F3F] px-8 py-2.5 text-xs font-black tracking-[0.15em] text-white uppercase shadow-lg shadow-[#001F3F]/25 transition hover:bg-[#003366]"
              >
                Execute
              </button>
            </div>
          </section>

          <section>
            <div className="mb-2 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-[#001F3F]" aria-hidden />
              <h3 className={cn('font-black text-[#001F3F] uppercase', headingScale)}>Risk alerts</h3>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              {riskLanes.map((lane) => {
                const chrome = riskLaneChrome(lane.level)
                return (
                  <div
                    key={lane.id}
                    className={cn('rounded-2xl border p-3 shadow-sm', chrome.border, chrome.bg)}
                    title={assisted ? lane.detail : undefined}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-bold text-[#001F3F]">{lane.label}</p>
                      <span className={cn('rounded-full px-2 py-0.5 text-[9px] font-black uppercase', chrome.chip)}>
                        {chrome.label}
                      </span>
                    </div>
                    <p className="mt-2 text-[11px] leading-snug text-slate-700">{lane.detail}</p>
                  </div>
                )
              })}
            </div>
          </section>

          <section className={GLASS}>
            <div className="mb-3 flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-[#001F3F]" aria-hidden />
              <h3 className="text-sm font-black uppercase text-[#001F3F]">Daily briefing</h3>
            </div>
            <ul className="grid gap-2 md:grid-cols-3">
              {briefing.map((init, idx) => (
                <li
                  key={init.id}
                  className="rounded-2xl border border-slate-100 bg-white/60 p-3"
                  title={assisted ? `${init.name} · ${init.owner}` : undefined}
                >
                  <p className="text-[9px] font-bold text-slate-400 uppercase">P{idx + 1}</p>
                  <p className="mt-1 text-sm font-bold text-[#001F3F]">{init.name}</p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    {init.owner} · {init.completion}%
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Right rail — glass stack */}
        <aside className="flex flex-col gap-4">
          <div className={GLASS}>
            <p className={cn('font-bold tracking-[0.2em] text-slate-400 uppercase', headingScale)}>
              Company health
            </p>
            <p className="mt-2 font-display text-4xl font-black tabular-nums text-[#001F3F]">
              {loading ? '—' : score}
              <span className="text-xl font-bold text-slate-400">/100</span>
            </p>
            <p className={cn('mt-1 text-sm font-semibold', band.textClass)}>{band.label}</p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200/80">
              <div className={cn('h-full rounded-full transition-all', band.barClass)} style={{ width: `${score}%` }} />
            </div>
          </div>

          <div className={GLASS}>
            <h4 className="text-xs font-black uppercase tracking-wide text-[#001F3F]">Objectives</h4>
            <p className={cn('mt-2 text-slate-600', textScale)}>
              Align execution to revenue, retention, and launch milestones. The work graph shows how initiatives
              connect to outcomes.
            </p>
          </div>

          <div className={GLASS}>
            <h4 className="text-xs font-black uppercase tracking-wide text-[#001F3F]">Top KPIs</h4>
            <ul className="mt-3 space-y-3">
              <li className="flex items-baseline justify-between gap-2 border-b border-slate-100/80 pb-2">
                <span className="text-sm text-slate-600">Pipeline health</span>
                <span className="font-display text-lg font-bold text-emerald-600">
                  {loading ? '—' : `${pillars.revenue}%`}
                </span>
              </li>
              <li className="flex items-baseline justify-between gap-2 border-b border-slate-100/80 pb-2">
                <span className="text-sm text-slate-600">Active initiatives</span>
                <span className="font-display text-lg font-bold text-[#001F3F]">{data.activeInitiatives}</span>
              </li>
              <li className="flex items-baseline justify-between gap-2">
                <span className="text-sm text-slate-600">Avg completion</span>
                <span className="font-display text-lg font-bold text-sky-600">
                  {data.avgCompletion != null ? `${data.avgCompletion}%` : '—'}
                </span>
              </li>
            </ul>
          </div>

          <div className={GLASS}>
            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" aria-hidden />
              <h4 className="text-xs font-black uppercase tracking-wide text-[#001F3F]">AI suggestions</h4>
            </div>
            <p className="text-sm italic leading-relaxed text-slate-700">&ldquo;{diagnosis}&rdquo;</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setCommandOpen(true)}
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-[#001F3F] shadow-sm hover:bg-slate-50"
              >
                Analyze
              </button>
              <Link
                href="/pmo-ops/advisory"
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                Open advisory
              </Link>
            </div>
          </div>

          <div className={GLASS}>
            <div className="mb-2 flex items-center gap-2">
              <Activity className="h-4 w-4 text-[#001F3F]" aria-hidden />
              <h4 className="text-xs font-black uppercase tracking-wide text-[#001F3F]">Action queue</h4>
            </div>
            <div
              className="mb-3 h-10 w-full overflow-hidden rounded-xl bg-gradient-to-r from-indigo-100/80 via-white to-cyan-100/80 ring-1 ring-slate-200/50"
              title="Queue depth (illustrative)"
            >
              <div className="h-full w-full bg-[length:12px_100%] bg-gradient-to-r from-transparent via-[#001F3F]/10 to-transparent opacity-80" />
            </div>
            <ul className="space-y-2">
              {decisions.map((d) => (
                <li
                  key={d.id}
                  className="flex items-start justify-between gap-2 rounded-xl border border-slate-100 bg-white/50 px-2.5 py-2"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#001F3F]">{d.title}</p>
                    <p className="text-[10px] text-slate-500">{d.decisionBy}</p>
                  </div>
                  <span
                    className={cn(
                      'shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase',
                      d.impact === 'high' ? 'bg-red-100 text-red-800' : 'bg-slate-200 text-slate-600',
                    )}
                  >
                    {d.impact}
                  </span>
                </li>
              ))}
            </ul>
            <Link
              href="/pmo-ops/decisions"
              className="mt-3 inline-block text-xs font-bold text-[#001F3F] underline-offset-2 hover:underline"
            >
              Decision log →
            </Link>
          </div>
        </aside>
      </div>

      <EnvironmentalSection />
      <DashboardLegalFooter />
    </div>
  )
}
