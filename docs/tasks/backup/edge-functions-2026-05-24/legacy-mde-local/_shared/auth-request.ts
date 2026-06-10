/**
 * Small request-level auth helpers for Edge Functions.
 * Handlers keep CORS/error JSON local; compose with getUserClient / sponsor-access as needed.
 */
import { getUserId } from "./supabase-clients.ts";

/**
 * Normalized `Authorization: Bearer <token>` for `getUserId` / sponsor RLS helpers.
 * Case-insensitive `Bearer` prefix (matches sponsor handlers that accept `Bearer` / `bearer`).
 */
export function bearerAuthorizationHeader(req: Request): string | null {
  const raw = req.headers.get("Authorization")?.trim();
  if (!raw) return null;
  const m = raw.match(/^Bearer\s+(.+)$/i);
  const tokenPart = m?.[1]?.trim();
  if (!tokenPart) return null;
  return `Bearer ${tokenPart}`;
}

/** Resolved Supabase Auth user id, or null (missing header, anon-only, invalid JWT). */
export async function authenticatedUserIdFromRequest(req: Request): Promise<string | null> {
  const authHeader = bearerAuthorizationHeader(req);
  if (!authHeader) return null;
  return await getUserId(authHeader);
}

export type RequireUserResult =
  | { ok: true; userId: string; authorization: string }
  | { ok: false; status: 401; message: string };

/**
 * Require a Bearer token that resolves to a logged-in Supabase user (not anon session tricks).
 */
export async function requireAuthenticatedUser(req: Request): Promise<RequireUserResult> {
  const authorization = bearerAuthorizationHeader(req);
  if (!authorization) {
    return { ok: false, status: 401, message: "Missing or invalid Authorization" };
  }
  const userId = await getUserId(authorization);
  if (!userId) {
    return { ok: false, status: 401, message: "Invalid or expired token" };
  }
  return { ok: true, userId, authorization };
}
