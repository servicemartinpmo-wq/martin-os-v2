/**
 * Canonical upstreams: GitHub repos define schema/migrations; live rows come from Supabase when configured.
 */
export const SOURCE_OF_TRUTH = {
  mpoPilot: {
    id: 'mpo-pilot',
    label: 'mpo-pilot',
    ownerRepo: 'servicemartinpmo-wq/mpo-pilot',
    githubUrl: 'https://github.com/servicemartinpmo-wq/mpo-pilot',
    summary:
      'PMO initiative and insight shapes (priority_score, strategic_alignment, dependency_risk, completion_pct, insights signal rows).',
    supabaseTables: ['initiatives', 'insights'],
  },
  techOps: {
    id: 'tech-ops',
    label: 'Tech-Ops',
    ownerRepo: 'servicemartinpmo-wq/Tech-Ops',
    githubUrl: 'https://github.com/servicemartinpmo-wq/Tech-Ops',
    summary:
      'Case pipeline, AI diagnostics, workflows, and activity logging per READINESS_REPORT and Tech-OPS BUILD contracts.',
    supabaseTables: ['ai_diagnostics', 'workflows', 'activity_logs'],
  },
}

export const MIIDLE_SUPABASE_TABLES = ['activity_logs', 'story_jobs', 'story_artifacts']

export const SUPABASE_DATA_EXPLAINER =
  'Use one Supabase project whose schema matches migrations from mpo-pilot and Tech-Ops. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY on the host that runs next start.'
