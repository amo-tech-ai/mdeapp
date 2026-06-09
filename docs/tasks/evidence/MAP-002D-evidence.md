# MAP-002D evidence — 2026-05-26 (Done)

## Shipped

| Layer | Deliverable |
|-------|-------------|
| Sidecar | `search_grounded_events`, Cloud Run `ENABLE_SEARCH_GROUNDING=1` (rev **00011-lbt**) |
| Mastra | `searchWebGroundedEventsTool`, quota (`search_grounding_quota_log`), `search-intent-router` |
| UI | `WebCitationList` ("From the web"), `EventResultsPanel` + `EventWebCitationFetch` |
| API | `POST /api/grounding/event-web` (client fetch after concierge turn) |
| Scripts | `npm run verify:search-grounding`, `npm run smoke:search-grounding` |
| Env | `mdeapp/.env.local`: `ENABLE_SEARCH_GROUNDING=1`, `SEARCH_GROUNDING_DAILY_CAP=50`, single `ADK_GROUNDING_URL` (prod) |

## Verification (2026-05-26)

```bash
cd mdeapp
npm run floor                    # exit 0
npm run verify:search-grounding  # ≥1 citation with http URL
npm run smoke:search-grounding   # chat shows web-citation-badge + links
```

Smoke output (excerpt):

```
✅ search_grounded_events → 21 citation(s) with URLs
✅ MAP-002D chat smoke
   From the web badge: 1
   citation links: 8
   screenshot: mdeapp/tmp/map-002d-web-citations-*.png
```

Runtime: `npm run dev` — UI `:3001`, Mastra `:4111`.

## Architecture note

- **Primary UI path:** after CopilotKit turn completes (`isLoading` false), `EventWebCitationFetch` calls `/api/grounding/event-web` when `shouldChainWebGrounding` applies (time-sensitive event filters).
- **Standalone tool:** `search-web-grounded-events` remains for explicit agent invocation; `EventWebCitationSync` mirrors tool results if AG-UI streams `webGrounding`.
- **Not duplicated:** search-events no longer blocks on ADK web (avoids double quota + 90s tool latency).

## Patricia / quota

- Quota increments on `incrementAndCheckSearchGroundingQuota` per `/api/grounding/event-web` and `searchWebGroundedEventsTool` invoke.
- Console vs `search_grounding_quota_log` reconciliation: manual (±1 day).

## Local ADK mask v3

Prod Cloud Run verified (MAP-019). Local `:8000` requires `GOOGLE_MAPS_SERVER_API_KEY` in sidecar shell — see `services/adk-grounding/RUNBOOK.md`.
