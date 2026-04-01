export async function evaluateTask(intent: any) {
  let priority = 0.5;
  let confidence = 0.6;

  // Priority logic
  if (intent.payload?.due_date) {
    const hoursLeft =
      (new Date(intent.payload.due_date).getTime() - Date.now()) /
      (1000 * 60 * 60);

    if (hoursLeft < 24) priority += 0.3;
  }

  if (intent.action.includes("followup")) {
    priority += 0.2;
    confidence += 0.2;
  }

  // Clamp values
  priority = Math.min(priority, 1);
  confidence = Math.min(confidence, 1);

  return {
    priority,
    confidence,
    recommended: priority > 0.7 ? "execute" : "review",
  };
}
