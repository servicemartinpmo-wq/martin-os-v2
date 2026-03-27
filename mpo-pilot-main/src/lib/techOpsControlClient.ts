type ProviderTarget = "auto" | "gemini" | "chatgpt" | "cursor" | "autonomous";

export interface TechOpsCapabilities {
  backend: {
    supabase: boolean;
    middleware: boolean;
  };
  providers: {
    gemini: boolean;
    chatgpt: boolean;
    cursor: boolean;
    autonomous: boolean;
  };
  remote_support: {
    teamviewer: boolean;
    teamviewer_url: string;
  };
}

export interface TechOpsTeamViewerSession {
  required: boolean;
  session_code: string;
  session_url: string;
  handoff_note: string;
  operator_script: string;
}

export interface TechOpsOrchestrationResponse {
  ok: boolean;
  request_id: string;
  support_tier: number;
  support_tier_label: string;
  selected_provider: string;
  provider_chain: string[];
  runbook: string[];
  backend: {
    supabase_connected: boolean;
    brain_invocation_error: string | null;
  };
  brain_run: Record<string, unknown> | null;
  teamviewer: TechOpsTeamViewerSession | null;
  app_builder: {
    internal_only: boolean;
    execution_mode: string;
    stack: string;
    target_users: string;
    feature_summary: string;
    phases: string[];
    suggested_actions: Array<{
      tool_name: string;
      operator_instruction: string;
    }>;
    provider: string;
  } | null;
  app_builder_denied_reason: string | null;
  operator_summary: string;
}

export interface TechOpsOrchestrationRequest {
  prompt: string;
  supportTier: number;
  providerTarget: ProviderTarget;
  enableAutonomousAgents: boolean;
  requireTeamViewer: boolean;
  internalAppBuilder: {
    enabled: boolean;
    summary?: string;
    targetUsers?: string;
    preferredStack?: string;
    internalUseConfirmed: boolean;
  };
}

async function parseJsonOrThrow<T>(res: Response): Promise<T> {
  const raw = await res.text();
  let parsed: unknown = null;
  try {
    parsed = raw ? JSON.parse(raw) : null;
  } catch {
    parsed = null;
  }
  if (!res.ok) {
    const msg =
      (parsed as Record<string, unknown> | null)?.error ??
      raw ??
      `HTTP ${res.status}`;
    throw new Error(String(msg));
  }
  return (parsed as T) ?? ({} as T);
}

export async function fetchTechOpsCapabilities(): Promise<TechOpsCapabilities> {
  const res = await fetch("/api/techops/capabilities", {
    method: "GET",
    credentials: "include",
  });
  return parseJsonOrThrow<TechOpsCapabilities>(res);
}

export async function runTechOpsOrchestration(
  payload: TechOpsOrchestrationRequest,
): Promise<TechOpsOrchestrationResponse> {
  const res = await fetch("/api/techops/orchestrate", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseJsonOrThrow<TechOpsOrchestrationResponse>(res);
}

export async function createTechOpsTeamViewerSession(
  prompt: string,
): Promise<TechOpsTeamViewerSession> {
  const res = await fetch("/api/techops/teamviewer/session", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  return parseJsonOrThrow<TechOpsTeamViewerSession>(res);
}
