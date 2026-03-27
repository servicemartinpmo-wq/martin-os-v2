'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMartinOs } from '@/context/MartinOsProvider'
import { appSections } from '@/features/shell/appModel'
import { cn } from '@/lib/cn'

const PERSPECTIVE_LINKS = [
  { id: 'PMO', label: 'PMO', href: '/pmo-ops' },
  { id: 'TECH_OPS', label: 'Tech-Ops', href: '/tech-ops' },
  { id: 'MIIDLE', label: 'Miiddle', href: '/miiddle' },
]

export default function OSNav() {
  const pathname = usePathname() ?? '/'
  const { appView, applyPerspective } = useMartinOs()

  return (
    <header
      className="sticky top-0 z-[500] glass-panel border-b-0 rounded-none"
      style={{ borderBottom: '1px solid var(--border-subtle)' }}
    >
      <div
        className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3 px-4 py-3"
        style={{ paddingLeft: 'max(1rem, env(safe-area-inset-left))', paddingRight: 'max(1rem, env(safe-area-inset-right))' }}
      >
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="font-display text-sm font-semibold"
            style={{ color: 'var(--text-primary)' }}
          >
            Martin OS
          </Link>
          <nav className="flex flex-wrap gap-1" aria-label="Perspective">
            {PERSPECTIVE_LINKS.map((p) => {
              const active = appView === p.id
              return (
                <Link
                  key={p.id}
                  href={p.href}
                  onClick={() =>
                    applyPerspective(
                      /** @type {'PMO' | 'TECH_OPS' | 'MIIDLE'} */ (p.id),
                    )
                  }
                  className={cn(
                    'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                  )}
                  style={{
                    border: '1px solid',
                    borderColor: active ? 'var(--accent)' : 'var(--border-subtle)',
                    background: active ? 'var(--accent-muted)' : 'transparent',
                    color: active ? 'var(--text-primary)' : 'var(--text-muted)',
                  }}
                >
                  {p.label}
                </Link>
              )
            })}
          </nav>
        </div>
        <nav className="flex flex-wrap gap-1 text-xs" aria-label="Domains">
          {appSections.map((s) => {
            const active = pathname === s.href || pathname.startsWith(`${s.href}/`)
            return (
              <Link
                key={s.id}
                href={s.href}
                className="rounded-md px-2 py-1 transition-colors"
                style={{
                  color: active ? 'var(--accent)' : 'var(--text-muted)',
                  borderBottom: active ? '2px solid var(--accent)' : undefined,
                }}
              >
                {s.title}
              </Link>
            )
          })}
          <Link
            href="/import"
            className="rounded-md px-2 py-1"
            style={{
              color:
                pathname.startsWith('/import') ? 'var(--accent)' : 'var(--text-muted)',
              borderBottom: pathname.startsWith('/import') ? '2px solid var(--accent)' : undefined,
            }}
          >
            Import
          </Link>
          <Link
            href="/settings"
            className="rounded-md px-2 py-1"
            style={{ color: 'var(--text-muted)' }}
          >
            Settings
          </Link>
        </nav>
      </div>
    </header>
  )
}
