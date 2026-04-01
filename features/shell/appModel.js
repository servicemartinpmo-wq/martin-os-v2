export const appSections = [
  {
    id: 'pmo-ops',
    title: 'Planning',
    href: '/pmo-ops',
    summary: 'Keep goals, priorities, money, and next steps in one simple planning space.',
    modules: [
      'Overview',
      'Money',
      'Projects',
      'Contacts',
      'Guidance',
      'Reports',
      'Meetings',
    ],
  },
  {
    id: 'tech-ops',
    title: 'Support',
    href: '/tech-ops',
    summary: 'See what is working, what needs attention, and what your automations are doing.',
    modules: [
      'Requests',
      'Routing',
      'Checks',
      'Escalations',
      'Resource Hub - PMO-Ops',
      'Quality Control',
      'Activity',
    ],
  },
  {
    id: 'miidle',
    title: 'Studio',
    href: '/miidle',
    summary: 'Turn your work into updates, stories, proof, and ready-to-share content.',
    modules: [
      'Capture',
      'Work Map',
      'Story Builder',
      'Live Feed',
      'Proof',
      'Portfolio',
      'Connections',
    ],
  },
]

export const sourceOfTruth = {
  pmoOps: 'mpo-pilot structure + PMO business plan references',
  techOps: 'Tech-Ops repository and Tech-OPS BUILD document',
  miidle: 'miidle master build plan with pragmatic B-Stage carryover',
}
