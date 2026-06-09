/** Shared JSON + CORS helpers for Supabase Edge Functions (Deno). */ const IS_PRODUCTION = Deno.env.get("ENVIRONMENT") === "production";
/** Exact allowlist (production + known staging). */ const ALLOWED_ORIGINS = [
  "https://mdeai.co",
  "https://www.mdeai.co",
  "https://medell-n-connect.vercel.app"
];
// Common local dev origins (any port allowed via isAllowedOrigin when not production)
if (!IS_PRODUCTION) {
  ALLOWED_ORIGINS.push("http://localhost:8080", "http://localhost:5173", "http://127.0.0.1:8080", "http://127.0.0.1:5173", "http://[::1]:8080", "http://[::1]:5173");
}
const EXTRA = Deno.env.get("CORS_EXTRA_ORIGINS");
if (EXTRA) {
  for (const o of EXTRA.split(",").map((s)=>s.trim()).filter(Boolean)){
    ALLOWED_ORIGINS.push(o);
  }
}
/**
 * Vercel production + preview deployments use https://*.vercel.app
 * (preview URLs differ from the production hostname medell-n-connect.vercel.app).
 */ function isVercelAppOrigin(origin) {
  try {
    const u = new URL(origin);
    return u.protocol === "https:" && u.hostname.endsWith(".vercel.app");
  } catch  {
    return false;
  }
}
/** Local HTTP(S) for dev only — any port. */ function isLocalDevOrigin(origin) {
  if (IS_PRODUCTION) return false;
  try {
    const u = new URL(origin);
    if (u.protocol !== "http:" && u.protocol !== "https:") return false;
    return u.hostname === "localhost" || u.hostname === "127.0.0.1" || u.hostname === "[::1]";
  } catch  {
    return false;
  }
}
/** Whether the browser Origin header is allowed to call our functions with CORS. */ export function isOriginAllowed(origin) {
  if (!origin) return true; // non-browser / same-origin tools — header omitted
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  if (isVercelAppOrigin(origin)) return true;
  if (isLocalDevOrigin(origin)) return true;
  return false;
}
/**
 * Echo request origin when allowed (required for credentialed / browser checks).
 * When Origin is missing, use primary site.
 * When Origin is present but not allowed, still return primary (browser will block — do not echo untrusted origins).
 */ function resolveAllowOrigin(origin) {
  if (!origin) return ALLOWED_ORIGINS[0];
  if (isOriginAllowed(origin)) return origin;
  return ALLOWED_ORIGINS[0];
}
/**
 * Build CORS headers for a given request.
 * Use this in both OPTIONS preflight and actual responses.
 *
 * Access-Control-Allow-Methods is REQUIRED on preflight — without it
 * browsers silently abort the follow-up POST (server logs show OPTIONS
 * 204 with no matching POST). X-Anon-Session-Id is added to Allow-Headers
 * for the anon-visitor 3-message gate.
 */ export function getCorsHeaders(req) {
  const origin = req.headers.get("origin");
  return {
    "Access-Control-Allow-Origin": resolveAllowOrigin(origin),
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-anon-session-id",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin"
  };
}
/**
 * @deprecated Use getCorsHeaders(req) instead — static headers break www/preview/localhost.
 * Kept for backward compatibility during migration. Full Methods + Vary set so
 * accidental use doesn't silently kill browser POSTs.
 */ export const corsHeaders = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGINS[0],
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-anon-session-id",
  "Access-Control-Max-Age": "86400",
  "Vary": "Origin"
};
export function jsonResponse(body, status = 200, req) {
  const headers = req ? getCorsHeaders(req) : corsHeaders;
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...headers,
      "Content-Type": "application/json"
    }
  });
}
export function errorBody(code, message, details) {
  return {
    success: false,
    error: {
      code,
      message,
      ...details !== undefined ? {
        details
      } : {}
    }
  };
}
/**
 * Maps Postgres `RAISE EXCEPTION` from P1 atomic RPCs (ERRCODE P0001) to HTTP 409.
 * Other DB errors stay 500 — callers still log `rpcErr`.
 */ export function httpStatusFromP1AtomicRpcError(err) {
  const code = err.code ?? "";
  const msg = err.message ?? "";
  if (code === "P0001" && (msg.includes("p1_schedule_tour_atomic:") || msg.includes("p1_start_rental_application_atomic:"))) {
    return 409;
  }
  return 500;
}
