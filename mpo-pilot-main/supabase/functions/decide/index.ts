import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import {
  clamp,
  chooseModel,
  jsonResponse,
  restInsert,
  restPatch,
} from "../_shared/brain.ts";
import {
  buildAgentPolicyPayload,
  buildOperationalAutomationPlan,
  normalizeDomainHint,
} from "../_shared/agentPolicy.ts";

function priorityScore(impact: number, urgency: number, value: number): number {
  return clamp(100 * (0.5 * impact + 0.3 * urgency + 0.2 * value), 0, 100);
}

function riskScore(likelihood: number, severity: number): number {
  return clamp(100 * (0.6 * likelihood + 0.4 * severity), 0, 100);
}

function confidenceScore(evidence: number, missingFields: number, conflicts: number): number {
  return clamp(evidence - missingFields * 0.08 - conflicts, 0, 1);
}

function resolveRequestType(
  classification: Record<string, unknown>,
  input: string,
): "ticket" | "action" | "question" | "automation" {
  const fromClassifier = String(classification.type ?? "").toLowerCase();
  if (
    fromClassifier === "ticket" ||
    fromClassifier === "action" ||
    fromClassifier === "question" ||
    fromClassifier === "automation"
  ) {
    return fromClassifier as "ticket" | "action" | "question" | "automation";
  }

  const normalized = input.toLowerCase();
  if (
    normalized.includes("automate") ||
    normalized.includes("workflow") ||
    normalized.includes("scheduled audit") ||
    normalized.includes("24/7") ||
    normalized.includes("deploy all features")
  ) {
    return "automation";
  }
  if (normalized.includes("?")) return "question";
  if (normalized.includes("fix") || normalized.includes("deploy") || normalized.includes("execute")) {
    return "action";
  }
  return "ticket";
}

function buildSuggestedActions(
  input: string,
  route: string,
  selectedAgentId: string,
): Record<string, unknown>[] {
  const normalized = input.toLowerCase();
  if (route === "automation_workflow") {
    return [
      {
        step_id: "AUT1",
        tool_name: "plan_feature_bundle",
        action_type: "automation",
        target: "feature_rollout",
        data: {
          deployment_mode: selectedAgentId === "tech_ops_support_agent" ? "guarded" : "advisory",
        },
        operator_instruction: "Create a rollout plan for features, workflows, and linked actions.",
      },
      {
        step_id: "AUT2",
        tool_name: "execute_workflow_bundle",
        action_type: "automation",
        target: "workflow_engine",
        data: {
          include_audits: true,
          include_event_automations: true,
        },
        operator_instruction: "Execute the approved workflow bundle for continuous operations.",
      },
      {
        step_id: "AUT3",
        tool_name: "deploy_release_guarded",
        action_type: "automation",
        target: "release_pipeline",
        data: {
          require_governance_gate: true,
          publish_build_story: true,
        },
        operator_instruction: "Deploy through guarded release checks and publish execution story updates.",
      },
    ];
  }
  if (route !== "diagnostic_workflow") return [];

  if (normalized.includes("500") || (normalized.includes("api") && normalized.includes("error"))) {
    return [
      {
        step_id: "A1",
        tool_name: "collect_api_logs",
        action_type: "diagnostic",
        target: "api_gateway",
        data: { window_minutes: 15, include_status_codes: [500, 502, 503, 504] },
        operator_instruction: "Collect API logs for the last 15 minutes focused on 5xx errors.",
      },
      {
        step_id: "A2",
        tool_name: "check_recent_deployments",
        action_type: "diagnostic",
        target: "deployments",
        data: { lookback_hours: 24 },
        operator_instruction: "Check if a recent deployment correlates with error spike timing.",
      },
      {
        step_id: "A3",
        tool_name: "create_incident_ticket",
        action_type: "workflow",
        target: "incident_queue",
        data: {
          severity: "high",
          title: "API returning 500 errors",
          runbook: "api_500_triage_v1",
        },
        operator_instruction: "Create a high-priority incident and attach collected evidence.",
      },
    ];
  }

  return [
    {
      step_id: "A1",
      tool_name: "create_triage_note",
      action_type: "workflow",
      target: "triage",
      data: { summary: "General triage requested." },
      operator_instruction: "Create a triage note and gather first-pass evidence.",
    },
  ];
}

serve(async (req) => {
  try {
    const body = await req.json();
    const runId = String(body?.run_id ?? "");
    const requestId = String(body?.request_id ?? "");
    const profileId = String(body?.profile_id ?? "");
    const classification = (body?.classification ?? {}) as Record<string, unknown>;
    const contextPack = (body?.context_pack ?? {}) as Record<string, unknown>;
    const input = String(body?.input ?? "");
    if (!runId || !requestId || !profileId) {
      return jsonResponse({ error: "run_id, request_id, profile_id required" }, 400);
    }

    const impact = Number(body?.impact ?? 0.7);
    const urgency = Number(body?.urgency ?? (classification.priority === "high" ? 0.9 : 0.5));
    const businessValue = Number(body?.business_value ?? 0.6);
    const likelihood = Number(body?.likelihood ?? 0.5);
    const severity = Number(body?.severity ?? 0.6);
    const evidenceCoverage = Number(body?.evidence_coverage ?? 0.8);
    const missingFields = Number(body?.missing_fields ?? 0);
    const conflictPenalty = Number(body?.conflict_penalty ?? 0);

    const priority = priorityScore(impact, urgency, businessValue);
    const risk = riskScore(likelihood, severity);
    const confidence = confidenceScore(evidenceCoverage, missingFields, conflictPenalty);

    const explicitDomainHint = normalizeDomainHint(body?.domain);
    const agentPolicy = buildAgentPolicyPayload(
      input,
      classification as Record<string, unknown>,
      explicitDomainHint,
    );
    const model = chooseModel({ ...classification, confidence });
    const requestType = resolveRequestType(classification, input);
    const route = confidence < 0.6
      ? "human_review"
      : requestType === "ticket"
      ? "diagnostic_workflow"
      : requestType === "action"
      ? "execution_workflow"
      : requestType === "automation"
      ? "automation_workflow"
      : "triage_workflow";
    const selectedAgent = (agentPolicy.selected_agent ?? {}) as Record<string, unknown>;
    const selectedAgentId = String(selectedAgent.id ?? "unified_orchestrator");
    const isGovernance = selectedAgentId === "structural_remedy_governance_agent";
    const suggestedActions = buildSuggestedActions(input, route, selectedAgentId);
    const scopedActions = suggestedActions.filter((action) => {
      const toolName = String(action.tool_name ?? "");
      if (selectedAgentId === "pmo_ops_advisory_agent") return false;
      if (selectedAgentId === "miidle_content_build_story_agent") return false;
      if (isGovernance) return false;
      if (selectedAgentId === "tech_ops_support_agent") return toolName !== "create_triage_note";
      return true;
    });
    const selectedDomainHint = String(selectedAgent.domain ?? "brain_layer");
    const selectedDomain =
      selectedDomainHint === "tech_ops" ||
      selectedDomainHint === "pmo_ops" ||
      selectedDomainHint === "miidle" ||
      selectedDomainHint === "brain_layer"
        ? selectedDomainHint
        : "brain_layer";
    const operationalAutomationPlan = buildOperationalAutomationPlan(
      input,
      selectedAgentId as
        | "tech_ops_support_agent"
        | "pmo_ops_advisory_agent"
        | "miidle_content_build_story_agent"
        | "structural_remedy_governance_agent"
        | "unified_orchestrator",
      selectedDomain as "tech_ops" | "pmo_ops" | "miidle" | "brain_layer",
    );

    const decision = {
      route: isGovernance ? "human_review" : route,
      request_type: requestType,
      chosen_model: model,
      priority_score: priority,
      risk_score: risk,
      confidence_score: confidence,
      suggested_actions: scopedActions,
      selected_agent_id: selectedAgentId,
      selected_agent_role: String(selectedAgent.role ?? ""),
      selected_agent_domain: String(selectedAgent.domain ?? ""),
      governance_veto: isGovernance,
      plain_english_protocol: agentPolicy.plain_english_protocol,
      agent_policy: agentPolicy,
      operational_automation_plan: operationalAutomationPlan,
      execution_order: ["classify", "retrieve_context", "decide", "execute", "store_result"],
    };

    await restInsert("brain_decision_runs", {
      run_id: runId,
      profile_id: profileId,
      classification,
      context_pack: contextPack,
      decision,
      priority_score: priority,
      risk_score: risk,
      confidence_score: confidence,
    });

    await restInsert("brain_memory_logs", {
      run_id: runId,
      request_id: requestId,
      profile_id: profileId,
      stage: "decide",
      status: "completed",
      output_payload: decision,
      decision_trace: decision,
      chosen_model: model,
      confidence,
    });

    await restPatch("brain_runs", `id=eq.${runId}`, {
      chosen_model: model,
      confidence,
      state: route === "human_review" || isGovernance ? "waiting_review" : "running",
    });

    return jsonResponse({ run_id: runId, decision });
  } catch (error) {
    return jsonResponse({ error: String(error) }, 500);
  }
});
