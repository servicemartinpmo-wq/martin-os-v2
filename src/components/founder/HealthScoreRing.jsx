'use client'

/** @param {{ score?: number }} props */
export default function HealthScoreRing({ score = 72 }) {
  const clamped = Math.max(0, Math.min(100, score))
  return (
    <div className="flex items-center gap-4">
      <div
        className="relative grid size-24 place-items-center rounded-full"
        style={{
          background: `conic-gradient(var(--accent) ${clamped * 3.6}deg, var(--border-subtle) 0)`,
        }}
      >
        <div
          className="grid size-[5.25rem] place-items-center rounded-full font-display text-xl font-semibold"
          style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)' }}
        >
          {clamped}
        </div>
      </div>
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
        Composite 0–100 · Operations, revenue, product, team (mock)
      </p>
    </div>
  )
}
