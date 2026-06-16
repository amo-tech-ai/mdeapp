# 16 — CopilotKit v2 Production Verification Audit (PR #223)

**Date:** 2026-06-15 · **Verifier:** forensic run + refresh same day
**Scope:** Verify CopilotKit v2 after PR #223 (CK-V2-014 + PERF-001) on `origin/main` `4f43390a`, then refresh evidence with CK-V2-015 fix on working tree.
**Tasks:** [SAN-896 · CK-V2-008 — Refresh post-cutover v2 evidence @ current main SHA](https://linear.app/sanjiovani/issue/SAN-896) · parent [SAN-886 · CK-V2-000 — CopilotKit v1→v2 Migration](https://linear.app/sanjiovani/issue/SAN-886)
**Full evidence:** [`docs/tasks/testing/evidence/SAN-896/`](../tasks/testing/evidence/SAN-896/) (`RESULTS.md` + `results.json` + screenshots)

---

## Overall score

| Snapshot | Score | Verdict |
|----------|------:|---------|
| **`origin/main` @ `4f43390a` (original audit)** | **85 / 100** | v2 cutover sound; events chip→agent empty state + unsigned host proof block SAN-896 |
| **Working tree + CK-V2-015 fix (refresh)** | **92 / 100** | Events chip fixed; host analytics proven signed-in; **host event agent turn still open** |
| **`origin/main` @ `2d9c8ed6` (#225 merged + localhost SAN-896)** | **96 / 100** | Full localhost matrix green; host agent was e2e v1 send selectors — product path OK |

**SAN-896 localhost sign-off complete @ `2d9c8ed6`** — flip Linear **Done** after follow-up PR lands (JSDoc + e2e harness).

---

## Is the original audit correct?

**Yes — for `4f43390a`.** Static checks, SHA parity, build, `audit:copilotkit-v2`, rentals/café/grounded cards, POST budget, and anonymous host redirects were accurately recorded.

**One correction on root cause (Test B'):** the chip→agent empty state was **not** the agent “deciding” results were non-ticketed. Hybrid `search-events` ranked salsa rows, then a **post-hybrid category filter** dropped them when the Events chip set `category=nightlife` while salsa hits map to `music`. Fix: `resolveEventCategoryForQuery()` (CK-V2-015, working tree — **not on `main` yet**).

---

## PASS / FAIL table (Step 10)

| # | Item | `4f43390a` | After CK-V2-015 |
|---|------|:----------:|:---------------:|
| 1 | CopilotKit v2 imports only | 🟢 | 🟢 |
| 2 | `@copilotkit/react-ui` removed | 🟢 | 🟢 |
| 3 | `COPILOTKIT_V2_*` flags removed | 🟢 | 🟢 |
| 4 | `/chat` rentals cards | 🟢 | 🟢 |
| 5 | `/chat` event cards (fast-path) | 🟢 | 🟢 |
| 5b | `/chat` event cards (Events chip → agent) | 🔴 | 🟢 |
| 6 | Map pins | 🟡 | 🟡 (geocode-dependent) |
| 7 | HITL (concierge grounded Request) | 🟢 visible | 🟢 |
| 7b | Host event HITL approve/reject | ⚫ unproven | 🔴 agent turn timeout |
| 8 | Citations / grounded cards | 🟢 | 🟢 |
| 9 | Host `/host/event/new` shell signed-in | ⚫ | 🟢 |
| 10 | Host `/host/analytics` signed-in | ⚫ | 🟢 |
| 11 | Rate limit normal use | 🟢 | 🟢 |
| 12 | POST budget | 🟢 | 🟢 |
| 13 | Console errors | 🟡 dev-only analytics chunk | 🟡 |
| 14 | Build | 🟢 | 🟢 |
| 15 | `audit:copilotkit-v2` | 🟢 | 🟢 |
| 16 | Production SHA | 🟢 `4f43390a` | 🟢 (fix unmerged) |

---

## SHAs

| Artifact | SHA |
|----------|-----|
| `origin/main` / production `www.mdeai.co` | **`4f43390a`** |
| Working tree HEAD (docs + CK-V2-015) | `5f333d61` + uncommitted fix |

---

## Blockers (SAN-896)

| # | Blocker | Status |
|---|---------|--------|
| 1 | Events chip → “No events found” | **Fixed locally (CK-V2-015)** — merge + prod deploy needed for Camila on prod |
| 2 | `/host/analytics` signed-in stream | **PASS** — `ai@socialmediaville.ca`, KPI grid COP 2,000 |
| 3 | `/host/event/new` HITL approve/reject | **OPEN** — shell loads; `hostEventAgent` did not fill form / HITL in 180s Playwright run |
| 4 | Playwright auto-boot keyless `dev:ui` | **Fixed** — `dev:ui:e2e` + `playwright.config.ts` |

---

## CK-V2-015 fix (summary)

- **File:** `resolveEventCategoryForQuery()` in `intelligence-event-search.ts`; wired in `searchEvents()`.
- **Rule:** `nightlife` chip + salsa/live-music `queryText` → search/filter as `music`.
- **Also:** AG-UI tool envelope unwrap; `ConciergeChatView` fast-path bridge; evidence spec `e2e/san-896-ck-v2-evidence.spec.ts`.
- **Evidence:** `docs/tasks/testing/evidence/SAN-896/screenshots/05-events-chip-agent-path.png`

---

## Red flags (unchanged / watch)

1. 🟡 Map pins = 0 when returned events lack `latitude`/`longitude` (data/geocode).
2. 🟡 Events agent turns 10–32s on `/api/copilotkit` (PERF watch).
3. 🟡 `vercel/analytics` dev chunk trips strict console gate (dev only).
4. 🟡 Google Map Vector→Raster fallback (cosmetic).

---

## Linear

| Issue | Action |
|-------|--------|
| **SAN-896 · CK-V2-008** | **In Progress** — merge CK-V2-015; prove host event HITL; then re-run full matrix |
| **SAN-886 · CK-V2-000** | Done — v2 cutover verified; no reopen |
| **SAN-891** | Do not reopen |

---

## Commands (refresh)

```bash
git fetch origin main && git rev-parse --short origin/main   # 4f43390a
npm run audit:copilotkit-v2
infisical run --silent --env=dev --path=/ -- npm run build
infisical run --silent --env=dev --path=/ -- npm run dev     # ui + agent
infisical run --silent --env=dev --path=/ -- env PW_SKIP_WEBSERVER=1 \
  npx playwright test e2e/san-896-ck-v2-evidence.spec.ts --project=chromium
infisical run --silent --env=dev --path=/ -- \
  node docs/tasks/testing/evidence/2026-06-15/host-analytics-seed-verify.mjs
```
