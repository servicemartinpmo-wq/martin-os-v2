'use client'

/**
 * Lightweight work-graph visualization (mockup-style nodes + edges).
 * Next.js + Tailwind only — no graph library.
 */
import { cn } from '@/lib/cn'

const NODES = [
  {
    id: 'rev',
    label: 'Revenue growth',
    sub: 'North star',
    position: 'left-1/2 top-[14%] -translate-x-1/2 -translate-y-1/2',
    tone: 'orange',
  },
  {
    id: 'crm',
    label: 'Launch CRM',
    sub: 'In flight',
    position: 'left-[16%] top-[38%] -translate-x-1/2 -translate-y-1/2',
    tone: 'sky',
  },
  {
    id: 'ret',
    label: 'Customer retention',
    sub: 'Health',
    position: 'left-[84%] top-[38%] -translate-x-1/2 -translate-y-1/2',
    tone: 'teal',
  },
  {
    id: 'mrr',
    label: 'Q3 MRR',
    sub: 'Target path',
    position: 'left-[28%] top-[78%] -translate-x-1/2 -translate-y-1/2',
    tone: 'violet',
  },
  {
    id: 'cx',
    label: 'CX programs',
    sub: 'Delivery',
    position: 'left-[72%] top-[78%] -translate-x-1/2 -translate-y-1/2',
    tone: 'amber',
  },
]

const toneClass = {
  orange: 'border-orange-200/80 bg-orange-50/90 text-orange-950 shadow-orange-100/50',
  sky: 'border-sky-200/80 bg-sky-50/90 text-sky-950 shadow-sky-100/50',
  teal: 'border-teal-200/80 bg-teal-50/90 text-teal-950 shadow-teal-100/50',
  violet: 'border-violet-200/80 bg-violet-50/90 text-violet-950 shadow-violet-100/50',
  amber: 'border-amber-200/80 bg-amber-50/90 text-amber-950 shadow-amber-100/50',
}

/** Hub + satellite edges in SVG user space 0–100 */
const EDGES = [
  [50, 50, 50, 20],
  [50, 50, 18, 40],
  [50, 50, 82, 40],
  [50, 50, 30, 74],
  [50, 50, 70, 74],
]

export default function WorkGraphPreview({ className }) {
  return (
    <div
      className={cn(
        'relative isolate min-h-[min(20rem,52vw)] w-full overflow-hidden rounded-3xl border border-slate-200/70 bg-gradient-to-br from-white via-slate-50/40 to-indigo-50/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_20px_50px_-24px_rgba(15,23,42,0.12)]',
        className,
      )}
    >
      <div
        className="pointer-events-none absolute -left-24 -top-20 h-72 w-72 rounded-full bg-indigo-400/15 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-20 -bottom-24 h-64 w-64 rounded-full bg-sky-400/12 blur-3xl"
        aria-hidden
      />
      <svg
        className="absolute inset-0 h-full w-full text-slate-400/50"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <linearGradient id="wg-edge" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgb(148 163 184)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="rgb(99 102 241)" stopOpacity="0.35" />
          </linearGradient>
        </defs>
        {EDGES.map(([x1, y1, x2, y2], i) => (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="url(#wg-edge)"
            strokeWidth={0.55}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>

      <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
        <div className="rounded-2xl border border-[#001F3F]/15 bg-white/90 px-4 py-3 text-center shadow-lg shadow-slate-900/5 backdrop-blur-md">
          <p className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase">Work graph</p>
          <p className="mt-1 font-display text-sm font-bold text-[#001F3F]">Strategic spine</p>
          <p className="mt-0.5 text-[11px] text-slate-500">Goals · projects · KPIs</p>
        </div>
      </div>

      {NODES.map((n) => (
        <div
          key={n.id}
          className={cn(
            'absolute z-10 max-w-[9.5rem] rounded-2xl border px-3 py-2 text-center shadow-md backdrop-blur-sm',
            n.position,
            toneClass[n.tone],
          )}
        >
          <p className="text-[11px] font-bold leading-tight text-balance">{n.label}</p>
          <p className="mt-0.5 text-[9px] font-medium text-slate-500">{n.sub}</p>
        </div>
      ))}

      <p className="absolute bottom-3 left-4 text-[10px] font-medium text-slate-400">
        Internalized · dependency view
      </p>
    </div>
  )
}
