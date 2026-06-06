import type {
  ClaimType,
  FaithfulnessClaim,
  FaithfulnessVerdict,
} from "./verdict-schema";

/**
 * AGT-00A — deterministic core of the hallucination / faithfulness scorer.
 *
 * Given the tool outputs a concierge turn saw and the final reply it produced,
 * extract the *checkable* facts in the reply (named entities, prices, IDs) and
 * verify each one appears in the tool output. A claim the model invented — a
 * rental, restaurant, venue, event, price, or booking detail absent from tool
 * output — surfaces as an unsupported claim and drives the faithfulness score
 * below 1.
 *
 * This module is intentionally LLM-free so it is fast, free, and deterministic:
 * it is the source of truth the Mastra scorer wraps and the Vitest fixtures pin.
 * The optional Gemini judge (see faithfulness.ts) only *demotes* false positives
 * — it never invents new unsupported claims.
 */

export type FaithfulnessInput = {
  /** Raw tool results the agent saw this turn (rentals/events/restaurants/grounded). */
  toolOutputs: unknown[];
};

export type FaithfulnessReply = {
  /** The agent's final natural-language reply shown to the user. */
  reply: string;
};

/**
 * Generic words that look like proper nouns at a glance but carry no listing
 * identity — neighborhoods, cities, weekdays, and concierge boilerplate. Flagging
 * these would produce false "hallucinations" on perfectly grounded replies.
 */
const ENTITY_STOPWORDS = new Set<string>([
  // articles / connectors that lead capitalized geo phrases ("El Poblado")
  "el",
  "la",
  "los",
  "las",
  "de",
  "del",
  // geography (Medellín concierge surface)
  "medellin",
  "medellín",
  "colombia",
  "poblado",
  "laureles",
  "provenza",
  "envigado",
  "sabaneta",
  "estadio",
  "manila",
  "buenos",
  "aires",
  "centro",
  "comuna",
  // currency / units that may be capitalized
  "cop",
  "usd",
  // concierge boilerplate / common sentence-initial words
  "best",
  "here",
  "there",
  "they",
  "this",
  "that",
  "these",
  "those",
  "your",
  "you",
  "i",
  "we",
  "the",
  "and",
  "for",
  "with",
  "near",
  "from",
  "wifi",
  "airbnb",
  "monthly",
  "nightly",
  "available",
  "month",
  "night",
  "found",
  "try",
  "options",
  "option",
]);

/**
 * Capitalized multi-word phrase (e.g. "Casa Verde Provenza", "Hotel Skyline
 * Penthouse"). Listing / venue / event names are reliably multi-word, so this is
 * the deterministic entity signal. Lone proper nouns ("Relato") are deliberately
 * left to the Gemini judge — counting every capitalized word here produces false
 * "hallucinations" on sentence-initial words like "Sure" or "Here".
 */
const MULTI_WORD_ENTITY = /\b([A-Z][a-zA-Z0-9'&]+(?:\s+[A-Z][a-zA-Z0-9'&]+)+)\b/g;
/** Money: "$4,200,000", "4.200.000 COP", "9,900,000 COP/month", "120 USD". */
const PRICE =
  /(?:\$\s?[\d][\d.,]*|\b[\d][\d.,]{2,}\s?(?:cop|usd|\/night|\/mo|\/month|per night|per month|million|m)\b)/gi;
/** UUIDs and explicit id tokens ("#abc123", "id: rental_42"). */
const UUID = /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi;
const TAGGED_ID = /(?:\bid\s*[:#]\s*|#)([a-z0-9][a-z0-9_-]{3,})\b/gi;

/** Keep only the digits of a price/number so "4,200,000" and "4.200.000" compare equal. */
function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

function pushUnique(map: Map<string, FaithfulnessClaim>, claim: FaithfulnessClaim): void {
  const key = `${claim.type}:${claim.claim.toLowerCase().trim()}`;
  if (!map.has(key)) map.set(key, claim);
}

/**
 * Pull the checkable facts out of a reply: named entities, prices, and IDs.
 * Deduplicated, order-stable. Generic geo/boilerplate words are dropped.
 */
export function extractClaims(reply: string): FaithfulnessClaim[] {
  const claims = new Map<string, FaithfulnessClaim>();

  for (const m of reply.matchAll(PRICE)) {
    pushUnique(claims, { claim: m[0].trim(), type: "price" });
  }
  for (const m of reply.matchAll(UUID)) {
    pushUnique(claims, { claim: m[0].trim(), type: "id" });
  }
  for (const m of reply.matchAll(TAGGED_ID)) {
    pushUnique(claims, { claim: m[1].trim(), type: "id" });
  }
  for (const m of reply.matchAll(MULTI_WORD_ENTITY)) {
    const phrase = m[1].trim();
    // Drop phrases that are entirely generic (e.g. "El Poblado", "Buenos Aires").
    const allStop = phrase
      .split(/\s+/)
      .every((tok) => ENTITY_STOPWORDS.has(tok.toLowerCase()));
    if (allStop) continue;
    pushUnique(claims, { claim: phrase, type: "entity" });
  }

  return [...claims.values()];
}

/** Build a normalized lowercase corpus + the set of digit-runs found in tool output. */
export function buildCorpus(toolOutputs: unknown[]): { text: string; numbers: Set<string> } {
  const raw = JSON.stringify(toolOutputs ?? []);
  const text = raw.toLowerCase();
  const numbers = new Set<string>();
  for (const m of raw.matchAll(/\d[\d.,]*/g)) {
    const d = digitsOnly(m[0]);
    if (d.length >= 3) numbers.add(d);
  }
  return { text, numbers };
}

/** Is a single extracted claim grounded in the tool-output corpus? */
export function isClaimSupported(
  claim: FaithfulnessClaim,
  corpus: { text: string; numbers: Set<string> },
): boolean {
  if (claim.type === "price") {
    const d = digitsOnly(claim.claim);
    if (d.length >= 3 && corpus.numbers.has(d)) return true;
    return corpus.text.includes(claim.claim.toLowerCase());
  }
  return corpus.text.includes(claim.claim.toLowerCase().trim());
}

/**
 * Deterministic faithfulness verdict for (toolOutputs, reply).
 * score = supported / total checkable claims; 1.0 when there are no claims.
 */
export function evaluateFaithfulness(
  input: FaithfulnessInput,
  reply: FaithfulnessReply,
): FaithfulnessVerdict {
  const claims = extractClaims(reply.reply ?? "");
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
    reason: buildReason(faithful, claimCount, unsupported),
  };
}

function buildReason(
  faithful: boolean,
  claimCount: number,
  unsupported: FaithfulnessClaim[],
): string {
  if (claimCount === 0) {
    return "No checkable entities, prices, or IDs in the reply — nothing to ground.";
  }
  if (faithful) {
    return `All ${claimCount} checkable claim(s) appear in tool output — reply is grounded.`;
  }
  const sample = unsupported
    .slice(0, 3)
    .map((c) => `${c.type} "${c.claim}"`)
    .join(", ");
  return `${unsupported.length}/${claimCount} claim(s) not found in tool output: ${sample}.`;
}

/** Re-export for ergonomic imports. */
export type { ClaimType, FaithfulnessClaim, FaithfulnessVerdict };
