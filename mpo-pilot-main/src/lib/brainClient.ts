import { supabase } from "@/integrations/supabase/client";

type Json = Record<string, unknown>;

export interface BrainSubmitRequest {
  request_id: string;
  profile_id: string;
  input: string;
  organization_id?: string | null;
  actions?: Array<Record<string, unknown>>;
  started_at?: string;
  feedback?: string | null;
}

export interface BrainSubmitResponse {
  request_id: string;
  run_id: string;
  state: string;
  operator_status_label?: string;
  machine_view?: Json;
  operator_view?: Json;
  classification?: Json;
}

function readProjectRef(baseUrl: string): string {
  try {
    const host = new URL(baseUrl).hostname;
    return host.split(".")[0] ?? "";
  } catch {
    return "";
  }
}

function parseJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
    const json = atob(padded);
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function chooseBearerToken(
  sessionToken: string,
  anonJwt: string,
  baseUrl: string,
): string {
  if (!sessionToken) return anonJwt;
  const payload = parseJwtPayload(sessionToken);
  if (!payload) return anonJwt;

  const now = Math.floor(Date.now() / 1000);
  const exp = Number(payload.exp ?? 0);
  if (!exp || exp <= now) return anonJwt;

  const tokenRef = String(payload.ref ?? "");
  const projectRef = readProjectRef(baseUrl);
  if (!tokenRef || !projectRef || tokenRef !== projectRef) return anonJwt;

  return sessionToken;
}

export async function submitBrainRequest(
  payload: BrainSubmitRequest,
): Promise<BrainSubmitResponse> {
  const baseUrl = import.meta.env.VITE_SUPABASE_URL;
  const anonJwt = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!baseUrl || !anonJwt) {
    throw new Error(
      "Missing Supabase env vars: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
    );
  }

  try {
    const { data, error } = await supabase.functions.invoke("orchestrate", {
      body: payload,
      headers: { "x-idempotency-key": payload.request_id },
    });
    if (!error && data) return data as BrainSubmitResponse;
  } catch {
    // Fall through to direct fetch path below.
  }

  const { data: auth } = await supabase.auth.getSession();
  const token = auth.session?.access_token ?? "";
  const bearer = chooseBearerToken(token, anonJwt, baseUrl);
  const response = await fetch(`${baseUrl}/functions/v1/orchestrate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: anonJwt,
      Authorization: `Bearer ${bearer}`,
      "x-idempotency-key": payload.request_id,
    },
    body: JSON.stringify(payload),
  });

  const raw = await response.text();
  let parsed: unknown = null;
  try {
    parsed = raw ? JSON.parse(raw) : null;
  } catch {
    parsed = null;
  }
  if (!response.ok) {
    const detail =
      (parsed as Record<string, unknown> | null)?.error ??
      raw ??
      `HTTP ${response.status}`;
    throw new Error(`Brain request failed: ${String(detail)}`);
  }
  return (parsed as BrainSubmitResponse) ?? ({} as BrainSubmitResponse);
}

export async function fetchBrainStatus(
  runId: string,
  profileId: string,
): Promise<Json> {
  const { data: auth } = await supabase.auth.getSession();
  const token = auth.session?.access_token ?? "";
  const baseUrl = import.meta.env.VITE_SUPABASE_URL;
  const anonJwt = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!baseUrl || !anonJwt) {
    throw new Error("Missing Supabase env vars: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
  }
  const bearer = chooseBearerToken(token, anonJwt, baseUrl);
  const res = await fetch(
    `${baseUrl}/functions/v1/brain_status?run_id=${encodeURIComponent(runId)}&profile_id=${encodeURIComponent(profileId)}`,
    {
      headers: {
        "Content-Type": "application/json",
        apikey: anonJwt,
        Authorization: `Bearer ${bearer}`,
      },
    },
  );
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as Json;
}

export async function fetchBrainResult(
  runId: string,
  profileId: string,
): Promise<Json> {
  const { data: auth } = await supabase.auth.getSession();
  const token = auth.session?.access_token ?? "";
  const baseUrl = import.meta.env.VITE_SUPABASE_URL;
  const anonJwt = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!baseUrl || !anonJwt) {
    throw new Error("Missing Supabase env vars: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
  }
  const bearer = chooseBearerToken(token, anonJwt, baseUrl);
  const res = await fetch(
    `${baseUrl}/functions/v1/brain_result?run_id=${encodeURIComponent(runId)}&profile_id=${encodeURIComponent(profileId)}`,
    {
      headers: {
        "Content-Type": "application/json",
        apikey: anonJwt,
        Authorization: `Bearer ${bearer}`,
      },
    },
  );
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as Json;
}
