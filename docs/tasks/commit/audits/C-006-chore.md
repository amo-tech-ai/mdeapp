---
commit_id: C-006
status: pending_commit
sha: pending
---

# C-006 — chore + lockfile + docs

## Tracker

| Field | Value |
|-------|--------|
| **Commit ID** | C-006 |
| **Intended message** | `chore: lockfile, env example, commit-status script, docs (C-006)` |
| **Percent complete** | **90%** on disk — **0%** committed |
| **Pass/fail (scope)** | **PASS** if floor on tip |
| **Production readiness** | **90/100** |
| **Standalone** | ✅ Yes as final commit |
| **File count** | **~8–15** — OK |

## Files to include (exact)

```
package.json
package-lock.json
.env.example
scripts/commit-status.mjs
docs/ARCHITECTURE.md
```

Optional (parent repo — **not** in mdeapp git unless submodule):

- `/home/sk/mdeai/tasks/commit/COMMIT-LEDGER.md` — update SHAs in planning repo only

**Never include:**

```
.env.local
supabase/.temp/**
tmp/**
screenshots/**
*.png in repo root
```

## Files to exclude

All `src/**` application code (already in C-000–C-005).

## Tests required (full gate on tip)

```bash
npm run lint
npm run build
npm test -- --run
npm run floor
SMOKE_GROUNDING_QUERY="list cafes in medellin" npm run smoke:grounding-attribution
node scripts/perf-events-chat-latency.mjs
# CONDITIONAL — may fail:
npm run smoke:map-pins
npm run smoke:f50-pin-sync
```

## Verification results (2026-05-27)

| Test | Status |
|------|--------|
| `npm run floor` | **PASS** |
| npm audit moderate | 10 advisories (langchain) — documented, not blocker |
| Rental smokes | **FAIL** — mark **CONDITIONAL** in PR |

## Risks

| Risk | Level | Note |
|------|-------|------|
| Lockfile drift | Low | commit with package.json |
| Secret leak in `.env.example` | **Audit** — placeholders only |

## Blockers

All C-000–C-005 must be committed first so floor runs on complete tree.

## Rollback notes

Revert lockfile only if dependency bump breaks deploy — rare.

## Dependency notes

- **Requires:** C-000 through C-005  
- **Last** commit before push

## Staging command

```bash
git add package.json package-lock.json .env.example scripts/commit-status.mjs docs/ARCHITECTURE.md
git commit -m "chore: lockfile, env example, commit-status script, docs (C-006)"
npm run floor
```
