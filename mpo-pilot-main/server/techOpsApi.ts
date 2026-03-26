import { z } from "zod";

// Typed contract derived from `Tech-Ops/lib/api-spec/openapi.yaml`:
// - GET    /connectors/health
// - POST   /connectors/health/{name}/poll
export const ConnectorHealthStatusSchema = z.object({
  id: z.number(),
  connectorName: z.string(),
  status: z.enum(["healthy", "degraded", "down", "unknown"]),
  lastChecked: z.string(),
  responseTime: z.union([z.number(), z.null()]),
  errorMessage: z.union([z.string(), z.null()]),
});

export type ConnectorHealthStatus = z.infer<typeof ConnectorHealthStatusSchema>;

export async function listConnectorHealthStatuses(params: {
  baseUrl: string;
  cookie?: string;
  timeoutMs?: number;
}): Promise<ConnectorHealthStatus[]> {
  const { baseUrl, cookie, timeoutMs = 8000 } = params;

  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/connectors/health`, {
    method: "GET",
    headers: cookie ? { cookie } : undefined,
    signal: AbortSignal.timeout(timeoutMs),
  });

  if (!response.ok) {
    throw new Error(`Tech-Ops connectors/health failed: HTTP ${response.status}`);
  }

  const json = (await response.json()) as unknown;
  const parsed = z.array(ConnectorHealthStatusSchema).parse(json);
  return parsed;
}

export async function pollConnectorHealthStatus(params: {
  baseUrl: string;
  connectorName: string;
  cookie?: string;
  timeoutMs?: number;
}): Promise<ConnectorHealthStatus> {
  const { baseUrl, connectorName, cookie, timeoutMs = 8000 } = params;
  const encoded = encodeURIComponent(connectorName);

  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/connectors/health/${encoded}/poll`, {
    method: "POST",
    headers: cookie ? { cookie } : undefined,
    signal: AbortSignal.timeout(timeoutMs),
  });

  if (!response.ok) {
    throw new Error(`Tech-Ops connectors poll failed for ${connectorName}: HTTP ${response.status}`);
  }

  const json = (await response.json()) as unknown;
  const parsed = ConnectorHealthStatusSchema.parse(json);
  return parsed;
}

