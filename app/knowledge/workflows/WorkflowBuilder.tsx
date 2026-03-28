'use client'

import { useMemo, useState } from 'react'
import { FilterChip } from '@/components/page/PageChrome'
import { FRAMEWORK_REGISTRY } from '@/registry/frameworkRegistry'
import { buildWorkflowFromKnowledge } from '@brain'
import type { K2WConstraints, K2WKnowledgeCollection, K2WKnowledgeInput } from '../../../agents/types'

interface WorkflowBuilderProps {
  onBuild: (payload: {
    workflow: unknown
    constraints: K2WConstraints
  }) => void
  running: boolean
}

const METHOD_OPTIONS: K2WKnowledgeInput[] = [
  {
    id: 'method_define_segments',
    name: 'Define Customer Segments',
    type: 'methods',
    inputs: ['customer_data'],
    outputs: ['segments'],
  },
  {
    id: 'method_generate_content',
    name: 'Generate Content',
    type: 'methods',
    inputs: ['segments', 'goal'],
    outputs: ['content_assets'],
    dependencies: ['method_define_segments'],
  },
]

const TRIGGER_OPTIONS: K2WKnowledgeInput[] = [
  {
    id: 'trigger_email_on_segment',
    name: 'Email Trigger',
    type: 'triggers',
    condition: { segment: 'VIP' },
    action: 'send_email',
  },
]

const FORMULA_OPTIONS: K2WKnowledgeInput[] = [
  {
    id: 'formula_ltv',
    name: 'Compute LTV',
    type: 'formulas',
    expression: 'ARPU * lifespan',
    inputs: ['ARPU', 'lifespan'],
    outputs: ['LTV'],
  },
]

function normalizeFrameworks(): K2WKnowledgeInput[] {
  return Object.entries(FRAMEWORK_REGISTRY).map(([id, framework]) => ({
    id,
    name: framework.name,
    type: 'frameworks',
    description: framework.description,
    domain: framework.domain,
    requiredInputs: ['context'],
    outputs: ['framework_steps'],
  }))
}

function toggle(current: string[], value: string): string[] {
  return current.includes(value)
    ? current.filter((item) => item !== value)
    : [...current, value]
}

export default function WorkflowBuilder({ onBuild, running }: WorkflowBuilderProps) {
  const frameworks = useMemo(() => normalizeFrameworks(), [])
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>(
    frameworks.slice(0, 2).map((item) => item.id),
  )
  const [selectedMethods, setSelectedMethods] = useState<string[]>(
    METHOD_OPTIONS.map((item) => item.id),
  )
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>(
    TRIGGER_OPTIONS.map((item) => item.id),
  )
  const [selectedFormulas, setSelectedFormulas] = useState<string[]>(
    FORMULA_OPTIONS.map((item) => item.id),
  )
  const [domain, setDomain] = useState('marketing')
  const [goal, setGoal] = useState('conversion')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('high')
  const [complexity, setComplexity] = useState<'low' | 'medium' | 'high'>('medium')
  const selectedCount =
    selectedFrameworks.length +
    selectedMethods.length +
    selectedTriggers.length +
    selectedFormulas.length

  const handleBuild = () => {
    const selected: K2WKnowledgeCollection = {
      frameworks: frameworks.filter((item) => selectedFrameworks.includes(item.id)),
      methods: METHOD_OPTIONS.filter((item) => selectedMethods.includes(item.id)),
      triggers: TRIGGER_OPTIONS.filter((item) => selectedTriggers.includes(item.id)),
      formulas: FORMULA_OPTIONS.filter((item) => selectedFormulas.includes(item.id)),
      systems: [],
    }
    const constraints: K2WConstraints = {
      domain,
      goals: [goal],
      priority,
      complexity,
      optimize_for: goal,
    }

    const workflow = buildWorkflowFromKnowledge(selected, constraints)
    onBuild({
      workflow,
      constraints,
    })
  }

  return (
    <section className="glass-panel p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
          Workflow Builder
        </h3>
        <span className="mos-chip">{selectedCount} objects selected</span>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <p className="mb-2 text-xs uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
            Frameworks
          </p>
          <div className="flex flex-wrap gap-2">
            {frameworks.map((item) => (
              <FilterChip
                key={item.id}
                active={selectedFrameworks.includes(item.id)}
                onClick={() => setSelectedFrameworks((current) => toggle(current, item.id))}
              >
                {item.name}
              </FilterChip>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 text-xs uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
            Methods
          </p>
          <div className="flex flex-wrap gap-2">
            {METHOD_OPTIONS.map((item) => (
              <FilterChip
                key={item.id}
                active={selectedMethods.includes(item.id)}
                onClick={() => setSelectedMethods((current) => toggle(current, item.id))}
              >
                {item.name}
              </FilterChip>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 text-xs uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
            Triggers
          </p>
          <div className="flex flex-wrap gap-2">
            {TRIGGER_OPTIONS.map((item) => (
              <FilterChip
                key={item.id}
                active={selectedTriggers.includes(item.id)}
                onClick={() => setSelectedTriggers((current) => toggle(current, item.id))}
              >
                {item.name}
              </FilterChip>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 text-xs uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
            Formulas
          </p>
          <div className="flex flex-wrap gap-2">
            {FORMULA_OPTIONS.map((item) => (
              <FilterChip
                key={item.id}
                active={selectedFormulas.includes(item.id)}
                onClick={() => setSelectedFormulas((current) => toggle(current, item.id))}
              >
                {item.name}
              </FilterChip>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <input
          value={domain}
          onChange={(event) => setDomain(event.target.value)}
          placeholder="domain"
          className="rounded-md border px-3 py-2 text-sm"
          style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-elevated)' }}
        />
        <input
          value={goal}
          onChange={(event) => setGoal(event.target.value)}
          placeholder="goal"
          className="rounded-md border px-3 py-2 text-sm"
          style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-elevated)' }}
        />
        <select
          value={priority}
          onChange={(event) => setPriority(event.target.value as 'low' | 'medium' | 'high')}
          className="rounded-md border px-3 py-2 text-sm"
          style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-elevated)' }}
        >
          <option value="low">priority: low</option>
          <option value="medium">priority: medium</option>
          <option value="high">priority: high</option>
        </select>
        <select
          value={complexity}
          onChange={(event) => setComplexity(event.target.value as 'low' | 'medium' | 'high')}
          className="rounded-md border px-3 py-2 text-sm"
          style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-elevated)' }}
        >
          <option value="low">complexity: low</option>
          <option value="medium">complexity: medium</option>
          <option value="high">complexity: high</option>
        </select>
      </div>

      <button
        type="button"
        onClick={handleBuild}
        disabled={running || selectedCount === 0}
        className="mt-5 rounded-md border px-4 py-2 text-sm font-medium transition-colors"
        style={{
          borderColor: 'var(--accent)',
          color: 'var(--text-primary)',
          background: 'var(--accent-muted)',
          opacity: running || selectedCount === 0 ? 0.6 : 1,
          cursor: running || selectedCount === 0 ? 'not-allowed' : 'pointer',
        }}
      >
        {running ? 'Building…' : 'Build Workflow from Knowledge'}
      </button>
    </section>
  )
}
