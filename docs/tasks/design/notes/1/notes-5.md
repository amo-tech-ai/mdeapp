Verdict: SAN-574 is acceptable for a parity refactor (~78/100 against shadcn skill), but it does not yet meet full shadcn composition standards — most gaps are pre-existing and correctly deferred to SAN-575 (D-09).

Project context: base-nova · Base UI · lucide · installed: card, badge, button, separator, skeleton, sonner · not installed: toggle-group, empty.

What passes (SAN-574 + inherited wrappers)
Rule	Evidence
Semantic tokens
bg-card, border-border, text-muted-foreground, text-primary, bg-primary/10 — no gray-* / raw palette
cn() for state
VenueCardShell selected/featured rings
Button variants
CTAs use `Button variant="outline
Badge variants
`Badge variant="secondary
"use client" where needed
VenueCardShell, BrowseLayout, RestaurantCard (interactive)
Compose, don't reinvent (partial)
Shell extracts layout; domain logic stays in wrappers ✅
Issues — new in SAN-574
Severity	Finding	Location	Fix
P2
space-y-3 — skill forbids; use flex flex-col gap-3
BrowseLayout.tsx:52
One-line change, zero visual drift
P3
Back link is hand-styled Link + border classes
BrowseLayout.tsx:34–40
D-09: Button variant="outline" size="icon" + render/Link
P3
Sticky header z-10
BrowseLayout.tsx:32
Pre-existing from browse views; OK for page chrome (not overlay)
Issues — inherited (pre-SAN-574, preserved for parity)
These violate shadcn skill but were already in production cards; fixing them is D-09 scope, not SAN-574.

Rule	Current pattern	Files
Use Card composition
Raw <article> + manual rounded-lg border shadow-sm
VenueCardShell (mirrors old cards)
Separator not border-t
border-t px-3 py-2 footers
restaurant/café wrappers
ToggleGroup for 2–7 options
Filter chips = styled Link + aria-pressed
browse views (ToggleGroup not installed)
Empty not custom markup
EmptyState dashed border div
browse empty states (Empty not installed)
Icons in Button → data-icon
<Info className="size-3.5" /> inside Button
all card CTAs
Map links as styled <a>
Manual classes duplicating Button variant="outline"
RestaurantMapLinks, CafeMapLinks, nightlife footer
size-* for equal dims
h-24 w-24 photo boxes
media slots (size-24 equivalent)
Note on icons: base-nova Button size="sm" already auto-sizes SVGs to size-3.5 via [&_svg:not([class*='size-'])]:size-3.5. Explicit className="size-3.5" is redundant but harmless — skill prefers data-icon="inline-start" and dropping manual sizes.

Card vs VenueCardShell — intentional deferral
Installed Card uses nova anatomy:


card.tsx
Lines 15-16
        "group/card flex flex-col gap-4 overflow-hidden rounded-xl bg-card py-4 text-sm text-card-foreground ring-1 ring-foreground/10 ...
VenueCardShell keeps legacy horizontal layout (flex gap-3 p-3, rounded-lg, border not ring). Migrating to Card/CardHeader/CardFooter in SAN-574 would change radius, padding, and footer styling → visual regression vs approved screenshots.

Correct sequencing: SAN-574 = shell extraction · SAN-575 = adopt full Card + D-03 16:10 media.

Recommended actions
Fix now in SAN-574 (surgical, no scope creep)
// BrowseLayout.tsx — replace space-y-3
<div className="mt-4 flex flex-col gap-3">{filterBar}</div>
Queue for SAN-575 (D-09 re-skin)
npx shadcn@latest add toggle-group empty (if not adding Empty, keep EmptyState but document exception)
Refactor VenueCardShell → Card + CardContent + CardFooter
Browse filters → ToggleGroup + ToggleGroupItem (or Button variant="outline" with aria-pressed via ToggleGroup)
Footers → CardFooter or <Separator /> + action row
Direction links → <Button variant="outline" size="sm" render={<Link … />}> (Base UI render prop per base: "base")
Button icons → data-icon="inline-start" pattern, remove size-3.5
Do not change in SAN-574
Filter chip markup (URL navigation + Playwright selectors)
EmptyState → shadcn Empty (component not on disk; behavior + testids differ)
Card radius/padding (breaks visual evidence)
Scorecard
Area	Score	Notes
Semantic colors / tokens
95
Strong
Button/Badge usage
85
CTAs good; map links still raw <a>
Spacing (gap vs space-y)
70
One new space-y-3 in BrowseLayout
Component composition
55
Shell ≠ shadcn Card; by design for parity
Icons
65
Redundant sizing; not using data-icon
Forms/filters
50
ToggleGroup pattern missing (not installed)
Overall (refactor task)
78
Pass for SAN-574 intent
Overall (strict shadcn)
62
Target SAN-575
Bottom line
SAN-574 correctly prioritizes testid parity and zero visual drift over shadcn purity. The only new skill violation worth fixing before merge is space-y-3 in BrowseLayout. Everything else is either pre-existing or belongs in SAN-575.

Want me to apply the one-line gap-3 fix and/or add a "shadcn debt" section to D-08-venue-card.md for D-09 tracking?

**SAN-574 implementation is complete on branch** `ai/san-574-d-08-shared-browse-system` — ready for review/commit.

## What landed

| Layer | Files |
|-------|--------|
| **Internal shell** | `src/components/browse/venue-card-shell.tsx` + Vitest |
| **Browse layout** | `src/components/browse/BrowseLayout.tsx` + Vitest |
| **Public wrappers** (unchanged exports) | `RestaurantCard`, `CafeResultCard`, `RentalCard`, `NightlifeBrowseCard` |
| **Browse views** | `restaurant-browse-view`, `nightlife-browse-view` → `BrowseLayout` |
| **Guardrails** | `scripts/san-574-scope-gate.sh` |
| **Evidence** | `e2e/san-574-visual-evidence.spec.ts` + `tasks/testing/evidence/2026-06-05/san-574/` |

No `VenueCard` generic API — only internal `VenueCardShell`.

## Verification

| Check | Result |
|-------|--------|
| Vitest (shell + 3 cards + layout + domain-results) | **11/11 PASS** |
| Playwright `SCREEN-023` + `SCREEN-022` | **5/5 PASS** — selectors unchanged |
| Scope gate | **PASS** (filters to `src/` only; ignores stray `github/`) |
| Browse screenshots | **6 PNGs** @ 375 / 768 / 1280 |

Evidence log: [`tasks/testing/evidence/2026-06-05/san-574/RESULTS.md`](tasks/testing/evidence/2026-06-05/san-574/RESULTS.md)

## Not touched (confirmed)

Routes · nav · Mastra · CopilotKit · maps · APIs

## Gaps / next steps

1. **Pre-migration baseline** — skipped (work continued mid-session). Post-migration browse shots are on disk; chat shots still optional:
   ```bash
   cd mdeapp && SAN574_EVIDENCE_DIR=../tasks/testing/evidence/2026-06-05/san-574 \
     npx playwright test e2e/san-574-visual-evidence.spec.ts --grep "chat cards" --project=chromium
   ```
2. **`npm run typecheck`** — OOM on this machine; run before merge or in CI.
3. **Commit** — 6 modified + 3 new paths under `mdeapp/` (not committed per your rules).

Say **commit** or **flip SAN-574 → In Review** in Linear when you want that done.