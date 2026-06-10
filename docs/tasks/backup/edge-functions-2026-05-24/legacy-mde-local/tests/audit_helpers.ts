/**
 * Helpers for EDGE_FUNCTIONS_AUDIT=1 gateway HTTP tests.
 * Supabase gateway expects `Authorization: Bearer <anon JWT>` (eyJ…), not `sb_publishable_*` alone.
 */

import { assert } from "jsr:@std/assert@1";

export function auditIgnore(): boolean {
  const audit = Deno.env.get("EDGE_FUNCTIONS_AUDIT") === "1";
  return !(audit && anonJwtToken().length > 0);
}

export function baseUrl(): string {
  const u = Deno.env.get("SUPABASE_URL") ?? "http://127.0.0.1:54321";
  return u.replace(/\/$/, "");
}

/** eyJ… anon/service JWT (NOT sb_publishable_*). */
export function anonJwtToken(): string {
  const anon = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
  if (anon.includes(".") && anon.split(".").length === 3) return anon;
  return "";
}

export function publishableKey(): string {
  return (
    Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ??
      Deno.env.get("SUPABASE_ANON_KEY") ??
      ""
  );
}

export function serviceRoleKey(): string {
  return (
    Deno.env.get("SUPABASE_SECRET_KEY") ??
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ??
      ""
  );
}

export function edgeTestJwt(): string {
  return Deno.env.get("EDGE_TEST_USER_JWT")?.trim() ?? "";
}

export function rulesEngineSecret(): string {
  return (
    Deno.env.get("RULES_ENGINE_SECRET") ??
      Deno.env.get("RULES_ENGINE_CRON_SECRET") ??
      ""
  );
}

/** Fresh id per process so audit tests do not hit anon ai-chat rate limit on the same key. */
let _auditAnonSessionId: string | null = null;
export function auditAnonSessionId(): string {
  _auditAnonSessionId ??= Deno.env.get("EDGE_AUDIT_ANON_SESSION_ID")?.trim() ??
    crypto.randomUUID();
  return _auditAnonSessionId;
}

/** Anon gateway: same JWT in apikey + Authorization (local default). */
export function gatewayAnonHeaders(extra?: HeadersInit): Headers {
  const jwt = anonJwtToken();
  if (!jwt) throw new Error("Set SUPABASE_ANON_KEY to JWT from `supabase status -o env`");
  const h = new Headers(extra);
  h.set("apikey", jwt);
  if (!h.has("Authorization")) h.set("Authorization", `Bearer ${jwt}`);
  return h;
}

/** No Authorization (for negative tests). */
export function apikeyOnlyHeaders(extra?: HeadersInit): Headers {
  const jwt = anonJwtToken();
  if (!jwt) throw new Error("Set SUPABASE_ANON_KEY for apikey header");
  const h = new Headers(extra);
  h.set("apikey", jwt);
  if (!h.has("Content-Type")) h.set("Content-Type", "application/json");
  return h;
}

/** Authenticated user JWT — gateway still expects anon key in `apikey`. */
export function userJwtHeaders(accessJwt: string, extra?: HeadersInit): Headers {
  const anon = anonJwtToken();
  if (!anon) throw new Error("Set SUPABASE_ANON_KEY for gateway tests");
  const h = new Headers(extra);
  h.set("apikey", anon);
  h.set("Authorization", `Bearer ${accessJwt}`);
  if (!h.has("Content-Type")) h.set("Content-Type", "application/json");
  return h;
}

export function defaultHeaders(extra?: HeadersInit): Headers {
  return gatewayAnonHeaders(extra);
}

export function anonSessionHeaders(extra?: HeadersInit): Headers {
  const h = gatewayAnonHeaders(extra);
  h.set("X-Anon-Session-Id", auditAnonSessionId());
  return h;
}

export async function gatewayOptions(slug: string): Promise<number> {
  const url = `${baseUrl()}/functions/v1/${slug}`;
  const r = await fetch(url, {
    method: "OPTIONS",
    headers: gatewayAnonHeaders(),
  });
  await r.arrayBuffer();
  return r.status;
}

export async function gatewayPost(
  slug: string,
  body: BodyInit | null,
  hdr?: HeadersInit,
): Promise<{ status: number; text: string }> {
  const url = `${baseUrl()}/functions/v1/${slug}`;
  const headers = hdr instanceof Headers
    ? hdr
    : gatewayAnonHeaders(hdr);
  if (!(body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const r = await fetch(url, { method: "POST", headers, body });
  const text = await r.text();
  return { status: r.status, text };
}

export function parseJson(text: string): unknown {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { _raw: text };
  }
}

export function assertOkish(
  slug: string,
  status: number,
  acceptable: readonly number[],
) {
  assert(
    acceptable.includes(status),
    `${slug}: unexpected HTTP ${status}; expected one of ${acceptable.join(",")}`,
  );
}
