Reading all relevant files in parallel.

Good data. Now reading the UX index, notes file, and the Linear MVP doc in parallel.

Let me check the current git state and verify PR #14 status before writing updates.

Good. PR #14 is still OPEN — `feat/c012-cafe-places-detail` is 5 commits ahead of `main` (tip `9956277`). Now I have everything I need. Let me write the updates.

I have all the context needed. Writing the 4 file updates now.

Now writing all 4 file updates precisely.

Now update the P1 section and gate status in `todo.md`:

Now update `tasks/INDEX.md` — add Linear codes column and fix UX-004 status:

Now update the metrics block in INDEX.md:

Now update `tasks/progres.md` — add naming cross-reference section and fix P0 snapshot:

Good — a hook updated the frontmatter with two new fields. That's fine. Now update `tasks/progres.md` P0 snapshot and add naming cross-reference:

The hooks added new files (`MVP-EXECUTION.md`, `mvp-queue.json`) and conflicting naming notes. Let me read those first before proceeding.

The hooks created new files that define a revised naming system. Let me read `MVP-EXECUTION.md` fully before finalizing.

Now I have full clarity. The new canonical system uses **spec IDs** (`EVP-013-core`, `UX-003`), not PREFIX codes (`EVT-001`, `PAY-001`). Those are deprecated `legacy_title` in the new `mvp-queue.json`. I need to fix my earlier edits that added the wrong codes.

The INDEX.md header was nicely updated by the hook with correct naming notes. Now I need to fix the P0 queue tables (remove deprecated PREFIX codes) and the Tier 1C text, then clean up `todo.md`.

Now fix the Tier 1C text in INDEX.md and the verification note:

Now clean up `todo.md` — remove the deprecated PREFIX code inline tags:

Now update `tasks/progres.md` P0 snapshot (which is still the old pre-modified state):

Now update `tasks/linear/linear.md` to reflect the new spec-ID naming direction and point to the new canonical files:

The hooks are actively rewriting multiple files with yet another naming scheme. Let me read the current state of `linear.md` and understand what the hooks are actually doing before any more edits.

The hooks have fully updated all 4 files — `todo.md`, `INDEX.md`, `progres.md`, and `linear.md` — with the correct naming system. Let me verify the final state and deliver the executive report.

All 4 files are clean and consistent. The hooks also auto-generated `MVP-EXECUTION.md`, `mvp-queue.json`, `NAMING-CLEANUP-REPORT.md`, `10-mvp-module-views.md`, and updated `linear.md`. Here is the full executive output.

---

## Executive summary

**MVP readiness: 72% · No-Go.** The platform is solid — 313/313 tests, floor exit 0, prod HTTP 200. What's missing is *proof*: no live Stripe paid ticket, event cards e2e is red, prod env is unsigned, and 7 of 9 UX tasks haven't shipped. This is a finishing problem, not an architecture problem.

**Naming is now resolved.** The four-naming-system tangle has been collapsed to one: `SPEC-ID — title` in Linear titles (PAY-001, EVT-013, UX-003, MAP-002B, etc.). The full mapping is in [`tasks/linear/NAMING-CLEANUP-REPORT.md`](tasks/linear/NAMING-CLEANUP-REPORT.md). IMP-*, EVP-*, SCREEN-* in titles, and the prefix-catalog (RNT-/AIA-/ATH-) are all deprecated.

---

## Current MVP UX status — 15%

| Task | SAN | Status | Note |
|------|-----|--------|------|
| UX-001 restore concierge | [SAN-315](https://linear.app/sanjiovani/issue/SAN-315) | 🟢 Done | PR #13 merged |
| UX-003 price parser | [SAN-316](https://linear.app/sanjiovani/issue/SAN-316) | ⚪ Todo | Bug live on prod (`rental-query-parser.ts:78`) |
| UX-002 error bubble | [SAN-320](https://linear.app/sanjiovani/issue/SAN-320) | ⚪ Todo | RUN_ERROR invisible; same PR as UX-005 |
| UX-005 thinking indicator | [SAN-319](https://linear.app/sanjiovani/issue/SAN-319) | ⚪ Todo | One partial indicator exists; needs enhancement |
| UX-009 synthetic monitor | [SAN-322](https://linear.app/sanjiovani/issue/SAN-322) | ⚪ Todo | No monitoring yet |
| UX-006 new-chat reset | [SAN-321](https://linear.app/sanjiovani/issue/SAN-321) | ⚪ Todo | Thread + map not cleared |
| UX-007 stale markers | [SAN-323](https://linear.app/sanjiovani/issue/SAN-323) | ⚪ Todo | Ghost pins after empty search |
| UX-008 Save tooltip | [SAN-324](https://linear.app/sanjiovani/issue/SAN-324) | ⚪ Todo | "SCREEN-011" string still visible |
| UX-010 unified cards | [SAN-318](https://linear.app/sanjiovani/issue/SAN-318) | 🟡 Blocked | M1 stash ready; **blocked on PR #14 merge** |
| UX-004 chip guard | [SAN-317](https://linear.app/sanjiovani/issue/SAN-317) | 🚫 Canceled | Concierge restored; mitigation not needed |

**1 of 9 active tasks done = 11% UX done.** Including UX-010's M1 stash being ready but unmerged, estimate 15%.

---

## Top blockers

| # | Blocker | Severity | Direct impact |
|---|---------|:--------:|---------------|
| 1 | **EVT-013 e2e red** — `SCREEN-006-event-card.spec.ts` times out at 120s | 🟥 Critical | Blocks EVT-001 ledger → MVP exit |
| 2 | **PAY-001** — no live Stripe paid row on prod | 🟥 Critical | Blocks EVT-001 ledger |
| 3 | **PAY-003** — webhook secrets identical | 🟥 Critical | Security gap; blocks sponsor tier |
| 4 | **PR #14 OPEN** (`feat/c012-cafe-places-detail`, 5 commits ahead) | 🟡 High | Blocks UX-010 M1; stale base for new branches |
| 5 | **Prod env unsigned** (Map ID, ADK URL, Vercel auth) | 🟡 High | MAP-002B, MAP-008B, AUTH-011 all unverified |
| 6 | **Chat UX 48/100 QA score** | 🟡 High | UX-003 parser bug live; errors invisible |

---

## Immediate next tasks (exact order)

**Two parallel tracks — start both on day 1:**

**Track A — EVT-013 (start immediately, it's red)**
```
EVT-013 / SAN-117 — diagnose SCREEN-006 event-card timeout
  → restart :3001 first (LESSONS §8: stale server causes false red)
  → verify [data-testid="event-card"] mounts when concierge returns event results
  → fix agent/card rendering branch; get e2e green
  → this unblocks EVT-002 (G3 SQL proof) → EVT-001 (ledger)
```

**Track B — UX-003 (standalone, no dependencies)**
```
UX-003 / SAN-316 — rental price parser
  → cherry-pick from .wt-ux-003-night-parser worktree
  → worktree already has the fix + tests (floor had 1/313 fail: workspaces.test.ts path issue, unrelated to parser)
  → fix workspaces.test.ts if in worktree; otherwise branch off main
  → deploy → verify prod rental query ("$500 a night" → monthly, not event hijack)
  → then: UX-002 + UX-005 same PR (error bubble + thinking indicator)
```

**After UX-003 → UX-002/005 ship:**
```
PAY-001 (G1) — HITL manual: real Stripe charge on prod → paid row → QR wallet evidence
PAY-003 (EVP-003-core) — rotate sponsor webhook secret; re-audit env var names only
Prod sign-off pass (MAP-008B + MAP-002B + AUTH-011) — one Vercel session
F32 (OPS-002) — prod smoke evidence file
```

---

## Recommended task order (sprint plan)

```
Week 1 (2026-06-02–06)
  Mon: EVT-013 diagnose + fix [PARALLEL]   UX-003 cherry-pick + merge
  Tue: EVT-013 e2e green proof             UX-002 + UX-005 same PR
  Wed: EVT-002 / G3 SQL publish proof      Prod sign-off: MAP-008B + MAP-002B + AUTH-011
  Thu: PAY-001 live Stripe payment HITL    PAY-003 rotate webhook secret
  Fri: EVT-001 ledger (needs G1+G2+G3)     UX-009 synthetic monitor

Week 2 (2026-06-09–13)
  Mon: Merge PR #14 → main (unblocks UX-010)
  Tue: F32 prod smoke evidence file
  Wed: UX-006 + UX-007 (new-chat reset + stale markers)
  Thu: UX-008 (Save tooltip — 30-min task)
  Fri: UX-010 M0 (domain-level dedup, stash already exists)

Week 3 (2026-06-16–17)
  MVP launch review gate
```

**Estimated target: 2026-06-17 (estimate, assuming no new blockers).**

---

## Missing UX gaps

1. **No prod monitoring** — UX-009 (synthetic concierge probe) is not built; there's no alert if the concierge dies silently again. Should ship in week 1 alongside error visibility.
2. **UX-010 M1 stash is not committed** — `git stash@{0}` "UX-010-M1 DomainResults dedup (6 files, +344/−103)" — one `git stash drop` loses it. Create a branch off `feat/c012-cafe-places-detail` or commit it.
3. **Café detail panel (C-012/PR #14) not on main** — Camila's "quiet cafés near Laureles" journey is 75% done but the café detail sheet is not shipped to prod users.
4. **UX-005 "thinking indicator" is an enhance, not an add** — a basic spinner already renders at `concierge-chat-messages.tsx:103-105`; the spec goal is to improve it, not start from zero. Scope is smaller than the spec implies.
5. **No proof gate on prod UX** — no smoke script fires after a deploy to confirm the concierge is reachable and cards render. UX-009 addresses this.

---

## Outdated task names / references to clean up

| Location | Stale | Correct |
|----------|-------|---------|
| `07-mvp.md` Launch table | Uses old `PAY-001 → OPS-001` prefix catalog | Cross-ref [`NAMING-CLEANUP-REPORT.md`](tasks/linear/NAMING-CLEANUP-REPORT.md) |
| `tasks/ux/INDEX.md` | Build order still uses old `IMP-0XX UX-00X` format | Consistent, but cross-ref to SAN links |
| `core-mvp-order.json` | Persona-based projects | Replaced by `mvp-queue.json` — treat as legacy |
| `progres.md` § Playwright SCREEN-006 | References `IMP-081` | Now `EVT-013 / SAN-117` |
| `.wt-ux-003-night-parser/` worktree | Worktree from earlier audit session | Either merge PR or clean up with `git worktree remove` |

---

## Suggested cleanup / refactor actions

1. **Protect UX-010 M1 stash now** — `git stash branch ux-010-m1-dedup stash@{0}` from `mdeapp/` — preserves 344 lines of dedup work.
2. **Run `linear-restore-track-labels.mjs`** after any bulk label script to ensure the UX Tasks view (`label:track:ux`) doesn't go empty again.
3. **Close/merge the `feat/c012-cafe-places-detail` PR** as the first action next sprint — it's the critical path blocker for UX-010 and everything that depends on the café dedup pattern.
4. **Drain the 12 "In Review" Linear issues** (checkout, tickets+QR, itinerary, trips, a11y screens) — hidden WIP that obscures the real launch queue.
5. **`core-mvp-order.json`** is superseded by `mvp-queue.json` — add a deprecation note or symlink, don't delete yet (referenced in INDEX.md).
6. **UX view filter fallback** — if `label:track:ux` returns empty (happens after bulk scripts), use: `project:MDEAPP (label:track:ux OR prefix:UX)`.

---

## Proof / evidence gaps needing refresh

| Gap | Where | Fix |
|-----|-------|-----|
| EVT-013 e2e green | `e2e/screens/SCREEN-006-event-card.spec.ts` | Must be green before MVP gate |
| PAY-001 paid ticket | `tasks/notes/*g1*` | Manual HITL payment + screenshot + DB row |
| PAY-003 webhook rotation | Stripe dashboard + `.env.local` | Re-audit names only; no values in repo |
| F32 prod smoke | `tasks/notes/F32-prod-smoke-*.md` | Evidence file doesn't exist yet |
| MAP-002B ADK URL | Vercel env vars | Set `ADK_GROUNDING_URL` + verify `search_places` returns data |
| MAP-008B Map ID | Vercel + prod network tab | Confirm map tiles render with `mapId` on prod |
| AUTH-011 Vercel env | Checklist file | One session with Vercel dashboard |
| UX-003 parser on prod | Prod query "rent $500 a night" | Must route to rental, not event |

---

**Files updated (2026-05-31):**
- [`todo.md`](todo.md) — new naming, PR #14 note, UX-004 canceled, SAN links
- [`tasks/INDEX.md`](tasks/INDEX.md) — new module refs, Tier 1C fix, spec-ID columns
- [`tasks/progres.md`](tasks/progres.md) — P0 snapshot with SAN links, PR #14 state
- [`tasks/linear/linear.md`](tasks/linear/linear.md) — "Three IDs (frozen)" section, MVP dashboard link
- **New:** [`tasks/MVP-EXECUTION.md`](tasks/MVP-EXECUTION.md) — canonical module-based execution dashboard
- **New:** [`tasks/linear/mvp-queue.json`](tasks/linear/mvp-queue.json) — machine-readable dependency queue
- **New:** [`tasks/linear/NAMING-CLEANUP-REPORT.md`](tasks/linear/NAMING-CLEANUP-REPORT.md) — old→new name mapping
- **New:** [`tasks/linear/10-mvp-module-views.md`](tasks/linear/10-mvp-module-views.md) — Linear filter reference