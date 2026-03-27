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

export interface TechOpsLaunchReadinessRequest {
  mission: string;
  strictMode: boolean;
  runOrchestrationSmokeTest: boolean;
  supportTier: number;
  providerTarget: ProviderTarget;
  enableAutonomousAgents: boolean;
}

export interface TechOpsLaunchReadinessResponse {
  ok: boolean;
  request_id: string;
  mission: string;
  strict_mode: boolean;
  launch_ready: boolean;
  overall_score: number;
  selected_provider: string;
  support_tier: number;
  orchestration_smoke_test: {
    invoked: boolean;
    status: "pass" | "warn" | "fail";
    message: string;
    run: Record<string, unknown> | null;
  };
  agent_mesh: {
    topology: string;
    layer_rollup: {
      storage: number;
      backend: number;
      middleware: number;
      frontend: number;
    };
    agents: Array<{
      agent_id: string;
      layer: "storage" | "backend" | "middleware" | "frontend";
      role: string;
      status: "healthy" | "degraded" | "critical";
      score: number;
      checks: Array<{
        check_name: string;
        status: "pass" | "warn" | "fail";
        message: string;
        remediation: string | null;
      }>;
      meta?: Record<string, unknown>;
    }>;
  };
  workflow_timeline: Array<{
    step_id: string;
    title: string;
    status: "completed" | "failed";
    started_at: string;
    ended_at: string;
    details: string;
  }>;
  blockers: string[];
  recommendations: string[];
  operator_summary: string;
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

export async function runTechOpsLaunchReadiness(
  payload: TechOpsLaunchReadinessRequest,
): Promise<TechOpsLaunchReadinessResponse> {
  const res = await fetch("/api/techops/launch-readiness", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseJsonOrThrow<TechOpsLaunchReadinessResponse>(res);
}
