# PR B runbook — `feat/cafe-detail-flow`

**Purpose:** Café C-012 only, **after PR A is merged to `main`**.

## Prerequisite

```bash
git fetch origin main
# main must include merged PR A (useSingleEndpoint + stable tool renders)
```

## Git commands (rebase strategy — preferred)

```bash
cd /home/sk/mdeai/mdeapp
git checkout -b feat/cafe-detail-flow origin/main

# Cherry-pick café commits in order (SKIP b8d9f92 if same as main #13, SKIP 8fa5f10, SKIP 991db97 if prod-gate removed in 76abde1)
git cherry-pick aec4801   # chore: staged guard (optional: omit restore-wip script hunk)
git cherry-pick d4dc9c3   # feat(cafe): Places detail API
git cherry-pick 33daaa9   # feat(cafe): CafeResultCard + hook
git cherry-pick 8b312e6   # feat(cafe): detail panel + booking stub
git cherry-pick b1817d0   # feat(chat): wire map column
git cherry-pick 72df10c   # feat(cafe): grounding filter + SCREEN-021
# SKIP 991db97 if it only adds test:prod-gate (removed in 76abde1)
# SKIP b8d9f92 — duplicate of main #13 same-origin runtime
git cherry-pick 895f459   # fix(chat): mobile sheet + e2e
git cherry-pick 72363c6   # fix(chat): sanitizer
git cherry-pick 76abde1   # fix(cafe): B1 attribution + S1-S5

# CRITICAL ORDER: PR A must be on main first. 76abde1 (café) and 8fa5f10 (runtime) both touch
# search-tool-renders.tsx — café cherry-picks must ADD GroundedCafeResults ON TOP of stable
# module-level *ToolRender from PR A; do not revert stabilization hunks.

# Resolve conflicts: search-tool-renders should ADD café on top of PR A stable base
npm run floor

# STEP 0 BEFORE ANY E2E — kill stale :3001. playwright.config has reuseExistingServer:true,
# so a stale dev server (404ing /api/copilotkit after route files changed) makes café cards
# never hydrate → false "cards timeout". This is what produced the bogus "5/5 fail" (notes C9).
fuser -k 3001/tcp 2>/dev/null || true
# either let playwright boot a fresh server (default webServer), OR pin a known-good one:
#   PW_SKIP_WEBSERVER=1 SMOKE_BASE_URL=http://localhost:3001  (after a fresh `npm run dev:ui`)
npm run test:e2e:grounding -- --project=chromium
npx playwright test e2e/screens/SCREEN-021-cafe-listings.spec.ts --project=chromium --workers=1
```

> **Verified 2026-05-30:** on a fresh `:3001`, `maps-grounding.spec.ts` → **1 passed**, and SCREEN-021 café suite re-ran clean. The earlier "5/5 chromium failed — cards timeout" was a **stale-server false negative**, not café-code failure.

### Alternative: branch from old feature branch

```bash
git checkout feat/c012-cafe-places-detail
git rebase origin/main
# Drop commit 8fa5f10 during rebase (already on main via PR A):
git rebase -i origin/main   # mark 8fa5f10 as drop; drop b8d9f92 if duplicate
git branch -M feat/cafe-detail-flow
git push -u origin feat/cafe-detail-flow --force-with-lease
```

## Files (café slice — full PR #14 minus PR A)

```text
src/app/api/places/detail/route.ts
src/lib/place-details.ts
src/lib/place-details.test.ts
src/hooks/use-place-details.ts
src/lib/cafe-ask-prompts.ts
src/components/copilot/cafe-result-card.tsx
src/components/copilot/__tests__/cafe-result-card.test.tsx
src/components/cafe/cafe-detail-panel.tsx
src/components/sheets/cafe-booking-sheet.tsx
src/components/chat/cafe-detail-mobile-sheet.tsx
src/components/chat/rental-ui-context.tsx
src/components/chat/geo-chat-shell.tsx
src/components/chat/chat-map-panel.tsx
src/components/chat/chat-canvas.tsx
src/components/chat/concierge-assistant-message.tsx
src/components/chat/concierge-chat-messages.tsx
src/mastra/tools/search-grounded-places.ts
src/mastra/tools/__tests__/search-grounded-places-quality.test.ts
src/lib/__tests__/sanitize-assistant-chat-content.test.ts
src/components/copilot/search-tool-renders.tsx   # café hunks ONLY (on top of PR A)
e2e/screens/SCREEN-021-cafe-listings.spec.ts
e2e/maps-grounding.spec.ts
e2e/helpers/maps-layout.ts
package.json                                      # staged-guard scripts only
scripts/commit-staged-guard.mjs
```

**Exclude from merge to main:**

- `scripts/restore-wip-c012.sh` — dev-only WIP helper. Its paths are **dynamic** (`ROOT="$(cd "$(dirname "$0")/.." && pwd)"`), *not* hardcoded, so it's not a security flag; exclude it because it restores from `../drafts/wip-pr4-off-src` **outside the repo** — meaningless in merged history.

## Commit message (squash option)

```text
feat(cafe): Places detail panel and café booking stub (C-012)

- CafeResultCard + Places detail API with field masks
- Detail panel, mobile sheet, booking stub (no real submit)
- Grounding café filter + attribution join (B1)
- SCREEN-021 + maps-grounding e2e

Refs tasks/commit/may-27/tasks/C-012-cafe-places-detail.md
```

## PR title

```text
feat(cafe): Places detail and café booking panel (C-012)
```

## PR body template

```markdown
## Summary
- Café grounded cards, detail panel, mobile sheet, booking stub
- GET /api/places/detail with X-Goog-FieldMask
- Attribution aligned after café row filter (B1)

## Depends on
- #<PR-A-number> fix(copilotkit): stabilize runtime transport and tool renders

## Verified
- [ ] `npm run floor`
- [ ] `npm run test:e2e:grounding` (chromium)
- [ ] SCREEN-021 (chromium)
- [ ] Preview café smoke (or localhost proof if Vercel 401)
- [ ] Booking sheet shows stub disclaimer

## Not included
- CopilotKit runtime transport (separate PR)
```

## Close PR #14

```bash
gh pr close 14 --comment "Split into PR A (runtime) + PR B (café). See tasks/commit/may29/"
```
