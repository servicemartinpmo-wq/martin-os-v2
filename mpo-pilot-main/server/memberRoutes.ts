import { Router, Request, Response } from "express";
import crypto from "crypto";
import { getPool } from "./db";
import { initMemberTables, TIER_MEMBER_LIMITS } from "./memberSchema";
import { requireApiAuth } from "./authBridge";

const router = Router();

let tablesReady = false;
async function ensureTables() {
  if (!tablesReady) {
    try { await initMemberTables(); tablesReady = true; }
    catch (e) { console.error("[Members] Table init error:", e); }
  }
}

function getOwnerId(req: Request): string | null {
  return ((req as any).authProfileId as string) || null;
}

function b64urlEncode(input: string) {
  return Buffer.from(input).toString("base64url");
}

function b64urlDecode(input: string) {
  return Buffer.from(input, "base64url").toString("utf8");
}

function inviteSecret() {
  return process.env.INVITE_TOKEN_SECRET || "dev-invite-secret-change-me";
}

function signInviteToken(ownerId: string, expiresInSeconds = 60 * 60 * 24 * 7) {
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const payload = b64urlEncode(JSON.stringify({ ownerId, exp }));
  const signature = crypto.createHmac("sha256", inviteSecret()).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

function verifyInviteToken(token: string): { ownerId: string; exp: number } | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payload, signature] = parts;
  const expected = crypto.createHmac("sha256", inviteSecret()).update(payload).digest("base64url");
  if (signature !== expected) return null;

  try {
    const decoded = JSON.parse(b64urlDecode(payload)) as { ownerId?: string; exp?: number };
    if (!decoded.ownerId || !decoded.exp) return null;
    if (decoded.exp < Math.floor(Date.now() / 1000)) return null;
    return { ownerId: decoded.ownerId, exp: decoded.exp };
  } catch {
    return null;
  }
}

router.use("/api/members", requireApiAuth);

// GET /api/members — list all members for the workspace
router.get("/api/members", async (req: Request, res: Response) => {
  try {
    await ensureTables();
    const ownerId = getOwnerId(req);
    if (!ownerId) return res.status(400).json({ error: "owner_id required" });

    const { rows } = await getPool().query(
      `SELECT * FROM workspace_members WHERE owner_id = $1 AND status != 'removed' ORDER BY
        CASE role WHEN 'owner' THEN 0 WHEN 'admin' THEN 1 WHEN 'manager' THEN 2 WHEN 'member' THEN 3 ELSE 4 END,
        invited_at ASC`,
      [ownerId]
    );
    res.json(rows);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// POST /api/members/invite — invite a new member
router.post("/api/members/invite", async (req: Request, res: Response) => {
  try {
    await ensureTables();
    const ownerId = getOwnerId(req);
    if (!ownerId) return res.status(401).json({ error: "Not authenticated" });

    const { email, name, role = "member", tier = "free" } = req.body;
    if (!email) return res.status(400).json({ error: "email is required" });

    // Enforce tier limits
    const limit = TIER_MEMBER_LIMITS[tier] ?? 1;
    const { rows: existing } = await getPool().query(
      `SELECT COUNT(*) as cnt FROM workspace_members WHERE owner_id = $1 AND status != 'removed'`,
      [ownerId]
    );
    const currentCount = parseInt(existing[0]?.cnt ?? "0", 10);
    if (currentCount >= limit) {
      return res.status(403).json({
        error: `Your ${tier} plan allows up to ${limit} member${limit === 1 ? "" : "s"}. Upgrade to add more.`,
        limitReached: true,
        limit,
        current: currentCount,
      });
    }

    const { rows } = await getPool().query(
      `INSERT INTO workspace_members (owner_id, email, name, role, status)
       VALUES ($1, $2, $3, $4, 'pending')
       ON CONFLICT (owner_id, email) DO UPDATE SET
         role = EXCLUDED.role, name = COALESCE(EXCLUDED.name, workspace_members.name),
         status = CASE WHEN workspace_members.status = 'removed' THEN 'pending' ELSE workspace_members.status END,
         updated_at = now()
       RETURNING *`,
      [ownerId, email.toLowerCase().trim(), name || null, role]
    );
    res.json(rows[0]);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// GET /api/members/invite-link — mint signed invite link
router.get("/api/members/invite-link", async (req: Request, res: Response) => {
  try {
    await ensureTables();
    const ownerId = getOwnerId(req);
    if (!ownerId) return res.status(400).json({ error: "owner_id required" });

    const token = signInviteToken(ownerId);
    res.json({ token, inviteUrl: `/auth?inviteToken=${encodeURIComponent(token)}` });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/members/resolve-invite — verify token and return destination owner/org id
router.get("/api/members/resolve-invite", async (req: Request, res: Response) => {
  try {
    await ensureTables();
    const token = (req.query.token as string) || "";
    if (!token) return res.status(400).json({ error: "token required" });

    const parsed = verifyInviteToken(token);
    if (!parsed) return res.status(400).json({ error: "invalid_or_expired_token" });

    res.json({ organization_id: parsed.ownerId, exp: parsed.exp });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// PUT /api/members/:id — update role or status
router.put("/api/members/:id", async (req: Request, res: Response) => {
  try {
    await ensureTables();
    const ownerId = getOwnerId(req);
    if (!ownerId) return res.status(401).json({ error: "Not authenticated" });

    const { role, name, status } = req.body;
    const fields: string[] = [];
    const vals: unknown[] = [req.params.id, ownerId];
    let i = 3;
    if (role)   { fields.push(`role = $${i++}`);   vals.push(role); }
    if (name)   { fields.push(`name = $${i++}`);   vals.push(name); }
    if (status) { fields.push(`status = $${i++}`); vals.push(status); }
    if (!fields.length) return res.status(400).json({ error: "Nothing to update" });
    fields.push(`updated_at = now()`);

    const { rows } = await getPool().query(
      `UPDATE workspace_members SET ${fields.join(", ")} WHERE id = $1 AND owner_id = $2 AND role != 'owner' RETURNING *`,
      vals
    );
    rows.length ? res.json(rows[0]) : res.status(404).json({ error: "Member not found or cannot edit owner" });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

// DELETE /api/members/:id — soft-remove a member
router.delete("/api/members/:id", async (req: Request, res: Response) => {
  try {
    await ensureTables();
    const ownerId = getOwnerId(req);
    if (!ownerId) return res.status(401).json({ error: "Not authenticated" });

    const { rows } = await getPool().query(
      `UPDATE workspace_members SET status = 'removed', updated_at = now()
       WHERE id = $1 AND owner_id = $2 AND role != 'owner' RETURNING id`,
      [req.params.id, ownerId]
    );
    rows.length ? res.json({ ok: true }) : res.status(404).json({ error: "Member not found or cannot remove owner" });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

export default router;
