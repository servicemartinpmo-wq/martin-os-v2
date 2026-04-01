
export interface PMOSystem {
  id: string;
  name: string;
  signals: string[];
  frameworks: string[];
  outputsTo: string[];
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  isActive?: boolean;
  description: string;
}

export const PMO_SYSTEMS: Record<string, PMOSystem> = {
  STRATEGIC_ALIGNMENT: {
    id: "SYS-001",
    name: "Strategic Alignment",
    signals: ["UNMAPPED_INITIATIVE", "KPI_CONFLICT"],
    frameworks: ["Balanced Scorecard", "OKR Alignment"],
    outputsTo: ["Dashboard", "Initiatives", "Reports"],
    severity: "High",
    isActive: true,
    description: "Ensures all initiatives map directly to top-level strategic objectives."
  },
  EXECUTION_DISCIPLINE: {
    id: "SYS-003",
    name: "Execution Discipline",
    signals: ["MILESTONE_MISS", "SOP_DEVIATION"],
    frameworks: ["Lean Operations", "Agile Governance"],
    outputsTo: ["Action Items", "Team"],
    severity: "High",
    isActive: true,
    description: "Monitors adherence to operational standards and milestone timelines."
  },
  PORTFOLIO_OPTIMIZATION: {
    id: "SYS-008",
    name: "Portfolio Optimization",
    signals: ["RESOURCE_OVERLOAD", "LOW_ROI_PROJECT"],
    frameworks: ["Modern Portfolio Theory", "Resource Leveling"],
    outputsTo: ["Dashboard", "Initiatives"],
    severity: "Medium",
    isActive: true,
    description: "Balances resource allocation across the project portfolio for maximum ROI."
  },
  LEADERSHIP_BANDWIDTH: {
    id: "SYS-013",
    name: "Leadership Bandwidth",
    signals: ["DECISION_DELAY", "EXCESS_APPROVALS"],
    frameworks: ["Span of Control", "Leadership Pipeline"],
    outputsTo: ["Team", "Departments"],
    severity: "Critical",
    isActive: true,
    description: "Identifies bottlenecks in decision-making and leadership capacity."
  },
  INITIATIVE_RECOVERY: {
    id: "SYS-018",
    name: "Initiative Recovery",
    signals: ["STALLED_PROJECT", "BUDGET_HEMORRHAGE"],
    frameworks: ["Turnaround Management", "Root Cause Analysis"],
    outputsTo: ["Action Items", "Reports"],
    severity: "Critical",
    isActive: false,
    description: "Triggers intervention protocols for projects at high risk of failure."
  },
  EXECUTIVE_INSIGHT: {
    id: "SYS-025",
    name: "Executive Insight",
    signals: ["MARKET_SHIFT", "COMPETITOR_MOVE"],
    frameworks: ["SWOT Analysis", "PESTEL"],
    outputsTo: ["Reports", "Dashboard"],
    severity: "Medium",
    isActive: true,
    description: "Synthesizes external market data with internal performance metrics."
  }
};

export const meetingReadinessSchema = {
  clarity: {
    objective_defined: false,
    agenda_created: false,
    decisions_listed: false
  },
  readiness: {
    pre_reads_attached: false,
    stakeholders_confirmed: false,
    updates_prepared: false
  },
  execution: {
    action_items_reviewed: false,
    notes_template_ready: false,
    followup_owner_assigned: false
  }
};
