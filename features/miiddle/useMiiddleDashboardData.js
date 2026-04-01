'use client'

import { useMemo } from 'react'
import { useSupabaseTable } from '@/hooks/useSupabaseTable'
import {
  fallbackStoryArtifacts,
  fallbackStoryJobs,
  miidleNarrativeTemplates,
  miidleTimeline,
} from '@/features/data/operationalData'

export function useMiiddleDashboardData() {
  const activityQuery = useSupabaseTable({
    table: 'activity_logs',
    select: 'id,channel,event,actor,time,state,created_at',
    orderBy: 'id',
    ascending: false,
    limit: 100,
    fallback: miidleTimeline,
  })

  const jobsQuery = useSupabaseTable({
    table: 'story_jobs',
    select: 'id,name,format,status,source',
    orderBy: 'id',
    ascending: false,
    limit: 100,
    fallback: fallbackStoryJobs,
  })

  const artifactsQuery = useSupabaseTable({
    table: 'story_artifacts',
    select: 'id,title,state,audience',
    orderBy: 'id',
    ascending: false,
    limit: 100,
    fallback: fallbackStoryArtifacts,
  })

  const data = useMemo(() => {
    const activities = activityQuery.rows
    const jobs = jobsQuery.rows
    const artifacts = artifactsQuery.rows
    const publishedArtifacts = artifacts.filter(
      (row) => String(row.state).toLowerCase() === 'published',
    ).length
    const queuedJobs = jobs.filter((row) =>
      ['queued', 'rendering'].includes(String(row.status).toLowerCase()),
    ).length

    const kpis = [
      {
        label: 'Capture events',
        value: String(activities.length),
        hint: activityQuery.usingFallback ? 'fallback capture stream' : 'live execution stream',
      },
      {
        label: 'Story jobs',
        value: String(jobs.length),
        hint: queuedJobs ? `${queuedJobs} still rendering` : 'render queue clear',
      },
      {
        label: 'Publish-ready artifacts',
        value: String(publishedArtifacts),
        hint: artifactsQuery.usingFallback ? 'fallback artifact board' : 'live artifact board',
      },
      {
        label: 'Narrative templates',
        value: String(miidleNarrativeTemplates.length),
        hint: 'curated story formats available',
      },
    ]

    return {
      kpis,
      activities,
      jobs,
      artifacts,
      templates: miidleNarrativeTemplates,
      publishedArtifacts,
      queuedJobs,
    }
  }, [
    activityQuery.rows,
    activityQuery.usingFallback,
    jobsQuery.rows,
    artifactsQuery.rows,
    artifactsQuery.usingFallback,
  ])

  return {
    data,
    loading: activityQuery.loading || jobsQuery.loading || artifactsQuery.loading,
    error: activityQuery.error || jobsQuery.error || artifactsQuery.error,
    usingFallback:
      activityQuery.usingFallback || jobsQuery.usingFallback || artifactsQuery.usingFallback,
  }
}
