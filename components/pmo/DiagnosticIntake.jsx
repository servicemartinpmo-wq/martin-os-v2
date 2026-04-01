'use client'

import { useMemo, useState } from 'react'
import { FilterChip } from '@/components/page/PageChrome'

const QUESTIONS = [
  { id: 'q1', text: 'What is the primary revenue constraint this quarter?' },
  { id: 'q2', text: 'Where is execution friction highest across teams?' },
  { id: 'q3', text: 'Which project has the least clear owner?' },
  { id: 'q4', text: 'What system is the source of truth for customer truth today?' },
  { id: 'q5', text: 'What process breaks most often between strategy and delivery?' },
]

/** v1 shortened intake — expand toward ~25Q per plan without blocking UX. */
export default function DiagnosticIntake() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState(/** @type {Record<string, string>} */ ({}))
  const progress = useMemo(() => Math.round(((step + 1) / QUESTIONS.length) * 100), [step])

  function setAnswer(id, v) {
    setAnswers((a) => ({ ...a, [id]: v }))
  }

  const q = QUESTIONS[step]

  return (
    <div className="glass-panel p-5">
      <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--accent)' }}>
        One-click diagnostic (demo flow)
      </p>
      <h3 className="font-display mt-2 text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
        Structured intake
      </h3>
      <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
        {QUESTIONS.length} prompts in this slice — full ~25Q flow ships with export + Health Score tie-in. Demo data
        label applies until persisted.
      </p>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full" style={{ background: 'var(--border-subtle)' }}>
        <div
          className="h-full transition-all"
          style={{ width: `${progress}%`, background: 'var(--accent)' }}
        />
      </div>
      <p className="mt-4 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
        {q.text}
      </p>
      <textarea
        className="mt-2 min-h-[88px] w-full rounded-md border bg-transparent p-2 text-sm"
        style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
        value={answers[q.id] ?? ''}
        onChange={(e) => setAnswer(q.id, e.target.value)}
        placeholder="Your answer…"
      />
      <div className="mt-4 flex flex-wrap gap-2">
        <FilterChip disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))}>
          Back
        </FilterChip>
        <FilterChip
          active
          onClick={() => {
            if (step < QUESTIONS.length - 1) setStep((s) => s + 1)
          }}
        >
          {step < QUESTIONS.length - 1 ? 'Next' : 'Finish (demo)'}
        </FilterChip>
      </div>
      {step === QUESTIONS.length - 1 ? (
        <p className="mt-4 text-xs" style={{ color: 'var(--text-muted)' }}>
          Demo: export to report artifact + PDF queued for Phase J backend.
        </p>
      ) : null}
    </div>
  )
}
