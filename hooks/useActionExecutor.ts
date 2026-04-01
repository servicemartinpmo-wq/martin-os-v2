import { useCallback, useState } from 'react';
import { executeAction, ExecuteActionResult } from '../lib/executeAction';

type ExecState = {
  loading: boolean;
  error: string | null;
  requestId: string | null;
  lastResult: ExecuteActionResult | null;
};

export function useActionExecutor() {
  const [state, setState] = useState<ExecState>({
    loading: false,
    error: null,
    requestId: null,
    lastResult: null,
  });

  const run = useCallback(async (actionId: string, payload?: Record<string, unknown>) => {
    setState((s) => ({ ...s, loading: true, error: null, requestId: null }));
    
    const result = await executeAction({ actionId, payload });

    if (!result.ok) {
      setState({
        loading: false,
        error: result.error || 'Action failed',
        requestId: result.requestId || null,
        lastResult: result,
      });
      return result;
    }

    setState({
      loading: false,
      error: null,
      requestId: result.requestId || null,
      lastResult: result,
    });
    return result;
  }, []);

  return { ...state, run, executeAction: run };
}
