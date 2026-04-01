'use client'

/** Laminated shell — Next.js (`next/image`, `next/link`, `usePathname`) + Tailwind CSS. */
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bell, ChevronDown } from 'lucide-react'
import { appSections } from '@/features/shell/appModel'
import { cn } from '@/lib/cn'
import { useMartinStore } from '@/store/useMartinStore'
import { useMartinOs } from '@/context/MartinOsProvider'
import MissionUnlockBanner from '@/components/shell/MissionUnlockBanner'
import LaminatedCommandCanvas from '@/components/shell/LaminatedCommandCanvas'
import { USER_MODES } from '@/lib/themePresetsV2'

const SIDEBAR_LINKS = [
  { label: 'Command', href: '/', icon: '📊' },
  ...appSections.map((s, i) => ({
    label: s.title,
    href: s.href,
    icon: ['🧠', '🛡️', '📡'][i] ?? '📁',
  })),
  { label: 'Import', href: '/import', icon: '📥' },
  { label: 'Playbooks', href: '/community/playbooks', icon: '📚' },
  { label: 'Ontology', href: '/ontology', icon: '🔗' },
  { label: 'Settings', href: '/settings', icon: '⚙️' },
]

const ACTION_QUEUE = [
  { label: 'Review hiring', href: '/pmo-ops/initiatives' },
  { label: 'Miiddle budget', href: '/miidle' },
  { label: 'Security audit', href: '/tech-ops/diagnostics' },
  { label: 'PMO briefing', href: '/pmo-ops/briefing' },
]

/**
 * @param {string} pathname
 */
function mainTitleFromPath(pathname) {
  if (!pathname || pathname === '/') return 'Command center'
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
    <aside className="flex h-full w-[17rem] shrink-0 flex-col border-r border-white/10 bg-[#001F3F] text-white shadow-[4px_0_24px_rgba(0,31,63,0.15)]">
      <Link href="/" className="flex items-center gap-3 px-5 py-6">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-lg font-black text-[#001F3F] shadow-md"
          aria-hidden
        >
          M
        </div>
        <div>
          <span className="block font-display text-lg font-bold tracking-tight">Martin OS</span>
          <span className="text-[10px] font-medium tracking-wide text-white/50 uppercase">
            PMO-Ops · Tech-Ops · Miiddle
          </span>
        </div>
      </Link>
      <p className="px-5 pb-2 text-[10px] font-bold tracking-[0.15em] text-white/40 uppercase">Work graph</p>
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-4" aria-label="Primary">
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
                'flex items-center rounded-xl px-3 py-2.5 text-sm transition-all',
                active
                  ? 'bg-white/15 font-semibold text-white shadow-inner'
                  : 'text-white/75 hover:bg-white/10 hover:text-white',
              )}
            >
              <span className="mr-3 text-base opacity-90" aria-hidden>
                {item.icon}
              </span>
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="border-t border-white/10 px-5 py-4 text-[10px] leading-relaxed text-white/45">
        Closed-loop O/S: ingest → signal → diagnose → recommend → execute → learn.
      </div>
    </aside>
  )
}

function MainHeader() {
  const pathname = usePathname() ?? '/'
  const isHome = pathname === '/' || pathname === ''
  const setCommandOpen = useMartinStore((s) => s.setCommandOpen)
  const homeDashboardSkin = useMartinStore((s) => s.homeDashboardSkin)
  const setHomeDashboardSkin = useMartinStore((s) => s.setHomeDashboardSkin)
  const { userMode, setUserMode } = useMartinOs()
  const showHomeSkinToggle = isHome && userMode !== 'executive'

  return (
    <header className="flex h-[3.75rem] shrink-0 items-center gap-3 border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-xl md:gap-4 md:px-8">
      <button
        type="button"
        className="hidden rounded-xl border border-slate-200/80 p-2 text-slate-500 transition hover:bg-slate-50 lg:inline-flex"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
      </button>
      <div className="relative min-w-0 flex-1">
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
          placeholder="Ask Chief of Staff… (⌘K)"
          className="w-full cursor-pointer rounded-full border border-slate-200/80 bg-slate-50/90 py-2.5 pr-4 pl-10 text-sm text-[#001F3F] placeholder:text-slate-400 shadow-sm focus:ring-2 focus:ring-[#001F3F]/30 focus:outline-none"
          aria-label="Open command center"
        />
        <span className="pointer-events-none absolute top-2.5 left-3.5 text-slate-400" aria-hidden>
          🔍
        </span>
      </div>
      {showHomeSkinToggle ? (
        <div
          className="hidden shrink-0 items-center rounded-xl border border-slate-200/80 bg-slate-100/90 p-0.5 shadow-inner lg:flex"
          role="group"
          aria-label="Home dashboard visual style"
        >
          <button
            type="button"
            onClick={() => setHomeDashboardSkin('martin')}
            className={cn(
              'rounded-lg px-2.5 py-1.5 text-[10px] font-black tracking-wide uppercase transition',
              homeDashboardSkin === 'martin'
                ? 'bg-white text-[#001F3F] shadow-sm'
                : 'text-slate-500 hover:text-[#001F3F]',
            )}
          >
            Laminated
          </button>
          <button
            type="button"
            onClick={() => setHomeDashboardSkin('quickit')}
            className={cn(
              'rounded-lg px-2.5 py-1.5 text-[10px] font-black tracking-wide uppercase transition',
              homeDashboardSkin === 'quickit'
                ? 'bg-[#0f111a] text-white shadow-sm'
                : 'text-slate-500 hover:text-[#001F3F]',
            )}
          >
            Trading
          </button>
        </div>
      ) : null}
      <div className="relative hidden shrink-0 sm:block">
        <select
          value={userMode}
          onChange={(e) => setUserMode(e.target.value, { userInitiated: true })}
          className="h-10 max-w-[11rem] cursor-pointer appearance-none truncate rounded-xl border border-slate-200/80 bg-white py-0 pr-9 pl-3 text-xs font-semibold text-[#001F3F] shadow-sm focus:ring-2 focus:ring-[#001F3F]/25 focus:outline-none md:max-w-[14rem]"
          aria-label="Interaction mode"
        >
          {USER_MODES.map((m) => (
            <option key={m.id} value={m.id}>
              {m.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute top-1/2 right-2.5 h-4 w-4 -translate-y-1/2 text-slate-400"
          aria-hidden
        />
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <div className="hidden text-right md:block">
          <p className="text-xs font-semibold text-[#001F3F]">Operator</p>
          <p className="text-[10px] text-slate-500">Workspace</p>
        </div>
        <Image
          src="https://ui-avatars.com/api/?name=Martin+Operator&background=001F3F&color=fff"
          alt="Profile avatar"
          width={40}
          height={40}
          className="h-10 w-10 rounded-full border-2 border-white shadow-md ring-2 ring-slate-100"
        />
      </div>
    </header>
  )
}

function MobileNavStrip() {
  const pathname = usePathname() ?? '/'

  return (
    <div className="flex gap-1 overflow-x-auto border-b border-slate-200/80 bg-[#001F3F] px-3 py-2 lg:hidden">
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
              'shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors',
              active ? 'bg-white text-[#001F3F]' : 'bg-white/10 text-white/90',
            )}
          >
            {item.icon} {item.label}
          </Link>
        )
      })}
    </div>
  )
}

function ActionQueueDock() {
  return (
    <footer className="flex h-20 shrink-0 items-center gap-3 overflow-x-auto border-t border-slate-200/90 bg-white/95 px-4 backdrop-blur-xl md:gap-4 md:px-8">
      <div className="shrink-0 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
        Action queue
      </div>
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {ACTION_QUEUE.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="shrink-0 rounded-xl border border-slate-200 bg-slate-100 px-4 py-2 text-xs font-bold text-[#001F3F] transition-all hover:border-[#001F3F] hover:bg-[#001F3F] hover:text-white"
          >
            {a.label}
          </Link>
        ))}
      </div>
    </footer>
  )
}

/**
 * Laminated White + navy command shell: tri-native apps, mode switcher, action queue.
 * @param {{ children: import('react').ReactNode }} props
 */
export function AppShell({ children }) {
  const pathname = usePathname() ?? '/'
  const title = mainTitleFromPath(pathname)
  const isHome = pathname === '/' || pathname === ''
  const { userMode } = useMartinOs()
  const showLaminatedHome = isHome && userMode !== 'executive'

  return (
    <div className="mc-root flex h-dvh overflow-hidden bg-[#F8FAFC] font-sans text-[#001F3F] antialiased selection:bg-slate-200">
      <div className="hidden min-h-0 lg:flex">
        <AppSidebar />
      </div>
      <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden shadow-[inset_1px_0_0_rgba(0,31,63,0.06)]">
        <MainHeader />
        <MissionUnlockBanner />
        <MobileNavStrip />
        <section className="min-h-0 flex-1 overflow-y-auto px-4 py-5 md:px-8 md:py-8">
          {!isHome ? (
            <div className="mb-8 flex flex-col justify-end gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="font-display text-2xl font-bold text-[#001F3F]">{title}</h1>
                <p className="text-sm text-slate-500">
                  Workspace <span className="text-slate-300">›</span> {title}
                </p>
              </div>
              <p className="text-xs text-slate-400 italic">Laminated command surface</p>
            </div>
          ) : null}
          {showLaminatedHome ? <LaminatedCommandCanvas /> : null}
          <div
            className={cn(
              isHome &&
                'rounded-[2rem] border border-slate-200/80 bg-white/90 p-5 shadow-[0_12px_40px_-12px_rgba(0,31,63,0.08)] ring-1 ring-white md:p-8',
            )}
          >
            {children}
          </div>
        </section>
        <ActionQueueDock />
      </main>
    </div>
  )
}
