'use client'

import { useEffect, useState } from 'react'
import { techConnectorHealth, techWorkflowRuns } from '@/features/data/operationalData'

export default function LiveLogs() {
  const [lines, setLines] = useState([{ text: 'Bootstrapping Tech-Ops event stream…', level: 'info' }])

  useEffect(() => {
    let cancel = false

    async function pull() {
      try {
        const res = await fetch('/api/logs')
        const body = await res.json()
        if (!cancel && Array.isArray(body.lines)) {
          setLines(
            body.lines.map((line) => ({
              text: line,
              level: line.toLowerCase().includes('error') ? 'critical' : 'info',
            })),
          )
        }
      } catch {
        if (!cancel) {
          const connectorRows = techConnectorHealth.map((connector) => ({
            text: `[connector] ${connector.name} uptime=${connector.uptime.toFixed(2)}% lag=${connector.lagMs}ms`,
            level: connector.state === 'critical' ? 'critical' : connector.state === 'warning' ? 'warning' : 'info',
          }))
          const workflowRows = techWorkflowRuns.map((run) => ({
            text: `[workflow:${run.id}] ${run.workflow} stage=${run.stage} eta=${run.eta}`,
            level: run.state === 'warning' ? 'warning' : 'info',
          }))
          setLines([...workflowRows, ...connectorRows])
        }
      }
    }

    pull()
    const t = setInterval(pull, 20000)
    return () => {
      cancel = true
      clearInterval(t)
    }
  }, [])

  return (
    <section className="glass-panel p-4 font-mono-ui">
      <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
        Live logs (polling 20s with deterministic fallback)
      </p>
      <ul className="mt-3 max-h-48 space-y-1 overflow-y-auto text-xs leading-relaxed">
        {lines.map((l) => (
          <li
            key={l.text}
            style={{
              color:
                l.level === 'critical' ? 'var(--error)' : l.level === 'warning' ? 'var(--warning)' : 'var(--text-muted)',
            }}
          >
            {l.text}
          </li>
        ))}
      </ul>
    </section>
  )
}
