---
title: Linear organization — improvement backlog
created: 2026-06-05
updated: 2026-06-05
source: tasks/notes/june5/2-linear-audit.md
target_score: 68 → 85+ (workspace) · design track ~87/100 after 2026-06-05 fixes
---

# Linear improvements — action list

**Goal:** three trusted execution queues — no “pick anything open.”

| Queue | Pull from | Never pull from |
|-------|-----------|-----------------|
| **Track A — MVP gates** | [MVP view](https://linear.app/sanjiovani/view/mvp-b4f1afdff207) · `label:phase:launch` | Raw project boards |
| **Track A — Revenue** | [`INDEX-revenue.md`](../../revenue/INDEX-revenue.md) · SAN-550–557 | Improvement shells alone |
| **Track B — UX / design** | [**UX project**](https://linear.app/sanjiovani/project/ux-0ad555e403b4/overview) · [ux-tasks view](https://linear.app/sanjiovani/view/ux-tasks-0e5d9fe91725) | `screens` project as queue · Platform Infra UX dump |

> **Status:** Workspace **~72/100** (was 68). **Design track ~87/100** after 2026-06-05 session ([design audit](../../design/audit/audit-design.md)). D-chain blockers wired; Phase 0 docs + wireframes Done in Linear; disk synced to **UX** project. **Still open:** saved-view filters, checkout dedup (563), contest label scrub, 14× stale In Review, `linear.md` refresh.
> **Changes needed:** Finish remaining **P0** view + revenue dedup items (~1 h). **Safe to assign D-07 now**; D-08+ blocked correctly in Linear.

---

## Applied 2026-06-05 — design track session

> **Status:** **7/7 design-track fixes shipped** (local + Linear MCP).
> **Changes needed:** Optional — cancel **SAN-360** as duplicate of SAN-574; refresh audit scorecard in [`audit-design.md`](../../design/audit/audit-design.md).

| # | Fix | Result |
|---|-----|--------|
| 1 | Mark finished D tasks Done | SAN-567, 568, 569, 570, 571, 572 → **Done** |
| 2 | Missing local files | `docs/component-inventory.md` · `wireframe/dashboard-wireframe.html` |
| 3 | D-chain `blockedBy` | SAN-574←568/569/571 · 575←573/574 · 577←574/575 · 578←575 · 579←574 · 576←572/573/574 · 580←575–579 |
| 4 | Merge card dup | **SAN-437** → Canceled, duplicateOf **SAN-574** |
| 5 | D-09 skin-only | **SAN-575** description — route-owner table, no rebuild |
| 6 | Disk project name | **`index-design.md`** → project **UX** (not `screens`) |
| 7 | D-13 relation | **SAN-579** `relatedTo` **SAN-232** (Home Chat Chrome) |

**Open in UX project now (blocked correctly):**

| Task | Linear | Blocked by | Safe? |
|------|--------|------------|:-----:|
| D-07 shadcn install | SAN-573 | — | ✅ start now |
| D-08 VenueCard | SAN-574 | 568, 569, 571 (all Done) | ✅ after 573 |
| D-09 re-skin | SAN-575 | 573, 574 | ⛔ wait |
| D-10–D-14 | SAN-576–580 | per chain | ⛔ wait |

---

## New: UX project (2026-06-05)

> **Status:** **UX project live** — SAN-566 epic + D-01…D-14 + legacy UX/AIA issues colocated. **Disk synced:** `index-design.md` says project **UX**. Project shell still lacks description + milestones.
> **Changes needed:** Add UX project description (link to index-design.md), milestones (Phase 0–4), set project **In Progress** when D-07 starts; decide **`screens`** = route-build folder only.

You created [**UX**](https://linear.app/sanjiovani/project/ux-0ad555e403b4/overview) and bulk-moved `track:ux` issues (~50+) out of Platform Infrastructure / screens. **Correct direction** — this becomes Track B’s home.

| State | Item | In plain English |
|-------|------|------------------|
| ✅ Done | Project created; SAN-566 epic + D-01…D-14 + legacy UX-*/AIA-* moved in | All design-track tickets in one place. |
| ✅ Done | `index-design.md` project **UX** | Disk and Linear agree on home. |
| ✅ Done | Phase 0 + wireframes on disk + Linear Done (D-01–06 except D-07) | Foundation docs + explore + dashboard wireframes shipped. |
| ☐ Todo | Project description + link to `tasks/design/index-design.md` | Open UX project → see purpose + spec link. |
| ☐ Todo | Milestones: Phase 0 docs · Phase 1 wireframes · Phase 2 shadcn · Phase 3 re-skin · Phase 4 polish | Progress at a glance. |
| ☐ Todo | Set project status **In Progress** when D-07 starts | Signals active design work. |
| ☐ Todo | Decide **`screens` project fate** | **`screens`** = build this URL · **`UX`** = design system. Document the rule. |

---

## P0 — do before next agent sprint

> **Status:** **Partially done** (design track). ✅ #4 blockers · ✅ #8 SAN-437 · ❌ #1–3 views · ❌ #5–7 checkout/contest/stale In Review.
> **Changes needed:** ~1 h on views + revenue dedup + batch Done flip. **D-08+ is safe to block** — assign D-07 first.

Manual + MCP. ~1 h remaining (was ~2–3 h).

### Views (highest leverage)

> **Status:** **Not done.** `ux-tasks` and MVP view filters still unreliable.
> **Changes needed:** #1–3 below — highest leverage remaining P0 work.

| # | Action | In plain English |
|---|--------|------------------|
| 1 | **Save `ux-tasks` view filter** — `(label:track:ux OR label:scr) AND status not Done, Canceled, Duplicate`; exclude `track:contest`; optionally filter Project = UX or screens | **Problem:** the view only shows half the design work. **Fix:** one saved filter = “everything we still need to design or build for UI,” minus finished/canceled/contest noise. |
| 2 | **Add saved view “UX — active only”** on the UX project — status ≠ Done/Canceled; sort by priority then D-order | A daily standup list: “what’s open on the design track right now,” in the order we agreed on disk. |
| 3 | **Scrub MVP view trust** — remove `phase:launch` from contest issues (SAN-534, SAN-544, etc.) | **Problem:** contest tasks show up in “launch blockers” and look like P0 MVP work. **Fix:** launch label = real gates only (pay, events, maps, auth). |

### Dependencies (stop forked work)

> **Status:** **D-chain done** ✅ (#4). SAN-563 checkout dup + contest `track:ux` labels still open (#5–6).
> **Changes needed:** Dedupe checkout; strip contest labels from design queue.

| # | Action | State | In plain English |
|---|--------|:-----:|------------------|
| 4 | **D-chain `blockedBy`** — per [`index-design.md`](../../design/index-design.md) | ✅ | SAN-574→580 chain wired 2026-06-05. Agents cannot start re-skin before cards. |
| 5 | **SAN-563 → duplicateOf SAN-551** (or cancel 563 when C2 starts) | ☐ | Two checkout tickets — one owner (551). |
| 6 | **Remove `track:ux`** from SAN-534, SAN-544 | ☐ | Contest ≠ design queue. |

### Stale queue noise

> **Status:** **Partial.** SAN-437 canceled ✅. SAN-360 still open (optional cancel as dup of SAN-574). 14× In Review not batch-flipped.
> **Changes needed:** #7 batch Done; cancel **SAN-360** when convenient (#8 partial).

| # | Action | State | In plain English |
|---|--------|:-----:|------------------|
| 7 | **Batch flip Done** — 14× `screens` In Review but shipped (265, 268, 255, …) | ☐ | Queue should match merged code. |
| 8 | **Cancel SAN-360, SAN-437** — absorbed by SAN-574 (D-08) | ◐ | **437 ✅** Canceled duplicateOf 574. **360 ☐** still Backlog — cancel next. |

---

## P1 — next Linear hygiene session

> **Status:** **Queued — do after P0.** Projects still mixed (UX tickets in Platform Infra, route builds in wrong boards). Label vocabulary drifts (`phase:phase2` vs `post-mvp`). Revenue shells 559–562 are placeholders, not specs.
> **Changes needed:** One housekeeping session — move tickets to correct projects, normalize labels, split mixed-scope revenue issues, finish design epic links (#16–19). Safe to defer until P0 views + blockers work.

### Project topology

> **Status:** **Partially migrated.** UX project holds the design epic; ~162 Platform Infra issues and some route builds (`SAN-478`, MOB-*) still sit in the wrong home.
> **Changes needed:** Apply the move table below — one rule: **UX = design system**, **screens/domain = build this URL**, **Platform Infra = PR/deploy/data only**.

| From | Move / action | To | In plain English |
|------|---------------|-----|------------------|
| Platform Infrastructure | Remaining `track:ux` / UX-* | **UX** | Platform Infra should be PR/deploy/data — not a junk drawer for UI tickets. |
| screens | Route builds (`scr`, no `track:ux`) — SAN-478, 490, 491, 519, MOB-* | **screens** or domain project | “Build `/rentals` page” stays near Real Estate / Venues — it’s implementation, not the design epic. |
| screens | Anything still tagged `track:ux` | **UX** | If it’s design-track work, it belongs in the UX project. |
| Core Foundation | INT-003/004 (SAN-406/407) | **AI & Intelligence** | Gemini routing/clarify is agent work, not “core foundation” infra. |
| Events Platform | Contest / CTEST issues | `track:contest` label | Keeps “Medellín AI contest” separate from Roberto’s event launch and Andrés checkout. |
| AI & Intelligence | SAN-563 checkout UI | Merge into **SAN-551** | Same as P0 #5 — one checkout owner. |

### Labels (normalize taxonomy)

> **Status:** **Inconsistent.** Old labels (`phase:phase2`) still on some issues; `phase:launch` may include contest work; bulk moves may have stripped track labels.
> **Changes needed:** Rename/replace per table (#9–11); run restore script after bulk edits (#12). Goal: filters never lie.

| # | Action | In plain English |
|---|--------|------------------|
| 9 | Replace **`phase:phase2`** → **`phase:post-mvp`** or **`phase:mvp`** (e.g. SAN-478) | Old label name; filters and docs use `post-mvp` / `mvp` now — one vocabulary. |
| 10 | Add **`phase:post-mvp`** to D-01…D-14 (optional) | Lets you filter “design track” without opening the UX project — nice for reporting. |
| 11 | **`phase:launch`** = Cycle 1 gates only — audit monthly | Launch label is sacred: only PAY, EVT, MAP, AUTH, OPS blockers. Re-check so it doesn’t drift. |
| 12 | Run `linear-restore-track-labels.mjs` after bulk edits | Script fixes track labels if a bulk move stripped them — safety net after housekeeping. |

### Revenue program

> **Status:** **SAN-550–557 imported**; checkout pilot is one lane (SAN-551). SAN-565 mixes two scopes; shells 559–562 have no disk spec attached.
> **Changes needed:** Split SAN-565 (#13); import R2 when checkout moves (#14); absorb shells into real imports (#15). Revenue queue grows in phases — don’t import everything at once.

| # | Action | In plain English |
|---|--------|------------------|
| 13 | **Split SAN-565** — REV-C6 vs Gemini reliability | One ticket mixed “sales agent feature” + “model fallback bug” — split so each has one scope and one owner. |
| 14 | **Import R2 batch** when SAN-551 → In Progress | After checkout works, import the next revenue specs (C3, C6, C11, …) from disk — don’t wait until someone asks. |
| 15 | Absorb shells **559–562** into R2/R3/R4 imports | Placeholder tickets (nightlife VIP, restaurant reservations, etc.) aren’t specs — merge into real imported issues when their phase lands. |

### Design track (UX project)

> **Status:** **Mostly done** — score **~87/100** ([audit-design](../../design/audit/audit-design.md)). Done statuses synced; blockers wired; D-09 skin-only; local artifacts complete. Epic description still default.
> **Changes needed:** #16 optional polish; #17–19 ✅ complete.

| # | Action | State | In plain English |
|---|--------|:-----:|------------------|
| 16 | Epic **SAN-566** description — link UX project + “Track B non-blocking” | ☐ | Nice-to-have for new contributors. |
| 17 | **SAN-575 (D-09)** `relatedTo` SAN-478/490/491/519 + skin-only table | ✅ | Design input, not duplicate builds. |
| 18 | **SAN-574 (D-08)** `relatedTo` SAN-360/437; 437 canceled | ✅ | One card-system owner (574). |
| 19 | Flip **D-01…D-06** (except D-07) to Done in Linear | ✅ | Six foundation/wireframe tasks match disk. |

---

## P2 — roadmap coverage (score 43 → 70+)

> **Status:** **~60% of roadmap is disk-only** — no SAN-* ticket. Coverage score ~43/100. R2–R5 revenue, most INT tasks after INT-005, pgvector, trips blocker chain, and ops automation aren’t queued.
> **Changes needed:** Import in **small batches** (one revenue phase at a time). Every import gets `blockedBy` + link to `amo-tech-ai/mdeai` spec — no empty shells. Do after P0/P1; not blocking current sprint.

~60% of the improvement roadmap lives only in markdown, not Linear.

| Missing on Linear | Disk source | Suggested project | In plain English |
|-------------------|-------------|-------------------|------------------|
| R2–R5 revenue (C3, C6, M1–M12, …) | `INDEX-revenue.md` | Domain + Growth & Ops | Monetization work after checkout — restaurants, leads, promos, etc. — needs tickets when you’re ready to execute. |
| VEC-001–007 (pgvector) | `tasks/core/` | AI & Intelligence | Vector search / embeddings specs exist on disk but no SAN-* to track them. |
| INT-006–022 | INT INDEX | AI & Intelligence | Most intelligence MVP tasks after INT-005 aren’t in Linear yet. |
| OCL / admin automation | improvement roadmap Phase 6 | Growth & Operations | OpenClaw / ops automation planned but not queued. |
| TRP blocker chain | `tasks/trips/` INDEX | Trips | Trip features are numbered on disk but Linear has no “do B after A” blockers. |

**Import rule:** one batch per revenue phase; every new issue gets `blockedBy` + spec link to `amo-tech-ai/mdeai` — so imported tickets are executable, not empty shells.

---

## P3 — quality & docs

> **Status:** **Operator docs lag workspace.** `linear.md` still lists 11 projects / old Vitest count; audit scorecard predates UX split; some revenue issues attach to `mdeapp` repo instead of `mdeai`.
> **Changes needed:** Refresh handbook + audit (#20–21), fix attachments (#22), link home re-skin (#23), archive dead Trips legacy (#24). Low urgency but prevents wrong-repo execution.

| # | Action | In plain English |
|---|--------|------------------|
| 20 | Update [`linear.md`](../../../linear.md) — add UX project; Vitest 401→519; 12 projects | Operator handbook must match the workspace agents actually see. |
| 21 | Update [`2-linear-audit.md`](./2-linear-audit.md) scorecard — UX project migration | Audit doc said “11 projects / design in screens” — refresh scores after your UX split. |
| 22 | Remove duplicate **mdeapp** attachments on SAN-550–557 | Two spec links on one issue — agents pick the wrong repo. Keep **mdeai** only (planning lives there). |
| 23 | Link **SAN-579** to legacy home SCREEN issue if any | Home re-skin (D-13) may overlap an old SCREEN ticket — link so one surface, one build path. |
| 24 | Trips: cancel/archive **TRP-001–008** coffee-tour legacy | Old coffee-tour experiments clutter Trips; archive or cancel so TRP-009+ is the real sequence. |

---

## Per-project — what “good” looks like

> **Status:** **12 projects; 4 are clean, 8 need work.** UX and Platform Infra are the two biggest gaps — UX has tickets but no project metadata; Platform Infra is still a catch-all (~162 issues).
> **Changes needed:** Use this table when filing or moving tickets. **Rule of thumb:** if unsure, check “Still broken” column — that’s what P1 topology fixes.

| Project | Target org | Still broken | In plain English |
|---------|------------|--------------|------------------|
| [**UX**](https://linear.app/sanjiovani/project/ux-0ad555e403b4) | Design queue | No milestones/description; SAN-360 open | **Should be:** epic + next task obvious. **Now:** blockers + Done sync ✅; project metadata ☐. |
| **Core Foundation** | MVP gates (~12 active) | INT misplaced | **Should be:** auth, deploy, map gates. **Not:** agent clarify tickets. |
| **Growth & Operations** | CW + ops | OCL not imported | Chatwoot chain is clean; future ops automation still disk-only. |
| **Commerce** | SAN-551 + PAY | Only 1 issue | Fine for pilot — checkout is one big milestone until R2 splits it. |
| **Real Estate** | REAL-001→020 | Dupes; 478 in screens | Rentals module ordered on disk; `/rentals` page ticket sits in wrong project. |
| **Events** | EVT launch | Contest mixed in | Host publish + tickets vs contest features need separate filters. |
| **Discovery** | MAP module | Gates in Core | OK if documented — MAP-002B gate lives in Core, MAP-* module in Discovery. |
| **Venues** | VEN-* | Shells triaged ✓ | Cafés/restaurants/nightlife — placeholder revenue shells blocked correctly. |
| **AI & Intelligence** | INT + C13 | 563/565 shells | Revenue + agents home; a few overlap tickets still confusing. |
| **Trips** | TRP-009→027 | No blockers | Right specs, wrong execution order in Linear. |
| **screens** | Folder for route builds | 14 stale In Review | **Not a queue** — lookup table for “build this URL.” |
| **Platform Infrastructure** | PR/DATA/OPS only | 162 issues, UX drain | Biggest noise source — finish moving UX out. |

---

## Recommended views (final set)

> **Status:** **Target state defined; not fully implemented.** `ux-tasks` exists but filter is wrong; “UX — active only” view not created yet; MVP view still polluted.
> **Changes needed:** Build/fix these five views (P0 #1–2 covers the urgent two). After that, **never pick work from a raw project board** — always from a view row below.

| View name | Filter | Use when | In plain English |
|-----------|--------|----------|------------------|
| MVP / BLOCKERS | `phase:launch` + blocked-by | Cycle 1 | “What blocks launch?” — Roberto publish, Andrés pay, Camila maps. |
| Revenue pilot | Growth & Ops + Commerce + SAN-550–557 | Post-gate | “What earns money after MVP?” — checkout, Chatwoot, C13. |
| **ux-tasks** (fix) | track:ux OR scr, active, not contest | Design + builds | “What UI work is left?” — one list for humans and agents. |
| **UX project board** | Project = UX, active | Track B standup | Same as above but scoped to the UX project only. |
| screens (folder) | Project = screens, scr | Lookup | “Find the ticket for SCREEN-028” — not for picking next work. |

---

## Verification checklist (done = org score ≥ 85)

> **Status:** **3/6 passing** (was 0/6). Design track execution guards in place; workspace views + revenue dedup still lag.
> **Changes needed:** Fix P0 #1–3, #5, #7 + P3 #20 to hit 85+ workspace score.

| # | Check | State | In plain English |
|---|-------|:-----:|------------------|
| 1 | One UX view shows epic + D-01–14 + route builds, no Platform Infra noise | ☐ | Fix `ux-tasks` filter (P0 #1–2). |
| 2 | MVP view = launch gates only (no contest) | ☐ | Scrub contest from launch label (P0 #3). |
| 3 | SAN-551 is the only checkout ticket (563 dup/canceled) | ☐ | P0 #5. |
| 4 | D-chain blockers match disk order | ✅ | Wired 2026-06-05. |
| 5 | `track:ux` issues live in UX project | ✅ | Epic + D tasks in UX project. |
| 6 | `linear.md` + `index-design.md` say project **UX** | ◐ | **index-design ✅** · **linear.md ☐** (P3 #20). |

---

## Execution order reminder

> **Status:** **Track B order enforced in Linear** (blockers). Track A still leads on priority. **Next UX task: D-07 (SAN-573)** — shadcn install, unblocked.
> **Changes needed:** Run D-07, then D-08. Never pause MVP gates for design.

```
MVP gates (178, 115, 368) → SAN-550 → SAN-552 ∥ SAN-551 → R2 import
Parallel UX: D-07 (now) → D-08 → D-09 → D-11/12/13 → D-14  — non-blocking
CW: 553→557 after gates only (not after 551)
```

**In plain English:** MVP + revenue first. Design runs parallel — **D-07 shadcn** is the only open design task until it completes; Linear blocks D-09 until D-08 ships.

Full diagrams: [2-linear-audit.md § Correct implementation order](./2-linear-audit.md#correct-implementation-order).

---

## References

> **Status:** Source docs exist and are linked below. **2-linear-audit** and **audit-design** are the freshest scores; this file is the action backlog derived from them.
> **Changes needed:** Re-read **2-linear-audit** after P0/P1 and bump scores; keep **LINEAR-REVENUE.md** updated as R2+ imports land.

- Forensic audit + scores: [`2-linear-audit.md`](./2-linear-audit.md)
- Design track audit: [`audit-design.md`](../../design/audit/audit-design.md)
- Dedup session notes: [`notes-1.md`](./notes-1.md)
- Design index: [`tasks/design/index-design.md`](../../design/index-design.md)
- Revenue import log: [`tasks/revenue/LINEAR-REVENUE.md`](../../revenue/LINEAR-REVENUE.md)
- UX project: https://linear.app/sanjiovani/project/ux-0ad555e403b4/overview
