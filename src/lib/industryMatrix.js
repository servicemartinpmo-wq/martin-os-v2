/** Industry onboarding → default operating mode + layout recipe */

export const INDUSTRIES = [
  { id: 'saas', label: 'Software / SaaS / IT', defaultOperatingMode: 'project' },
  { id: 'agency', label: 'Agency / creative', defaultOperatingMode: 'creative' },
  { id: 'consulting', label: 'Consulting / professional services', defaultOperatingMode: 'founder' },
  { id: 'ops', label: 'Operations / logistics / manufacturing', defaultOperatingMode: 'project' },
  { id: 'healthcare', label: 'Healthcare / regulated', defaultOperatingMode: 'assisted' },
  { id: 'other', label: 'Other', defaultOperatingMode: 'project' },
]

/** @param {string} industryId */
export function getDefaultOperatingModeForIndustry(industryId) {
  const row = INDUSTRIES.find((i) => i.id === industryId)
  return row?.defaultOperatingMode ?? 'project'
}
