# SCREEN testing standard — visual + MCP + Playwright

> **Applies to:** every `tasks/screens/SCREEN-*.md` task.  
> **Agent mandate (strict):** [`tasks/testing/00-agent-testing-mandate.md`](../testing/00-agent-testing-mandate.md) — you restart dev, test **localhost** and **`https://www.mdeai.co/`**; do not delegate QA to the user.  
> **Skills:** [`chrome-devtools-cli`](../../.claude/skills/chrome-devtools-cli/SKILL.md) · [`playwright-cli`](../../.claude/skills/playwright-cli/SKILL.md) · [`webapp-testing`](../../.claude/skills/webapp-testing/SKILL.md) · [`task-verifier`](../../.claude/skills/task-verifier/SKILL.md)  
> **Anti-fake-done:** No task flips `status: Done` until **every** item in §6 passes and `tasks/notes/SCREEN-###-evidence.md` exists.

---

## 1. Prerequisites

```bash
cd mdeapp && npm run dev   # UI :3001 + Mastra :4111
```

| Surface | URL |
|---------|-----|
| Home / chat | `http://localhost:3001/` |
| CopilotKit runtime | `POST http://localhost:3001/api/copilotkit` |
| Mastra Studio | `http://localhost:4111` |
| Auth | `http://localhost:3001/login` |

**Screenshot root:** `mdeapp/tmp/screenshots/SCREEN-###/` (create per task; commit evidence paths in notes, not binary blobs in git unless team policy says otherwise).

---

## 2. Global command bundle

Run **after implementation**, before marking Done:

```bash
cd mdeapp

# Unit + build floor
npm run floor

# Console hygiene (load + one chat turn where applicable)
npm run verify:console

# Map / rental workflows (home chat tasks)
npm run smoke:map-pins
npm run smoke:f50-pin-sync

# ADK / grounding (map + concierge grounded search)
npm run smoke:grounding-attribution
npm run verify:grounding

# Layout E2E (existing MAP-007B specs — extend per SCREEN)
npm run test:e2e:desktop
npm run test:e2e:mobile
npm run test:e2e:grounding   # when ADK attribution required

# Full Playwright (when SCREEN-specific spec added)
npm run test:e2e -- e2e/screens/SCREEN-###-*.spec.ts
```

---

## 3. Chrome DevTools MCP / CLI checklist

Use **chrome-devtools MCP** in Cursor for interactive proof, or **chrome-devtools CLI** in scripts/CI.

| Step | Tool / command | Pass criteria |
|------|----------------|---------------|
| Open route | `navigate_page --url http://localhost:3001/…` | HTTP 200, no blank shell |
| Snapshot | `take_snapshot` | Primary regions + `data-testid`s visible |
| Console | `list_console_messages` | 0 critical errors (allow favicon, React DevTools) |
| Hydration | console filter | No `Hydration failed`, no `Maximum update depth` |
| Network | `list_network_requests` | `/api/copilotkit` not 5xx; no failed Maps script |
| Layout | `resize_page` 1280×900 + 390×844 | No horizontal overflow; regions per wireframe |
| Map | snapshot `#chat-map` / `[data-testid="chat-map"]` | Map canvas visible when task includes map |
| Interaction | `click` / `fill` on testids | CTA opens sheet/modal; state updates |
| Screenshot | `take_screenshot` | Save to `tmp/screenshots/SCREEN-###/` |

**Blocked patterns (fail closed):**

- `RefererNotAllowedMapError`
- Uncaught CopilotKit / Mastra stream errors
- 401/500 on `/api/copilotkit` during normal chat turn

---

## 4. Playwright requirements

Every SCREEN task must specify or add:

| Requirement | Detail |
|-------------|--------|
| **Desktop** | Viewport ≥1280px — `test:e2e:desktop` or dedicated spec |
| **Mobile** | Viewport ≤390px — `test:e2e:mobile` or dedicated spec |
| **Selectors** | Prefer `[data-testid="…"]`; role+name as fallback |
| **Screenshot** | `await page.screenshot({ path: 'tmp/screenshots/SCREEN-###/…png' })` |
| **Console** | `page.on('pageerror')` → use `collectCriticalConsoleErrors` from `e2e/helpers/maps-layout.ts` |
| **Spec path** | `mdeapp/e2e/screens/SCREEN-###-<slug>.spec.ts` (create when task ships) |

**Existing shared helpers:** `e2e/helpers/maps-layout.ts` — `gotoHome`, `sendConciergeMessage`, `waitForRentalCards`, `waitForGroundingAttribution`.

---

## 5. Feature verification matrix (by integration)

| Integration | When required | Proof |
|-------------|---------------|-------|
| **Layout ↔ wireframe** | All SCREEN tasks | Screenshot + snapshot labels match wireframe regions |
| **CopilotKit render** | Chat surfaces | CopilotChat visible; tool cards render after query |
| **Mastra tool/workflow** | Search, host, lead | Strip/steps or tool cards; Studio trace optional |
| **Card ↔ pin sync** | Rental/event/map | `smoke:f50-pin-sync` or Playwright click card → pin selected |
| **ADK / Maps attribution** | Grounded search, map panel | `grounding-attribution` testid visible |
| **Supabase write** | Lead, ticket, host publish | SQL row id or edge curl 200 in evidence |
| **Loading / empty / error** | SCREEN-019 + per-task | Forced empty state screenshot; error boundary if applicable |
| **Responsive** | All `/` tasks | Mobile drawer/FAB; no input overlap (SCREEN-018) |

---

## 6. Done gate (all required)

A SCREEN task is **Done** only when:

- [ ] Implementation on disk matches build scope
- [ ] Dev server restarted clean — [§7 Step 1](#step-1--restart-dev-server-clean-boot) (`npm run dev` → `:3001` Ready)
- [ ] Cursor Browser MCP proof — [§7 Step 2](#step-2--cursor-browser-mcp-verification) (navigate, snapshot, console clean, screenshot)
- [ ] Playwright task spec pass — [§7 Step 3](#step-3--playwright-proof-repeatable) (desktop **and** mobile)
- [ ] `npm run floor` exit 0
- [ ] Chrome DevTools: console clean on task route (+ one workflow turn if chat)
- [ ] Workflow verified (query → UI change → optional backend proof)
- [ ] No broken network calls on happy path
- [ ] Screenshots saved under `mdeapp/tmp/screenshots/SCREEN-###/`
- [ ] Evidence file: `tasks/notes/SCREEN-###-evidence.md` with paths + command output
- [ ] `tasks/screens/INDEX.md` + `tasks/INDEX-SCREEN-FIRST.md` status matches task frontmatter

**Implementation without visual/workflow proof = `In Progress` at best.**

**Also required:** [§7 Runtime proof](#7-runtime-proof--dev-restart--browser-mcp) — clean dev boot + Cursor Browser MCP + Playwright before marking Done.

---

## 7. Runtime proof — dev restart + Browser MCP

> **Every** `SCREEN-*.md` includes a task-specific [Runtime proof](#runtime-proof-dev-restart--browser) section with route, testids, and Playwright spec. This section is the **canonical procedure**; per-task blocks customize URLs and interactions.

### Step 1 — Restart dev server (clean boot)

Stale Turbopack cache or a hung `:3001` process invalidates Browser and Playwright proof. **Always restart** before verification:

```bash
# Stop stale processes on UI port
lsof -ti :3001 | xargs -r kill -9
pkill -f "playwright test" 2>/dev/null || true

# Clear corrupted Turbopack cache if Next panics on SST files
rm -rf mdeapp/.next

# Boot UI + Mastra agent (both required for chat surfaces)
cd mdeapp && npm run dev
```

**Pass when terminal shows:**

| Prefix | Signal |
|--------|--------|
| `[ui]` | `✓ Ready` · `Local: http://localhost:3001` |
| `[agent]` | Mastra dev listening (Studio `:4111`) — no `ERR_MODULE_NOT_FOUND` |

**Quick HTTP probe** (replace `ROUTE` with task path from frontmatter `path:`):

```bash
curl -s -o /dev/null -w "ROUTE → %{http_code}\n" --max-time 15 http://localhost:3001/ROUTE
# Auth-gated routes (/host/*): use -L and E2E_BYPASS_AUTH=1 for Playwright-only proof
#   E2E_BYPASS_AUTH=1 npm run dev:ui   # see middleware skip in src/lib/supabase/middleware.ts
```

### Step 2 — Cursor Browser MCP verification

Use **Cursor Browser** (`browser_*` tools) or **chrome-devtools-cli** for interactive proof. Order matters: navigate → snapshot → interact → screenshot.

| Step | Browser tool | Pass criteria |
|------|--------------|---------------|
| 1 | `browser_navigate` → task URL | HTTP 200 (or expected redirect); not blank shell |
| 2 | `browser_snapshot` | Primary `data-testid`s from task spec visible |
| 3 | `browser_console_messages` | 0 critical errors (no Hydration failed, no CopilotKit 5xx) |
| 4 | Task workflow (click/fill per task) | UI updates match acceptance criteria |
| 5 | `browser_take_screenshot` | Save to `mdeapp/tmp/screenshots/SCREEN-###/` |

**Blocked patterns (fail closed):** `RefererNotAllowedMapError` · uncaught stream errors · `/api/copilotkit` 5xx during chat turn.

### Step 3 — Playwright proof (repeatable)

With dev server already running from Step 1:

```bash
cd mdeapp
PW_SKIP_WEBSERVER=1 npx playwright test e2e/screens/SCREEN-###-*.spec.ts --project=chromium
```

Or let Playwright start UI with auth bypass for host routes:

```bash
cd mdeapp
npx playwright test e2e/screens/SCREEN-###-*.spec.ts --project=chromium
# playwright.config.ts starts E2E_BYPASS_AUTH=1 npm run dev:ui when PW_SKIP_WEBSERVER unset
```

**Pass:** all tests green · desktop **and** mobile viewports · screenshots in `tmp/screenshots/SCREEN-###/`.

### Step 4 — Floor + record evidence

```bash
cd mdeapp && npm run floor
```

Log in `tasks/notes/SCREEN-###-evidence.md`:

- Dev restart timestamp + curl HTTP codes
- Browser: console clean + screenshot paths
- Playwright: pass count (e.g. `2/2`)
- `npm run floor` exit 0

---

## 8. Evidence file template

Save as `tasks/notes/SCREEN-###-evidence.md`:

```markdown
# SCREEN-### evidence — YYYY-MM-DD

## Commands
(paste exit-0 output snippets)

## Chrome DevTools MCP
- Dev restart: clean boot :3001 + :4111
- Route: …
- Browser MCP: snapshot + console clean
- Screenshot: mdeapp/tmp/screenshots/SCREEN-###/desktop.png

## Playwright
- Spec: e2e/screens/SCREEN-###-….spec.ts
- Desktop: pass
- Mobile: pass

## Workflow
(describe user action → expected UI → backend if any)

## Supabase / edge (if applicable)
(query or curl proof — no secrets)
```

---

## 9. Per-task spec location

Each `SCREEN-*.md` includes:

1. **`## Runtime proof (dev restart + Browser)`** — task-specific URLs, testids, Playwright spec, workflow step
2. **`## Visual + MCP Testing`** — extended MCP checklist

Cross-reference this standard; do not duplicate §2–§7 unless task needs exceptions.

---

## 10. Index of planned Playwright specs

| Task | Spec file (create on ship) | Extends |
|------|----------------------------|---------|
| SCREEN-001 | `e2e/screens/SCREEN-001-home-chrome.spec.ts` | ✅ shipped | `maps-layout-desktop.spec.ts` |
| SCREEN-002 | `e2e/screens/SCREEN-002-nav-rail.spec.ts` | — | — |
| SCREEN-003 | `e2e/screens/SCREEN-003-query-bar.spec.ts` | ✅ shipped | — |
| SCREEN-004 | `e2e/screens/SCREEN-004-workflow-strip.spec.ts` | ✅ shipped | — |
| SCREEN-005 | `e2e/screens/SCREEN-005-rental-card.spec.ts` | ✅ shipped | pin sync in `maps-layout-desktop` |
| SCREEN-006 | `e2e/screens/SCREEN-006-event-card.spec.ts` | — |
| SCREEN-007 | `e2e/screens/SCREEN-007-venue-sheet.spec.ts` | — |
| SCREEN-008 | `e2e/screens/SCREEN-008-schedule-viewing.spec.ts` | + edge smoke |
| SCREEN-009 | `e2e/screens/SCREEN-009-checkout.spec.ts` | Stripe test mode |
| SCREEN-010 | `e2e/screens/SCREEN-010-map-panel.spec.ts` | `maps-grounding.spec.ts` |
| SCREEN-011 | `e2e/screens/SCREEN-011-saved.spec.ts` | auth required |
| SCREEN-012 | `e2e/screens/SCREEN-012-trips.spec.ts` | auth required |
| SCREEN-013 | `e2e/screens/SCREEN-013-itinerary.spec.ts` | auth required |
| SCREEN-014 | `e2e/screens/SCREEN-014-event-detail.spec.ts` | — |
| SCREEN-015 | `e2e/screens/SCREEN-015-tickets.spec.ts` | auth required |
| SCREEN-016 | `e2e/screens/SCREEN-016-host-wizard.spec.ts` | HITL |
| SCREEN-017 | `e2e/screens/SCREEN-017-auth.spec.ts` | — |
| SCREEN-018 | `e2e/screens/SCREEN-018-mobile-shell.spec.ts` | `maps-layout-mobile.spec.ts` |
| SCREEN-019 | `e2e/screens/SCREEN-019-empty-error.spec.ts` | cross-route |
| SCREEN-020 | `e2e/screens/SCREEN-020-a11y.spec.ts` | axe/keyboard |
| SCREEN-021 | `e2e/screens/SCREEN-021-cafe-listings.spec.ts` | `maps-grounding.spec.ts` (baseline) |

*Last updated: 2026-05-26 (SCREEN-021 Playwright row)*
