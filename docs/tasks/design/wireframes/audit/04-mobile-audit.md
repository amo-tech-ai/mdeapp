---
title: Mobile wireframe task pack — forensic audit
auditor: task-verifier (Cursor agent)
date: 2026-06-02
scope: tasks/wireframes/mobile/** + cross-check tasks/screens/** + mdeapp disk
verdict: Not ready — zero tasks are 100% correct; pack average ~52% spec accuracy
---

# Mobile task pack audit — 2026-06-02

> **Persona impact:** Camila on `/` cannot reliably open the map drawer or type above the iOS keyboard until **SCREEN-018** (shell) and **MOB-CHAT-019** (rename required) actually ship — today's specs mis-name files, collide with Done screen IDs, and overstate M1 completion.

## Executive summary

| Metric | Value |
|--------|------:|
| Tasks audited | 10 specs + 2 index/plan docs |
| Pack spec accuracy (weighted) | **52%** |
| Safe to execute without fixes | **0 / 10** |
| 🔴 Blockers (pack-wide) | **6** |
| Tests run this audit | Playwright SCREEN-018, Vitest maps + rental-card, curl `/` |

### Pack-wide 🔴 blockers (fix before any execution)

1. **SCREEN ID collision** — `SCREEN-019` and `SCREEN-020` already exist under `tasks/screens/` as **Done** (empty/error states + a11y pass) with live Playwright specs (`SCREEN-019-empty-error.spec.ts`, `SCREEN-020-a11y.spec.ts`). Mobile pack reuses the same IDs for unrelated work (chat composer, card carousel). **Rename mobile tasks** (e.g. `MOB-019`, `MOB-020`) or adopt SAN-* only per `linear.md`.
2. **Status schizophrenia** — `mobile-plan.md` says M1 ✅ shipped; `index-mobile.md` says SCREEN-018 🟡 In Progress; `tasks/screens/018-scr-mobile-responsive-shell.md` says **Not Started**. Only disk + tests count: **In Progress, not Done**.
3. **Wrong component paths** — Specs cite `chat-composer.tsx`, `src/components/cards/*`, `src/components/map/chat-map.tsx`. Disk uses `concierge-chat-input.tsx`, `src/components/copilot/*-card.tsx`, `src/components/maps/ChatMap.tsx`.
4. **`layout.tsx` missing viewport export** — SCREEN-018 requires `viewportFit: "cover"`; probe: `grep viewport mdeapp/src/app/layout.tsx` → **no matches**. Safe-area AC cannot pass.
5. **Deprecated Linear prefix** — `linear.md` lists `SCREEN-*` as deprecated; mobile plan still builds on SCREEN-019/020 numbering.
6. **SCREEN-018 Playwright red** — `PW_SKIP_WEBSERVER=1 npx playwright test e2e/screens/SCREEN-018-mobile-shell.spec.ts --project=chromium` → **5 failed, 3 passed** (drawer + sheet portal tests).

---

## Verification report

| Task | Spec /100 | Ready /100 | Grade | 🟢🟡🔴 | % correct | Safe? |
|------|----------:|-----------:|-------|--------|----------:|-------|
| [mobile-plan.md](../../wireframes/mobile/mobile-plan.md) | 55 | 25 | D | 🔴 | 52% | No |
| [index-mobile.md](../../wireframes/mobile/index-mobile.md) | 50 | 20 | D | 🔴 | 48% | No |
| [018 SCREEN-018](../../wireframes/mobile/018-scr-mobile-responsive-shell.md) | 62 | 35 | D | 🔴 | 58% | No |
| [019 SCREEN-019](../../wireframes/mobile/019-scr-mobile-chat-composer.md) | 45 | 0 | F | 🔴 | 42% | No |
| [020 SCREEN-020](../../wireframes/mobile/020-scr-mobile-card-system.md) | 44 | 0 | F | 🔴 | 40% | No |
| [MAP-011](../../wireframes/mobile/map-011-mobile-map-system.md) | 55 | 30 | D | 🔴 | 52% | No |
| [PAY-005](../../wireframes/mobile/pay-005-mobile-checkout.md) | 48 | 15 | F | 🔴 | 45% | No |
| [AUTH-006](../../wireframes/mobile/auth-006-mobile-auth.md) | 58 | 40 | D | 🟡 | 55% | No |
| [AIM-010](../../wireframes/mobile/aim-010-mobile-ai-ux.md) | 52 | 35 | D | 🟡 | 50% | No |
| [PERF-001](../../wireframes/mobile/perf-001-mobile-performance.md) | 65 | 50 | C | 🟡 | 62% | No* |
| [PWA-001](../../wireframes/mobile/pwa-001-mobile-install.md) | 64 | 48 | C | 🟡 | 60% | No* |
| [A11Y-001](../../wireframes/mobile/a11y-001-mobile-accessibility.md) | 58 | 42 | D | 🟡 | 58% | No* |

\*Phase 2 tasks — blocked until M2–M4 ship; specs still need path/ID fixes.

**Stop condition:** 🛑 Not ready. Fix pack-wide blockers 1–6 before marking any mobile task executable.

---

## Tests executed (evidence)

| # | Command | Result | Implication |
|---|---------|--------|-------------|
| 1 | `curl -s -o /dev/null -w '%{http_code}' http://localhost:3001/` | **200** | Dev server up; shell probe valid |
| 2 | `PW_SKIP_WEBSERVER=1 npx playwright test e2e/screens/SCREEN-018-mobile-shell.spec.ts --project=chromium` | **3 pass / 5 fail** | SCREEN-018 not Done; drawer/sheet flaky or broken |
| 3 | `npm test -- --run src/components/copilot/__tests__/rental-card` | **3/3 pass** | Card component exists (wrong path in SCREEN-020 spec) |
| 4 | `npm test -- --run src/components/maps` | **10/10 pass** | ChatMap + mapId/gestureHandling on disk |
| 5 | `ls mdeapp/e2e/screens/SCREEN-019*` | **empty-error.spec.ts only** | Mobile chat-composer spec **does not exist** |
| 6 | `grep viewport mdeapp/src/app/layout.tsx` | **no match** | viewportFit AC unmet |
| 7 | `ls tasks/notes/SCREEN-018-evidence.md` | **missing** | Anti-fake-done gate fails |

---

## Per-task reports

### 🟢 = verified good · 🟡 = fix before execute · 🔴 = blocker

---

### mobile-plan.md — Strategy doc

**Score:** Spec 55 · Ready 25 · **52% correct** · Grade **D** · 🔴

**What it gets right 🟢**
- Milestone sequencing (M1 shell → M2 chat → M3 map/cards → M4 pay/auth → M5 perf/PWA/a11y) matches DESIGN.MD §5 breakpoints.
- Risk table (iOS keyboard, Maps scroll conflict, SW + SSE) is accurate and actionable.
- Playwright viewport constants match `e2e/helpers/screen-evidence.ts` (`MOBILE_VIEWPORT = 390×844`).

**Errors & red flags 🔴**
- Claims **"SCREEN-018 shipped"** and M1 ✅ — contradicted by failing Playwright, missing evidence, missing viewport export.
- Lists **`SCREEN-*` Linear rows** while `linear.md` deprecates `SCREEN-*` prefix.
- Skills table lists **four overlapping responsive skills** (merge recommended to `tailwind-responsive-ui` + `responsive-design`).
- Says `mobile-utils.ts` helpers **"to add"** — file already exists at `mdeapp/e2e/helpers/mobile-utils.ts` (partial implementation).

**Real-world example:** Roberto opens mdeai on iPhone expecting the map FAB from the plan's "shipped M1" — drawer tests fail in CI, sheet content never attaches within 10s, so he taps "Open map" and nothing usable appears. The plan over-promises.

**Corrections**
1. Change M1 status to **In Progress** until Playwright 8/8 green + evidence file.
2. Rename future tasks away from colliding SCREEN-019/020 IDs.
3. Point skills to `tailwind-responsive-ui` + `responsive-design` only.
4. Update mobile-utils note to "extend existing helpers".

---

### index-mobile.md — Task index

**Score:** Spec 50 · Ready 20 · **48% correct** · Grade **D** · 🔴

**Errors 🔴**
- SCREEN-018 row: **🟡 In Progress** here vs **✅ Done** in mobile-plan — internal drift.
- Playwright spec map lists **9 future spec files that do not exist** on disk (only `SCREEN-018-mobile-shell.spec.ts` present).
- Critical path diagram shows SCREEN-018 ✅ — premature.

**Corrections**
1. Single status source: derive from `tasks/screens/` + disk probes, not duplicate narratives.
2. Mark spec files as **planned** until created; link only existing paths.
3. Add column "Linear ID" — most rows still SAN-TBD.

---

### SCREEN-018 — Mobile Responsive 3-Panel Shell

**Score:** Spec 62 · Ready 35 · **58% correct** · Grade **D** · 🔴

**Claims verified 🟢**
- `map-mobile-sheet.tsx` exists with `data-testid="map-mobile-controls"`, `map-sheet-trigger`, `map-sheet-content` — probe: file read 2026-06-02.
- `chat-nav-drawer.tsx` has `nav-drawer-trigger` — probe: grep disk.
- FAB uses `h-11` (44px) — probe: map-mobile-sheet.tsx L86.
- `ChatMap` has `gestureHandling="greedy"` + `mapId` — probe: ChatMap.tsx L52–55.
- Playwright spec exists — 3 tests pass (layout, overflow, desktop rail hidden).

**Claims not verified / stale 🔴**
- **`viewportFit: "cover"` in layout.tsx** — NOT on disk (blocker for safe-area AC).
- FAB still `bottom-[7.5rem]` without `env(safe-area-inset-bottom)` — spec says to fix; not done.
- Sheet uses `max-h-[85vh]` not `85dvh` + safe-area calc — spec requirement unmet.
- **`tasks/notes/SCREEN-018-evidence.md`** — missing.
- **`tasks/screens/018` status: Not Started** vs mobile copy: In Progress — INDEX drift.
- Depends on **F48, MAP-007B, SCREEN-001** — files live under `tasks/archive/` or `evidence/`; slugs resolve but paths confuse executors.
- Wireframe link `002-wire-chat-chrome.md` — wrong relative path from `wireframes/mobile/` (file is under `tasks/screens/` or `tasks/wireframes/screens/`).
- `SCREEN-TESTING-STANDARD.md` relative link from mobile folder — broken (file is `tasks/screens/SCREEN-TESTING-STANDARD.md`).

**Playwright failures (2026-06-02) 🔴**
- Nav drawer open/close (Escape, outside click) — sheet/drawer portal not attaching in time.
- Map sheet open/close cycle — `[data-testid="map-sheet-content"]` not attached within 10s.

**Real-world example:** Camila taps the hamburger — nothing opens reliably in automated tests; she may see the same flakiness when CopilotKit SSE keeps React busy (documented in spec comments, not fixed).

**Corrections**
1. Add `export const viewport` to `layout.tsx` per spec snippet.
2. Apply safe-area + dvh CSS from build scope verbatim.
3. Fix Playwright drawer/sheet tests (fresh page context, Base UI portal timing) until 8/8 green.
4. Write evidence file; align status across index, plan, tasks/screens.
5. Fix relative links to testing standard + wireframes.
6. Do **not** mark Done until `mdeai-testing.mdc` prod + localhost proof (spec only mentions localhost).

**Template gap 🟡:** Missing mde-task-lifecycle sections 1–10 (Purpose/Goals/…/Rollback); uses screen-style Goal/AC instead — acceptable for SCREEN docs but hurts verifier scoring (−15 template).

---

### SCREEN-019 — Mobile Chat Composer (⚠ ID COLLISION)

**Score:** Spec 45 · Ready 0 · **42% correct** · Grade **F** · 🔴

**Fatal blocker 🔴:** **`tasks/screens/019-scr-loading-error-empty-states.md`** is **Done** (SAN-265) with e2e `SCREEN-019-empty-error.spec.ts`. This mobile task is a **different feature** with the same ID.

**Wrong paths 🔴**
| Spec says | Disk reality |
|-----------|--------------|
| `src/components/chat/chat-composer.tsx` | **`concierge-chat-input.tsx`** |
| `message-list.tsx` | **`concierge-chat-messages.tsx`** |
| `loading-skeleton.tsx` | **`concierge-thinking-indicator.tsx`** (partial) |
| `useCopilotChat().append()` | Disk uses **`appendMessage`** via `@copilotkit/react-core` v1.55.2 |

**Dependency 🔴:** `depends_on: SCREEN-018 ✅` — SCREEN-018 is **not Done** (Playwright red).

**Real-world example:** Andrés follows this spec and edits `chat-composer.tsx` — file doesn't exist; he creates a duplicate composer beside CopilotKit's wired input, breaking the concierge shell.

**Corrections**
1. **Rename ID** → e.g. `MOB-CHAT-001` or new SAN issue; update playwright filename.
2. Retarget all file paths to `concierge-chat-input.tsx` / `concierge-chat-messages.tsx`.
3. Document CopilotKit v1 hooks (`useCopilotChat`, `useCopilotChatInternal`) — not v2 `@copilotkit/react-core/v2`.
4. Remove `depends_on ✅` checkmarks until SCREEN-018 Done with evidence.
5. Add VisualViewport implementation spec against **existing** ConciergeChatInput structure.

---

### SCREEN-020 — Mobile Card System (⚠ ID COLLISION)

**Score:** Spec 44 · Ready 0 · **40% correct** · Grade **F** · 🔴

**Fatal blocker 🔴:** **`tasks/screens/020-scr-accessibility-pass.md`** is **Done** (SAN-268) with `SCREEN-020-a11y.spec.ts`.

**Wrong paths 🔴**
| Spec says | Disk reality |
|-----------|--------------|
| `src/components/cards/rental-card.tsx` | **`src/components/copilot/rental-card.tsx`** |
| `event-card.tsx`, `restaurant-card.tsx` under `cards/` | Under **`src/components/copilot/`** |
| `card-carousel.tsx` (new) | **Does not exist** — may need new file under copilot or chat |

**Partial truth 🟢:** `data-testid="rental-card"`, `event-card`, `restaurant-card` exist on copilot cards — probe: grep disk.

**Real-world example:** Camila swipes rental results — spec builds carousel in `components/cards/` while cards render from CopilotKit tool renders in chat; engineer wires the wrong layer and carousel never appears in the message stream.

**Corrections**
1. Rename task ID (e.g. `MOB-CARD-001`).
2. Fix all paths to `src/components/copilot/*`.
3. Specify integration point: **`search-tool-renders.tsx`** / message list, not orphan card folder.
4. Note existing mobile coverage in `SCREEN-005` / `SCREEN-006` e2e specs before duplicating effort.

---

### MAP-011 — Mobile Map Interaction System

**Score:** Spec 55 · Ready 30 · **52% correct** · Grade **D** · 🔴

**Verified 🟢**
- `gestureHandling: "greedy"` + `mapId` already on `ChatMap.tsx`.
- `map-mobile-sheet.tsx` uses bottom sheet pattern (shadcn Sheet, not Vaul — workable but spec mismatch).
- `MapResizeSignal` prop exists as `mapResizeSignal` on ChatMap — partial match.

**Wrong / stale 🔴**
| Spec says | Disk reality |
|-----------|--------------|
| `src/components/map/chat-map.tsx` | **`src/components/maps/ChatMap.tsx`** |
| `useJsApiLoader` | **`@vis.gl/react-google-maps` `APIProvider`** pattern |
| Vaul `<Drawer snapPoints={[0.3, 0.85]}>` | **shadcn `Sheet`** without snap points |
| `place-detail-sheet.tsx` | **No such component** — cafe uses `cafe-detail-panel.tsx`, rentals use cards |
| `cluster-renderer.tsx` | Clustering inline in ChatMap |

**Real-world example:** Camila pinch-zooms inside the sheet — greedy handling helps, but without snap points she can't peek at chat + map simultaneously as DESIGN.MD §5.3 describes (bottom-sheet half-state).

**Corrections**
1. Fix paths and loader API to match mde-maps stack.
2. Decide: extend shadcn Sheet **or** migrate to Vaul — don't spec Vaul while disk uses Sheet.
3. Align place detail with existing **`cafe-detail-mobile-sheet.tsx`** / map column modes — avoid third sheet type.
4. Mark MAP-001 dependency with canonical path `tasks/archive/maps-A/MAP-001-platform-map-pipeline.md`.

---

### PAY-005 — Mobile Checkout UX

**Score:** Spec 48 · Ready 15 · **45% correct** · Grade **F** · 🔴

**Verified 🟢**
- Routes `/events/[slug]`, `/me/tickets` are **LIVE** per `sitemap.md`.
- `checkout-wallet-link.tsx` exists — partial checkout surface.

**Not verified / missing 🔴**
- **`checkout-form.tsx`**, **`payment-request-button.tsx`**, **`ticket-qr.tsx`** — not found on disk.
- **`currency: "cop"`** in PaymentRequest example — no Stripe PaymentRequest code on disk; confirm Stripe account currency (often USD for international cards in Medellín events).
- Depends on SCREEN-019 ✅ — invalid while composer task blocked.

**Real-world example:** Andrés taps Buy on an event — Stripe Elements may render desktop-width fields; spec targets files that don't exist, so mobile Apple Pay never gets wired.

**Corrections**
1. Audit existing checkout path (`SCREEN-009-checkout.spec.ts` already has mobile viewport tests) — extend don't duplicate.
2. Map build scope to **actual** checkout components after disk inventory.
3. Add `depends_on: Stripe foundation task` with real task ID from `tasks/`.
4. Fix currency to match production Stripe config.

---

### AUTH-006 — Mobile Auth Stability

**Score:** Spec 58 · Ready 40 · **55% correct** · Grade **D** · 🟡

**Verified 🟢**
- `/login`, `/signup` LIVE — sitemap.md.
- `src/app/auth/callback/route.ts` exists — PKCE callback plausible.

**Issues 🟡**
- **`AUTH-005` prerequisite** mentioned in body but **not in `depends_on` frontmatter**.
- Magic link "in-app browser" behavior is iOS-specific — hard to prove in Playwright; needs manual BrowserStack note.
- `use-auth-state.ts` — verify exists before spec cites "create".

**Real-world example:** Camila signs in with Google on Safari — if `?next=` double-encoding is wrong, she lands on `/` instead of the rental thread she started; spec catches this in failure points but dependency on AUTH-005 e2e infra is unstated.

**Corrections**
1. Add `depends_on: AUTH-005` to frontmatter.
2. Probe `createBrowserClient` PKCE config on disk before execution.
3. Cross-link existing auth e2e if any under `mdeapp/e2e/`.

---

### AIM-010 — Mobile AI Concierge UX

**Score:** Spec 52 · Ready 35 · **50% correct** · Grade **D** · 🟡

**Issues 🟡**
- **`quick-chips.tsx`** — does not exist (reasonable new work).
- **`useCopilotChat().append()`** — disk uses **`appendMessage`**.
- **`use-thread-persistence.ts`** — thread nav may live in `ThreadNavProvider` / URL already — spec should diff against disk before "new".
- Title mentions **Voice**; body correctly defers — OK but confusing in index.

**Real-world example:** Camila taps "Rentals" chip — without debounce + `isStreaming` guard, double-tap sends duplicate queries and she sees two identical card carousels (spec failure point #3 — good, but API names wrong).

**Corrections**
1. Fix CopilotKit API names to match v1.55.2.
2. Audit existing thread URL pattern in `copilot-kit-provider.tsx` before new hook.
3. Rename task title to drop "Voice" or mark Phase 3 explicitly in title.

---

### PERF-001 — Mobile Performance (Phase 2)

**Score:** Spec 65 · Ready 50 · **62% correct** · Grade **C** · 🟡

**Good 🟢**
- Correctly says test against **`npm run build && npm run start`**, not dev Turbopack.
- INP target (not legacy FID-only) — title still says "FID" but body uses INP.

**Issues 🟡**
- **`ChatMap` dynamic import path** wrong (`components/map/` vs `components/maps/ChatMap.tsx`).
- **`next-bundle-analyzer`** — verify in package.json before spec requires it.
- Depends on SCREEN-019/MAP-011/SCREEN-020 ✅ — all blocked.

**Corrections**
1. Fix import paths; add probe step for analyzer package.
2. Align title with INP-only wording.

---

### PWA-001 — Mobile Install (Phase 2)

**Score:** Spec 64 · Ready 48 · **60% correct** · Grade **C** · 🟡

**Verified 🟢**
- No `manifest.ts` / `manifest.json` on disk — correct for Not Started.
- SSE `/api/copilotkit` exclusion warning — **critical and accurate** for CopilotKit.

**Issues 🟡**
- iOS install limitations well documented 🟢.
- Depends on AUTH-006 + PERF-001 — chain is logical.

**Corrections**
1. Prefer Next.js 16 `app/manifest.ts` over `public/manifest.json` — pick one in spec.
2. Add explicit cross-ref to LESSONS.md CopilotKit POST storm if SW misconfigured.

---

### A11Y-001 — Mobile Accessibility Audit (Phase 2)

**Score:** Spec 58 · Ready 42 · **58% correct** · Grade **D** · 🟡

**Overlap 🟡**
- **`SCREEN-020` a11y pass already Done** with `SCREEN-020-a11y.spec.ts` — this task re-audits similar surfaces unless scoped as "mobile-only delta".

**Good 🟢**
- FAB `aria-label` already on disk — spec notes correctly.
- `@axe-core/playwright` install step — actionable DoD.

**Corrections**
1. Reframe as **mobile delta audit** vs Done SCREEN-020 — list net-new checks only.
2. Avoid duplicate ID `A11Y-001` vs screen numbering confusion; tie to SAN issue.

---

## Cross-cutting improvements (best practices)

| Area | Recommendation |
|------|----------------|
| **IDs** | Stop reusing SCREEN-019/020; use `MOB-*` or SAN-* per `linear.md`; one canonical spec path (`tasks/wireframes/mobile/` **or** `tasks/screens/`, not both diverging). |
| **Status** | One row in `tasks/INDEX.md` or index-mobile; status from probes only. |
| **File paths** | Run `tasks/wireframes/mobile/path-audit.sh` grep before save: every `src/` path must resolve. |
| **Skills** | Load **`tailwind-responsive-ui`** + **`responsive-design`**; drop 4-skill laundry list from frontmatter. |
| **CopilotKit** | Specs must say **v1.55.2** hooks (`appendMessage`, `@copilotkit/react-core`) — not v2 docs. |
| **Maps** | Reference **`@vis.gl/react-google-maps`** + `mde-maps` — not `useJsApiLoader`. |
| **Testing** | Extend `e2e/helpers/mobile-utils.ts` (exists); don't claim greenfield. |
| **Done gate** | Every task needs evidence under `tasks/testing/evidence/` or `tasks/notes/` + prod proof per `mdeai-testing.mdc`. |
| **Template** | Add `verified_against:` date + disk probe list to each frontmatter. |

---

## Grading key

| Grade | Spec score | Meaning |
|-------|------------|---------|
| **A** | 90–100 | Safe to execute |
| **B** | 80–89 | Minor fixes |
| **C** | 70–79 | Phase 2 / structural gaps |
| **D** | 60–69 | Wrong paths or status drift |
| **F** | <60 | ID collision or missing prerequisites |

| Dot | Meaning |
|-----|---------|
| 🟢 | Verified against disk/tests this run |
| 🟡 | Fix before execute; not a hard blocker alone |
| 🔴 | Blocker — do not start |

---

## Commands before any mobile task execution

```bash
# 1. Fix pack IDs + paths in specs (human/agent edit)

# 2. SCREEN-018 floor
cd /home/sk/mdeai/mdeapp
PW_SKIP_WEBSERVER=1 npx playwright test e2e/screens/SCREEN-018-mobile-shell.spec.ts --project=chromium
npm run floor

# 3. After each task — mobile + prod (mdeai-testing.mdc)
node /home/sk/mdeai/tasks/testing/scripts/chat-smoke.mjs --base http://localhost:3001
node /home/sk/mdeai/tasks/testing/scripts/chat-smoke.mjs --base https://www.mdeai.co
```

---

## Claims verified (summary)

- ✅ `map-mobile-sheet.tsx`, nav drawer testids, ChatMap greedy + mapId — disk 2026-06-02
- ✅ Copilot cards at `src/components/copilot/*-card.tsx` with correct testids
- ✅ `npm run test:e2e:mobile` script exists in package.json
- ✅ `mobile-utils.ts` partial helpers exist
- ✅ SCREEN-019/020 **screen** tasks Done with different scope than mobile pack — **collision confirmed**

## Claims not verified

- ❌ SCREEN-018 shipped / M1 complete
- ❌ viewportFit in layout.tsx
- ❌ Most planned Playwright specs (019 mobile composer, MAP-011, etc.)
- ❌ checkout-form, quick-chips, card-carousel components

---

## Final verdict

**None of the 10 executable specs are 100% correct.** Pack-weighted accuracy ≈ **52%**. Highest-quality docs are Phase 2 (**PERF-001**, **PWA-001**); highest risk are **SCREEN-019** and **SCREEN-020** due to **Done ID collisions** and wrong file paths.

**Recommended execution order after fixes:**
1. Resolve ID collision + path audit (1–2h docs)
2. Finish **SCREEN-018** to true Done (viewport, safe-area, Playwright 8/8, evidence)
3. Rename + fix **MOB-CHAT** composer spec → implement
4. **MAP-011** aligned to ChatMap + existing sheet
5. M4/M5 only after M2–M3 green

**Persona impact:** Until blockers clear, Camila's mobile concierge remains a **partial shell** — map FAB exists but drawer/sheet automation fails, keyboard/composer work is spec-only, and checkout chips aren't wired.
