import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import {
  jsonResponse,
  restInsert,
  restSelect,
} from "../_shared/brain.ts";

async function executeAllowedAction(
  action: Record<string, unknown>,
  profileId: string,
) {
  const toolName = String(action.tool_name ?? "");
  if (
    toolName === "plan_feature_bundle" ||
    toolName === "execute_workflow_bundle" ||
    toolName === "deploy_release_guarded"
  ) {
    return {
      tool_name: toolName,
      status: "executed",
      type: "virtual_orchestration",
      target: String(action.target ?? "brain_layer"),
      operator_instruction:
        String(action.operator_instruction ?? "Automation step executed in orchestrated mode."),
      metadata: {
        simulated: true,
        execution_mode: "safe_virtual",
      },
    };
  }
  if (!toolName) {
    return {
      status: "recommended",
      reason: "no_tool_name",
      operator_instruction: String(action.operator_instruction ?? "Follow recommended manual step."),
      action,
    };
  }
  const tools = await restSelect(
    "brain_tool_registry",
    `select=tool_type,target,active&profile_id=eq.${profileId}&tool_name=eq.${toolName}&active=eq.true&limit=1`,
  );
  const tool = tools?.[0] as { tool_type?: string; target?: string } | undefined;
  if (!tool?.tool_type || !tool?.target) {
    return {
      tool_name: toolName,
      status: "recommended",
      reason: "tool_not_allowlisted",
      operator_instruction: String(action.operator_instruction ?? "Manual execution required."),
      action,
    };
  }

  return {
    tool_name: toolName,
    status: "executed",
    type: tool.tool_type,
    target: tool.target,
    // Execution is intentionally constrained to allowlisted tools.
  };
}

function isAllowedByAgent(
  action: Record<string, unknown>,
  decision: Record<string, unknown>,
): { allowed: boolean; reason?: string } {
  const selectedAgentId = String(decision.selected_agent_id ?? "unified_orchestrator");
  const toolName = String(action.tool_name ?? "");
  const actionType = String(action.action_type ?? "");

  if (decision.governance_veto === true || selectedAgentId === "structural_remedy_governance_agent") {
    return { allowed: false, reason: "governance_veto_active" };
  }
  if (selectedAgentId === "pmo_ops_advisory_agent") {
    return { allowed: false, reason: "advisory_only_agent" };
  }
  if (selectedAgentId === "miidle_content_build_story_agent") {
    return { allowed: false, reason: "narrative_only_agent" };
  }
  if (selectedAgentId === "tech_ops_support_agent") {
    const isTechnicalAction =
      actionType === "diagnostic" ||
      actionType === "automation" ||
      toolName.includes("log") ||
      toolName.includes("deploy") ||
      toolName.includes("cache") ||
      toolName.includes("incident") ||
      toolName.includes("api") ||
      toolName.includes("restart");
    return isTechnicalAction
      ? { allowed: true }
      : { allowed: false, reason: "outside_tech_ops_scope" };
  }
  return { allowed: true };
}

serve(async (req) => {
  try {
    const body = await req.json();
    const runId = String(body?.run_id ?? "");
    const requestId = String(body?.request_id ?? "");
    const profileId = String(body?.profile_id ?? "");
    const decision = (body?.decision ?? {}) as Record<string, unknown>;
    if (!runId || !requestId || !profileId) {
      return jsonResponse({ error: "run_id, request_id, profile_id required" }, 400);
    }

    const decisionActions = Array.isArray(decision?.suggested_actions) ? decision.suggested_actions : [];
    const actions = Array.isArray(body?.actions) && body.actions.length > 0 ? body.actions : decisionActions;
    if (actions.length > 25) {
      return jsonResponse({ error: "actions exceeds max of 25" }, 400);
    }
    const actionResults: unknown[] = [];
    for (const rawAction of actions.slice(0, 10)) {
      if (typeof rawAction !== "object" || rawAction === null) continue;
      const action = rawAction as Record<string, unknown>;
      const guardrail = isAllowedByAgent(action, decision);
      if (!guardrail.allowed) {
        actionResults.push({
          tool_name: String(action.tool_name ?? ""),
          status: "recommended",
          reason: guardrail.reason ?? "blocked_by_agent_policy",
          operator_instruction:
            String(action.operator_instruction ?? "Action requires human approval or a different specialist agent."),
          action,
        });
        continue;
      }
      actionResults.push(await executeAllowedAction(action, profileId));
    }

    const outcome = {
      route: decision.route ?? "unknown",
      action_count: actions.length,
      action_results: actionResults,
      executed_count: actionResults.filter((r) => (r as Record<string, unknown>).status === "executed").length,
      recommended_count: actionResults.filter((r) => (r as Record<string, unknown>).status === "recommended").length,
      selected_agent_id: decision.selected_agent_id ?? "unified_orchestrator",
      governance_veto: decision.governance_veto ?? false,
      plain_english_protocol: decision.plain_english_protocol ?? {},
      completed_at: new Date().toISOString(),
    };

    await restInsert("brain_workflow_runs", {
      run_id: runId,
      profile_id: profileId,
      workflow_key: String(decision.route ?? "unknown"),
      state: "completed",
      attempt_count: 1,
      timeline: [
        { at: new Date().toISOString(), state: "running" },
        { at: new Date().toISOString(), state: "completed" },
      ],
    });

    await restInsert("brain_memory_logs", {
      run_id: runId,
      request_id: requestId,
      profile_id: profileId,
      stage: "execute",
      status: "completed",
      output_payload: outcome,
      decision_trace: decision,
    });

    return jsonResponse({ run_id: runId, outcome });
  } catch (error) {
    return jsonResponse({ error: String(error) }, 500);
  }
});
