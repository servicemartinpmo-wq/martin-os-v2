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
      actionResults.push(await executeAllowedAction(rawAction as Record<string, unknown>, profileId));
    }

    const outcome = {
      route: decision.route ?? "unknown",
      action_count: actions.length,
      action_results: actionResults,
      executed_count: actionResults.filter((r) => (r as Record<string, unknown>).status === "executed").length,
      recommended_count: actionResults.filter((r) => (r as Record<string, unknown>).status === "recommended").length,
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
