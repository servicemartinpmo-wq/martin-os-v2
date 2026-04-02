'use client'
import { useEffect, useRef, useState } from 'react'
import { techConnectorHealth, techWorkflowRuns } from '@/features/data/operationalData'
import { apiFetch } from '../lib/api'

export default function LiveLogs() {
  const [lines, setLines] = useState([{ text: 'Bootstrapping Tech-Ops event stream…', level: 'info' }])
  const inFlightRef = useRef(false)
  const abortRef = useRef(null)

  useEffect(() => {
    let cancel = false
    async function pull() {
      if (cancel || inFlightRef.current) return
      inFlightRef.current = true
      const controller = new AbortController()
      abortRef.current = controller
      const timeout = window.setTimeout(() => controller.abort(), 10000)
      try {
        const body = await apiFetch('/api/logs', { signal: controller.signal })
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
      } finally {
        window.clearTimeout(timeout)
        abortRef.current = null
        inFlightRef.current = false
      }
    }
    pull()
    const t = setInterval(pull, 20000)
    return () => {
      cancel = true
      clearInterval(t)
      abortRef.current?.abort()
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
