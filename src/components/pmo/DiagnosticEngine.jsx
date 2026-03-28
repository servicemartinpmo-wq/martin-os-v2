'use client'

import { useState } from 'react'
import { runBrain } from '@/brain/brainEngine'

const diagnosticTypes = [
  { id: 'portfolio-health', label: 'Portfolio Health', prompt: 'Analyze overall portfolio health and identify risks.' },
  { id: 'initiative-risk', label: 'Initiative Risk', prompt: 'Assess risk factors for current initiatives.' },
  { id: 'velocity', label: 'Execution Velocity', prompt: 'Evaluate team velocity and delivery patterns.' },
  { id: 'dependency', label: 'Dependency Analysis', prompt: 'Map cross-initiative dependencies and bottlenecks.' },
]

export default function DiagnosticEngine({ domain = 'pmo' }) {
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)

  const runDiagnostic = async (diagnosticId) => {
    const diag = diagnosticTypes.find(d => d.id === diagnosticId)
    if (!diag) return

    setLoading(true)
    setResults(null)

    try {
      const appView =
        domain === 'tech' || domain === 'tech-ops' ? 'TECH_OPS' : domain === 'pmo' ? 'PMO' : domain.toUpperCase()
      const output = await runBrain({
        appView,
        context: diag.prompt,
      })
      setResults(output)
    } catch (err) {
      console.error('Diagnostic error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {diagnosticTypes.map((diag) => (
          <button
            key={diag.id}
            onClick={() => runDiagnostic(diag.id)}
            disabled={loading}
            className="mos-link-tile text-left"
          >
            <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
              {diag.label}
            </span>
            <span className="mt-1 block text-xs" style={{ color: 'var(--text-muted)' }}>
              Click to run analysis
            </span>
          </button>
        ))}
      </div>

      {loading && (
        <div className="glass-panel p-8 text-center">
          <div className="inline-block animate-spin w-6 h-6 border-2 border-t-transparent rounded-full" 
               style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
          <p className="mt-3 text-sm" style={{ color: 'var(--text-muted)' }}>
            Running diagnostic analysis...
          </p>
        </div>
      )}

      {results && !loading && (
        <div className="glass-panel p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Diagnostic Results
            </h3>
            {results.mock && (
              <span className="mos-chip">Demo Mode</span>
            )}
          </div>

          {results.summary && (
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                Summary
              </h4>
              <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
                {results.summary}
              </p>
            </div>
          )}

          {results.priorities && results.priorities.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                Priority Actions
              </h4>
              <ul className="space-y-2">
                {results.priorities.map((p, idx) => (
                  <li 
                    key={idx}
                    className="rounded-lg border px-3 py-2 text-sm"
                    style={{ borderColor: 'var(--border-subtle)' }}
                  >
                    <span style={{ color: 'var(--text-primary)' }}>{p.title}</span>
                    {p.confidence !== undefined && (
                      <span className="ml-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                        {Math.round(p.confidence * 100)}% confidence
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {results.risks && results.risks.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                Risk Flags
              </h4>
              <ul className="space-y-2">
                {results.risks.map((r, idx) => (
                  <li 
                    key={idx}
                    className="rounded-lg border px-3 py-2 text-sm flex items-center gap-2"
                    style={{ 
                      borderColor: r.severity === 'error' ? 'var(--error)' : 'var(--warning)',
                      backgroundColor: r.severity === 'error' 
                        ? 'color-mix(in oklab, var(--error) 10%, transparent)'
                        : 'color-mix(in oklab, var(--warning) 10%, transparent)'
                    }}
                  >
                    <span 
                      className="w-2 h-2 rounded-full"
                      style={{ 
                        backgroundColor: r.severity === 'error' ? 'var(--error)' : 'var(--warning)'
                      }}
                    />
                    <span style={{ color: 'var(--text-primary)' }}>{r.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
