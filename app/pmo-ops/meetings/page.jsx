'use client'

import AppShell from '@/features/shell/AppShell'
import { PageCard, PageHeader, PageSection } from '@/components/page/PageChrome'
import {
  fallbackMeetingActionItems,
  fallbackMeetings,
} from '@/features/data/operationalData'
import { useSupabaseTable } from '@/hooks/useSupabaseTable'

export default function MeetingsPage() {
  const meetings = useSupabaseTable({
    table: 'meetings',
    select: 'id,title,date,time,duration,type,status',
    orderBy: 'date',
    ascending: true,
    fallback: fallbackMeetings,
  })
  const actions = useSupabaseTable({
    table: 'meeting_action_items',
    select: 'id,meeting_id,task,assignee,due_date,priority,confidence',
    orderBy: 'due_date',
    ascending: true,
    fallback: fallbackMeetingActionItems,
  })

  return (
    <AppShell activeHref="/pmo-ops">
      <PageHeader
        kicker="Planning / Meetings"
        title="Meetings and follow-through"
        subtitle="Keep meetings useful by turning notes into actions, owners, and due dates instead of letting details disappear after the call."
      >
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="mos-metric-strip">
            <p className="text-[11px] uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
              Upcoming meetings
            </p>
            <p className="mt-2 text-lg font-semibold">{meetings.rows.length}</p>
          </div>
          <div className="mos-metric-strip">
            <p className="text-[11px] uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
              Action items
            </p>
            <p className="mt-2 text-lg font-semibold">{actions.rows.length}</p>
          </div>
          <div className="mos-metric-strip">
            <p className="text-[11px] uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
              Data status
            </p>
            <p className="mt-2 text-sm font-semibold">
              {meetings.usingFallback || actions.usingFallback ? 'Using backup data safely' : 'Using live data'}
            </p>
          </div>
        </div>
      </PageHeader>

      <section className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <PageSection title="Upcoming meetings">
          <div className="grid gap-3">
            {meetings.rows.map((meeting) => (
              <article key={meeting.id} className="mos-surface-deep p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{meeting.title}</p>
                    <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                      {meeting.date} · {meeting.time} · {meeting.duration} mins
                    </p>
                  </div>
                  <span className="mos-chip">{meeting.type}</span>
                </div>
                <p className="mt-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                  Status: {meeting.status}
                </p>
              </article>
            ))}
          </div>
        </PageSection>

        <PageCard title="What the note taker should capture" subtitle="The basics that make meetings useful later">
          <div className="space-y-3">
            {[
              'Decisions that were made and who approved them.',
              'Anything blocking progress or raising risk.',
              'Clear action items with owner and due date.',
            ].map((line) => (
              <div key={line} className="mos-surface-deep p-4 text-sm" style={{ color: 'var(--text-muted)' }}>
                {line}
              </div>
            ))}
          </div>
        </PageCard>
      </section>

      <PageSection title="Action items pulled from meetings" className="mt-6">
        <div className="grid gap-3">
          {actions.rows.map((item) => {
            const meeting = meetings.rows.find((row) => row.id === item.meeting_id)
            return (
              <article key={item.id} className="mos-surface-deep p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-semibold">{item.task}</p>
                    <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                      {meeting?.title ?? 'Meeting'} · owner {item.assignee}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{item.priority}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      due {item.due_date} · {Math.round(Number(item.confidence || 0) * 100)}% confidence
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
