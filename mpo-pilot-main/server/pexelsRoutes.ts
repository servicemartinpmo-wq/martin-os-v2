import type { Express, Request, Response } from "express";

const PEXELS_PHOTOS = "https://api.pexels.com/v1";
const PEXELS_VIDEOS = "https://api.pexels.com/videos";

/**
 * Proxies Pexels API so `PEXELS_API_KEY` stays off the client.
 * Static showroom URLs do not hit these routes — only use when building dynamic search/curation.
 */
export function registerPexelsRoutes(app: Express): void {
  app.get("/api/pexels/search", async (req: Request, res: Response) => {
    const key = process.env.PEXELS_API_KEY;
    if (!key) {
      return res.status(503).json({ error: "PEXELS_API_KEY is not configured on the server" });
    }
    const query = typeof req.query.query === "string" ? req.query.query : "business";
    const perPage = Math.min(80, Math.max(1, Number(req.query.per_page) || 15));
    const page = Math.max(1, Number(req.query.page) || 1);
    const url = `${PEXELS_PHOTOS}/search?query=${encodeURIComponent(query)}&per_page=${perPage}&page=${page}`;
    try {
      const r = await fetch(url, { headers: { Authorization: key } });
      const text = await r.text();
      res.status(r.status).type("application/json").send(text);
    } catch (e) {
      console.error("[Pexels] search proxy error:", e);
      res.status(502).json({ error: "Pexels request failed" });
    }
  });

  app.get("/api/pexels/curated", async (req: Request, res: Response) => {
    const key = process.env.PEXELS_API_KEY;
    if (!key) {
      return res.status(503).json({ error: "PEXELS_API_KEY is not configured on the server" });
    }
    const perPage = Math.min(80, Math.max(1, Number(req.query.per_page) || 15));
    const page = Math.max(1, Number(req.query.page) || 1);
    const url = `${PEXELS_PHOTOS}/curated?per_page=${perPage}&page=${page}`;
    try {
      const r = await fetch(url, { headers: { Authorization: key } });
      const text = await r.text();
      res.status(r.status).type("application/json").send(text);
    } catch (e) {
      console.error("[Pexels] curated proxy error:", e);
      res.status(502).json({ error: "Pexels request failed" });
    }
  });

  app.get("/api/pexels/videos/search", async (req: Request, res: Response) => {
    const key = process.env.PEXELS_API_KEY;
    if (!key) {
      return res.status(503).json({ error: "PEXELS_API_KEY is not configured on the server" });
    }
    const query = typeof req.query.query === "string" ? req.query.query : "business";
    const perPage = Math.min(80, Math.max(1, Number(req.query.per_page) || 12));
    const page = Math.max(1, Number(req.query.page) || 1);
    const url = `${PEXELS_VIDEOS}/search?query=${encodeURIComponent(query)}&per_page=${perPage}&page=${page}`;
    try {
      const r = await fetch(url, { headers: { Authorization: key } });
      const text = await r.text();
      res.status(r.status).type("application/json").send(text);
    } catch (e) {
      console.error("[Pexels] video search proxy error:", e);
      res.status(502).json({ error: "Pexels video request failed" });
    }
  });

  app.get("/api/pexels/videos/popular", async (req: Request, res: Response) => {
    const key = process.env.PEXELS_API_KEY;
    if (!key) {
      return res.status(503).json({ error: "PEXELS_API_KEY is not configured on the server" });
    }
    const perPage = Math.min(80, Math.max(1, Number(req.query.per_page) || 12));
    const page = Math.max(1, Number(req.query.page) || 1);
    const url = `${PEXELS_VIDEOS}/popular?per_page=${perPage}&page=${page}`;
    try {
      const r = await fetch(url, { headers: { Authorization: key } });
      const text = await r.text();
      res.status(r.status).type("application/json").send(text);
    } catch (e) {
      console.error("[Pexels] video popular proxy error:", e);
      res.status(502).json({ error: "Pexels video request failed" });
    }
  });
}
