import { z } from "zod";

/**
 * AGT-03 — shared faithfulness/grounding verdict schema.
 *
 * SAN-590 introduces this as the canonical structured verdict for AI-quality
 * scorers. AGT-00B (grounding-coverage) and AGT-04A (runtime enforcement) reuse
 * the same shape so a verdict produced by one scorer is consumable by the next.
 * Keep this provider-agnostic: it describes the *result* of a judgement, not how
 * the judgement was reached.
 */

export type ClaimType = "entity" | "price" | "id" | "other";

export const FaithfulnessClaimSchema = z.object({
  /** The literal span lifted from the reply, e.g. "Casa Verde Provenza" or "9,900,000 COP". */
  claim: z.string(),
  /** What kind of fact this is — drives how support is checked. */
  type: z.enum(["entity", "price", "id", "other"]),
});
export type FaithfulnessClaim = z.infer<typeof FaithfulnessClaimSchema>;

export const FaithfulnessVerdictSchema = z.object({
  /** True when every checkable claim in the reply is supported by tool output. */
  faithful: z.boolean(),
  /** 0..1 — fraction of checkable claims grounded in tool output. 1 when no claims. */
  score: z.number().min(0).max(1),
  /** Total number of checkable claims extracted from the reply. */
  claimCount: z.number().int().min(0),
  /** Claims present in the reply but absent from tool output (the hallucinations). */
  unsupportedClaims: z.array(FaithfulnessClaimSchema),
  /** Whether an LLM judge reviewed the heuristic findings (false = heuristic-only). */
  judged: z.boolean(),
  /** One short, concrete sentence explaining the verdict. */
  reason: z.string(),
});
export type FaithfulnessVerdict = z.infer<typeof FaithfulnessVerdictSchema>;
