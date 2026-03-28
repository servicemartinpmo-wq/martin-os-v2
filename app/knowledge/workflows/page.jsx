'use client'

import { useState } from 'react'
import AppShell from '@/features/shell/AppShell'
import { PageHeader, PageSection } from '@/components/page/PageChrome'
import WorkflowBuilder from './WorkflowBuilder'
import WorkflowViewer from './WorkflowViewer'
import WorkflowEditor from './WorkflowEditor'
import { runWorkflow } from '../../../../core/knowledge-engine'

export default function KnowledgeWorkflowsPage() {
  const [workflow, setWorkflow] = useState(null)
  const [runStatus, setRunStatus] = useState('not executed')
  const [running, setRunning] = useState(false)

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
          onBuild={({ workflow: nextWorkflow }) => {
            setWorkflow(nextWorkflow)
            setRunStatus('ready-to-run')
          }}
        />
        <WorkflowViewer workflow={workflow} runStatus={runStatus} />
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
    </AppShell>
  )
}
