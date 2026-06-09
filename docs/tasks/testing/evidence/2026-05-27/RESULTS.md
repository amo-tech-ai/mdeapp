# Testing run — 2026-05-27

**Packs:** `01-event-discovery-smoke.md` (10-point matrix) · `02-multi-intent-stress.md` (API + spot) · `scripts/chat-smoke.mjs` · Playwright SCREEN-005/006 + rich-card-dedup

## Dev restart

```bash
rm -rf mdeapp/.next && cd mdeapp && npm run dev
```

- Port: **3001** — Ready
- GET `/` → **200**

---

## Automated (localhost + prod)

| Check | Localhost | Prod |
|-------|-----------|------|
| `chat-smoke.mjs` | **PASS** (all) | **PASS** (all) |
| GET `/` | 200 | 200 |
| POST `/api/events/search` any×10 | 10 rows | 10 rows |
| POST `/api/events/search` this_week | 1 row (sparse OK) | 1 row |
| Event shape + geo backing | PASS | PASS |
| POST `/api/rentals/search` | **200** (5 rows) | **404** |

---

## Playwright

| Spec | Result |
|------|--------|
| `SCREEN-005-rental-card.spec.ts` | **3/3 PASS** |
| `SCREEN-006-event-card.spec.ts` | **1/3 PASS** — `event query renders cards…` **FAIL** (no `[data-testid="event-card"]` within 120s) |
| `rich-card-dedup.spec.ts` | **2/3 PASS** — events case **FAIL** (Map results list visible; no chat `event-card`) |
| Cafés + rentals dedup | PASS |

**Root cause (events):** Events chip / Show-all **fast path** writes rows to `EventSearchResults` + map pins + local prose (`Found N events…`). It does **not** mount inline `EventCard` components in chat (unlike rental `RentalFastPathPanel`). Playwright and pack §7 expect `data-testid="event-card"` in `#copilot-chat-region`.

---

## Pack 01 — 10-point matrix (localhost, browser)

**Flow:** Events chip → **Show all** (auto-search) — also tried improved prompt in input.

| # | Check | Result | Notes |
|---|-------|--------|-------|
| 1 | Page load, no console `error` | **PARTIAL** | Next.js hydration overlay in dev; no blocking runtime crash |
| 2 | CopilotKit POST 200 | **PASS** | `chat-smoke` + prior session saw `/api/copilotkit` 200 |
| 3 | Agent path | **PARTIAL** | Fast-path `/api/events/search`; not full Mastra `search-events` tool render |
| 4 | Intent → events | **PASS** | Show all + Events chip → event inventory |
| 5 | Real DB results | **PASS** | Sébastien Léger, Salsa Night, Feria 2 Ruedas, etc. (10) |
| 6 | Fields title/venue/neighborhood/link | **PASS** | Visible in map-side list + Google Maps links |
| 7 | Inline event cards (`event-card`) | **FAIL** | **0** `[data-testid="event-card"]` in chat; list only in **Map results** column |
| 8 | Map pins merge | **PARTIAL** | **10 pins** (`Open map with 10 pins`); generic **Map results** list duplicates chat intent (dedup rule violated) |
| 9 | Network 401/403/500 | **PASS** | API curls + smoke clean |
| 10 | Terminal Mastra/Gemini errors | **PASS** | No dev-server crash observed |

**Verdict pack 01 localhost:** **6 PASS · 3 PARTIAL · 1 FAIL** (#7 inline cards)

---

## Pack 02 — multi-intent spot (this run)

| ID | Prompt | Localhost | Notes |
|----|--------|-----------|-------|
| M01 / rental query | `1BR apartment in Laureles under 80 dollars per night` | **PASS** (2026-05-27) | See below |
| M01 | Prod | **FAIL** | `/api/rentals/search` → **404** |

### Rental query run (2026-05-27)

**Prompt:** `1BR apartment in Laureles under 80 dollars per night`  
**Precondition:** No Events chip (all filters released)

| Assert | Result |
|--------|--------|
| Playwright SCREEN-005 desktop | **PASS** (3.5s) |
| `POST /api/rentals/search` | **200** — 5 rows, first *Cozy Studio Apartment in Laureles* |
| `[data-testid="rental-card"]` | **5** |
| `[data-testid="rental-fast-path-panel"]` | **1** |
| `[data-testid="rental-schedule-cta"]` | **5** |
| `[data-testid="results-column"]` | **0** |
| Duplicate narrative (`What I searched for`) | **0** |
| Map | `Open map (5)` |
| Wrong route (`No events matched`) | **absent** |
| M02–M10 | Not run end-to-end this session | — | See `02-multi-intent-stress.md` known failures |

---

## Production gap

Rentals + event fast-path UI fixes are **localhost-only** until deploy. Prod API smoke for events passes; prod rental search route missing.

---

## Recommended fix (events #7 / Playwright)

Add `EventFastPathPanel` (mirror `RentalFastPathPanel`) rendering `EventCard` list in chat when `lastEventResults` / fast-path rows exist; keep `RichCardResultsRegistrar` so `results-column` stays hidden.
