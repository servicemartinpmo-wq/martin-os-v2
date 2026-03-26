import type { NextFunction, Request, Response } from "express";
import { createClient } from "@supabase/supabase-js";

interface SessionUser {
  claims?: { sub?: string; email?: string };
  expires_at?: number;
}

function getSessionUser(req: Request): SessionUser | null {
  const user = (req as unknown as { user?: SessionUser }).user;
  if (!user?.claims?.sub) return null;
  const now = Math.floor(Date.now() / 1000);
  if (user.expires_at && now > user.expires_at) return null;
  return user;
}

function getSupabaseClient() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    "";
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

async function resolveBearerUser(req: Request): Promise<{ id: string; email?: string } | null> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) return null;
  const token = authHeader.slice(7).trim();
  if (!token) return null;
  const client = getSupabaseClient();
  if (!client) return null;
  const { data, error } = await client.auth.getUser(token);
  if (error || !data?.user?.id) return null;
  return { id: data.user.id, email: data.user.email ?? undefined };
}

export async function resolveRequestIdentity(req: Request): Promise<{ profileId: string; email?: string } | null> {
  const sessionUser = getSessionUser(req);
  if (sessionUser?.claims?.sub) {
    return { profileId: sessionUser.claims.sub, email: sessionUser.claims.email };
  }
  const bearer = await resolveBearerUser(req);
  if (bearer) return { profileId: bearer.id, email: bearer.email };
  return null;
}

export async function requireApiAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const identity = await resolveRequestIdentity(req);
    if (!identity?.profileId) {
      return res.status(401).json({ error: "Authentication required" });
    }
    (req as unknown as { authProfileId?: string }).authProfileId = identity.profileId;
    (req as unknown as { authEmail?: string }).authEmail = identity.email;
    return next();
  } catch (error) {
    return res.status(401).json({ error: "Authentication required" });
  }
}
