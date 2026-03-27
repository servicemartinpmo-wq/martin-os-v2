'use client'

/** Editorial rhythm: asymmetric columns; pages compose BentoGrid where needed. */
export default function CreativeShell({ sidebar, children }) {
  return (
    <div className="mx-auto max-w-[1400px] px-2 lg:px-6">
      <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
        <aside
          className="shrink-0 lg:sticky lg:top-24 lg:w-64"
          style={{ color: 'var(--text-muted)' }}
        >
          {sidebar}
        </aside>
        <div className="min-w-0 flex-1 space-y-8">{children}</div>
      </div>
    </div>
  )
}
