# SAN-494 · EVT-035 — Restaurant card Event Venue CTA — verification

**Date:** 2026-06-10 · **Class U** · **Env:** localhost `http://localhost:3001` + live Supabase  
**Linear:** [SAN-494 · EVT-035 — Restaurant card Event Venue CTA](https://linear.app/sanjiovani/issue/SAN-494)

## Verdict

**PASS** — Implementation on `main` (PR #152). Tourist can see **Hosts Events** badge + **Event Venue** CTA when offerings exist; CTA opens offerings sheet; no DB write on CTA click.

## Acceptance criteria

| Check | Result |
|-------|--------|
| CTA only when venue has offerings (`hasOfferings` via `useEventVenueOfferings`) | ✅ |
| `data-testid="event-venue-cta"` touch target ≥44px (`h-11 min-w-11`) | ✅ vitest |
| Opens `event-venue-offerings-sheet` with offering/package cards | ✅ e2e (state B) or clean absence (state A) |
| No booking / proposal insert on CTA | ✅ sheet copy + no SAN-496 tool |
| Wired in chat via `RestaurantCardWithEventVenue` → `DomainResults` | ✅ |
| Blocked-by SAN-492 schema | ✅ Done |
| Blocked-by SAN-493 seed | ✅ Done |

## Commands run (2026-06-10)

```bash
npm test -- --run restaurant-card event-venue-offerings fetch-event-venue is-schema-unavailable
# → 4 files, 14 tests passed

npx playwright test e2e/san-494-event-venue-cta.spec.ts --project=chromium
# → 1 passed (10.6s)

curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/
# → 200

curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:3001/api/copilotkit -H "Content-Type: application/json" -d '{}'
# → 400 (runtime up; empty body rejected as expected)
```

## Implementation map (disk)

| File | Role |
|------|------|
| `src/components/copilot/restaurant-card.tsx` | Badge + CTA UI |
| `src/components/copilot/restaurant-card-with-event-venue.tsx` | Offerings fetch + `openEventVenueOfferings` |
| `src/components/copilot/domain-results.tsx` | Chat restaurant cards |
| `src/hooks/use-event-venue-offerings.ts` | Async offerings by `placeId` |
| `src/lib/venues/fetch-event-venue-offerings.ts` | Supabase query chain |
| `src/components/sheets/event-venue-offerings-sheet.tsx` | SAN-495 shell (opened from CTA) |
| `src/components/chat/geo-chat-shell.tsx` | Sheet mount |

## Prior prod evidence

See [`../2026-06-09/SAN-494-prod-RESULTS.md`](../2026-06-09/SAN-494-prod-RESULTS.md) — Mamasita Medallo CTA live on mdeai.co (2026-06-10).

## Notes

- Playwright firefox/webkit projects fail locally (browsers not installed); **chromium** is the workflow gate per Class U matrix.
- Dual-state e2e: State A = no mapped venue in returned cards (no CTA); State B = mapped venue → full sheet flow.
