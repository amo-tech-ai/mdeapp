# PR B — Café detail flow tasks

**Branch:** `feat/cafe-detail-flow`  
**Depends on:** PR A merged to `main`

## Skills (load before review)

- [ ] `mde-maps` — Places field masks, `mapId`, AdvancedMarker rules
- [ ] `testing` → playwright — SCREEN-021, maps-grounding
- [ ] `copilotkit-integrations` — grounded tool render names only (no runtime transport changes)
- [ ] See [SKILLS-COMPLIANCE-AUDIT.md](./SKILLS-COMPLIANCE-AUDIT.md)

## Implementation checklist

- [ ] **After PR A merged** — rebase onto `main` (café `search-tool-renders` hunks stack on stable tool renders)
- [ ] Rebase/cherry-pick café commits only (see [PR-B-RUNBOOK.md](./PR-B-RUNBOOK.md))
- [ ] **Skip** `8fa5f10` (runtime — already on `main`)
- [ ] **Skip** `b8d9f92` if equivalent to `main` #13
- [ ] **Omit** `scripts/restore-wip-c012.sh` from merge
- [ ] `search-grounded-places.ts`: `alignGroundedAttribution` + café filter
- [ ] `search-tool-renders.tsx`: `GroundedCafeResults` + `CafeResultCard` on stable PR A base
- [ ] Booking stub copy: “No request is sent yet” visible
- [ ] Directions link only when `directionsUrl` set (S5)

## Verification checklist

- [ ] `npm run floor`
- [ ] `npm test` — includes `cafe-result-card`, `search-grounded-places-quality`, `place-details`
- [ ] `npx playwright install chromium` (if missing)
- [ ] `npm run test:e2e:grounding` — chromium pass
- [ ] `npx playwright test e2e/screens/SCREEN-021-cafe-listings.spec.ts --project=chromium --workers=1`
- [ ] Local: “list cafes in medellin” → café cards, no bar-lounge distractors
- [ ] Local: attribution titles match card titles (B1)
- [ ] Mobile: café detail sheet opens from Details CTA
- [ ] 60s idle CK POST delta = 0 (regression after rebase on A)

## Preview smoke (Tourist / Lucía)

- [ ] Obtain Vercel preview URL from PR checks
- [ ] If **401**: Vercel **deployment protection** (build can still be green) — use bypass secret or localhost `npm run build && npm start`
- [ ] Café query → ≥1 `grounded-card` with Match # / Google-verified
- [ ] Open detail panel → tabs, close, map column
- [ ] Booking stub → disclaimer visible; no network to booking API
- [ ] Console: no JSON leak in assistant prose; no hydration blocker

## Rollback checks

- [ ] Revert PR B only leaves PR A runtime intact
- [ ] Café filter revert: grounding returns unfiltered rows (acceptable fallback)

## PR hygiene

- [ ] PR references C-012 task spec `tasks/commit/may-27/tasks/C-012-cafe-places-detail.md`
- [ ] PR body states dependency on PR A
- [ ] Close #14 with links to A + B
- [ ] Re-request CodeRabbit on café-only diff

## Skills / MCP

- [ ] `mde-maps` — field masks on Places detail
- [ ] `google-maps-code-assist` MCP before changing Places API
- [ ] `mastra` — `search-grounded-places` tool only (no edge service-role in src)
