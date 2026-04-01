import React from 'react';
import { motion } from 'motion/react';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  ShieldAlert, 
  Target, 
  Zap,
  ArrowRight,
  BarChart3,
  Search,
  Settings,
  Info,
  History,
  Lightbulb,
  MessageSquare,
  Share2,
  Play
} from 'lucide-react';
import { AppMode, CoreSystemId } from '../../types';
import { cn } from '../../lib/utils';

interface CoreSystemShellProps {
  systemId: CoreSystemId;
  mode: AppMode;
}

const SYSTEM_DATA: Record<CoreSystemId, { 
  purpose: string; 
  signals: any[]; 
  diagnosis: any; 
  advisory: any[]; 
  health: number;
  learningMsg: string;
}> = {
  'strategic-alignment': {
    purpose: 'Ensures every initiative and task directly contributes to top-level company goals.',
    health: 94.2,
    learningMsg: 'Analyzing alignment drift in Q3 marketing spend vs. product roadmap.',
    signals: [
      { type: 'Strategic', title: 'Goal Misalignment in Project X', severity: 4, confidence: 92, time: '12m ago' },
      { type: 'Operational', title: 'Task-to-Goal Mapping Gap', severity: 2, confidence: 85, time: '1h ago' },
    ],
    diagnosis: {
      surface: 'Resource waste on non-core projects',
      immediate: 'Lack of clear OKR cascading',
      systemic: 'Strategic planning siloed from execution',
      structural: 'Incentive structures favor local optimization'
    },
    advisory: [
      { title: 'Re-align Project X to Goal 1.2', impact: 95, effort: 20, type: 'Quick Fix' },
      { title: 'Implement Cascading OKR Framework', impact: 88, effort: 60, type: 'Structural' },
    ]
  },
  'initiative-health': {
    purpose: 'Real-time monitoring of project progress, budget, and risk levels.',
    health: 88.5,
    learningMsg: 'Predicting delay in "Market Expansion" based on current velocity.',
    signals: [
      { type: 'Risk', title: 'Budget Burn Rate Spike', severity: 5, confidence: 98, time: '5m ago' },
      { type: 'Operational', title: 'Milestone 2 Delay Probability > 70%', severity: 4, confidence: 91, time: '45m ago' },
    ],
    diagnosis: {
      surface: 'Project timeline slippage',
      immediate: 'Scope creep in Phase 1',
      systemic: 'Poor estimation accuracy',
      structural: 'Lack of standardized project controls'
    },
    advisory: [
      { title: 'Trigger Risk Mitigation Protocol', impact: 82, effort: 15, type: 'Quick Fix' },
      { title: 'Project Scope Audit & Re-baselining', impact: 90, effort: 40, type: 'Strategic' },
    ]
  },
  'execution-discipline': {
    purpose: 'Measures and enforces the consistency and quality of operational output.',
    health: 91.0,
    learningMsg: 'Identifying patterns in missed deadlines across the Engineering dept.',
    signals: [
      { type: 'Behavioral', title: 'Consistency Drop in Weekly Syncs', severity: 3, confidence: 82, time: '2h ago' },
      { type: 'Operational', title: 'Quality Assurance Failure Rate Up', severity: 4, confidence: 89, time: '4h ago' },
    ],
    diagnosis: {
      surface: 'Variable output quality',
      immediate: 'Process non-compliance',
      systemic: 'Lack of accountability loops',
      structural: 'Cultural drift from excellence standards'
    },
    advisory: [
      { title: 'Automated Compliance Checklists', impact: 78, effort: 25, type: 'Quick Fix' },
      { title: 'Discipline & Quality Training Cycle', impact: 85, effort: 50, type: 'Structural' },
    ]
  },
  'dependency-intelligence': {
    purpose: 'Maps and manages complex interdependencies between teams and projects.',
    health: 76.4,
    learningMsg: 'Mapping critical path fragility between Product and Marketing.',
    signals: [
      { type: 'Risk', title: 'Circular Dependency Detected', severity: 5, confidence: 95, time: '10m ago' },
      { type: 'Operational', title: 'Upstream Delay Impacting 4 Projects', severity: 4, confidence: 93, time: '1h ago' },
    ],
    diagnosis: {
      surface: 'Project gridlock',
      immediate: 'Uncoordinated release schedules',
      systemic: 'Siloed planning processes',
      structural: 'Lack of shared dependency visibility'
    },
    advisory: [
      { title: 'Decouple Project Alpha from Beta', impact: 92, effort: 45, type: 'Structural' },
      { title: 'Sync Release Calendars', impact: 80, effort: 20, type: 'Quick Fix' },
    ]
  },
  'org-capacity': {
    purpose: 'Analyzes human and technical resource availability vs. demand.',
    health: 82.1,
    learningMsg: 'Forecasting 15% resource deficit in Q4 based on hiring pipeline.',
    signals: [
      { type: 'Operational', title: 'Engineering Utilization > 95%', severity: 4, confidence: 96, time: '30m ago' },
      { type: 'Behavioral', title: 'Burnout Risk: High in Design Team', severity: 4, confidence: 84, time: '2h ago' },
    ],
    diagnosis: {
      surface: 'Resource bottlenecks',
      immediate: 'Over-allocation of key talent',
      systemic: 'Poor capacity planning models',
      structural: 'Talent acquisition lag'
    },
    advisory: [
      { title: 'Pause Non-Critical Initiatives', impact: 85, effort: 10, type: 'Quick Fix' },
      { title: 'Expand External Contractor Pool', impact: 75, effort: 30, type: 'Strategic' },
    ]
  },
  'bottleneck-detection': {
    purpose: 'Identifies and resolves constraints that slow down organizational flow.',
    health: 85.7,
    learningMsg: 'Detected 48h delay in Legal approval workflow.',
    signals: [
      { type: 'Operational', title: 'Queue Buildup in QA Pipeline', severity: 4, confidence: 94, time: '15m ago' },
      { type: 'Risk', title: 'Single Point of Failure: Lead Dev', severity: 5, confidence: 90, time: '1h ago' },
    ],
    diagnosis: {
      surface: 'Workflow delays',
      immediate: 'Inadequate throughput in QA',
      systemic: 'Inefficient handoff protocols',
      structural: 'Under-investment in automation'
    },
    advisory: [
      { title: 'Automate QA Regression Suite', impact: 94, effort: 65, type: 'Structural' },
      { title: 'Add Temporary QA Capacity', impact: 70, effort: 20, type: 'Quick Fix' },
    ]
  },
  'risk-escalation': {
    purpose: 'Ensures critical risks are detected and moved to decision-makers instantly.',
    health: 98.2,
    learningMsg: 'Escalated EMEA revenue drift to Executive Command Center.',
    signals: [
      { type: 'Risk', title: 'Critical Security Vulnerability', severity: 5, confidence: 100, time: '2m ago' },
      { type: 'Strategic', title: 'Competitor Launch: Direct Threat', severity: 4, confidence: 88, time: '3h ago' },
    ],
    diagnosis: {
      surface: 'Late risk awareness',
      immediate: 'Manual escalation delays',
      systemic: 'Lack of automated risk triggers',
      structural: 'Culture of risk avoidance'
    },
    advisory: [
      { title: 'Enable Auto-Escalation for P0 Risks', impact: 100, effort: 10, type: 'Quick Fix' },
      { title: 'Risk Sensitivity Training', impact: 65, effort: 40, type: 'Behavioral' },
    ]
  },
  'portfolio-optimization': {
    purpose: 'Balances the mix of initiatives to maximize ROI and strategic impact.',
    health: 89.4,
    learningMsg: 'Recommending 12% shift from Maintenance to Innovation projects.',
    signals: [
      { type: 'Strategic', title: 'Portfolio Over-weighted in Low-Impact', severity: 3, confidence: 91, time: '1d ago' },
      { type: 'Financial', title: 'Diminishing Returns on Project Gamma', severity: 4, confidence: 86, time: '2d ago' },
    ],
    diagnosis: {
      surface: 'Sub-optimal ROI',
      immediate: 'Poor project prioritization',
      systemic: 'Lack of portfolio-level visibility',
      structural: 'Budgeting tied to depts, not impact'
    },
    advisory: [
      { title: 'Kill Project Gamma; Reallocate', impact: 92, effort: 15, type: 'Strategic' },
      { title: 'Implement Value-Based Prioritization', impact: 88, effort: 55, type: 'Structural' },
    ]
  },
  'org-health-scoring': {
    purpose: 'Aggregates signals into a single, comprehensive health metric for the company.',
    health: 94.2,
    learningMsg: 'Recalculating Org Health based on Q3 performance data.',
    signals: [
      { type: 'Operational', title: 'Health Score Drift: -2.1pts', severity: 2, confidence: 99, time: '1h ago' },
      { type: 'Behavioral', title: 'Sentiment Analysis: Positive Trend', severity: 1, confidence: 82, time: '1d ago' },
    ],
    diagnosis: {
      surface: 'Score fluctuations',
      immediate: 'Decline in operational efficiency',
      systemic: 'Lagging data integration',
      structural: 'Incomplete health metric model'
    },
    advisory: [
      { title: 'Deep Dive: Efficiency Decline', impact: 75, effort: 20, type: 'Quick Fix' },
      { title: 'Refine Health Scoring Algorithm', impact: 80, effort: 40, type: 'Structural' },
    ]
  },
  'process-improvement': {
    purpose: 'Continuously identifies and optimizes inefficient workflows.',
    health: 87.3,
    learningMsg: 'Optimized "Hiring Workflow" - reduced cycle time by 4 days.',
    signals: [
      { type: 'Operational', title: 'High Cycle Time in Procurement', severity: 3, confidence: 94, time: '3h ago' },
      { type: 'Behavioral', title: 'Process Workaround Detected', severity: 4, confidence: 87, time: '5h ago' },
    ],
    diagnosis: {
      surface: 'Inefficient processes',
      immediate: 'Manual steps in procurement',
      systemic: 'Lack of process ownership',
      structural: 'Outdated legacy workflows'
    },
    advisory: [
      { title: 'Digitize Procurement Approvals', impact: 88, effort: 35, type: 'Structural' },
      { title: 'Process Compliance Audit', impact: 60, effort: 15, type: 'Quick Fix' },
    ]
  },
  'strategic-risk-forecasting': {
    purpose: 'Uses predictive modeling to forecast future strategic threats before they materialize.',
    health: 92.8,
    learningMsg: 'Simulating impact of potential market downturn on Q4 revenue.',
    signals: [
      { type: 'Risk', title: 'Market Volatility Index Spike', severity: 4, confidence: 89, time: '2h ago' },
      { type: 'Strategic', title: 'New Entrant in Core Market', severity: 3, confidence: 82, time: '6h ago' },
    ],
    diagnosis: {
      surface: 'Future uncertainty',
      immediate: 'Lack of scenario planning',
      systemic: 'Reactive risk management',
      structural: 'Inadequate external market data'
    },
    advisory: [
      { title: 'Run Q4 Market Downturn Simulation', impact: 95, effort: 20, type: 'Strategic' },
      { title: 'Implement External Signal Monitor', impact: 82, effort: 50, type: 'Structural' },
    ]
  },
  'resource-allocation': {
    purpose: 'Dynamically shifts resources to the highest-impact areas in real-time.',
    health: 84.5,
    learningMsg: 'Moving 2 DevOps engineers to "Cloud Migration" to hit deadline.',
    signals: [
      { type: 'Operational', title: 'Resource Imbalance: R&D vs Ops', severity: 3, confidence: 91, time: '4h ago' },
      { type: 'Financial', title: 'Under-utilized Budget in Marketing', severity: 2, confidence: 95, time: '1d ago' },
    ],
    diagnosis: {
      surface: 'Misallocated resources',
      immediate: 'Static budgeting constraints',
      systemic: 'Lack of dynamic allocation tools',
      structural: 'Departmental resource hoarding'
    },
    advisory: [
      { title: 'Dynamic Budget Re-allocation', impact: 90, effort: 30, type: 'Strategic' },
      { title: 'Implement Shared Resource Pool', impact: 85, effort: 60, type: 'Structural' },
    ]
  },
  'leadership-bandwidth': {
    purpose: 'Monitors executive cognitive load and decision-making capacity.',
    health: 79.2,
    learningMsg: 'Detected high cognitive load for CEO - recommending delegation.',
    signals: [
      { type: 'Behavioral', title: 'Decision Latency Increasing', severity: 4, confidence: 88, time: '5h ago' },
      { type: 'Operational', title: 'Meeting Load > 35h/week', severity: 4, confidence: 96, time: '1d ago' },
    ],
    diagnosis: {
      surface: 'Leadership burnout',
      immediate: 'Excessive operational involvement',
      systemic: 'Poor delegation frameworks',
      structural: 'Lack of empowered middle mgmt'
    },
    advisory: [
      { title: 'Delegate Ops Decisions to COO', impact: 94, effort: 10, type: 'Quick Fix' },
      { title: 'Implement Decision Rights Matrix', impact: 88, effort: 45, type: 'Structural' },
    ]
  },
  'cross-dept-coordination': {
    purpose: 'Breaks down silos and ensures seamless collaboration across departments.',
    health: 81.6,
    learningMsg: 'Improving handoff between Sales and Customer Success.',
    signals: [
      { type: 'Operational', title: 'Handoff Failure Rate: Sales -> CS', severity: 4, confidence: 92, time: '3h ago' },
      { type: 'Behavioral', title: 'Siloed Communication Patterns', severity: 3, confidence: 85, time: '1d ago' },
    ],
    diagnosis: {
      surface: 'Inter-dept friction',
      immediate: 'Undefined handoff protocols',
      systemic: 'Lack of cross-functional goals',
      structural: 'Departmental incentive misalignment'
    },
    advisory: [
      { title: 'Standardize Sales-to-CS Handoff', impact: 92, effort: 25, type: 'Quick Fix' },
      { title: 'Implement Cross-Dept OKRs', impact: 85, effort: 55, type: 'Structural' },
    ]
  },
  'execution-velocity': {
    purpose: 'Measures the speed at which the organization moves from idea to outcome.',
    health: 88.9,
    learningMsg: 'Velocity increased by 8% after implementing "Fast-Track" approvals.',
    signals: [
      { type: 'Operational', title: 'Velocity Drop in Sprint 12', severity: 3, confidence: 94, time: '2h ago' },
      { type: 'Strategic', title: 'Time-to-Market Lag vs Benchmark', severity: 4, confidence: 82, time: '2d ago' },
    ],
    diagnosis: {
      surface: 'Slow execution speed',
      immediate: 'Excessive approval layers',
      systemic: 'Inefficient meeting culture',
      structural: 'Legacy technical debt'
    },
    advisory: [
      { title: 'Remove 2 Approval Layers', impact: 95, effort: 15, type: 'Quick Fix' },
      { title: 'Technical Debt Refactor Cycle', impact: 80, effort: 70, type: 'Structural' },
    ]
  },
  'opportunity-detection': {
    purpose: 'Scans internal and external data to find untapped growth opportunities.',
    health: 93.5,
    learningMsg: 'Identified $2M expansion opportunity in existing client base.',
    signals: [
      { type: 'Strategic', title: 'Unmet Customer Need Detected', severity: 2, confidence: 84, time: '6h ago' },
      { type: 'Financial', title: 'High LTV Segment Under-served', severity: 3, confidence: 91, time: '1d ago' },
    ],
    diagnosis: {
      surface: 'Missed growth potential',
      immediate: 'Lack of customer data analysis',
      systemic: 'Reactive sales strategy',
      structural: 'Siloed customer insights'
    },
    advisory: [
      { title: 'Launch Targeted Upsell Campaign', impact: 88, effort: 20, type: 'Strategic' },
      { title: 'Implement Customer Data Platform', impact: 82, effort: 65, type: 'Structural' },
    ]
  },
  'decision-support': {
    purpose: 'Provides data-driven recommendations for complex business decisions.',
    health: 95.1,
    learningMsg: 'Providing data for "Series C Timing" decision.',
    signals: [
      { type: 'Strategic', title: 'Decision Required: M&A Target', severity: 4, confidence: 96, time: '4h ago' },
      { type: 'Operational', title: 'Data Inconsistency in Decision Model', severity: 3, confidence: 88, time: '8h ago' },
    ],
    diagnosis: {
      surface: 'Decision paralysis',
      immediate: 'Incomplete data for M&A',
      systemic: 'Lack of decision frameworks',
      structural: 'Biased internal reporting'
    },
    advisory: [
      { title: 'Run M&A Target Analysis', impact: 94, effort: 30, type: 'Strategic' },
      { title: 'Standardize Decision Models', impact: 80, effort: 45, type: 'Structural' },
    ]
  },
  'initiative-recovery': {
    purpose: 'Specialized system for turning around failing or stalled projects.',
    health: 83.4,
    learningMsg: 'Recovering "Project Beta" - re-aligned scope and resources.',
    signals: [
      { type: 'Risk', title: 'Project Beta: Red Status', severity: 5, confidence: 98, time: '1h ago' },
      { type: 'Operational', title: 'Stalled Progress for 3 Weeks', severity: 4, confidence: 92, time: '1d ago' },
    ],
    diagnosis: {
      surface: 'Project failure risk',
      immediate: 'Loss of momentum in Beta',
      systemic: 'Inadequate early warning signs',
      structural: 'Lack of recovery protocols'
    },
    advisory: [
      { title: 'Deploy Recovery Task Force', impact: 95, effort: 40, type: 'Quick Fix' },
      { title: 'Project Beta Re-scoping', impact: 88, effort: 30, type: 'Strategic' },
    ]
  },
  'strategic-planning': {
    purpose: 'Facilitates the creation and refinement of long-term company strategy.',
    health: 91.7,
    learningMsg: 'Drafting 2027 Strategic Roadmap based on intelligence projections.',
    signals: [
      { type: 'Strategic', title: 'Strategy Refresh Required', severity: 3, confidence: 95, time: '2d ago' },
      { type: 'Operational', title: 'Strategy-to-Execution Gap: 15%', severity: 4, confidence: 87, time: '3d ago' },
    ],
    diagnosis: {
      surface: 'Strategic drift',
      immediate: 'Outdated 2026 roadmap',
      systemic: 'Lack of continuous planning',
      structural: 'Strategy disconnected from data'
    },
    advisory: [
      { title: 'Initiate 2027 Planning Cycle', impact: 100, effort: 50, type: 'Strategic' },
      { title: 'Implement Dynamic Strategy Feed', impact: 82, effort: 40, type: 'Structural' },
    ]
  },
  'innovation-pipeline': {
    purpose: 'Manages the flow of new ideas from conception to market launch.',
    health: 86.2,
    learningMsg: '3 new high-potential ideas detected in internal "Idea Box".',
    signals: [
      { type: 'Strategic', title: 'Innovation Rate Below Target', severity: 3, confidence: 91, time: '1w ago' },
      { type: 'Operational', title: 'Idea Stagnation in Phase 2', severity: 4, confidence: 84, time: '2w ago' },
    ],
    diagnosis: {
      surface: 'Low innovation output',
      immediate: 'Bottleneck in prototyping',
      systemic: 'Lack of innovation metrics',
      structural: 'Risk-averse culture'
    },
    advisory: [
      { title: 'Fund Rapid Prototyping Lab', impact: 94, effort: 60, type: 'Structural' },
      { title: 'Launch Internal Innovation Challenge', impact: 75, effort: 20, type: 'Quick Fix' },
    ]
  },
  'change-management': {
    purpose: 'Ensures organizational changes are implemented smoothly and effectively.',
    health: 84.8,
    learningMsg: 'Monitoring adoption of new "Agile Framework" - 65% complete.',
    signals: [
      { type: 'Behavioral', title: 'Resistance to New Workflow', severity: 4, confidence: 88, time: '1d ago' },
      { type: 'Operational', title: 'Advisory Adoption Lagging', severity: 3, confidence: 92, time: '2d ago' },
    ],
    diagnosis: {
      surface: 'Change resistance',
      immediate: 'Inadequate communication plan',
      systemic: 'Lack of change champions',
      structural: 'Incentives favor old ways'
    },
    advisory: [
      { title: 'Launch Change Champion Program', impact: 85, effort: 35, type: 'Behavioral' },
      { title: 'Revise Incentive Structures', impact: 92, effort: 55, type: 'Structural' },
    ]
  },
  'performance-benchmarking': {
    purpose: 'Compares organizational performance against industry standards and competitors.',
    health: 90.5,
    learningMsg: 'Benchmarking "Sales Efficiency" against Top 10 SaaS peers.',
    signals: [
      { type: 'Strategic', title: 'Efficiency Lag vs Industry Top 10%', severity: 3, confidence: 94, time: '3d ago' },
      { type: 'Financial', title: 'CAC Higher than Peer Average', severity: 4, confidence: 89, time: '1w ago' },
    ],
    diagnosis: {
      surface: 'Competitive disadvantage',
      immediate: 'High customer acquisition cost',
      systemic: 'Lack of external benchmarks',
      structural: 'Inefficient sales funnel'
    },
    advisory: [
      { title: 'Sales Funnel Optimization', impact: 88, effort: 40, type: 'Operational' },
      { title: 'Implement Peer Benchmarking Feed', impact: 75, effort: 30, type: 'Structural' },
    ]
  },
  'knowledge-intelligence': {
    purpose: 'Captures, organizes, and leverages organizational knowledge and lessons learned.',
    health: 92.1,
    learningMsg: 'Synthesizing "Project Alpha" lessons into Best Practices.',
    signals: [
      { type: 'Operational', title: 'Knowledge Silo Detected: Tech Team', severity: 3, confidence: 91, time: '1d ago' },
      { type: 'Behavioral', title: 'Low Engagement with Superbase', severity: 2, confidence: 85, time: '2d ago' },
    ],
    diagnosis: {
      surface: 'Information silos',
      immediate: 'Documentation fragmentation',
      systemic: 'Lack of knowledge sharing culture',
      structural: 'Inadequate search/discovery tools'
    },
    advisory: [
      { title: 'Centralize Tech Documentation', impact: 90, effort: 30, type: 'Quick Fix' },
      { title: 'Implement Knowledge Search', impact: 94, effort: 50, type: 'Structural' },
    ]
  },
  'predictive-analytics': {
    purpose: 'Uses historical data to forecast future trends and outcomes.',
    health: 95.7,
    learningMsg: 'Predicting 12% revenue growth in Q4 based on current pipeline.',
    signals: [
      { type: 'Financial', title: 'Revenue Forecast Variance: +5%', severity: 1, confidence: 98, time: '4h ago' },
      { type: 'Operational', title: 'Churn Prediction: High Risk Segment', severity: 4, confidence: 92, time: '8h ago' },
    ],
    diagnosis: {
      surface: 'Future performance variance',
      immediate: 'Unexpected churn in Segment B',
      systemic: 'Inaccurate churn models',
      structural: 'Lack of real-time data integration'
    },
    advisory: [
      { title: 'Targeted Retention Campaign', impact: 92, effort: 20, type: 'Strategic' },
      { title: 'Refine Predictive Churn Model', impact: 85, effort: 45, type: 'Structural' },
    ]
  },
  'executive-insight': {
    purpose: 'Provides high-level, actionable insights specifically for the C-suite.',
    health: 97.4,
    learningMsg: 'Generating Weekly Executive Summary for CEO.',
    signals: [
      { type: 'Strategic', title: 'Critical Insight: Market Shift', severity: 4, confidence: 96, time: '2h ago' },
      { type: 'Financial', title: 'EBITDA Margin Above Target', severity: 1, confidence: 99, time: '1d ago' },
    ],
    diagnosis: {
      surface: 'Information overload',
      immediate: 'Lack of summarized insights',
      systemic: 'Reporting too granular for C-suite',
      structural: 'Manual insight generation'
    },
    advisory: [
      { title: 'Automate Executive Summary', impact: 98, effort: 15, type: 'Quick Fix' },
      { title: 'Implement Strategic Insight Feed', impact: 90, effort: 40, type: 'Structural' },
    ]
  },
  'dept-team-health': {
    purpose: 'Monitors the holistic health, sentiment, and performance of specific departments and teams.',
    health: 82.4,
    learningMsg: 'Detected sentiment dip in the Engineering team - analyzing root cause.',
    signals: [
      { type: 'Behavioral', title: 'Team Sentiment: -15% WoW', severity: 4, confidence: 92, time: '3h ago' },
      { type: 'Operational', title: 'Output Velocity Stable', severity: 1, confidence: 95, time: '5h ago' },
    ],
    diagnosis: {
      surface: 'Decreased team morale',
      immediate: 'High workload in recent sprint',
      systemic: 'Lack of recognition cycles',
      structural: 'Inflexible work-life balance policies'
    },
    advisory: [
      { title: 'Schedule Team Appreciation Event', impact: 85, effort: 15, type: 'Quick Fix' },
      { title: 'Review Workload Distribution', impact: 90, effort: 40, type: 'Structural' },
    ]
  },
  'diagnostics-engine': {
    purpose: 'Advanced intelligence engine for deep-dive diagnostics into organizational and technical issues.',
    health: 98.1,
    learningMsg: 'Running deep diagnostic on "Project Alpha" delay.',
    signals: [
      { type: 'Operational', title: 'Diagnostic Complete: Project Alpha', severity: 2, confidence: 98, time: '10m ago' },
      { type: 'Risk', title: 'New Diagnostic Pattern Detected', severity: 1, confidence: 88, time: '2h ago' },
    ],
    diagnosis: {
      surface: 'Accurate problem identification',
      immediate: 'Intelligence models are highly tuned',
      systemic: 'Continuous learning from past issues',
      structural: 'Robust data ingestion pipeline'
    },
    advisory: [
      { title: 'Run "Org-Wide" Health Diagnostic', impact: 95, effort: 20, type: 'Strategic' },
      { title: 'Update Diagnostic ML Models', impact: 80, effort: 50, type: 'Structural' },
    ]
  },
  'action-items': {
    purpose: 'Tracks and enforces the completion of critical actions across the organization.',
    health: 89.7,
    learningMsg: 'Auto-reminding 4 owners about overdue high-priority actions.',
    signals: [
      { type: 'Operational', title: 'Overdue Action Items: 12', severity: 3, confidence: 100, time: '1h ago' },
      { type: 'Behavioral', title: 'Action Completion Rate: 92%', severity: 1, confidence: 96, time: '1d ago' },
    ],
    diagnosis: {
      surface: 'Minor execution lag',
      immediate: 'Resource constraints for 3 items',
      systemic: 'Strong accountability loops',
      structural: 'Efficient tracking system'
    },
    advisory: [
      { title: 'Re-assign Overdue Items', impact: 80, effort: 10, type: 'Quick Fix' },
      { title: 'Implement Action Item Gamification', impact: 70, effort: 40, type: 'Behavioral' },
    ]
  },
  'email-extraction': {
    purpose: 'Intelligence-powered extraction of key points, action items, and insights from email communications.',
    health: 91.2,
    learningMsg: 'Extracted 3 action items from "Client X" email thread.',
    signals: [
      { type: 'Operational', title: 'Email Processed: 1,420 today', severity: 1, confidence: 99, time: '30m ago' },
      { type: 'Risk', title: 'Ambiguous Action Item Detected', severity: 2, confidence: 82, time: '2h ago' },
    ],
    diagnosis: {
      surface: 'High extraction accuracy',
      immediate: 'NLP models performing well',
      systemic: 'Seamless integration with Action Items',
      structural: 'Scalable email ingestion'
    },
    advisory: [
      { title: 'Review Ambiguous Extractions', impact: 70, effort: 15, type: 'Quick Fix' },
      { title: 'Train NLP on Industry Jargon', impact: 85, effort: 45, type: 'Structural' },
    ]
  },
  'ai-audio-note-taker': {
    purpose: 'Autonomous intelligence system that joins calls, takes notes, and deploys action items.',
    health: 88.6,
    learningMsg: 'Transcribing "Weekly Sync" - detected 5 key decisions.',
    signals: [
      { type: 'Operational', title: 'Call Transcribed: Board Meeting', severity: 1, confidence: 97, time: '15m ago' },
      { type: 'Behavioral', title: 'High Speaker Clarity Detected', severity: 1, confidence: 94, time: '1h ago' },
    ],
    diagnosis: {
      surface: 'Accurate call transcription',
      immediate: 'Audio processing is low-latency',
      systemic: 'Strong synthesis of meeting notes',
      structural: 'Secure audio storage pipeline'
    },
    advisory: [
      { title: 'Deploy Note Taker to "Project X"', impact: 90, effort: 5, type: 'Quick Fix' },
      { title: 'Enable Multi-Language Support', impact: 80, effort: 60, type: 'Structural' },
    ]
  },
  'sop-library': {
    purpose: 'Centralized repository of standard operating procedures for organizational consistency.',
    health: 98.2,
    learningMsg: 'Optimizing "Employee Onboarding" SOP based on recent feedback.',
    signals: [
      { type: 'Operational', title: 'SOP Accessed: Financial Reporting', severity: 1, confidence: 100, time: '10m ago' },
      { type: 'Compliance', title: 'SOP Version Control Sync', severity: 1, confidence: 99, time: '1h ago' },
    ],
    diagnosis: {
      surface: 'High SOP compliance',
      immediate: 'Well-documented processes',
      systemic: 'Strong institutional knowledge',
      structural: 'Centralized process governance'
    },
    advisory: [
      { title: 'Update "Crisis Comm" SOP', impact: 85, effort: 20, type: 'Quick Fix' },
      { title: 'Audit All Financial SOPs', impact: 90, effort: 40, type: 'Compliance' },
    ]
  },
  'decision-log': {
    purpose: 'Comprehensive record of strategic decisions and their long-term outcomes.',
    health: 96.5,
    learningMsg: 'Tracking outcome of "Project Alpha" pivot decision.',
    signals: [
      { type: 'Strategic', title: 'Decision Logged: Q4 Budget Shift', severity: 1, confidence: 100, time: '30m ago' },
      { type: 'Outcome', title: 'Positive ROI on Q2 Marketing Decision', severity: 1, confidence: 94, time: '2d ago' },
    ],
    diagnosis: {
      surface: 'Clear decision trail',
      immediate: 'High accountability for choices',
      systemic: 'Data-driven decision culture',
      structural: 'Searchable strategic memory'
    },
    advisory: [
      { title: 'Review Q1 Decision Outcomes', impact: 88, effort: 30, type: 'Strategic' },
      { title: 'Link Decisions to OKR Progress', impact: 92, effort: 25, type: 'Structural' },
    ]
  }
};

export default function CoreSystemShell({ systemId, mode }: CoreSystemShellProps) {
  const data = SYSTEM_DATA[systemId] || {
    purpose: 'System details are being optimized.',
    health: 0,
    learningMsg: 'Analyzing system parameters...',
    signals: [],
    diagnosis: { surface: 'N/A', immediate: 'N/A', systemic: 'N/A', structural: 'N/A' },
    advisory: []
  };

  const systemName = systemId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  
  return (
    <div className="p-6 space-y-8 bg-white min-h-screen text-slate-900">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">
            {systemName}
          </h1>
          <p className="text-slate-500 font-mono text-xs mt-1 uppercase tracking-widest">
            Core Operating System | {mode.toUpperCase()}
          </p>
        </div>
        <div className="flex gap-4">
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-right shadow-sm">
            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">System Health</div>
            <div className="text-3xl font-black text-emerald-600">{data.health}</div>
          </div>
        </div>
      </div>

      {/* Top Row: Signals & Diagnostics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Signals Detection */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h2 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-slate-600">
              <Activity className="w-4 h-4 text-blue-600" />
              Signal Detection Engine
            </h2>
            <div className="flex gap-2">
              <button className="p-1.5 bg-white border border-slate-200 rounded hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-all shadow-sm"><Search className="w-4 h-4" /></button>
              <button className="p-1.5 bg-white border border-slate-200 rounded hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-all shadow-sm"><Settings className="w-4 h-4" /></button>
            </div>
          </div>
          <div className="p-4 space-y-4">
            {data.signals.map((signal, i) => (
              <div key={i} className="p-4 bg-white border border-slate-100 rounded-lg group hover:border-blue-500/30 transition-all cursor-pointer shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      signal.severity >= 4 ? "bg-red-500" : 
                      signal.severity >= 3 ? "bg-amber-500" : "bg-emerald-500"
                    )} />
                    <div>
                      <div className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-0.5">{signal.type}</div>
                      <h3 className="text-sm font-bold text-slate-900">{signal.title}</h3>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] text-slate-400 font-mono uppercase tracking-widest mb-1">Confidence</div>
                    <div className="text-xs font-black text-emerald-600">{signal.confidence}%</div>
                  </div>
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                  <span>SOURCE: SYSTEM_MONITOR_01</span>
                  <span>{signal.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Diagnosis Layer */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-slate-600">
              <Zap className="w-4 h-4 text-amber-500" />
              Diagnostic Intelligence
            </h2>
          </div>
          <div className="p-4 space-y-6">
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Root Cause Layers</h3>
              {[
                { label: 'Surface', value: data.diagnosis.surface },
                { label: 'Immediate', value: data.diagnosis.immediate },
                { label: 'Systemic', value: data.diagnosis.systemic },
                { label: 'Structural', value: data.diagnosis.structural },
              ].map((layer, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-16 text-[9px] font-black text-blue-600 uppercase tracking-widest pt-0.5">{layer.label}</div>
                  <div className="flex-1 text-xs text-slate-600 leading-tight">{layer.value}</div>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Framework Analysis</h3>
              <div className="flex flex-wrap gap-2">
                {['Lean', 'Six Sigma', 'TOC', 'PMBOK'].map(fw => (
                  <span key={fw} className="text-[9px] font-bold px-2 py-1 bg-slate-50 text-slate-500 rounded uppercase tracking-tighter border border-slate-100">{fw}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Advisory & Execution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Advisory Engine */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-slate-600">
              <Lightbulb className="w-4 h-4 text-emerald-600" />
              Advisory Engine
            </h2>
          </div>
          <div className="p-4 space-y-4">
            {data.advisory.map((action, i) => (
              <div key={i} className="p-4 bg-white border border-slate-100 rounded-lg flex gap-4 group hover:border-emerald-500/30 transition-all shadow-sm">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-bold text-slate-900">{action.title}</h3>
                    <span className="text-[9px] font-black px-1.5 py-0.5 bg-emerald-50 text-emerald-600 rounded uppercase tracking-widest border border-emerald-100">{action.type}</span>
                  </div>
                  <div className="flex gap-6 mt-3">
                    <div className="space-y-1">
                      <div className="text-[9px] text-slate-400 uppercase font-bold">Impact</div>
                      <div className="text-xs font-black text-emerald-600">{action.impact}%</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[9px] text-slate-400 uppercase font-bold">Effort</div>
                      <div className="text-xs font-black text-blue-600">{action.effort}%</div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-center gap-2">
                  <button className="p-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-all shadow-sm"><Play className="w-4 h-4" /></button>
                  <button className="p-2 bg-slate-50 text-slate-400 rounded hover:bg-slate-200 transition-all border border-slate-100"><MessageSquare className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Execution & Feedback */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-slate-600">
              <History className="w-4 h-4 text-purple-600" />
              Execution Feedback Loop
            </h2>
          </div>
          <div className="p-6 flex flex-col items-center justify-center text-center space-y-4 min-h-[200px]">
            <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center border border-purple-100">
              <BarChart3 className="w-6 h-6 text-purple-600 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-1 uppercase tracking-widest">System Learning Active</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                {data.learningMsg}
              </p>
            </div>
            <button className="text-[10px] font-black text-purple-600 uppercase tracking-widest border border-purple-200 px-4 py-2 rounded-full hover:bg-purple-50 transition-all">
              View Learning Graph
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
