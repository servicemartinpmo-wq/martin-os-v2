'use client'

import { cn } from '@/lib/cn'

/**
 * Vibrant gradient header + white body metric tile (environmental / IoT style).
 */
export default function GradientMetricCard({ title, value, label, gradient, icon: Icon }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm ring-1 ring-slate-100/80">
      <div className={cn('flex items-center justify-between px-4 py-3 text-white shadow-inner', gradient)}>
        <span className="text-xs font-bold tracking-wide uppercase opacity-[0.98]">{title}</span>
        {Icon ? <Icon className="h-5 w-5 shrink-0 opacity-95" strokeWidth={2} aria-hidden /> : null}
      </div>
      <div className="px-4 py-4">
        <p className="font-display text-3xl font-black tabular-nums tracking-tight text-slate-900">{value}</p>
        <p className="mt-1 text-[10px] font-bold tracking-widest text-slate-400 uppercase">{label}</p>
      </div>
    </article>
  )
}
