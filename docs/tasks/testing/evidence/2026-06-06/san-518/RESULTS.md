# SAN-518 — /events browse (SCREEN-027)

**Branch:** `ai/san-518-screen-027-events-browse`  
**Merge:** PR #86 → `main` @ `9121df0`  
**Date:** 2026-06-06  
**API:** `GET /api/events/public` (SAN-586 @ `f1da6f3`)  
**Linear:** SAN-518 → **Done**

## Implementation

| Surface | Path |
|---------|------|
| SSR page | `mdeapp/src/app/events/page.tsx` |
| Loading | `mdeapp/src/app/events/loading.tsx` |
| Browse view | `mdeapp/src/components/events/event-browse-view.tsx` |
| Filters | `mdeapp/src/components/events/event-browse-filters.tsx` |
| Catalog fetch | `mdeapp/src/lib/events/fetch-public-events-catalog.ts` |
| EventCard browse | `detailsHref` + `"use client"` on `event-card.tsx` |

**Scope gates:** No Mastra, CopilotKit, or ticketing changes. Nav enabled separately in SAN-584 (#87).

## Tests

| Check | localhost | prod |
|-------|-----------|------|
| Vitest `event-card.test.ts` | 2/2 PASS | — |
| Vitest `list-published-events.test.ts` | 3/3 PASS | — |
| Playwright SCREEN-027 | 6/6 PASS | — |
| Visual evidence 375/768/1280 | 3/3 PASS | — |
| `curl GET /events` | — | **200** |
| `curl GET /api/events/public` | — | **200** |
| Browser `/events` catalog | — | **PASS** (34 cards) |
| Filter `?category=music` | — | **PASS** (6 events) |
| Detail `/events/dreaming-festival-2026` | — | **200** |

```bash
cd mdeapp
infisical run --silent --env=dev --path=/ -- npx playwright test e2e/screens/SCREEN-027-events-browse.spec.ts --project=chromium --workers=1
curl -s -o /dev/null -w "prod GET /events -> %{http_code}\n" https://www.mdeai.co/events
```

## Screenshots

- `375-events.png`
- `768-events.png`
- `1280-events.png`

## Next

- ~~SAN-584: flip `chat-nav-rail.tsx` events `href: "/events"`~~ **Done** — see `san-584/RESULTS.md`
