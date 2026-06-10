---
id: UX-T-027
title: Vitest — RentalCard prod copy leak regression (CU-P0-07)
status: Done
priority: P0
implements: UX-027
depends_on: []
blocks: []
skill: [testing, vitest]
output: mdeapp/src/components/copilot/__tests__/rental-card-copy.test.tsx
description: Static + render guard — no SCREEN-* ticket IDs or "Photo soon" in rental-card.tsx or DOM.
---

# UX-T-027 — RentalCard copy leak regression

Shipped with UX-027 @ a8d2e26. Locks:

- No `SCREEN-\d+` in `rental-card.tsx`
- No `Photo soon` placeholder copy
- Save CTA `title="Save for later (coming soon)"`

## Command

```bash
cd mdeapp && npm test -- rental-card-copy
```

Included in `npm run test:cards`.
