# Feature file tree — production `main` (`wt-main-clean`)

**Worktree:** `/home/sk/mde-wt-search-clean`  
**Explorer shortcut:** `/home/sk/mdeai/wt-main-clean`  
**Branch:** `main` @ `ae9a1e6` (matches prod — **already committed & merged**)

This tree is where **shipped** browse/listing work lives. You do **not** split commits inside this tree for SAN-491 / SAN-490 — those landed via PR #67 and `41cfe99`. June-4 [`COMMIT-PLAN.md`](COMMIT-PLAN.md) is **planning docs only** (`/home/sk/mdeai`, no `mdeapp/src`).

---

## What to commit where (split strategy)

```text
┌─────────────────────────────────────────────────────────────────┐
│ 1. PLANNING REPO FIRST — /home/sk/mdeai (branch docs/venues-…)   │
│    COMMIT-PLAN.md slices 1→7 — tasks/, sitemap, plan move, MCP   │
│    Zero app source. See COMMIT-PLAN.md.                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. APP REPO — only if you have NEW code not on main yet          │
│    • wt-main-clean (main) — commit here on a NEW branch off main │
│    • Do NOT commit on /home/sk/mdeai/mdeapp (stale SAN-491)      │
│    • Other worktrees: one PR per branch (521, ux-020, ux-003)    │
└─────────────────────────────────────────────────────────────────┘
```

| Location | Commit? | Why |
|----------|---------|-----|
| **`wt-main-clean`** | Only **new** work (branch off `main`) | Nightlife + restaurants **already on `main`** |
| **`/home/sk/mdeai/mdeapp`** | Move WIP first | `007a` `search-grounded-places` edits — stash → pop on `wt-main-clean` → new branch |
| **`wt-san521`** | SAN-521 PR when ready | Mobile composer (separate feature) |
| **`worktrees-all/wt-ux-020`** | PR #12 maps warn | Clean branch |
| **`.wt-ux-003-night-parser`** | Optional test commit | Parser largely merged (PR #15) |
| **`/home/sk/mdeai` june-4** | **Do first** (docs) | No product code |

---

## Vertical feature tree (recent browse / venues work)

Legend: `★` = primary files for that vertical on `main` · `(PR)` = merge that introduced most of the tree

```text
/home/sk/mde-wt-search-clean/          ← wt-main-clean → HERE
│
├── src/app/                           # Routes (URLs)
│   ├── nightlife/                     ★ SAN-491 (#67)
│   │   ├── page.tsx                   → /nightlife browse + map column
│   │   └── loading.tsx
│   ├── restaurants/                   ★ SAN-490 (41cfe99)
│   │   ├── page.tsx                   → /restaurants
│   │   └── loading.tsx
│   ├── cafes/
│   │   └── page.tsx                   → /cafes (shell; shares patterns)
│   ├── chat/
│   │   └── page.tsx                   → Camila concierge + cards/pins
│   ├── events/[slug]/
│   │   └── page.tsx                   → Andrés ticket / event detail
│   └── api/restaurants/search/
│       ├── route.ts                   ★ restaurant search API
│       └── route.test.ts
│
├── src/components/
│   ├── nightlife/                     ★ SAN-491 browse UI
│   │   ├── nightlife-browse-view.tsx  # list + filters + map mode
│   │   ├── nightlife-browse-card.tsx
│   │   └── nightlife-detail-panel.tsx # chat/detail (older)
│   ├── restaurants/
│   │   └── restaurant-browse-view.tsx ★ SAN-490 browse UI
│   ├── copilot/                       # Generative UI in /chat
│   │   ├── restaurant-card.tsx        ★ restaurant results in chat
│   │   ├── cafe-result-card.tsx
│   │   ├── domain-results.tsx
│   │   └── search-tool-renders.tsx
│   ├── chat/
│   │   ├── restaurant-fast-path-panel.tsx
│   │   ├── restaurant-fast-path-context.tsx
│   │   └── nightlife-detail-mobile-sheet.tsx
│   ├── sheets/
│   │   └── nightlife-booking-sheet.tsx
│   └── venues/
│       └── venue-booking-status-chip.tsx  # booking chips (VEN / #55)
│
├── src/lib/
│   ├── nightlife-browse.ts            ★ SAN-491 data/filter logic
│   ├── nightlife-browse.test.ts
│   ├── restaurant-search-fast-path.ts ★ chat fast-path
│   ├── restaurant-place-photo.ts
│   ├── restaurant-query-classifier.ts
│   ├── __tests__/restaurant-*.test.ts
│   └── venues/                        # booking forms + status
│       ├── venue-booking-core.ts
│       ├── submit-venue-booking.ts
│       └── …
│
├── src/mastra/
│   ├── agents/
│   │   └── concierge.ts               ★ tools + prompts (restaurant vs grounded)
│   └── tools/
│       ├── search-grounded-places.ts  # bars, salsa, clubs, cafés (007a WIP elsewhere)
│       ├── search-restaurants.ts      ★ sit-down meals only
│       ├── search-venue-anchors.ts      ★ SAN-491 anchor pins
│       ├── search-rentals.ts
│       ├── search-web-grounded-events.ts
│       └── __tests__/search-grounded-places-*.test.ts
│
├── e2e/screens/
│   ├── SCREEN-022-nightlife-browse.spec.ts      ★ SAN-491
│   ├── SCREEN-022-nightlife-listings.spec.ts
│   ├── SCREEN-023-restaurant-listings.spec.ts   ★ SAN-490
│   ├── VEN-035-venue-release.spec.ts
│   └── restaurant-card-fast-path.spec.ts
│
└── supabase/migrations/               # DB seeds (restaurants data)
    ├── 20260404044721_restaurants_seed.sql
    └── 20260601120100_data039_restaurants_schema_patch.sql
```

---

## Prod URLs → folder

| URL | Main files |
|-----|------------|
| https://www.mdeai.co/nightlife | `src/app/nightlife/`, `src/components/nightlife/`, `src/lib/nightlife-browse.ts` |
| https://www.mdeai.co/restaurants | `src/app/restaurants/`, `src/components/restaurants/`, `src/app/api/restaurants/search/` |
| https://www.mdeai.co/chat | `src/app/chat/`, `src/components/copilot/`, `src/mastra/agents/concierge.ts` |
| https://www.mdeai.co/cafes | `src/app/cafes/page.tsx` (+ grounded tool for POIs) |

---

## Not on `main` (commit separately)

| Work | Path | Next step |
|------|------|-----------|
| **007a nightlife `intent` on grounded tool** | `/home/sk/mdeai/mdeapp/src/mastra/tools/search-grounded-places.ts` | Stash → `wt-main-clean` → `git switch -c ai/san-294-…` → commit + PR |
| **SAN-521 mobile composer** | `.worktrees/wt-san521` | PR from that branch |
| **Maps key dev warn** | `.worktrees/wt-ux-020` | PR #12 |
| **June-4 doc slices** | `/home/sk/mdeai/tasks/commit/june-4/` | Slices 1–7 per COMMIT-PLAN |

---

## Quick open in IDE

1. Expand **`wt-main-clean`** at `/home/sk/mdeai` repo root  
2. Drill: `src/app/nightlife` or `src/components/nightlife`  
3. Compare restaurants: `src/app/restaurants` + `src/components/restaurants`

See also: [`worktrees.md`](worktrees.md) · [`COMMIT-PLAN.md`](COMMIT-PLAN.md)
