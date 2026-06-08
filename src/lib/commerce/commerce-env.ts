/**
 * ECOM-C-007 — mdeapp commerce bridge env (server-side only).
 * Uses publishable key + API URL only; never Stripe secret keys.
 */

export class CommerceEnvError extends Error {
  readonly code = "COMMERCE_ENV_INVALID" as const;

  constructor(message: string) {
    super(message);
    this.name = "CommerceEnvError";
  }
}

export type CommerceEnv = {
  apiUrl: string;
  publishableKey: string;
};

const SECRET_KEY_PATTERNS = [/^sk_(test|live)_/i, /^whsec_/i];

function stripTrailingSlash(url: string): string {
  return url.replace(/\/+$/, "");
}

function assertPublishableKey(key: string): void {
  if (!key.trim()) {
    throw new CommerceEnvError("COMMERCE_PUBLISHABLE_KEY is required");
  }
  if (SECRET_KEY_PATTERNS.some((re) => re.test(key))) {
    throw new CommerceEnvError(
      "COMMERCE_PUBLISHABLE_KEY must be a publishable key (pk_*), not a secret",
    );
  }
  if (key.startsWith("sk_")) {
    throw new CommerceEnvError(
      "COMMERCE_PUBLISHABLE_KEY must not be a Stripe secret key (sk_*)",
    );
  }
  if (!key.startsWith("pk_")) {
    throw new CommerceEnvError(
      "COMMERCE_PUBLISHABLE_KEY must be a publishable key (pk_*)",
    );
  }
}

function assertApiUrl(url: string): void {
  if (!url.trim()) {
    throw new CommerceEnvError("COMMERCE_API_URL is required");
  }
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new CommerceEnvError(`COMMERCE_API_URL is not a valid URL: ${url}`);
  }
  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new CommerceEnvError(
      `COMMERCE_API_URL must use http or https (got ${parsed.protocol})`,
    );
  }
}

/**
 * Reads commerce env from process.env. Pass `source` in tests to avoid mutating process.env.
 */
export function readCommerceEnv(
  source: Record<string, string | undefined> = process.env,
): CommerceEnv {
  const apiUrl = stripTrailingSlash(
    (source.COMMERCE_API_URL ?? "").trim(),
  );
  const publishableKey = (source.COMMERCE_PUBLISHABLE_KEY ?? "").trim();

  assertApiUrl(apiUrl);
  assertPublishableKey(publishableKey);

  return { apiUrl, publishableKey };
}
