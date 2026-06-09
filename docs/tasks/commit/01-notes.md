# Ship notes — maps + events + grounding (May 27)

**Canonical checklist:** [CHECKLIST.md](./CHECKLIST.md) · **Tracker:** [PROGRESS-TASK-TRACKER.md](./PROGRESS-TASK-TRACKER.md) · **Ledger:** [COMMIT-LEDGER.md](./COMMIT-LEDGER.md)

**Situation:** ~110 paths vs `a4c1ecb`. Floor **PASS** on disk. **C-000 rescoped** (2026-05-27): first commit is `.gitignore` only — map “lint” files are new and belong in **C-001**.

**Next command:**

```bash
cd /home/sk/mdeai/mdeapp
git checkout -b ship/may27-maps-events
git add .gitignore
git commit -m "chore: ignore supabase CLI temp cache (C-000)"
npm run lint
```

---

## Strategy

1. **Branch** — don’t commit on `main` locally; use one integration branch, merge via PR.
2. **Bottom-up** — platform/libs → maps UI → grounding → chat wiring → events → chore.
3. **Verify after each commit** — at least `lint` + targeted `npm test`; full `npm run floor` before push.
4. **Never commit** — `supabase/.temp/`, `.env.local`, `tmp/`.

```bash
cd /home/sk/mdeai/mdeapp
git checkout -b ship/may27-maps-events
```

---

## Commit 0 — gitignore (REVISED)

| Files | Why |
|-------|-----|
| `.gitignore` | Add `supabase/.temp/` — CLI cache must never stage |

Map clustering files → **Commit 1** (they are new untracked feat, not lint-only).

```bash
git add .gitignore
git commit -m "chore: ignore supabase CLI temp cache (C-000)"
npm run lint
```

---

## Commit 1 — Maps platform + clustering (~20 files)

**Scope:** Map pins, clustering, normalize output — no events fast path yet.

```
src/lib/map-clustering.ts
src/lib/map-ui-summary.ts
src/lib/maps-deep-links.ts
src/platform/maps/map-context.tsx
src/platform/maps/normalize-tool-output.ts
src/platform/maps/map-pin-filters.ts
src/platform/maps/__tests__/*
src/components/maps/**  (all new map components)
src/components/maps/ChatMap.tsx
src/hooks/use-is-lg-up.ts
e2e/helpers/maps-layout.ts
e2e/maps-layout-mobile.spec.ts
scripts/smoke-map-chat-pins.mjs
scripts/smoke-f50-pin-sync.mjs
```

```bash
npm test -- --run map-clustering map-pin normalize-tool
git commit -m "feat(maps): category markers, clustering, and pin sync (C-001)"
```

---

## Commit 2 — Places client + photo proxy (~15 files)

**Scope:** Google Places + grounded card primitives (no full chat shell yet).

```
src/mastra/lib/google-places-client.ts
src/mastra/lib/google-places-client.test.ts
src/mastra/lib/places-retry.ts
src/mastra/lib/__tests__/places-retry.test.ts
src/lib/places-display.ts
src/lib/places-photo-proxy.ts
src/lib/places-photo-rate-limit.ts
src/lib/__tests__/places-photo-rate-limit.test.ts
src/app/api/places/photo/route.ts
src/app/api/places/photo/route.test.ts
src/components/copilot/grounded-place-card.tsx
src/components/copilot/place-result-card.tsx
src/components/copilot/__tests__/grounded-place-card.test.ts
src/components/copilot/__tests__/place-result-card.test.ts
src/lib/parse-grounded-tool-result.ts
src/lib/normalize-tool-envelope.ts
src/lib/__tests__/parse-grounded-tool-result.test.ts
```

```bash
npm test -- --run places google-places parse-grounded
git commit -m "feat(places): Places client, photo proxy, and grounded cards (C-002)"
```

---

## Commit 3 — Grounding + search router (~18 files)

**Scope:** ADK + MAP-002D backend; concierge prompt/router only (no UI fast path).

```
src/mastra/lib/adk-grounding-client.ts
src/mastra/lib/adk-grounding-types.ts
src/mastra/lib/map-adk-grounding-pins.ts
src/mastra/lib/attach-web-grounding.ts
src/mastra/lib/search-intent-router.ts
src/mastra/lib/search-grounding-quota.ts
src/mastra/lib/search-grounding-types.ts
src/mastra/lib/grounding-location-bias.ts
src/mastra/lib/__tests__/*  (grounding-related only)
src/mastra/tools/search-web-grounded-events.ts
src/mastra/tools/__tests__/search-web-grounded-events.test.ts
src/mastra/tools/search-grounded-places.ts
src/mastra/tools/index.ts
src/mastra/agents/concierge.ts
src/mastra/agents/__tests__/concierge.test.ts
src/app/api/grounding/event-web/route.ts
src/app/api/copilotkit/route.ts
scripts/smoke-grounding-attribution.mjs
scripts/smoke-search-grounding.mjs
scripts/verify-*.mjs  (grounding only)
e2e/maps-grounding.spec.ts
```

```bash
npm test -- --run attach-web-grounding search-intent search-web-grounded concierge
npm run smoke:grounding-attribution
git commit -m "feat(grounding): ADK client, search router, and web events tool (C-003)"
```

---

## Commit 4 — Chat shell + tool renders (~12 files)

**Scope:** 3-panel layout, map↔chat sync, shared `search-tool-renders` (dedupe logic).

```
src/components/chat/geo-chat-shell.tsx
src/components/chat/chat-map-panel.tsx
src/components/chat/chat-center-panel.tsx
src/components/chat/chat-results-column.tsx
src/components/chat/chat-filter-copilot-instructions.tsx
src/components/chat/map-mobile-sheet.tsx
src/components/chat/__tests__/chat-results-column.test.ts
src/components/copilot/search-tool-renders.tsx
src/components/copilot/map-ui-sync.tsx
src/components/copilot/event-web-citation-fetch.tsx
src/components/copilot/event-web-citation-sync.tsx
src/components/copilot/web-citation-list.tsx
src/components/copilot/__tests__/web-citation-list.test.ts
src/lib/web-citations-display.ts
src/platform/copilot/mastra-tool-action-names.ts
e2e/screens/SCREEN-016-host-wizard.spec.ts  (if host unrelated, move to C-006)
```

```bash
npm test -- --run chat-results
git commit -m "feat(chat): Mindtrip shell, tool renders, and results dedupe (C-004)"
```

---

## Commit 5 — Events perf + panel (~14 files)

**Scope:** Fast path, EventCard `shrink-0`, panel — depends on C-004 shell.

```
src/app/api/events/search/route.ts
src/hooks/use-event-search-fast-path.ts
src/lib/event-clarify-copy.ts
src/lib/event-search-fast-path.ts
src/lib/__tests__/event-search-fast-path.test.ts
src/components/chat/concierge-chat-input.tsx
src/components/chat/chat-query-bar.tsx
src/components/chat/event-results-panel.tsx
src/components/chat/event-search-results-context.tsx
src/components/copilot/event-card.tsx
scripts/perf-events-chat-latency.mjs
```

```bash
npm test -- --run event-search-fast-path event-card
node scripts/perf-events-chat-latency.mjs
git commit -m "feat(events): fast-path search, instant clarify, and panel cards (C-005)"
```

---

## Commit 6 — Chore + lockfile + docs (~5 files)

**Scope:** Deps, env template, commit helper, architecture doc.

```
package.json
package-lock.json
.env.example
scripts/commit-status.mjs
docs/ARCHITECTURE.md
```

```bash
npm run floor    # full gate once
git commit -m "chore: deps, env.example, commit:status, and docs (C-006)"
```

---

## Before push checklist

| Step | Command |
|------|---------|
| Ledger | Mark C-000…C-006 + SHAs in [`tasks/commit/COMMIT-LEDGER.md`](tasks/commit/COMMIT-LEDGER.md) |
| Full gate | `npm run floor` |
| Smokes | `smoke:map-pins`, `smoke:f50-pin-sync`, `smoke:grounding-attribution` |
| Events perf | `node scripts/perf-events-chat-latency.mjs` |
| Optional e2e | `npm run test:e2e:screens -g "SCREEN-006"` |
| Push | `git push -u origin ship/may27-maps-events` |
| PR | One PR with commit list → [amo-tech-ai/mdeapp](https://github.com/amo-tech-ai/mdeapp) |

---

## If you want fewer commits (still safe)

| Merge | Commits |
|-------|---------|
| **3-commit PR** | C-0 lint → **C-1 maps+places** (1+2) → **C-2 grounding+chat+events** (3+4+5) → C-3 chore |
| **2-commit PR** | C-0 lint → **C-1 all product code** → C-2 chore (harder rollback) |

Prefer **6 commits** on one branch: each slice stays reviewable and `git bisect` works.

---

## What “ensure everything works” means

- **After C-001–C-002:** app may not fully boot (missing chat wiring) — that’s OK mid-stack.
- **After C-004:** `npm run dev` + rentals/grounding paths should work.
- **After C-005:** events clarify + Music chip perf script must pass.
- **After C-006:** `floor` green = safe to push.

I can execute **C-000** (lint fix) and the first commit staging commands if you want this split applied on disk next.


**Last commit on GitHub** ([amo-tech-ai/mdeapp](https://github.com/amo-tech-ai/mdeapp.git)):

| Field | Value |
|--------|--------|
| **SHA** | `a4c1ecb` |
| **Date** | **2026-05-25** — 18:01:51 CDT / **23:01:51 UTC** |
| **Author** | amo-tech-ai |
| **Message** | `Update grounding smoke for compact attribution and Place guard.` |
| **Branch** | `main` (16 commits total on repo) |

Verified with `git fetch origin main` and the GitHub API — local `origin/main` matches.

**Local vs remote:** Your machine still has a **large uncommitted** diff (maps, events fast path, EventCard fix, etc.). None of that is on GitHub until you push after the ledger commits in [`tasks/commit/COMMIT-LEDGER.md`](tasks/commit/COMMIT-LEDGER.md).

**Rough gap:** ~2 days since last push (today 2026-05-27 per session context).


> **Superseded for day-to-day tracking** — use [INDEX.md](./INDEX.md) → [COMMIT-LEDGER.md](./COMMIT-LEDGER.md) + `cd mdeapp && npm run commit:status`.  
> This file is a **2026-05-27 audit snapshot** only.

## Git scope (important)

| Path | Git? |
|------|------|
| **`/home/sk/mdeai/mdeapp/`** | Yes — `main` tracking `origin/main` |
| **`/home/sk/mdeai/`** (tasks/, changelog, screenshots) | **No repo** — Cursor sees it; **GitHub does not** |

Branch: **`main...origin/main`** (even; last push = `a4c1ecb`).

---

## Last commit on GitHub (`a4c1ecb`, 2026-05-25)

**Message:** `Update grounding smoke for compact attribution and Place guard.`

**Changed:** 1 file — `scripts/smoke-grounding-attribution.mjs` (+26/−7)  
**Not in that commit:** MAP-030/031/009, clustering, Places client, event dedupe, search grounding, ~98 local files.

---

## Working tree (`mdeapp`)

| | Count |
|---|------:|
| Modified (unstaged) | **39** |
| Untracked | **59** |
| Staged | **0** |

**~+1,822 / −241 lines** vs `a4c1ecb`.

### Are `tasks/maps` “fully committed”?

**No.** `tasks/maps/*.md` lives outside `mdeapp` git.  
**Maps code** (MAP-004, 018, 030/031/009, clustering, overlay, camera sync, smokes) is **local only** — mostly **untracked** new files + modified `ChatMap`, `search-tool-renders`, etc.

---

## Verification runs

| Command | Result |
|---------|--------|
| `npm run floor` | **FAIL** — ESLint 2 warnings (`ClusteredCategoryMarkers.tsx` unused `_removed`; `map-clustering.test.ts` unused `vi`) |
| `npm test` | **PASS** — 65 files, **258** tests |
| `npm run typecheck` | **PASS** |
| `npm run build` | **PASS** |
| `npm run smoke:map-pins` | **PASS** |
| `npm run smoke:grounding-attribution` | **PASS** |
| `npm run smoke:f50-pin-sync` | **Not run** (recommended before push) |
| `npm run audit` | **Not run** (part of `floor`) |

---

## Secrets / junk check

| Item | Status |
|------|--------|
| `.env.local` | Ignored (not tracked) |
| `.env.example` diff | Placeholders only (`ENABLE_SEARCH_GROUNDING`, caps) — OK to commit |
| Real API keys in diff | **None found** in tracked diff |
| `tmp/*.png` smoke screenshots | **`tmp/` gitignored** — not pushed |
| `/home/sk/mdeai/screenshots/` | Outside `mdeapp` git |
| `supabase/` untracked | Only `supabase/.temp/` (CLI cache) — **do not commit**; add `supabase/.temp/` to `.gitignore` if you ever track `supabase/` |
| Photo proxy `src/app/api/places/photo/` | App code (rate limit) — OK; no secrets in URLs |

---

## Deploy implications

| Target | Required? |
|--------|-----------|
| **GitHub push** | Yes — prod is still `a4c1ecb` |
| **Vercel** | **After** push + green `floor` — set `ENABLE_SEARCH_GROUNDING`, `SEARCH_GROUNDING_DAILY_CAP` if enabling search |
| **Cloud Run ADK** | **Only if** you turn on search grounding in prod and sidecar lacks that revision — last note: `00011-lbt` with `ENABLE_SEARCH_GROUNDING=1`. **Mdeapp-only push does not redeploy CR.** |

**Order:** fix lint → `floor` green → push → Vercel auto-deploy → smoke **www** → optional CR/env alignment.

---

## Commit history

Recent messages are **clean and logical** (feat/test/fix). **Gap:** one giant working tree since `a4c1ecb`, not reflected in history.

---

## 1. Deployment readiness: **62 / 100**

| Factor | Points |
|--------|--------|
| Vitest 258/258, build OK | +25 |
| Smokes (map-pins, grounding) OK | +20 |
| No secrets in diff | +15 |
| `floor` red (lint) | −15 |
| Nothing committed/staged | −10 |
| 98 files, no PR split | −8 |
| Prod 2 days behind local | −5 |
| `tasks/` + INDEX not in git | −5 (tracking only) |
| `smoke:f50` / full `floor` audit not run | −5 |

---

## 2. Blockers (fix before push)

1. **`npm run floor` fails** — 2 ESLint warnings (must be 0 with `--max-warnings 0`).
2. **Zero staged commits** — all work is local.
3. **Large blast radius** — one push = maps + events + search grounding + APIs; hard to roll back.
4. **Optional but recommended:** `npm run smoke:f50-pin-sync`, `npm run smoke:search-grounding` (new scripts), `test:e2e:screens` for event dedupe.

**Not blockers:** secrets, smokes run, tests.

---

## 3. Recommended commit message

**If one commit (after lint fix):**

```
feat(maps,events): Mindtrip markers, event dedupe, and search grounding

- MAP-030/031/009: category markers, overlay, clustering, map-results copy
- MAP-004/018: Places client, grounded cards, photo proxy, viewport sync
- Events: single Events(N) panel; inline summary; collapse Map results dupes
- MAP-002D prep: search grounding quota, event-web API, web citations
- Smokes and Vitest for clustering, map results, grounded places
```

**If split (preferred):**

1. `feat(maps): category markers, clustering, Places client, and map polish`  
2. `feat(events): dedupe event results UI and add web citation sync`  
3. `chore: env.example search flags, package deps, and smoke scripts`

---

## 4. Safe to push now? Split?

**Not yet** — fix lint, rerun `npm run floor`, then push.

**Split?** **Yes — 2–3 commits** (maps → events/chat → chore/env). One 98-file commit is reviewable only if you accept an all-or-nothing rollback.

---

## 5. Production deploy: before or after another commit?

**After** the commit(s) that contain this work land on `main` and **Vercel build passes**.

Do **not** treat current **www.mdeai.co** as having event dedupe or MAP-030 — it does not until this push deploys.

---

## 6. Commit cadence (this repo)

1. **Git lives in `mdeapp/` only** — planning in `tasks/` won’t ship unless copied or you add a parent monorepo.
2. **One worktree goal → one PR** — maps PR vs events PR when possible.
3. **Merge gate:** `npm run floor` + `smoke:map-pins` + `smoke:grounding-attribution` (+ `smoke:f50-pin-sync` for map work).
4. **Evidence in `tasks/notes/*-evidence.md`** — parent repo; link in PR body.
5. **Never commit:** `.env.local`, `tmp/`, `test-results/`, `supabase/.temp/`, screenshots.
6. **Vercel:** push `main` → verify preview URL → promote prod → curl `/` + `/api/copilotkit`.
7. **Cloud Run:** separate release when `services/adk-grounding/` changes; sync `ADK_*` on Vercel same day.

---

**Cursor git tracking:** Correct for **`mdeapp`**. **`tasks/INDEX.md`, `changelog`, audits** are invisible to `amo-tech-ai/mdeapp` unless you commit them elsewhere.

I can fix the two lint warnings and rerun `floor` if you want that unblocked next.