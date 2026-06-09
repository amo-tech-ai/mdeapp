---
title: Wireframes task pack — forensic audit (screens + domain specs)
auditor: task-verifier
date: 2026-06-02
scope: tasks/wireframes/** (excludes deep re-audit of mobile/* — see audit/04-mobile-audit.md)
verdict: Not ready — master index overstates Done; ~59% pack accuracy vs disk + tests
---

# Wireframes audit — 2026-06-02

> **Persona impact:** Camila’s “product” is **`/`** (GeoChatShell), not `/chat`. The master index still marks shell tasks Done at **`/chat`** while that route is a **redirect stub** — planners think the concierge ships on two URLs; engineers ship one.

**Related:** Mobile sub-pack audit → [`04-mobile-audit.md`](04-mobile-audit.md) (52% accuracy, ID collisions, path errors).

---

## Executive summary

| Metric | Value |
|--------|------:|
| Files under `tasks/wireframes/` | 62 |
| Screen tasks in master index | 23 (SCREEN-001–023) |
| Index claim | “~78% MVP” · 11 Done |
| **Pack accuracy vs disk + Playwright (this run)** | **~59%** |
| Tasks 100% correct | **0** |
| Safe to execute without doc fixes | **0** |

### Tests run (2026-06-02)

| # | Command | Result |
|---|---------|--------|
| 1 | Route probe `curl` localhost:3001 (11 paths) | `/`, `/rentals`, `/chat` → 200; `/restaurants`, `/nightlife` → **404** |
| 2 | `playwright SCREEN-001 + 002 + 018` | **10 pass / 6 fail / 1 skipped** |
| 3 | `playwright SCREEN-005 + 009` | **3 pass / 1 fail / 2 skipped** |
| 4 | `vitest rental-card` | 3/3 pass |
| 5 | `vitest maps` | 10/10 pass |
| 6 | `node scripts/verify-scr-wire-pairing.mjs` | **6 pairing issues** |

### Pack-wide 🔴 blockers

1. **`index-screens.md` status inflation** — marks SCREEN-001/002/003 Done at 100% while specs and Playwright disagree (001 mobile fail; 018 partial on disk; 002 body still says “partial”).
2. **Wrong canonical route** — index lists primary surface as **`/chat`**; disk: `/chat` → `redirect("/")` (`mdeapp/src/app/chat/page.tsx`). Sitemap agrees: chat is **`/`**.
3. **Duplicate / divergent spec trees** — same SCREEN IDs live in `tasks/wireframes/**` and `tasks/screens/**` with **different `status:` and “Current status” bodies** (sync drift).
4. **Broken wire links in index** — WIRE-004/026 point to `venues/006-wire-venue-detail.md` and `venues/005-wire-cafe-...` but files live under **`venues/archive/`** only.
5. **`tailwind-best-practices` skill missing** — `CLAUDE.md` + DESIGN.MD reference it; **no skill on disk** (use `tailwind-responsive-ui` + DESIGN.MD until restored).
6. **Wire pairing script red** — 6 bidirectional frontmatter breaks (events domain + workflow strip).

---

## Grading key

| Grade | Spec score | Meaning |
|-------|------------|---------|
| A | 90–100 | Safe to execute as written |
| B | 80–89 | Minor fixes |
| C | 70–79 | Usable with corrections |
| D | 60–69 | Status/path drift |
| F | <60 | Blockers / false Done |

| Dot | Meaning |
|-----|---------|
| 🟢 | Verified this run (disk, curl, or test) |
| 🟡 | Fix before execute |
| 🔴 | Blocker |

---

## Master documents

### `index-screens.md` — Master index & progress tracker

**Score:** Spec 52 · Ready 22 · **48% correct** · **D** · 🔴

**What’s right 🟢**
- Gap list correctly flags missing `/restaurants`, `/nightlife`, Stripe finalize, mobile shell.
- Wave ordering (F11→EVT-01 before checkout) matches backend reality.
- SCREEN-005 “rentals broken since 2026-05-27” aligns with spec + sitemap ⚠️ SHELL.

**Errors 🔴**
| Index claim | Probe result |
|-------------|--------------|
| SCREEN-002 Done 100% at `/chat` | 🟢 Thread rail **exists** on **`/`** (`chat-nav-rail.tsx` + `/api/threads`); `/chat` is redirect only |
| SCREEN-018 Not Started 0% | 🔴 **`map-mobile-sheet.tsx` on disk**; Playwright **5/8 mobile tests fail** — should be **In Progress ~45%** |
| SCREEN-017 “no evidence file” | 🔴 **`tasks/notes/SCREEN-017-evidence.md` exists** (2026-06-02 Done) — index row stale |
| “11 Done · ~78% MVP” | 🔴 Playwright failures on 001-mobile, 018, 009; inflated Done count |
| WIRE-004 path `venues/006-wire-venue-detail.md` | 🔴 File only in **`venues/archive/`** |
| SCREEN-003 at `/chat` | 🟡 Query bar lives on **`/`** (`chat-query-bar.tsx` in GeoChatShell) |

**Real-world example:** Patricia reads “78% MVP” in standup and schedules launch — but Andrés’s checkout Playwright still fails (modal not visible), restaurants 404, and mobile sheet tests are red. The index is a **planning hazard**.

**Corrections**
1. Recompute % from **Playwright + evidence + sitemap** only; drop marketing percentages.
2. Change all `/chat` primary route labels to **`/`** (note `/chat` = alias redirect).
3. Set SCREEN-018 to In Progress; link mobile spec folder.
4. Fix wire paths to `venues/tasks/mvp/wireframes/` or un-archive wires.
5. Reconcile SCREEN-017 row with existing evidence (or downgrade evidence if prod proof missing).

---

### `README.md` + foundation docs (`00`–`06`)

**Score:** Spec 68 · Ready 55 · **65% correct** · **C** · 🟡

**Good 🟢**
- Navigation map and persona framing match PRD.
- WhatsApp/mobile deferred to Phase 2 — correct for Phase 1 English-only rule.

**Gaps vs `mde-maps` + `shadcn` + DESIGN.MD 🟡**
| Gap | Why it matters |
|-----|----------------|
| `00-foundations.md` uses **`bg-900` / `bg-800` gray scale** | Violates DESIGN.MD oklch tokens + shadcn rule “no raw gray shades” |
| No **`mapId` on every `<Map>`** callout | mde-maps hard rule; missing from foundations map section |
| No **`X-Goog-FieldMask`** mention in discovery wires | Cost + correctness for Places enrichment |
| **`tailwind-best-practices` referenced in CLAUDE.md but absent** | Load **`tailwind-responsive-ui`** + DESIGN.MD §5 instead |
| Tablet breakpoint “left 280 · center · right 40%” | DESIGN.MD uses **`xl:` 1280 3-panel** — reconcile numbers |

**Corrections**
1. Add “Implementation source of truth” box: **DESIGN.MD → sitemap.md → disk → skills (`shadcn`, `mde-maps`)**.
2. Replace gray tokens in foundations with oklch semantic names from `globals.css`.
3. Add mde-maps checklist snippet to `03-chat-maps-workspace.md`.

---

### `screens/SCR-WIRE-PAIRING-CHECKLIST.md` + verify script

**Score:** Spec 70 · Ready 40 · **58% correct** · **D** · 🟡

**Probe:** `node scripts/verify-scr-wire-pairing.mjs` → **6 issues** (exit 1):

- Missing wire file link on workflow strip → `009-wire-rental-search.md`
- One-way pairs: events `003/004/015` wires ↔ scr files
- EVP-014 host events wire ↔ scr

**Corrections:** Fix frontmatter `wireframes:` arrays; re-run script until exit 0 before claiming pairing complete.

---

## Platform shell specs (`tasks/wireframes/screens/`)

| Task | Spec | Ready | % | Grade | Dot | Safe? |
|------|-----:|------:|--:|-------|-----|-------|
| SCREEN-001 Home chrome | 72 | 55 | 68% | C | 🟡 | No |
| SCREEN-002 Nav rail | 78 | 60 | 72% | C | 🟡 | No |
| SCREEN-003 Query bar | 75 | 58 | 70% | C | 🟡 | No |
| SCREEN-004 Workflow strip | 80 | 65 | 78% | B | 🟢 | Almost |
| SCREEN-017 Login polish | 70 | 45 | 62% | C | 🟡 | No |
| SCREEN-017 Workflow strip (dup ID!) | 80 | 65 | 75% | C | 🟡 | No |
| SCREEN-018 Mobile shell | 58 | 30 | 55% | D | 🔴 | No |
| SCREEN-019 Empty/error | 85 | 75 | 82% | B | 🟢 | Yes* |
| SCREEN-020 A11y pass | 85 | 75 | 82% | B | 🟢 | Yes* |

\*Cross-cutting Done tasks — re-verify on each UI change; not re-proven this run beyond spec + evidence paths.

---

### SCREEN-001 — Home Chat Chrome

**% correct: 68%** · Grade **C** · 🟡

**Verified 🟢**
- `/` renders `GeoChatShell` + `MapContextProvider` — `page.tsx` probe.
- Playwright desktop tests in `SCREEN-001-home-chrome.spec.ts` pass (subset of run).

**Not verified / stale 🔴**
- Frontmatter **`status: Done`** vs body **“In Progress — visual + Playwright gate not complete”** — internal contradiction in same file.
- **Mobile test failed** in combined Playwright run (`chat canvas + center panel at 390px`).
- Evidence split: `tasks/evidence/SCREEN-001-evidence.md` vs wireframe pointer `../notes/SCREEN-001-evidence.md` — path inconsistency.

**Real-world example:** Camila loads `/` on phone — index says Done, but mobile Playwright fails; she may hit layout overflow or missing mobile shell polish.

**Corrections:** Pick one status; fix mobile Playwright; unify evidence path; align with SCREEN-018 dependency.

---

### SCREEN-002 — Chat Nav Rail + Thread List

**% correct: 72%** · Grade **C** · 🟡

**Verified 🟢**
- `chat-nav-rail.tsx` implements thread list, `nav-thread-item`, `/api/threads` — disk grep 2026-06-02.
- `tasks/notes/SCREEN-002-evidence.md` documents ThreadNavProvider + Playwright spec.
- Playwright **SCREEN-002-nav-rail** tests **passed** in this run.

**Stale in spec body 🟡**
- “**partial** — logo + New chat only” — **false** vs disk; update “Current status”.
- **`path: /`** in frontmatter but index still says `/chat`.
- **`deferred: true`** in frontmatter while **`status: Done`** — contradictory.

**Corrections:** Refresh body to match shipped thread list; resolve deferred vs Done; fix index route column.

---

### SCREEN-003 — Chat Query Bar

**% correct: 70%** · Grade **C** · 🟡

**Verified 🟢:** `chat-query-bar.tsx` on disk; Playwright `SCREEN-003-query-bar.spec.ts` exists; evidence in `tasks/evidence/`.

**Issues 🟡:** Listed under `/chat` in index; implemented on **`/`**. No mde-maps/shadcn frontmatter (minor).

---

### SCREEN-004 — Workflow Progress Strip

**% correct: 78%** · Grade **B** · 🟢

**Verified 🟢:** Host wizard strip; evidence + Playwright `SCREEN-004-workflow-strip.spec.ts`; sitemap `/host/event/new` LIVE.

**Issue 🟡:** Duplicate **SCREEN-017** ID used for **workflow strip** file (`017-scr-workflow-progress-strip.md`) vs login polish — **ID namespace collision** within wireframes folder.

---

### SCREEN-017 — Login / Signup Polish

**% correct: 62%** · Grade **C** · 🟡

**Verified 🟢**
- Pages exist; `tasks/notes/SCREEN-017-evidence.md` with Browser MCP notes.
- Index wrongly said “no evidence” — **stale**.

**Missing 🔴**
- **`playwright_spec: SCREEN-017-*.spec.ts`** — **no file on disk** (glob 0).
- Frontmatter **`percent: 100`** + **`status: In Review`** while body says **partial**.
- shadcn skill listed 🟢 — appropriate; add **`web-design-guidelines`** pass for oklch contrast.

**Real-world example:** Andrés hits login before checkout — evidence says sparkle logo shipped, but without Playwright, regressions on `?next=` redirect won’t CI-gate.

**Corrections:** Add Playwright spec or remove from frontmatter; align status with evidence; run prod proof per `mdeai-testing.mdc`.

---

### SCREEN-018 — Mobile Responsive Shell

**% correct: 55%** · Grade **D** · 🔴

**See also:** [`04-mobile-audit.md`](04-mobile-audit.md) (full mobile pack).

**Verified 🟢:** `map-mobile-sheet.tsx`, nav drawer testids, Playwright spec exists.

**Blockers 🔴:** Index **0% Not Started** is false; **5/8 Playwright mobile tests fail**; no viewport export in `layout.tsx`; duplicate spec in `tasks/screens/` with **Not Started**.

---

### SCREEN-019 / SCREEN-020 — Cross-cutting

**% correct: ~82%** · Grade **B** · 🟢

**Verified 🟢:** Done in `tasks/screens/`; evidence files; Playwright `SCREEN-019-empty-error`, `SCREEN-020-a11y` exist.

**Conflict 🟡:** Mobile pack reused SCREEN-019/020 IDs for **different features** — see mobile audit. Master index must distinguish **platform cross-cutting** vs **mobile MOB-*** tasks.

---

## Domain specs (wireframes folders)

### Real estate — SCREEN-005 Rental Card Polish

**% correct: 64%** · Grade **D** · 🔴

**Verified 🟢**
- `rental-card.tsx` under `src/components/copilot/`; Playwright `SCREEN-005-rental-card.spec.ts` **3 passed** this run.
- Frontmatter **`status: Partial`** + revert note — honest.

**Index drift 🔴:** Index says **40% In Progress**; spec says Partial — OK-ish. Index path **`/rentals`** vs spec **`path: /`** — cards render in **chat on `/`**, not rentals page shell.

**mde-maps 🟡:** Spec lacks pin-sync probe steps (`verify:rental-pins`, F50).

**Corrections:** Clarify primary surface `/` chat vs `/rentals` browse; add F49/F50 as hard gates in DoD.

---

### Real estate — SCREEN-008 Schedule Viewing

**% correct: 80%** · Grade **B** · 🟢

**Verified 🟢:** Evidence + Playwright `SCREEN-008-schedule-viewing`; modal on disk.

**Path 🟡:** Wire paired via trips checkout wire — document in index (already noted in screens INDEX).

---

### Trips — SCREEN-009 Booking Checkout

**% correct: 58%** · Grade **D** · 🔴

**Verified 🟢:** `SCREEN-009-checkout.spec.ts` exists; evidence file; index notes EVT-01 blocker.

**Playwright 🔴:** Desktop buy flow — **`booking-checkout-modal` not visible** after CTA click (1 fail, 2 skipped).

**Real-world example:** Andrés taps Buy on event detail — index says 60% In Progress; E2E proves the modal path still breaks in automation (likely slug/fixture or modal mount).

**Corrections:** Fix failing spec or UI; keep **`status: Partial`** until EVT-01 + green Playwright; add Stripe webhook probe to DoD.

---

### Trips — SCREEN-012 / 013 / 014

| Task | % | Grade | Dot | Notes |
|------|--:|-------|-----|-------|
| SCREEN-011 Saved (`014-scr` file) | 75% | C | 🟢 | Page LIVE; evidence; Playwright exists |
| SCREEN-012 Trips dashboard | 60% | D | 🟡 | Shell ⚠️; evidence pre-auth; Playwright exists |
| SCREEN-013 Itinerary | 60% | D | 🟡 | Same pattern |

**Corrections:** Add auth-gated Playwright; align index “55%” with spec Partial status.

---

### Events domain (`events/003-*`, `004-*`)

**% correct: 70%** · Grade **C** · 🟡

**Verified 🟢:** README flow diagram matches buyer/host split; archive specs under `tasks/events/wireframes/`.

**Pairing script 🔴:** One-way wire ↔ scr links — fix frontmatter before treating README as authoritative.

---

### Venues / SCREEN-021 / 022 / 023 (referenced from index)

| Task | % | Grade | Dot | Key issue |
|------|--:|-------|-----|-----------|
| SCREEN-021 Café | 72% | C | 🟢 | Phase A.5 evidence; Playwright `SCREEN-021-cafe-listings.spec.ts` |
| SCREEN-022 Nightlife | 45% | F | 🔴 | Playwright spec exists **without `/nightlife` page** (404 probe) |
| SCREEN-023 Restaurants | 55% | D | 🔴 | Evidence + spec in `venues/tasks/mvp/`; **no page, no Playwright spec** |

**Real-world example:** Tourist searches restaurants — index says spec “100% In Review” but **`curl /restaurants` → 404**; wire is done, product surface missing.

**Corrections:** Create routes before marking spec %; add `mde-maps` + `shadcn` to venue scr frontmatter; fix WIRE-010/027 paths in index.

---

### Maps — SCREEN-010 (index only; spec in `tasks/maps/`)

**% correct: 65%** · Grade **C** · 🟡

Index Not Started 0% — consistent. Missing link from wireframes index to `tasks/maps/wireframes/`. Add **mde-maps** skill to any MAP spec touched from wireframes hub.

---

## Mobile sub-pack (`tasks/wireframes/mobile/`)

**Do not duplicate here.** Full forensic report: **[`04-mobile-audit.md`](04-mobile-audit.md)** — **52% pack accuracy**, SCREEN-019/020 ID collision with platform Done tasks, wrong component paths.

**Cross-link fix:** `index-screens.md` SCREEN-018 row must match mobile audit (In Progress, not 0%).

---

## Skills & standards — what’s missing

| Skill / standard | Required for wireframe work | Status in pack |
|------------------|----------------------------|----------------|
| **`task-verifier`** | Done gates, anti-fake-done | 🟡 Referenced implicitly; most scr files lack `verified_against:` |
| **`mde-maps`** | mapId, field masks, vis.gl, gestureHandling | 🔴 Not in frontmatter for map-heavy wires (`03-chat-maps`, MAP-011 mobile) |
| **`shadcn`** | Base UI sheets, semantic tokens, no gray-* | 🟡 Listed on some scr; foundations doc violates tokens |
| **`tailwind-best-practices`** | CLAUDE.md cites it | 🔴 **Skill not on disk** — use `tailwind-responsive-ui` + DESIGN.MD |
| **`responsive-design`** | Layout + Playwright viewport proof | Use `references/testing-playwright.md` |
| **DESIGN.MD** | Breakpoints, bottom-sheet, oklch | 🟡 README points to blueprint; index ignores DESIGN §5 mobile sheet |
| **SCREEN-TESTING-STANDARD §6** | Evidence + Playwright + floor | 🟡 Many scr list tests; index ignores failures |

---

## Duplicate spec trees (sync debt)

| Location | Role |
|----------|------|
| `tasks/wireframes/screens/*.md` | Wireframe-era copies |
| `tasks/screens/*.md` | Canonical per `screens/INDEX.md` hub |
| `tasks/venues/tasks/mvp/wireframes/` | Venue scr 005–008, 023 |
| `tasks/events/wireframes/` | Event scr/wire |

**Rule:** One **canonical** scr per SCREEN ID; wireframes copies should symlink or redirect — not divergent `status:`.

**Probe example:** SCREEN-018 — wireframes mobile copy **In Progress**; `tasks/screens/018` **Not Started**; index **0%** — three truths.

---

## Summary scorecard (all tracked screens)

| ID | Title | Index % | Audit % | Dot | Top correction |
|----|-------|--------:|--------:|-----|----------------|
| 001 | Home chrome | 100 | 68 | 🟡 | Fix mobile Playwright; resolve Done vs body |
| 002 | Nav rail | 100 | 72 | 🟡 | Update stale “partial” body; `/` not `/chat` |
| 003 | Query bar | 100 | 70 | 🟡 | Route label |
| 004 | Workflow strip | 100 | 78 | 🟢 | Resolve duplicate SCREEN-017 ID file |
| 005 | Rental cards | 40 | 64 | 🔴 | `/` vs `/rentals`; F49/F50 gates |
| 006 | Event card | 100 | 80 | 🟢 | — |
| 007 | Venue sheet | 100 | 82 | 🟢 | Path `sheets/venue-detail-sheet.tsx` |
| 008 | Schedule viewing | 100 | 80 | 🟢 | — |
| 009 | Checkout | 60 | 58 | 🔴 | Playwright red; EVT-01 |
| 010 | Map exploration | 0 | 65 | 🟡 | Spec in maps/; link hub |
| 011 | Saved | 100 | 75 | 🟢 | — |
| 012 | Trips | 55 | 60 | 🟡 | Auth Playwright |
| 013 | Itinerary | 55 | 60 | 🟡 | Same |
| 014 | Event detail | 100 | 85 | 🟢 | — |
| 015 | Tickets | 65 | 62 | 🟡 | Blocked on 009 |
| 016 | Host wizard | 100 | 85 | 🟢 | — |
| 017 | Login | 100 | 62 | 🟡 | Playwright missing; index stale |
| 018 | Mobile shell | 0 | 55 | 🔴 | See mobile audit |
| 019 | Empty/error | 100 | 82 | 🟢 | Don’t collide with MOB tasks |
| 020 | A11y | 100 | 82 | 🟢 | Don’t collide with MOB tasks |
| 021 | Café | 70 | 72 | 🟢 | Phase B pending |
| 022 | Nightlife | 0 | 45 | 🔴 | Page 404; spec exists |
| 023 | Restaurants | 100 | 55 | 🔴 | Page 404; no e2e |

**Weighted pack accuracy (index + specs vs probes): ~59%**

---

## Critical fixes (priority order)

1. **Stop false Done** — Reconcile index % with Playwright + evidence + sitemap (001-mobile, 009, 018 fail today).
2. **Canonical route `/`** — Replace `/chat` as primary in index, README nav map, and wave tables.
3. **Resolve ID collisions** — SCREEN-017 duplicate files; mobile SCREEN-019/020 vs platform Done; adopt SAN-* or MOB-* per `linear.md`.
4. **Fix wire paths** — Point index wire table at live files (`venues/tasks/mvp/wireframes/`, not archive).
5. **Run pairing script to green** — `node scripts/verify-scr-wire-pairing.mjs`.
6. **Add missing skills to frontmatter** — `mde-maps`, `shadcn`, `tailwind-responsive-ui`, `responsive-design`.
7. **Restore or replace `tailwind-best-practices`** — or update CLAUDE.md pointer.
8. **Deduplicate spec trees** — single canonical `tasks/screens/` + wireframes as wires-only or symlinks.

---

## Best practices going forward

1. **Single status source:** `index-screens.md` generated from scr frontmatter + Playwright CI badge — not hand-edited %.
2. **Every scr frontmatter:** `verified_against: YYYY-MM-DD`, `playwright_spec` must exist or be `planned`.
3. **Map tasks:** append mde-maps checklist (mapId, field mask, MCP doc cite) to DoD.
4. **UI tasks:** shadcn semantic colors only — reject foundations-style `bg-900`.
5. **Done gate:** SCREEN-TESTING-STANDARD §6 + `mdeai-testing.mdc` localhost **and** prod proof.
6. **Wireframes vs implementation:** wires describe UX; scr files cite **actual** component paths from disk grep.

---

## Final verdict

**Nothing in `tasks/wireframes/` is 100% correct as an execution pack.** The strategic content (waves, personas, competitor patterns) is **useful (~65–70%)**; the **tracker (`index-screens.md`) is ~48% accurate** and **dangerously overstates Done**.

**Safe to execute without fixes:** cross-cutting **SCREEN-019/020** only, and only for regression work — not as green light for new UI without re-probing.

**Stop condition:** 🛑 Fix index inflation + route canonicalization + Playwright reds before Wave 1 implementation queue is treated as sprint-ready.

---

## Commands to re-run this audit

```bash
# Routes
for p in / /chat /rentals /restaurants /nightlife /events/reina-de-antioquia-2026-finals; do
  curl -s -o /dev/null -w "$p -> %{http_code}\n" -L "http://localhost:3001$p"
done

# Core Playwright
cd mdeapp
PW_SKIP_WEBSERVER=1 npx playwright test e2e/screens/SCREEN-001-home-chrome.spec.ts \
  e2e/screens/SCREEN-002-nav-rail.spec.ts e2e/screens/SCREEN-018-mobile-shell.spec.ts \
  e2e/screens/SCREEN-009-checkout.spec.ts --project=chromium

# Pairing
node /home/sk/mdeai/scripts/verify-scr-wire-pairing.mjs

# Floor
cd mdeapp && npm run floor
```
