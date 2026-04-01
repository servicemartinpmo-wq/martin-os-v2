'use client'

import MobileStack from '@/layouts/MobileStack'
import SidebarAdmin from '@/layouts/SidebarAdmin'

/** High-density PM software shell. */
export default function ProjectShell({ sidebar, children }) {
  return (
    <MobileStack
      sidebar={
        <SidebarAdmin className="rounded-lg border p-3 lg:sticky lg:top-20 lg:max-h-[calc(100vh-5rem)] lg:overflow-y-auto">
          {sidebar}
        </SidebarAdmin>
      }
      main={
        <div className="grid min-h-0 gap-4" style={{ fontSize: '0.925rem' }}>
          {children}
        </div>
      }
      className="mx-auto max-w-[1560px] px-3 lg:px-6"
    />
  )
}
