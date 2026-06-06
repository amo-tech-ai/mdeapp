#!/usr/bin/env npx tsx
/**
 * AGT-00A — faithfulness scorer smoke (SAN-590).
 * Runs the hallucination/faithfulness scorer over a golden set of
 * (toolOutputs, reply) pairs and reports the faithfulness rate.
 *
 * Standalone:  npm run smoke:faithfulness
 * Reused by:   golden-queries-smoke.ts (reports a faithfulness rate in CI).
 *
 * Deterministic + offline: uses the LLM-free heuristic core, so it needs no
 * Gemini key and is safe to run in the floor.
 */
import {
  evaluateFaithfulness,
  type FaithfulnessInput,
} from "../../src/mastra/scorers/faithfulness-core";

type Fixture = {
  id: string;
  toolOutputs: FaithfulnessInput["toolOutputs"];
  reply: string;
  /** Expected: true = should score faithful (1.0); false = should be flagged. */
  expectFaithful: boolean;
};

const RENTALS = {
  results: [
    { id: "a1b2", title: "Casa Verde Provenza", neighborhood: "El Poblado", price_monthly: 4200000 },
    { id: "c3d4", title: "Mirador Laureles Loft", neighborhood: "Laureles", price_monthly: 3100000 },
  ],
};

const FIXTURES: Fixture[] = [
  {
    id: "FAITH-01-grounded",
    toolOutputs: [RENTALS],
    reply:
      "I found Casa Verde Provenza for 4,200,000 COP per month, plus the Mirador Laureles Loft at 3,100,000 COP per month.",
    expectFaithful: true,
  },
  {
    id: "FAITH-02-fabricated-listing",
    toolOutputs: [RENTALS],
    reply: "Try the Hotel Skyline Penthouse for 9,900,000 COP per month with a private rooftop pool.",
    expectFaithful: false,
  },
  {
    id: "FAITH-03-invented-price",
    toolOutputs: [RENTALS],
    reply: "Casa Verde Provenza is a steal at 1,500,000 COP per month.",
    expectFaithful: false,
  },
  {
    id: "FAITH-04-clarifying-question",
    toolOutputs: [RENTALS],
    reply: "Sure — what neighborhood and monthly budget are you working with?",
    expectFaithful: true,
  },
];

export type FaithfulnessSummary = {
  total: number;
  correct: number;
  faithfulnessRate: number;
  mismatches: string[];
};

/** Run the golden faithfulness fixtures; returns a summary (no process.exit). */
export function runFaithfulnessChecks(verbose = true): FaithfulnessSummary {
  let correct = 0;
  const mismatches: string[] = [];

  for (const fx of FIXTURES) {
    const verdict = evaluateFaithfulness({ toolOutputs: fx.toolOutputs }, { reply: fx.reply });
    const ok = verdict.faithful === fx.expectFaithful;
    if (ok) correct += 1;
    else mismatches.push(fx.id);
    if (verbose) {
      console.log(`\n${fx.id}`);
      console.log(`  score=${verdict.score} faithful=${verdict.faithful} expect=${fx.expectFaithful}`);
      console.log(`  ${verdict.reason}`);
      console.log(`  ${ok ? "PASS" : "FAIL"}`);
    }
  }

  // Faithfulness rate over fixtures that are *supposed* to be grounded.
  const groundedFixtures = FIXTURES.filter((f) => f.expectFaithful);
  const groundedPassed = groundedFixtures.filter(
    (f) => evaluateFaithfulness({ toolOutputs: f.toolOutputs }, { reply: f.reply }).faithful,
  ).length;
  const faithfulnessRate = groundedFixtures.length
    ? Number((groundedPassed / groundedFixtures.length).toFixed(4))
    : 1;

  return { total: FIXTURES.length, correct, faithfulnessRate, mismatches };
}

async function main() {
  const summary = runFaithfulnessChecks(true);
  console.log(
    `\nfaithfulness rate (grounded fixtures): ${(summary.faithfulnessRate * 100).toFixed(0)}%`,
  );
  if (summary.mismatches.length) {
    console.error(
      `\nFAIL: ${summary.mismatches.length}/${summary.total} fixtures mismatched: ${summary.mismatches.join(", ")}`,
    );
    process.exit(1);
  }
  console.log(`\nPASS: ${summary.correct}/${summary.total} faithfulness fixtures`);
}

// Only run when invoked directly (not when imported by golden-queries-smoke).
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
