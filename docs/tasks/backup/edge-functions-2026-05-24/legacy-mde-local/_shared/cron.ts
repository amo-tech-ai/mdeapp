import { errorBody, jsonResponse } from "./http.ts";

/**
 * When `CRON_SECRET` is set in project secrets, require `x-cron-secret` to match.
 * When unset (local/dev), no header check — still use POST + structured errors in handler.
 */
export function requireCronSecret(req: Request): Response | null {
  const cronSecret = Deno.env.get("CRON_SECRET");
  if (!cronSecret) return null;
  const requestSecret = req.headers.get("x-cron-secret");
  if (requestSecret !== cronSecret) {
    return jsonResponse(errorBody("FORBIDDEN", "Invalid or missing cron secret"), 403, req);
  }
  return null;
}
