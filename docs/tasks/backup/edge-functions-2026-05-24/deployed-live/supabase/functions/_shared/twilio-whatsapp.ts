/**
 * Twilio WhatsApp client for Supabase Edge Functions (Deno) — D11.5.
 *
 * Direct REST call to Twilio Messages API (no @twilio/sdk because Deno
 * + esm.sh wrappers add 200kB to bundle for one POST). Uses Basic auth
 * with `TWILIO_ACCOUNT_SID:TWILIO_AUTH_TOKEN`.
 *
 * Sandbox vs production:
 *   - Sandbox uses `TWILIO_SANDBOX_NUMBER` (always +14155238886).
 *     Recipient must have texted `join <code>` once to opt in.
 *   - Production uses your purchased + WA-enabled number
 *     (`TWILIO_PHONE_NUMBER`). Requires Meta Business verification +
 *     approved templates for outside-24h-window sends.
 *
 * Per-user request: NO retries, NO status callbacks, NO complex
 * tracking. Caller logs `whatsapp_sent_at` on its own UPDATE-RETURNING
 * for idempotency. If Twilio returns 4xx the lead is still in the
 * inbox — the landlord sees it on next dashboard open.
 */

const TWILIO_API_BASE = "https://api.twilio.com/2010-04-01";

export interface TwilioConfig {
  accountSid: string;
  /** Auth pair. Prefer API Key (SK… + secret); fall back to legacy
   * Account SID + Auth Token. The Twilio CLI uses API Keys exclusively
   * because they're rotatable + scoped. */
  username: string;
  password: string;
  /** From number — `whatsapp:` prefix added internally. */
  fromNumber: string;
}

export interface SendWhatsAppArgs {
  /** E.164 recipient (e.g. "+573001234567"). `whatsapp:` prefix added internally. */
  toE164: string;
  /** Message body (≤1600 chars; Twilio truncates at 1600). */
  body: string;
}

export interface SendWhatsAppResult {
  ok: boolean;
  /** Twilio message SID on success. */
  sid?: string;
  /** Twilio status (`queued` / `sent` / etc.). */
  status?: string;
  /** Numeric Twilio error code (e.g. 63016 = recipient not in sandbox). */
  errorCode?: number;
  /** Human-readable error from Twilio. */
  errorMessage?: string;
  /** HTTP status from Twilio (200/201 success, 400-class for client errors). */
  httpStatus?: number;
}

/** Pull config from edge-fn env. Caller decides sandbox vs production.
 * Auth precedence: API Key + Secret > Account SID + Auth Token. */
export function loadTwilioConfig(useSandbox: boolean): TwilioConfig | null {
  const accountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
  if (!accountSid) return null;
  const fromNumber = useSandbox
    ? Deno.env.get("TWILIO_SANDBOX_NUMBER")
    : Deno.env.get("TWILIO_PHONE_NUMBER");
  if (!fromNumber) return null;

  const apiKey = Deno.env.get("TWILIO_API_KEY");
  const apiSecret = Deno.env.get("TWILIO_API_SECRET");
  if (apiKey && apiSecret) {
    return { accountSid, username: apiKey, password: apiSecret, fromNumber };
  }
  const authToken = Deno.env.get("TWILIO_AUTH_TOKEN");
  if (authToken) {
    return { accountSid, username: accountSid, password: authToken, fromNumber };
  }
  return null;
}

/**
 * Send one freeform WhatsApp message. Fire-and-forget at the call site
 * (we never throw — caller decides whether to surface failures). Returns
 * `{ ok: false, ... }` on any non-2xx Twilio response so the caller can
 * log without try/catch noise.
 */
export async function sendWhatsApp(
  config: TwilioConfig,
  args: SendWhatsAppArgs,
): Promise<SendWhatsAppResult> {
  const url = `${TWILIO_API_BASE}/Accounts/${config.accountSid}/Messages.json`;
  const auth = btoa(`${config.username}:${config.password}`);

  const body = new URLSearchParams({
    From: `whatsapp:${normalizeE164(config.fromNumber)}`,
    To: `whatsapp:${normalizeE164(args.toE164)}`,
    Body: args.body.slice(0, 1600),
  });

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });
  } catch (err) {
    return {
      ok: false,
      errorMessage: `Twilio fetch failed: ${err instanceof Error ? err.message : String(err)}`,
    };
  }

  let json: Record<string, unknown> | null = null;
  try {
    json = await response.json();
  } catch {
    // Twilio returns JSON for both success + error. If parse fails the
    // response is unusable — surface the HTTP status.
  }

  if (response.ok) {
    return {
      ok: true,
      sid: json?.sid as string | undefined,
      status: json?.status as string | undefined,
      httpStatus: response.status,
    };
  }
  return {
    ok: false,
    errorCode: json?.code as number | undefined,
    errorMessage: (json?.message as string | undefined) ?? `HTTP ${response.status}`,
    httpStatus: response.status,
  };
}

/** Normalize "+57 300 123 4567" / "(+57) 300-123-4567" → "+573001234567". */
function normalizeE164(input: string): string {
  const trimmed = input.trim();
  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D+/g, "");
  return hasPlus ? `+${digits}` : digits;
}
