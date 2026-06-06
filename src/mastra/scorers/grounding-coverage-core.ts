import {
  buildCorpus,
  extractClaims,
  isClaimSupported,
  type FaithfulnessInput,
  type FaithfulnessReply,
} from "./faithfulness-core";
import type { FaithfulnessClaim, FaithfulnessVerdict } from "./verdict-schema";

/**
 * AGT-00B — deterministic grounding-coverage core (SAN-605).
 *
 * Complements faithfulness (00A): faithfulness grades *all* checkable claims
 * (entities, prices, IDs). Coverage grades **entity mentions only** — whether
 * every named venue/listing/event in the reply maps to tool output.
 *
 * Example: tool returns 3 restaurants; reply names 5 — coverage flags the 2
 * extras even when prices happen to match (faithfulness may still pass on price-only drift).
 */

export type GroundingCoverageInput = FaithfulnessInput;
export type GroundingCoverageReply = FaithfulnessReply;

function entityClaims(reply: string): FaithfulnessClaim[] {
  return extractClaims(reply).filter((c) => c.type === "entity");
}

/**
 * Coverage verdict: entity-claim precision against tool output.
 * score = supported entity claims / total entity claims; 1.0 when none.
 */
export function evaluateGroundingCoverage(
  input: GroundingCoverageInput,
  reply: GroundingCoverageReply,
): FaithfulnessVerdict {
  const claims = entityClaims(reply.reply ?? "");
  const corpus = buildCorpus(input?.toolOutputs ?? []);
  const unsupported = claims.filter((c) => !isClaimSupported(c, corpus));

  const claimCount = claims.length;
  const score =
    claimCount === 0 ? 1 : Number(((claimCount - unsupported.length) / claimCount).toFixed(4));
  const faithful = unsupported.length === 0;

  return {
    faithful,
    score,
    claimCount,
    unsupportedClaims: unsupported,
    judged: false,
    reason: buildCoverageReason(faithful, claimCount, unsupported),
  };
}

function buildCoverageReason(
  covered: boolean,
  claimCount: number,
  unsupported: FaithfulnessClaim[],
): string {
  if (claimCount === 0) {
    return "No named entities in the reply — nothing to check for tool-row coverage.";
  }
  if (covered) {
    return `All ${claimCount} named entity/entities in the reply appear in tool output.`;
  }
  const sample = unsupported
    .slice(0, 3)
    .map((c) => `"${c.claim}"`)
    .join(", ");
  return `${unsupported.length}/${claimCount} entity mention(s) not found in tool rows: ${sample}.`;
}
