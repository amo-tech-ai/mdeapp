---
id: F24
title: Port RentalCard component (Paisa-tokenised)
status: Superseded
superseded_by: SCREEN-005
note: RentalCard shipped at mdeapp/src/components/copilot/rental-card.tsx — finish polish via SCREEN-005 visual gate
priority: P1
phase: W5 — Day 1 (Camila's rentals surface)
effort: 1.5h (adapt + style + Vitest + localhost smoke)
owner: claude
depends_on: [F07, F22]
skill: [shadcn, react-best-practices]
parent_plan: /home/sk/mdeai/plan/07-legacy-design-port-plan.md
verified_against:
  - legacy: /home/sk/mde/src/components/rentals/RentalsSearchResults.tsx + RentalsListingDetail.tsx
  - F07 Paisa tokens in mdeapp/src/app/globals.css
  - PRD §20 (Generative UI architecture — cards are shadcn compositions)
---

# F24 — RentalCard component

> **Superseded by [SCREEN-005](../screens/SCREEN-005-rental-card-polish.md).** Do not execute F24 separately — close visual polish under SCREEN-005 + `SCREEN-TESTING-STANDARD.md`.

## 1. Purpose

Camila's W5 `/rentals` surface needs a list of apartment cards. Legacy `/home/sk/mde/` already proved out the card shape across `RentalsSearchResults.tsx` and `RentalsListingDetail.tsx`. F24 adapts that shape into a fresh shadcn-composition under `mdeapp/src/components/rentals/RentalCard.tsx`, using Paisa OKLCH tokens (no inline hex), and renders it from both the `/rentals` page and from CopilotKit generative UI (`useCopilotAction({ render })`) in W6 chat.

## 2. Goals

- `mdeapp/src/components/rentals/RentalCard.tsx` exports `<RentalCard>` taking a `RentalListing` prop
- Composed from F07 primitives: `<Card>`, `<Badge>`, `<Button>`, `<Separator>` — **no** raw `<div className="bg-...">` styling shortcuts
- Paisa tokens only: `bg-card`, `text-foreground`, `bg-primary`, `text-primary-foreground`, `border-border`. **No** `style={{ ... }}`, no `#0f766e` literals.
- Hero image from F22 (`/hero/...` path) — Next 16 `<Image>` for optimisation
- Persona-anchored copy: card includes neighborhood, price (COP), bedrooms, "Save" button (teal primary), "Compare" button (outline)
- ≥ 2 Vitest unit tests for the component (renders + hidden when no data)
- Used both standalone on `/rentals` (page TBD W5) AND inside `useCopilotAction({ available: "disabled", name: "show_rental", render })`
- Gate 9 localhost: visit `/rentals/preview` (a test-only route F24 adds) and confirm card renders at HTTP 200

## 3. Features (persona value)

| Persona | What they get |
|---|---|
| **Camila** | A consistent rental tile across `/rentals` list, chat suggestions, and saved-items panel — same card, three surfaces |
| **Sofía** | One component to maintain; adding a new field touches one file |
| **Roberto** | Sees the same shape when his host wizard previews how Camila will see an event-adjacent rental |

## 4. Workflows

1. **Pre-flight:**
   ```bash
   ls /home/sk/mde/src/components/rentals/   # source files
   ls mdeapp/src/components/ui/card.tsx mdeapp/src/components/ui/button.tsx mdeapp/src/components/ui/badge.tsx   # F07 primitives
   ls mdeapp/public/hero/   # F22 hero photos
   ```
2. Create `mdeapp/src/components/rentals/RentalCard.tsx`:
   - Props: `{ listing: RentalListing }` where `RentalListing = { id, neighborhood, priceCop, bedrooms, photoPath, savedByMe }`
   - Composition: `<Card><CardHeader>` (image + neighborhood + price badge) `<CardContent>` (bedrooms + amenities) `<CardFooter>` (Save + Compare buttons)
   - **No** inline hex, no `themeColor` prop, no `react-hook-form` — pure presentational component
3. Create `mdeapp/src/app/rentals/preview/page.tsx` — a minimal Next.js page that renders 3 sample `<RentalCard>` from hardcoded fixtures. **Test-only route**, not the W5 production `/rentals` page (that's a separate task).
4. Add `mdeapp/src/components/rentals/__tests__/RentalCard.test.tsx`:
   - T-A: renders neighborhood + price
   - T-B: shows "Save" if `savedByMe = false`, "Saved" if `true`
5. Run `npm run floor` — all 5 gates green.
6. Gate 9 — boot dev, `curl :3001/rentals/preview` → HTTP 200, body contains "Laureles" (sample fixture).
7. Write `tasks/notes/F24-evidence.md` with: file list, floor log tail, curl probe, screenshot path.

## 5. User journeys

- **Sofía** opens `/rentals/preview` in dev → sees 3 cards rendered with Paisa teal Save buttons + real Medellín photos from F22. Approves design.
- **Camila** (in W5 production `/rentals`) → sees the same cards over real Supabase `apartments` data.
- **Camila in W6 chat** → asks "show cheaper" → CopilotKit generative-UI renders the same `<RentalCard>` inline.

## 6. Agents

None directly — F24 is presentational. The CopilotKit generative-UI wiring is `useCopilotAction({ available: "disabled", name: "show_rental", render: ({args}) => <RentalCard listing={args} /> })` in a later task (F17 / F19 surface).

## 7. Integrations

| Integration | Purpose |
|---|---|
| F07 shadcn primitives | Card / Badge / Button / Separator |
| Next 16 `<Image>` | Hero image optimisation |
| F22 photo library | Real Medellín photos |
| Vitest | Unit tests with `@testing-library/react` (install if missing — already in F09's test infra) |
| CopilotKit `useCopilotAction` | Generative UI binding (in a downstream task) |

## 8. Summary

Build a single Paisa-tokenised `<RentalCard>` from F07 primitives, render it from a test-only `/rentals/preview` page, add 2 Vitest tests, smoke localhost. ~1.5h. Used three times in MVP (Camila list, chat suggestion, saved list) — write once, ship three places.

## 9. Definition of Done

- [ ] `mdeapp/src/components/rentals/RentalCard.tsx` exists
- [ ] `mdeapp/src/app/rentals/preview/page.tsx` exists (test fixture route)
- [ ] `mdeapp/src/components/rentals/__tests__/RentalCard.test.tsx` with 2+ passing tests
- [ ] No inline hex colors: `! grep -rE '#[0-9a-f]{3,6}' mdeapp/src/components/rentals/` returns nothing
- [ ] No `style={{` attribute: `! grep -E 'style=\{\{' mdeapp/src/components/rentals/RentalCard.tsx` returns nothing
- [ ] `npm run floor` exits 0
- [ ] Localhost: `curl -s :3001/rentals/preview` returns HTTP 200 + body contains "Laureles"
- [ ] Evidence at `tasks/notes/F24-evidence.md`

## 10. Tests

| # | Test | Expected |
|---|---|---|
| T1 | Component file exists | `test -f mdeapp/src/components/rentals/RentalCard.tsx` |
| T2 | Preview route exists | `test -f mdeapp/src/app/rentals/preview/page.tsx` |
| T3 | Vitest passes | `npm test` shows ≥ 2 new tests |
| T4 | No inline hex | grep returns empty |
| T5 | No inline `style={{` | grep returns empty |
| T6 | Localhost preview HTTP 200 | curl probe |
| T7 | Build green | `npm run build` exit 0 |
| T8 | Floor green | `npm run floor` exit 0 |

### Negative test

| Tn1 | Inject `style={{ backgroundColor: '#0f766e' }}` into RentalCard | T4/T5 must fail — gate bites |

## 11. Rollback

```bash
rm -rf mdeapp/src/components/rentals/ mdeapp/src/app/rentals/preview/
```

## Notes

- **CopilotKit compatibility:** the component is a pure JSX function — works inside `useCopilotAction({ render })` without any state coupling.
- **No `react-hook-form` here** — card is read-only display. Form state lives in F29 (RentalsIntakeWizard).
- The `RentalListing` type is colocated for now; W5 will move it to `src/lib/types.ts` alongside `MdeState`.
