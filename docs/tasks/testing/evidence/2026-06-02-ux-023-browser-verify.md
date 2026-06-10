# UX-023 — browser + Playwright verification (2026-06-02)

**Dev:** `http://localhost:3000` (UI) + Mastra `:4111` — clean restart OK

## Playwright (SMOKE_BASE_URL=http://localhost:3000 PW_SKIP_WEBSERVER=1)

| Suite | Result |
|-------|--------|
| `e2e/card-unification.spec.ts` | 4/4 pass (56s) |
| `e2e/screens/SCREEN-005-rental-card.spec.ts` desktop | 2/2 pass |
| `e2e/screens/SCREEN-006-event-card.spec.ts` desktop | 2/2 pass |
| `e2e/visual-all-cards.spec.ts` | 4/4 pass + PNGs |

Screenshots: `tasks/testing/evidence/visual-cards/01-restaurants.png` … `04-rentals.png`

## Cursor browser (manual)

- Navigated `http://localhost:3000/?new=1`
- Rental query → **5** `[role=article]` rental cards with `aria-label="Rental: …"`
- CTAs: Details, Schedule viewing, Save (disabled)
- Map chip: "Open map with 5 pins"

## Chrome DevTools MCP

Blocked — profile lock (`chrome-devtools-mcp` already running). Playwright + Cursor browser used instead.

## Console / overlay (not UX-023)

- React hydration warning: `chat-query-bar.tsx:69` (pre-existing)
- Maps: `BillingNotEnabledMapError` on local dev (GCP billing)

## Grade summary

See UX-023 spec + user-facing grade in session notes.
