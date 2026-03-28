import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import {
  handleCorsPreflight,
  invokeFunction,
  jsonResponse,
} from "../_shared/brain.ts";
import { buildAgentPolicyPayload, normalizeDomainHint } from "../_shared/agentPolicy.ts";

/**
 * ORCHESTRATE-DOMAIN EDGE FUNCTION
 *
 * Routes requests to the appropriate domain brain layer:
 * - pmo_ops: Project/Program Management operations
 * - tech_ops: Technical Operations
 * - miiddle: Market Intelligence/Data operations
 *
 * Request format:
 * {
 *   domain: "pmo_ops" | "tech_ops" | "miiddle",
 *   request_id: string,
 *   profile_id: string,
 *   organization_id?: string,
 *   input: string,
 *   actions?: array,
 *   workflow_id?: string
 * }
 *
 * Response format:
 * {
 *   request_id: string,
 *   run_id: string,
 *   state: "queued" | "running" | "waiting_review" | "retrying" | "completed" | "failed" | "fallback",
 *   domain: string,
 *   eta_seconds: number,
 *   machine_view: object,
 *   operator_view: object
 * }
 */

serve(async (req) => {
  try {
    const preflight = handleCorsPreflight(req);
    if (preflight) return preflight;

    const idempotencyKey = req.headers.get("x-idempotency-key");
    const body = await req.json();

    const domain = String(body?.domain ?? "pmo_ops");
    const requestId = String(body?.request_id ?? crypto.randomUUID());
    const profileId = String(body?.profile_id ?? "");
    const organizationId = body?.organization_id ? String(body.organization_id) : null;
    const input = String(body?.input ?? "");
    const actions = Array.isArray(body?.actions) ? body.actions : [];
    const workflowId = body?.workflow_id ? String(body.workflow_id) : null;

    // Validate domain
    if (!["pmo_ops", "tech_ops", "miidle"].includes(domain)) {
      return jsonResponse(
        { error: `Invalid domain: ${domain}. Must be one of: pmo_ops, tech_ops, miidle` },
        400
      );
    }

    if (!profileId || !input) {
      return jsonResponse({ error: "profile_id and input are required" }, 400);
    }

    if (!idempotencyKey || idempotencyKey !== requestId) {
      return jsonResponse(
        { error: "x-idempotency-key header must equal request_id" },
        400
      );
    }

    if (actions.length > 25) {
      return jsonResponse({ error: "actions exceeds max of 25" }, 400);
    }

    // Step 1: Classify input using domain-specific classifier
    const classified = await invokeFunction("classifier", {
      domain,
      request_id: requestId,
      profile_id: profileId,
      organization_id: organizationId,
      input,
    });
    const explicitDomainHint = normalizeDomainHint(domain);
    const agentPolicy = (classified?.agent_policy ??
      buildAgentPolicyPayload(
        input,
        (classified?.classification ?? {}) as Record<string, unknown>,
        explicitDomainHint,
      )) as Record<string, unknown>;
    const plainEnglishProtocol = (agentPolicy.plain_english_protocol ?? {}) as Record<string, unknown>;

    const runId = String(classified?.run_id ?? "");
    if (!runId) return jsonResponse({ error: "classifier did not return run_id" }, 500);

    // Check if classification requires human review
    if (classified?.next_state === "waiting_review") {
      return jsonResponse({
        request_id: requestId,
        run_id: runId,
        state: "waiting_review",
        domain: domain,
        operator_status_label: "Needs human check",
        classification: classified?.classification ?? {},
        agent_policy: agentPolicy,
        plain_english_protocol: plainEnglishProtocol,
      });
    }

    // Step 2: Retrieve context using domain-specific RAG
    const contextResp = await invokeFunction("retrieve_context", {
      domain,
      run_id: runId,
      request_id: requestId,
      profile_id: profileId,
      input,
    });

    // Step 3: Make decision using domain-specific decision engine
    const decisionResp = await invokeFunction("decide", {
      domain,
      run_id: runId,
      request_id: requestId,
      profile_id: profileId,
      classification: classified?.classification ?? {},
      context_pack: contextResp?.context_pack ?? {},
      input,
    });

    // Resolve actions (use provided actions or decision-suggested actions)
    const resolvedActions =
      actions.length > 0
        ? actions
        : Array.isArray(decisionResp?.decision?.suggested_actions)
        ? decisionResp.decision.suggested_actions
        : [];

    // Step 4: Execute workflow steps
    const executeResp = await invokeFunction("execute", {
      domain,
      run_id: runId,
      request_id: requestId,
      profile_id: profileId,
      decision: decisionResp?.decision ?? {},
      actions: resolvedActions,
      workflow_id: workflowId,
    });

    // Determine success
    const success = Array.isArray(executeResp?.outcome?.action_results)
      ? executeResp.outcome.action_results.every(
          (r: Record<string, unknown>) => {
            const status = String(r?.status ?? "");
            return status !== "failed";
          }
        )
      : true;

    // Step 5: Store result in domain memory
    const storeResp = await invokeFunction("store_result", {
      domain,
      run_id: runId,
      request_id: requestId,
      profile_id: profileId,
      success,
      output_payload: {
        classification: classified?.classification ?? {},
        context_pack: contextResp?.context_pack ?? {},
        decision: decisionResp?.decision ?? {},
        outcome: executeResp?.outcome ?? {},
      },
      started_at: body?.started_at ?? new Date().toISOString(),
      feedback: body?.feedback ?? null,
    });

    // Update brain_runs state
    const finalState = storeResp?.state ?? (success ? "completed" : "failed");

    return jsonResponse({
      request_id: requestId,
      run_id: runId,
      state: finalState,
      domain: domain,
      eta_seconds: 0,
      machine_view: {
        classification: classified?.classification ?? {},
        context_pack: contextResp?.context_pack ?? {},
        decision: decisionResp?.decision ?? {},
        outcome: executeResp?.outcome ?? {},
        agent_policy: agentPolicy,
      },
      operator_view: {
        status: finalState,
        status_label:
          finalState === "completed"
            ? "Done"
            : finalState === "failed"
            ? "Stopped with issue"
            : "Processing complete",
        message:
          finalState === "completed"
            ? "Request was processed successfully."
            : finalState === "failed"
            ? "Request stopped with an issue."
            : "Request processing complete.",
        plain_english_problem:
          String(plainEnglishProtocol.problem_summary ?? "The request was classified and routed for safe handling."),
        plain_english_fix:
          String(plainEnglishProtocol.proposed_fix ?? "Follow the suggested next steps in order."),
      },
      agent_policy: agentPolicy,
      plain_english_protocol: plainEnglishProtocol,
    });
  } catch (error) {
    return jsonResponse({ error: String(error) }, 500);
  }
});
