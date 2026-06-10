---
id: UX-T-030
title: Playwright + Vitest — card unification pin parity
status: Not Started
priority: P1
implements: UX-030
depends_on: [UX-T-CU, UX-T-031, UX-022]
blocks: []
skill: [testing, vitest, playwright-cli]
output:
  - mdeapp/e2e/card-unification.spec.ts
  - extend mdeapp/src/platform/copilot/__tests__/rich-card-results.test.ts
related:
  - ../UX-010-CARD-UNIFICATION-STRATEGY.md
  - UX-T-CU-card-unification-mvp-tests.md
description: N cards = N markers; no duplicate generic results; aria-label + data-pin-id parity per 22-card-audit. Playwright slice of UX-T-CU matrix.
---

# UX-T-030 — card unification tests

**Master matrix:** [UX-T-CU-card-unification-mvp-tests.md](UX-T-CU-card-unification-mvp-tests.md) (Vitest + e2e + UX-010 §8).

## Target files

| File | Type |
|------|------|
| `mdeapp/e2e/card-unification.spec.ts` | Playwright |
| `mdeapp/src/platform/copilot/__tests__/rich-card-results.test.ts` | Vitest extend |

## Vitest matrix

| Test | Assert |
|------|--------|
| `shouldSuppressGenericMapResults` | true when domain registrar mounted |
| Pin builder | `rows.length === pins.length` |
| `data-pin-id` | card attribute matches pin id |
| aria-label | present on rental/event/cafe/restaurant cards |
| Sparse payload | fallback render no throw |

## Playwright domains (serial per domain)

| Domain | Query | Assert |
|--------|-------|--------|
| Rental | `1BR in Laureles under $80/night` | `rental-card` count === map marker count; 0 dup in side panel |
| Event | `salsa events this weekend` | same for `event-card` |
| Café | `good specialty coffee in Laureles` | same for `cafe-card` (after UX-013) |
| Restaurant | `quiet rooftop dinner in Provenza` | same for restaurant card testid (after UX-019/014) |

## Helper sketch

```typescript
async function assertCardPinParity(page: Page, cardTestId: string) {
  const cards = page.locator(`[data-testid="${cardTestId}"]`);
  const n = await cards.count();
  expect(n).toBeGreaterThan(0);
  const markers = page.locator('[data-testid="chat-map"] [role="button"]'); // adjust to AdvancedMarker selector
  await expect(markers).toHaveCount(n);
}
```

Adjust marker selector after reading `chat-map` implementation.

## Acceptance criteria

- [ ] Vitest extended tests pass
- [ ] Playwright rental + event parity pass before UX-022 merge
- [ ] Evidence: `tasks/testing/evidence/<date>/card-unification-*.png`

## Command

```bash
cd mdeapp
npm test -- rich-card-results
npx playwright test e2e/card-unification.spec.ts e2e/rich-card-dedup.spec.ts --project=chromium --workers=1
```
