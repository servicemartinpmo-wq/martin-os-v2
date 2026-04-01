'use client'

/**
 * Dark neon "trading desk" home skin — Quickit-inspired (glass, glow, donut, sparklines).
 * Next.js + Tailwind only; uses `/dashboard/quickit-reference.png` as hero texture.
 */
import Image from 'next/image'
import Link from 'next/link'
import { Bell, Rocket, Search } from 'lucide-react'
import { useMartinStore } from '@/store/useMartinStore'
import { cn } from '@/lib/cn'

function Sparkline({ className }) {
  return (
    <svg viewBox="0 0 80 24" className={cn('h-8 w-full text-emerald-400/90', className)} aria-hidden>
      <defs>
        <linearGradient id="qk-spark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.35" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M0 18 Q12 8 24 14 T48 10 T64 6 L80 4 L80 24 L0 24 Z"
        fill="url(#qk-spark)"
        className="text-emerald-500"
      />
      <path
        d="M0 18 Q12 8 24 14 T48 10 T64 6 L80 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className="drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]"
      />
    </svg>
  )
}

const ASSETS = [
  { name: 'Ethereum', sym: 'ETH', price: '$3,098.51', ch: '+5.50%', up: true },
  { name: 'Solana', sym: 'SOL', price: '$142.20', ch: '+3.10%', up: true },
  { name: 'Toncoin', sym: 'TON', price: '$5.84', ch: '-0.80%', up: false },
]

/**
 * @param {{
 *   orgHealth: number
 *   loading: boolean
 * }} props
 */
export default function QuickitDashboardSkin({ orgHealth, loading }) {
  const setCommandOpen = useMartinStore((s) => s.setCommandOpen)
  const setHomeDashboardSkin = useMartinStore((s) => s.setHomeDashboardSkin)
  const total = 51695 + Math.round(orgHealth * 120)
  const growth = (5.5 + orgHealth / 200).toFixed(2)

  return (
    <div className="mb-8 overflow-hidden rounded-[28px] border border-white/10 bg-[#0f111a] text-slate-200 shadow-[0_40px_100px_-40px_rgba(0,0,0,0.85)] ring-1 ring-white/5">
      <div className="relative min-h-[7rem] border-b border-white/10 px-5 py-4 md:min-h-[5.5rem] md:px-8">
        <div className="pointer-events-none absolute inset-0 opacity-25" aria-hidden>
          <Image
            src="/dashboard/quickit-reference.png"
            alt=""
            fill
            className="object-cover object-[center_12%]"
            sizes="100vw"
            priority
          />
        </div>
        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-lg shadow-lg shadow-fuchsia-500/30">
              ⚡
            </div>
            <div>
              <p className="text-xs font-bold tracking-wide text-slate-400 uppercase">Trading desk</p>
              <p className="font-display text-lg font-bold text-white">Martin pulse</p>
            </div>
          </div>
          <nav className="flex flex-wrap items-center gap-2">
            {['Dashboard', 'Market', 'Signals', 'Portfolio'].map((t, i) => (
              <button
                key={t}
                type="button"
                className={cn(
                  'rounded-full px-4 py-1.5 text-xs font-semibold transition',
                  i === 0 ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:bg-white/10 hover:text-white',
                )}
              >
                {t}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setCommandOpen(true)}
              className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-left text-xs text-slate-500 backdrop-blur-md md:max-w-xs md:flex-none"
            >
              <Search className="h-3.5 w-3.5 shrink-0" aria-hidden />
              <span className="truncate">Type to search…</span>
            </button>
            <button
              type="button"
              className="rounded-full border border-white/10 p-2 text-slate-400 hover:bg-white/10 hover:text-white"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
            </button>
            <div className="h-9 w-9 rounded-full border-2 border-emerald-400/50 bg-gradient-to-br from-slate-600 to-slate-800" />
          </div>
        </div>
      </div>

      <div className="grid gap-5 p-5 md:grid-cols-12 md:gap-6 md:p-8">
        <section className="space-y-4 md:col-span-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">Top momentum signals</h2>
            <span className="text-[10px] font-semibold text-slate-500">24H</span>
          </div>
          <div className="space-y-3">
            {ASSETS.map((a) => (
              <div
                key={a.sym}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-inner backdrop-blur-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {a.name}{' '}
                      <span className="text-slate-500">({a.sym})</span>
                    </p>
                    <p className="mt-1 font-mono text-lg text-white">{a.price}</p>
                    <p className={cn('text-xs font-bold', a.up ? 'text-emerald-400' : 'text-rose-400')}>
                      {a.ch}
                    </p>
                  </div>
                </div>
                <Sparkline />
              </div>
            ))}
          </div>
          <div className="rounded-3xl bg-gradient-to-br from-violet-600 via-fuchsia-600 to-rose-500 p-5 shadow-[0_0_40px_-10px_rgba(217,70,239,0.55)]">
            <span className="rounded-md bg-white/20 px-2 py-0.5 text-[10px] font-black text-white uppercase">
              Pro
            </span>
            <p className="mt-3 font-display text-xl font-bold text-white">Become a power operator</p>
            <p className="mt-2 text-sm text-white/85">
              Unlock predictive signals, deeper Miiddle analytics, and executive-grade exports.
            </p>
            <button
              type="button"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-white py-3 text-sm font-bold text-violet-700 shadow-lg transition hover:bg-slate-100"
            >
              <Rocket className="h-4 w-4" aria-hidden />
              Upgrade path
            </button>
            <Link
              href="/settings"
              className="mt-3 block text-center text-xs font-semibold text-white/80 underline-offset-2 hover:underline"
            >
              See all plans
            </Link>
          </div>
        </section>

        <section className="space-y-5 md:col-span-7">
          <div className="flex flex-col items-center justify-between gap-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl lg:flex-row">
            <div className="relative flex h-52 w-52 shrink-0 items-center justify-center">
              <div
                className="absolute inset-0 rounded-full shadow-[0_0_60px_rgba(168,85,247,0.25)]"
                style={{
                  background:
                    'conic-gradient(#a855f7 0deg 119deg, #14b8a6 119deg 212deg, #ec4899 212deg 291deg, #eab308 291deg 360deg)',
                }}
              />
              <div className="relative z-10 flex h-32 w-32 flex-col items-center justify-center rounded-full bg-[#0f111a] shadow-inner ring-1 ring-white/10">
                <p className="text-[10px] font-bold text-slate-500 uppercase">Blended</p>
                <p className="font-mono text-xl font-bold text-white">
                  {loading ? '—' : `$${total.toLocaleString()}`}
                </p>
                <p className="text-xs font-semibold text-emerald-400">+{growth}%</p>
              </div>
            </div>
            <ul className="w-full max-w-xs space-y-2 text-sm">
              {[
                { c: 'bg-purple-400', l: 'Strategic bets', p: '33%' },
                { c: 'bg-teal-400', l: 'Delivery core', p: '26%' },
                { c: 'bg-pink-400', l: 'Growth / Miiddle', p: '22%' },
                { c: 'bg-yellow-400', l: 'Other initiatives', p: '19%' },
              ].map((row) => (
                <li key={row.l} className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-slate-300">
                    <span className={cn('h-2 w-2 rounded-full', row.c)} />
                    {row.l}
                  </span>
                  <span className="font-mono text-slate-400">{row.p}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-bold text-white">Portfolio analytics</p>
              <div className="flex flex-wrap gap-2">
                {['5D', '7D', '1M', '1Y', 'All'].map((t, i) => (
                  <button
                    key={t}
                    type="button"
                    className={cn(
                      'rounded-full px-3 py-1 text-[10px] font-bold',
                      i === 3 ? 'bg-white text-slate-900' : 'bg-white/5 text-slate-500 hover:bg-white/10',
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="relative h-48 overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-b from-white/[0.07] to-transparent">
              <svg viewBox="0 0 400 120" className="h-full w-full text-white" preserveAspectRatio="none" aria-hidden>
                <defs>
                  <linearGradient id="qk-line" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgb(255 255 255)" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="rgb(255 255 255)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0 90 Q80 40 160 70 T320 35 L400 25 L400 120 L0 120 Z"
                  fill="url(#qk-line)"
                />
                <path
                  d="M0 90 Q80 40 160 70 T320 35 L400 25"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="drop-shadow-[0_0_12px_rgba(255,255,255,0.45)]"
                />
              </svg>
              <div className="absolute top-6 left-1/2 rounded-lg border border-white/20 bg-slate-900/90 px-2 py-1 font-mono text-xs text-white shadow-xl -translate-x-1/2">
                {loading ? '—' : `${(total / 1000).toFixed(2)}K`}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {['BTC', 'ETH', 'SOL', 'TON'].map((sym, i) => (
              <div
                key={sym}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-center backdrop-blur-sm"
              >
                <p className="text-[10px] font-bold text-slate-500">{sym}</p>
                <p className="mt-1 font-mono text-sm text-white">
                  {i === 0 ? '62.4k' : i === 1 ? '3.1k' : i === 2 ? '142' : '5.8'}
                </p>
                <p className="text-[10px] font-semibold text-emerald-400">+{2 + i * 0.4}%</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 px-5 py-3 text-center md:px-8">
        <p className="text-[10px] text-slate-500">Demo trading visual · numbers blend with org health</p>
        <button
          type="button"
          onClick={() => setHomeDashboardSkin('martin')}
          className="text-[10px] font-bold tracking-wide text-sky-400 uppercase underline-offset-2 hover:underline"
        >
          Back to laminated OS
        </button>
      </div>
    </div>
  )
}
