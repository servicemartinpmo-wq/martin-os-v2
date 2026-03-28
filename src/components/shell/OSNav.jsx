'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { useMartinOs } from '@/context/MartinOsProvider'
import { appSections } from '@/features/shell/appModel'
import { cn } from '@/lib/cn'
import PresenceOrb from '@/components/canvas/PresenceOrb'
import { useMartinStore } from '@/store/useMartinStore'
import {
  getLayoutModeById,
  getThemePresetById,
  getUserModeById,
} from '@/lib/themePresetsV2'

/**
 * @param {string} pathname
 * @param {import('next/navigation').ReadonlyURLSearchParams} searchParams
 * @param {string} href
 */
function isHrefActive(pathname, searchParams, href) {
  try {
    const u = new URL(href, 'http://localhost')
    const path = u.pathname || '/'
    const pathMatches = pathname === path || pathname.startsWith(`${path}/`)
    if (!pathMatches) return false
    if (u.search) {
      if (pathname !== path) return false
      for (const [k, v] of u.searchParams) {
        if (searchParams.get(k) !== v) return false
      }
      return true
    }
    if (href === '/' || href === '') {
      const plugin = searchParams.get('plugin')
      return !plugin || plugin === 'dashboard'
    }
    return pathname === path || pathname.startsWith(`${path}/`)
  } catch {
    return false
  }
}

const PERSPECTIVE_LINKS = [
  { id: 'PMO', label: 'Planning', href: '/' },
  { id: 'TECH_OPS', label: 'Support', href: '/?plugin=tech-ops' },
  { id: 'MIIDLE', label: 'Studio', href: '/?plugin=miidle' },
]

const LIGHTWEIGHT_LINKS = [
  { label: 'Today', href: '/' },
  { label: 'Work', href: '/pmo-ops/initiatives' },
  { label: 'Create', href: '/?plugin=miidle' },
  { label: 'Updates', href: '/pmo-ops/reports' },
  { label: 'Preferences', href: '/settings' },
]

export default function OSNav() {
  const pathname = usePathname() ?? '/'
  const searchParams = useSearchParams()
  const { appView, applyPerspective, layoutMode, userMode, themePresetId } =
    useMartinOs()
  const setCommandOpen = useMartinStore((s) => s.setCommandOpen)
  const activeTheme = getThemePresetById(themePresetId)
  const activeLayout = getLayoutModeById(layoutMode)
  const activeMode = getUserModeById(userMode)

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
          <div className="flex items-center gap-2">
            <PresenceOrb size={22} />
            <Link
              href="/"
              className="font-display text-sm font-semibold"
              style={{ color: 'var(--text-primary)' }}
            >
              Martin OS
            </Link>
          </div>
          <nav className="flex flex-wrap gap-1" aria-label="Perspective">
            {userMode === 'healthcare' || userMode === 'freelance'
              ? LIGHTWEIGHT_LINKS.map((l) => {
                  const active = isHrefActive(pathname, searchParams, l.href)
                  return (
                    <Link
                      key={l.href}
                      href={l.href}
                      className={cn('rounded-md px-3 py-1.5 text-xs font-medium transition-colors')}
                      style={{
                        border: '1px solid',
                        borderColor: active ? 'var(--accent)' : 'var(--border-subtle)',
                        background: active ? 'var(--accent-muted)' : 'transparent',
                        color: active ? 'var(--text-primary)' : 'var(--text-muted)',
                        minHeight: '44px',
                        display: 'inline-flex',
                        alignItems: 'center',
                      }}
                    >
                      {l.label}
                    </Link>
                  )
                })
              : PERSPECTIVE_LINKS.map((p) => {
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
        <div className="flex flex-wrap items-center justify-end gap-3">
          <div className="hidden items-center gap-2 md:flex">
            <span className="mos-chip">{activeTheme?.label ?? themePresetId}</span>
            <span className="mos-chip">{activeLayout?.label ?? layoutMode}</span>
            <span className="mos-chip">{activeMode?.label ?? userMode}</span>
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
            Bring in data
          </Link>
          <Link
            href="/community/playbooks"
            className="rounded-md px-2 py-1"
            style={{
              color: pathname.startsWith('/community') ? 'var(--accent)' : 'var(--text-muted)',
              borderBottom: pathname.startsWith('/community') ? '2px solid var(--accent)' : undefined,
            }}
          >
            Guides
          </Link>
          <Link
            href="/ontology"
            className="rounded-md px-2 py-1"
            style={{
              color: pathname.startsWith('/ontology') ? 'var(--accent)' : 'var(--text-muted)',
              borderBottom: pathname.startsWith('/ontology') ? '2px solid var(--accent)' : undefined,
            }}
          >
            Behind the scenes
          </Link>
          <Link
            href="/settings"
            className="rounded-md px-2 py-1"
            style={{
              color: pathname.startsWith('/settings') ? 'var(--accent)' : 'var(--text-muted)',
              borderBottom: pathname.startsWith('/settings') ? '2px solid var(--accent)' : undefined,
            }}
          >
            Preferences
          </Link>
          <button
            onClick={() => setCommandOpen(true)}
            className="rounded-md px-2 py-1 flex items-center gap-1"
            style={{ color: 'var(--text-muted)', border: '1px solid var(--border-subtle)' }}
          >
            <span>⌘K</span>
          </button>
          </nav>
        </div>
      </div>
    </header>
  )
}
