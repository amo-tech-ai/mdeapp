---
title: Feature-based organization plan — FINAL (June 4, 2026)
branch: docs/venues-index-canonical-order
status: REVIEW ONLY — folders created (empty + .gitkeep). No files moved/renamed/committed.
decision: Slice 4 ships as ONE task-library commit/PR; folders organized inside. No 11-PR split.
---

# Feature task taxonomy — FINAL (June 4, 2026)

**Verdict:** 20-folder feature taxonomy approved and created (empty). Files stay where they are for now — Slice 4 commits as **one** PR; physical moves happen later, **on touch**, never as a big-bang.

## 1. Final folder structure (all created, empty)

```
tasks/
├── venues/          venue browse + booking
├── restaurants/     restaurant browse
├── nightlife/       nightlife browse (SAN-491)
├── events/          event discovery (EVP-*)
├── real-estate/     rentals — Camila's vertical
├── maps/            map pins / MAP-*
├── trips/           itineraries, saved collections
├── data/            search/data (SEARCH, DATA)
├── intelligence/    memory + routing (INT-*)
├── ux/              ux + screen specs
├── mobile/          mobile layout
├── revenue/         monetization
├── payments/        Stripe / checkout
├── contest/         CTEST pack
├── testing/         QA evidence + tests
├── notes/           working notes
├── process/         PR docs, commit plans
│   └── linear/      Linear sync/meta
├── ops/             chatwoot / support ops
└── eng/             mastra / copilotkit infra specs
```

GAP folders from prior review — **resolved** (all now exist): `real-estate`, `maps`, `trips`, `process/linear`, `ops`, `eng`. Zero homeless files remain.

## 2. Mapping: current path → target folder

| Current path (files) | → Target | Risk |
|---|---|---|
| `venues/**` core+booking (~245) | `venues/` | 🟢 |
| `venues/restaurants/**` (5) + SCREEN-023 notes | `restaurants/` | 🟢 |
| nightlife / SCREEN-022 (in venues) | `nightlife/` (= Slice 2 SAN-491) | 🟡 dep on branch history |
| `events/**` (60) | `events/` | 🟢 |
| `real-estate/**` + `wireframes/real-estate` (10) | `real-estate/` | 🟢 |
| `maps/**` (3) | `maps/` | 🟢 |
| `trips/**` + `wireframes/trips` (17) | `trips/` | 🟢 |
| `data/**` (67) | `data/` | 🟢 |
| `intelligence/**` (28) | `intelligence/` | 🟢 |
| `ux/**` (105) + `wireframes/{screens,ux}` + `screens/**` | `ux/` | 🟡 |
| `wireframes/mobile/**` (19) | `mobile/` | 🟡 |
| `revenue/**` (28) | `revenue/` (+ `payments/` subset) | 🟡 |
| `contest/**` (74) | `contest/` | 🟢 |
| `testing/**` + `evidence/**` (41) | `testing/` | 🟢 |
| `notes/**` (90) | `notes/` | 🟢 |
| `PR/**` (64) + `commit/**` | `process/` | 🟢 |
| `linear/**` (45) | `process/linear/` | 🟢 |
| `chatwoot/**` (18) | `ops/` | 🟢 |
| `mastra/`, `copilotkit/` (4) | `eng/` | 🟢 |

## 3. Slice 4 commit plan (ONE PR — decided)

**One commit, not 11:**
```
docs(tasks): import feature-organized task library
```
- **IN:** all uncommitted `tasks/**` content files **except** the SAN-491 nightlife set (that's Slice 2) and the `tasks/commit/june-4/**` process docs (Slice 7).
- **OUT:** `.worktrees/`, `github`, `.env*` (gitignored); `plan/`→`docs/plan/` (Slice 3); `.mcp.json`+scripts (Slice 5/6).
- Folders above are the **target organization**; files commit from their **current paths** now. No move required to commit.

## 4. Migration plan (REVIEW ONLY — do not run yet)

Physical moves are a **separate, later PR**, run with `git mv` (preserves history) + a link-rewrite pass. Procedure when approved:
1. `git mv <current> tasks/<target>/` per mapping row (one domain at a time).
2. Rewrite internal links / `[[wikilinks]]` / `tasks/INDEX.md` references to new paths.
3. Verify no broken relative links (`grep -r "](\.\./"`), then commit per-domain.

**Policy (matches CONVENTIONS.md):** migrate **on touch, never big-bang.** Move a file into its feature folder the next time you edit it. Don't relocate 1,000 files in one PR — it's unreviewable and breaks every link at once.

## 5. Dependency order & PR sequence

All doc slices are independent (no code, no imports). Sequence:
1. ✅ Slice 1 — gitignore (`6b81fdf`)
2. Slice 3 — plan → docs/plan
3. Slice 5 — mcp config + wrappers · Slice 6 — script deletions
4. **Slice 4 — ONE task-library commit** (this plan)
5. Slice 2 — SAN-491 nightlife (stays on this branch; depends on 10 prior commits)
6. Slice 7 — process docs + CONVENTIONS.md

## 6. What was NOT done (as instructed)

- ❌ No file moved, renamed, or deleted.
- ❌ Nothing committed.
- ✅ 20 feature folders created (empty `.gitkeep`).
- ✅ Final taxonomy + full mapping + one-PR Slice-4 plan + migration procedure produced for review.

> **Next decision:** approve this taxonomy as final → I proceed to commit Slice 4 (one PR, current paths) and/or schedule the on-touch migration. Until you say so, nothing moves.
