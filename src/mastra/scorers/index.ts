import { faithfulnessScorer } from "./faithfulness";

/**
 * Scorer registry passed to `Mastra({ scorers })`. Keyed by scorer id so
 * `mastra.listScorers()` (and Studio / the `GET /api/scorers` route) expose them.
 */
export const scorers = {
  faithfulness: faithfulnessScorer,
} as const;

export { faithfulnessScorer };
export {
  evaluateFaithfulness,
  extractClaims,
  isClaimSupported,
} from "./faithfulness-core";
export {
  FaithfulnessVerdictSchema,
  FaithfulnessClaimSchema,
  type FaithfulnessVerdict,
  type FaithfulnessClaim,
} from "./verdict-schema";
