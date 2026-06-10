**PR #79 is merge-ready** — no blockers; finish CodeRabbit, merge, then move on.

## Now (before merge)

1. **Wait for CodeRabbit** on [#79](https://github.com/amo-tech-ai/mdeapp/pull/79) — address only P0/P1 if any appear.
2. **Trust Vercel Ready + Floor** as build proof unless CI shows a red `build` job; optional: tick the PR checklist item.
3. **Merge** — no scope expansion; don’t fold D-09/shadcn work into this PR.
4. **Linear:** SAN-574 → **Done** · note preview URL in comment.

## Immediately after merge

| Priority | Task | Why |
|----------|------|-----|
| **1** | **SAN-575 (D-09 re-skin)** | First consumer of `VenueCardShell` + `BrowseLayout`; clears shadcn debt table in D-08 |
| **2** | **SAN-586 (DATA-036)** | Public events list API — parallel if you want API work off UI track |
| **3** | **SAN-518** | `/events` browse — blocked on SAN-586, uses SCREEN-027 spec |

**Recommended split:** one owner on **SAN-575** (UI), one on **SAN-586** (data) if you have capacity.

## SAN-575 first slice (keep it small)

1. Read D-08 **shadcn debt** table + [`tasks/design/tasks/D-09`](tasks/design/tasks/) (or SAN-575 Linear body).
2. `npx shadcn@latest add toggle-group` (+ `empty` if you want native empty states).
3. **One vertical first** — e.g. `/restaurants`: `Card` composition, filter `ToggleGroup`, `Button` + `data-icon` for CTAs.
4. Before/after screenshots @ 375 / 768 / 1280; same Playwright selectors.
5. PR separate from browse-route work (519/478/518).

## Browse activation (after functional pages exist)

```
SAN-586 → SAN-518 → SAN-584 (events nav)
SAN-519 → SAN-584 (cafés nav)
SAN-478 → SAN-584 (rentals nav)
```

SAN-575 improves cards/layout **without** flipping greyed sidebar links.

## Optional hygiene

- Push D-08 doc commit on planning repo (`94ec2d8`) if not on remote.
- Run chat visual evidence once post-merge:  
  `npx playwright test e2e/san-574-visual-evidence.spec.ts --grep "chat cards"`
- Prod smoke after Vercel promote: Tier 1 from live-prod-check rule (`/restaurants` still 200).

## What not to do next

- Don’t start SAN-577 (map column) before D-09 lands on browse pages.
- Don’t enable `EXPLORE_ITEMS` hrefs until 519/478/518 + SAN-584 gates pass.
- Don’t rename public card exports — wrappers stay the API.

**Bottom line:** merge #79 → Done SAN-574 → **SAN-575** for shadcn/visual upgrade, **SAN-586** in parallel for events data, then **SAN-518** when API is ready.