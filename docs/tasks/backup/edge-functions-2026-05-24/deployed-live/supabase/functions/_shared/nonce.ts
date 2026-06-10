/**
 * Short-lived nonce JWT for vote-cast L2 protection.
 *
 * Issued at page render by the /vote/:slug route (or a dedicated edge fn).
 * Verified in vote-cast before any DB write.
 *
 * If VOTE_NONCE_SECRET is not configured, all nonces pass — dev/staging only.
 */

const ALG = "HS256";
const TTL_SECONDS = 90; // 60s + 30s clock skew

function base64url(buf: ArrayBuffer | Uint8Array): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf instanceof ArrayBuffer ? buf : buf.buffer)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64urlDecode(s: string): Uint8Array {
  const padded = s.replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(padded);
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

export interface NoncePayload {
  contest_id: string;
  iat: number;
  exp: number;
  jti: string; // unique per nonce — for replay detection
}

/** Issue a signed nonce JWT for a given contest. */
export async function issueNonce(contestId: string): Promise<string> {
  const secret = Deno.env.get("VOTE_NONCE_SECRET");
  const now = Math.floor(Date.now() / 1000);
  const payload: NoncePayload = {
    contest_id: contestId,
    iat: now,
    exp: now + TTL_SECONDS,
    jti: crypto.randomUUID(),
  };
  const header = base64url(new TextEncoder().encode(JSON.stringify({ alg: ALG, typ: "JWT" })));
  const body = base64url(new TextEncoder().encode(JSON.stringify(payload)));
  const unsigned = `${header}.${body}`;

  if (!secret) {
    // No secret configured — return unsigned token (dev only)
    return `${unsigned}.unsigned`;
  }

  const key = await hmacKey(secret);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(unsigned));
  return `${unsigned}.${base64url(sig)}`;
}

export interface NonceVerifyResult {
  valid: boolean;
  payload?: NoncePayload;
  reason?: string;
}

/**
 * Verify a nonce token.
 * Returns {valid: true, payload} on success.
 * Returns {valid: false, reason} on any failure.
 *
 * If VOTE_NONCE_SECRET not configured, accepts "*.unsigned" tokens (dev).
 */
export async function verifyNonce(
  token: string | undefined,
  expectedContestId?: string,
): Promise<NonceVerifyResult> {
  const secret = Deno.env.get("VOTE_NONCE_SECRET");

  if (!token) {
    if (!secret) return { valid: true }; // dev mode: no secret, no token = ok
    return { valid: false, reason: "missing_nonce" };
  }

  const parts = token.split(".");
  if (parts.length !== 3) return { valid: false, reason: "malformed_nonce" };

  const [header, body, sig] = parts;

  // Dev mode: unsigned token
  if (!secret) {
    if (sig !== "unsigned") return { valid: false, reason: "expected_unsigned_in_dev" };
    try {
      const payload: NoncePayload = JSON.parse(
        new TextDecoder().decode(base64urlDecode(body)),
      );
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp < now) return { valid: false, reason: "nonce_expired" };
      if (expectedContestId && payload.contest_id !== expectedContestId) {
        return { valid: false, reason: "contest_mismatch" };
      }
      return { valid: true, payload };
    } catch {
      return { valid: false, reason: "parse_error" };
    }
  }

  // Production: verify HMAC
  try {
    const unsigned = `${header}.${body}`;
    const key = await hmacKey(secret);
    const sigBytes = base64urlDecode(sig);
    const ok = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes.buffer as ArrayBuffer,
      new TextEncoder().encode(unsigned).buffer as ArrayBuffer,
    );
    if (!ok) return { valid: false, reason: "invalid_signature" };

    const payload: NoncePayload = JSON.parse(
      new TextDecoder().decode(base64urlDecode(body)),
    );
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) return { valid: false, reason: "nonce_expired" };
    if (expectedContestId && payload.contest_id !== expectedContestId) {
      return { valid: false, reason: "contest_mismatch" };
    }
    return { valid: true, payload };
  } catch {
    return { valid: false, reason: "verify_error" };
  }
}
