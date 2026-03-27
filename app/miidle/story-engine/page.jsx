'use client'

import AppShell from '../../../src/features/shell/AppShell'
import { useMemo, useState } from 'react'
import { fallbackStoryArtifacts, fallbackStoryJobs } from '../../../src/features/data/operationalData'
import { useSupabaseTable } from '../../../src/hooks/useSupabaseTable'
import { useSupabaseMutation } from '../../../src/hooks/useSupabaseMutation'

const JOB_STATUS_OPTIONS = ['Queued', 'Rendering', 'Published']

const ARTIFACT_STATE_OPTIONS = ['Queued', 'Drafted', 'Ready', 'Published']

function optionsWithValue(preset, value) {
  if (value == null || value === '') return preset
  return preset.includes(value) ? preset : [...preset, value]
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
      <header className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-fuchsia-300">Miidle / Story Engine</p>
        <h2 className="mt-2 text-2xl font-semibold text-zinc-100">Build-story pipeline</h2>
        <p className="mt-2 max-w-3xl text-sm text-zinc-400">
          Jobs and artifacts read from <code className="rounded bg-zinc-950 px-1 py-0.5 text-xs">story_jobs</code> and{' '}
          <code className="rounded bg-zinc-950 px-1 py-0.5 text-xs">story_artifacts</code>. Status changes call Supabase
          updates with local fallback when env is missing.
        </p>
      </header>

      <section className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-2 text-xs text-zinc-400">
        {dataBanner}
        {saving ? ' Saving…' : ''}
      </section>

      <section className="mt-6 grid gap-4">
        {jobs.map((job) => (
          <article key={job.id} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-base font-semibold text-zinc-100">{job.name}</h3>
              <select
                value={job.status}
                onChange={(event) => setJobStatus(job, event.target.value)}
                className="rounded border border-zinc-700 bg-zinc-950/60 px-2 py-1 text-xs text-zinc-200"
              >
                {optionsWithValue(JOB_STATUS_OPTIONS, job.status).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <p className="mt-2 text-sm text-zinc-300">{job.format}</p>
            <p className="mt-1 text-xs text-zinc-400">Source: {job.source}</p>
          </article>
        ))}
      </section>

      <section className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h3 className="text-base font-semibold text-zinc-100">Output artifacts</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="border-b border-zinc-800 text-zinc-400">
              <tr>
                <th className="px-3 py-2 text-left">Artifact</th>
                <th className="px-3 py-2 text-left">State</th>
                <th className="px-3 py-2 text-left">Audience</th>
              </tr>
            </thead>
            <tbody>
              {artifacts.map((artifact) => (
                <tr key={artifact.id} className="border-b border-zinc-800/70 text-zinc-200">
                  <td className="px-3 py-2">{artifact.title}</td>
                  <td className="px-3 py-2">
                    <select
                      value={artifact.state}
                      onChange={(event) => setArtifactState(artifact, event.target.value)}
                      className="rounded border border-zinc-700 bg-zinc-950/60 px-2 py-1 text-xs text-zinc-200"
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
      </section>
    </AppShell>
  )
}
