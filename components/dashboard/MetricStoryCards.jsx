'use client'

/**
 * Image-backed metric tiles (company overview style) — Next.js Image + Tailwind.
 */
import Image from 'next/image'
import { TrendingUp } from 'lucide-react'
import { cn } from '@/lib/cn'

const CARDS = [
  {
    id: 'reach',
    label: 'Reach & traffic',
    valueKey: 'traffic',
    sub: 'Organic + paid touchpoints',
    image: '/dashboard/martin-overview-mockup.png',
    gradient: 'from-violet-600/30 to-transparent',
  },
  {
    id: 'social',
    label: 'Social growth',
    valueKey: 'social',
    sub: 'Followers & engagement',
    image: '/dashboard/quickit-reference.png',
    gradient: 'from-fuchsia-600/25 to-transparent',
  },
  {
    id: 'ads',
    label: 'Ad performance',
    valueKey: 'ads',
    sub: 'Blended ROAS signal',
    image: null,
    gradient: 'bg-gradient-to-br from-cyan-500/50 via-slate-900/40 to-indigo-600/50',
  },
  {
    id: 'engagement',
    label: 'Audience energy',
    valueKey: 'engage',
    sub: 'Comments, saves, shares',
    image: null,
    gradient: 'bg-gradient-to-br from-amber-500/45 via-rose-500/30 to-violet-600/40',
  },
]

/**
 * @param {{
 *   orgHealth: number
 *   activeInitiatives: number
 *   className?: string
 * }} props
 */
export default function MetricStoryCards({ orgHealth, activeInitiatives, className }) {
  const traffic = `${(128 + Math.round(orgHealth * 0.15) / 10).toFixed(1)}k`
  const social = `${(4.1 + activeInitiatives * 0.08).toFixed(1)}k`
  const ads = `${(3.2 + orgHealth / 40).toFixed(1)}x`
  const engage = `${(15 + Math.round(orgHealth * 0.12)).toLocaleString()}`

  const values = { traffic, social, ads, engage }

  return (
    <section className={cn('space-y-3', className)}>
      <div className="flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-[#001F3F]" aria-hidden />
        <h3 className="text-sm font-black uppercase tracking-wide text-[#001F3F]">Company pulse</h3>
        <span className="text-[10px] font-medium text-slate-400">Image-backed tiles · mockup-aligned</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {CARDS.map((c) => (
          <article
            key={c.id}
            className="group relative h-48 overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-100 shadow-md ring-1 ring-white/60"
          >
            {c.image ? (
              <Image
                src={c.image}
                alt=""
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                className="object-cover transition duration-500 group-hover:scale-[1.03]"
                priority={c.id === 'reach'}
              />
            ) : (
              <div className={cn('absolute inset-0', c.gradient)} />
            )}
            <div
              className={cn(
                'absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent',
                c.image && 'from-black/80',
              )}
            />
            <div className="absolute inset-x-0 bottom-0 p-4">
              <p className="text-[10px] font-bold tracking-wide text-white/70 uppercase">{c.label}</p>
              <p className="font-display text-3xl font-black tracking-tight text-white">
                {values[c.valueKey]}
              </p>
              <p className="mt-0.5 text-[11px] text-white/80">{c.sub}</p>
              <p className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-300">
                <TrendingUp className="h-3 w-3" aria-hidden />
                Live blend from org health
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
