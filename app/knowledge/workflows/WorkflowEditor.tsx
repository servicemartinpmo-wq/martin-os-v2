'use client'

import { useEffect, useMemo, useState } from 'react'
import type { K2WGeneratedWorkflow } from '../../../../agents/types'

interface WorkflowEditorProps {
  workflow: K2WGeneratedWorkflow | null
  onApply: (workflow: K2WGeneratedWorkflow) => void
}

function safeParse(
  value: string,
): { parsed: K2WGeneratedWorkflow | null; error: string } {
  try {
    const parsed = JSON.parse(value) as K2WGeneratedWorkflow
    return { parsed, error: '' }
  } catch (error) {
    return { parsed: null, error: String(error) }
  }
}

export default function WorkflowEditor({ workflow, onApply }: WorkflowEditorProps) {
  const [text, setText] = useState('{}')

  useEffect(() => {
    setText(JSON.stringify(workflow ?? {}, null, 2))
  }, [workflow])

  const parsedState = useMemo(() => safeParse(text), [text])

  return (
    <section className="glass-panel p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          Workflow JSON Editor
        </h3>
        <button
          type="button"
          disabled={Boolean(parsedState.error) || !parsedState.parsed}
          onClick={() => {
            if (parsedState.parsed) onApply(parsedState.parsed)
          }}
          className="rounded-md border px-3 py-1.5 text-xs font-semibold"
          style={{
            borderColor: 'var(--accent)',
            color: 'var(--text-primary)',
            background: 'var(--accent-muted)',
            opacity: parsedState.error ? 0.5 : 1,
          }}
        >
          Apply JSON
        </button>
      </div>

      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        className="min-h-[340px] w-full rounded-lg border p-3 font-mono text-xs"
        style={{
          borderColor: 'var(--border-subtle)',
          background: 'var(--bg-elevated)',
          color: 'var(--text-primary)',
        }}
      />

      <p className="mt-2 text-xs" style={{ color: parsedState.error ? 'var(--warning)' : 'var(--text-muted)' }}>
        {parsedState.error ? `JSON error: ${parsedState.error}` : 'JSON is valid.'}
      </p>
    </section>
  )
}
