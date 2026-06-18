import { describe, expect, it } from "vitest";
import {
  classifyHttpStatusForRentalFailure,
  classifyRentalSearchError,
  rentalFailureRecovery,
} from "@/lib/rental-failure-recovery";

describe("SAN-1059 · RE-FAIL-002 · rental failure recovery matrix", () => {
  it("maps Gemini 429 to rate-limit copy", () => {
    const r = rentalFailureRecovery(classifyHttpStatusForRentalFailure(429));
    expect(r.telemetryTag).toBe("gemini_rate_limited");
    expect(r.userMessage).toMatch(/try again/i);
  });

  it("maps 5xx to fast-path failed copy", () => {
    const r = rentalFailureRecovery(classifyHttpStatusForRentalFailure(503));
    expect(r.telemetryTag).toBe("fast_path_failed");
    expect(r.fallback).toBe("agent_once");
  });

  it("classifies timeout errors", () => {
    const kind = classifyRentalSearchError(new Error("request timeout"));
    expect(rentalFailureRecovery(kind).telemetryTag).toBe("gemini_parse_fallback");
  });

  it("covers all matrix rows with user-safe messages", () => {
    const kinds = [
      "gemini_timeout",
      "gemini_rate_limit",
      "supabase_slow",
      "supabase_error",
      "agui_stream_error",
      "map_pin_render",
      "schedule_viewing_api",
      "rental_search_api",
    ] as const;
    for (const kind of kinds) {
      const r = rentalFailureRecovery(kind);
      expect(r.userMessage.length).toBeGreaterThan(10);
      expect(r.telemetryTag).toBeTruthy();
    }
  });
});
