# UI Verification Playbook

> **Purpose:** standardize *browser proof* for every task so that **Done means the route
> actually works in a browser** — not just that `tsc` passed. A green typecheck proves the
> types line up; it does not prove Camila's map drew its pins, Roberto's wizard submitted,
> or Andrés's checkout loaded. This playbook says which tool to reach for, and what evidence
> to capture, per task class.

**Status:** active standard (2026-06-18). Pairs with the localhost-runtime-proof hard rule
(no task flips Done without a clean `npm run dev` boot + the surface responding) and the
`mde-worktree-pr-flow` merge gate.

See also (in `docs/testing/`): [`INDEX.md`](INDEX.md),
[`00-agent-testing-mandate.md`](00-agent-testing-mandate.md), and the persona smoke specs.

---

## 1. Two layers of proof — keep them straight

| Layer | What it is | Lives where | Survives PR/CI? |
|---|---|---|---|
| **Browser MCP tools** | Live, interactive checks I run *now* (Claude Preview, Claude in Chrome, chrome-devtools MCP, playwright-test MCP) | Harness-global — **not** in `mdeapp/.mcp.json` | ❌ Ephemeral — they prove "it works right now" |
| **Committed proof** | `e2e/*.spec.ts` Playwright specs + `npm run floor` + `npm run verify:task` | Tracked in the repo, run in CI | ✅ Durable — proves "it stays working" |

**Rule:** browser MCPs are for live exploration and first-time "is it actually working";
committed `e2e/` specs are the regression net. **A persona-visible change needs both** — a
screenshot is not a test, and a passing unit test is not a clean console.

> ⚠️ **Gap to know:** the chrome-devtools, playwright-test, Claude Preview, and Claude in
> Chrome MCPs are provided by the agent harness, not by `mdeapp/.mcp.json` (which only lists
> gemini-docs, copilotkit, mastra, linear, deepsource, mercur, medusa). They are available to
> an agent session but are **not** project-standard tooling. The durable, teammate-portable
> proof is always the committed `e2e/` spec + `floor`.

---

## 2. The four browser tools — which for which job

| Tool | Best at | Reach for it when |
|---|---|---|
| **Claude Preview** (`preview_start` / `preview_screenshot` / `preview_resize` / `preview_console`) | Fast route spin-up, screenshot proof, viewport-resize proof | First visual smoke of a new/changed screen |
| **Claude in Chrome** | Real logged-in session, clicking a multi-step flow as the persona | Auth/stateful journeys: Roberto's wizard, Andrés's checkout |
| **chrome-devtools MCP** (`list_console_messages`, `list_network_requests`, `lighthouse_audit`, `emulate`/`resize`, `performance_*`) | Console errors, failed requests, API status, Places field-mask check, Lighthouse/perf | Every UI change — this is the **clean-console / clean-network** gate |
| **playwright-test MCP** (`browser_navigate`, `browser_snapshot`, `browser_resize`, `browser_verify_*`, `test_run`, generator/planner) | Turning a manual check into a **committed** `e2e/` spec; snapshots; assertions | Locking a verified flow into a regression test |

---

## 3. Task class matrix — required proof per class

Match the proof to the diff. A one-line ranking fix does **not** need the full prod journey.

### Class D — Docs only
- **No browser proof required.**
- **No `floor` required** *unless* the change touches tooling, scripts, or doc-build config
  (then run the affected check).
- This is the only class exempt from the localhost-runtime-proof rule.

### Class U — UI / screen change (Camila's map, host dashboard, any visible surface)
Required:
- [ ] Screenshot at **1440px** (desktop)
- [ ] Screenshot at **768px** (tablet)
- [ ] Screenshot at **375px** (mobile)
- [ ] **Camila smoke at 390×844** when the surface is consumer-facing
- [ ] Console has **zero errors** (chrome-devtools `list_console_messages`)
- [ ] **No 4xx/5xx** network failures (chrome-devtools `list_network_requests`)
- [ ] **No horizontal scroll** at any breakpoint
- [ ] Mobile touch targets **≥ 44×44px**
- [ ] Playwright spec **added or extended** in `e2e/` (pattern: `e2e/maps-layout-desktop.spec.ts`, `e2e/maps-layout-mobile.spec.ts`, `e2e/screens/`)
- [ ] `npm run verify:task -- <TASK-ID>`
- [ ] `npm run floor` when the change is covered by floor (lint + typecheck + build + test + check:mastra + audit)

### Class C — CopilotKit / agent / interactive flow (`/host/event/new`, `/chat`)
Required:
- [ ] **Persona browser journey** driven end-to-end (Claude in Chrome)
- [ ] `/api/copilotkit` POST returns **200**
- [ ] **No POST storm** (request budget respected — cf. `e2e/copilotkit-request-budget.spec.ts`)
- [ ] **No v1/v2 mixing errors** in console (v2 `/v2` imports only, pinned 1.55.2)
- [ ] **HITL approval tested** if the flow has a `renderAndWaitForResponse` step (confirm `respond()` unblocks the agent)
- [ ] **`ai_runs` row or telemetry proof** if the task claims a run was recorded (note: `ai_runs` writes in a Next `after()` callback post-response — linger ~20s or poll the DB; an e2e that closes the context immediately drops the row)
- [ ] Playwright e2e **added or extended**
- [ ] `npm run verify:task -- <TASK-ID>` + `npm run floor`

### Class S — schema / backend / data (Supabase migration, payment tables)
Required:
- [ ] **Vitest / integration tests** (`npm test`, or scoped `npm run test:mastra` / `test:lib` / `test:api`)
- [ ] **RLS enabled** if a new table is added
- [ ] **At least one policy** if a new table is added
- [ ] **Browser proof only if a screen reads the new data** — then run the Class U routine on that screen
- [ ] Screen shows **`data pending`** where real data is missing (never fabricate KPIs/capacity/pricing/reviews)

---

## 4. Responsive breakpoints

Test every **Class U** task at all three breakpoints, plus Camila's phone.

| Viewport | Width | Layout that must appear |
|---|---|---|
| **Desktop** | **1440px** | 3-panel (rail + content + map/aside), ≥ 1280 |
| **Tablet** | **768px** | 2-panel (aside collapses), 768–1279 |
| **Mobile** | **375px** | single column + bottom-sheet, < 768 |
| **Camila smoke** | **390×844** | iPhone target used in the merge gate |

At each viewport confirm: no horizontal scroll, no clipped/overflowing content, touch
targets ≥ 44×44px on mobile/tablet, and the layout collapses as expected
(3-panel → 2-panel → bottom-sheet).

---

## 5. Design verification rules (every Class U task)

- **Light-first** is the default; dark only when `.mde-dark` is explicitly scoped.
- **Teal** = CTA / action / focus / active state.
- **Gold** = AI ✦ / ★ ratings / trust signals **only** — **never a gold CTA**.
- **No hardcoded gray/zinc** palettes when a semantic token exists.
- **`prefers-reduced-motion` respected** — animations gated behind the media query.
- **Skeleton / loading state exists** for any async surface.

(Canonical source: root `DESIGN.MD` → `mdeai-design-system/project/`.)

---

## 6. Maps-specific checks (any map surface)

- [ ] Every `<Map>` has a **`mapId`** (required for `<AdvancedMarker>`).
- [ ] **`<AdvancedMarker>` count matches the expected pin count** (e.g. 5 results → 5 pins).
- [ ] **No marker overflow** off-canvas on mobile (375px / 390×844).
- [ ] Every **Places API (New)** call includes **`X-Goog-FieldMask`** (cost + correctness).
- [ ] **No browser-exposed server Places key** — server key never ships to the client bundle.

---

## 7. CopilotKit-specific checks (any agent surface)

- [ ] **Single provider / bridge mount** — the CopilotKit provider is mounted once.
- [ ] **No repeated POST storm** to `/api/copilotkit` (request budget respected).
- [ ] **Action `render` works** — the generative-UI mirror renders for the agent tool.
- [ ] **HITL `respond()` unblocks** the flow (the awaiting component resumes the agent).
- [ ] **No fake tool data** in the production path — numbers come from real tool results, not invented by the model.

---

## 8. Quick command reference (real scripts, from repo root)

```bash
# Regression gate
npm run verify:task -- <TASK-ID>     # scoped tests + floor for a task
npm run floor                        # lint + typecheck + build + test + check:mastra + audit

# Unit / integration
npm test                             # vitest run (whole suite)
npm run test:mastra | test:lib | test:hooks | test:api   # scoped vitest

# Playwright e2e (committed proof)
npm run test:e2e                     # full Playwright run
npm run test:e2e:desktop             # e2e/maps-layout-desktop.spec.ts
npm run test:e2e:mobile              # e2e/maps-layout-mobile.spec.ts
npm run test:e2e:screens             # e2e/screens (chromium, workers=1)
npm run test:e2e:host-events         # host events authed screen
npm run test:e2e:auth                # auth guard
npm run test:e2e:prod-synthetic      # prod smoke vs https://www.mdeai.co

# Console proof (localhost runtime)
npm run verify:console               # localhost console sweep
npm run verify:console:boot          # console sweep on boot
```

---

## 9. Evidence to record in the PR body

For a Class U/C task, paste:
- Screenshots at 1440 / 768 / 375 (+ 390×844 if consumer-facing)
- Console output proving zero errors
- Network summary proving no 4xx/5xx (and `X-Goog-FieldMask` present on Places calls)
- The `e2e/` spec path that was added or extended
- `npm run verify:task -- <TASK-ID>` and `npm run floor` results

"Deployed" without the production HTTP 200 + screenshot is a claim, not proof.
