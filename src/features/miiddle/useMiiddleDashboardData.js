'use client'

import { useMemo } from 'react'
import { useEffect, useState } from 'react'
import { fetchMiiddleDashboard } from '@/lib/api/dashboard'
import {
  fallbackStoryArtifacts,
  fallbackStoryJobs,
  miidleNarrativeTemplates,
  miidleTimeline,
} from '@/features/data/operationalData'

export function useMiiddleDashboardData() {
  const [payload, setPayload] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const out = await fetchMiiddleDashboard()
        if (!cancelled) setPayload(out)
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to fetch Miiddle dashboard')
          setPayload(null)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const data = useMemo(() => {
    const activities = payload?.data?.activities ?? miidleTimeline
    const jobs = payload?.data?.jobs ?? fallbackStoryJobs
    const artifacts = payload?.data?.artifacts ?? fallbackStoryArtifacts
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
        hint: payload?.source === 'supabase' ? 'live execution stream' : 'fallback capture stream',
      },
      {
        label: 'Story jobs',
        value: String(jobs.length),
        hint: queuedJobs ? `${queuedJobs} still rendering` : 'render queue clear',
      },
      {
        label: 'Publish-ready artifacts',
        value: String(publishedArtifacts),
        hint: payload?.source === 'supabase' ? 'live artifact board' : 'fallback artifact board',
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
    payload,
  ])

  return {
    data,
    loading,
    error,
    usingFallback: payload?.source !== 'supabase',
  }
}
