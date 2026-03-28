'use client'

import { useState } from 'react'
import AppShell from '@/features/shell/AppShell'
import { PageHeader, PageSection } from '@/components/page/PageChrome'
import WorkflowBuilder from './WorkflowBuilder'
import WorkflowViewer from './WorkflowViewer'
import WorkflowEditor from './WorkflowEditor'
import { runWorkflow } from '../../../core/knowledge-engine'
import { getContextRowsForIntent } from '../../../core/context-engine'

export default function KnowledgeWorkflowsPage() {
  const [workflow, setWorkflow] = useState(null)
  const [runStatus, setRunStatus] = useState('not executed')
  const [running, setRunning] = useState(false)
  const [contextRows, setContextRows] = useState([])

  async function handleRunWorkflow(nextWorkflow) {
    if (!nextWorkflow) return
    setRunning(true)
    setRunStatus('running')
    try {
      const result = await runWorkflow(nextWorkflow)
      setRunStatus(result.status)
    } catch {
      setRunStatus('failed')
    } finally {
      setRunning(false)
    }
  }

  return (
    <AppShell activeHref="/knowledge/workflows">
      <PageHeader
        kicker="Knowledge Engine"
        title="Knowledge -> Workflow Converter (K2W)"
        subtitle="Build executable workflows from frameworks, methods, triggers, and formulas."
      />

      <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <WorkflowBuilder
          running={running}
          onBuild={({ workflow: nextWorkflow, constraints, contextRows: selectedRows }) => {
            setWorkflow(nextWorkflow)
            setRunStatus('ready-to-run')
            const query = [
              constraints?.domain ?? '',
              ...(constraints?.goals ?? []),
              constraints?.optimize_for ?? '',
            ]
              .filter(Boolean)
              .join(' ')
            if (selectedRows?.length) {
              setContextRows(selectedRows)
              return
            }
            setContextRows(getContextRowsForIntent(query))
          }}
        />
        <WorkflowViewer workflow={workflow} runStatus={runStatus} contextRows={contextRows} />
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={() => handleRunWorkflow(workflow)}
          disabled={!workflow || running}
          className="rounded-md border px-4 py-2 text-sm font-medium"
          style={{
            borderColor: 'var(--accent)',
            color: 'var(--text-primary)',
            background: 'var(--accent-muted)',
            opacity: !workflow || running ? 0.6 : 1,
            cursor: !workflow || running ? 'not-allowed' : 'pointer',
          }}
        >
          {running ? 'Running workflow…' : 'Run Workflow'}
        </button>
      </div>

      <PageSection className="mt-4" title="Workflow JSON editor">
        <WorkflowEditor
          workflow={workflow}
          onApply={(nextWorkflow) => {
            setWorkflow(nextWorkflow)
            setRunStatus('edited')
          }}
        />
      </PageSection>

      <PageSection className="mt-4" title="Context routing lens">
        {contextRows.length ? (
          <div className="grid gap-3 md:grid-cols-2">
            {contextRows.map((row) => (
              <article
                key={row.id}
                className="rounded-lg border p-3"
                style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-elevated)' }}
              >
                <p className="text-xs uppercase" style={{ color: 'var(--accent)' }}>
                  {row.id}
                </p>
                <p className="mt-1 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {row.label}
                </p>
                <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                  {row.description}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Build a workflow to see routed context rows.
          </p>
        )}
      </PageSection>
    </AppShell>
  )
}
