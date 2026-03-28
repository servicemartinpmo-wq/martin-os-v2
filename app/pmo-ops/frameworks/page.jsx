'use client'

import AppShell from '../../../src/features/shell/AppShell'
import FrameworkGallery from '@/components/dashboard/FrameworkGallery'
import PresenceOrb from '@/components/canvas/PresenceOrb'
import { PageHeader } from '@/components/page/PageChrome'

export default function FrameworksPage() {
  return (
    <AppShell activeHref="/pmo-ops">
      <PageHeader
        kicker="Intelligence Layer"
        title="Framework Gallery"
        subtitle="Dynamic decision models surfaced by the Apphia engine. Filter by domain, category, or mode — execute workflows directly."
      />

      <div className="mt-4 mb-6 flex items-center gap-3">
        <PresenceOrb size={32} />
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Apphia Intelligence Engine — monitoring operational signals
        </span>
      </div>

      <FrameworkGallery />
    </AppShell>
  )
}
