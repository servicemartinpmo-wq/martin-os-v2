import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;
  const API_ORIGIN = process.env.API_ORIGIN || "http://127.0.0.1:3001";

  app.use(express.json());

  // Reverse proxy all /api/* to Next API service.
  // This keeps the Vite UI on :3000 while Next APIs run on :3001.
  app.use("/api", async (req, res) => {
    const url = new URL(req.originalUrl, API_ORIGIN);
    const headers: Record<string, string> = {};

    for (const [k, v] of Object.entries(req.headers)) {
      if (typeof v === "string") headers[k] = v;
      if (Array.isArray(v)) headers[k] = v.join(",");
    }

    // Ensure correct host/proto info passes through.
    headers["x-forwarded-host"] = headers["x-forwarded-host"] || headers["host"] || "localhost";
    headers["x-forwarded-proto"] = headers["x-forwarded-proto"] || "http";
    delete headers["host"];

    const body =
      req.method === "GET" || req.method === "HEAD" ? undefined : JSON.stringify(req.body ?? {});

    try {
      const upstream = await fetch(url, {
        method: req.method,
        headers: {
          ...headers,
          ...(body ? { "content-type": headers["content-type"] || "application/json" } : {}),
        },
        body,
        redirect: "manual",
      });

      res.status(upstream.status);
      upstream.headers.forEach((value, key) => {
        if (key.toLowerCase() === "transfer-encoding") return;
        res.setHeader(key, value);
      });

      const buf = Buffer.from(await upstream.arrayBuffer());
      res.send(buf);
    } catch (err: any) {
      res.status(502).json({
        ok: false,
        error: "api_proxy_failed",
        message: err?.message || String(err),
        upstream: API_ORIGIN,
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Martin-OS Server running on http://localhost:${PORT}`);
    console.log(`Proxying /api/* -> ${API_ORIGIN}`);
  });
}

startServer();
