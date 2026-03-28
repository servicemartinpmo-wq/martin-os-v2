'use client'

import type { K2WGeneratedWorkflow } from '../../../../agents/types'

interface WorkflowViewerProps {
  workflow: K2WGeneratedWorkflow | null
  runStatus: string
  contextRows?: { id: string; label: string }[]
}

interface StepCardProps {
  step: K2WGeneratedWorkflow['steps'][number]
}

function StepCard({ step }: StepCardProps) {
  return (
    <article
      className="rounded-lg border p-3"
      style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-elevated)' }}
    >
      <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
        {step.name}
      </p>
      <p className="text-xs uppercase" style={{ color: 'var(--text-muted)' }}>
        {step.step_id} · {step.type}
      </p>
      <p className="mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
        Inputs: {Object.keys(step.inputs).join(', ') || 'none'}
      </p>
      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
        Outputs: {Object.keys(step.outputs).join(', ') || 'none'}
      </p>
      {step.condition ? (
        <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
          Condition: {JSON.stringify(step.condition)}
        </p>
      ) : null}
      {step.action ? (
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Action: {step.action}
        </p>
      ) : null}
    </article>
  )
}

export default function WorkflowViewer({
  workflow,
  runStatus,
  contextRows = [],
}: WorkflowViewerProps) {
  if (!workflow) {
    return (
      <section className="glass-panel p-5">
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Build a workflow to view DAG nodes and plan.
        </p>
      </section>
    )
  }

  return (
    <section className="glass-panel p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            {workflow.workflow_name}
          </h3>
          <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
            DAG nodes: {workflow.dag.nodes.length} · edges: {workflow.dag.edges.length}
          </p>
        </div>
        <span className="mos-chip">{runStatus || 'not executed'}</span>
      </div>

      <div className="mt-4 space-y-3">
        {workflow.steps.map((step) => (
          <StepCard key={step.step_id} step={step} />
        ))}
      </div>

      {contextRows.length ? (
        <div className="mt-4">
          <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
            Active context lenses
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {contextRows.map((row) => (
              <span key={row.id} className="mos-chip">
                {row.label}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  )
}
