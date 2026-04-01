'use client'

import Link from 'next/link'
import { getMaturityBand } from '@/lib/maturityBand'
import { cn } from '@/lib/cn'

/**
 * Cinematic operational status summary (replaces 3D orb in PMO hero).
 * @param {{ score: number, loading?: boolean, iniFallback?: boolean, insFallback?: boolean }} props
 */
export default function OperationalStatusCard({
  score,
  loading = false,
  iniFallback = false,
  insFallback = false,
}) {
  const clamped = Math.max(0, Math.min(100, Number(score) || 0))
  const band = getMaturityBand(clamped)

  return (
    <div
      className={cn(
        'relative w-full max-w-md overflow-hidden rounded-3xl border-2 p-6 shadow-lg md:p-8',
        'bg-gradient-to-br from-white to-slate-50',
        band.borderClass,
      )}
    >
      <div
        className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-blue-200/30 blur-3xl"
        aria-hidden
      />
      <p className="text-[11px] font-semibold tracking-[0.2em] text-slate-500 uppercase">
        Operational status
      </p>
      <div className="mt-3 flex items-end gap-2">
        {loading ? (
          <p className="font-display text-4xl font-bold text-slate-400">…</p>
        ) : (
          <p className={cn('font-display text-5xl font-bold tabular-nums', band.textClass)}>{clamped}</p>
        )}
        <span className="mb-2 text-lg font-medium text-slate-400">/100</span>
      </div>
      <p className={cn('mt-2 text-sm font-semibold', band.textClass)}>{band.label}</p>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">
        Composite blends initiative telemetry with PMO insight signals — aligned with{' '}
        <span className="font-medium text-[#001F3F]">mpo-pilot</span> data shapes.
      </p>
      <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className={cn('h-full rounded-full transition-all duration-700 ease-out', band.barClass)}
          style={{ width: `${clamped}%` }}
        />
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {[
          { href: '/pmo-ops/initiatives', label: 'Initiatives' },
          { href: '/pmo-ops/diagnostics', label: 'Diagnostics' },
          { href: '/pmo-ops/command-center', label: 'Command center' },
        ].map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-[#001F3F] shadow-sm transition-colors hover:bg-slate-50"
          >
            {l.label}
          </Link>
        ))}
      </div>
      <p className="mt-4 text-center text-[11px] text-slate-500">
        {iniFallback || insFallback ? 'Demo cohort · connect Supabase for live data' : 'Live composite'}
      </p>
    </div>
  )
}
