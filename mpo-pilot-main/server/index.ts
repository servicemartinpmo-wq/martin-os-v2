import express from "express";
import { join } from "path";
import { setupAuth, closeAuth } from "./replitAuth";
import { resolveRequestIdentity } from "./authBridge";
import { closePool } from "./db";
import { runServerSync, runSyncForAllConnected, startScheduledSync, stopScheduledSync } from "./techOpsSyncService";
import reportRoutes from "./reportRoutes";
import crmRoutes from "./crmRoutes";
import moduleRoutes from "./moduleRoutes";
import memberRoutes from "./memberRoutes";
import workflowRoutes from "./workflowRoutes";
import techOpsControlRoutes from "./techOpsControlRoutes";

export const TECH_OPS_BASE_URL = process.env.TECH_OPS_BASE_URL || "https://tech-ops.replit.app";
export const MIIDDLE_BASE_URL =
  process.env.MIIDDLE_BASE_URL || process.env.VITE_MIIDDLE_BASE_URL || "http://localhost:5010";
const app = express();

app.use(express.json({ limit: "10mb" }));

process.on("uncaughtException", (err) => {
  console.error("[FATAL] Uncaught exception:", err.message, err.stack);
});

process.on("unhandledRejection", (reason) => {
  console.error("[WARN] Unhandled rejection:", reason);
});

process.on("SIGHUP", () => {
  console.log("[Signal] SIGHUP received — ignoring");
});

async function main() {
  try {
    await setupAuth(app);
    console.log("[Auth] Setup complete");
  } catch (authError) {
    console.warn("[Auth] Setup failed, continuing without auth:", authError);
  }

  app.use(reportRoutes);
  app.use(crmRoutes);
  app.use(moduleRoutes);
  app.use(memberRoutes);
  app.use(workflowRoutes);
  app.use(techOpsControlRoutes);

  app.get("/health", (_req, res) => {
    res.json({
      status: "ok",
      uptime: Math.floor(process.uptime()),
      memory: Math.floor(process.memoryUsage().rss / 1024 / 1024),
    });
  });

  app.post("/api/techops/sync", async (req, res) => {
    try {
      const identity = await resolveRequestIdentity(req);
      const profileId = identity?.profileId;
      if (!profileId) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      const { integrationId, integrationName } = req.body;
      if (!integrationId || !integrationName) {
        return res.status(400).json({ error: "integrationId and integrationName are required" });
      }
      const cookieHeader = req.headers.cookie;
      const result = await runServerSync(profileId, integrationId, integrationName, cookieHeader);
      res.json(result);
    } catch (err: unknown) {
      console.error("[TechOps] Sync error:", err);
      res.status(500).json({ error: err instanceof Error ? err.message : "Sync failed" });
    }
  });

  app.get("/api/techops/service-status", async (_req, res) => {
    try {
      const response = await fetch(`${TECH_OPS_BASE_URL}/api/status`, {
        signal: AbortSignal.timeout(8000),
        headers: _req.headers.cookie ? { cookie: _req.headers.cookie } : undefined,
      });
      const data = await response.json();
      res.json({ connected: true, baseUrl: TECH_OPS_BASE_URL, ...data });
    } catch (err: unknown) {
      console.error("[TechOps] Service status check failed:", err);
      res.json({ connected: false, baseUrl: TECH_OPS_BASE_URL, error: err instanceof Error ? err.message : "Unreachable" });
    }
  });

  app.get("/api/miiddle/service-status", async (_req, res) => {
    const base = MIIDDLE_BASE_URL.replace(/\/$/, "");
    try {
      const healthUrl = `${base}/health.json`;
      const response = await fetch(healthUrl, {
        signal: AbortSignal.timeout(8000),
        headers: {
          Accept: "application/json",
          ...(_req.headers.cookie ? { cookie: _req.headers.cookie } : {}),
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = (await response.json()) as { status?: string };
      res.json({
        connected: true,
        baseUrl: MIIDDLE_BASE_URL,
        status: data.status ?? "ok",
      });
    } catch (err: unknown) {
      console.error("[Miiddle] Service status check failed:", err);
      res.json({
        connected: false,
        baseUrl: MIIDDLE_BASE_URL,
        error: err instanceof Error ? err.message : "Unreachable",
      });
    }
  });

  app.post("/api/techops/sync-all", async (req, res) => {
    try {
      const identity = await resolveRequestIdentity(req);
      const profileId = identity?.profileId;
      if (!profileId) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      const cookieHeader = req.headers.cookie;
      await runSyncForAllConnected(profileId, cookieHeader);
      res.json({ success: true });
    } catch (err: unknown) {
      console.error("[TechOps] Sync all error:", err);
      res.status(500).json({ error: err instanceof Error ? err.message : "Sync failed" });
    }
  });

  startScheduledSync();

  const distPath = join(process.cwd(), "dist");
  app.use(express.static(distPath, { maxAge: "1d" }));

  app.use((req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") {
      return next();
    }
    const indexPath = join(distPath, "index.html");
    res.sendFile(indexPath, (err) => {
      if (err && !res.headersSent) {
        res.status(404).send("Not found");
      }
    });
  });

  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error("[Error]", err.message || err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const PORT = process.env.PORT || 3001;
  const server = app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });

  server.keepAliveTimeout = 65_000;
  server.headersTimeout = 66_000;

  let shuttingDown = false;
  const cleanup = async (signal: string) => {
    if (shuttingDown) return;
    shuttingDown = true;
    console.log(`[Shutdown] ${signal} received`);

    const forceTimer = setTimeout(() => {
      console.error("[Shutdown] Forcing exit");
      process.exit(1);
    }, 10_000);

    server.close(async () => {
      try {
        stopScheduledSync();
        await closeAuth();
        await closePool();
      } catch {}
      clearTimeout(forceTimer);
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => cleanup("SIGTERM"));
  process.on("SIGINT", () => cleanup("SIGINT"));
}

main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
