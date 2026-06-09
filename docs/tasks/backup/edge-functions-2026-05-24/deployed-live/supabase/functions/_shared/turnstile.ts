/** Cloudflare Turnstile server-side token verification. */

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export interface TurnstileResult {
  success: boolean;
  /** ISO timestamp of the challenge */
  challenge_ts?: string;
  hostname?: string;
  "error-codes"?: string[];
}

/**
 * Verify a Turnstile widget token server-side.
 * Returns true when valid; false on failure or network error.
 *
 * If TURNSTILE_SECRET_KEY is not configured, returns true so dev/staging
 * environments work without a Turnstile account.
 */
export async function verifyTurnstile(
  token: string | undefined,
  remoteip?: string,
): Promise<boolean> {
  const secret = Deno.env.get("TURNSTILE_SECRET_KEY");
  if (!secret) return true; // not configured — allow (dev/staging)
  if (!token) return false;

  const body = new URLSearchParams({ secret, response: token });
  if (remoteip) body.set("remoteip", remoteip);

  try {
    const res = await fetch(VERIFY_URL, { method: "POST", body });
    const data: TurnstileResult = await res.json();
    return data.success === true;
  } catch {
    // Fail open — Cloudflare outage should not block all voting
    console.error("Turnstile verify network error — failing open");
    return true;
  }
}
