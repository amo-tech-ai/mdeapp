import { describe, expect, it } from "vitest";
import { evaluateFaithfulness } from "../faithfulness-core";
import { evaluateGroundingCoverage } from "../grounding-coverage-core";
import { FaithfulnessVerdictSchema } from "../verdict-schema";

const THREE_RESTAURANTS = {
  toolOutputs: [
    {
      results: [{ name: "Carmen" }, { name: "O.C.I." }, { name: "Verde Garden" }],
    },
  ],
};

describe("grounding coverage core — evaluateGroundingCoverage", () => {
  it("scores 1.0 when reply names only tool rows (3 of 3)", () => {
    const verdict = evaluateGroundingCoverage(THREE_RESTAURANTS, {
      reply: "Carmen and O.C.I. are great; Verde Garden has a quiet patio.",
    });
    expect(FaithfulnessVerdictSchema.parse(verdict)).toBeTruthy();
    expect(verdict.score).toBe(1);
    expect(verdict.unsupportedClaims).toHaveLength(0);
  });

  it("flags 2 extra names when tool has 3 rows but reply names 5 (3/5)", () => {
    const verdict = evaluateGroundingCoverage(THREE_RESTAURANTS, {
      reply:
        "Try Carmen, O.C.I., and Verde Garden — also Skyline Rooftop Medellín and Luna Social Club.",
    });
    expect(verdict.score).toBeLessThan(1);
    expect(verdict.unsupportedClaims.length).toBeGreaterThanOrEqual(2);
    expect(verdict.unsupportedClaims.map((c) => c.claim)).toEqual(
      expect.arrayContaining(["Skyline Rooftop Medell", "Luna Social Club"]),
    );
  });

  it("ignores wrong prices — coverage 1.0 while faithfulness fails", () => {
    const input = THREE_RESTAURANTS;
    const reply = { reply: "Carmen is 1,500,000 COP per person — great value." };
    const coverage = evaluateGroundingCoverage(input, reply);
    const faith = evaluateFaithfulness(input, reply);
    expect(coverage.score).toBe(1);
    expect(faith.score).toBeLessThan(1);
  });
});
