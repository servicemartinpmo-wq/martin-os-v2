export async function generateWorkflowFromIntent(intent: any) {
  if (intent.action === "create_followup_task") {
    return {
      action: intent.action,
      steps: [
        {
          type: "db_insert",
          config: { table: "tasks" },
        },
        {
          type: "notify_user",
          config: { type: "reminder" },
        },
      ],
    };
  }

  if (intent.action === "unknown_action") {
    return {
      action: intent.action,
      steps: [
        {
          type: "log_action",
          config: { message: "Unknown intent captured" },
        },
      ],
    };
  }

  return {
    action: intent.action,
    steps: [],
  };
}
