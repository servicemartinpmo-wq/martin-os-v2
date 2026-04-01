import { useState } from 'react';
import { ACTIONS } from '../config/actionRegistry';
import { toast } from 'sonner';
import { apiFetch } from '../lib/api';

export function useAction() {
  const [isExecuting, setIsExecuting] = useState(false);

  const executeAction = async (actionId: string, payload?: any, onSuccess?: (data: any) => void) => {
    const actionDef = ACTIONS[actionId];

    if (!actionDef) {
      toast.error(`Action ${actionId} is not configured.`);
      return;
    }

    setIsExecuting(true);
    const finalPayload = actionDef.payloadBuilder ? actionDef.payloadBuilder(payload) : payload;

    try {
      if (actionDef.kind === 'navigate') {
        if (!actionDef.route) {
          toast.error(`Route missing for action ${actionId}`);
          return;
        }
        window.location.href = actionDef.route;
        return;
      }

      if (actionDef.kind === 'open_modal') {
        toast.info(`Opening modal for ${actionDef.label}`);
        onSuccess?.(null);
        return;
      }

      if (actionDef.kind === 'api_call' || actionDef.kind === 'ai_command') {
        if (!actionDef.endpoint) throw new Error(`Endpoint missing for action ${actionId}`);

        const data = await apiFetch(actionDef.endpoint, {
          method: 'POST',
          body: JSON.stringify({
            actionId,
            payload: finalPayload,
          }),
        });

        // If your API always responds with { ok, message, error, ... }
        if (data?.ok === false) {
          throw new Error(data?.error || 'Action execution failed');
        }

        if (data?.fallback) {
          toast.warning(`Fallback used: ${data.text || 'Provider unavailable'}`);
        } else {
          toast.success(data?.message || `${actionDef.label} completed successfully`);
        }

        onSuccess?.(data);
        return data;
      }

      toast.error(`Unhandled action kind for ${actionId}`);
    } catch (err: any) {
      console.error(`Error executing ${actionId}:`, err);
      toast.error(err?.message || `Failed to execute ${actionDef.label}`);
    } finally {
      setIsExecuting(false);
    }
  };

  return { executeAction, isExecuting };
}
