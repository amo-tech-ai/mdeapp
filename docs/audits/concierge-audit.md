# Concierge audit — June 8, 2026

**Surfaces:** `/` (marketing handoff) → `/chat` (GeoChatShell)  
**Prod base:** https://www.mdeai.co  
**Evidence:** `tasks/testing/evidence/2026-06-08/`

## Vertical matrix

| Vertical | Cards | Pins | Details | Request action | Status |
|----------|-------|------|---------|----------------|--------|
| **Rentals** | ✅ Fast-path `rental-card` (5 on prod API) | ✅ Lat/lng on payload; map pins when coords present | ✅ `rental-details-cta` → map detail panel | ✅ `rental-schedule-cta` → `schedule-viewing-modal` (HITL lead) | **PASS** — clarify path on vague queries adds ~30–90s |
| **Events** | ✅ `event-card` (10+ in API; prod smoke 4/4) | 🟡 Pins only when venue has lat/lng — often 0 pins on home handoff | ✅ `event-details-cta` / `event-source-link` | ✅ `event-buy-cta` when ticket tiers exist | **PASS** (cards) — map pins inconsistent |
| **Restaurants** | ✅ Fast-path `restaurant-card` (5 on prod) | ✅ Map pins with grounded results | ✅ Card → map column detail (fast-path panel) | 🟡 Maps/directions links; no in-app booking yet | **PASS** — photo placeholders on some cards |
| **Cafés** | ✅ `grounded-card[data-result-kind="cafe"]` (5 on prod) | ✅ Pins sync with cards | ✅ Click → `venue-detail-sheet` (Places enrichment) | 🟡 `cafe-booking-sheet` when Place ID verified; blocked without `placeId` | **PASS** |
| **Nightlife** | ✅ `nightlife-card` (VEN-025 routing) | ✅ Pins on grounded nightlife | ✅ `nightlife-details-cta` → `nightlife-detail-panel` | 🟡 Safety notice shown; no ticket/booking CTA in chat | **PASS** — not in prod-synthetic 4-query matrix; covered by VEN-025 e2e |

## API / smoke (prod)

| Check | Result |
|-------|--------|
| `GET /` | ✅ 200 (~3s — slow warn) |
| `GET /chat` | ✅ 200 |
| `POST /api/rentals/search` | ✅ 5 results, shape + geo |
| `POST /api/events/search` | ✅ 10 results, shape + source URL |
| `POST /api/copilotkit` empty | 🟡 **401** (smoke expects 400; pre-existing auth gate) |
| `GET /api/places/detail` validation | ✅ 400 on bad/missing `placeId` |

Saved: `tasks/testing/evidence/2026-06-08/chat-smoke-prod.txt`

## Gaps & UX issues

### Missing / thin fields

- **Restaurants:** Hero image often `restaurant-card-photo-placeholder` when Places photo cache cold.
- **Rentals:** Some listings lack lat/lng — pins skip those rows (API allows explicit absence).
- **Cafés:** Booking request disabled when listing missing verified Google `placeId`.
- **Events:** `this_week` filter returns sparse set; agent should prefer `any` window for browse queries.

### Bad / slow paths

- **Vague rental queries** (`apartments in laureles`) hit agent clarify before `search_rentals` — 30–90s extra latency vs fast-path `RENTAL_QUERY`.
- **Home handoff `?q=` strip:** On slow agent-clarify, URL may keep `?q=` until turn completes (send-then-strip in `.finally()` — correct, but looks broken briefly).
- **CopilotKit POST budget:** Vertical handoffs can issue 6–8 POSTs per query; monitor on prod (prod-synthetic budget test passed).

### UX

- **Marketing vs concierge:** `/` and `/chat` are distinct surfaces post-SAN-733 — nav should always offer explicit “Chat” entry (FAB + hero).
- **Headless E2E hero:** React controlled input required `fill` + native setter fallback; real Chrome unaffected.
- **Nightlife:** No dedicated prod-synthetic prompt in 4-query matrix — add to launch regression set.

## Home → chat handoff (SAN-733)

```text
/ → hero search → /chat?q= → auto-send → cards → pins → /chat
```

| Test | Result |
|------|--------|
| SAN-733 core E2E (cafés + FAB) | ✅ PASS |
| Vertical E2E (5 verticals) | See `home-to-chat-vertical-e2e.txt` |

## Recommended follow-ups (post-launch)

1. Align prod `POST /api/copilotkit` empty-body status with smoke (400 vs 401).
2. Add nightlife to `prod-synthetic-smoke.spec.ts` 5-query matrix.
3. Warm Places photo cache for restaurant fast-path cards on Vercel.
4. Rental handoff: detect Laureles/1BR patterns client-side to skip clarify when possible.
