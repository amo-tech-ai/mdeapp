import type { NextRequest } from "next/server";

/**
 * CopilotKit Cloud sends `Authorization: Bearer ${COPILOTKIT_API_KEY}`.
 * Pattern 1 (same-origin `/api/copilotkit`) sends no Bearer from the browser.
 */
function isSameOriginBrowserRequest(req: NextRequest): boolean {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");

  if (configured) {
    if (origin === configured) return true;
    if (referer?.startsWith(`${configured}/`) || referer === configured) {
      return true;
    }
  }

  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (!host || !origin) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export function assertCopilotKitAuthorized(req: NextRequest): Response | null {
  const expectedKey = process.env.COPILOTKIT_API_KEY;
  if (!expectedKey) return null;

  const authHeader = req.headers.get("authorization");
  if (authHeader === `Bearer ${expectedKey}`) return null;

  if (isSameOriginBrowserRequest(req)) return null;

  if (process.env.NODE_ENV !== "production") return null;

  return new Response("Unauthorized", { status: 401 });
}
