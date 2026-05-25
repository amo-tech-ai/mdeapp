import { describe, expect, it } from "vitest";
import { ApprovalCommitInputSchema } from "@/lib/events/approval-commit-schema";
import { slugifyEventTitle } from "@/lib/events/slugify-event-title";

describe("approval-commit schema", () => {
  it("rejects invalid decision", () => {
    const result = ApprovalCommitInputSchema.safeParse({
      decision: "maybe",
      draft: { title: "Test" },
    });
    expect(result.success).toBe(false);
  });

  it("accepts approved payload", () => {
    const result = ApprovalCommitInputSchema.safeParse({
      decision: "approved",
      draft: {
        title: "Mixer",
        neighborhood: "Poblado",
        dateIso: "2026-03-15T19:00:00-05:00",
        venue: "Roof",
        capacity: 100,
        priceMinCop: 50000,
      },
    });
    expect(result.success).toBe(true);
  });
});

describe("slugifyEventTitle", () => {
  it("produces lowercase hyphenated slug with suffix", () => {
    const slug = slugifyEventTitle("Startup Mixer 2026");
    expect(slug).toMatch(/^startup-mixer-2026-/);
  });
});
