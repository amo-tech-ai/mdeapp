---
title: Discovery Beta — implementation brief
updated: 2026-06-03
companion: notes-17-discovery-beta-execution.md · notes-14.md
---

> **Summary:** Pre-flight for the launch queue — what’s open on GitHub/Linear, the exact next branch, files to touch, tests to run, and risks. Read before coding SAN-369+.

# Discovery Beta — implementation brief

Verified against disk, open PRs, Linear, and `verify:task` registry (2026-06-03).

---

## Pre-flight (verified)

| Check | Result |
|-------|--------|
| **Active branch/PR** | [PR #56](https://github.com/amo-tech-ai/mdeapp/pull/56) `ai/san-367-auth-011-wallet-guard` — **OPEN, MERGEABLE**, floor ✅, Vercel ✅ |
| **Your list #2–6** | All **Todo / not started** on Linear except **SAN-490 = In Review** (misleading — see below) |
| **Duplicate work** | `feat/search-003-restaurants` = **SEARCH-003 intelligence**, not `/restaurants` page. No `src/app/restaurants/page.tsx` anywhere. |
| **SAN-490 vs disk** | Linear **In Review**, but **no page, no PR, no `SCREEN-023-restaurant-listings.spec.ts`** on `main` — not shippable; status is ahead of reality. |
| **Commerce** | PRs #38/#39 open — **do not touch**; Discovery Beta only. |
| **Soak gate** | SAN-462 **1/3** — blocks #38 only, **not** your MAP/venue queue. |

**Note:** Your numbered list starts at **2**. Row **2 AUTH-011 / SAN-367** is still open on PR #56 (`cursor:active`). Finish that before starting MAP-008B code work.

---

## 1. Exact next implementation step

### Step A — close AUTH-011 (same branch, no new work)

```bash
cd mdeapp
git checkout ai/san-367-auth-011-wallet-guard
npm run verify:task -- AUTH-011          # full floor + console boot
# optional: tighten guest-ticket test per CodeRabbit (response.ok())
gh pr merge 56 --squash                 # after you approve
```

**Prod proof:** Camila signup/login on mdeai.co + session after refresh (manual or existing smoke). **Then** flip SAN-367 → Done in Linear.

### Step B — implement **SAN-369 / MAP-008B** (first *new* branch)

This is **mostly Vercel env + proof**, not a big feature build. Code for map ID gating is already on `main` (`google-maps-map-id.ts`, `ChatMap.tsx`).

```bash
git checkout main && git pull
git checkout -b ai/san-369-map-008b-map-id-on-production
```

**Work:**
1. Set `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` on **Vercel preview + production** (real ID, not `DEMO_MAP_ID`).
2. Confirm Maps JS key referrer allows `*.vercel.app` + `mdeai.co`.
3. Capture prod/preview proof: pins visible after a restaurant/café query (`[data-testid="map-pin"]`).
4. Write evidence file; open PR.

---

## 2. Files to change

### Step A — SAN-367 (PR #56, already done)

| File | Change |
|------|--------|
| `src/lib/supabase/middleware.ts` | Wallet exact-match guard + login redirect-loop fix |
| `e2e/auth-guard.spec.ts` | New auth guard suite |
| `package.json` | e2e script hook |

### Step B — SAN-369 / MAP-008B

| Surface | Files / actions |
|---------|-------------------|
| **Vercel** | `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID`, referrer on `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` |
| **Evidence** | `tasks/notes/MAP-008B-evidence.md` (new) |
| **Optional code** | `e2e/prod-map-pins.spec.ts` or extend `e2e/maps-007b-evidence.spec.ts` — only if env-only proof isn’t enough |
| **Skip** | Refactoring `google-maps-map-id.ts` unless prod still broken **after** env is set |

### Later (do not start yet)

| Task | Primary touch |
|------|----------------|
| **SAN-368 / MAP-002B** | Vercel `ADK_GROUNDING_URL` + `ADK_INTERNAL_TOKEN`; Cloud Run via `services/adk-grounding/scripts/deploy-cloud-run.sh`; scripts only |
| **SAN-490 / SCREEN-023** | **New** `src/app/restaurants/page.tsx` + listing components; reuse `/api/restaurants/search`; add missing `e2e/screens/SCREEN-023-restaurant-listings.spec.ts` |
| **SAN-314 / VEN-031** | Fix `e2e/screens/SCREEN-021-cafe-listings.spec.ts` (still references booking stub); extend venue e2e suite |
| **F13 persistence** | `mastra` memory / `mastra_threads` / CopilotKit `threadId` — **no Linear issue yet**; create SAN before coding |

---

## 3. Tests to run

### Before merge — SAN-367

```bash
cd mdeapp
npm run verify:task -- AUTH-011
npx playwright test e2e/auth-guard.spec.ts
npm run floor
```

### SAN-369 / MAP-008B

```bash
npm run verify:task -- MAP-008B --skip-floor   # after vitest; maps-env may fail on Places 403 locally
npm test -- --run src/lib/__tests__/google-maps-map-id.test.ts
VERIFY_MAPS_PRODUCTION=1 node --env-file=.env.local scripts/verify-maps-env.mjs
# prod/preview: query → confirm map pins in browser or Playwright
npm run floor   # before merge
```

**Known local noise:** `verify:maps-env` fails on **Places API 403** — separate from Map ID. MAP-008B AC is Map ID + pins, not Places backfill.

### Downstream (when you reach them)

| Task | Command |
|------|---------|
| MAP-002B | `ADK_GROUNDING_URL=… ADK_INTERNAL_TOKEN=… npm run verify:cloud-run-grounding` |
| SCREEN-023 | `npm run verify:task -- SCREEN-023` |
| VEN-031 | `npm run verify:task -- VEN-031` |

---

## 4. Risks / blockers

| Risk | Impact | Mitigation |
|------|--------|------------|
| **PR #56 not merged** | Auth still broken on prod for wallet/login loop | Merge Step A first |
| **Vercel secrets access** | MAP-008B / MAP-002B stall with zero code diff | Env-only PR + evidence; no src churn |
| **Places 403 in `verify:maps-env`** | `verify:task MAP-008B` fails locally | Fix GCP key permissions separately (DATA-008); don’t block Map ID ship on Places probe |
| **SAN-490 “In Review” lie** | Duplicate chat polish vs missing `/restaurants` page | Build **`/restaurants` page** per SAN-490/tasks.md row 21, not SEARCH-003 branch |
| **SCREEN-023 e2e missing** | VEN-031 blocked at end | Create spec when shipping page |
| **F13 scope drift** | Archived F13 = `ai_runs` (Done); queue F13 = **thread cold-start** | New Linear issue before work; don’t reopen observability port |
| **SAN-462 1/3** | Blocks event-card PR #38 only | Ignore for this queue |

---

## 5. PR recommendation

| Order | PR | Branch | Action |
|------|-----|--------|--------|
| **Now** | [#56 SAN-367](https://github.com/amo-tech-ai/mdeapp/pull/56) | `ai/san-367-auth-011-wallet-guard` | **Merge** after `verify:task AUTH-011` + prod auth smoke. Optional 5-line CR fix on guest-ticket test. |
| **Next** | New | `ai/san-369-map-008b-map-id-on-production` | **Env audit + evidence** (+ optional prod pin e2e). Title: `fix(maps): prod Map ID verify + pin proof (SAN-369)`. |
| **Then** | New | `ai/san-368-map-002b-adk-grounding-on-production` | Infra PR — Vercel env + Cloud Run smoke scripts; likely **no** `src/` changes. |
| **Then** | New | `ai/san-490-screen-023-restaurant-listings-page` | Feature PR — `/restaurants` page + Playwright. Reset Linear from In Review → In Progress until proof. |
| **Then** | New | `ai/san-314-ven-031-playwright-venue-screens` | Test-only PR — fix 021, add 023, run `verify:task VEN-031`. |
| **Last** | New | `ai/san-XXX-f13-thread-persistence` | Create Linear issue first; largest scope in your list. |

**Workflow:** one task → one branch → one PR → floor → merge → Linear Done **only after proof**. No unrelated cleanup. Commerce stays frozen.

---

**Bottom line:** Merge **PR #56** today. Next branch is **`ai/san-369-map-008b-map-id-on-production`** — Vercel Map ID + pin proof, not a new maps feature. Say when #56 is merged and I’ll start SAN-369 on that branch.