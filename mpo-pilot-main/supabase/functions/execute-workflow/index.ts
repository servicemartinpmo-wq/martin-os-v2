import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import {
  clamp,
  handleCorsPreflight,
  restInsert,
  restPatch,
  restSelect,
  jsonResponse,
  rpc,
} from "../_shared/brain.ts";

/**
 * EXECUTE-WORKFLOW EDGE FUNCTION
 *
 * Executes workflow steps based on domain and decision output.
 * Supports state machine transitions with retry and fallback logic.
 *
 * Request format:
 * {
 *   domain: "pmo_ops" | "tech_ops" | "miidle",
 *   run_id: string,
 *   request_id: string,
 *   profile_id: string,
 *   decision: object,
 *   actions: array,
 *   workflow_id?: string
 * }
 *
 * Response format:
 * {
 *   run_id: string,
 *   workflow_run_id: string,
 *   state: string,
 *   attempt_count: number,
 *   outcome: {
 *     action_results: array,
 *     summary: string
 *   }
 * }
 */

serve(async (req) => {
  try {
    const preflight = handleCorsPreflight(req);
    if (preflight) return preflight;

    const body = await req.json();

    const domain = String(body?.domain ?? "pmo_ops");
    const runId = String(body?.run_id ?? "");
    const requestId = String(body?.request_id ?? "");
    const profileId = String(body?.profile_id ?? "");
    const decision = body?.decision ?? {};
    const actions = Array.isArray(body?.actions) ? body.actions : [];
    const workflowId = body?.workflow_id ? String(body.workflow_id) : "default";

    if (!profileId || !runId) {
      return jsonResponse({ error: "profile_id and run_id are required" }, 400);
    }

    // Get or create workflow run
    let workflowRun: any = null;

    // Check for existing workflow run
    const existing = await restSelect(
      `${domain}.workflow_runs`,
      `run_id=eq.${runId}&limit=1`
    );
    if (existing && existing.length > 0) {
      workflowRun = existing[0];
    } else {
      // Create new workflow run
      await restInsert(`${domain}.workflow_runs`, {
        run_id: runId,
        request_id: requestId,
        profile_id: profileId,
        workflow_key: workflowId,
        state: "queued",
        attempt_count: 0,
        timeline: JSON.stringify([
          {
            state: "queued",
            timestamp: new Date().toISOString(),
            message: "Workflow initialized",
          },
        ]),
      });

      const created = await restSelect(
        `${domain}.workflow_runs`,
        `run_id=eq.${runId}&limit=1`
      );
      workflowRun = created?.[0];
    }

    if (!workflowRun?.id) {
      return jsonResponse({ error: "Failed to create workflow run" }, 500);
    }

    // Update state to running
    await restPatch(
      `${domain}.workflow_runs`,
      `id=eq.${workflowRun.id}`,
      {
        state: "running",
        timeline: JSON.stringify([
          ...(Array.isArray(workflowRun.timeline) ? workflowRun.timeline : []),
          {
            state: "running",
            timestamp: new Date().toISOString(),
            message: "Executing workflow steps",
          },
        ]),
      }
    );

    // Execute actions
    const actionResults = [];
    let allSucceeded = true;

    for (const action of actions) {
      const actionResult = await executeAction(domain, action, profileId);
      actionResults.push(actionResult);

      if (actionResult.status === "failed") {
        allSucceeded = false;
        // Check if we should retry
        const currentAttempts = workflowRun.attempt_count + 1;
        const maxRetries = action.max_retries ?? 2;

        if (currentAttempts <= maxRetries) {
          // Retry with exponential backoff
          const delayMs = 1000 * Math.pow(2, currentAttempts - 1);
          await new Promise((resolve) => setTimeout(resolve, delayMs));

          await restPatch(
            `${domain}.workflow_runs`,
            `id=eq.${workflowRun.id}`,
            {
              state: "retrying",
              attempt_count: currentAttempts,
              last_error_code: actionResult.error_code,
              timeline: JSON.stringify([
                ...(Array.isArray(workflowRun.timeline) ? workflowRun.timeline : []),
                {
                  state: "retrying",
                  timestamp: new Date().toISOString(),
                  message: `Retrying action (attempt ${currentAttempts}/${maxRetries})`,
                },
              ]),
            }
          );

          // Retry the action
          const retryResult = await executeAction(domain, action, profileId);
          actionResults[actionResults.length - 1] = retryResult;

          if (retryResult.status === "failed") {
            // Fall back to backup path
            allSucceeded = false;
          } else {
            allSucceeded = true;
          }
        } else {
          // Fallback path
          await restPatch(
            `${domain}.workflow_runs`,
            `id=eq.${workflowRun.id}`,
            {
              state: "fallback",
              last_error_code: "MAX_RETRIES_EXCEEDED",
              timeline: JSON.stringify([
                ...(Array.isArray(workflowRun.timeline) ? workflowRun.timeline : []),
                {
                  state: "fallback",
                  timestamp: new Date().toISOString(),
                  message: "Max retries exceeded, using fallback path",
                },
              ]),
            }
          );
        }
        break;
      }
    }

    // Update final state
    const finalState = allSucceeded ? "completed" : "failed";

    await restPatch(
      `${domain}.workflow_runs`,
      `id=eq.${workflowRun.id}`,
      {
        state: finalState,
        timeline: JSON.stringify([
          ...(Array.isArray(workflowRun.timeline) ? workflowRun.timeline : []),
          {
            state: finalState,
            timestamp: new Date().toISOString(),
            message: `Workflow ${finalState}`,
          },
        ]),
      }
    );

    return jsonResponse({
      run_id: runId,
      workflow_run_id: workflowRun.id,
      state: finalState,
      attempt_count: workflowRun.attempt_count + 1,
      outcome: {
        action_results: actionResults,
        summary: allSucceeded
          ? "All actions completed successfully"
          : "One or more actions failed",
      },
    });
  } catch (error) {
    return jsonResponse({ error: String(error) }, 500);
  }
});

/**
 * Execute a single action
 */
async function executeAction(
  domain: string,
  action: any,
  profileId: string
): Promise<any> {
  const actionType = action?.type ?? "unknown";
  const actionTarget = action?.target ?? "";

  try {
    switch (actionType) {
      case "update_db":
        // Execute database update
        const table = action?.table ?? "";
        const recordId = action?.record_id ?? "";
        const updates = action?.updates ?? {};

        if (!table || !recordId) {
          throw new Error("update_db requires table and record_id");
        }

        await restPatch(
          `${domain}.${table}`,
          `id=eq.${recordId}`,
          updates
        );

        return {
          type: actionType,
          target: actionTarget,
          status: "success",
          timestamp: new Date().toISOString(),
        };

      case "call_api":
        // Call external API
        const apiUrl = action?.url ?? "";
        const apiMethod = action?.method ?? "POST";
        const apiBody = action?.body ?? {};

        if (!apiUrl) {
          throw new Error("call_api requires url");
        }

        const apiResponse = await fetch(apiUrl, {
          method: apiMethod,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(apiBody),
        });

        if (!apiResponse.ok) {
          throw new Error(`API call failed: ${apiResponse.statusText}`);
        }

        const apiData = await apiResponse.json();

        return {
          type: actionType,
          target: actionTarget,
          status: "success",
          data: apiData,
          timestamp: new Date().toISOString(),
        };

      case "send_notification":
        // Send notification (placeholder for notification system)
        return {
          type: actionType,
          target: actionTarget,
          status: "success",
          timestamp: new Date().toISOString(),
        };

      default:
        return {
          type: actionType,
          target: actionTarget,
          status: "skipped",
          message: `Unknown action type: ${actionType}`,
          timestamp: new Date().toISOString(),
        };
    }
  } catch (error) {
    return {
      type: actionType,
      target: actionTarget,
      status: "failed",
      error_code: "ACTION_FAILED",
      error_message: String(error),
      timestamp: new Date().toISOString(),
    };
  }
}
