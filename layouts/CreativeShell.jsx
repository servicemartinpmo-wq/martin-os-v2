'use client'

/** Editorial rhythm: asymmetric columns; pages compose BentoGrid where needed. */
export default function CreativeShell({ sidebar, children }) {
  return (
    <div className="mx-auto max-w-[1480px] px-3 lg:px-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <aside
          className="shrink-0 lg:sticky lg:top-24 lg:w-64"
          style={{ color: 'var(--text-muted)' }}
        >
          <div className="glass-panel p-4">{sidebar}</div>
        </aside>
        <div className="min-w-0 flex-1 space-y-6">{children}</div>
      </div>
    </div>
  )
}
