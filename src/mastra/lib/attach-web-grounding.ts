import { invokeAdkSearchGrounding } from "./adk-grounding-client";
import { needsSearchGrounding } from "./search-intent-router";
import {
  incrementAndCheckSearchGroundingQuota,
} from "./search-grounding-quota";
import { parseSearchGroundedSidecarPayload } from "./search-grounding-types";
import type { WebCitation } from "./search-grounding-types";

export type WebGroundingAttachment = {
  citations: WebCitation[];
  confidence: number;
  metadata?: Record<string, unknown>;
};

export type DateWindow =
  | "tonight"
  | "this_weekend"
  | "this_week"
  | "next_week"
  | "any";

const DATE_WINDOW_PHRASE: Record<DateWindow, string> = {
  tonight: "tonight",
  this_weekend: "this weekend",
  this_week: "this week",
  next_week: "next week",
  any: "",
};

/** Text passed to search intent router when chaining from search-events. */
export function buildEventSearchQueryText(input: {
  category?: string;
  neighborhood?: string;
  dateWindow?: DateWindow;
}): string {
  const parts: string[] = [];
  if (input.category) parts.push(input.category);
  parts.push("events");
  if (input.neighborhood) parts.push(`in ${input.neighborhood}`);
  const phrase = input.dateWindow
    ? DATE_WINDOW_PHRASE[input.dateWindow]
    : "";
  if (phrase) parts.push(phrase);
  return parts.join(" ").trim();
}

export function shouldChainWebGrounding(
  input: {
    category?: string;
    neighborhood?: string;
    dateWindow?: DateWindow;
  },
  sqlEventCount = 0,
): boolean {
  const q = buildEventSearchQueryText(input);
  return needsSearchGrounding(q, { sqlEventCount });
}

/** MAP-002D — attach Google Search citations after time-sensitive event search. */
export async function attachWebGroundingForEventSearch(
  input: {
    category?: string;
    neighborhood?: string;
    dateWindow?: DateWindow;
  },
  sqlEventCount: number,
): Promise<WebGroundingAttachment | undefined> {
  if (!shouldChainWebGrounding(input, sqlEventCount)) return undefined;

  const query = buildEventSearchQueryText(input);
  if (!needsSearchGrounding(query, { sqlEventCount })) return undefined;

  const quota = await incrementAndCheckSearchGroundingQuota();
  if (!quota.allowed) {
    return {
      citations: [],
      confidence: 0,
      metadata: { reason: quota.reason },
    };
  }

  const raw = await invokeAdkSearchGrounding({ query });
  const parsed = parseSearchGroundedSidecarPayload(raw);
  const citations = parsed.citations.slice(0, 8);
  return {
    citations,
    confidence: parsed.confidence,
    metadata: {
      ...parsed.metadata,
      webSearchQueries: parsed.webSearchQueries,
      chainedFrom: "search-events",
    },
  };
}
