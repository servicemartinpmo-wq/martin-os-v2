/**
 * Optional MBTI-axis style prompt diversity for agents — not user clinical typing.
 * Enable with NEXT_PUBLIC_COGNITIVE_ROUTER=1 and pass profile id into runAgent.
 */

/** @type {Record<string, { label: string, systemAddendum: string }>} */
const PROFILES = {
  INTJ: {
    label: 'Structured long-range',
    systemAddendum: 'Favor systems thinking, explicit tradeoffs, and milestone checks.',
  },
  ENFP: {
    label: 'Exploratory connective',
    systemAddendum: 'Surface alternatives, stakeholder narratives, and creative mitigations.',
  },
  ISTJ: {
    label: 'Evidence-first operational',
    systemAddendum: 'Cite concrete signals, prefer checklists and provenance over speculation.',
  },
  DEFAULT: {
    label: 'Balanced',
    systemAddendum: '',
  },
}

/** @param {string} [profileId] */
export function getCognitiveProfile(profileId) {
  if (!profileId || !PROFILES[profileId]) return PROFILES.DEFAULT
  return PROFILES[profileId]
}

export function listCognitiveProfiles() {
  return Object.entries(PROFILES).map(([id, v]) => ({ id, ...v }))
}
