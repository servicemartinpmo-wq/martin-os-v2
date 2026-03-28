import { getPool } from "./db";
import { randomUUID } from "crypto";
import { pollConnectorHealthStatus } from "./techOpsApi";

interface SyncResult {
  recordsAdded: number;
  recordsUpdated: number;
  recordsRemoved: number;
  error?: string;
}

function mapIntegrationToConnectorName(integrationId: string): string {
  // Tech-Ops connector names (from `connectors.ts`) are:
  // - email, cloud, database, network, security, monitoring
  // PMO integration ids are broader (slack, asana, etc). For non-matching ids we
  // route health checks through the most generic connector.
  const normalized = integrationId.trim().toLowerCase();
  if (["email", "gmail", "outlook", "outlook-cal", "mail"].includes(normalized)) return "email";
  if (["cloud", "gcloud", "aws", "azure"].includes(normalized)) return "cloud";
  if (["database", "db"].includes(normalized)) return "database";
  if (["network"].includes(normalized)) return "network";
  if (["security", "sec"].includes(normalized)) return "security";
  if (["monitoring", "observability"].includes(normalized)) return "monitoring";
  return "monitoring";
}

function mapConnectorStatusToSyncStatus(status: string): "success" | "partial" | "failed" {
  if (status === "healthy") return "success";
  if (status === "degraded" || status === "unknown") return "partial";
  return "failed";
}

export async function runServerSync(
  profileId: string,
  integrationId: string,
  integrationName: string,
  cookieHeader?: string
): Promise<SyncResult> {
  const pool = getPool();

  const logId = randomUUID();
  const now = new Date().toISOString();

  await pool.query(
    `INSERT INTO integration_sync_log (id, profile_id, integration_id, integration_name, status, records_added, records_updated, records_removed, started_at, created_at)
     VALUES ($1, $2, $3, $4, 'running', 0, 0, 0, $5, $5)`,
    [logId, profileId, integrationId, integrationName, now]
  );

  try {
    const baseUrl = process.env.TECH_OPS_BASE_URL || "https://tech-ops.replit.app";
    const connectorName = mapIntegrationToConnectorName(integrationId);

    const techOpsHealth = await pollConnectorHealthStatus({
      baseUrl,
      connectorName,
      cookie: cookieHeader,
    });

    const recordType = "connector_health";
    const recordId = `connector_health_latest:${connectorName}`;
    const recordName = `${connectorName} Connector Health`;
    const recordData = {
      connectorName: techOpsHealth.connectorName,
      status: techOpsHealth.status,
      lastChecked: techOpsHealth.lastChecked,
      responseTime: techOpsHealth.responseTime,
      errorMessage: techOpsHealth.errorMessage,
      integrationId,
      integrationName,
      checkedAt: now,
    };

    const existingResult = await pool.query(
      `SELECT id FROM integration_backups
       WHERE profile_id = $1 AND integration_id = $2 AND record_type = $3 AND record_id = $4`,
      [profileId, integrationId, recordType, recordId]
    );

    let recordsAdded = 0;
    let recordsUpdated = 0;

    if (existingResult.rows.length > 0) {
      await pool.query(
        `UPDATE integration_backups
         SET record_data = $1, record_name = $2, synced_at = $3
         WHERE id = $4`,
        [JSON.stringify(recordData), recordName, now, existingResult.rows[0].id]
      );
      recordsUpdated = 1;
    } else {
      const id = randomUUID();
      await pool.query(
        `INSERT INTO integration_backups
          (id, profile_id, integration_id, integration_name, record_type, record_id, record_name, record_data, synced_at, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $9)`,
        [
          id,
          profileId,
          integrationId,
          integrationName,
          recordType,
          recordId,
          recordName,
          JSON.stringify(recordData),
          now,
        ]
      );
      recordsAdded = 1;
    }

    const completedAt = new Date().toISOString();
    const syncStatus = mapConnectorStatusToSyncStatus(techOpsHealth.status);

    await pool.query(
      `UPDATE integration_sync_log
       SET status = $1, records_added = $2, records_updated = $3, completed_at = $4
       WHERE id = $5`,
      [syncStatus, recordsAdded, recordsUpdated, completedAt, logId]
    );

    return { recordsAdded, recordsUpdated, recordsRemoved: 0 };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    const completedAt = new Date().toISOString();
    await pool.query(
      `UPDATE integration_sync_log SET status = 'failed', error_message = $1, completed_at = $2 WHERE id = $3`,
      [errorMsg, completedAt, logId]
    ).catch(() => {});

    return { recordsAdded: 0, recordsUpdated: 0, recordsRemoved: 0, error: errorMsg };
  }
}

export async function runSyncForAllConnected(profileId: string, cookieHeader?: string): Promise<void> {
  const pool = getPool();
  try {
    const result = await pool.query(
      `SELECT integration_id FROM integration_connections WHERE profile_id = $1 AND status = 'connected'`,
      [profileId]
    );

    for (const row of result.rows) {
      const name = row.integration_id.charAt(0).toUpperCase() + row.integration_id.slice(1);
      await runServerSync(profileId, row.integration_id, name, cookieHeader);
    }
  } catch (err) {
    console.error("[TechOps Sync] Error syncing all connected integrations:", err);
  }
}

let scheduledSyncInterval: ReturnType<typeof setInterval> | null = null;

export function startScheduledSync(intervalMs: number = 15 * 60 * 1000) {
  if (scheduledSyncInterval) return;
  if (!process.env.DATABASE_URL?.trim()) {
    console.log("[TechOps] DATABASE_URL not set — skipping scheduled sync (dev / no DB)");
    return;
  }

  console.log(`[TechOps] Starting scheduled sync every ${intervalMs / 60000} minutes`);

  scheduledSyncInterval = setInterval(async () => {
    try {
      const pool = getPool();
      const profilesResult = await pool.query(
        `SELECT DISTINCT profile_id FROM integration_connections WHERE status = 'connected'`
      );
      for (const row of profilesResult.rows) {
        // Scheduled sync does not have a user session cookie to forward, so Tech-Ops
        // connector polling may fail if the Tech-Ops backend requires auth.
        await runSyncForAllConnected(row.profile_id);
      }
      console.log(`[TechOps] Scheduled sync completed for ${profilesResult.rows.length} profile(s)`);
    } catch (err) {
      console.error("[TechOps] Scheduled sync error:", err);
    }
  }, intervalMs);
}

export function stopScheduledSync() {
  if (scheduledSyncInterval) {
    clearInterval(scheduledSyncInterval);
    scheduledSyncInterval = null;
    console.log("[TechOps] Scheduled sync stopped");
  }
}
