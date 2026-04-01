'use client'

import MobileStack from '@/layouts/MobileStack'
import SidebarAdmin from '@/layouts/SidebarAdmin'
import DescriptionLayer from '@/layouts/DescriptionLayer'

export default function AssistedShell({ sidebar, children }) {
  return (
    <DescriptionLayer id="main-outlet">
      <MobileStack
        sidebar={
          <DescriptionLayer id="nav-perspective">
            <SidebarAdmin className="rounded-xl border p-4 backdrop-blur lg:rounded-r-none lg:border-r">
              {sidebar}
            </SidebarAdmin>
          </DescriptionLayer>
        }
        main={
          <div className="space-y-6" style={{ maxWidth: '72rem' }}>
            {children}
          </div>
        }
      />
    </DescriptionLayer>
  )
}
