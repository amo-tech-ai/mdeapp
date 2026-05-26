import { describe, expect, it, vi } from "vitest";
import {
  isRetryablePlacesError,
  placesRetryDelayMs,
  withPlacesRetry,
} from "../places-retry";

describe("isRetryablePlacesError", () => {
  it("detects gRPC RESOURCE_EXHAUSTED", () => {
    expect(isRetryablePlacesError({ code: 8, message: "quota" })).toBe(true);
  });

  it("detects HTTP 429 in message", () => {
    expect(isRetryablePlacesError(new Error("HTTP 429 Too Many Requests"))).toBe(
      true,
    );
  });

  it("rejects validation errors", () => {
    expect(isRetryablePlacesError({ code: 3, message: "invalid argument" })).toBe(
      false,
    );
  });

  it("uses jittered backoff delay within bounds", () => {
    const d0 = placesRetryDelayMs(0);
    expect(d0).toBeGreaterThanOrEqual(150);
    expect(d0).toBeLessThanOrEqual(450);
  });
});

describe("withPlacesRetry", () => {
  it("retries then succeeds on transient error", async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error("HTTP 429"))
      .mockResolvedValueOnce({ ok: true });

    await expect(withPlacesRetry(fn)).resolves.toEqual({ ok: true });
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("does not retry non-retryable errors", async () => {
    const fn = vi.fn().mockRejectedValue(new Error("invalid place id"));

    await expect(withPlacesRetry(fn)).rejects.toThrow("invalid place id");
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
