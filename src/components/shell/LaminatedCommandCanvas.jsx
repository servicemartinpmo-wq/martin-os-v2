'use client'

import { useMemo } from 'react'
import { Activity, TrendingUp } from 'lucide-react'
import { usePmoOrgDashboardData } from '@/features/pmo/usePmoOrgDashboardData'
import { getMaturityBand } from '@/lib/maturityBand'
import { useMartinStore } from '@/store/useMartinStore'
import { cn } from '@/lib/cn'

/**
 * Home-route command canvas: closed-loop signal → diagnosis → action (Laminated White).
 */
export default function LaminatedCommandCanvas() {
  const { data, loading } = usePmoOrgDashboardData()
  const setCommandOpen = useMartinStore((s) => s.setCommandOpen)
  const score = Math.max(0, Math.min(100, Number(data.orgHealth) || 0))
  const band = getMaturityBand(score)

  const dims = [
    { label: 'Strategy', v: Math.min(100, score + 5) },
    { label: 'Ops', v: Math.max(0, score - 4) },
    { label: 'Risk', v: Math.max(0, 88 - Math.round(score * 0.35)) },
    { label: 'Growth', v: Math.min(100, score + 3) },
  ]

  const signals = useMemo(() => {
    const base = data.insightFeed.slice(0, 3)
    const fill = [
      {
        id: 'demo-0',
        title: 'Revenue signal',
        summary: 'Pipeline coverage vs. target — review forecast assumptions.',
        signal: 'watch',
      },
      {
        id: 'demo-1',
        title: 'Capacity signal',
        summary: 'Initiative X threshold trending — rebalance Tech-Ops vs PMO capacity.',
        signal: 'watch',
      },
      {
        id: 'demo-2',
        title: 'Security posture',
        summary: 'Ownership stack checks green; schedule quarterly audit.',
        signal: 'healthy',
      },
    ]
    const out = [...base]
    let i = 0
    while (out.length < 3 && i < fill.length) {
      if (!out.some((x) => x.id === fill[i].id)) out.push(fill[i])
      i += 1
    }
    return out.slice(0, 3)
  }, [data.insightFeed])

  const diagnosis =
    data.insightFeed[0]?.summary ??
    'Reallocate focus from reactive support to milestone-critical path work to protect delivery dates.'

  return (
    <div className="mb-8 grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <div className="space-y-6">
        <div
          className={cn(
            'rounded-[2rem] border border-white bg-white p-6 shadow-[0_20px_50px_-12px_rgba(0,31,63,0.12),0_0_0_1px_rgba(255,255,255,0.8)_inset] md:p-8',
            'ring-1 ring-slate-200/60',
          )}
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-[11px] font-bold tracking-[0.2em] text-slate-400 uppercase">
                Organizational health index
              </p>
              <p className="mt-2 font-display text-4xl font-black tabular-nums text-[#001F3F] md:text-5xl">
                {loading ? '—' : score}
                <span className="text-2xl font-bold text-slate-400">/100</span>
              </p>
              <p className={cn('mt-2 text-sm font-semibold', band.textClass)}>{band.label}</p>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-600">
                PMO-Ops (strategy & execution), Tech-Ops (infrastructure & security), Miiddle (marketing &
                social intelligence) — one closed loop: ingest → signal → diagnose → act → learn.
              </p>
            </div>
            <div className="grid w-full max-w-xs grid-cols-2 gap-3">
              {dims.map((d) => (
                <div
                  key={d.label}
                  className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3 text-center shadow-sm"
                >
                  <p className="text-[10px] font-bold tracking-wide text-slate-400 uppercase">{d.label}</p>
                  <p className="mt-1 text-lg font-black tabular-nums text-[#001F3F]">{loading ? '—' : d.v}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className={cn('h-full rounded-full transition-all', band.barClass)}
              style={{ width: loading ? '0%' : `${score}%` }}
            />
          </div>
        </div>

        <div>
          <h3 className="mb-4 flex items-center text-sm font-black text-[#001F3F] uppercase">
            <TrendingUp size={16} className="mr-2 text-[#001F3F]" aria-hidden />
            Live signals
          </h3>
          <div className="grid gap-3 sm:grid-cols-3">
            {signals.map((s) => (
              <div
                key={s.id}
                className="cursor-pointer rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-all hover:border-[#001F3F]/25 hover:shadow-md"
                role="button"
                tabIndex={0}
                onClick={() => setCommandOpen(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setCommandOpen(true)
                  }
                }}
              >
                <div className="text-xs font-bold text-slate-400 uppercase">Signal</div>
                <div className="mt-1 text-sm font-bold text-[#001F3F]">{s.title}</div>
                <div className="mt-2 line-clamp-2 text-xs text-slate-600">{s.summary}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] border border-white bg-white p-6 shadow-xl ring-1 ring-slate-200/60 md:p-6">
        <h3 className="mb-4 flex items-center text-sm font-black text-[#001F3F] uppercase">
          <Activity size={16} className="mr-2 text-[#001F3F]" aria-hidden />
          Chief of staff recommendations
        </h3>
        <div className="space-y-4">
          <div className="rounded-2xl bg-[#001F3F] p-5 text-white shadow-lg shadow-slate-900/20">
            <div className="text-xs font-medium text-white/60 uppercase">Strategic diagnosis</div>
            <p className="mt-2 text-sm font-medium italic leading-relaxed">&ldquo;{diagnosis}&rdquo;</p>
            <button
              type="button"
              onClick={() => setCommandOpen(true)}
              className="mt-5 w-full rounded-xl bg-white py-2.5 text-xs font-black tracking-wider text-[#001F3F] uppercase shadow-[0_4px_14px_rgba(255,255,255,0.25)] transition hover:bg-slate-100"
            >
              Execute action
            </button>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-500">
            Data ingestion → signal detection → framework-based diagnosis → action recommendation → execution →
            learning. Use the command center to route work across PMO-Ops, Tech-Ops, and Miiddle.
          </p>
        </div>
      </div>
    </div>
  )
}
