'use client'

import FloatingIsland from '@/layouts/FloatingIsland'
import SidebarAdmin from '@/layouts/SidebarAdmin'

/**
 * Tech-Ops shell with detached navigation and a high-contrast workspace stage.
 * Keeps the HUD mode visually distinct without forcing each page to manage its own frame.
 */
export default function HudShell({ sidebar, children }) {
  return (
    <div className="mx-auto max-w-[1600px] px-3 lg:px-6">
      <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
        <SidebarAdmin className="scanlines lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
          <div className="rounded-[var(--radius-xl)] border p-4" style={{ borderColor: 'var(--border-subtle)' }}>
            {sidebar}
          </div>
        </SidebarAdmin>
        <FloatingIsland className="scanlines noise-texture min-h-[72vh] border border-[var(--border-subtle)] p-4 md:p-6">
          {children}
        </FloatingIsland>
      </div>
    </div>
  )
}
