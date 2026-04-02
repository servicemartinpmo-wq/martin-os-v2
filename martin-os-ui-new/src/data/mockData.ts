import { Initiative, OperationalSignal, Insight, TeamMember, Framework, Ticket, Connector, BuildStory, WorkGraphNode } from '../types';

export const initiatives: Initiative[] = [
  {
    id: 'INI-001',
    title: 'Customer Portal v2',
    description: 'Major upgrade to the customer facing dashboard and service layer.',
    priorityScore: 92,
    strategicAlignment: 'High',
    dependencyRisk: 'Medium',
    estimatedImpact: '$2.4M ARR',
    owner: 'Ryan Torres',
    status: 'Needs Attention',
    type: 'Transformative',
  },
  {
    id: 'INI-002',
    title: 'Supply Chain Optimization',
    description: 'Reducing lead times by 15% through automated inventory tracking.',
    priorityScore: 85,
    strategicAlignment: 'Medium',
    dependencyRisk: 'High',
    estimatedImpact: '15% Cost Reduction',
    owner: 'Sarah Chen',
    status: 'On Track',
    type: 'Operational',
  },
  {
    id: 'INI-003',
    title: 'Global Expansion - EU',
    description: 'Establishing operations in Germany and France.',
    priorityScore: 95,
    strategicAlignment: 'Critical',
    dependencyRisk: 'High',
    estimatedImpact: 'New Market Entry',
    owner: 'Marcus Miller',
    status: 'Delayed',
    type: 'Transformative',
  },
  {
    id: 'INI-004',
    title: 'Internal SOP Automation',
    description: 'Automating 40+ manual workflows using the Apphia engine.',
    priorityScore: 78,
    strategicAlignment: 'High',
    dependencyRisk: 'Low',
    estimatedImpact: '2000+ Hours Saved/Year',
    owner: 'Elena Rodriguez',
    status: 'On Track',
    type: 'Operational',
  },
];

export const tickets: Ticket[] = [
  {
    id: 'TIC-001',
    title: 'User Login Failure',
    description: 'User cannot log into system after password reset. Error 500 shown.',
    status: 'Open',
    priority: 'High',
    system: 'Auth Service',
    aiDiagnostics: ['Database connection timeout', 'Token validation error'],
    createdAt: '2026-03-29T10:00:00Z',
  },
  {
    id: 'TIC-002',
    title: 'Checkout API Timeout',
    description: 'Checkout API failing intermittently. Users experiencing timeout errors during payment.',
    status: 'In Progress',
    priority: 'Critical',
    system: 'Payment Gateway',
    aiDiagnostics: ['Third-party latency detected', 'Retry logic triggered'],
    createdAt: '2026-03-29T11:30:00Z',
  },
];

export const connectors: Connector[] = [
  { id: 'CON-001', name: 'GitHub', type: 'VCS', status: 'Healthy', lastChecked: '2 mins ago', responseTime: 120 },
  { id: 'CON-002', name: 'Stripe', type: 'Payment', status: 'Healthy', lastChecked: '5 mins ago', responseTime: 240 },
  { id: 'CON-003', name: 'AWS S3', type: 'Storage', status: 'Degraded', lastChecked: '1 min ago', responseTime: 1500 },
  { id: 'CON-004', name: 'Slack', type: 'Comms', status: 'Healthy', lastChecked: '10 mins ago', responseTime: 80 },
];

export const buildStories: BuildStory[] = [
  {
    id: 'BS-001',
    projectId: 'INI-004',
    title: 'Automating the Messy Middle',
    summary: 'How we reduced manual reporting by 80% using automated workflows.',
    tags: ['Automation', 'Efficiency', 'SOP'],
    outcomeMetrics: { 'Time Saved': '12h/week', 'Accuracy': '99.9%' },
    status: 'Published',
    phases: [
      { id: 'p1', title: 'Idea', description: 'The team was spending 15 hours a week on manual data entry for weekly reports.', status: 'Completed' },
      { id: 'p2', title: 'Middle', description: 'Iterating through 5 different Apphia engine configurations to handle edge cases in legacy data.', status: 'Completed' },
      { id: 'p3', title: 'Execution', description: 'Full rollout of the automated pipeline with real-time dashboard integration.', status: 'Completed' },
    ]
  },
  {
    id: 'BS-002',
    projectId: 'INI-001',
    title: 'Customer Portal v2: The UI Overhaul',
    summary: 'Redesigning the customer experience from the ground up.',
    tags: ['UI/UX', 'React', 'Design'],
    outcomeMetrics: { 'User Satisfaction': '+45%', 'Load Time': '-60%' },
    status: 'Published',
    phases: [
      { id: 'p1', title: 'Idea', description: 'Old portal was clunky and hard to navigate. Users were complaining about complexity.', status: 'Completed' },
      { id: 'p2', title: 'Middle', description: 'Prototyping the new navigation system and testing with core users. Lots of back and forth on the sidebar.', status: 'In Progress' },
      { id: 'p3', title: 'Execution', description: 'Finalizing the component library and preparing for the beta launch.', status: 'Planned' },
    ]
  }
];

export const workGraphNodes: WorkGraphNode[] = [
  { id: 'node-1', type: 'User', label: 'John Doe', data: {} },
  { id: 'node-2', type: 'Project', label: 'Martin-OS', data: {} },
  { id: 'node-3', type: 'Skill', label: 'AI Architecture', data: {} },
];

export const signals: OperationalSignal[] = [
  {
    id: 'SIG-001',
    name: 'Operations Health',
    status: 'Risk',
    value: 68,
    trend: 'down',
  },
  {
    id: 'SIG-002',
    name: 'Projects On Track',
    status: 'Healthy',
    value: 82,
    trend: 'stable',
  },
  {
    id: 'SIG-003',
    name: 'Executive Inbox Load',
    status: 'Attention Needed',
    value: 94,
    trend: 'up',
  },
  {
    id: 'SIG-004',
    name: 'Team Capacity',
    status: 'Elite',
    value: 91,
    trend: 'stable',
  },
];

export const insights: Insight[] = [
  {
    id: 'INS-001',
    type: 'Strategic',
    situation: 'Three initiatives share the same resource (Design Team).',
    diagnosis: 'Resource bottleneck detected in Creative department.',
    recommendation: 'Reprioritize INI-004 to Q3 or hire contract support.',
    systemRemedy: 'Quarterly capacity planning adjustment.',
    priority: 1,
  },
  {
    id: 'INS-002',
    type: 'Operational',
    situation: 'Your calendar shows 9 meetings tomorrow but 4 unresolved approvals.',
    diagnosis: 'Decision fatigue risk high for CEO.',
    recommendation: 'Delegate budget reviews to Finance Lead.',
    systemRemedy: 'Delegation & Authority Matrix update.',
    priority: 2,
  },
];

export const teamMembers: TeamMember[] = [
  {
    id: 'TM-001',
    name: 'Ryan Torres',
    role: 'Product Director',
    mochaRole: 'Manager',
    lastUpdate: '2 hours ago',
    workload: 85,
  },
  {
    id: 'TM-002',
    name: 'Sarah Chen',
    role: 'Operations Lead',
    mochaRole: 'Owner',
    lastUpdate: '10 mins ago',
    workload: 65,
  },
  {
    id: 'TM-003',
    name: 'Marcus Miller',
    role: 'Strategy Head',
    mochaRole: 'Accountable',
    lastUpdate: '1 day ago',
    workload: 95,
  },
];

export const frameworks: Framework[] = [
  {
    id: 'FW-001',
    name: 'Balanced Scorecard',
    executionModule: 'Diagnostics',
    outputsTo: ['Dashboard', 'Reports'],
    statusRelevance: 'All',
    temporalContext: 'Monthly / Quarterly',
    dependencies: ['OKR Alignment', 'Strategic Initiatives'],
    notes: 'Past KPIs inform priority scoring.',
  },
  {
    id: 'FW-002',
    name: 'Lean',
    executionModule: 'Diagnostics',
    outputsTo: ['Departments'],
    statusRelevance: 'Pending / Ongoing',
    temporalContext: 'Daily / Weekly',
    dependencies: ['TOC', 'Kaizen'],
    notes: 'Past process improvements feed Contextual guidance.',
  },
  {
    id: 'FW-003',
    name: 'Theory of Constraints',
    executionModule: 'Diagnostics',
    outputsTo: ['Initiatives'],
    statusRelevance: 'All',
    temporalContext: 'Initiative timing',
    dependencies: ['Critical Chain PM'],
    notes: 'Previous bottlenecks inform prioritization.',
  },
];
