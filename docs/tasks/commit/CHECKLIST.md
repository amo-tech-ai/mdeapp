---
title: Pre-push commit checklist (C-000 … C-006)
updated: 2026-05-27
skills: ../../index-skills.md → mde-worktree-pr-flow, task-verifier
audits: ./audits/
ledger: ./COMMIT-LEDGER.md
---

# Commit checklist

Use this **before every `git add`** and **after every `git commit`**. Ledger SHA column: [COMMIT-LEDGER.md](./COMMIT-LEDGER.md).

## Global preflight (once per ship)

| # | Gate | Probe | Pass? |
|---|------|-------|-------|
| G0 | Branch not `main` | `git branch --show-current` → `ship/may27-maps-events` | ☐ |
| G1 | No secrets staged | `git diff --cached --name-only` excludes `.env.local`, `supabase/.temp/` | ☐ |
| G2 | Ledger row exists | COMMIT-LEDGER has `C-00x` before stage | ☐ |
| G3 | No `git add .` | Manual paths only | ☐ |
| G4 | Diff stop rule | `npm run commit:status` exit ≠ 2 OR split done | ☐ |

**Skills:** one PR goal, fix ≤5 files / ≤150 lines, feat ≤15 files / ≤400 lines ([00-commit-playbook.md](./00-commit-playbook.md)).

---

## C-000 — chore: gitignore Supabase temp (REVISED 2026-05-27)

> **Correction:** `ClusteredCategoryMarkers.tsx` and `map-clustering.test.ts` are **new untracked files** (not on `HEAD`). They are **C-001 maps feat**, not a lint-only fix. Tracked `src/**` at index already passes `eslint`.

| # | Gate | Probe | Pass? |
|---|------|-------|-------|
| 0.1 | Scope = 1 file | Only `.gitignore` (+ optional 1-line comment) | ☐ |
| 0.2 | Lint (repo) | `cd mdeapp && npm run lint` | ☐ |
| 0.3 | Commit | `git commit -m "chore: ignore supabase CLI temp cache (C-000)"` | ☐ |
| 0.4 | SHA in ledger | Paste `git log -1 --oneline` | ☐ |

**Do not stage:** `ClusteredCategoryMarkers.tsx`, `map-clustering.test.ts` (→ C-001).

```bash
git checkout -b ship/may27-maps-events   # if not already
git add .gitignore
git commit -m "chore: ignore supabase CLI temp cache (C-000)"
npm run lint
```

---

## C-001 — feat maps (~32 files)

| # | Gate | Probe | Pass? |
|---|------|-------|-------|
| 1.1 | Includes clustering files | `ClusteredCategoryMarkers.tsx`, `map-clustering.test.ts`, `src/platform/maps/**`, `src/components/maps/**` | ☐ |
| 1.2 | Excludes events/chat | No `src/app/api/events/`, no `use-event-search-fast-path` | ☐ |
| 1.3 | Unit tests | `npm test -- --run map-clustering map-pin normalize-tool clustered` | ☐ |
| 1.4 | Lint | `npm run lint` | ☐ |
| 1.5 | Map smokes (CONDITIONAL) | `npm run smoke:map-pins` — waive in PR if rental agent timeout | ☐ |
| 1.6 | SHA in ledger | | ☐ |

**Red flag:** >20 files — OK one domain; document in PR.

---

## C-002 — feat places (~18 files)

| # | Gate | Probe | Pass? |
|---|------|-------|-------|
| 2.1 | Places API + cards only | `src/app/api/places/`, places lib, grounded/place cards | ☐ |
| 2.2 | Unit tests | `npm test -- --run places parse-grounded places-photo` | ☐ |
| 2.3 | Field masks | Places calls use `X-Goog-FieldMask` (code review) | ☐ |
| 2.4 | SHA in ledger | | ☐ |

---

## C-003 — feat grounding (~35 files)

| # | Gate | Probe | Pass? |
|---|------|-------|-------|
| 3.1 | Mastra + ADK + grounding API | See [audits/C-003-grounding.md](./audits/C-003-grounding.md) | ☐ |
| 3.2 | Unit tests | `npm test -- --run search-intent attach-web grounding` | ☐ |
| 3.3 | Smoke | `SMOKE_GROUNDING_QUERY="list cafes in medellin" npm run smoke:grounding-attribution` | ☐ |
| 3.4 | No service-role in `src/**` | grep staged paths | ☐ |
| 3.5 | SHA in ledger | | ☐ |

---

## C-004 — feat chat shell (~18 files)

| # | Gate | Probe | Pass? |
|---|------|-------|-------|
| 4.1 | Chat + `search-tool-renders` only | No `package.json` | ☐ |
| 4.2 | Build | `npm run build` | ☐ |
| 4.3 | Gate 9 shell | `curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/` → 200 | ☐ |
| 4.4 | CopilotKit runtime | `POST /api/copilotkit` → 400 or 200 | ☐ |
| 4.5 | SHA in ledger | | ☐ |

---

## C-005 — feat events fast path (~10 files)

| # | Gate | Probe | Pass? |
|---|------|-------|-------|
| 5.1 | API + hooks + event-card | `src/app/api/events/search/`, fast-path libs/hooks | ☐ |
| 5.2 | Unit tests | `npm test -- --run event-search-fast-path event-card` | ☐ |
| 5.3 | Perf smoke | `node scripts/perf-events-chat-latency.mjs` (dev :3001) | ☐ |
| 5.4 | Gate 9 events | T1 clarify <1s, 0 copilotkit POSTs; T2 ≥1 `events/search` | ☐ |
| 5.5 | SHA in ledger | | ☐ |

**Events perf:** CONDITIONAL until Playwright in CI — script pass = partial Gate 9.

---

## C-006 — chore lockfile + docs

| # | Gate | Probe | Pass? |
|---|------|-------|-------|
| 6.1 | Chore only | `package.json`, `package-lock.json`, `.env.example`, `docs/`, `scripts/commit-status.mjs` | ☐ |
| 6.2 | `.env.example` placeholders only | no real keys | ☐ |
| 6.3 | **Floor on tip** | `npm run floor` → exit 0 | ☐ |
| 6.4 | Full smoke ladder | grounding + perf; map smokes CONDITIONAL | ☐ |
| 6.5 | SHA in ledger | | ☐ |

**Floor fail → NO-GO push.**

---

## Push gate (after C-006)

| # | Gate | Probe | Pass? |
|---|------|-------|-------|
| P1 | All ledger rows `committed` + SHA | COMMIT-LEDGER | ☐ |
| P2 | `git status` clean | no stray staged secrets | ☐ |
| P3 | `npm run floor` on tip | exit 0 | ☐ |
| P4 | Branch pushed | `git push -u origin ship/may27-maps-events` | ☐ |
| P5 | PR body | lists C-000…C-006 SHAs + CONDITIONAL waivers | ☐ |

**Push verdict:** NO-GO until P1–P3 green.

---

## What was wrong (2026-05-27 audit fix)

| Issue | Fix |
|-------|-----|
| C-000 staged **new** map files as “lint fix” | C-000 = `.gitignore` only; map files → **C-001** |
| `supabase/.temp/` not gitignored | Added to `mdeapp/.gitignore` (ship in C-000 or C-006) |
| Still on `main`, zero commits | G0 branch + first commit |
| `01-notes.md` duplicate audit block | Use this CHECKLIST + PROGRESS-TASK-TRACKER |
| Map rental smokes fail | CONDITIONAL — not blocking events fast path |

---

## Quick status (fill after run)

```text
Date: ___________
Branch: ___________
C-000: ☐  C-001: ☐  C-002: ☐  C-003: ☐  C-004: ☐  C-005: ☐  C-006: ☐
floor tip: ☐   push: ☐
```
