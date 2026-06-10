# SAN-494 · EVT-035 — Restaurant card Event Venue CTA — production evidence

Date: 2026-06-10 (evidence folder dated 2026-06-09 per session start) · Verifier: Claude Code (senior-QA run) · Env: production `https://www.mdeai.co` + live Supabase `zkwcbyxiwklihegjhuql`

## Verdict

**The Event Venue CTA is LIVE on production** for the one mapped real venue (Mamasita Medallo, El Poblado). All other restaurant cards correctly show no CTA (graceful absence). Full chain verified: schema → seed → real place-id mapping → badge → CTA → offerings sheet → close — zero console errors.

## Ship chain

| Item | Status | Evidence |
|---|---|---|
| PR #152 — SAN-494 · EVT-035 — Restaurant card Event Venue CTA | ✅ MERGED (squash `a04d37c`), prod deploy 2026-06-10T02:16Z | `gh pr view 152` |
| PR #154 — chore(SAN-492 · EVT-033): post-apply types regen | ✅ MERGED 2026-06-10T03:08Z | `gh pr view 154` |
| SAN-492 · EVT-033 migration applied to live | ✅ `apply_migration san492_event_venue_offerings` | Pre-flight clean (0 partial objects, 3/3 helpers); post: 2 tables RLS-on, 9/9 policies, trigger + `partner_is_active()` |
| Security advisors (post-apply) | ✅ 1 new finding remediated | `san492_revoke_trigger_fn_execute` — revoked REST execute on `bookings_validate_event_resource` (lint 0028). `partner_is_active` anon-exec intentional (RLS dependency). No other new criticals. |
| SAN-493 · EVT-034 seed applied to live | ✅ | 6 venues / 3 offerings / 1 package visible via anon RLS |
| Real place-id mapping | ✅ ONE row updated | `partner_locations` `…8201`: `ChIJSAN493MAMACITA01` → `ChIJIZa426ApRI4RI64OTsQSOEg` (from prod `restaurants.google_place_id` for "Mamasita Medallo" — looked up, not guessed). Label updated to "Mamasita Medallo". Before/after SQL captured in session. Other 5 seed rows left synthetic (intentionally CTA-invisible). |

## Database verification (anon role, read-only)

- Mapped location resolves: `Mamasita Medallo` by real place id ✅
- `venue_event_offerings` for that location: **1** ✅ · `venue_event_packages`: **1** ✅
- Total anon-visible event locations: 6 (5 synthetic — never match real cards) ✅
- No unexpected leakage: pre-seed anon counts were 0; policies gate on verified + event-capable + active partner ✅

## Browser proof — Chrome DevTools MCP on https://www.mdeai.co/chat

Query "casual Colombian restaurants in El Poblado" → Mamasita Medallo card:

- Restaurant cards render ✅ (also verified with "suggest restaurants medellin": 5 cards)
- **Hosts Events badge visible: 1** ✅
- **Event Venue CTA visible: 1**, touch target **103×44px** (≥44px) ✅
- Click CTA → `event-venue-offerings-sheet` opens: offerings list, 1 offering card ("Birthday · From COP 85,000"), 1 package card ✅
- Sheet copy correct: "Mamasita Medallo · Provenza … no payment or booking yet" ✅
- Escape closes sheet ✅
- Console errors: **0** · hydration errors: **0** ✅
- Screenshot: [`SAN-494-prod-cta-sheet-open.png`](./SAN-494-prod-cta-sheet-open.png)
- Cards without mapped venues (Carmen, Alambique, Verdeo, San Carbón, …): no CTA, no badge, no crash ✅

## Playwright results

| Run | Result |
|---|---|
| `e2e/san-494-event-venue-cta.spec.ts` dual-state vs **prod** | ✅ 1/1 pass (25.3s) |
| Same spec vs **local** dev (live DB) | ✅ 1/1 pass (23.1s) |
| `e2e/prod-synthetic-smoke.spec.ts` (UX-034 4-query matrix) vs prod | ✅ 1/1 pass (1.7m) |
| Unit tests (deterministic positive path) | ✅ 13 pass across restaurant-card / offerings-sheet / fetch / schema-error |

**Spec note:** the original spec's mocked chat e2e was removed, not weakened — concierge card composition is LLM-routed and nondeterministic (clarify replies, placeId-less card paths), making a mocked chat e2e irreducibly flaky. The deterministic positive path lives in unit tests; the live dual-state e2e covers both prod states (CTA when a real venue is mapped, clean absence otherwise).

## CTA visibility status

**Intentionally live for exactly one venue** (Mamasita Medallo). The other 5 seed venues keep synthetic place ids and stay invisible on user-facing cards until mapped to real Google place ids — one `UPDATE` each, following the before/after pattern above.
