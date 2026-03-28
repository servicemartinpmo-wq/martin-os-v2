'use client'

import AppShell from '../../../src/features/shell/AppShell'
import { useMemo, useState } from 'react'
import { fallbackStoryArtifacts, fallbackStoryJobs } from '../../../src/features/data/operationalData'
import { useSupabaseTable } from '../../../src/hooks/useSupabaseTable'
import { useSupabaseMutation } from '../../../src/hooks/useSupabaseMutation'
import { PageHeader, PageSection } from '@/components/page/PageChrome'

const JOB_STATUS_OPTIONS = ['Queued', 'Rendering', 'Published']

const ARTIFACT_STATE_OPTIONS = ['Queued', 'Drafted', 'Ready', 'Published']

function optionsWithValue(preset, value) {
  if (value == null || value === '') return preset
  return preset.includes(value) ? preset : [...preset, value]
}

const sel = {
  borderColor: 'var(--border-subtle)',
  background: 'var(--bg-elevated)',
  color: 'var(--text-primary)',
}

const code = {
  borderRadius: '0.25rem',
  padding: '0.125rem 0.25rem',
  fontSize: '0.75rem',
  background: 'var(--bg-elevated)',
  border: '1px solid var(--border-subtle)',
}

export default function MiidleStoryEnginePage() {
  const [localJobs, setLocalJobs] = useState(fallbackStoryJobs)
  const [localArtifacts, setLocalArtifacts] = useState(fallbackStoryArtifacts)
  const [jobStatusOverrides, setJobStatusOverrides] = useState({})
  const [artifactStateOverrides, setArtifactStateOverrides] = useState({})

  const { updateRow, loading: saving } = useSupabaseMutation()

  const { rows: jobRows, loading: jobsLoading, usingFallback: jobsFallback } = useSupabaseTable({
    table: 'story_jobs',
    select: 'id,name,format,status,source',
    orderBy: 'id',
    ascending: true,
    fallback: localJobs,
  })

  const { rows: artifactRows, loading: artifactsLoading, usingFallback: artifactsFallback } = useSupabaseTable({
    table: 'story_artifacts',
    select: 'id,title,state,audience',
    orderBy: 'id',
    ascending: true,
    fallback: localArtifacts,
  })

  const jobs = useMemo(() => {
    const base = jobRows.length > 0 ? jobRows : localJobs
    return base.map((job) => ({
      id: String(job.id),
      name: job.name ?? 'Story job',
      format: job.format ?? '—',
      status: jobStatusOverrides[job.id] ?? job.status ?? 'Queued',
      source: job.source ?? '—',
    }))
  }, [jobRows, localJobs, jobStatusOverrides])

  const artifacts = useMemo(() => {
    const base = artifactRows.length > 0 ? artifactRows : localArtifacts
    return base.map((row) => ({
      id: String(row.id),
      title: row.title ?? row.type ?? 'Artifact',
      state: artifactStateOverrides[row.id] ?? row.state ?? 'Queued',
      audience: row.audience ?? '—',
    }))
  }, [artifactRows, localArtifacts, artifactStateOverrides])

  async function setJobStatus(job, status) {
    const result = await updateRow({ table: 'story_jobs', id: job.id, patch: { status } })
    if (result.ok || result.fallback) {
      setJobStatusOverrides((prev) => ({ ...prev, [job.id]: status }))
    }
    if (!result.ok && result.fallback) {
      setLocalJobs((prev) => prev.map((row) => (String(row.id) === String(job.id) ? { ...row, status } : row)))
    }
  }

  async function setArtifactState(artifact, state) {
    const result = await updateRow({ table: 'story_artifacts', id: artifact.id, patch: { state } })
    if (result.ok || result.fallback) {
      setArtifactStateOverrides((prev) => ({ ...prev, [artifact.id]: state }))
    }
    if (!result.ok && result.fallback) {
      setLocalArtifacts((prev) => prev.map((row) => (String(row.id) === String(artifact.id) ? { ...row, state } : row)))
    }
  }

  const dataBanner =
    jobsLoading || artifactsLoading
      ? 'Loading story pipeline...'
      : jobsFallback || artifactsFallback
        ? 'Using fallback jobs/artifacts (configure Supabase or seed story_jobs / story_artifacts).'
        : 'Live Supabase data loaded.'

  return (
    <AppShell activeHref="/miidle">
      <PageHeader
        kicker="Miiddle / Story Engine"
        title="Build-story pipeline"
        subtitle={
          <>
            Jobs and artifacts read from <code style={code}>story_jobs</code> and <code style={code}>story_artifacts</code>.
            Status changes call Supabase updates with local fallback when env is missing.
          </>
        }
      />

      <section
        className="glass-panel mt-4 px-4 py-2 text-xs"
        style={{ color: 'var(--text-muted)' }}
      >
        {dataBanner}
        {saving ? ' Saving…' : ''}
      </section>

      <section className="mt-6 grid gap-4">
        {jobs.map((job) => (
          <article key={job.id} className="glass-panel p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                {job.name}
              </h3>
              <select
                value={job.status}
                onChange={(event) => setJobStatus(job, event.target.value)}
                className="rounded border px-2 py-1 text-xs"
                style={sel}
              >
                {optionsWithValue(JOB_STATUS_OPTIONS, job.status).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
              {job.format}
            </p>
            <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
              Source: {job.source}
            </p>
          </article>
        ))}
      </section>

      <PageSection title="Output artifacts">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="mos-table-head">
              <tr>
                <th className="px-3 py-2 text-left">Artifact</th>
                <th className="px-3 py-2 text-left">State</th>
                <th className="px-3 py-2 text-left">Audience</th>
              </tr>
            </thead>
            <tbody>
              {artifacts.map((artifact) => (
                <tr key={artifact.id} className="mos-table-row">
                  <td className="px-3 py-2">{artifact.title}</td>
                  <td className="px-3 py-2">
                    <select
                      value={artifact.state}
                      onChange={(event) => setArtifactState(artifact, event.target.value)}
                      className="rounded border px-2 py-1 text-xs"
                      style={sel}
                    >
                      {optionsWithValue(ARTIFACT_STATE_OPTIONS, artifact.state).map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-2">{artifact.audience}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PageSection>
    </AppShell>
  )
}
