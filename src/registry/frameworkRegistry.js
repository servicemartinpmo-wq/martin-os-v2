export const FRAMEWORK_REGISTRY = {
  ansoff_matrix: {
    name: 'Ansoff Matrix',
    category: 'Strategy',
    domain: 'pmo_ops',
    description: 'Evaluates growth via products vs. markets.',
    icon: '📊',
  },
  strategy_diamond: {
    name: 'Strategy Diamond',
    category: 'Strategy',
    domain: 'pmo_ops',
    description: 'Arenas, Vehicles, Differentiators, Staging, Economic Logic.',
    icon: '💎',
  },
  porter_five_forces: {
    name: "Porter's Five Forces",
    category: 'Strategy',
    domain: 'pmo_ops',
    description: 'Competitive advantage via threat, rivalry, and supplier analysis.',
    icon: '⚔️',
  },
  swot_analysis: {
    name: 'SWOT Analysis',
    category: 'Strategy',
    domain: 'pmo_ops',
    description: 'Strengths, Weaknesses, Opportunities, Threats assessment.',
    icon: '🎯',
  },
  raci_matrix: {
    name: 'RACI Matrix',
    category: 'Governance',
    domain: 'pmo_ops',
    description: 'Responsibility, Accountability, Consulted, Informed.',
    icon: '👥',
  },
  risk_register: {
    name: 'Risk Register',
    category: 'Risk',
    domain: 'pmo_ops',
    description: 'P × I = Score prioritization engine.',
    icon: '⚠️',
  },
  dupont_analysis: {
    name: 'DuPont Analysis',
    category: 'Finance',
    domain: 'tech_ops',
    description: 'Breaks down ROE into efficiency, leverage, and profitability.',
    icon: '📈',
  },
  capacity_model: {
    name: 'Capacity Model',
    category: 'Operations',
    domain: 'tech_ops',
    description: 'Resource load and headroom analysis across teams.',
    icon: '⚙️',
  },
  incident_timeline: {
    name: 'Incident Timeline',
    category: 'Operations',
    domain: 'tech_ops',
    description: 'Chronological incident tracking with severity mapping.',
    icon: '🔥',
  },
  okr_tracker: {
    name: 'OKR Tracker',
    category: 'Growth',
    domain: 'pmo_ops',
    description: 'Objective & Key Results alignment across the portfolio.',
    icon: '🏆',
  },
  build_story: {
    name: 'Build Story Engine',
    category: 'Growth',
    domain: 'miidle',
    description: 'Narrative-first execution capture for proof-of-work.',
    icon: '📖',
  },
  work_graph: {
    name: 'Work Graph',
    category: 'Operations',
    domain: 'miidle',
    description: 'Dependency visualization of execution artefacts.',
    icon: '🕸️',
  },
}

export const FRAMEWORK_CATEGORIES = [
  'Strategy',
  'Governance',
  'Risk',
  'Finance',
  'Operations',
  'Growth',
]

export function getFrameworksForDomain(domain) {
  if (domain === 'global') return Object.entries(FRAMEWORK_REGISTRY)
  return Object.entries(FRAMEWORK_REGISTRY).filter(
    ([, fw]) => fw.domain === domain,
  )
}
