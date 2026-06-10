---
id: F26
title: Port RestaurantCard + RestaurantFilters component
status: Not Started
priority: P1
phase: W6 — Day 1 (Tourist concierge surface)
effort: 1h (smallest of the three card ports)
owner: claude
depends_on: [F07, F22, F24, F25]
skill: [shadcn, react-best-practices]
parent_plan: /home/sk/mdeai/plan/07-legacy-design-port-plan.md
verified_against:
  - legacy: /home/sk/mde/src/components/restaurants/{RestaurantCard,RestaurantFilters}.tsx
  - PRD §20 + §51 (W6 concierge surface)
  - Supabase `public.restaurants` (44 rows per audit 04)
---

# F26 — RestaurantCard + RestaurantFilters

## 1. Purpose

Tourist's W6 concierge chat (Camila's `/chat` surface routed through `conciergeAgent`) suggests restaurants from `public.restaurants` (44 rows). Each suggestion needs a card. F26 ports the legacy `RestaurantCard` + `RestaurantFilters` into Paisa-tokenised shadcn components. Smaller scope than F24/F25 because restaurants display fewer fields (name, neighborhood, cuisine, price tier, photo) and have simpler filters (cuisine + neighborhood + price tier).

## 2. Goals

- `mdeapp/src/components/restaurants/RestaurantCard.tsx` — `<RestaurantCard>` from shadcn primitives
- `mdeapp/src/components/restaurants/RestaurantFilters.tsx` — cuisine + neighborhood + price-tier filters
- `mdeapp/src/app/restaurants/preview/page.tsx` — test fixture route (≥ 3 sample restaurants)
- ≥ 2 Vitest tests
- Component pattern matches F24/F25 conventions (shadcn-only, no inline hex, no `react-hook-form`)
- Used both standalone on `/restaurants/preview` AND inline via CopilotKit `useCopilotAction({ render })` for conciergeAgent suggestions (F19 surface)

## 3. Features (persona value)

| Persona | What they get |
|---|---|
| **Tourist** | "Best café in Laureles" returns 3 restaurant cards inline in chat — same card shape as `/rentals` and `/host/events` |
| **Camila** | Restaurant suggestions feel native to the same chat thread that handles rentals (RUNTIME-008 single state) |
| **Sofía** | F24, F25, F26 share a pattern — a fourth card type costs 30 minutes, not an hour |

## 4. Workflows

1. **Pre-flight:**
   ```bash
   ls /home/sk/mde/src/components/restaurants/
   ls mdeapp/src/components/ui/   # F07
   ```
2. Create `mdeapp/src/components/restaurants/RestaurantCard.tsx`:
   - Props: `{ restaurant: RestaurantListing }` where `RestaurantListing = { id, name, neighborhood, cuisine, priceTier, photoPath, rating }`
   - Composition: `<Card>` header (image + name + cuisine badge), content (neighborhood + price tier dots + rating), footer (single "View" button)
3. Create `mdeapp/src/components/restaurants/RestaurantFilters.tsx`:
   - State: `{ cuisine, neighborhood, priceTier }` via `useState`
   - Primitives: shadcn `<DropdownMenu>` for each filter
4. Create `mdeapp/src/app/restaurants/preview/page.tsx` with 3 hardcoded fixtures.
5. Add `mdeapp/src/components/restaurants/__tests__/RestaurantCard.test.tsx`:
   - T-A: renders name + cuisine
   - T-B: price tier renders correct number of `$` symbols
6. `npm run floor` — exit 0.
7. Gate 9 — `curl :3001/restaurants/preview` → HTTP 200 + sample restaurant name in body.
8. Write `tasks/notes/F26-evidence.md`.

## 5. User journeys

- **Tourist** asks "best cafés in Laureles for remote work" → conciergeAgent returns 3 results → CopilotKit renders 3 `<RestaurantCard>` inline → Tourist taps "View" → in W6+ this opens a detail panel (separate task).
- **Sofía** opens `/restaurants/preview` for design QA.

## 6. Agents

None directly. Consumed by F19's `conciergeAgent` → `searchRestaurantsTool` → generative-UI rendering (F19 ships that wiring).

## 7. Integrations

| Integration | Purpose |
|---|---|
| F07 shadcn | Card / Badge / Button / DropdownMenu |
| F22 photos | Hero crops |
| Vitest | Unit tests |
| F19 conciergeAgent (downstream) | Renders this card as tool output |

## 8. Summary

Smallest of the three card ports. Same pattern as F24/F25. Build, render from preview route, 2 tests, smoke. ~1h. Used in W6 chat surface + standalone for design QA.

## 9. Definition of Done

- [ ] `mdeapp/src/components/restaurants/RestaurantCard.tsx` exists
- [ ] `mdeapp/src/components/restaurants/RestaurantFilters.tsx` exists
- [ ] `mdeapp/src/app/restaurants/preview/page.tsx` exists
- [ ] ≥ 2 Vitest tests pass
- [ ] No inline hex; no `style={{`
- [ ] `npm run floor` exit 0
- [ ] Localhost `curl :3001/restaurants/preview` → HTTP 200 + fixture name
- [ ] Evidence at `tasks/notes/F26-evidence.md`

## 10. Tests

| # | Test | Expected |
|---|---|---|
| T1 | Card file exists | `test -f` |
| T2 | Filters file exists | `test -f` |
| T3 | Preview route exists | `test -f` |
| T4 | Vitest ≥ 2 new | `npm test` shows them |
| T5 | No inline hex | grep empty |
| T6 | Floor green | exit 0 |
| T7 | Localhost smoke | HTTP 200 + fixture name |

## 11. Rollback

```bash
rm -rf mdeapp/src/components/restaurants/ mdeapp/src/app/restaurants/preview/
```

## Notes

- **No interference with CopilotKit:** pure JSX, used inside `useCopilotAction({ render })` without state coupling.
- **Real Supabase data lands at F19.** F26 ships fixtures only.
- **Price tier:** legacy uses `$` / `$$` / `$$$` / `$$$$` — port that convention; matches mdeai concierge persona language.
