# Design Source Tracking — Decision Report

**Date:** 2026-06-19
**Scope:** Decision report only — no code changes, no files committed, no directories deleted. This documents the design-source state and recommends an action; it does not take it.
**Why this matters (plain language):** Every Events Platform V2 issue (host dashboard, onboarding, events OS, command center, venue matchmaker) tells the builder to copy visuals from a `mdeai-design-system/...` file. Those files exist on one disk only — they are not in git. If this checkout is lost, re-cloned, or another worktree is used, the design source for the entire host track disappears. This report decides what to do about that.

---

## 1. Which design directories exist

Verified on disk at the repo root (`/home/sk/mdeai/mdeapp/`):

| Directory | Status | Tracked in git? | Role |
|---|---|---|---|
| `mdeai-design-system/` | present | **No — 0 tracked files** (`git ls-files mdeai-design-system` → empty) | **Canonical** design source referenced by live issues |
| `mdeai Design System-handoff-ARCHIVE/mdeai-design-system/` | present | **No — 0 tracked files** | **Stale / archived** earlier handoff snapshot (note `-ARCHIVE` suffix) |
| `DESIGN.MD` (repo root) | present | tracked | Token + layout system of record (oklch colors, component anatomy) |

There are **two** design trees on disk. Only the first is canonical. The second is a retired duplicate kept for reference.

---

## 2. Which one is canonical

**`mdeai-design-system/project/ui_kits/host/` is canonical.** It contains every kit the five Events Platform issues reference:

| Kit | Files (verified present) | Consumed by issue |
|---|---|---|
| Host Onboarding | `host/onboarding/HostOnboarding.jsx` (+ `index.html`) | SAN-1207 · HOST-ONBOARD-001 |
| Host Dashboard OS | `host/dashboard-os.html` + `HostDashboardOS.jsx` | SAN-1194 · HOST-DASH-001 |
| Host Events OS | `host/events-os.html` + `HostEventsOS.jsx` | SAN-884 · AIE-008B |
| Event Command Center | `host/command-center.html` + `HostCommandCenter.jsx` | SAN-885 · AIE-014B |
| Venue Matchmaker | `host/venue-matchmaker.html` + `VenueMatchmaker.jsx`, `venues-os.html` + `HostVenuesOS.jsx` | SAN-855 · VEB-000 |

The two newest issues (SAN-1194, SAN-1207) cite `mdeai-design-system/...` paths directly. The older Event-OS issues (SAN-884, SAN-885) cite their spec docs instead and reach the design via `SAN-980 · Host events OS — design screen build` — correct, but less explicit (see §6 of the next-priority report).

---

## 3. Which one is stale / archived

**`mdeai Design System-handoff-ARCHIVE/mdeai-design-system/`** is the stale duplicate. The `-ARCHIVE` suffix signals it is retired. It has 0 tracked files, so it is not competing in git history — but it is a grep/confusion hazard: a future builder searching for `HostDashboardOS.jsx` will get two hits and may copy from the wrong tree.

---

## 4. Are canonical host design files tracked?

**No.** `git ls-files mdeai-design-system` returns nothing. None of the canonical host kits is in version control. They are working-disk-only artifacts.

---

## 5. Risk if left untracked

| Risk | Severity | Effect |
|---|---|---|
| Loss on re-clone / new worktree | **High** | A fresh `git clone` or a new worktree has **no design source**. Any builder there cannot start SAN-1194/1207/884/885/855 from canonical visuals. |
| No review trail for design changes | Medium | Edits to the kits leave no diff, no PR, no history — design drift is invisible. |
| Wrong-tree copy from the stale duplicate | Medium | Two `HostDashboardOS.jsx` on disk; builder may port from `-ARCHIVE`. |
| CI / build cannot reference it | Low | Build never imports the kits (they are reference, not shipped code), so no build breakage — but no safety net either. |

The dominant risk is **continuity**: the canonical source is one `rm -rf` or one fresh clone away from gone.

---

## 6. Recommended action

Three options, in recommended order. **None is executed in this report** — each needs explicit authorization because committing or moving large untracked trees changes the repo's footprint.

### Option A — Commit the canonical design kits (recommended)

Add `mdeai-design-system/project/ui_kits/host/` (and any shared tokens it needs) to git on a dedicated docs/design branch.

- **Pros:** removes the continuity risk; design changes become reviewable; every worktree/clone gets the source.
- **Cons:** adds binary/HTML/JSX weight to the repo; needs a `.gitignore` review so only the canonical subtree (not the `-ARCHIVE` duplicate or scratch files) is staged.
- **Pre-flight:** confirm size with `du -sh mdeai-design-system/project/ui_kits/host`; confirm no secrets/large media; stage the subtree explicitly (never `git add .`).

### Option B — Archive the stale duplicate

Move `mdeai Design System-handoff-ARCHIVE/` out of the working tree (e.g. to `~/mdeai-design-archive-20260619/`, outside the repo) or formally gitignore it.

- **Pros:** removes the wrong-tree-copy hazard immediately; cheap.
- **Cons:** does nothing for the canonical-tree continuity risk — pair it with Option A.

### Option C — Update DESIGN.MD references if needed

Once Option A lands, confirm `DESIGN.MD` and the Events V2 issue bodies point at the committed canonical paths. If A is declined, add a `DESIGN.MD` note stating the kits are working-disk-only and where the source of truth lives.

---

## 7. Recommendation summary

1. **Adopt Option A** (commit canonical host kits) on its own docs/design branch — this is the durable fix.
2. **Then Option B** (archive/gitignore the `-ARCHIVE` duplicate) to kill the grep hazard.
3. **Then Option C** (verify DESIGN.MD + issue-body references) as cleanup.

**Do not execute any of these without explicit go-ahead** — committing or relocating large untracked trees is a footprint change, and the current scope is audit/planning only. This report exists so the decision can be made deliberately, not by accident.
