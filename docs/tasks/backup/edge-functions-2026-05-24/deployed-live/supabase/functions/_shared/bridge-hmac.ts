/**
 * Verifies an inbound bridge-signed request.
 *
 * Mirror of `docker/paperclip-bridge/app/lib/hmac.ts` — same secret, same envelope,
 * same 5-minute window. Used by Supabase edge functions that accept calls from
 * the Postgres `pg_net` trigger or the bridge container.
 *
 * Header contract:
 *   x-bridge-ts:  unix seconds
 *   x-bridge-sig: hex(hmac_sha256(BRIDGE_SECRET, `${ts}.${rawBody}`))
 */

const WINDOW_SEC = 300;

export type BridgeAuthError =
  | "MISSING_HEADER"
  | "STALE_TIMESTAMP"
  | "BAD_SIGNATURE"
  | "BRIDGE_SECRET_MISSING";

export interface BridgeAuthOk { ok: true; }
export interface BridgeAuthFail { ok: false; code: BridgeAuthError; reason?: string; }
export type BridgeAuthResult = BridgeAuthOk | BridgeAuthFail;

function timingSafeEqualHex(aHex: string, bBytes: Uint8Array): boolean {
  if (aHex.length !== bBytes.length * 2) return false;
  const a = new Uint8Array(bBytes.length);
  for (let i = 0; i < bBytes.length; i++) {
    const byte = parseInt(aHex.substr(i * 2, 2), 16);
    if (Number.isNaN(byte)) return false;
    a[i] = byte;
  }
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i]! ^ bBytes[i]!;
  return diff === 0;
}

async function hmacSha256(secret: string, message: Uint8Array): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, message);
  return new Uint8Array(sig);
}

/**
 * Verify the request. Caller must pass the *raw* body bytes (the same bytes
 * the trigger or bridge signed). Re-stringifying parsed JSON will not match.
 */
export async function verifyBridgeRequest(
  req: Request,
  rawBody: Uint8Array,
  opts: { secret?: string; nowSec?: () => number } = {},
): Promise<BridgeAuthResult> {
  const secret = opts.secret ?? Deno.env.get("BRIDGE_SECRET") ?? "";
  if (!secret || secret.length < 32) {
    return { ok: false, code: "BRIDGE_SECRET_MISSING" };
  }

  const ts = req.headers.get("x-bridge-ts");
  const sig = req.headers.get("x-bridge-sig");
  if (!ts || !sig) return { ok: false, code: "MISSING_HEADER" };

  const tsNum = Number(ts);
  const now = opts.nowSec ? opts.nowSec() : Math.floor(Date.now() / 1000);
  if (!Number.isFinite(tsNum) || Math.abs(now - tsNum) > WINDOW_SEC) {
    return { ok: false, code: "STALE_TIMESTAMP" };
  }

  const message = new Uint8Array(ts.length + 1 + rawBody.length);
  message.set(new TextEncoder().encode(`${ts}.`), 0);
  message.set(rawBody, ts.length + 1);

  const expected = await hmacSha256(secret, message);
  if (!timingSafeEqualHex(sig.toLowerCase(), expected)) {
    return { ok: false, code: "BAD_SIGNATURE" };
  }
  return { ok: true };
}
