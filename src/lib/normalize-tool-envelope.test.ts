import { describe, expect, it } from "vitest";
import { decodeToolJson, normalizeToolEnvelope } from "./normalize-tool-envelope";

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

  it("parses double-encoded JSON string results", () => {
    const inner = JSON.stringify({ results: [{ id: "3" }], total: 1 });
    const out = normalizeToolEnvelope(JSON.stringify(inner));
    expect(out.results).toHaveLength(1);
  });

  it("returns empty for invalid input", () => {
    expect(normalizeToolEnvelope(null).results).toBeUndefined();
    expect(normalizeToolEnvelope("not-json").results).toBeUndefined();
  });

  it("decodeToolJson unwraps double-encoded web-events payloads", () => {
    const payload = {
      citations: [{ title: "Event", url: "https://example.com/e" }],
      metadata: { reason: "router_skip" },
    };
    const decoded = decodeToolJson(JSON.stringify(JSON.stringify(payload)));
    expect(decoded).toEqual(payload);
  });
});
