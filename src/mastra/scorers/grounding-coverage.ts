import { createScorer } from "@mastra/core/evals";
import { generateObject } from "ai";
import { z } from "zod";
import { FLASH_MODEL } from "../lib/models";
import { extractClaims, type FaithfulnessClaim } from "./faithfulness-core";
import {
  evaluateGroundingCoverage,
  type GroundingCoverageInput,
  type GroundingCoverageReply,
} from "./grounding-coverage-core";

/**
 * AGT-00B — Grounding-coverage scorer (SAN-605).
 *
 * Entity-mention precision: every named listing/venue/event in the reply must
 * appear in tool output. Reuses the 590 judge pattern for false-positive demotion.
 */

const JUDGE_CONTEXT_KEY = "groundingCoverageJudge";

type PreprocessResult = {
  claims: FaithfulnessClaim[];
  unsupported: FaithfulnessClaim[];
};

type AnalyzeResult = {
  uncovered: FaithfulnessClaim[];
  judged: boolean;
};

function getReply(output: GroundingCoverageReply | undefined): GroundingCoverageReply {
  return { reply: output?.reply ?? "" };
}

function getInput(input: GroundingCoverageInput | undefined): GroundingCoverageInput {
  return { toolOutputs: input?.toolOutputs ?? [] };
}

function judgeEnabled(requestContext: unknown): boolean {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) return false;
  const ctx = requestContext as { get?: (k: string) => unknown } | undefined;
  const flag = typeof ctx?.get === "function" ? ctx.get(JUDGE_CONTEXT_KEY) : undefined;
  return flag !== false;
}

async function judgeUncovered(
  unsupported: FaithfulnessClaim[],
  toolOutputs: unknown[],
): Promise<FaithfulnessClaim[]> {
  try {
    const { object } = await generateObject({
      model: FLASH_MODEL,
      schema: z.object({
        uncovered: z
          .array(z.string())
          .describe("Entity claim strings genuinely absent from tool output."),
      }),
      prompt: [
        "You verify whether named venues/listings/events in a concierge reply are grounded.",
        "TOOL OUTPUT:",
        JSON.stringify(toolOutputs).slice(0, 6000),
        "",
        "ENTITY MENTIONS flagged as possibly absent:",
        ...unsupported.map((c) => `- ${c.claim}`),
        "",
        "Return only entities genuinely absent from tool output.",
        "Paraphrases or synonyms present in the tool output are NOT uncovered.",
      ].join("\n"),
    });
    const set = new Set(object.uncovered.map((s) => s.toLowerCase().trim()));
    return unsupported.filter((c) => set.has(c.claim.toLowerCase().trim()));
  } catch {
    return unsupported;
  }
}

export const groundingCoverageScorer = createScorer<
  GroundingCoverageInput,
  GroundingCoverageReply
>({
  id: "grounding-coverage",
  name: "Grounding Coverage",
  description:
    "Checks that every named entity in the agent reply appears in tool output. Score 1.0 = all venue/listing names grounded; lower = extra invented names.",
})
  .preprocess(({ run }): PreprocessResult => {
    const reply = getReply(run.output);
    const input = getInput(run.input);
    const verdict = evaluateGroundingCoverage(input, reply);
    const claims = extractClaims(reply.reply).filter((c) => c.type === "entity");
    return { claims, unsupported: verdict.unsupportedClaims };
  })
  .analyze(async ({ run, results }): Promise<AnalyzeResult> => {
    const pre = results.preprocessStepResult;
    if (pre.unsupported.length === 0) return { uncovered: [], judged: false };
    if (!judgeEnabled(run.requestContext)) {
      return { uncovered: pre.unsupported, judged: false };
    }
    const uncovered = await judgeUncovered(pre.unsupported, getInput(run.input).toolOutputs);
    return { uncovered, judged: true };
  })
  .generateScore(({ results }): number => {
    const total = results.preprocessStepResult.claims.length;
    const uncovered = results.analyzeStepResult.uncovered.length;
    if (total === 0) return 1;
    return Number(((total - uncovered) / total).toFixed(4));
  })
  .generateReason(({ results, score }): string => {
    const total = results.preprocessStepResult.claims.length;
    const { uncovered, judged } = results.analyzeStepResult;
    const tag = judged ? "judge-confirmed" : "heuristic";
    if (total === 0) return "No named entities in the reply — coverage N/A.";
    if (uncovered.length === 0) {
      return `All ${total} entity mention(s) grounded in tool rows (${tag}). score=${score}.`;
    }
    const sample = uncovered
      .slice(0, 3)
      .map((c) => `"${c.claim}"`)
      .join(", ");
    return `${uncovered.length}/${total} entity mention(s) not in tool output (${tag}): ${sample}. score=${score}.`;
  });

export { evaluateGroundingCoverage };
