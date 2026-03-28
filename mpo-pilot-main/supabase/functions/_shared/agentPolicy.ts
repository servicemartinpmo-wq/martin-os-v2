export type BrainInputType = "ticket" | "action" | "question" | "automation";

export type BrainDomain =
  | "tech_ops"
  | "pmo_ops"
  | "miidle"
  | "brain_layer";

export type BrainAgentId =
  | "tech_ops_support_agent"
  | "pmo_ops_advisory_agent"
  | "miidle_content_build_story_agent"
  | "structural_remedy_governance_agent"
  | "unified_orchestrator";

export type Json = Record<string, unknown>;

type AgentDefinition = {
  id: BrainAgentId;
  name: string;
  role: string;
  goal: string;
  backstory: string;
  responsibilities: string[];
  scope: string;
  guardrails: string[];
  domain: BrainDomain;
};

type EventAutomation = {
  id: string;
  name: string;
  trigger_type: "event";
  trigger_key: string;
  cadence: "realtime";
  domain: BrainDomain;
  workflow_key: string;
  primary_agent_id: BrainAgentId;
  collaborating_agent_ids: BrainAgentId[];
  objective: string;
  default_actions: string[];
};

type ScheduledAudit = {
  id: string;
  name: string;
  trigger_type: "schedule";
  cadence: "hourly" | "daily" | "weekly";
  schedule_utc: string;
  domain: BrainDomain;
  workflow_key: string;
  primary_agent_id: BrainAgentId;
  collaborating_agent_ids: BrainAgentId[];
  objective: string;
  default_checks: string[];
};

const AGENT_DEFINITIONS: Record<BrainAgentId, AgentDefinition> = {
  tech_ops_support_agent: {
    id: "tech_ops_support_agent",
    name: "The Tech-Ops Support Agent (Apphia Engine)",
    role: "Senior Systems Reliability & Support Engineer",
    goal: "Autonomously diagnose and remediate technical incidents using the 12-stage pipeline.",
    backstory:
      "Expert in the Ownership Stack (Supabase, Vercel, Node.js) with access to technical knowledge and logs.",
    responsibilities: [
      "Classify incidents as network, database, or application-level issues.",
      "Correlate incidents with the tech_ops knowledge base.",
      "Execute known low-risk technical remediations.",
      "Apply a plain-English diagnosis before technical execution.",
    ],
    scope: "Technical incidents and uptime-focused remediation only.",
    guardrails: [
      "Do not perform high-risk data-destructive actions without explicit human approval.",
      "Always provide plain-English diagnosis and proposed fix first.",
    ],
    domain: "tech_ops",
  },
  pmo_ops_advisory_agent: {
    id: "pmo_ops_advisory_agent",
    name: "The PMO-Ops Advisory Agent",
    role: "Strategic Operations Consultant",
    goal: "Monitor organizational health and provide framework-based advisory guidance.",
    backstory:
      "Trained on Porter, Rumelt, Balanced Scorecard, Lean, Six Sigma, and TOC for strategic alignment.",
    responsibilities: [
      "Detect capacity overloads, delays, and risk escalation.",
      "Run root-cause analysis for maturity score drops.",
      "Recommend resource and timeline adjustments.",
    ],
    scope: "Operational efficiency and strategic alignment guidance only.",
    guardrails: [
      "Do not execute technical code fixes.",
      "Produce advisory outputs as recommendations, not autonomous system modifications.",
    ],
    domain: "pmo_ops",
  },
  miidle_content_build_story_agent: {
    id: "miidle_content_build_story_agent",
    name: 'The "miidle" Content & Build Story Agent',
    role: "Execution Capture & Narrative Architect",
    goal: "Transform technical and PMO updates into structured Build Stories and multi-format content.",
    backstory:
      "Specialist in proof-of-work documentation and timeline-based storytelling from real execution data.",
    responsibilities: [
      "Capture major workflow changes into the work graph.",
      "Generate scripts, write-ups, and visual timelines from live work.",
      "Tag skills and milestones for proof-of-work portfolios.",
    ],
    scope: "Observe, structure, and report work output only.",
    guardrails: [
      "Do not make execution decisions.",
      "Do not autonomously approve or deny remediation actions.",
    ],
    domain: "miidle",
  },
  structural_remedy_governance_agent: {
    id: "structural_remedy_governance_agent",
    name: "The Structural Remedy (Governance) Agent",
    role: "Corporate Governance & Compliance Officer",
    goal: "Ensure long-term remedies remain compliant with regulations and governance principles.",
    backstory:
      "Expert in ISO/IEC 38500, GDPR, and SOX with authority to block risky autonomous actions.",
    responsibilities: [
      "Audit structural remedies for compliance fit.",
      "Flag security/privacy protocol violations.",
      "Validate RLS, triggers, and publication integrity for data isolation.",
    ],
    scope: "Compliance and risk governance gatekeeping.",
    guardrails: [
      "Veto autonomous actions that exceed risk thresholds.",
      "Route governance-sensitive requests to mandatory human review.",
    ],
    domain: "brain_layer",
  },
  unified_orchestrator: {
    id: "unified_orchestrator",
    name: "The Unified Orchestrator (The Brain Layer)",
    role: "Master System Coordinator",
    goal: "Route inputs to the correct domain agent and ensure seamless handoff.",
    backstory:
      "Central thinking engine that manages cross-domain context and deterministic communications.",
    responsibilities: [
      "Classify input as ticket, action, question, or automation.",
      "Assemble the correct context pack and hand off to specialist agents.",
      "Validate plain-language output before operator delivery.",
      "Enforce deterministic JSON ordering for system-to-system output.",
    ],
    scope: "Cross-agent routing and consistency enforcement.",
    guardrails: [
      "Do not bypass governance checks for risky actions.",
      "Keep routing deterministic and schema-conformant.",
    ],
    domain: "brain_layer",
  },
};

const BRAIN_LAYER_SECTION_ORDER: string[] = [
  "SECTION 1 — INPUT CLASSIFICATION SYSTEM",
  "SECTION 2 — CONTEXT RETRIEVAL SYSTEM (RAG)",
  "SECTION 3 — DECISION ENGINE",
  "SECTION 4 — FRAMEWORK EXECUTION MODEL",
  "SECTION 5 — WORKFLOW ENGINE",
  "SECTION 6 — MEMORY + LEARNING SYSTEM",
  "SECTION 7 — FULL SYSTEM FLOW",
];

const EVENT_AUTOMATIONS: EventAutomation[] = [
  {
    id: "evt_tech_incident_247",
    name: "Tech incident auto-remediation loop",
    trigger_type: "event",
    trigger_key: "tech.incident.detected",
    cadence: "realtime",
    domain: "tech_ops",
    workflow_key: "tech_incident_response",
    primary_agent_id: "tech_ops_support_agent",
    collaborating_agent_ids: [
      "unified_orchestrator",
      "structural_remedy_governance_agent",
      "miidle_content_build_story_agent",
    ],
    objective:
      "Diagnose and remediate incidents continuously while preserving auditability and plain-language status updates.",
    default_actions: [
      "classify_incident_surface",
      "collect_runtime_evidence",
      "execute_allowlisted_remediation",
      "publish_plain_english_status",
    ],
  },
  {
    id: "evt_pmo_capacity_risk",
    name: "Capacity overload response",
    trigger_type: "event",
    trigger_key: "pmo.capacity.overload",
    cadence: "realtime",
    domain: "pmo_ops",
    workflow_key: "pmo_new_request",
    primary_agent_id: "pmo_ops_advisory_agent",
    collaborating_agent_ids: [
      "unified_orchestrator",
      "structural_remedy_governance_agent",
      "miidle_content_build_story_agent",
    ],
    objective:
      "Detect and respond to execution pressure with advisory recommendations and strategic realignment.",
    default_actions: [
      "analyze_capacity_drift",
      "recommend_resource_reallocation",
      "propose_timeline_adjustments",
      "capture_advisory_story",
    ],
  },
  {
    id: "evt_build_story_capture",
    name: "Build-story capture on execution milestones",
    trigger_type: "event",
    trigger_key: "miidle.execution.milestone_completed",
    cadence: "realtime",
    domain: "miidle",
    workflow_key: "miidle_task_processing",
    primary_agent_id: "miidle_content_build_story_agent",
    collaborating_agent_ids: ["unified_orchestrator", "pmo_ops_advisory_agent"],
    objective:
      "Translate completed execution work into proof-of-work outputs across feed, timeline, and portfolio channels.",
    default_actions: [
      "capture_execution_delta",
      "generate_build_story",
      "tag_skills_and_milestones",
      "publish_spectator_update",
    ],
  },
  {
    id: "evt_governance_policy_breach",
    name: "Governance breach gate",
    trigger_type: "event",
    trigger_key: "governance.policy.breach_detected",
    cadence: "realtime",
    domain: "brain_layer",
    workflow_key: "governance_veto",
    primary_agent_id: "structural_remedy_governance_agent",
    collaborating_agent_ids: ["unified_orchestrator", "tech_ops_support_agent"],
    objective:
      "Stop non-compliant autonomous actions and enforce mandatory review and risk controls.",
    default_actions: [
      "freeze_high_risk_execution",
      "run_compliance_integrity_checks",
      "require_human_approval",
      "log_veto_decision",
    ],
  },
];

const SCHEDULED_AUDITS: ScheduledAudit[] = [
  {
    id: "sch_tech_uptime_hourly",
    name: "Hourly uptime and dependency audit",
    trigger_type: "schedule",
    cadence: "hourly",
    schedule_utc: "0 * * * *",
    domain: "tech_ops",
    workflow_key: "tech_alert_handling",
    primary_agent_id: "tech_ops_support_agent",
    collaborating_agent_ids: ["unified_orchestrator", "structural_remedy_governance_agent"],
    objective:
      "Maintain 24/7 service reliability through recurring health checks and preventive interventions.",
    default_checks: [
      "api_sli_thresholds",
      "database_latency_window",
      "error_rate_anomaly",
      "recent_deployment_regression",
    ],
  },
  {
    id: "sch_pmo_maturity_daily",
    name: "Daily maturity and delivery audit",
    trigger_type: "schedule",
    cadence: "daily",
    schedule_utc: "0 6 * * *",
    domain: "pmo_ops",
    workflow_key: "pmo_new_request",
    primary_agent_id: "pmo_ops_advisory_agent",
    collaborating_agent_ids: ["unified_orchestrator", "miidle_content_build_story_agent"],
    objective:
      "Run structured daily operational audits to catch misalignment, risk escalation, and delivery slippage.",
    default_checks: [
      "department_maturity_score_delta",
      "capacity_overload_signal",
      "initiative_delay_risk",
      "resource_allocation_fit",
    ],
  },
  {
    id: "sch_governance_daily",
    name: "Daily governance and data isolation audit",
    trigger_type: "schedule",
    cadence: "daily",
    schedule_utc: "30 6 * * *",
    domain: "brain_layer",
    workflow_key: "governance_audit",
    primary_agent_id: "structural_remedy_governance_agent",
    collaborating_agent_ids: ["unified_orchestrator", "tech_ops_support_agent"],
    objective:
      "Verify RLS, triggers, and security controls remain compliant and enforce corrective vetoes when needed.",
    default_checks: [
      "rls_policy_integrity",
      "trigger_execution_consistency",
      "publication_scope_isolation",
      "privacy_control_compliance",
    ],
  },
  {
    id: "sch_cross_agent_weekly",
    name: "Weekly cross-agent orchestration audit",
    trigger_type: "schedule",
    cadence: "weekly",
    schedule_utc: "0 7 * * 1",
    domain: "brain_layer",
    workflow_key: "cross_agent_review",
    primary_agent_id: "unified_orchestrator",
    collaborating_agent_ids: [
      "tech_ops_support_agent",
      "pmo_ops_advisory_agent",
      "miidle_content_build_story_agent",
      "structural_remedy_governance_agent",
    ],
    objective:
      "Review handoff quality, action outcomes, and policy adherence across all agents.",
    default_checks: [
      "handoff_determinism",
      "plain_language_compliance",
      "execution_success_rate",
      "governance_veto_false_negative_scan",
    ],
  },
];

function containsAny(text: string, keywords: string[]): boolean {
  return keywords.some((word) => text.includes(word));
}

function inferInputType(rawType: unknown, input: string): BrainInputType {
  const normalizedType = String(rawType ?? "").toLowerCase();
  if (normalizedType === "ticket" || normalizedType === "action" || normalizedType === "question" || normalizedType === "automation") {
    return normalizedType;
  }
  if (input.includes("?")) return "question";
  if (containsAny(input, ["automate", "workflow", "schedule", "trigger"])) return "automation";
  if (containsAny(input, ["fix", "resolve", "restart", "patch", "update"])) return "action";
  return "ticket";
}

export function normalizeDomainHint(rawDomain: unknown): BrainDomain | null {
  const domain = String(rawDomain ?? "").toLowerCase().trim();
  if (!domain) return null;
  if (domain === "tech_ops" || domain === "tech") return "tech_ops";
  if (domain === "pmo_ops" || domain === "pmo") return "pmo_ops";
  if (domain === "miidle" || domain === "ops") return "miidle";
  if (domain === "general" || domain === "brain_layer") return "brain_layer";
  return null;
}

export function toClassifierDomain(domain: BrainDomain): "tech" | "pmo" | "ops" | "general" {
  if (domain === "tech_ops") return "tech";
  if (domain === "pmo_ops") return "pmo";
  if (domain === "miidle") return "ops";
  return "general";
}

export function selectPrimaryAgent(
  inputText: string,
  classification: Json = {},
  explicitDomainHint: BrainDomain | null = null,
) {
  const input = inputText.toLowerCase();
  const inputType = inferInputType(classification.type, input);
  const classificationDomain = normalizeDomainHint(classification.domain);
  const domainHint = explicitDomainHint ?? classificationDomain;

  const governanceKeywords = [
    "gdpr",
    "sox",
    "iso",
    "compliance",
    "privacy",
    "audit",
    "rls",
    "governance",
    "policy violation",
    "security risk",
  ];
  if (containsAny(input, governanceKeywords)) {
    const primary = AGENT_DEFINITIONS.structural_remedy_governance_agent;
    return {
      input_type: inputType,
      primary,
      secondary: [AGENT_DEFINITIONS.unified_orchestrator],
      rationale: "Detected governance/compliance-sensitive intent requiring a policy gate.",
    };
  }

  const miidleKeywords = [
    "build story",
    "proof-of-work",
    "write-up",
    "timeline",
    "video script",
    "spectator feed",
    "portfolio",
    "content recap",
    "changelog narrative",
  ];
  if (domainHint === "miidle" || containsAny(input, miidleKeywords)) {
    const primary = AGENT_DEFINITIONS.miidle_content_build_story_agent;
    return {
      input_type: inputType,
      primary,
      secondary: [AGENT_DEFINITIONS.unified_orchestrator],
      rationale: "Detected execution-storytelling and documentation intent.",
    };
  }

  const techKeywords = [
    "error",
    "incident",
    "outage",
    "timeout",
    "500",
    "database",
    "network",
    "cache",
    "deploy",
    "api",
    "latency",
    "crash",
  ];
  if (domainHint === "tech_ops" || containsAny(input, techKeywords)) {
    const primary = AGENT_DEFINITIONS.tech_ops_support_agent;
    return {
      input_type: inputType,
      primary,
      secondary: [AGENT_DEFINITIONS.unified_orchestrator, AGENT_DEFINITIONS.structural_remedy_governance_agent],
      rationale: "Detected technical incident/remediation intent.",
    };
  }

  const pmoKeywords = [
    "capacity",
    "timeline",
    "execution delay",
    "maturity score",
    "resource allocation",
    "balanced scorecard",
    "rumelt",
    "porter",
    "lean",
    "six sigma",
    "toc",
    "strategic alignment",
  ];
  if (domainHint === "pmo_ops" || containsAny(input, pmoKeywords)) {
    const primary = AGENT_DEFINITIONS.pmo_ops_advisory_agent;
    return {
      input_type: inputType,
      primary,
      secondary: [AGENT_DEFINITIONS.unified_orchestrator],
      rationale: "Detected PMO operations advisory intent.",
    };
  }

  const primary = AGENT_DEFINITIONS.unified_orchestrator;
  return {
    input_type: inputType,
    primary,
    secondary: [AGENT_DEFINITIONS.structural_remedy_governance_agent],
    rationale: "Fell back to orchestrator for deterministic routing.",
  };
}

export function buildPlainEnglishProtocol(primaryAgentId: BrainAgentId, inputText: string) {
  const input = inputText.trim();
  if (primaryAgentId === "tech_ops_support_agent") {
    return {
      problem_summary:
        "This looks like a technical reliability issue that can impact uptime or service quality.",
      proposed_fix:
        "First gather evidence (logs, recent deploy changes, dependency health), then apply the safest known remediation path.",
      plain_english_note:
        "We will explain what happened in simple terms before any technical action is taken.",
      input_echo: input.slice(0, 220),
    };
  }
  if (primaryAgentId === "pmo_ops_advisory_agent") {
    return {
      problem_summary:
        "This looks like an operations or execution alignment issue rather than a software defect.",
      proposed_fix:
        "Use framework-based diagnosis to identify bottlenecks, then recommend priority, resource, and timeline adjustments.",
      plain_english_note:
        "This agent gives advisory guidance only and does not make technical code changes.",
      input_echo: input.slice(0, 220),
    };
  }
  if (primaryAgentId === "miidle_content_build_story_agent") {
    return {
      problem_summary:
        "This request is about documenting and packaging work into a clear execution story.",
      proposed_fix:
        "Capture key changes, milestones, and outcomes, then produce structured proof-of-work artifacts.",
      plain_english_note:
        "This agent observes and reports; it does not decide remediation actions.",
      input_echo: input.slice(0, 220),
    };
  }
  if (primaryAgentId === "structural_remedy_governance_agent") {
    return {
      problem_summary:
        "This request has compliance or governance risk that needs strict checks before execution.",
      proposed_fix:
        "Pause autonomous changes, run integrity checks, and require human confirmation for high-risk actions.",
      plain_english_note:
        "This safeguard can veto actions that exceed defined risk thresholds.",
      input_echo: input.slice(0, 220),
    };
  }
  return {
    problem_summary:
      "This request needs coordinated routing so the right specialist handles each part safely.",
    proposed_fix:
      "Classify the request, assemble the context pack, and hand it to the appropriate domain agent.",
    plain_english_note:
      "All system-to-system responses keep fixed JSON ordering and plain operator language.",
    input_echo: input.slice(0, 220),
  };
}

export function buildAgentPolicyPayload(inputText: string, classification: Json = {}, explicitDomainHint: BrainDomain | null = null) {
  const selected = selectPrimaryAgent(inputText, classification, explicitDomainHint);
  const plainEnglish = buildPlainEnglishProtocol(selected.primary.id, inputText);

  return {
    section_order: BRAIN_LAYER_SECTION_ORDER,
    rgbs_framework: {
      R_role: selected.primary.role,
      G_goal: selected.primary.goal,
      B_boundaries: selected.primary.guardrails,
      S_safeguards: [
        "Deterministic JSON ordering for machine output.",
        "Non-technical language for operator output.",
        "Governance review for high-risk actions.",
      ],
    },
    selected_agent: {
      id: selected.primary.id,
      name: selected.primary.name,
      role: selected.primary.role,
      goal: selected.primary.goal,
      backstory: selected.primary.backstory,
      responsibilities: selected.primary.responsibilities,
      scope: selected.primary.scope,
      guardrails: selected.primary.guardrails,
      domain: selected.primary.domain,
    },
    secondary_agents: selected.secondary.map((agent) => ({
      id: agent.id,
      name: agent.name,
      role: agent.role,
      domain: agent.domain,
    })),
    input_type: selected.input_type,
    rationale: selected.rationale,
    plain_english_protocol: plainEnglish,
  };
}

export function buildOperationalAutomationMap() {
  return {
    operating_mode: "24x7_continuous_operations",
    event_automations: EVENT_AUTOMATIONS,
    scheduled_audits: SCHEDULED_AUDITS,
    handoff_order: [
      "unified_orchestrator",
      "domain_specialist",
      "structural_remedy_governance_agent",
      "miidle_content_build_story_agent",
    ],
  };
}

function chooseCollaborationStages(primaryAgentId: BrainAgentId) {
  if (primaryAgentId === "tech_ops_support_agent") {
    return [
      "orchestrator_intake",
      "tech_ops_diagnose",
      "tech_ops_execute_allowlisted_fix",
      "governance_guardrail_check",
      "miidle_capture_build_story",
      "operator_plain_english_closeout",
    ];
  }
  if (primaryAgentId === "pmo_ops_advisory_agent") {
    return [
      "orchestrator_intake",
      "pmo_signal_detection",
      "pmo_framework_root_cause",
      "pmo_advisory_recommendation",
      "governance_guardrail_check",
      "miidle_capture_build_story",
      "operator_plain_english_closeout",
    ];
  }
  if (primaryAgentId === "miidle_content_build_story_agent") {
    return [
      "orchestrator_intake",
      "miidle_capture_execution",
      "miidle_generate_story_assets",
      "governance_guardrail_check",
      "operator_plain_english_closeout",
    ];
  }
  if (primaryAgentId === "structural_remedy_governance_agent") {
    return [
      "orchestrator_intake",
      "governance_risk_assessment",
      "governance_veto_or_approve",
      "operator_plain_english_closeout",
    ];
  }
  return [
    "orchestrator_intake",
    "route_to_specialist",
    "governance_guardrail_check",
    "operator_plain_english_closeout",
  ];
}

function inferEventKey(input: string): string {
  if (
    containsAny(input, [
      "incident",
      "error",
      "outage",
      "500",
      "timeout",
      "api",
      "database",
      "cache",
      "deploy",
    ])
  ) {
    return "tech.incident.detected";
  }
  if (containsAny(input, ["capacity", "overload", "delay", "maturity", "risk escalation"])) {
    return "pmo.capacity.overload";
  }
  if (containsAny(input, ["build story", "proof-of-work", "milestone", "timeline", "portfolio update"])) {
    return "miidle.execution.milestone_completed";
  }
  if (containsAny(input, ["gdpr", "sox", "iso", "compliance", "privacy", "governance", "rls"])) {
    return "governance.policy.breach_detected";
  }
  return "none";
}

export function buildOperationalAutomationPlan(
  inputText: string,
  selectedAgentId: BrainAgentId,
  selectedDomain: BrainDomain,
) {
  const input = inputText.toLowerCase();
  const automationMap = buildOperationalAutomationMap();
  const inferredEventKey = inferEventKey(input);
  const eventMatches = automationMap.event_automations.filter((automation) => {
    if (inferredEventKey !== "none") return automation.trigger_key === inferredEventKey;
    return automation.primary_agent_id === selectedAgentId || automation.domain === selectedDomain;
  });
  const scheduledAudits = automationMap.scheduled_audits.filter((audit) => {
    return audit.domain === selectedDomain || audit.domain === "brain_layer";
  });

  return {
    mode: automationMap.operating_mode,
    inferred_event_key: inferredEventKey,
    event_matches: eventMatches,
    scheduled_audits: scheduledAudits,
    collaboration_stages: chooseCollaborationStages(selectedAgentId),
    execution_contract: {
      think_phase_owner: selectedAgentId,
      execute_phase_owner:
        selectedAgentId === "pmo_ops_advisory_agent" ||
        selectedAgentId === "miidle_content_build_story_agent"
          ? "unified_orchestrator"
          : selectedAgentId,
      governance_gate: "structural_remedy_governance_agent",
      storytelling_owner: "miidle_content_build_story_agent",
    },
  };
}
