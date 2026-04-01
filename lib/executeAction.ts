import { apiFetch } from './api';

export type ExecuteActionInput = {
  actionId: string;
  payload?: Record<string, unknown>;
  runId?: string;
};

export type ExecuteActionResult = {
  ok: boolean;
  actionId?: string;
  runId?: string | null;
  status?: 'queued' | 'completed' | 'failed';
  result?: any;
  error?: string;
  requestId?: string;
};

export async function executeAction(input: ExecuteActionInput): Promise<ExecuteActionResult> {
  try {
    const data = await apiFetch('/api/actions/execute', {
      method: 'POST',
      body: JSON.stringify(input),
    });

    return {
      ok: true,
      actionId: data?.actionId || input.actionId,
      runId: data?.runId ?? input.runId ?? null,
      status: data?.status || 'completed',
      result: data?.result ?? data,
      requestId: data?.requestId || undefined,
    };
  } catch (err: any) {
    return {
      ok: false,
      actionId: input.actionId,
      runId: input.runId ?? null,
      status: 'failed',
      error: err.message || 'Action failed',
      requestId: undefined,
    };
  }
}
