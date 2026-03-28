/** Industry onboarding → default operating mode + layout recipe */

export const INDUSTRIES = [
  {
    id: 'saas',
    label: 'Software / SaaS / IT',
    defaultOperatingMode: 'project',
    plusEmphasis: 'Dense application shells, tables, filters, Kanban-style lists',
  },
  {
    id: 'agency',
    label: 'Agency / creative',
    defaultOperatingMode: 'creative',
    plusEmphasis: 'Bento / editorial grids, large media, marketing sections',
  },
  {
    id: 'consulting',
    label: 'Consulting / professional services',
    defaultOperatingMode: 'founder',
    plusEmphasis: 'Stats + KPI stacks, risk callouts, description lists',
  },
  {
    id: 'ops',
    label: 'Operations / logistics / manufacturing',
    defaultOperatingMode: 'project',
    plusEmphasis: 'Tables, timelines, exception alerts + exec stats strip',
  },
  {
    id: 'healthcare',
    label: 'Healthcare / regulated',
    defaultOperatingMode: 'assisted',
    plusEmphasis: 'Large targets, simple nav recipes, high-contrast presets',
  },
  { id: 'other', label: 'Other', defaultOperatingMode: 'project', plusEmphasis: 'Balanced application UI' },
]

/** @param {string} industryId */
export function getDefaultOperatingModeForIndustry(industryId) {
  const row = INDUSTRIES.find((i) => i.id === industryId)
  return row?.defaultOperatingMode ?? 'project'
}

/** @param {string} industryId */
export function getIndustryRow(industryId) {
  return INDUSTRIES.find((i) => i.id === industryId) ?? INDUSTRIES[INDUSTRIES.length - 1]
}
