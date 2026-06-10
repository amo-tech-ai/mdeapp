# Prod live journey matrix — https://www.mdeai.co/

**Rule:** [`.cursor/rules/mdeai-live-prod-check.mdc`](../../.cursor/rules/mdeai-live-prod-check.mdc)  
**Playwright:** [`mdeapp/e2e/prod-synthetic-smoke.spec.ts`](../../mdeapp/e2e/prod-synthetic-smoke.spec.ts) (core 4) · [`prod-venues-journey.spec.ts`](../../mdeapp/e2e/prod-venues-journey.spec.ts) (J05–J08)  
**API smoke:** [`scripts/chat-smoke.mjs`](./scripts/chat-smoke.mjs)  
**Task verify:** `cd mdeapp && npm run verify:task -- OPS-JOURNEY`

Run **localhost first**, then **prod** with the same prompt. Log both in `evidence/YYYY-MM-DD/prod-live-RESULTS.md`.

---

## Core 4-query matrix (automated)

Already in `prod-synthetic-smoke.spec.ts`:

| # | Persona | Prompt | Pass criteria |
|---|---------|--------|---------------|
| 1 | Camila | `1BR apartment in Laureles under 80 dollars per night` | rental cards + map pins |
| 2 | Andrés | `salsa events this weekend in Medellín` | event cards ≥1 |
| 3 | Tourist | `suggest restaurants medellin` | restaurant cards ≥1 |
| 4 | Tourist | `good specialty coffee in Laureles` | grounded café cards, `data-result-kind="cafe"` |

---

## Recommended additional journeys (manual / future Playwright)

### Venues & intelligence (post DATA-041)

| ID | Persona | Prompt | Pass criteria | Task |
|----|---------|--------|---------------|------|
| J05 | Carlos | `quiet rooftop dinner in Provenza` | restaurant cards; Relato/O.C.I. rank high; not generic PlaceCard | DATA-041 / SEARCH-003 |
| J06 | Carlos | `rooftop cocktails in Provenza tonight` | **nightlife** panel or card — NOT café detail | VEN-012 |
| J07 | Tourist | `best brunch in El Poblado` | restaurant cards + brunch signal chip if wired | VEN-009 |
| J08 | Tourist | Tap restaurant card → Details | slide panel + book CTA | VEN-010 |

### Events & host

| ID | Persona | Prompt / flow | Pass criteria | Task |
|----|---------|---------------|---------------|------|
| J09 | Andrés | Event card → Buy / CTA | checkout modal or login redirect (Stripe ⏸) | PAY-001 |
| J10 | Roberto | `/host/event/new` wizard | HITL publish flow | SCREEN-004 ✅ |
| J11 | Roberto | `/host/events` | list of host events | EVP-014 |

### Rentals & leads

| ID | Persona | Prompt / flow | Pass criteria | Task |
|----|---------|---------------|---------------|------|
| J12 | Camila | `/rentals` browse (not chat only) | hybrid cards on page | SCREEN-005 🟥 |
| J13 | Camila | Rental card → Schedule viewing | G2 modal + lead row | G2 ✅ |
| J14 | Camila | Follow-up: `when can I view?` | stays rental context (no chitchat reset) | INT-003 |

### Map & UX

| ID | Persona | Prompt / flow | Pass criteria | Task |
|----|---------|---------------|---------------|------|
| J15 | Any | Two searches back-to-back | old pins cleared; no ghosts | UX-033 |
| J16 | Desktop | Hover rental card | matching pin highlights | UX-024 |
| J17 | Mobile 390px | Same café prompt | drawer + FAB; send visible | SCREEN-018 |

### Auth & trips

| ID | Persona | Flow | Pass criteria | Task |
|----|---------|------|---------------|------|
| J18 | Andrés | Login → `/me/tickets` | wallet + QR | SCREEN-015 ✅ |
| J19 | Camila | `/trips` signed in | dashboard or empty state (not 500) | TRIP-002 |
| J20 | Camila | `/saved` | collections grid | TRIP-006 |

### Production health (non-UI)

| ID | Check | Command | Pass |
|----|-------|---------|------|
| H01 | Synthetic nightly | SAN-462 cron / Playwright | 4/4 green |
| H02 | CopilotKit budget | CK POSTs per query | ≤8 after idle 32s |
| H03 | Console clean | Browser MCP / CDP | 0 errors on `/` load |
| H04 | Places detail | `GET /api/places/detail?placeId=invalid` | 400 not 502 |

---

## Automated J05–J08

```bash
cd mdeapp
PROD_SMOKE_BASE_URL=https://www.mdeai.co npm run test:e2e:prod-venues-journey
```

## Priority backlog for new Playwright specs

1. ~~**`e2e/prod-venues-journey.spec.ts`**~~ — J05 + J06 + J07 + J08 ✅
2. **`e2e/prod-restaurant-detail.spec.ts`** — booking sheet open after panel
3. **`e2e/prod-rentals-page.spec.ts`** — J12 `/rentals` page (when SCREEN-005 ships)
4. **`e2e/prod-mobile-concierge.spec.ts`** — J17 @ 390px

---

## Last verified (agent)

| When | Tier 1 chat-smoke | Browser shell |
|------|-------------------|---------------|
| 2026-06-03 | ✅ prod 200, all API checks PASS | ✅ home loads, chat + map regions present |
