---
title: Google Search Grounding — mdeai audit & roadmap
updated: 2026-05-26
status: active
audience: Sofía, Patricia, product
stack: CopilotKit · Mastra · ADK sidecar · Gemini 3.5 Flash · Grounding Lite MCP · Places API New · Supabase
canonical_task: ../maps/MAP-002D-search-grounding-enable.md
routing: ../../plan/maps/search-grounding-routing.md
playbooks:
  - ./00-playbook-guide.md
  - ./01-playbook.md
  - ./02-playbook.md
tasks_index: ../tasks/INDEX.md
official:
  - https://ai.google.dev/gemini-api/docs/google-search
  - https://adk.dev/grounding/google_search_grounding/
  - https://ai.google.dev/gemini-api/docs/tool-combination
  - https://blog.google/innovation-and-ai/technology/developers-tools/gemini-api-tooling-updates/
learn_from:
  - https://github.com/google-gemini/cookbook/blob/main/quickstarts/Grounding.ipynb
  - https://github.com/google/adk-docs/blob/main/docs/grounding/google_search_grounding.md
ideas_only:
  - https://github.com/epilande/gemini-grounding
---

# Gemini Google Search Grounding — mdeai audit

Forensic product + architecture review for **Google Search Grounding** on the mdeai stack.  
**Not** Gemini Maps grounding (see MAP-002 G4 / Grounding Lite MCP for places).

---

## 1. Executive verdict

| Question | Answer |
|----------|--------|
| **Worth adding?** | **Yes** — for time-sensitive web facts, event promos, and citation-backed answers. **No** as a default on every chat turn. |
| **Score /100** | **88** for mdeai fit when routed correctly; **12** if misused (replacing MCP/Places/Supabase). |
| **Best first use case** | **Tourist on `/chat`:** *"rooftop events in Poblado this Friday"* → Supabase `events` first → **Search grounding fallback** with web citations when SQL is partial. |
| **Best owner** | **ADK sidecar SearchAgent** (extend `services/adk-grounding/`) + **Mastra** quota/router + **CopilotKit** citation UI. |
| **Phase** | **Phase 2** — after MAP-019 + F50b; implement via existing [**MAP-002D**](../maps/MAP-002D-search-grounding-enable.md). |

**One-line architecture (keep this):**

```text
Grounding Lite MCP  → place discovery + pins
Places API (New)    → ratings, hours, photos, googleMapsLinks
Google Search       → fresh web facts + citations (on demand)
Supabase            → source of truth for ticketed events + rentals
Mastra              → decides which layer; never blends web into SQL rows without source
CopilotKit          → cards + attribution + web citation chips
```

---

## 2. What Search Grounding is (official)

Per [Gemini API — Grounding with Google Search](https://ai.google.dev/gemini-api/docs/google-search) and [ADK Google Search Grounding](https://adk.dev/grounding/google_search_grounding/):

- Model may run **one or more Google Search queries** per user prompt (Gemini 3+ bills **per search query**, not per prompt).
- Response includes **`groundingMetadata`**: `webSearchQueries`, `groundingChunks` (web `uri` + `title`), `groundingSupports` (inline segment → chunk indices), optional `searchEntryPoint` (HTML widget — ToS applies).
- Use for: **recent events**, **current conditions**, **verifiable claims**, **citations** — not for map pins or structured place fields.

**March 2026 tooling** ([Google blog](https://blog.google/innovation-and-ai/technology/developers-tools/gemini-api-tooling-updates/)): built-in Search + Maps + **custom function calling** in one request; context circulation across tools. mdeai should adopt **tool combination** only after MAP-002D is stable — Mastra custom tools + sidecar built-ins, not Interactions API in Phase 1.

---

## 3. Learn from (reference matrix)

| Source | Trust level | What to steal |
|--------|-------------|---------------|
| [google-gemini/cookbook `quickstarts/Grounding.ipynb`](https://github.com/google-gemini/cookbook/blob/main/quickstarts/Grounding.ipynb) | **Canonical** | `tools: [{ google_search: {} }]`, parse `groundingMetadata`, Maps vs Search sections |
| [adk-docs `google_search_grounding.md`](https://github.com/google/adk-docs/blob/main/docs/grounding/google_search_grounding.md) | **Canonical** | ADK `google_search` / `GOOGLE_SEARCH` tool, data-flow diagram, citation display |
| [adk.dev grounding page](https://adk.dev/grounding/google_search_grounding/) | **Canonical** | Same as ADK docs — agent orchestration narrative |
| [ai.google.dev google-search](https://ai.google.dev/gemini-api/docs/google-search) | **Canonical** | Billing (Gemini 3 per query), inline citation algorithm, model support |
| [tool-combination](https://ai.google.dev/gemini-api/docs/tool-combination) | **Canonical** | Search + custom tools same turn — Phase 2 spike |
| [Cookbook `LiveAPI_plotting_and_mapping.ipynb`](https://github.com/google-gemini/cookbook/blob/main/examples/LiveAPI_plotting_and_mapping.ipynb) | **Defer** | Live API — not Phase 1 (see INDEX “Do not file MAP tasks”) |
| [Cookbook `Browser_as_a_tool.ipynb`](https://github.com/google-gemini/cookbook/blob/main/examples/Browser_as_a_tool.ipynb) | **Defer** | Deep crawl — not Search grounding |
| [epilande/gemini-grounding](https://github.com/epilande/gemini-grounding) | **Ideas only** | MCP packaging pattern; **do not** ship third-party MCP in prod |
| Vendor blogs (Master Concept, CallSphere, Sparkco) | **Ideas only** | Persona stories; verify against official docs |

**Local copies:** [`docs/00-playbook-guide.md`](./00-playbook-guide.md) (how to use exports), [`docs/01-playbook.md`](./01-playbook.md) (Grounding.ipynb export), [`docs/02-playbook.md`](./02-playbook.md) (Search-as-tool + metadata). Each **GS-*** / **MAP-002D** / **EVT-D05** task lists `playbook_ref` in frontmatter.

---

## 4. Grounding Lite vs Search vs Places vs Maps (do not mix up)

| Layer | Tool / API | Best for | mdeai owner | Persona |
|-------|------------|----------|-------------|---------|
| **Place discovery** | Grounding Lite MCP `search_places` | NL → pins + `placeId` | ADK → Mastra `search-grounded-places` | Camila, Tourist |
| **Place enrichment** | Places API (New) Details | rating, hours, photos, `googleMapsLinks` | Sidecar `places_enrich.py` + MAP-004 | Camila |
| **Fresh web facts** | Gemini `googleSearch` | events, news, closures, schedules | ADK SearchAgent → MAP-002D | Tourist, Roberto |
| **Maps reasoning fallback** | Gemini `googleMaps` | MCP 403 / empty pins only | `gemini_maps_grounding.py` | — |
| **Structured inventory** | Supabase | ticketed events, rentals | Mastra SQL tools | Roberto, Camila |
| **Routes** | Grounding Lite `compute_routes` | commute minutes (text) | MAP-011 | Camila |

**Wrong routing (fail audit):**

| Bad use | Use instead |
|---------|-------------|
| Map pins / lat-lng | Grounding Lite MCP |
| Nearby cafés with ratings | MCP + Places Details |
| Route minutes | `compute_routes` (MAP-011) |
| Saved ticket inventory | Supabase `events` |
| Repeat “open now?” every turn | Cache + Places `currentOpeningHours` |
| Deep 20-page research report | Firecrawl / manual — not Search snippets |

---

## 5. Ten core use cases (Phase 1–2 entry)

| # | Use case | Persona | Example prompt | Why Search (not MCP/Places) | Stack | Score |
|---|----------|---------|----------------|----------------------------|-------|------:|
| C1 | **Event discovery fallback** | Tourist | *"Concerts in Medellín this weekend?"* | Not in Supabase yet | SQL → Search → citations | **98** |
| C2 | **Ticket / official page verify** | Andrés | *"Is this Eventbrite link legit?"* | Need live web source | Search + `source: web` | **96** |
| C3 | **Venue closure / hours change** | Roberto | *"Is Provenza venue closed tonight?"* | Hours change faster than cache | Search verify + Places | **95** |
| C4 | **Festival / city news** | Tourist | *"What's on during Feria de las Flores?"* | Time-sensitive | Search + disclaimer | **95** |
| C5 | **Restaurant temporary status** | Tourist | *"Is this café open late tonight?"* | Announcements | Places first → Search if conflict | **92** |
| C6 | **Safety / protest alerts** | Camila | *"Any protests in Medellín today?"* | News-only | Search + strong disclaimer | **92** |
| C7 | **Weather-sensitive planning** | Tourist | *"Rain in Laureles tonight?"* | Current conditions | Search OR MAP-020 weather MCP | **90** |
| C8 | **Conference / meetup agenda** | Tourist | *"AI Medellín speakers today?"* | Live agendas | Search citations | **90** |
| C9 | **Promo / sponsor announcement** | Patricia | *"Did brand X launch in CO?"* | PR / news | Search — admin only Phase 2 | **88** |
| C10 | **Trending nightlife list** | Tourist | *"Most talked-about rooftop bars this week"* | Editorial / social buzz | Search summaries — not facts without cites | **85** |

**Core MVP slice (MAP-002D v1):** **C1, C2, C3, C4** only.

---

## 6. Ten advanced use cases (Phase 2+)

| # | Use case | Persona | Example | Flow | Score |
|---|----------|---------|---------|------|------:|
| A1 | **Event intelligence pipeline** | Patricia | Ingest weekend events from web | Search → extract candidates → Supabase dedupe → human approve | **98** |
| A2 | **AI verification layer** | Sofía | Block hallucinated dates | Every event claim must have `groundingChunk` URI | **97** |
| A3 | **Dynamic 3-day itinerary** | Tourist | *"3-day Medellín this weekend"* | Search + MCP pins + Places + routes (MAP-011) | **97** |
| A4 | **Neighborhood pulse** | Camila | *"What's trending in Laureles?"* | Search blogs/news + MAP-012 cache | **95** |
| A5 | **Multi-source geo reasoning** | Camila | *"Coworking + nightlife + safety near X"* | Search + curated JSON + optional Insights | **96** |
| A6 | **Sponsor intelligence** | Patricia | Competitor / campaign research | Search — admin workspace | **90** |
| A7 | **Watchlist / alerts** | Tourist | *"Notify when X artist announced"* | Scheduled Search + edge cron | **95** |
| A8 | **Tool combination turn** | Tourist | *"Events this weekend near my rental"* | `googleSearch` + `search_grounded_places` + SQL one Gemini call ([tool combo](https://ai.google.dev/gemini-api/docs/tool-combination)) | **94** |
| A9 | **Inline cited prose** | Tourist | Answer with `[1](uri)` spans | `groundingSupports` → CopilotKit render | **93** |
| A10 | **Autonomous research agent** | Patricia | Weekly event digest | ADK sub-agent + Mastra workflow | **99** risk |

**Defer A7, A10** until quota + moderation + MAP-002E observability are production-grade.

---

## 7. Feature table (capabilities)

| Feature | What it does | Core / Advanced | mdeai use case | Stack owner | Risk | Score |
|---------|--------------|-----------------|----------------|-------------|------|------:|
| `googleSearch` tool on `generateContent` | Auto search + synthesis | Core | C1–C4 | ADK SearchAgent | Cost per query | **95** |
| `groundingMetadata.groundingChunks` | Web URIs + titles | Core | Citations | ADK → Mastra parse | Missing metadata → no cite | **90** |
| `groundingSupports` | Inline segment ↔ sources | Advanced | A9 cited answers | CopilotKit render | UI complexity | **85** |
| `webSearchQueries` | Debug / billing audit | Core | Patricia ops | Logs + Supabase | — | **92** |
| `searchEntryPoint` HTML widget | Google suggestion chips | Advanced | Optional `/chat` footer | UI — ToS review | Branding rules | **70** |
| Tool combination (Search + custom) | One turn, multi-tool | Advanced | A8 | ADK Phase 2 | Latency | **88** |
| Dynamic retrieval threshold | Control search frequency | Advanced | Cost tuning | ADK config | Under-search | **75** |
| URL context + Search | Specific URLs + web | Advanced | Verify one ticket URL | ADK | — | **80** |
| ADK `google_search` tool | Same as API via ADK | Core | Sidecar agent | `services/adk-grounding/` | Version drift | **90** |
| Quota + feature flag | `ENABLE_SEARCH_GROUNDING` | Core | Spend control | Mastra + Patricia | 429 / bill shock | **95** |
| Candidate-not-fact policy | Web → staging only | Core | Trust | Mastra router | Liability | **98** |
| Interactions API | Server-side state | **Defer** | — | Phase 3 platform | Breaking changes | **40** |
| Live API + Search | Voice + search | **Defer** | — | Phase 2 WhatsApp | — | **30** |
| epilande MCP server | Dev-time search MCP | **Do not use** | — | — | Unvetted dep | **20** |

---

## 8. Use cases by vertical

### Events (Roberto, Tourist, Andrés)

| Use case | Phase | Tool |
|----------|-------|------|
| This weekend / tonight listings | 2 | Search fallback after Supabase |
| Official event page / ticket URL verify | 2 | Search + human-readable cite |
| Venue announcement (delay, cancel) | 2 | Search verify |
| Festival schedules (Feria, etc.) | 2 | Search + disclaimer |
| **Do not** replace Stripe checkout truth | — | Supabase + webhooks |

### Restaurants (Tourist)

| Use case | Phase | Tool |
|----------|-------|------|
| New opening announcements | 2 | Search |
| Temporary closure rumor | 2 | Places hours + Search verify |
| “Best of 2026” listicles | 2 | Search — opinion, cite sources |
| Pin + rating display | 1 | MCP + Places (not Search) |

### Real estate (Camila)

| Use case | Phase | Tool |
|----------|-------|------|
| Neighborhood news / safety mention | 2 | Search + curated JSON (MAP-012) |
| Rental scam / listing verify | 2 | Search official agency pages |
| Market trend prose | 3 | Search — never auto-price rentals |
| Nearby amenities | 1 | Places Nearby (MAP-006) |

### Tourism (Tourist)

| Use case | Phase | Tool |
|----------|-------|------|
| Museum hours / exhibit changes | 2 | Search |
| Weather-sensitive day plan | 2 | Search or MAP-020 |
| Protest / road closure alerts | 2 | Search + disclaimer |
| Attraction pins | 1 | Grounding Lite |

### Sponsors (Patricia)

| Use case | Phase | Tool |
|----------|-------|------|
| Brand news / competitor activity | 3 | Search — admin only |
| Sponsor fit research | 3 | Search summaries + cites |
| **Not** in concierge hot path | — | Rate limit hard |

---

## 9. Architecture recommendation

### Options scored

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **A — Mastra tool calls Gemini directly** | Fewer hops | Duplicates ADK; keys in Mastra only; splits Google intelligence | **No** |
| **B — ADK sidecar endpoint** | Matches MAP-002; one Cloud Run key; strict JSON contract | Extra HTTP hop | **Yes — recommended** |
| **C — Supabase Edge Function** | Close to DB | Another Gemini caller; cold start | **No** for v1 |
| **D — Next API route** | Simple | Secrets in Vercel; bypasses Mastra quota | **No** |

### Recommended flow (Option B)

```text
CopilotKit (/chat, /)
  → Mastra conciergeAgent (router: SQL | MCP | Search?)
      → if intent needs web freshness AND flag on:
          POST ADK /v1/grounding/invoke { tool: "search_grounded_events", query, ... }
      → SearchAgent: gemini-3.5-flash + tools: [{ googleSearch: {} }]
      → normalize { answer, citations[], webSearchQueries[], confidence, reason }
      → merge with Supabase rows (source field)
  → CopilotKit: WebCitationCard + optional EventCandidateCard
```

**Router rules (Mastra — extend `plan/maps/search-grounding-routing.md`):**

1. Ticketed event in Supabase → show SQL card (`source: supabase`).
2. Partial / empty SQL + time-sensitive query → SearchAgent.
3. Geo NL “cafés near X” → **never** Search; use `search-grounded-places`.
4. No `groundingChunks` → answer with disclaimer; do not present as verified.

---

## 10. Proposed tools (Mastra registry)

| Tool id | ADK `tool` | Persona | Phase |
|---------|------------|---------|-------|
| `search-web-grounded-events` | `search_grounded_events` | Tourist | **2 v1** |
| `verify-ticket-source` | `verify_web_source` | Andrés | 2 |
| `search-web-neighborhood-news` | `search_grounded_neighborhood` | Camila | 2.1 |
| `verify-venue-update` | `verify_venue_status` | Roberto | 2 |
| `search-web-sponsor-research` | `search_grounded_sponsor` | Patricia | 3 |

**v1 ships only the first two** behind the same SearchAgent implementation (different prompts / schemas).

---

## 11. Data contracts (Zod / sidecar JSON)

```typescript
// mdeapp/src/mastra/lib/search-grounding-types.ts (proposed)

export const WebCitationSchema = z.object({
  title: z.string(),
  url: z.string().url(),
  snippet: z.string().optional(),
});

export const SearchGroundedResponseSchema = z.object({
  answer: z.string(),
  citations: z.array(WebCitationSchema),
  confidence: z.number().min(0).max(1),
  webSearchQueries: z.array(z.string()).optional(),
  metadata: z.object({
    reason: z.string().nullable(),
    source: z.literal("google-search-grounding"),
    searchDisabled: z.boolean().optional(),
  }),
});

export const EventCandidateSchema = z.object({
  title: z.string(),
  startAt: z.string().optional(), // ISO — require verify before save
  venueName: z.string().optional(),
  ticketUrl: z.string().url().optional(),
  citations: z.array(WebCitationSchema).min(1),
  source: z.literal("web_candidate"),
  confidence: z.number(),
});
```

**Fail-closed:** if `citations.length === 0` → `metadata.reason = 'no_grounding_metadata'`; UI shows “Couldn't verify online” not fake events.

---

## 12. UI recommendations (CopilotKit)

| UI element | When | Notes |
|------------|------|-------|
| **Web citation list** | Search tool render | Distinct from `GroundingAttribution` (Maps) |
| **“From the web” badge** | `source: web` | Per routing doc |
| **Stale / unverified badge** | No chunks | Yellow disclaimer |
| **Event candidate card** | Ingest flow | “Save to events?” HITL — Roberto |
| **Inline links** | Phase 2.1 | From `groundingSupports` |
| **Do not** render `searchEntryPoint` HTML blindly | — | ToS / branding review first |

Reuse F49 `useCopilotAction` pattern; registry keys in `mastra-tool-action-names.ts`.

---

## 13. Risks & mitigations

| Risk | Severity | Mitigation |
|------|----------|------------|
| **Cost** — 3–6 searches per prompt (Gemini 3+) | High | Separate quota bucket; cap per user/day; flag off default |
| **Simulated search** — answer without real chunks | High | Require `citations.length >= 1`; log `webSearchQueries` |
| **Snippets not full pages** | Medium | Use for facts/dates only; not legal/contracts |
| **Latency** +2–8s | Medium | Router: Search only when SQL empty + time intent |
| **Hallucination after search** | Medium | Verification layer (A2); never auto-insert Supabase |
| **Citation ToS** | Medium | `searchEntryPoint` optional; link out to `uri` |
| **Mixing web into SQL rows** | High | `source` field required; schema enforced |
| **Confusion with Maps grounding** | High | MAP-002D title + this doc; MAP-002E for Maps fallback |

---

## 14. Logging & quotas

| Signal | Where |
|--------|-------|
| `tool=search_grounded_*` | ADK structured logs |
| `webSearchQueries.length` | Sidecar metadata → Mastra `ai_runs` |
| `citations.length` | Quota success metric |
| `metadata.reason=search_disabled` | Flag off path |
| Daily cap | Extend `grounding_quota_log` **or** new `search_grounding_quota_log` table |

**Patricia dashboard:** billable search count ≈ sum of `webSearchQueries` per day (Gemini console cross-check per MAP-002D).

---

## 15. Tasks — create / amend

| ID | Action | Goal |
|----|--------|------|
| [**MAP-002D**](../maps/MAP-002D-search-grounding-enable.md) | **Amend** (implement) | SearchAgent + Mastra tool + flag + quota |
| [**MAP-002E**](../maps/MAP-002E-gemini-maps-fallback-runbook.md) | Keep separate | Maps fallback ops — not Search |
| **GS-001–GS-009** | **Filed** [`tasks/grounding-search/tasks/`](../tasks/INDEX.md) | See index — GS-001/002/003 ship with MAP-002D |
| **EVT-D09** | [`tasks/events/EVT-D09-human-approval-save-flow.md`](../../events/EVT-D09-human-approval-save-flow.md) | HITL save — **not** duplicate EVT-001 |
| **EVT-D05** | [`tasks/events/EVT-D05-google-search-grounding.md`](../../events/EVT-D05-google-search-grounding.md) | Event query templates |
| **plan/maps/search-grounding-routing.md** | **Amend** | Add router pseudocode + billing note |
| **sidecar-api-contract.md** | **Amend** | `search_grounded_events` I/O |
| **F49** | **Amend** (small) | Citation render row in generative table |

**Do not create MAP tasks for:** Live API, Interactions API, autonomous agents (see INDEX defer list).

### GS-001 sketch (types + parser)

- **Files:** `mdeapp/src/mastra/lib/search-grounding-types.ts`, `.test.ts`, `services/adk-grounding/search_grounding.py`
- **Env:** `GOOGLE_GENERATIVE_AI_API_KEY` on Cloud Run (already used for Maps fallback)
- **Tests:** fixture `groundingMetadata` from cookbook → ≥1 citation
- **Done:** Parser rejects empty chunks

### GS-002 sketch (UI)

- **Files:** `mdeapp/src/components/copilot/web-citation-list.tsx`, `search-tool-renders.tsx`
- **Tests:** Vitest props; Playwright “From the web” badge
- **Done:** Maps attribution unchanged on grounded place cards

---

## 16. Testing plan

| Layer | Test |
|-------|------|
| Unit | Parse sample `groundingMetadata` (from 01-playbook IPL example) |
| Unit | Empty chunks → `reason: no_grounding_metadata` |
| Unit | Quota increment once per invoke with 3 `webSearchQueries` |
| Integration | Mock ADK → Mastra tool → Zod pass |
| Integration | Flag off → `search_disabled` |
| E2E | Staging: weekend events query → ≥1 citation OR disclaimer |
| E2E | Same query with flag off → Supabase-only behavior |
| Security | `rg googleSearch mdeapp/src/components` → 0 |
| Ops | Cloud Run log line with `webSearchQueries` redacted |

---

## 17. Real-world orchestration example

**User (Tourist on `/chat`):** *"Best cafés near nightlife in Laureles tonight?"*

| Step | Layer | Output |
|------|-------|--------|
| 1 | Mastra router | Intent = places + optional freshness |
| 2 | Grounding Lite MCP | Pins: cafés, bars (Laureles bias via F50b) |
| 3 | Places Details | ratings, hours, photos (018B) |
| 4 | Supabase events | Optional nearby event rows |
| 5 | Search grounding | Only if: “tonight” trends / live music / closure rumors needed |
| 6 | Mastra synthesis | Prose + cards; web claims have citations |
| 7 | CopilotKit | `GroundedPlaceCard` + `WebCitationList` |

---

## 18. Implementation order

| Order | Work | Persona win | Defer? |
|------:|------|-------------|--------|
| 1 | **MAP-019** deep link CTAs | Camila polish | Now (P1) |
| 2 | **F50b** + MAP-002 G1 viewport | Camila map-aware search | Now |
| 3 | **MAP-002D** SearchAgent + `search_grounded_events` | Tourist weekend events | Phase 2 **first Search ship** |
| 4 | **GS-002** citation UI | Trust | With MAP-002D |
| 5 | **MAP-002E** runbook | Patricia debug | Parallel |
| 6 | `verify-ticket-source` tool | Andrés | After 002D stable |
| 7 | **EVT-001** candidate HITL | Roberto ingest | After citations work |
| 8 | Tool combination spike (G5) | Lower latency multi-tool | Phase 2.1 |
| 9 | Neighborhood Search (A4) | Camila | After MAP-012A |
| 10 | Itinerary agent (A3) | Tourist | Phase 3 |

**Do not build now:** Live voice Search, Interactions API, epilande MCP, autonomous digest agents, `searchEntryPoint` embed without legal review.

---

## 19. Summary analysis

### Strengths for mdeai

- Fills the **biggest MVP gap** in [`search-grounding-routing.md`](../../plan/maps/search-grounding-routing.md): time-sensitive promos when Supabase is incomplete.
- Complements (does not replace) **Grounding Lite + Places** — the travel-stack pattern Google describes ([Maps + Search event](https://cloudonair.withgoogle.com/events/grounding-ai-agents-google-search-maps)).
- **Mastra + ADK split** already proven on MAP-002; Search is the same shape as MapsAgent.
- **Citation metadata** is first-class in API — aligns with trust goals for Tourist and Andrés.

### Weaknesses to respect

- **Not** a place database; will not give stable `place_id` or map pins.
- **Per-query billing** on Gemini 3+ requires Patricia-grade quotas before enable.
- Community reports of **occasional “fake search”** behavior → enforce metadata gates ([discussion](https://www.reddit.com/r/Bard/comments/1k4x3oa/why_is_search_grounding_in_gemini_so_unreliable/) — treat as risk, not blocker).
- **Snippet depth** limits legal/medical/deep research use cases.

### Final scores (mdeai-specific)

| Area | Score |
|------|------:|
| Real-time freshness | 95 |
| Event discovery (with Supabase merge) | 98 |
| Citation / trust UX potential | 90 |
| Travel planning (multi-tool Phase 2+) | 97 |
| Local concierge feel | 96 |
| Production reliability (with guards) | 82 |
| Structured data for DB ingest | 78 |
| Deep research | 70 |
| **Overall when routed correctly** | **88** |
| **Fit with Mastra + ADK** | **98** |

### Bottom line

**Add Google Search Grounding via MAP-002D on the ADK sidecar, routed on demand after Supabase + MCP + Places, with mandatory citations and quotas.** That is the highest-ROI path to Mindtrip-grade freshness without breaking the maps architecture Camila and Roberto already depend on.

---

## 20. Quick links

| Doc | Path |
|-----|------|
| This summary | `tasks/grounding-search/docs/03-grounding-summary.md` |
| Task index | `tasks/grounding-search/tasks/INDEX.md` |
| Cookbook export | `tasks/grounding-search/docs/01-playbook.md` |
| Search + Live export | `tasks/grounding-search/docs/02-playbook.md` |
| MAP task | `tasks/maps/MAP-002D-search-grounding-enable.md` |
| Routing matrix | `plan/maps/search-grounding-routing.md` |
| Maps checklist (G3) | `tasks/maps/maps-checklist.md` §1b |
