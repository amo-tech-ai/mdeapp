import { describe, expect, it } from "vitest";
import { faithfulnessScorer } from "../faithfulness";
import {
  evaluateFaithfulness,
  extractClaims,
  type FaithfulnessInput,
} from "../faithfulness-core";
import { FaithfulnessVerdictSchema } from "../verdict-schema";

/**
 * AGT-00A acceptance fixtures (SAN-590):
 *  - a grounded reply (only names/prices present in tool output) → faithful, score 1
 *  - a reply citing a fabricated listing + invented price → unfaithful, score < 1
 *
 * The judge is LLM-free here (no GOOGLE_GENERATIVE_AI_API_KEY in CI), so these
 * are deterministic and offline.
 */

// Two real rentals the agent's search tool returned this turn.
const TOOL_OUTPUT: FaithfulnessInput = {
  toolOutputs: [
    {
      results: [
        { id: "a1b2", title: "Casa Verde Provenza", neighborhood: "El Poblado", price_monthly: 4200000 },
        { id: "c3d4", title: "Mirador Laureles Loft", neighborhood: "Laureles", price_monthly: 3100000 },
      ],
    },
  ],
};

const GROUNDED_REPLY =
  "I found Casa Verde Provenza for 4,200,000 COP per month in El Poblado, plus the Mirador Laureles Loft at 3,100,000 COP per month.";

const FABRICATED_REPLY =
  "Try the Hotel Skyline Penthouse for 9,900,000 COP per month — it has a private rooftop pool.";

describe("faithfulness core — extractClaims", () => {
  it("extracts entity + price claims, drops generic geo words", () => {
    const claims = extractClaims(GROUNDED_REPLY);
    const entities = claims.filter((c) => c.type === "entity").map((c) => c.claim);
    const prices = claims.filter((c) => c.type === "price").map((c) => c.claim);

    expect(entities).toContain("Casa Verde Provenza");
    expect(entities).toContain("Mirador Laureles Loft");
    // "El Poblado" / "COP" are stopworded — not flagged as listing identities.
    expect(entities).not.toContain("El Poblado");
    expect(prices.length).toBeGreaterThanOrEqual(2);
  });
});

describe("faithfulness core — evaluateFaithfulness", () => {
  it("scores a fully grounded reply as faithful (1.0)", () => {
    const verdict = evaluateFaithfulness(TOOL_OUTPUT, { reply: GROUNDED_REPLY });
    expect(FaithfulnessVerdictSchema.parse(verdict)).toBeTruthy();
    expect(verdict.faithful).toBe(true);
    expect(verdict.score).toBe(1);
    expect(verdict.unsupportedClaims).toHaveLength(0);
  });

  it("flags a fabricated listing + invented price as unfaithful (< 1.0)", () => {
    const verdict = evaluateFaithfulness(TOOL_OUTPUT, { reply: FABRICATED_REPLY });
    expect(verdict.faithful).toBe(false);
    expect(verdict.score).toBeLessThan(1);
    const flagged = verdict.unsupportedClaims.map((c) => c.claim);
    expect(flagged).toContain("Hotel Skyline Penthouse");
    expect(verdict.unsupportedClaims.some((c) => c.type === "price")).toBe(true);
  });

  it("scores a reply with no checkable claims as faithful by default", () => {
    const verdict = evaluateFaithfulness(TOOL_OUTPUT, {
      reply: "Sure — what neighborhood and budget are you thinking?",
    });
    expect(verdict.claimCount).toBe(0);
    expect(verdict.score).toBe(1);
    expect(verdict.faithful).toBe(true);
  });
});

describe("faithfulnessScorer (Mastra createScorer) — heuristic path", () => {
  it("registers with the expected id/name/description", () => {
    expect(faithfulnessScorer.id).toBe("faithfulness");
    expect(faithfulnessScorer.name).toBe("Hallucination / Faithfulness");
    expect(faithfulnessScorer.description.length).toBeGreaterThan(0);
  });

  it("run() scores the grounded reply at 1.0", async () => {
    const result = await faithfulnessScorer.run({
      input: TOOL_OUTPUT,
      output: { reply: GROUNDED_REPLY },
    });
    expect(result.score).toBe(1);
  });

  it("run() scores the fabricated reply below 1.0", async () => {
    const result = await faithfulnessScorer.run({
      input: TOOL_OUTPUT,
      output: { reply: FABRICATED_REPLY },
    });
    expect(result.score).toBeLessThan(1);
  });
});
