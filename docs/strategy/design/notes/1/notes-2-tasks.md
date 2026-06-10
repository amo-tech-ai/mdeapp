**Yes — all 14 disk tasks exist in Linear under epic [SAN-566](https://linear.app/sanjiovani/issue/SAN-566), and the implementation order matches.**

### Coverage (14/14)

| Disk | Linear | Linear status | Disk status |
|------|--------|---------------|-------------|
| D-01 | SAN-567 | Done | Done |
| D-02 | SAN-568 | Done | Done |
| D-03 | SAN-569 | Done | Done |
| D-04 | SAN-570 | Done | Done |
| D-05 | SAN-571 | Done | Done |
| D-06 | SAN-572 | Done | Done |
| D-07 | SAN-573 | Done | Done |
| D-08 | SAN-574 | **Todo** | Todo ← start here |
| D-09 | SAN-575 | Backlog | Blocked |
| D-10 | SAN-576 | Todo | Blocked |
| D-11 | SAN-577 | Backlog | Blocked |
| D-12 | SAN-578 | Backlog | Blocked |
| D-13 | SAN-579 | Backlog | Blocked |
| D-14 | SAN-580 | Backlog | Blocked |

No missing issues. SAN-567…580 map 1:1 to D-01…D-14.

### Implementation order — correct

```
Phase 0 (parallel docs):  D-01 ─┬─ D-05 ─┐
         D-02, D-03, D-04       └─ D-06 ─┘
Phase 2:                  D-07 (shadcn install) ✅
Phase 3:                  D-08 → D-09 ─┬─ D-11 → D-12 ─┐
                          D-08 ─┬─ D-13 (parallel)     │
                                └─ D-10 (parallel) ──────┤
Phase 4:                                              D-14
```

Linear uses the same sequencing in issue titles (Step 8/14 … 14/14), with **D-13 = “Step 10a”** and **D-10 = “Step 10b”** — both parallel after D-08, which matches `INDEX.md`.

**Dependency chain is sound:** D-08 blocks everything in Phase 3 except nothing; D-09 blocks D-11/D-12; D-14 waits on D-09…D-13.

### Minor drifts (cosmetic, not order bugs)

| Item | Notes |
|------|--------|
| **Linear status vs disk** | D-09–D-14 are `Backlog` in Linear but `Blocked` on disk; D-10 is `Todo` in Linear but `Blocked` on disk. Order is still enforced by deps — just inconsistent labels. |
| **Disk spec links** | Only SAN-573/574 point at `tasks/design/tasks/D-*.md`. D-01–06 still reference older paths in Linear descriptions. |
| **External blockers (D-09 only)** | Linear SAN-575 correctly notes `/rentals` waits on **SAN-478** and `/cafes` on **SAN-519** — not in disk `blocked_by` frontmatter, but documented in the issue body. |

### Bottom line

- **In Linear?** ✅ All 14, parent SAN-566, project UX, `track:ux`
- **Correct order?** ✅ Critical path and blockers align
- **Ready to work?** Only **SAN-574 (D-08)** — everything else correctly waits

Want me to normalize Linear statuses (Backlog → Todo for D-09–14) and add `tasks/design/tasks/D-*.md` links to all SAN-567…580 descriptions?


**Done** — the `1-next.md` queue is cleared; **SAN-574 (D-08)** is the next assignable task.

### Completed

| Step | Result |
|------|--------|
| **SAN-462 → Done** | 4/4 scheduled prod synthetics; sign-off checklist filled |
| **Prod verify** (`cb3deb2`) | GET `/` → 200 · chat-smoke PASS |
| **SAN-573 → Done** | Description updated (Sonner `theme="light"`, no ThemeProvider); links to `tasks/design/tasks/` |
| **SAN-566 + SAN-574** | Epic points at `tasks/design/tasks/INDEX.md`; SAN-574 unblocked, Todo |
| **Evidence committed** | `5e91a4d` — design queue + `d-07-shadcn-install-RESULTS.md` + `prod-live-RESULTS.md` |

### Design track

```
D-01–07 ✅  →  D-08 (SAN-574)  →  D-09 … D-14
```

**Start now:** [SAN-574](https://linear.app/sanjiovani/issue/SAN-574) — read `restaurant-card`, `cafe-result-card`, `rental-card`; spec at `tasks/design/tasks/D-08-venue-card.md`; branch `ai/san-574-d-08-shared-browse-system-venuecard-browselayout`.

Want me to open the D-08 branch and start the VenueCard shell?

**Mostly yes on structure (~92%)** — the 14 D-tasks map 1:1 to Linear under epic [SAN-566](https://linear.app/sanjiovani/issue/SAN-566) in the [UX project](https://linear.app/sanjiovani/project/ux-0ad555e403b4/issues). A few status/content drifts need a sync pass.

### What matches

| Check | Disk (`tasks/design/tasks/`) | Linear UX |
|-------|------------------------------|-----------|
| D-01…D-06 (SAN-567…572) | ✅ Done | ✅ Done |
| D-08…D-14 exist | ✅ 14 specs | ✅ 14 child issues |
| Epic progress | 7/14 | SAN-566 says 7/14 |
| D-08 blocked by SAN-462 | ✅ | ✅ `blockedBy` SAN-462 + D-02/03/05 |
| D-09 blocked by D-07 + D-08 | ✅ | ✅ `blockedBy` SAN-573, 574, 567, 571 |
| D-11 blocked by D-08 + D-09 | ✅ | ✅ |
| Route dedup (490/491/478/519) | ✅ D-09 spec | ✅ SAN-575 `relatedTo` |

### Drifts (fix these)

| Issue | Disk | Linear | Fix |
|-------|------|--------|-----|
| **SAN-573 (D-07)** | ✅ Done (PR #76 + #78) | **In Progress** | Flip → Done (reopened when PR #78 linked) |
| **SAN-462** | Soak 4/4 → unblock D-08 | **In Progress** | Formal sign-off → Done |
| **D-07 AC text** | Sonner only, no ThemeProvider | Still says `ThemeProvider` + `next-themes` | Update Linear description |
| **Canonical spec path** | `tasks/design/tasks/` | Still cites `index-design.md` only | Point epic + issues at `tasks/INDEX.md` |
| **UX project scope** | 14 design-track tasks | **~100 issues** (MOB-*, SCREEN-*, legacy UX-*) | Use **`track:ux` view** or SAN-566 children — not whole UX project |

### Linear states vs disk “Blocked”

Linear uses **Backlog / Todo** with `blockedBy` relations — not a “Blocked” status. That’s equivalent to our ☐ Blocked column:

| D | Linear status | Effectively blocked? |
|---|---------------|----------------------|
| D-08 | Todo | Yes — SAN-462 open |
| D-09–D-14 | Backlog/Todo | Yes — upstream deps |

### Bottom line

- **Queue order & dependencies:** aligned  
- **Execution truth:** **SAN-573 should be Done again** in Linear  
- **Next assignable:** SAN-574 after **SAN-462 → Done**  
- **UX project URL:** correct home, but filter to epic SAN-566 or `track:ux` — the full project list is not 1:1 with `tasks/design/tasks/` alone

Want me to flip SAN-573 → Done and patch Linear descriptions to point at `tasks/design/tasks/`?

**Done** — design work now lives in one queue under `tasks/design/tasks/`.

### New layout

```
tasks/design/tasks/
├── README.md           # rules + queue
├── INDEX.md            # master table (D-01…D-14, blockers, Linear links)
├── _legacy-map.md      # old SCR/WIRE → D-task mapping
├── D-01-ia-journey.md
├── …
└── D-14-polish-proof.md
```

**17 files** — 14 task specs + index + README + legacy map.

### What each file contains

| Section | Purpose |
|---------|---------|
| Frontmatter | `linear`, `phase`, `status`, `blocked_by`, `outputs` |
| Acceptance criteria | Done gate |
| Wireframe links | HTML + old `wireframes/` paths |
| Legacy / dedup | Which SAN-* issues to reuse, not redo |

### Pointers updated

- [`tasks/design/index-design.md`](tasks/design/index-design.md) → `tasks/INDEX.md`; D-07 ✅; 7/14 Done
- [`tasks/design/wireframes/README.md`](tasks/design/wireframes/README.md) → archive notice
- [`tasks/design/wireframes/screens/INDEX.md`](tasks/design/wireframes/screens/INDEX.md) → route-build hub only

### How to use it

| Role | Path |
|------|------|
| **Assign work** | [`tasks/design/tasks/INDEX.md`](tasks/design/tasks/INDEX.md) |
| **Execute a task** | Open matching `D-*.md` |
| **Find old SCR/WIRE** | [`tasks/design/tasks/_legacy-map.md`](tasks/design/tasks/_legacy-map.md) |

`wireframes/` stays as historical SCR/WIRE + platform shell specs — not deleted, not a second queue.

**Next:** SAN-462 sign-off → start from [`D-08-venue-card.md`](tasks/design/tasks/D-08-venue-card.md). Want Linear descriptions synced from these files?