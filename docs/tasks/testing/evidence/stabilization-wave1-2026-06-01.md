---
title: Stabilization wave 1 — UX-028 / UX-032 / UX-034 (local implementation)
date: 2026-06-01
prod_baseline_sha: a8b33a2
status: pending-pr
---

# Stabilization wave 1 — evidence

## Production baseline (unchanged)

| Check | Result |
|-------|--------|
| `GET https://www.mdeai.co/` | **200** |
| `POST /api/copilotkit` (empty body) | **400** (runtime up) |
| G2d matrix @ `a8b33a2` | PASS — see [`prod-smoke-2026-06-01.md`](prod-smoke-2026-06-01.md) |
| CK idle POST storm | **0** after 32s idle (prior browser proof) |
| Duplicate side panels | **None** observed in G2d smoke |
| Café grounded flow | **PASS** post-#33 |

## Implemented (3 isolated slices — not on prod yet)

### UX-028 / SAN-440 — restaurant Places photos

- **Mechanism:** `prepareRestaurantSearchResults()` in `POST /api/restaurants/search` — attach `google_place_id`, `getPlace` with mask `id,photos`, `placesPhotoProxyUrl()` for hero.
- **Re-smoke:** Q3 `suggest restaurants medellin` — run after deploy via `npm run test:e2e:prod-synthetic` or manual browser.
- **Unit:** `src/lib/__tests__/restaurant-place-photo.test.ts` — **4/4 pass**

### UX-032 / SAN-321 — New chat reset

- **Mechanism:** `ConciergeSessionProvider.startNewChat()` — `useCopilotChat().reset()`, coagent `setState({})`, all fast-path `setToolResult(null)`, `clearPins`, rich-card counts, event rows, rental UI sheets, local clarify messages.
- **UI:** `data-testid="nav-new-chat"` button (replaces plain `/` link).
- **E2E:** `e2e/concierge-new-chat.spec.ts` — requires local dev (`npm run test:e2e:new-chat`).

### UX-034 / SAN-322 — nightly prod synthetic

- **Workflow:** `mdeapp/.github/workflows/prod-synthetic-smoke.yml` — cron 09:00 UTC, `workflow_dispatch`, gated by repo var `PROD_SMOKE_ENABLED=true` + `PROD_SMOKE_BASE_URL`.
- **Spec:** `e2e/prod-synthetic-smoke.spec.ts` — 4 queries, screenshots + `report.json` under `tmp/prod-synthetic-smoke/`.
- **Script:** `npm run test:e2e:prod-synthetic`

## Tests run (local)

```bash
cd mdeapp && npm test   # 389 passed
```

## Protected (not touched)

- CopilotKit lifecycle / POST budget hooks
- Fast-path intercept order (rental → event → grounded → restaurant)
- `GroundedCafeResults` / G2c card stack
- PR #23, #32, #19, ADK Phase 2

## Recommended PR split

1. `fix(ux): restaurant Places photo proxy on search API (SAN-440)`
2. `feat(ux): new chat resets thread map and fast paths (SAN-321)`
3. `chore(ci): nightly prod 4-query synthetic smoke (SAN-322)`
