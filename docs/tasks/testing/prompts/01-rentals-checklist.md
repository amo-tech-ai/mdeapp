# C-010 Rentals — verification checklist (commits + tests)

> **Scope:** Verify the rental fast-path stack (PRs #10–#12) works, then close test gaps.
> **Prompt source:** [`01-rentals-prompt.md`](./01-rentals-prompt.md) · **Prod:** https://www.mdeai.co/
> **Playwright gate:** [`e2e/prod/pr12-pin-clear-prod-gate.spec.ts`](../../../mdeapp/e2e/prod/pr12-pin-clear-prod-gate.spec.ts)
> **Last run:** 2026-05-28 (prod API + reads). Floor re-run after lint fix — see §E.

---

## Commits under verification

| SHA | PR | What it ships | Verify via |
|-----|----|--------------|-----------|
| `7b3d58e` | [#10](https://github.com/amo-tech-ai/mdeapp/pull/10) | C-010 fast-path API + inline cards + NL parser + sanitizer | §B, §C |
| `1be547f` | [#11](https://github.com/amo-tech-ai/mdeapp/pull/11) | PR-review safety fixes (body validation, parser) | §B3, §D |
| `7ff906f` | — | Clear rental pins on empty fast-path results | §C, §D-13 |
| `61d1a3b` | — | Align `showExchange` type with implementation | floor typecheck (§E) |
| `e8d2a60` | [#12](https://github.com/amo-tech-ai/mdeapp/pull/12) | Clear rental pins on empty (merged) | §C |

Key files: [`route.ts`](../../../mdeapp/src/app/api/rentals/search/route.ts) · [`rental-query-parser.ts`](../../../mdeapp/src/lib/rental-query-parser.ts) · [`use-rental-search-fast-path.ts`](../../../mdeapp/src/hooks/use-rental-search-fast-path.ts) · [`merge-pins-by-category.ts`](../../../mdeapp/src/platform/maps/merge-pins-by-category.ts) · [`sanitize-assistant-chat-content.ts`](../../../mdeapp/src/lib/sanitize-assistant-chat-content.ts) · [`rental-display.ts`](../../../mdeapp/src/lib/rental-display.ts)

---

## A — Deploy state (prod)

- [x] `GET /` → **200** (`0.66s`)
- [x] `/api/rentals/search` exists on prod → **405** on GET (POST-only route is deployed)
- [ ] Confirm prod commit ≥ `e8d2a60` (Vercel `amo100/mdeai`) before claiming Done

---

## B — Prod API smoke (backend, curl) ✅ PASS 2026-05-28

```bash
# Test A — happy path (expect 200 + results)
curl -s -X POST https://www.mdeai.co/api/rentals/search \
  -H "Content-Type: application/json" \
  -d '{"neighborhood":"Laureles","minBedrooms":1,"maxPricePerNight":80}' -w "\n[%{http_code}]\n"

# Test B — zero result (expect 200 + results:[])
curl -s -X POST https://www.mdeai.co/api/rentals/search \
  -H "Content-Type: application/json" \
  -d '{"neighborhood":"Laureles","minBedrooms":1,"maxPricePerNight":1}' -w "\n[%{http_code}]\n"

# Bad body — expect 400 Zod error
curl -s -X POST https://www.mdeai.co/api/rentals/search \
  -H "Content-Type: application/json" -d '{"maxPricePerNight":-5}' -w "\n[%{http_code}]\n"
```

| # | Check | Result |
|---|-------|--------|
| B1 | Test A → **200** with ≥1 result | ✅ `$25` Cozy Studio + `$45` Estadio 1BR |
| B2 | Results carry `latitude`/`longitude` (pins can render) | ✅ `6.245678, -75.589012` |
| B3 | Results carry `schedule_viewing_url` (CTA) + `wifi` | ✅ both present |
| B4 | IDs are real apartment UUIDs (no invented listings) | ✅ DB UUID + seed stub |
| B5 | Test B → **200** `{"results":[],"total":0,"source":"supabase"}` (no crash) | ✅ |
| B6 | Bad body → **400** Zod `invalid body` | ✅ |

---

## C — Browser / Playwright prod gate (UI behavior)

Run the existing prod gate spec (encodes the two prompt queries end-to-end):

```bash
cd /home/sk/mdeai/mdeapp
SMOKE_BASE_URL=https://www.mdeai.co PW_SKIP_WEBSERVER=1 \
  npx playwright test e2e/prod/pr12-pin-clear-prod-gate.spec.ts --project=chromium --workers=1
```

**Test A — happy path** (prompt: `1BR in Laureles under $80/night`)
- [ ] `[data-testid="rental-card"]` renders inline in chat (≥1)
- [ ] rental map pins visible (or card `data-pin-id` ↔ map pin matches under clustering)
- [ ] `[data-testid="rental-schedule-cta"]` visible
- [ ] **no** duplicate generic "Map results" column (`assertNoGenericMapResultsList`)
- [ ] no critical console errors

**Test B — zero result** (prompt: `1BR in Laureles under $1/night`)
- [ ] no crash; chat shows "No rentals matched…" copy
- [ ] rental pins poll to **0** (cleared)
- [ ] rental cards count **0**
- [ ] no stale rental pins remain

> ⚠️ **Status:** `e2e/prod/pr12-pin-clear-prod-gate.spec.ts` is **untracked** (`git status: ?? e2e/prod/`). Had an unused `pinsBefore` var that failed `eslint --max-warnings 0` (blocked floor) — now removed. **Commit it** so the gate survives, or it will be lost.

---

## D — Additional tests to add (gaps)

The curl smoke (§B) only exercises the **backend with structured params**. It does **not** cover the client-side NL parser, sanitizer, or cross-vertical pin sync. Highest-value gaps, by area:

### Parser ([`rental-query-parser.ts`](../../../mdeapp/src/lib/rental-query-parser.ts)) — unit tests (Vitest)
- [ ] **D1 — Budget ambiguity:** `$500` (no "/night") is treated as **monthly** → `maxPricePerNight ≈ 17`. Confirm `$500/night` stays nightly. Catch `"$500 a night"` — "a night" is **not** matched by the `/night|per night` regex, so it falls into the monthly branch (likely a bug). Add a case.
- [ ] **D2 — Monthly / trip math:** `$2000/month` → ~$67/night; `$3000 for the trip` + `10 days` → ~$300/night. Assert `budgetType`.
- [ ] **D3 — Soft budget words:** `cheap` / `budget` / `affordable` → default `maxPricePerNight: 60`, routes to search (not clarify).
- [ ] **D4 — Bedrooms:** `studio` → `0`; `1BR` / `one bedroom` → `1`. Note `two bedroom` (spelled) is **not** matched — only digits or `one/1/2/3 bedroom`. Decide if that's intended; add a case either way.
- [ ] **D5 — Neighborhood coverage:** only Laureles, El Poblado (+`provenza`), Envigado, Belén, Estadio are recognized. `Sabaneta` / `Manila` / `Ciudad del Río` produce **no** neighborhood signal → verify they still fast-path on budget+bedrooms, or clarify.

### Intent routing (regression of PR #7 hijack fix)
- [ ] **D6 — Event words don't hijack:** `events in Laureles` must **not** hit rental fast-path (`looksLikeNonRentalSearch` → true).
- [ ] **D7 — Mixed intent:** `rentals near salsa nightlife in Laureles` — rental intent wins; stays a rental search.
- [ ] **D8 — Generic → clarify → answer:** `show me apartments` (no budget/bed/neighborhood, confidence < 0.6) → instant clarify; follow-up `Laureles under $80` with `genericAskPending` → merges and searches. Multi-turn test.

### Backend ([`route.ts`](../../../mdeapp/src/app/api/rentals/search/route.ts))
- [ ] **D9 — Boundary price:** listing priced **exactly** at `maxPricePerNight` is included (inclusive `<=`).
- [ ] **D10 — `limit` cap:** `limit > 20` → 400; default 8 when omitted.
- [ ] **D11 — Supabase-down path:** force `searchRentals` failure → API returns **500** `rental_search_failed` (not a leaked stack); hook sets `setToolResult(null)`.

### Sanitizer ([`sanitize-assistant-chat-content.ts`](../../../mdeapp/src/lib/sanitize-assistant-chat-content.ts)) — the "no duplicate column" guard
- [ ] **D12 — Rental boilerplate hidden:** prose with `solid short-term rental` + `best option` + (`next step`|`why these match`) → `isRentalResultsBoilerplate` true → chat content hidden (cards only).
- [ ] **D13 — Tool-leak JSON stripped:** model echo of `{success:true}`, `source:"grounding"`, or `results[].placeId` removed from prose; `Google Maps sources` venue-list echo stripped.

### Cross-vertical pin sync ([`merge-pins-by-category.ts`](../../../mdeapp/src/platform/maps/merge-pins-by-category.ts))
- [ ] **D14 — Other categories survive:** search rentals → search cafés (or events) → empty rental search → **café/event pins remain**, only rental pins clear. (The prompt's "other category pins remain" — add as an explicit Playwright case beyond the single-vertical gate.)
- [ ] **D15 — Pin dedup:** two listings sharing a `placeId` → one pin (`pinDedupeKey`).

### Mobile / UX (C-010 touched [`map-mobile-sheet.tsx`](../../../mdeapp/src/components/chat/map-mobile-sheet.tsx))
- [ ] **D16 — Mobile sheet:** rental cards + map sheet behave on a phone viewport (375px) — cards reachable, map toggle works.
- [ ] **D17 — Latency:** full chat round-trip to first card < 3s preferred, < 6s max (API alone was 0.66s).

---

## E — Floor / regression gate

```bash
cd /home/sk/mdeai/mdeapp && npm run floor   # lint && typecheck && build && test && audit
```

- [x] `npm run floor` exit **0** — lint ✓ · typecheck ✓ · build ✓ · **298 tests (73 files) ✓** · audit ✓ (10 moderate < high threshold). 2026-05-28, after the `pinsBefore` lint fix (§C).
- [x] Existing rental unit tests green: `rental-display.test.ts`, `rental-search-fast-path.test.ts`, `sanitize-assistant-chat-content.test.ts`, `merge-pins-by-category.test.ts` (in the 298)
- [ ] `e2e/screens/SCREEN-005-rental-card.spec.ts` green (localhost)

---

## Evidence

Save under `tasks/testing/evidence/2026-05-28/`:
- `rental-c010-RESULTS.md` — PASS/FAIL matrix (localhost + prod)
- Playwright screenshots from the prod gate (`PR12-PROD-GATE-*.png`)
- `console.txt` / `network.json` if any errors

## Verdict (fill on completion)
- Test A (cards + pins): ___
- Test B (pins clear, no crash): ___
- Floor exit: ___
- Untracked `e2e/prod/` committed: yes / no
- Remaining blockers: ___
