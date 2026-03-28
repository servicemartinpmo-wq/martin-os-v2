import { describe, it, expect, vi } from "vitest";
import express from "express";
import request from "supertest";
import type { NextFunction, Request, Response } from "express";

import { requireApiAuth } from "../../server/authBridge";
import memberRoutes from "../../server/memberRoutes";
import moduleRoutes from "../../server/moduleRoutes";
import workflowRoutes from "../../server/workflowRoutes";

describe("requireApiAuth middleware", () => {
  it("returns 401 when identity is missing", async () => {
    const req = { headers: {} } as Request;
    const status = vi.fn().mockReturnThis();
    const json = vi.fn().mockReturnThis();
    const res = { status, json } as unknown as Response;
    const next = vi.fn() as unknown as NextFunction;

    await requireApiAuth(req, res, next);

    expect(status).toHaveBeenCalledWith(401);
    expect(json).toHaveBeenCalledWith({ error: "Authentication required" });
    expect(next).not.toHaveBeenCalled();
  });

  it("accepts valid session user and sets authProfileId", async () => {
    const req = {
      headers: {},
      user: {
        claims: { sub: "profile-123", email: "user@example.com" },
        expires_at: Math.floor(Date.now() / 1000) + 60,
      },
    } as unknown as Request;
    const status = vi.fn().mockReturnThis();
    const json = vi.fn().mockReturnThis();
    const res = { status, json } as unknown as Response;
    const next = vi.fn() as unknown as NextFunction;

    await requireApiAuth(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect((req as unknown as { authProfileId?: string }).authProfileId).toBe("profile-123");
  });
});

describe("API route auth guards", () => {
  function createApp() {
    const app = express();
    app.use(express.json());
    app.use(memberRoutes);
    app.use(moduleRoutes);
    app.use(workflowRoutes);
    return app;
  }

  it("blocks unauthenticated member routes", async () => {
    const app = createApp();
    const res = await request(app).get("/api/members");
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: "Authentication required" });
  });

  it("blocks unauthenticated module routes", async () => {
    const app = createApp();
    const res = await request(app).get("/api/agile/stories");
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: "Authentication required" });
  });

  it("blocks unauthenticated workflow run route", async () => {
    const app = createApp();
    const res = await request(app).post("/api/workflows/run").send({ workflowId: "wf-1" });
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: "Authentication required" });
  });
});

