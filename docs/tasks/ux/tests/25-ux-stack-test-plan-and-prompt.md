# UX stack — test-first plan + agent prompt (Chrome DevTools MCP + Playwright)

**Date:** 2026-05-31  
**Stack index:** [`../tasks/INDEX.md`](../tasks/INDEX.md)  
**Source audits:** [`23-live-audit.md`](23-live-audit.md) · [`24-mde-audit.md`](24-mde-audit.md) · [`22-card-audit.md`](22-card-audit.md)

---

## 1. Next steps (implementation order)

Tests **before** or **in the same PR** as each task — never mark Done without evidence.

| Phase | Task | Implement | Test artifact (create first) |
|-------|------|-----------|------------------------------|
| **0 — close WIP** | UX-015 | Push #17, merge | Vitest ✅ · smoke `scripts/smoke-ux015-error-bridge.mjs` ✅ · add UX-016 spec |
| **1 — P0 parallel** | UX-013 | `venue_anchors` café fallback | Vitest tool mock + Playwright scenario 4 · [UX-T-MA](../tasks/tests/UX-T-MA-mastra-mvp-tests.md) |
| | UX-014 | Remove `writer.custom` card emit | Vitest action names + Playwright card count · [UX-T-MA](../tasks/tests/UX-T-MA-mastra-mvp-tests.md) |
| | UX-019 | Event fast-path memory guard L55/L81 | Vitest classifier + Playwright scenario 3 |
| **2 — regression gates** | UX-016 | (spec only if not done in UX-015 PR) | `e2e/concierge-run-error.spec.ts` |
| | UX-031 | Automate live audit matrix | `e2e/live-audit-verticals.spec.ts` |
| **3 — prod verify** | UX-035 | Rental parser on prod | `e2e/prod-rental-parser.spec.ts` (or manual + evidence) |
| **4 — merge** | UX-017 | Rebase #19 | G3: `npm test` + `e2e/rich-card-dedup.spec.ts` |
| **5 — cards** | UX-021 → UX-030 | Card unification chain | Vitest + `e2e/card-unification.spec.ts` |

**Merge gates (from INDEX):**

- **G1:** UX-015 merged → prod RUN_ERROR bridge
- **G2:** UX-013 + UX-014 + UX-019 on main → `"specialty coffee Laureles"` returns café cards on mdeai.co
- **G3:** UX-017 + floor + rich-card-dedup e2e

---

## 2. Test inventory (what exists vs missing)

| Area | Vitest | Playwright | Chrome MCP smoke | Status |
|------|--------|------------|------------------|--------|
| Error bubble UI | `concierge-error-notice.test.tsx` | ❌ UX-016 | `smoke-ux015-error-bridge.mjs` | Partial |
| Thinking indicator | `concierge-pending-store.test.ts` | SCREEN-001 rental turn | `smoke-ux005-thinking.mjs` (flaky) | Partial |
| Home chrome | — | `SCREEN-001-home-chrome.spec.ts` | — | ✅ |
| Live 4-vertical matrix | — | ❌ UX-031 | Manual `23-live-audit.md` | Manual only |
| Café fallback (B-10) | ❌ UX-013 | ❌ UX-031 #4 | — | Missing |
| Restaurant misroute (B-09) | partial event tests | ❌ UX-031 #3 | audit-07 screenshot | Missing |
| Card↔pin parity | partial | `rich-card-dedup.spec.ts` | — | Partial |
| Maps env / Places | `verify-maps-env.mjs` | maps-layout specs | prod key probe | ✅ env fixed 2026-05-31 |

---

## 3. Agent prompt — copy/paste to run test implementation

Use this prompt in a fresh agent session **before** UX-013/014/019 code changes.

```markdown
# UX stack — test-first implementation (Playwright + Chrome DevTools MCP)

You are implementing the **test layer** for the mdeai UX PR stack before P0 feature work ships.

## Read first (in order)

1. `tasks/ux/tasks/INDEX.md` — execution order + merge gates
2. `tasks/ux/tests/23-live-audit.md` — 4-query manual matrix (source of truth for UX-031)
3. `tasks/ux/tests/24-mde-audit.md` — PR stack blockers
4. `tasks/ux/tasks/UX-016-playwright-run-error-e2e.md`
5. `tasks/ux/tasks/UX-031-live-audit-vertical-smoke.md`
6. `mdeapp/e2e/helpers/maps-layout.ts` — reuse `gotoHome`, `sendConciergeMessage`, `waitForRentalCards`
7. `.claude/skills/playwright-cli/SKILL.md` + `.claude/skills/testing` (if present)

## Environment

- Local: `cd mdeapp && npm run dev` → UI on :3001, Mastra :4111
- Prod smoke (read-only): `https://www.mdeai.co` — use for UX-035 / post-deploy only
- Hide CopilotKit inspector in e2e: `hideCopilotWebInspector(page)` from maps-layout helper
- Chat input: use React `input` event trick in `sendConciergeMessage` — do NOT `fill()` alone (Send stays disabled)

## Deliverables (create these files)

### A. `mdeapp/e2e/concierge-run-error.spec.ts` (UX-016)

- Serial test, chromium, 1280×720
- `page.route('**/api/copilotkit**')`: allow first POST (handshake), then `route.abort('failed')` OR return SSE with RUN_ERROR
- Send: `"test error bridge smoke"` (non-fast-path query)
- Assert: `[data-testid="concierge-error-notice"]` visible, copy contains "Something went wrong", no `RUN_ERROR` / `EAUTHTIMEOUT` in DOM
- Click `[aria-label="Try again"]` → assert second copilotkit POST
- Screenshot: `tasks/testing/evidence/<date>/ux-016-run-error.png`
- Must pass **without** Gemini key or live agent success

### B. `mdeapp/e2e/live-audit-verticals.spec.ts` (UX-031)

**One serial describe** — same browser context for session-order case.

| Step | Query | Network assert | UI assert |
|------|-------|----------------|-----------|
| 1 | `1BR in Laureles under $80/night` | `POST **/api/rentals/search` → 200 | ≥1 `[data-testid="rental-card"]`, map not empty-state |
| 2 | `salsa events this weekend` | `POST **/api/events/search` → 200 | ≥1 event card; optional B-06 fallback copy |
| 3 | `quiet rooftop dinner in Provenza` | **must NOT** call `/api/events/search` as primary | assistant must NOT say "Found N events" |
| 4 | `good specialty coffee in Laureles` | agent/copilotkit runs | ≥1 café card OR curated anchor; NOT "No places found" |

Scenario 4 options:

- Mock `**/api/grounding/**` or ADK URL → 503, OR
- `page.route` ADK invoke to `{ pins: [], metadata: { reason: 'adk_unavailable' } }`

Use `watchCriticalConsoleErrors` from `e2e/helpers/screen-evidence.ts` — fail on app `pageerror`, allow Maps billing warnings in dev.

Evidence folder: `tasks/testing/evidence/<date>/live-audit-verticals/`

### C. Vitest stubs (minimal, pair with e2e)

- `mdeapp/src/mastra/tools/__tests__/search-grounded-places-cafe-fallback.test.ts` — mock Supabase `venue_anchors` → ≥1 row for "coffee Laureles" (UX-013 AC)
- Extend event fast-path tests for memory guard L55/L81 (UX-019) — "dinner in Provenza" after event turn must NOT use `lastEventQuery.category`

### D. Package.json scripts (optional)

```json
"test:e2e:ux": "playwright test e2e/concierge-run-error.spec.ts e2e/live-audit-verticals.spec.ts --project=chromium --workers=1"
```

## Chrome DevTools MCP — manual / exploratory pass

After Playwright specs exist, run **one** MCP session to capture gaps automation missed:

1. `browser_navigate` → `http://localhost:3001/`
2. `browser_snapshot` — confirm `[data-testid="center-chat-panel"]`, `[data-testid="chat-map"]`
3. Network (CDP): enable `Network.enable`, send rental query, confirm `/api/rentals/search` 200 before cards paint
4. Repeat scenario 3 **in same tab** without reload — confirm restaurant query not hijacked by event fast-path
5. Café query with ADK down — confirm ≥1 card; screenshot to evidence
6. Console: no uncaught errors from mdeapp code (ignore Maps dev watermark / Lit dev mode)

Document MCP findings in `tasks/testing/evidence/<date>/chrome-devtools-notes.md` (5–10 bullets max).

## Verification commands (must all pass before Done)

```bash
cd mdeapp
npm test
npm run test:e2e:ux   # or full playwright command above
npm run verify:maps   # Places probe HTTP 200
```

## Anti-patterns (do NOT)

- Do not use `@copilotkit/react-core/v2` in app code
- Do not use `networkidle` on goto (Maps keeps socket open) — use `domcontentloaded`
- Do not reference `smoke:ux005-thinking` or `scripts/intelligence/golden-queries-smoke.ts` (absent)
- Do not assert exact LLM prose — assert testids, network routes, card counts

## Return format

- Files created/changed list
- Command output (pass/fail)
- Screenshot paths
- Which UX tasks are now test-gated (UX-016, UX-031, UX-013, UX-019)
- Remaining manual-only checks for prod (UX-035)
```

---

## 4. Additional real-world tests (beyond audit matrix)

Persona-driven scenarios worth adding after UX-031 passes.

### Tourist / concierge (P0–P1)

| ID | Scenario | Why it matters |
|----|----------|----------------|
| **RW-01** | Follow-up: rental search → "when can I view the first one?" | Multi-turn must stay rental intent (router memory) |
| **RW-02** | `"events tonight"` then `"actually show me apartments instead"` | Intent switch clears event fast-path memory |
| **RW-03** | Mobile 390px: rental query → open map sheet → pin tap | MAP-008 mobile sheet + pin interaction |
| **RW-04** | `"vegetarian restaurants El Poblado"` | Restaurant tool path, not events (B-09 variant) |
| **RW-05** | Café query with **ADK up** (staging) vs **ADK down** | Same UI shape; attribution chip when grounded |

### Roberto / events (P1)

| ID | Scenario | Why |
|----|----------|-----|
| **RW-06** | `/host/event/new` — HITL approve basics | CopilotKit interrupt + form fill |
| **RW-07** | Event detail sheet → Buy tickets → checkout modal 500 | SCREEN-019 pattern on live event slug |

### Camila / rentals (P1)

| ID | Scenario | Why |
|----|----------|-----|
| **RW-08** | Schedule viewing from rental card → lead API 200 | Lead capture path |
| **RW-09** | Filter chips: tap Laureles + Events then send rental query | Chip scope affects message, not wrong fast-path |

### Resilience / ops (P1–P2)

| ID | Scenario | Why |
|----|----------|-----|
| **RW-10** | CopilotKit 500 mid-stream → error bubble + retry (UX-016 prod) | Self-hosted, no publicApiKey |
| **RW-11** | New chat (UX-032) → map clears, thread id changes, no stale pins | UX-032 pre-test |
| **RW-12** | Prod synthetic monitor (UX-034): 4 queries on cron, alert on empty café | Uptime guard |
| **RW-13** | Gemini billing deny → user sees generic error, not raw `AI_APICallError` | UX-002 copy guard |
| **RW-14** | Double-send: spam Enter during `inProgress` | No duplicate cards/pins (LESSONS.md) |

### Card system (post UX-022)

| ID | Scenario | Why |
|----|----------|-----|
| **RW-15** | Rental search → count `[data-testid="rental-card"]` === map marker count | UX-030 pin parity |
| **RW-16** | Hover card → pin highlight `data-highlighted` | UX-024 |
| **RW-17** | Generic results suppressed when domain registrar mounted | 22-card-audit dup panel fix |

### Production-only (UX-035, post-deploy)

| ID | Query | Assert on www.mdeai.co |
|----|-------|------------------------|
| **PROD-01** | `1BR in Laureles under $80/night` | ≥3 rental cards, no parser leak in assistant text |
| **PROD-02** | `good specialty coffee in Laureles` | ≥1 café card after UX-013 + env fix |
| **PROD-03** | Maps loads without `BillingNotEnabledMapError` | GCP billing + referrer allowlist |

---

## 5. Suggested file layout after test-first sprint

```text
mdeapp/e2e/
  concierge-run-error.spec.ts      ← UX-016
  live-audit-verticals.spec.ts     ← UX-031
  prod-smoke-verticals.spec.ts     ← UX-034/035 (optional, @prod tag)
  card-unification.spec.ts         ← UX-030 (later)

mdeapp/src/mastra/tools/__tests__/
  search-grounded-places-cafe-fallback.test.ts  ← UX-013

tasks/testing/evidence/2026-05-31/
  ux-016-run-error.png
  live-audit-verticals/
  chrome-devtools-notes.md
```

---

## 6. Quick reference — MCP vs Playwright

| Use Playwright when | Use Chrome DevTools MCP when |
|---------------------|------------------------------|
| CI regression, route mock, deterministic assert | Exploring new failure, visual/layout doubt |
| Session-order (same context) | Network waterfall timing, SSE inspection |
| Screenshot evidence in CI | One-off prod verification |
| Retry / flake budget with `workers=1` | Confirming Maps key / referrer errors live |

Both: always save evidence under `tasks/testing/evidence/<date>/`.
