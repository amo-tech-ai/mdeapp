Google Search Grounding is worth adding for mdeai, but only as a **fresh-facts layer**, not as a replacement for Grounding Lite MCP / Places API or your existing Supabase truth model. The best first use case is event and venue verification—official pages, ticket links, schedule changes, and current announcements—because that is where citations and freshness matter most. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/fe83c574-9e83-43d6-9bda-399d33d5f86e/prd.md)

## Executive verdict

Score: **86/100**. Search Grounding is strong for real-time web facts, citations, and lowering hallucinations, and Google supports combining it with custom tools in Gemini 3 models. For mdeai, the immediate win is “candidate verification” for events, restaurants, neighborhoods, sponsors, and tourism updates, while keeping place discovery, pins, lat/lng, routes, and enrichment on Maps / Places. [blog](https://blog.google/technology/developers/grounding-google-maps-gemini-api/)

## Feature fit

| Feature | What it does | Core or advanced | mdeai use case | Stack owner | Risk | Score /100 |
|---|---|---|---|---|---|---|
| Google Search Grounding | Grounds Gemini responses in real-time web content and returns grounding metadata for citations  [ai.google](https://ai.google.dev/gemini-api/docs/google-search) | Core | Current events, official announcements, ticket links, venue updates, rental-law snippets, sponsor research | Mastra or ADK sidecar | Cost, latency, weak source quality | 92 |
| Google Maps Grounding | Grounds responses in Maps data, with optional lat/lng and widget context token  [blog](https://blog.google/technology/developers/grounding-google-maps-gemini-api/) | Core for geo facts, not pins | Nearby place facts, hours, ratings, location-aware recommendations | Grounding Lite MCP / Places lane | Misuse for pins/routes | 95 |
| URL-context + Search | Combine Search Grounding with provided URLs for richer verification  [ai.google](https://ai.google.dev/gemini-api/docs/google-search) | Advanced | Verify an official page plus web corroboration | ADK sidecar or tool wrapper | Complexity, prompt drift | 78 |
| Tool combinations | Combine built-in tools with custom function calling in Gemini 3 models  [ai.google](https://ai.google.dev/gemini-api/docs/tool-combination) | Core architecture enabler | Search + your own verification/save flows | Gemini call layer | Response-shape complexity | 84 |
| Grounding metadata rendering | Use `groundingChunks` and `groundingSupports` to build inline citations  [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/fe83c574-9e83-43d6-9bda-399d33d5f86e/prd.md) | Core UI feature | Citation cards and “verified from web” badges | CopilotKit UI | Missing metadata edge cases | 90 |
| Structured output with tool calls | Gemini can be picky about combining controlled generation and tools  [github](https://github.com/openai/openai-agents-python/issues/236) | Advanced caution | Keep search answers separate from strict JSON schemas | Mastra / ADK orchestration | Schema/tool incompatibility | 71 |

## Vertical use cases

| Vertical | Best Search Grounding jobs | Keep on Maps / Places | Notes |
|---|---|---|---|
| Real estate | Market news, neighborhood updates, safety/current conditions, rental-law/source-backed info, scam/source verification | Place discovery, pins, lat/lng, directions, place enrichment | Search should verify claims; Places should power geometry and nearby discovery  [blog](https://blog.google/technology/developers/grounding-google-maps-gemini-api/). |
| Events | This weekend events, official event pages, ticket URL verification, venue announcements, festival schedules | Venue lookup, map pins, travel distance | Search is ideal because event pages and schedules are web-native and change fast  [ai.google](https://ai.google.dev/gemini-api/docs/google-search). |
| Restaurants | New openings, temporary closures, best-of/current lists, chef/venue announcements | Nearby search, hours, address, ratings | Use Search for “what changed”; use Maps for “where is it and is it open.”  [blog](https://blog.google/technology/developers/grounding-google-maps-gemini-api/) |
| Tourism | Current attractions, weather-sensitive plans, museum schedule changes, protests/closures/safety alerts | Attraction discovery, route-like proximity, place widgets | Search handles timely context; Maps handles location-aware place facts  [blog](https://blog.google/technology/developers/grounding-google-maps-gemini-api/). |
| Sponsors | Brand/news research, sponsor fit, competitor activity, local campaign intelligence | None, except if the query is place-specific | This is a strong Phase 2/3 add because citations matter for sales enablement  [ai.google](https://ai.google.dev/gemini-api/docs/google-search). |

## Architecture choice

Recommend: **Mastra tool with a Gemini/ADK sidecar wrapper**. Keep the orchestration and business rules in Mastra, but let an ADK sidecar own the Gemini request shape, tool config, grounding metadata normalization, and citation assembly; that fits your existing “tool-registry” pattern and keeps the chat pipeline stable. Supabase Edge Functions should stay the system-of-record layer for quotas, logs, and persistence, not the main grounding orchestrator, because your PRD already says edge functions should be stateless and all state lives in Supabase. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/43284a7c-066f-4806-ab3d-2c7b5aec9263/MDEAI-ROADMAP.md)

Why not the others:
- **Mastra only**: workable, but you’ll end up re-implementing Gemini grounding metadata handling and version-specific quirks in app code. [ai.google](https://ai.google.dev/gemini-api/docs/google-search)
- **Supabase Edge Function only**: too coupled to product logic and less ideal for a reusable search-orchestration boundary. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/1c52f575-79b3-4979-847f-6db55a9708b2/MDEAI-MASTER-PRD.md)
- **Next API route only**: fine for a prototype, but weaker for auditability, quotas, and internal tool reuse across chat/ops flows. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/43284a7c-066f-4806-ab3d-2c7b5aec9263/MDEAI-ROADMAP.md)

## MVP vs phase 2

**MVP should include:**
- `search_web_grounded_events`
- `verify_ticket_source`
- `search_web_grounded_neighborhood_news`
- `verify_business_or_venue_update`
- citation rendering in CopilotKit
- quota + logging
- candidate-vs-verified status

**Phase 2 should include:**
- sponsor research
- URL-context augmentation
- multi-source corroboration scoring
- automatic stale-warning detection
- query routing that decides Maps vs Search vs Places vs your database
- cached verification snapshots with expiry rules

## Proposed tools

1. `search_web_grounded_events`
   - Purpose: find official event pages, schedules, and announcements.
   - Output: candidate events with citations and confidence.
2. `verify_ticket_source`
   - Purpose: confirm the official ticket seller / event page.
   - Output: verified ticket URL plus fallback candidates.
3. `search_web_grounded_neighborhood_news`
   - Purpose: current neighborhood news, safety, closures, protests, transit issues.
   - Output: summarized findings with source list and stale-warning flag.
4. `verify_business_or_venue_update`
   - Purpose: restaurant openings, closures, relocations, hour changes.
   - Output: candidate venue update, not a database write.
5. `search_web_grounded_sponsor_research`
   - Purpose: brand activity, launches, campaigns, local market mentions.
   - Output: research brief with citations and confidence.

## Data contracts

```ts
import { z } from "zod";

export const SourceCitationSchema = z.object({
  title: z.string(),
  uri: z.string().url(),
  sourceType: z.enum(["google_search", "google_maps", "url_context", "manual"]),
  snippet: z.string().optional(),
  publishedAt: z.string().datetime().optional(),
});

export const GroundingMetadataSchema = z.object({
  webSearchQueries: z.array(z.string()).default([]),
  sourceCount: z.number().int().nonnegative(),
  grounded: z.boolean(),
  hasGroundingMetadata: z.boolean(),
  staleWarning: z.boolean().default(false),
  tool: z.enum(["search", "maps", "both", "none"]),
});

export const ConfidenceScoreSchema = z.object({
  value: z.number().min(0).max(1),
  label: z.enum(["low", "medium", "high"]),
  reason: z.string(),
});

export const CandidateEventSchema = z.object({
  title: z.string(),
  dateText: z.string().optional(),
  venueName: z.string().optional(),
  city: z.string().default("Medellín"),
  ticketUrl: z.string().url().optional(),
  sourceLinks: z.array(SourceCitationSchema).default([]),
  confidence: ConfidenceScoreSchema,
  status: z.enum(["candidate", "verified", "rejected"]).default("candidate"),
});

export const GroundedAnswerSchema = z.object({
  answer: z.string(),
  citations: z.array(SourceCitationSchema).default([]),
  confidence: ConfidenceScoreSchema,
  grounding: GroundingMetadataSchema,
  candidates: z.array(z.union([CandidateEventSchema])).default([]),
});
```

## UI recommendations

- Show a **Verified from web** badge only when the answer has grounding metadata and at least one citation-backed claim. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/fe83c574-9e83-43d6-9bda-399d33d5f86e/prd.md)
- Render citation cards immediately under the grounded answer, with source title, host, and clickable link. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/fe83c574-9e83-43d6-9bda-399d33d5f86e/prd.md)
- Add a stale-warning badge when the answer depends on older or weakly corroborated pages.
- Candidate cards should be visually separate from saved Supabase records.
- The save-to-Supabase action should require explicit user confirmation, matching your existing “propose, don’t apply” rule. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/1c52f575-79b3-4979-847f-6db55a9708b2/MDEAI-MASTER-PRD.md)
- For Maps-grounded content, render the source list within one interaction and keep Google Maps attribution compliant. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/fe83c574-9e83-43d6-9bda-399d33d5f86e/prd.md)

## Tasks to create

| Task | Goal | Files to inspect/change | Env vars | API calls | Tests | Success criteria | Rollback |
|---|---|---|---|---|---|---|---|
| MAP-002D | Add Google Search Grounding for fresh web facts | `supabase/functions/*`, `supabase/functions/shared/*`, `src/components/chat/*`, tool registry | `GEMINI_API_KEY`, `SEARCH_GROUNDING_ENABLED`, `SEARCH_GROUNDING_DAILY_LIMIT` | Gemini `generateContent` with `google_search` tool  [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/fe83c574-9e83-43d6-9bda-399d33d5f86e/prd.md) | Unit tests for metadata parsing, citation rendering, fallback | Search answers return citations and candidate state | Disable flag, revert tool registry entry |
| EVT-SEARCH-001 | Event web discovery fallback | `tasks/events/*`, `supabase/functions/events/*`, UI event card | same plus `EVENT_GROUNDING_ENABLED` | Search grounded query + source ranking | Mock grounding metadata, no-result fallback | Official event pages and ticket links surfaced | Switch back to manual/Eventbrite-only flow |
| CORE-GEMINI-001 | Quotas and logging | `supabase/functions/shared/rate-limit.ts`, `airuns`, `ratelimithits`, `agentauditlog` | `GEMINI_SEARCH_DAILY_QUOTA`, `GEMINI_SEARCH_PER_USER_LIMIT` | log every grounded request | quota exhaustion, retry behavior, audit rows | Every call logged and limited | Hard-disable feature flag |
| CORE-GEMINI-002 | Citation rendering component | `src/components/chat/CitationCards.tsx`, `src/components/chat/GroundedBadge.tsx` | none | none | snapshot tests for link cards, badge states | Citations visible and usable | Fallback to plain text answer |
| RESTAURANTS-SEARCH-001 | Restaurant opening/closure verification | `tasks/maps/*`, `supabase/functions/restaurants/*` | `RESTAURANT_GROUNDING_ENABLED` | Search + Places cross-check | stale page, conflicting sources | Candidate updates only until verified | Keep Places-only freshness |
| REAL-ESTATE-SEARCH-001 | Neighborhood/current market source checker | `tasks/core/*`, `supabase/functions/rentals/*` | `REAL_ESTATE_GROUNDING_ENABLED` | Search grounded neighborhood/news query | scam, safety, law source mocks | Source-backed market/news claims | Revert to static guides/manual research |

## Testing plan

- Unit tests for grounding metadata parsing, citation assembly, and candidate/verified status.
- Mocked grounding metadata fixtures for search-success, no-metadata, partial-metadata, and conflicting-source cases.
- Quota tests for per-user, per-session, and daily request caps.
- Citation rendering tests in CopilotKit for both Search and Maps grounded answers.
- No-search fallback tests to ensure normal chat still works when grounding is off or fails.
- Production smoke tests for: one event query, one neighborhood query, one sponsor research query, and one Maps-vs-Search routing check.

## Final order

1. Build the grounding wrapper in the Gemini layer and normalize `groundingMetadata`.
2. Add logging, quotas, and feature flags before exposing it in UI.
3. Ship event verification first, then restaurant/venue freshness, then neighborhood/news, then sponsor research.
4. Keep Maps / Places fully separate for pins, routes, nearby discovery, and enrichment. [blog](https://blog.google/technology/developers/grounding-google-maps-gemini-api/)
5. Do not build automatic database writes from Search Grounding; keep grounding results as candidates until verified. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_55432fd4-e2a0-475f-994d-d0ff875a68b6/1c52f575-79b3-4979-847f-6db55a9708b2/MDEAI-MASTER-PRD.md)

If you want, I can turn this into a Cursor-ready implementation memo with code skeletons and exact file-level task checklists.