# MOB-CK-001 (SAN-521) — Evidence & Audit

> CopilotKit v1.55.2 mobile composer best practices.
> **Status: In Progress** — all automated gates green; Done is gated on human/device
> manual mobile verification + a Linear evidence comment (both require user action).
> Verified: 2026-06-02 · Auditor: Claude (strict task-verifier discipline)

---

## 0. Verdict

| Gate | Result |
|------|--------|
| `npm run build` | ✅ exit 0 — `✓ Compiled successfully in 7.9s` |
| `npm test -- --run` (full) | ✅ exit 0 — **488/488 passed**, 114 files |
| MOB-CK-001 e2e (chromium) | ✅ **7/7** (19.8s) — S1–S7 + console hygiene |
| SCREEN-018 regression | ✅ **9/9** (13.6s) — no mobile-shell regression |
| Restaurant fast-path (SAN-462 soak scope) | ✅ **1/1** (31.1s) — routing intact |
| Compiled-CSS proof (served by dev server) | ✅ all 5 overrides present |
| 390×844 screenshot | ✅ `composer-390.png` (42,315 bytes) |
| Manual mobile verification (no-zoom / no keyboard jump / tap / grow / reduced-motion on real iOS+Android) | ⏭️ **requires human + device** |
| Linear SAN-521 evidence comment | ⏭️ **awaiting user approval to post** |

Build/test/e2e all proven on a **fresh server in an isolated worktree** that serves
the exact edits on disk (compiled-CSS grep below). SAN-521 stays **In Progress**.

---

## 1. Incident & recovery — uncommitted work destroyed by a concurrent agent

Mid-session the shared working tree `/home/sk/mdeai/mdeapp` was switched off `main`
by a **concurrent agent working SAN-490** and then hard-reset:

```
reflog (mdeapp repo):
12f9b97 HEAD@{5}: checkout: moving from main to ai/san-490-screen-023-restaurant-listings-page
…
d861cb8 HEAD@{2}: reset: moving to origin/main      ← git reset --hard wiped my uncommitted edits
```

My **uncommitted** `globals.css` + `concierge-chat-input.tsx` edits (on `main`) were
carried onto the SAN-490 branch by the checkout, then discarded by the
`reset … origin/main`. They were never stashed. Only the **untracked** spec file
survived. (Lesson reinforced: agents share one filesystem — isolate in a worktree or
commit before another agent can switch branches.)

**Recovery (this session):**
- Created an isolated worktree `‎/home/sk/mdeai/.worktrees/wt-san521‎` on a dedicated
  branch `ai/san-521-mob-ck-001-mobile-composer` off `main` (12f9b97).
- Re-applied all 3 edits from known-good content; copied the surviving spec in.
- Symlinked gitignored runtime deps the worktree lacks: `node_modules`, `.env.local`,
  `workspace/` (all confirmed still gitignored — none will be committed).
- Re-ran every gate **in the worktree** (below). The SAN-490 agent cannot reset this
  branch.

---

## 2. Implementation (re-applied, disk-verified in worktree)

### `src/app/globals.css` — MOB-CK-001 block (after the sheet reduced-motion media query)

| Selector | Property | Why |
|----------|----------|-----|
| `.copilotKitInput > textarea` | `font-size: 1rem !important` | iOS Safari auto-zooms inputs < 16px; CK ships 0.875rem (14px) |
| `.copilotKitInputControlButton` | `min-width: 44px; min-height: 44px` | WCAG 2.5.5 touch target; CK ships 24×24 |
| `.copilotKitInputContainer` | `padding-bottom: max(15px, env(safe-area-inset-bottom)) !important` | Above iOS home indicator; preserves CK 15px floor |
| `.copilotKitMessages` | `overscroll-behavior-y: contain` | Stops page pull-to-refresh while scrolling messages |
| reduced-motion: button + `copilotKitActivityDot1/2/3` | `transition/animation/transform: none !important` | Honors `prefers-reduced-motion` |

`!important` is required only because `layout.tsx` imports `globals.css` (L6) **before**
`@copilotkit/react-ui/styles.css` (L7), so CK wins on equal specificity. New properties
CK doesn't set (`min-*`, `overscroll-behavior-y`) need no `!important`.

### `src/components/chat/concierge-chat-input.tsx`

| Change | Line | Effect |
|--------|------|--------|
| `enterKeyHint="send"` | 158 | Mobile keyboard shows a Send action key |
| `inputMode="text"` | 159 | Explicit text keyboard |
| `scrollHeight` auto-grow, cap 160px, in `onChange` | 160–166 | Box grows with content, then scrolls |
| height reset to `auto` after `setText("")` in `send()` | 109–111 | Collapses to one row after send |

Fast-path routing (`handleRentalMessage`/`handleEventMessage`/`handleGroundedMessage`/
`handleRestaurantMessage`) is **unchanged** — only the textarea element + auto-grow.

### `src/app/layout.tsx` (pre-existing, confirmed)
- `viewport.viewportFit: "cover"` (L27) — enables `env(safe-area-inset-*)` on notched iOS.

---

## 3. Gate commands & raw results (worktree, fresh dev server :3013)

```bash
# isolated worktree off main, deps symlinked from shared tree (gitignored)
git worktree add /home/sk/mdeai/.worktrees/wt-san521 -b ai/san-521-mob-ck-001-mobile-composer main

# build
npm run build                       # → ✓ Compiled successfully in 7.9s ; BUILD_EXIT=0

# full unit suite
npm test -- --run                   # → 488/488 passed, 114 files ; VITEST_EXIT=0

# fresh dev server, then e2e against it (no reuseExistingServer ambiguity)
next dev --webpack -p 3013          # → GET / 200
SMOKE_BASE_URL=http://localhost:3013 PW_SKIP_WEBSERVER=1 \
  npx playwright test e2e/screens/MOB-CK-001-mobile-composer.spec.ts --project=chromium
# → 7 passed (19.8s)
SMOKE_BASE_URL=http://localhost:3013 PW_SKIP_WEBSERVER=1 \
  npx playwright test e2e/screens/SCREEN-018-mobile-shell.spec.ts --project=chromium
# → 9 passed (13.6s)
SMOKE_BASE_URL=http://localhost:3013 PW_SKIP_WEBSERVER=1 \
  npx playwright test e2e/restaurant-card-fast-path.spec.ts --project=chromium
# → 1 passed (31.1s)
```

### MOB-CK-001 e2e — 7/7 (one assertion per success criterion)
```
✓ 1 textarea font-size ≥ 16px (no iOS auto-zoom)            (10.3s)  [+ composer-390.png, console clean]
✓ 2 send button ≥ 44×44 touch target (WCAG 2.5.5)           (2.0s)
✓ 3 input container padding-bottom ≥ 15px floor             (1.3s)
✓ 4 messages overscroll-behavior-y === "contain"            (1.3s)
✓ 5 enterkeyhint="send" + inputmode="text"                  (1.3s)
✓ 6 textarea auto-grows then collapses after clear          (1.6s)
✓ 7 reduced-motion ⇒ send-button transition-duration "0s"   (1.3s)
```

### Honest-gate note — caught & resolved a masked failure
First full-suite run reported **1 failed** (`src/mastra/workspaces.test.ts › workspace
directory contains 5 skill folders`). Root cause: that test is `skipIf(CI)` local-only
and asserts `existsSync(<repo>/workspace/skills)` — the `workspace/` dir is **gitignored**
and not tracked on `main`, so a fresh worktree lacks it. It is **unrelated** to the CSS/
textarea edits. After symlinking the gitignored `workspace/` (same treatment as
`node_modules`/`.env.local`), the full suite is **488/488**. The background-task
notification had said "exit 0" because the wrapper `echo "EXIT=$?"` masks the inner exit;
the captured `VITEST_EXIT=1` exposed it. Did not paper over it.

---

## 4. Compiled-CSS proof — the running server serves the edits on disk

The dev server at `:3013` compiles `globals.css` into `/_next/static/css/app/layout.css`
(139,339 bytes, dev = pretty-printed). All five overrides present, by selector:

```
.copilotKitInput > textarea {              font-size: 1rem !important;   (count 1, selector-anchored)
.copilotKitInputControlButton              min-width: 44px;  min-height: 44px;   (1 / 1)
.copilotKitInputContainer                  padding-bottom: max(15px, env(safe-area-inset-bottom));  (1)
.copilotKitMessages                        overscroll-behavior-y: contain;   (1)
@media (prefers-reduced-motion: reduce)    … copilotKitActivityDot3 …   (present)
```

(Reconciles an earlier false positive: a bare `font-size:1rem` match on the **reset**
shared tree was Tailwind's `.text-base`, not my override — selector-anchoring disproves it.)

---

## 5. Risk audit (11 items from the directive)

| # | Risk | Verdict | Evidence / reasoning |
|---|------|---------|----------------------|
| 1 | Auto-grow ⇒ layout thrash / iOS keyboard jump | 🟢 low | Standard `height=auto`→`scrollHeight` pattern, capped 160px; one sync reflow per keystroke on a tiny element. e2e #6 proves grow+collapse. Real-device visual-viewport behavior is the **only** part headless can't prove → manual check. |
| 2 | `overscroll-behavior-y: contain` breaks pull-to-refresh | 🟢 intended | Scoped to `.copilotKitMessages` only; page/PWA pull-to-refresh elsewhere unaffected. That is the goal. e2e #4 confirms it lands on the messages list. |
| 3 | reduced-motion assertion brittle across browsers | 🟢 low | Run chromium-only; `transition: none` computes to `0s` in every engine. e2e #7 green. |
| 4 | `!important` fragile if CK import order changes | 🟡 acceptable | `!important` wins **regardless** of import order; the order dependency is the reason it's needed at all, and is commented in `globals.css` + the task spec "do not remove" note. |
| 5 | retry/nudge helpers hide real regressions | 🟢 n/a here | MOB-CK-001 reads computed styles / boundingBox directly via `gotoHome`; no retry/nudge masking in its assertions. |
| 6 | `waitForCopilotRuntime` suppresses failures (`.catch(()=>undefined)`) | 🟡 real (shared) | True weakness in `maps-layout.ts`, but only affects the readiness *wait*, not the DOM/CSS assertions (composer renders regardless of handshake). **Recommend** a strict variant post-soak (see §6). |
| 7 | 120s timeouts hide perf regressions | 🟡 real (shared) | Ceilings live in shared helpers / `playwright.config`. MOB-CK-001 steps ran 1.3–10.3s — far under. **Recommend** tighter budgets post-soak. |
| 8 | `sendConciergeMessage` native-setter hack stability | 🟢 low | MOB-CK-001 doesn't use it (uses `pressSequentially`+`Shift+Enter`, exercising the real `onChange`). The fast-path spec that *does* use it passed with my `onChange` change → hack + `e.currentTarget` still valid. |
| 9 | Console-error filter misses auth/network/runtime | 🟡 real (shared) | `watchCriticalConsoleErrors` listens to `pageerror` only, not `console.error`. **Recommend** a uniform shared-helper upgrade post-soak (§6) rather than a one-off divergence in this spec. |
| 10 | SCREEN-018 mobile-shell regression | 🟢 none | 9/9 green — FAB, nav drawer, 44px target, desktop rail, console hygiene all intact. |
| 11 | SAN-462 soak-freeze fast-path regression | 🟢 none | Restaurant fast-path 1/1 green; routing code unchanged (only textarea attrs/auto-grow). |

---

## 6. Hardening evaluations (4 proposed) — all **deferred** per soak-freeze

The directive said *implement only low-risk isolated improvements; no shared-helper
changes during the SAN-462 freeze; recommend the rest.* All four proposals touch **shared
e2e helpers** (`maps-layout.ts` / `screen-evidence.ts`) used by every screen spec →
changing them now risks the soak. **None implemented; all recommended for post-soak:**

1. **Strict/non-strict helper split** — add `gotoHomeStrict` that asserts the
   `/api/copilotkit` handshake (vs lenient `gotoHome` for pure-UI specs). Critical/smoke
   specs adopt the strict one.
2. **Reduce 120s timeouts** — lower shared waits to ~30s with explicit per-step
   `waitFor`s + a perf budget, so a slow-load regression fails instead of passing.
3. **Stricter runtime handshake** — remove `.catch(()=>undefined)` in
   `waitForCopilotRuntime`; surface a failed handshake instead of swallowing it.
4. **Stronger console-error detection** — extend the shared collector to also capture
   `console.error` filtered by `/401|403|500|hydration failed|unauthorized|network
   error|unhandled/i`, applied uniformly across specs (not a one-off here, to avoid
   inconsistency/flake).

Doing these as one uniform shared-helper PR **after** soak hits 3/3 is safer than a
divergent change inside MOB-CK-001 now.

---

## 7. Grade / score

| Dimension | Score | Notes |
|-----------|------:|-------|
| Spec quality (template, mermaid, S1–S10, do/don'ts) | **92/100** | Complete, self-consistent; minor: depends on a v2-migration deferral note. |
| Execution readiness (build/test/e2e/regression proven on a fresh isolated server) | **90/100** | All automated gates green + compiled-CSS proof; −10 only because the two human-gated items (device manual + Linear) cannot be auto-closed. |
| **Overall** | **A− / 91** | Production-ready code; Done pending human verification. |

**Persona impact:** Camila on her iPhone 12 (390×844) can now tap the `/` chat composer
without the page auto-zooming, hit a thumb-sized 44px send button that sits above the home
indicator, watch the box grow as she types, and — with reduced-motion on — gets no
animation jitter. No change to Roberto's wizard or the fast-path routing.

---

## 8. Remaining before Done (both require the user)

1. **Manual mobile verification on real devices** (iOS Safari + Android Chrome): focus →
   no zoom, no keyboard jump, send tap, multi-line grow, message scroll, reduced-motion.
   *Cannot be performed headless or by the agent.*
2. **Linear SAN-521 evidence comment** — drafted from this file; **not posted** (external
   write awaits explicit user approval).
3. Optional but recommended: **commit the worktree branch** to make the recovered work
   durable (it was lost once already). Merge still waits for SAN-462 soak clearance.
