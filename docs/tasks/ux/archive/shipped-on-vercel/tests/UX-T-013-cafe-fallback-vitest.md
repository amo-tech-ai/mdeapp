---
id: UX-T-013
title: Vitest — venue_anchors café fallback (search-grounded-places)
status: Done
priority: P0
implements: UX-013
depends_on: []
blocks: [UX-013 Done gate]
skill: [testing, vitest, mde-supabase]
output: mdeapp/src/mastra/tools/__tests__/search-grounded-places-cafe-fallback.test.ts
description: Unit test curatedFallback / tool path returns ≥1 café row from venue_anchors when ADK unavailable.
---

# UX-T-013 — café fallback Vitest

## Target file

`mdeapp/src/mastra/tools/__tests__/search-grounded-places-cafe-fallback.test.ts`

## What to test

When `invokeAdkGrounding` returns `{ pins: [], metadata: { reason: "adk_unavailable" } }` and query is `"good specialty coffee in Laureles"`:

1. Tool queries `venue_anchors` with `kind = 'cafe'` (not `restaurants.cuisine = cafe`)
2. Returns ≥1 result with `name`, `neighborhood`, place identifier
3. Empty DB → still not silent success with zero rows without fallback message

## Mock pattern

```typescript
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/supabase/service", () => ({
  getServiceClient: () => ({
    from: (table: string) => {
      if (table !== "venue_anchors") throw new Error(`unexpected table ${table}`);
      return {
        select: () => ({
          eq: () => ({
            eq: () => ({
              ilike: () =>
                Promise.resolve({
                  data: [
                    {
                      id: "anchor-1",
                      name: "Pergamino Café",
                      neighborhood: "Laureles",
                      google_place_id: "ChIJtest",
                      kind: "cafe",
                    },
                  ],
                  error: null,
                }),
            }),
          }),
        }),
      };
    },
  }),
}));
```

Adjust chain to match actual query builder in `search-grounded-places.ts` after reading disk.

## Playwright pairing

Scenario 4 in [UX-T-031](UX-T-031-live-audit-verticals.spec.md) — e2e proof after unit green.

## Acceptance criteria

- [ ] `npm test -- search-grounded-places-cafe-fallback` passes
- [ ] Test fails on current main before UX-013 implementation (TDD red)
- [ ] No real Supabase calls in test

## Command

```bash
cd mdeapp && npm test -- src/mastra/tools/__tests__/search-grounded-places-cafe-fallback.test.ts
```
