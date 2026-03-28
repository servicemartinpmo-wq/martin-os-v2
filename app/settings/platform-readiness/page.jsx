import AppShell from '@/features/shell/AppShell'
import { PageHeader, PageSection } from '@/components/page/PageChrome'
import { getPlatformCoverageSummary } from '@/lib/platformCoverage'

const STATUS_TONE = {
  implemented: 'var(--success)',
  missing: 'var(--error)',
  not_required: 'var(--text-muted)',
}

function Cell({ value }) {
  return (
    <span
      className="rounded-full px-2 py-1 text-[11px] uppercase tracking-wide"
      style={{
        color: STATUS_TONE[value],
        border: `1px solid ${STATUS_TONE[value]}`,
      }}
    >
      {value.replace('_', ' ')}
    </span>
  )
}

export default function PlatformReadinessPage() {
  const { totals, rows } = getPlatformCoverageSummary()

  return (
    <AppShell activeHref="/settings">
      <PageHeader
        kicker="Platform Coverage"
        title="UI + Middle Layer + Backend Readiness"
        subtitle="Single source of truth for whether each core module is wired across presentation, orchestration, and API/data layers."
      />

      <div className="mt-4 grid gap-3 md:grid-cols-4">
        <div className="mos-metric-strip">
          <p className="text-[11px] uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Total features</p>
          <p className="mt-2 text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>{totals.total}</p>
        </div>
        <div className="mos-metric-strip">
          <p className="text-[11px] uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Fully ready</p>
          <p className="mt-2 text-2xl font-semibold" style={{ color: 'var(--success)' }}>{totals.fullyReady}</p>
        </div>
        <div className="mos-metric-strip">
          <p className="text-[11px] uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Partial</p>
          <p className="mt-2 text-2xl font-semibold" style={{ color: 'var(--warning)' }}>{totals.partial}</p>
        </div>
        <div className="mos-metric-strip">
          <p className="text-[11px] uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Missing</p>
          <p className="mt-2 text-2xl font-semibold" style={{ color: 'var(--error)' }}>{totals.missing}</p>
        </div>
      </div>

      <PageSection className="mt-6" title="Feature matrix">
        <div className="overflow-x-auto rounded-lg border" style={{ borderColor: 'var(--border-subtle)' }}>
          <table className="w-full min-w-[900px] text-sm">
            <thead style={{ background: 'var(--bg-elevated)' }}>
              <tr>
                <th className="p-3 text-left">Feature</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">UI</th>
                <th className="p-3 text-left">Middle</th>
                <th className="p-3 text-left">Backend</th>
                <th className="p-3 text-left">Readiness</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                  <td className="p-3 align-top">
                    <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{row.name}</p>
                    {row.notes ? (
                      <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>{row.notes}</p>
                    ) : null}
                  </td>
                  <td className="p-3 align-top" style={{ color: 'var(--text-muted)' }}>{row.category}</td>
                  <td className="p-3 align-top"><Cell value={row.status.ui} /></td>
                  <td className="p-3 align-top"><Cell value={row.status.middle} /></td>
                  <td className="p-3 align-top"><Cell value={row.status.backend} /></td>
                  <td className="p-3 align-top">
                    <span className="mos-chip">{row.readiness}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PageSection>
    </AppShell>
  )
}
