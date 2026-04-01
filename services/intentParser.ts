export async function parseIntent(input: string) {
  const text = input.toLowerCase();

  if (text.includes("follow up")) {
    return {
      action: "create_followup_task",
      payload: {
        title: input,
        due_date: new Date(Date.now() + 86400000),
      },
    };
  }

  if (text.includes("assign")) {
    return {
      action: "assign_task",
      payload: { note: input },
    };
  }

  // fallback (important)
  return {
    action: "unknown_action",
    payload: { raw: input },
  };
}
