import Link from 'next/link'
import LayoutOrchestrator from '@/layouts/LayoutOrchestrator'
import { appSections } from './appModel'

function ShellNav({ activeHref }) {
  return (
    <>
      <p
        className="text-xs uppercase tracking-[0.2em]"
        style={{ color: 'var(--text-muted)' }}
      >
        Martin OS
      </p>
      <h1
        className="font-display mt-2 text-2xl font-semibold"
        style={{ color: 'var(--text-primary)' }}
      >
        Command Layer
      </h1>
      <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
        PMO-Ops, Tech-Ops, and Miiddle in one orchestrated shell.
      </p>

      <nav className="mt-6 space-y-2">
        <Link
          href="/"
          className="block rounded-lg border px-3 py-2 text-sm transition-colors"
          style={{
            borderColor:
              activeHref === '/' ? 'var(--accent)' : 'var(--border-subtle)',
            background:
              activeHref === '/' ? 'var(--accent-muted)' : 'transparent',
            color: activeHref === '/' ? 'var(--text-primary)' : 'var(--text-muted)',
          }}
        >
          Overview
        </Link>
        {appSections.map((section) => {
          const on = activeHref === section.href
          return (
            <Link
              key={section.id}
              href={section.href}
              className="block rounded-lg border px-3 py-2 text-sm transition-colors"
              style={{
                borderColor: on ? 'var(--accent)' : 'var(--border-subtle)',
                background: on ? 'var(--accent-muted)' : 'transparent',
                color: on ? 'var(--text-primary)' : 'var(--text-muted)',
              }}
            >
              {section.title}
            </Link>
          )
        })}
      </nav>
    </>
  )
}

export default function AppShell({ activeHref, children }) {
  return (
    <div className="app-noise min-h-screen pb-[env(safe-area-inset-bottom)]">
      <LayoutOrchestrator
        layoutKey={activeHref}
        sidebar={<ShellNav activeHref={activeHref} />}
      >
        {children}
      </LayoutOrchestrator>
    </div>
  )
}
