import { apiFetch } from './api';

export async function triggerWorkflow(input: {
  action?: string;
  payload?: any;
}) {
  const data = await apiFetch("/api/autopilot", {
    method: "POST",
    body: JSON.stringify({
      naturalLanguage: input.action,
      payload: input.payload,
    }),
  });

  return data;
}
