import { createScorer } from "@mastra/core/evals";
import { generateObject } from "ai";
import { z } from "zod";
import { FLASH_MODEL } from "../lib/models";
import {
  evaluateFaithfulness,
  extractClaims,
  isClaimSupported,
  type FaithfulnessClaim,
  type FaithfulnessInput,
  type FaithfulnessReply,
} from "./faithfulness-core";

/**
 * AGT-00A — Hallucination / Faithfulness scorer (SAN-590).
 *
 * Wraps the deterministic core (faithfulness-core.ts) as a Mastra `createScorer`
 * so it registers on the Mastra instance and is listable via Studio `/api/scorers`
 * and the prod `GET /api/scorers` route. Pipeline:
 *
 *   preprocess  → deterministic claim extraction + support check (LLM-free)
 *   analyze     → optional Gemini judge that DEMOTES false-positive unsupported
 *                 claims (paraphrases / derived facts). Never adds claims.
 *   generateScore → supported / total checkable claims (0..1)
 *   generateReason → one concrete sentence
 *
 * The judge is best-effort: with no `GOOGLE_GENERATIVE_AI_API_KEY` (CI/offline)
 * or `requestContext.faithfulnessJudge === false`, the score is the pure
 * heuristic — so the floor stays deterministic and free.
 */

const JUDGE_CONTEXT_KEY = "faithfulnessJudge";

type PreprocessResult = {
  claims: FaithfulnessClaim[];
  unsupported: FaithfulnessClaim[];
};

type AnalyzeResult = {
  fabricated: FaithfulnessClaim[];
  judged: boolean;
};

function getReply(output: FaithfulnessReply | undefined): FaithfulnessReply {
  return { reply: output?.reply ?? "" };
}

function getInput(input: FaithfulnessInput | undefined): FaithfulnessInput {
  return { toolOutputs: input?.toolOutputs ?? [] };
}

function judgeEnabled(requestContext: unknown): boolean {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) return false;
  const ctx = requestContext as { get?: (k: string) => unknown } | undefined;
  const flag = typeof ctx?.get === "function" ? ctx.get(JUDGE_CONTEXT_KEY) : undefined;
  return flag !== false;
}

/**
 * Ask Gemini which heuristically-unsupported claims are GENUINELY fabricated vs a
 * paraphrase/derivation of tool output. Returns the subset to keep flagged. On any
 * error, falls back to trusting the heuristic (fail-closed: keep all flagged).
 */
async function judgeFabrications(
  unsupported: FaithfulnessClaim[],
  toolOutputs: unknown[],
): Promise<FaithfulnessClaim[]> {
  try {
    const { object } = await generateObject({
      model: FLASH_MODEL,
      schema: z.object({
        fabricated: z
          .array(z.string())
          .describe("Exact claim strings that are NOT supported by the tool output."),
      }),
      prompt: [
        "You verify whether an AI concierge reply invented facts.",
        "TOOL OUTPUT (the only source of truth):",
        JSON.stringify(toolOutputs).slice(0, 6000),
        "",
        "CANDIDATE CLAIMS flagged as possibly unsupported:",
        ...unsupported.map((c) => `- [${c.type}] ${c.claim}`),
        "",
        "Return only the claims that are genuinely absent from the tool output.",
        "A claim that is a paraphrase, synonym, or directly derivable from the tool",
        "output is NOT fabricated — omit it.",
      ].join("\n"),
    });
    const fabricatedSet = new Set(object.fabricated.map((s) => s.toLowerCase().trim()));
    return unsupported.filter((c) => fabricatedSet.has(c.claim.toLowerCase().trim()));
  } catch {
    return unsupported;
  }
}

export const faithfulnessScorer = createScorer<FaithfulnessInput, FaithfulnessReply>({
  id: "faithfulness",
  name: "Hallucination / Faithfulness",
  description:
    "Detects entities, prices, and IDs in the agent reply that are absent from the tool output it saw. Score 1.0 = fully grounded; lower = invented facts.",
})
  .preprocess(({ run }): PreprocessResult => {
    const reply = getReply(run.output);
    const input = getInput(run.input);
    const verdict = evaluateFaithfulness(input, reply);
    return { claims: extractClaims(reply.reply), unsupported: verdict.unsupportedClaims };
  })
  .analyze(async ({ run, results }): Promise<AnalyzeResult> => {
    const pre = results.preprocessStepResult;
    if (pre.unsupported.length === 0) return { fabricated: [], judged: false };
    if (!judgeEnabled(run.requestContext)) {
      return { fabricated: pre.unsupported, judged: false };
    }
    const fabricated = await judgeFabrications(
      pre.unsupported,
      getInput(run.input).toolOutputs,
    );
    return { fabricated, judged: true };
  })
  .generateScore(({ results }): number => {
    const total = results.preprocessStepResult.claims.length;
    const fabricated = results.analyzeStepResult.fabricated.length;
    if (total === 0) return 1;
    return Number(((total - fabricated) / total).toFixed(4));
  })
  .generateReason(({ results, score }): string => {
    const total = results.preprocessStepResult.claims.length;
    const { fabricated, judged } = results.analyzeStepResult;
    const tag = judged ? "judge-confirmed" : "heuristic";
    if (total === 0) return "No checkable entities, prices, or IDs in the reply — nothing to ground.";
    if (fabricated.length === 0) {
      return `All ${total} checkable claim(s) grounded in tool output (${tag}). score=${score}.`;
    }
    const sample = fabricated
      .slice(0, 3)
      .map((c) => `${c.type} "${c.claim}"`)
      .join(", ");
    return `${fabricated.length}/${total} claim(s) unsupported (${tag}): ${sample}. score=${score}.`;
  });

/** Re-export the pure helpers so callers can grade without the Mastra runtime. */
export { evaluateFaithfulness, extractClaims, isClaimSupported };
export type { FaithfulnessInput, FaithfulnessReply, FaithfulnessClaim };
