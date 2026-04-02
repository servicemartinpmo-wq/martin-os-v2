import { parseIntent } from "./intentParser";
import { evaluateTask } from "./intelligenceLayer";
import { getWorkflowByAction, createWorkflow } from "../lib/workflowRepo";
import { generateWorkflowFromIntent } from "./workflowGenerator";
import { runWorkflow } from "./workflowRunner";
import { logDecision } from "./feedbackService";

export async function autopilotEngine(input: {
  userId: string;
  action?: string;
  naturalLanguage?: string;
  payload?: any;
}) {
  // 1. Normalize intent
  const intent = input.naturalLanguage
    ? await parseIntent(input.naturalLanguage)
    : { action: input.action, payload: input.payload };

  // 2. Evaluate intelligence
  const decision = await evaluateTask(intent);

  // 3. Get or generate workflow
  let workflow = await getWorkflowByAction(intent.action);

  if (!workflow) {
    workflow = await generateWorkflowFromIntent(intent);
    await createWorkflow(workflow);
  }

  // 4. Decide execution path
  let result;

  if (decision.confidence > 0.8) {
    result = await runWorkflow(workflow, intent.payload);
  } else {
    result = {
      requiresApproval: true,
      reason: "Low confidence",
      suggestedWorkflow: workflow,
    };
  }

  // 5. Log everything (CRITICAL)
  await logDecision({
    intent,
    decision,
    workflow,
    result,
  });

  return result;
}
