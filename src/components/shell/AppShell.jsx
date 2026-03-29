'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { appSections } from '@/features/shell/appModel'
import { cn } from '@/lib/cn'
import { useMartinStore } from '@/store/useMartinStore'
import MissionUnlockBanner from '@/components/shell/MissionUnlockBanner'

const SIDEBAR_LINKS = [
  { label: 'Home', href: '/', icon: '📊' },
  ...appSections.map((s, i) => ({
    label: s.title,
    href: s.href,
    icon: ['📈', '🖥️', '✨'][i] ?? '📁',
  })),
  { label: 'Import', href: '/import', icon: '📥' },
  { label: 'Playbooks', href: '/community/playbooks', icon: '📚' },
  { label: 'Ontology', href: '/ontology', icon: '🔗' },
  { label: 'Settings', href: '/settings', icon: '⚙️' },
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
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
      <Link href="/" className="flex items-center gap-2 p-6 text-2xl font-bold text-[#001F3F]">
        <div className="h-8 w-8 shrink-0 rounded-lg bg-[#001F3F]" aria-hidden />
        <span>Martin OS</span>
      </Link>
      <nav className="flex-1 space-y-1 overflow-y-auto px-4 pb-4" aria-label="Primary">
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
                'flex items-center rounded-xl px-4 py-3 text-slate-600 transition-colors',
                active
                  ? 'border-r-4 border-[#001F3F] bg-blue-50 font-medium text-[#001F3F]'
                  : 'hover:bg-slate-100',
              )}
            >
              <span className="mr-3" aria-hidden>
                {item.icon}
              </span>
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

function MainHeader() {
  const setCommandOpen = useMartinStore((s) => s.setCommandOpen)

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6 md:px-8">
      <div className="relative w-full max-w-md">
        <input
          type="text"
          readOnly
          onClick={() => setCommandOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              setCommandOpen(true)
            }
          }}
          placeholder="Search or press ⌘K…"
          className="w-full cursor-pointer rounded-full border-none bg-slate-100 py-2 pl-10 pr-4 text-sm text-[#001F3F] placeholder:text-slate-400 focus:ring-2 focus:ring-[#001F3F] focus:outline-none"
          aria-label="Open command center"
        />
        <span className="pointer-events-none absolute top-2.5 left-3 text-slate-400" aria-hidden>
          🔍
        </span>
      </div>
      <div className="ml-4 flex shrink-0 items-center gap-4">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-[#001F3F]">Martin Operator</p>
          <p className="text-xs text-slate-500">Workspace</p>
        </div>
        <Image
          src="https://ui-avatars.com/api/?name=Martin+Operator&background=001F3F&color=fff"
          alt="Profile avatar"
          width={40}
          height={40}
          className="h-10 w-10 rounded-full border-2 border-white shadow-sm"
        />
      </div>
    </header>
  )
}

function MobileNavStrip() {
  const pathname = usePathname() ?? '/'

  return (
    <div className="flex gap-1 overflow-x-auto border-b border-slate-200 bg-white px-3 py-2 lg:hidden">
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
              'shrink-0 rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors',
              active ? 'bg-[#001F3F] text-white' : 'bg-slate-100 text-slate-600',
            )}
          >
            {item.icon} {item.label}
          </Link>
        )
      })}
    </div>
  )
}

function AppFooter() {
  return (
    <footer className="flex h-12 shrink-0 items-center justify-between border-t border-slate-200 bg-white px-6 text-[10px] text-slate-400 md:px-8">
      <div className="flex gap-4">
        <Link href="/settings" className="hover:text-slate-600">
          Settings
        </Link>
        <span className="hidden sm:inline">·</span>
        <span className="hidden sm:inline">Tri-native PMO / Tech-Ops / Miiddle</span>
      </div>
      <div>
        <span className="font-bold text-[#001F3F]">Martin OS</span>
      </div>
    </footer>
  )
}

/**
 * Light SaaS shell: sidebar, main header with search → command center, scrollable content, footer.
 * @param {{ children: import('react').ReactNode }} props
 */
export function AppShell({ children }) {
  const pathname = usePathname() ?? '/'
  const title = mainTitleFromPath(pathname)

  return (
    <div className="mc-root flex h-dvh overflow-hidden bg-white font-sans text-[#001F3F] antialiased">
      <div className="hidden min-h-0 lg:flex">
        <AppSidebar />
      </div>
      <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <MainHeader />
        <MissionUnlockBanner />
        <MobileNavStrip />
        <section className="min-h-0 flex-1 overflow-y-auto p-6 md:p-8">
          <div className="mb-8 flex flex-col justify-end gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#001F3F]">{title}</h1>
              <p className="text-sm text-slate-500">
                Dashboard <span className="text-slate-400">›</span> {title}
              </p>
            </div>
            <p className="text-xs text-slate-400 italic">Live workspace</p>
          </div>
          {children}
        </section>
        <AppFooter />
      </main>
    </div>
  )
}
