import { z } from "zod";

/** GS-001 — Google Search grounding sidecar → Mastra bridge */

export const WebCitationSchema = z.object({
  title: z.string(),
  url: z.string().url(),
  snippet: z.string().nullable().optional(),
});

export type WebCitation = z.infer<typeof WebCitationSchema>;

export const SearchGroundedMetadataSchema = z.object({
  reason: z.string().nullable(),
  source: z.literal("google-search-grounding"),
  searchDisabled: z.boolean().optional(),
  answer: z.string().optional(),
  webSearchQueries: z.array(z.string()).optional(),
  requestId: z.string().optional(),
  message: z.string().optional(),
});

export const SearchGroundedResponseSchema = z.object({
  answer: z.string().optional(),
  citations: z.array(WebCitationSchema),
  confidence: z.number().min(0).max(1),
  webSearchQueries: z.array(z.string()).optional(),
  metadata: SearchGroundedMetadataSchema,
});

export type SearchGroundedResponse = z.infer<typeof SearchGroundedResponseSchema>;

export const EventCandidateSchema = z.object({
  title: z.string(),
  startAt: z.string().optional(),
  venueName: z.string().optional(),
  ticketUrl: z.string().url().optional(),
  citations: z.array(WebCitationSchema).min(1),
  source: z.literal("web_candidate"),
  confidence: z.number(),
});

export type EventCandidate = z.infer<typeof EventCandidateSchema>;

/** Normalize sidecar invoke payload for search_grounded_events. */
export function parseSearchGroundedSidecarPayload(
  raw: unknown,
): SearchGroundedResponse {
  const row =
    raw && typeof raw === "object"
      ? (raw as Record<string, unknown>)
      : {};
  const meta =
    row.metadata && typeof row.metadata === "object"
      ? (row.metadata as Record<string, unknown>)
      : {};
  const citationsRaw = Array.isArray(row.citations) ? row.citations : [];

  const citations: WebCitation[] = [];
  for (const c of citationsRaw) {
    if (!c || typeof c !== "object") continue;
    const item = c as Record<string, unknown>;
    const url = typeof item.url === "string" ? item.url : "";
    if (!url.startsWith("http")) continue;
    const title =
      typeof item.title === "string" && item.title.trim()
        ? item.title
        : url;
    const snippet =
      typeof item.snippet === "string" ? item.snippet : null;
    citations.push({ title, url, snippet });
  }

  const reason =
    citations.length === 0
      ? typeof meta.reason === "string"
        ? meta.reason
        : "no_grounding_metadata"
      : (typeof meta.reason === "string" ? meta.reason : null);

  return SearchGroundedResponseSchema.parse({
    answer: typeof meta.answer === "string" ? meta.answer : "",
    citations,
    confidence:
      typeof row.confidence === "number" ? row.confidence : citations.length ? 0.75 : 0,
    webSearchQueries: Array.isArray(meta.webSearchQueries)
      ? meta.webSearchQueries.filter((q): q is string => typeof q === "string")
      : undefined,
    metadata: {
      reason,
      source: "google-search-grounding",
      searchDisabled: meta.searchDisabled === true,
      answer: typeof meta.answer === "string" ? meta.answer : undefined,
      webSearchQueries: Array.isArray(meta.webSearchQueries)
        ? meta.webSearchQueries.filter((q): q is string => typeof q === "string")
        : undefined,
      requestId:
        typeof meta.requestId === "string" ? meta.requestId : undefined,
      message: typeof meta.message === "string" ? meta.message : undefined,
    },
  });
}
