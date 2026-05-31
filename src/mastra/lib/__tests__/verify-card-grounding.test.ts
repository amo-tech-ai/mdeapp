import { describe, expect, it } from "vitest";
import { verifyCardGrounding } from "../verify-card-grounding";

describe("verifyCardGrounding — AI-004", () => {
  it("passes when cards have signal source", () => {
    const result = verifyCardGrounding([
      { id: "1", title: "Relato", signalSource: "venue_signals" },
    ]);
    expect(result.ok).toBe(true);
  });

  it("fails when top cards lack any attribution", () => {
    const result = verifyCardGrounding([{ id: "x", title: "Unknown" }]);
    expect(result.ok).toBe(false);
    expect(result.failures[0]).toContain("missing evidence");
  });
});
