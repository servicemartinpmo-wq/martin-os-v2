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

export async function submitBrainRequest(
  payload: BrainSubmitRequest,
): Promise<BrainSubmitResponse> {
  const { data, error } = await supabase.functions.invoke("orchestrate", {
    body: payload,
    headers: { "x-idempotency-key": payload.request_id },
  });
  if (error) throw new Error(error.message);
  return data as BrainSubmitResponse;
}

export async function fetchBrainStatus(
  runId: string,
  profileId: string,
): Promise<Json> {
  const { data: auth } = await supabase.auth.getSession();
  const token = auth.session?.access_token ?? "";
  const baseUrl = import.meta.env.VITE_SUPABASE_URL;
  const anonKey =
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    import.meta.env.VITE_SUPABASE_ANON_KEY;
  const res = await fetch(
    `${baseUrl}/functions/v1/brain_status?run_id=${encodeURIComponent(runId)}&profile_id=${encodeURIComponent(profileId)}`,
    {
      headers: {
        "Content-Type": "application/json",
        apikey: anonKey,
        Authorization: `Bearer ${token || anonKey}`,
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
  const anonKey =
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    import.meta.env.VITE_SUPABASE_ANON_KEY;
  const res = await fetch(
    `${baseUrl}/functions/v1/brain_result?run_id=${encodeURIComponent(runId)}&profile_id=${encodeURIComponent(profileId)}`,
    {
      headers: {
        "Content-Type": "application/json",
        apikey: anonKey,
        Authorization: `Bearer ${token || anonKey}`,
      },
    },
  );
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as Json;
}
