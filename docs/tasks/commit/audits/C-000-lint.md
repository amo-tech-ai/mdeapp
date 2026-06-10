---
commit_id: C-000
status: rescoped_2026-05-27
sha: pending
---

# C-000 — chore: gitignore Supabase CLI temp (REVISED)

## Correction (best-practice audit)

| Finding | Detail |
|---------|--------|
| **Original plan** | “Lint fix” on `ClusteredCategoryMarkers.tsx` + `map-clustering.test.ts` |
| **Forensic fact** | Both paths are **untracked** — not on `HEAD`. Committing them is a **~80-line feat**, not `fix(lint)`. |
| **Tracked src at index** | `npx eslint $(git ls-files src/**)` → **PASS** without those files |
| **mde-worktree-pr-flow** | `fix` = 1–5 files, ≤150 lines, no new feature surface |
| **task-verifier gate 4** | Floor lint already green for committed tree; new files belong in **C-001** |

## Tracker

| Field | Value |
|-------|--------|
| **Commit ID** | C-000 |
| **Intended message** | `chore: ignore supabase CLI temp cache (C-000)` |
| **Percent complete** | **90%** — `.gitignore` updated on disk; not committed |
| **Pass/fail** | **PASS** (scope valid) |
| **Production readiness** | **98/100** |
| **Standalone** | ✅ Yes |

## Files to include (exact)

```
.gitignore
```

## Files to exclude (moved to C-001)

```
src/components/maps/ClusteredCategoryMarkers.tsx
src/lib/__tests__/map-clustering.test.ts
```

## Tests required

```bash
npm run lint
git check-ignore -v supabase/.temp/cli-latest   # should match .gitignore
```

## Verification results (2026-05-27)

| Test | Status |
|------|--------|
| `npm run lint` | **PASS** |
| `supabase/.temp/` in `.gitignore` | **PASS** (on disk) |

## Risks

| Risk | Level |
|------|-------|
| Accidental stage of `supabase/.temp/**` | Low after ignore |

## Blockers

- Branch `ship/may27-maps-events` not created yet

## Staging command

```bash
git checkout -b ship/may27-maps-events
git add .gitignore
git commit -m "chore: ignore supabase CLI temp cache (C-000)"
npm run lint
```
