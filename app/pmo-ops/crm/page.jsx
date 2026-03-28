'use client'

import AppShell from '@/features/shell/AppShell'
import { PageCard, PageHeader, PageSection } from '@/components/page/PageChrome'
import {
  fallbackCrmCompanies,
  fallbackCrmContacts,
  fallbackCrmOpportunities,
} from '@/features/data/operationalData'
import { useSupabaseTable } from '@/hooks/useSupabaseTable'

function money(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Number(value || 0))
}

export default function CRMPage() {
  const companies = useSupabaseTable({
    table: 'crm_companies',
    select: 'id,name,industry,status,lead_score,city,state,website',
    orderBy: 'lead_score',
    ascending: false,
    fallback: fallbackCrmCompanies,
  })
  const contacts = useSupabaseTable({
    table: 'crm_contacts',
    select: 'id,company_id,first_name,last_name,title,direct_email,phone,confidence',
    orderBy: 'id',
    ascending: true,
    fallback: fallbackCrmContacts,
  })
  const opportunities = useSupabaseTable({
    table: 'crm_opportunities',
    select: 'id,name,stage,value,probability,company,expectedCloseDate',
    orderBy: 'value',
    ascending: false,
    fallback: fallbackCrmOpportunities,
  })

  const usingFallback =
    companies.usingFallback || contacts.usingFallback || opportunities.usingFallback

  return (
    <AppShell activeHref="/pmo-ops">
      <PageHeader
        kicker="Planning / CRM"
        title="Clients and pipeline"
        subtitle="Keep track of who you are talking to, what is likely to close, and which opportunities need follow-through next."
      >
        <div className="mt-5 grid gap-3 md:grid-cols-4">
          <div className="mos-metric-strip">
            <p className="text-[11px] uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
              Companies
            </p>
            <p className="mt-2 text-lg font-semibold">{companies.rows.length}</p>
          </div>
          <div className="mos-metric-strip">
            <p className="text-[11px] uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
              Contacts
            </p>
            <p className="mt-2 text-lg font-semibold">{contacts.rows.length}</p>
          </div>
          <div className="mos-metric-strip">
            <p className="text-[11px] uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
              Open value
            </p>
            <p className="mt-2 text-lg font-semibold">
              {money(opportunities.rows.reduce((sum, row) => sum + Number(row.value || 0), 0))}
            </p>
          </div>
          <div className="mos-metric-strip">
            <p className="text-[11px] uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
              Data status
            </p>
            <p className="mt-2 text-sm font-semibold">
              {usingFallback ? 'Using backup data safely' : 'Using live data'}
            </p>
          </div>
        </div>
      </PageHeader>

      <section className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <PageSection title="Best opportunities">
          <div className="grid gap-3">
            {opportunities.rows.map((item) => (
              <article key={item.id} className="mos-surface-deep p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                      {item.company} · {item.stage}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{money(item.value)}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {item.probability}% likely · closes by {item.expectedCloseDate}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </PageSection>

        <PageCard title="What to do next" subtitle="Simple ways to keep the pipeline moving">
          <div className="space-y-3">
            {[
              'Reach out to every warm lead that has not heard from you in the last 7 days.',
              'Pull likely-close deals into this week’s planning review.',
              'Turn meeting notes into follow-up tasks right after each client conversation.',
            ].map((tip) => (
              <div key={tip} className="mos-surface-deep p-4 text-sm" style={{ color: 'var(--text-muted)' }}>
                {tip}
              </div>
            ))}
          </div>
        </PageCard>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        <PageSection title="Companies to watch">
          <div className="grid gap-3">
            {companies.rows.map((company) => (
              <article key={company.id} className="mos-surface-deep p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{company.name}</p>
                    <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                      {company.industry} · {company.city}, {company.state}
                    </p>
                  </div>
                  <span className="mos-chip">{company.status}</span>
                </div>
                <p className="mt-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                  Lead score {company.lead_score} · {company.website}
                </p>
              </article>
            ))}
          </div>
        </PageSection>

        <PageSection title="Key contacts">
          <div className="grid gap-3">
            {contacts.rows.map((contact) => (
              <article key={contact.id} className="mos-surface-deep p-4">
                <p className="text-sm font-semibold">
                  {contact.first_name} {contact.last_name}
                </p>
                <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                  {contact.title} · {contact.direct_email}
                </p>
                <p className="mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                  {contact.phone} · confidence {contact.confidence}
                </p>
              </article>
            ))}
          </div>
        </PageSection>
      </section>
    </AppShell>
  )
}
