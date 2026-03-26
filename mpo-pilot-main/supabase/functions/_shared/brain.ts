export type Json = Record<string, unknown>;

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const SERVICE_ROLE_JWT = Deno.env.get("SERVICE_ROLE_JWT") ?? "";
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
const EDGE_INVOKE_JWT = Deno.env.get("EDGE_INVOKE_JWT") ?? "";
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY") ?? "";
const GEMINI_MODEL = Deno.env.get("GEMINI_MODEL") ?? "gemini-1.5-flash";
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY") ?? "";
const OPENAI_MODEL = Deno.env.get("OPENAI_MODEL") ?? "gpt-4o-mini";

function isJwtLike(token: string) {
  return token.split(".").length === 3;
}

function chooseApiJwt() {
  if (isJwtLike(SERVICE_ROLE_JWT)) return SERVICE_ROLE_JWT;
  if (isJwtLike(SERVICE_ROLE)) return SERVICE_ROLE;
  if (isJwtLike(EDGE_INVOKE_JWT)) return EDGE_INVOKE_JWT;
  if (isJwtLike(ANON_KEY)) return ANON_KEY;
  return "";
}

function sbHeaders() {
  const key = chooseApiJwt();
  if (!key) {
    throw new Error("No JWT-like key found for Supabase REST calls.");
  }
  return {
    "Content-Type": "application/json",
    apikey: key,
    Authorization: `Bearer ${key}`,
  };
}

export function jsonResponse(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type, x-idempotency-key",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    },
  });
}

export function handleCorsPreflight(req: Request): Response | null {
  if (req.method !== "OPTIONS") return null;
  return new Response("ok", {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type, x-idempotency-key",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    },
  });
}

export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export async function restSelect(
  table: string,
  query: string,
): Promise<unknown[]> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, {
    headers: sbHeaders(),
  });
  if (!res.ok) throw new Error(`select ${table} failed: ${await res.text()}`);
  return await res.json();
}

export async function restInsert(table: string, body: unknown): Promise<void> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: sbHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`insert ${table} failed: ${await res.text()}`);
}

export async function restPatch(
  table: string,
  query: string,
  body: unknown,
): Promise<void> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, {
    method: "PATCH",
    headers: sbHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`patch ${table} failed: ${await res.text()}`);
}

export async function rpc(functionName: string, body: unknown): Promise<unknown> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${functionName}`, {
    method: "POST",
    headers: sbHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`rpc ${functionName} failed: ${await res.text()}`);
  return await res.json();
}

export async function getPrompt(name: string): Promise<string> {
  const prompts = await restSelect("brain_prompts", `select=id,active_version&name=eq.${name}&limit=1`);
  const prompt = prompts?.[0] as { id?: string; active_version?: string } | undefined;
  if (!prompt?.id || !prompt.active_version) {
    throw new Error(`prompt ${name} not found`);
  }
  const versions = await restSelect(
    "brain_prompt_versions",
    `select=content&prompt_id=eq.${prompt.id}&version=eq.${prompt.active_version}&limit=1`,
  );
  const current = versions?.[0] as { content?: string } | undefined;
  if (!current?.content) throw new Error(`prompt version missing for ${name}`);
  return current.content;
}

function extractJson(text: string): Json {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start >= 0 && end > start) {
      return JSON.parse(trimmed.slice(start, end + 1));
    }
    throw new Error("Model output was not valid JSON");
  }
}

export async function callGemini(prompt: string): Promise<Json> {
  const endpoint =
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0, topP: 0.1, topK: 1 },
    }),
  });
  if (!res.ok) throw new Error(`gemini failed: ${await res.text()}`);
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
  return extractJson(text);
}

export async function callChatGpt(prompt: string): Promise<Json> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "Return JSON only." },
        { role: "user", content: prompt },
      ],
    }),
  });
  if (!res.ok) throw new Error(`chatgpt failed: ${await res.text()}`);
  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content ?? "{}";
  return extractJson(text);
}

export function chooseModel(classification?: Json): "gemini" | "chatgpt" {
  const confidence = Number(classification?.confidence ?? 1);
  const type = String(classification?.type ?? "");
  const priority = String(classification?.priority ?? "");
  if (confidence < 0.65) return "chatgpt";
  if (type === "ticket" && priority === "high") return "chatgpt";
  return "gemini";
}

export async function callModel(prompt: string, model: "gemini" | "chatgpt"): Promise<Json> {
  let attempt = 0;
  let lastError: unknown;
  while (attempt < 3) {
    try {
      return model === "chatgpt" ? await callChatGpt(prompt) : await callGemini(prompt);
    } catch (error) {
      lastError = error;
      attempt += 1;
      const delayMs = 250 * (2 ** (attempt - 1));
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  throw lastError instanceof Error ? lastError : new Error("Model call failed after retries");
}

export function assertClassifierSchema(payload: Json) {
  const validType = ["ticket", "action", "question", "automation"].includes(String(payload.type));
  const validPriority = ["low", "medium", "high"].includes(String(payload.priority));
  const validIntent = ["diagnose", "create", "fix", "analyze"].includes(String(payload.intent));
  const validDomain = ["tech", "pmo", "ops", "general"].includes(String(payload.domain));
  const validComplexity = ["low", "medium", "high"].includes(String(payload.complexity));
  const confidence = Number(payload.confidence);
  if (!validType || !validPriority || !validIntent || !validDomain || !validComplexity || Number.isNaN(confidence)) {
    throw new Error("Classifier schema invalid");
  }
  payload.confidence = clamp(confidence, 0, 1);
}

export async function ensureRun(
  requestId: string,
  profileId: string,
  organizationId: string | null,
  inputPayload: Json,
): Promise<string> {
  const existing = await restSelect(
    "brain_runs",
    `select=id&profile_id=eq.${profileId}&request_id=eq.${requestId}&limit=1`,
  );
  const run = existing?.[0] as { id?: string } | undefined;
  if (run?.id) return run.id;
  await restInsert("brain_runs", {
    request_id: requestId,
    profile_id: profileId,
    organization_id: organizationId,
    input_payload: inputPayload,
    state: "running",
  });
  const created = await restSelect(
    "brain_runs",
    `select=id&profile_id=eq.${profileId}&request_id=eq.${requestId}&order=created_at.desc&limit=1`,
  );
  const createdRun = created?.[0] as { id?: string } | undefined;
  if (!createdRun?.id) throw new Error("Run create failed");
  return createdRun.id;
}

export async function invokeFunction(
  functionName: string,
  payload: Json,
): Promise<Json> {
  const key = chooseApiJwt();
  if (!key) {
    throw new Error("Missing JWT-like key for function invocation. Set EDGE_INVOKE_JWT.");
  }
  const res = await fetch(`${SUPABASE_URL}/functions/v1/${functionName}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
      apikey: key,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`invoke ${functionName} failed: ${await res.text()}`);
  }
  return await res.json();
}
