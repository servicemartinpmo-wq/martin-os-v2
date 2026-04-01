'use client'

import AgentPanel from '@/components/agents/AgentPanel'
import MiidleStream from '@/components/MiidleStream'

export default function MiiddleCommandBand() {
  return (
    <div className="mt-6 grid gap-4 lg:grid-cols-2">
      <MiidleStream />
      <AgentPanel appView="MIIDLE" />
    </div>
  )
}
