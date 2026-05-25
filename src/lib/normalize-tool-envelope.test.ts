import { describe, expect, it } from "vitest";
import { normalizeToolEnvelope } from "./normalize-tool-envelope";

describe("normalizeToolEnvelope", () => {
  it("passes through object results", () => {
    const out = normalizeToolEnvelope({
      results: [{ id: "1", title: "Test" }],
      total: 1,
    });
    expect(out.results).toHaveLength(1);
  });

  it("parses JSON string results", () => {
    const out = normalizeToolEnvelope(
      JSON.stringify({ results: [{ id: "2" }], total: 1 }),
    );
    expect(out.results).toHaveLength(1);
  });

  it("returns empty for invalid input", () => {
    expect(normalizeToolEnvelope(null).results).toBeUndefined();
    expect(normalizeToolEnvelope("not-json").results).toBeUndefined();
  });
});
