/** Retry policy for transient Places API (New) failures — MAP-004b. */

export const PLACES_RETRY = {
  MAX_ATTEMPTS: 3,
  BASE_DELAY_MS: 300,
  MAX_DELAY_MS: 2_000,
} as const;

export function isRetryablePlacesError(err: unknown): boolean {
  if (!err || typeof err !== "object") {
    const msg = String(err).toLowerCase();
    return (
      msg.includes("429") ||
      msg.includes("500") ||
      msg.includes("503")
    );
  }

  const e = err as Record<string, unknown>;
  const code = e.code ?? e.status ?? e.statusCode;
  if (
    code === 429 ||
    code === 500 ||
    code === 503 ||
    code === 8 ||
    code === 13 ||
    code === 14
  ) {
    return true;
  }

  const msg = String(e.message ?? err).toLowerCase();
  return (
    msg.includes("429") ||
    msg.includes("500") ||
    msg.includes("503") ||
    msg.includes("resource exhausted") ||
    msg.includes("unavailable") ||
    msg.includes("internal") ||
    msg.includes("deadline exceeded")
  );
}

/** Exponential backoff with 50–150% jitter to reduce retry storms. */
export function placesRetryDelayMs(attempt: number): number {
  const base = Math.min(
    PLACES_RETRY.BASE_DELAY_MS * 2 ** attempt,
    PLACES_RETRY.MAX_DELAY_MS,
  );
  return Math.round(base * (0.5 + Math.random()));
}

export async function withPlacesRetry<T>(
  fn: () => Promise<T>,
): Promise<T> {
  let lastErr: unknown;

  for (let attempt = 0; attempt < PLACES_RETRY.MAX_ATTEMPTS; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      const canRetry =
        attempt < PLACES_RETRY.MAX_ATTEMPTS - 1 &&
        isRetryablePlacesError(err);
      if (!canRetry) {
        throw err;
      }
      await new Promise((resolve) =>
        setTimeout(resolve, placesRetryDelayMs(attempt)),
      );
    }
  }

  throw lastErr;
}
