/**
 * Founder-side moderation tokens — Landlord V1 D6.
 *
 * When listing-create produces a `needs_review` verdict, we email the
 * founder a one-click magic link to approve or reject the listing.
 * The link carries a signed token that authenticates the action without
 * requiring the founder to log in.
 *
 * Token shape (compact, URL-safe):
 *   <payload-b64u>.<sig-b64u>
 *
 * Payload (JSON, base64url):
 *   { lid: string, act: "approve" | "reject", iat: number, exp: number }
 *
 * Signature: HMAC-SHA256 over the payload bytes, keyed by
 * FOUNDER_MODERATION_SECRET.
 *
 * Why a custom token instead of a Supabase JWT?
 *   - The action isn't tied to a user account — it's tied to one listing.
 *   - We want a stable URL that works from any inbox, not just the one
 *     tied to a Supabase session.
 *   - JWT with HS256 over a shared secret is overkill for two fields.
 *
 * Replay protection: each token includes the listing_id + action. The
 * edge function returns 200 idempotently if the listing is already in
 * the target state, so re-clicks don't break anything.
 */

const TEXT_ENC = new TextEncoder();
const TEXT_DEC = new TextDecoder();

export interface ModerationTokenPayload {
  /** apartments.id — the listing being moderated. */
  lid: string;
  /** Founder action. */
  act: "approve" | "reject";
  /** Issued-at, seconds since epoch. */
  iat: number;
  /** Expiry, seconds since epoch. */
  exp: number;
}

export const TOKEN_DEFAULT_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days

function base64UrlEncode(bytes: Uint8Array): string {
  let str = "";
  for (let i = 0; i < bytes.length; i++) str += String.fromCharCode(bytes[i]);
  return btoa(str)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64UrlDecode(s: string): Uint8Array {
  const pad = "=".repeat((4 - (s.length % 4)) % 4);
  const b64 = (s + pad).replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

async function importHmacKey(secret: string): Promise<CryptoKey> {
  return await crypto.subtle.importKey(
    "raw",
    TEXT_ENC.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

/**
 * Constant-time comparison to thwart timing oracles on the signature.
 * Both inputs MUST be the same byte length; the caller pre-decodes both.
 */
function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

/** Sign a moderation payload. Returns `<payload-b64u>.<sig-b64u>`. */
export async function signModerationToken(
  payload: ModerationTokenPayload,
  secret: string,
): Promise<string> {
  if (!secret || secret.length < 32) {
    throw new Error("FOUNDER_MODERATION_SECRET must be ≥32 chars");
  }
  const key = await importHmacKey(secret);
  const payloadJson = JSON.stringify(payload);
  const payloadBytes = TEXT_ENC.encode(payloadJson);
  const sigBytes = new Uint8Array(
    await crypto.subtle.sign("HMAC", key, payloadBytes as BufferSource),
  );
  return `${base64UrlEncode(payloadBytes)}.${base64UrlEncode(sigBytes)}`;
}

export type VerifyResult =
  | { ok: true; payload: ModerationTokenPayload }
  | { ok: false; reason: "MALFORMED" | "BAD_SIGNATURE" | "EXPIRED" | "NOT_YET_VALID" };

/**
 * Verify a moderation token. Rejects malformed strings, bad signatures,
 * expired tokens, and tokens that claim to be issued in the future
 * (clock-skew sanity).
 */
export async function verifyModerationToken(
  token: string,
  secret: string,
  nowSeconds: number = Math.floor(Date.now() / 1000),
): Promise<VerifyResult> {
  if (typeof token !== "string" || !token.includes(".")) {
    return { ok: false, reason: "MALFORMED" };
  }
  const [payloadB64, sigB64] = token.split(".", 2);
  if (!payloadB64 || !sigB64) return { ok: false, reason: "MALFORMED" };

  let payloadBytes: Uint8Array;
  let sigBytes: Uint8Array;
  try {
    payloadBytes = base64UrlDecode(payloadB64);
    sigBytes = base64UrlDecode(sigB64);
  } catch {
    return { ok: false, reason: "MALFORMED" };
  }

  const key = await importHmacKey(secret);
  const expectedSig = new Uint8Array(
    await crypto.subtle.sign("HMAC", key, payloadBytes as BufferSource),
  );
  if (!constantTimeEqual(sigBytes, expectedSig)) {
    return { ok: false, reason: "BAD_SIGNATURE" };
  }

  let payload: ModerationTokenPayload;
  try {
    payload = JSON.parse(TEXT_DEC.decode(payloadBytes));
  } catch {
    return { ok: false, reason: "MALFORMED" };
  }
  if (
    typeof payload?.lid !== "string" ||
    (payload?.act !== "approve" && payload?.act !== "reject") ||
    typeof payload?.iat !== "number" ||
    typeof payload?.exp !== "number"
  ) {
    return { ok: false, reason: "MALFORMED" };
  }
  if (nowSeconds >= payload.exp) return { ok: false, reason: "EXPIRED" };
  // Allow 60 seconds of forward clock skew.
  if (nowSeconds + 60 < payload.iat) {
    return { ok: false, reason: "NOT_YET_VALID" };
  }

  return { ok: true, payload };
}

/** Build a moderation URL pointing at the deployed listing-moderate edge fn. */
export function buildModerationUrl(
  baseUrl: string,
  token: string,
): string {
  const u = new URL("/functions/v1/listing-moderate", baseUrl);
  u.searchParams.set("token", token);
  return u.toString();
}
