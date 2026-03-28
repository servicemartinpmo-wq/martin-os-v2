'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { appSections } from '@/features/shell/appModel'
import { cn } from '@/lib/cn'

const SIDEBAR_LINKS = [
  { label: 'Home', href: '/' },
  ...appSections.map((s) => ({ label: s.title, href: s.href })),
  { label: 'Import', href: '/import' },
  { label: 'Playbooks', href: '/community/playbooks' },
  { label: 'Ontology', href: '/ontology' },
  { label: 'Settings', href: '/settings' },
]

/**
 * @param {string} pathname
 */
function mainTitleFromPath(pathname) {
  if (!pathname || pathname === '/') return 'Dashboard'
  const parts = pathname.split('/').filter(Boolean)
  const last = parts[parts.length - 1] ?? 'Page'
  return last
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

function AppSidebar() {
  const pathname = usePathname() ?? '/'

  return (
    <aside
      className="hidden h-full w-64 shrink-0 flex-col border-r lg:flex"
      style={{
        borderColor: 'var(--border-subtle)',
        background: 'var(--bg-base)',
      }}
      aria-label="Workspace"
    >
      <div
        className="flex shrink-0 items-center justify-between border-b p-3"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <span
          className="text-xs font-semibold uppercase tracking-wide"
          style={{ color: 'var(--text-muted)' }}
        >
          Navigation
        </span>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-2" aria-label="Primary">
        {SIDEBAR_LINKS.map((item) => {
          const active =
            item.href === '/'
              ? pathname === '/' || pathname === ''
              : pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'block rounded-md px-2 py-2 text-sm font-medium transition-colors',
                'hover:[background:var(--accent-muted)] hover:[color:var(--text-primary)]',
              )}
              style={{
                background: active ? 'var(--accent-muted)' : 'transparent',
                color: active ? 'var(--text-primary)' : 'var(--text-muted)',
              }}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

function MainChrome() {
  const pathname = usePathname() ?? '/'
  const title = mainTitleFromPath(pathname)

  return (
    <div
      className="flex h-12 shrink-0 items-center border-b px-4"
      style={{
        borderColor: 'var(--border-subtle)',
        background: 'var(--header-bg)',
      }}
    >
      <div className="truncate text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
        {title}
      </div>
    </div>
  )
}

/**
 * Viewport-locked app shell: global header, scrollable sidebar + main column.
 * @param {{ header: import('react').ReactNode; children: import('react').ReactNode }} props
 */
export function AppShell({ header, children }) {
  return (
    <div
      className="flex h-dvh flex-col overflow-hidden antialiased"
      style={{
        background: 'var(--bg-base)',
        color: 'var(--text-primary)',
      }}
    >
      <div className="shrink-0">{header}</div>
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <AppSidebar />
        <main
          className="flex min-h-0 min-w-0 flex-1 flex-col"
          style={{ background: 'var(--panel-bg)' }}
        >
          <MainChrome />
          <div className="relative min-h-0 flex-1 overflow-auto p-4 md:p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
