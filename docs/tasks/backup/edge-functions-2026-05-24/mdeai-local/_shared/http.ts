/** Shared JSON + CORS helpers for Supabase Edge Functions (Deno). */

const IS_PRODUCTION = Deno.env.get("ENVIRONMENT") === "production";

/** Exact allowlist (production + known staging). */
const ALLOWED_ORIGINS: string[] = [
  "https://mdeai.co",
  "https://www.mdeai.co",
  "https://medell-n-connect.vercel.app",
];

if (!IS_PRODUCTION) {
  ALLOWED_ORIGINS.push(
    "http://localhost:8080",
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:8080",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://[::1]:8080",
    "http://[::1]:5173",
  );
}

const EXTRA = Deno.env.get("CORS_EXTRA_ORIGINS");
if (EXTRA) {
  for (const o of EXTRA.split(",").map((s) => s.trim()).filter(Boolean)) {
    ALLOWED_ORIGINS.push(o);
  }
}

function isVercelAppOrigin(origin: string): boolean {
  try {
    const u = new URL(origin);
    return u.protocol === "https:" && u.hostname.endsWith(".vercel.app");
  } catch {
    return false;
  }
}

function isLocalDevOrigin(origin: string): boolean {
  if (IS_PRODUCTION) return false;
  try {
    const u = new URL(origin);
    if (u.protocol !== "http:" && u.protocol !== "https:") return false;
    return (
      u.hostname === "localhost" ||
      u.hostname === "127.0.0.1" ||
      u.hostname === "[::1]"
    );
  } catch {
    return false;
  }
}

export function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return true;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  if (isVercelAppOrigin(origin)) return true;
  if (isLocalDevOrigin(origin)) return true;
  return false;
}

function resolveAllowOrigin(origin: string | null): string {
  if (!origin) return ALLOWED_ORIGINS[0];
  if (isOriginAllowed(origin)) return origin;
  return ALLOWED_ORIGINS[0];
}

export function getCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("origin");
  return {
    "Access-Control-Allow-Origin": resolveAllowOrigin(origin),
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type, x-anon-session-id",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

export const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGINS[0],
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-anon-session-id",
  "Access-Control-Max-Age": "86400",
  Vary: "Origin",
};

export function jsonResponse(
  body: Record<string, unknown>,
  status = 200,
  req?: Request,
): Response {
  const headers = req ? getCorsHeaders(req) : corsHeaders;
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...headers, "Content-Type": "application/json" },
  });
}

export function errorBody(
  code: string,
  message: string,
  details?: unknown,
): { success: false; error: { code: string; message: string; details?: unknown } } {
  return {
    success: false as const,
    error: {
      code,
      message,
      ...(details !== undefined ? { details } : {}),
    },
  };
}

export function httpStatusFromP1AtomicRpcError(err: {
  message?: string;
  code?: string;
}): number {
  const code = err.code ?? "";
  const msg = err.message ?? "";
  if (
    code === "P0001" &&
    (msg.includes("p1_schedule_tour_atomic:") ||
      msg.includes("p1_start_rental_application_atomic:"))
  ) {
    return 409;
  }
  return 500;
}
