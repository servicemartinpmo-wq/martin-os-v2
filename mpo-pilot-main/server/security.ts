const SENSITIVE_KEY_PATTERN = /(authorization|token|secret|password|cookie|apikey|api_key|jwt)/i;

function redactString(input: string): string {
  if (input.length <= 8) return "[REDACTED]";
  return `${input.slice(0, 4)}...[REDACTED]...${input.slice(-2)}`;
}

export function redactSensitive(value: unknown): unknown {
  if (value == null) return value;
  if (typeof value === "string") return redactString(value);
  if (Array.isArray(value)) return value.map((item) => redactSensitive(item));
  if (typeof value === "object") {
    const output: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      output[key] = SENSITIVE_KEY_PATTERN.test(key) ? "[REDACTED]" : redactSensitive(val);
    }
    return output;
  }
  return value;
}

export function toSafeError(error: unknown): string {
  if (error instanceof Error) {
    return `${error.name}: ${error.message}`;
  }
  if (typeof error === "string") return redactString(error);
  return JSON.stringify(redactSensitive(error));
}

export function validateRuntimeSecurityConfig() {
  const isProd = process.env.NODE_ENV === "production";
  const inviteSecret = process.env.INVITE_TOKEN_SECRET;
  if (isProd && (!inviteSecret || inviteSecret === "dev-invite-secret-change-me")) {
    throw new Error("INVITE_TOKEN_SECRET must be set to a strong value in production.");
  }
  if (!inviteSecret) {
    console.warn("[Security] INVITE_TOKEN_SECRET not set; using dev fallback.");
  }
}

