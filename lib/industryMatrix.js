import { getDefaultUserModeForIndustry } from '@/lib/themePresetsV2'

/** Industry onboarding matrix for intake-driven presets and mode defaults. */
export const INDUSTRIES = [
  {
    id: 'saas',
    label: 'Software / SaaS / IT',
    defaultOperatingMode: 'founder_operator_smb',
    plusEmphasis: 'Operator dashboards, product metrics, integration telemetry, and revenue visibility',
  },
  {
    id: 'agency',
    label: 'Agency / Creative',
    defaultOperatingMode: 'creative',
    plusEmphasis: 'Editorial layouts, portfolio artifacts, client approvals, and media-heavy storytelling',
  },
  {
    id: 'consulting',
    label: 'Consulting / Professional Services',
    defaultOperatingMode: 'executive',
    plusEmphasis: 'Briefing surfaces, account summaries, decision logs, and presentation-ready reporting',
  },
  {
    id: 'ops',
    label: 'Operations / Logistics / Manufacturing',
    defaultOperatingMode: 'admin_project',
    plusEmphasis: 'Task boards, telemetry, alert handling, SOPs, and exception management',
  },
  {
    id: 'healthcare',
    label: 'Healthcare / Regulated',
    defaultOperatingMode: 'healthcare',
    plusEmphasis: 'Calmer UI, service queues, readiness checks, handoffs, and compliance clarity',
  },
  {
    id: 'startup',
    label: 'Start-Up / Venture',
    defaultOperatingMode: 'startup',
    plusEmphasis: 'Growth cards, launch metrics, fundraising context, and rapid iteration loops',
  },
  {
    id: 'freelance',
    label: 'Freelance / Solo Business',
    defaultOperatingMode: 'freelance',
    plusEmphasis: 'Client workflows, deliverable boards, schedules, invoicing, and proof-of-work',
  },
  {
    id: 'other',
    label: 'Other',
    defaultOperatingMode: 'founder_operator_smb',
    plusEmphasis: 'Balanced command surface with adaptable presets and curated experience kits',
  },
]

/** @param {string} industryId */
export function getDefaultOperatingModeForIndustry(industryId) {
  return getDefaultUserModeForIndustry(industryId)
}

/** @param {string} industryId */
export function getIndustryRow(industryId) {
  return (
    INDUSTRIES.find((industry) => industry.id === industryId) ??
    INDUSTRIES[INDUSTRIES.length - 1]
  )
}
