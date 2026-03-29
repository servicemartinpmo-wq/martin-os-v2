export const appSections = [
  {
    id: 'pmo-ops',
    title: 'PMO-Ops',
    href: '/pmo-ops',
    summary: 'Command center for initiatives, finance alignment, advisory, and operating cadence.',
    modules: [
      'Dashboard',
      'Finance Hub',
      'Projects & Initiatives',
      'CRM',
      'Advisory',
      'Reports',
      'Meetings / Note Taker',
    ],
  },
  {
    id: 'tech-ops',
    title: 'Tech-Ops',
    href: '/tech-ops',
    summary: 'Tech support operations plane with assisted triage, escalation, and integration sync.',
    modules: [
      'Ticket Intake',
      'Tier Routing',
      'Diagnostics',
      'Escalation Engine',
      'Resource Hub - PMO-Ops',
      'Quality Control',
      'Activity Log',
    ],
  },
  {
    id: 'miidle',
    title: 'Miidle',
    href: '/miidle',
    summary: 'Execution capture and build-story engine for proof-of-work and content generation.',
    modules: [
      'Execution Capture',
      'Work Graph',
      'Build Story Engine',
      'Spectator Feed',
      'Proof-of-Work',
      'Portfolio Layer',
      'Ops Integrations',
    ],
  },
]

export const sourceOfTruth = {
  pmoOps: 'mpo-pilot structure + PMO business plan references',
  techOps: 'Tech-Ops repository and Tech-OPS BUILD document',
  miidle: 'miidle master build plan with pragmatic B-Stage carryover',
}
