/**
 * Minimal HS256 JWT sign + verify for Supabase Edge Functions (Deno).
 */

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64UrlEncodeString(str: string): string {
  return base64UrlEncode(encoder.encode(str));
}

function base64UrlDecode(input: string): Uint8Array {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  const padLen = (4 - (padded.length % 4)) % 4;
  const binary = atob(padded + "=".repeat(padLen));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function base64UrlDecodeToString(input: string): string {
  return decoder.decode(base64UrlDecode(input));
}

const keyCache = new Map<string, CryptoKey>();

async function importHmacKey(secret: string, usage: KeyUsage): Promise<CryptoKey> {
  const cacheKey = `${secret}::${usage}`;
  const cached = keyCache.get(cacheKey);
  if (cached) return cached;

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    [usage],
  );
  keyCache.set(cacheKey, key);
  return key;
}

export type JwtPayload = Record<string, unknown> & {
  iat?: number;
  exp?: number;
  nbf?: number;
};

export async function signJwtHs256(
  payload: JwtPayload,
  secret: string,
): Promise<string> {
  if (!secret) throw new Error("JWT secret is required");
  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = base64UrlEncodeString(JSON.stringify(header));
  const encodedPayload = base64UrlEncodeString(JSON.stringify(payload));
  const data = `${encodedHeader}.${encodedPayload}`;

  const key = await importHmacKey(secret, "sign");
  const sigBytes = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  const encodedSignature = base64UrlEncode(new Uint8Array(sigBytes));
  return `${data}.${encodedSignature}`;
}

export type VerifyFailureReason =
  | "MALFORMED"
  | "BAD_HEADER"
  | "BAD_ALG"
  | "BAD_SIGNATURE"
  | "EXPIRED"
  | "NOT_YET_VALID"
  | "SECRET_MISSING";

export type VerifyResult<T extends JwtPayload = JwtPayload> =
  | { valid: true; payload: T }
  | { valid: false; reason: VerifyFailureReason };

export async function verifyJwtHs256<T extends JwtPayload = JwtPayload>(
  token: string,
  secret: string,
  options: { now?: number; clockSkewSec?: number } = {},
): Promise<VerifyResult<T>> {
  if (!secret) return { valid: false, reason: "SECRET_MISSING" };
  const parts = token.split(".");
  if (parts.length !== 3) return { valid: false, reason: "MALFORMED" };
  const [encodedHeader, encodedPayload, encodedSignature] = parts;

  let header: { alg?: string; typ?: string };
  try {
    header = JSON.parse(base64UrlDecodeToString(encodedHeader));
  } catch {
    return { valid: false, reason: "BAD_HEADER" };
  }
  if (header.alg !== "HS256") return { valid: false, reason: "BAD_ALG" };

  const data = `${encodedHeader}.${encodedPayload}`;
  const key = await importHmacKey(secret, "verify");
  const sigBytes = base64UrlDecode(encodedSignature);
  const signature = new Uint8Array(sigBytes);
  const ok = await crypto.subtle.verify(
    "HMAC",
    key,
    signature,
    encoder.encode(data),
  );
  if (!ok) return { valid: false, reason: "BAD_SIGNATURE" };

  let payload: T;
  try {
    payload = JSON.parse(base64UrlDecodeToString(encodedPayload)) as T;
  } catch {
    return { valid: false, reason: "MALFORMED" };
  }

  const now = options.now ?? Math.floor(Date.now() / 1000);
  const skew = options.clockSkewSec ?? 30;

  if (typeof payload.exp === "number" && payload.exp + skew < now) {
    return { valid: false, reason: "EXPIRED" };
  }
  if (typeof payload.nbf === "number" && payload.nbf - skew > now) {
    return { valid: false, reason: "NOT_YET_VALID" };
  }

  return { valid: true, payload };
}
