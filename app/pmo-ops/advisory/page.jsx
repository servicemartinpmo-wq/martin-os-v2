'use client'

import AppShell from '@/features/shell/AppShell'
import { PageCard, PageHeader, PageSection } from '@/components/page/PageChrome'
import {
  fallbackAdvisors,
  fallbackAdvisoryRequests,
} from '@/features/data/operationalData'
import { useSupabaseTable } from '@/hooks/useSupabaseTable'

export default function AdvisoryPage() {
  const advisors = useSupabaseTable({
    table: 'advisors',
    select: 'id,name,category,response_time,focus,status',
    orderBy: 'id',
    ascending: true,
    fallback: fallbackAdvisors,
  })
  const requests = useSupabaseTable({
    table: 'advisory_requests',
    select: 'id,advisor_id,title,priority,status,due_date',
    orderBy: 'id',
    ascending: false,
    fallback: fallbackAdvisoryRequests,
  })

  return (
    <AppShell activeHref="/pmo-ops">
      <PageHeader
        kicker="Planning / Advisory"
        title="Guidance and expert help"
        subtitle="Ask for help in plain language, see what guidance is already in motion, and route the right questions to the right support lane."
      >
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="mos-metric-strip">
            <p className="text-[11px] uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
              Guides available
            </p>
            <p className="mt-2 text-lg font-semibold">{advisors.rows.length}</p>
          </div>
          <div className="mos-metric-strip">
            <p className="text-[11px] uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
              Open requests
            </p>
            <p className="mt-2 text-lg font-semibold">{requests.rows.length}</p>
          </div>
          <div className="mos-metric-strip">
            <p className="text-[11px] uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
              Data status
            </p>
            <p className="mt-2 text-sm font-semibold">
              {advisors.usingFallback || requests.usingFallback ? 'Using backup data safely' : 'Using live data'}
            </p>
          </div>
        </div>
      </PageHeader>

      <section className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <PageSection title="Available guides">
          <div className="grid gap-3 md:grid-cols-2">
            {advisors.rows.map((advisor) => (
              <article key={advisor.id} className="mos-surface-deep p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{advisor.name}</p>
                    <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                      {advisor.category} · reply in about {advisor.response_time}
                    </p>
                  </div>
                  <span className="mos-chip">{advisor.status}</span>
                </div>
                <p className="mt-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                  {advisor.focus}
                </p>
              </article>
            ))}
          </div>
        </PageSection>

        <PageCard title="When to ask for help" subtitle="Use advisory when the next step is unclear">
          <div className="space-y-3">
            {[
              'You know something is off, but not why.',
              'A project keeps stalling and you need a clear fix.',
              'You need a fast recommendation you can act on this week.',
            ].map((item) => (
              <div key={item} className="mos-surface-deep p-4 text-sm" style={{ color: 'var(--text-muted)' }}>
                {item}
              </div>
            ))}
          </div>
        </PageCard>
      </section>

      <PageSection title="Requests already in motion" className="mt-6">
        <div className="grid gap-3">
          {requests.rows.map((request) => {
            const advisor = advisors.rows.find((item) => item.id === request.advisor_id)
            return (
              <article key={request.id} className="mos-surface-deep p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-semibold">{request.title}</p>
                    <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                      {advisor?.name ?? request.advisor_id} · {request.priority} priority
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{request.status}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      due {request.due_date}
                    </p>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </PageSection>
    </AppShell>
  )
}
