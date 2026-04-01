export interface ExecutionLog {
  id: string;
  taskId: string;
  userId: string;
  actionType: 'create' | 'edit' | 'delete' | 'automate' | 'decision';
  timestamp: string;
  tool: string;
  durationSeconds?: number;
  dependencies: string[];
  outputFiles: string[];
  errorFlag: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  type: string;
  priority_score: number;
  created_at: string;
  owner_id: string;
  dependencies: string[];
}

export type Status = 'On Track' | 'Needs Attention' | 'Delayed' | 'Abandoned' | 'Open' | 'In Progress' | 'Resolved' | 'Closed';

export interface Initiative {
  id: string;
  title: string;
  description: string;
  priorityScore: number;
  strategicAlignment: string;
  dependencyRisk: 'Low' | 'Medium' | 'High';
  estimatedImpact: string;
  owner: string;
  status: Status;
  type: 'Transformative' | 'Operational';
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  system: string;
  aiDiagnostics?: string[];
  resolution?: string;
  createdAt: string;
}

export interface Connector {
  id: string;
  name: string;
  type: string;
  status: 'Healthy' | 'Degraded' | 'Down' | 'Unknown';
  lastChecked: string;
  responseTime?: number;
}

export interface BuildStoryPhase {
  id: string;
  title: 'Idea' | 'Middle' | 'Execution';
  description: string;
  mediaUrl?: string;
  status: 'Completed' | 'In Progress' | 'Planned';
}

export interface BuildStory {
  id: string;
  projectId: string;
  title: string;
  summary: string;
  videoUrl?: string;
  audioUrl?: string;
  writeupUrl?: string;
  tags: string[];
  outcomeMetrics: Record<string, any>;
  status: 'Draft' | 'Published';
  phases: BuildStoryPhase[];
}

export interface WorkGraphNode {
  id: string;
  type: 'User' | 'Project' | 'Output' | 'Skill';
  label: string;
  data: any;
}

export interface OperationalSignal {
  id: string;
  name: string;
  status: 'Healthy' | 'Risk' | 'Attention Needed' | 'Elite';
  value: number;
  trend: 'up' | 'down' | 'stable';
}

export interface Insight {
  id: string;
  type: string;
  situation: string;
  diagnosis: string;
  recommendation: string;
  systemRemedy: string;
  priority: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  mochaRole: 'Manager' | 'Owner' | 'Consulted' | 'Helped' | 'Accountable';
  avatar?: string;
  lastUpdate: string;
  workload: number;
}

export interface Framework {
  id: string;
  name: string;
  executionModule: string;
  outputsTo: string[];
  statusRelevance: string;
  temporalContext: string;
  dependencies: string[];
  notes: string;
}

export type AppMode = 
  | 'Founder/SMB' 
  | 'Executive' 
  | 'Startup/Project' 
  | 'Admin/Office' 
  | 'Freelance' 
  | 'Creative' 
  | 'Healthcare' 
  | 'Assisted';

export type AppType = 'PMO-OPs' | 'TECH-OPs' | 'miidle' | 'UnifiedOS';

export interface Signal {
  id: string;
  type: 'Operational' | 'Strategic' | 'Behavioral' | 'Risk';
  severity: 1 | 2 | 3 | 4 | 5;
  title: string;
  description: string;
  timestamp: string;
  confidence: number;
  source: string;
}

export interface Diagnosis {
  id: string;
  rootCause: string;
  layers: {
    surface: string;
    immediate: string;
    systemic: string;
    structural: string;
  };
  confidence: number;
  frameworks: string[];
  alternatives: string[];
}

export interface Advisory {
  id: string;
  recommendation: string;
  impact: number;
  effort: number;
  type: 'Quick Fix' | 'Structural' | 'Strategic';
  autoExecutable: boolean;
}

export interface GoalNode {
  id: string;
  title: string;
  type: 'Company' | 'Strategic' | 'Department' | 'Team' | 'Initiative' | 'Task';
  status: 'On Track' | 'At Risk' | 'Delayed';
  progress: number;
  alignmentScore: number;
  parentId?: string;
  children?: GoalNode[];
}

export interface EntityHealth {
  score: number;
  trend: 'up' | 'down' | 'stable';
  lastUpdated: string;
  factors: {
    name: string;
    impact: number;
    score: number;
  }[];
}

export type CoreSystemId =
  | 'strategic-alignment'
  | 'initiative-health'
  | 'execution-discipline'
  | 'dependency-intelligence'
  | 'org-capacity'
  | 'bottleneck-detection'
  | 'risk-escalation'
  | 'portfolio-optimization'
  | 'org-health-scoring'
  | 'process-improvement'
  | 'strategic-risk-forecasting'
  | 'resource-allocation'
  | 'leadership-bandwidth'
  | 'cross-dept-coordination'
  | 'execution-velocity'
  | 'opportunity-detection'
  | 'decision-support'
  | 'initiative-recovery'
  | 'strategic-planning'
  | 'innovation-pipeline'
  | 'change-management'
  | 'performance-benchmarking'
  | 'knowledge-intelligence'
  | 'predictive-analytics'
  | 'executive-insight'
  | 'sop-library'
  | 'dept-team-health'
  | 'diagnostics-engine'
  | 'action-items'
  | 'decision-log'
  | 'email-extraction'
  | 'ai-audio-note-taker';

export interface CoreSystem {
  id: CoreSystemId;
  name: string;
  purpose: string;
  signals: Signal[];
  diagnosis: Diagnosis[];
  advisory: Advisory[];
  health: EntityHealth;
}
