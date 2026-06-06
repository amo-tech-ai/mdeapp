import { faithfulnessScorer } from "./faithfulness";
import { groundingCoverageScorer } from "./grounding-coverage";

/**
 * Scorer registry passed to `Mastra({ scorers })`. Keyed by scorer id so
 * `mastra.listScorers()` (and Studio / the `GET /api/scorers` route) expose them.
 */
export const scorers = {
  faithfulness: faithfulnessScorer,
  "grounding-coverage": groundingCoverageScorer,
} as const;

export { faithfulnessScorer, groundingCoverageScorer };
export {
  evaluateFaithfulness,
  extractClaims,
  isClaimSupported,
  buildCorpus,
} from "./faithfulness-core";
export { evaluateGroundingCoverage } from "./grounding-coverage-core";
export {
  FaithfulnessVerdictSchema,
  FaithfulnessClaimSchema,
  type FaithfulnessVerdict,
  type FaithfulnessClaim,
} from "./verdict-schema";
