**Post-merge verification done.** Nightlife slice is implemented on branch; ready to commit and open PR.

---

## 1. Prod smoke — `/restaurants`

| Check | Result |
|-------|--------|
| `curl GET /restaurants` | **200** |
| `curl GET /restaurants?neighborhood=Laureles` | **200** |
| 16:10 cards | **`aspect-[16/10]`** in prod HTML |
| Laureles filter (Playwright @ prod) | **PASS** |
| Console / grid load | **WARN** — duplicate `data-testid="restaurants-browse"` on prod (strict-mode flake on grid test); Laureles + cards OK |

**Commands:**
```bash
curl -s -o /dev/null -w '%{http_code}\n' https://www.mdeai.co/restaurants
curl -s -o /dev/null -w '%{http_code}\n' 'https://www.mdeai.co/restaurants?neighborhood=Laureles'
PW_SKIP_WEBSERVER=1 PROD_SMOKE_BASE_URL=https://www.mdeai.co \
  npx playwright test e2e/screens/SCREEN-023-restaurant-listings.spec.ts -g "Laureles" --project=chromium
```

**Evidence updated:** `tasks/testing/evidence/2026-06-05/san-575/RESULTS.md`

---

## 2. Linear SAN-575

- Comment posted: restaurants slice @ `429557b`, nightlife/cafés remain
- Parent stays **In Progress** (already was)

---

## 3. Branch cleanup

```bash
git branch -D ai/san-574-d-08-shared-browse-system
git push origin --delete ai/san-574-d-08-shared-browse-system
```
Both succeeded.

---

## 4. Local junk

| Action | Detail |
|--------|--------|
| `github/` | Added `/github/` to `mdeapp/.gitignore` |
| `toggle-group.tsx` | **Deleted** (not used; restaurants/nightlife use `toggle.tsx` + `Link`) |

---

## 5. Nightlife branch — `ai/san-575-d-09-nightlife-reskin`

### Files changed (uncommitted)

| File | Change |
|------|--------|
| `.gitignore` | Ignore `/github/` |
| `src/components/nightlife/nightlife-browse-filters.tsx` | **New** — `Link` + `toggleVariants` |
| `src/components/nightlife/nightlife-browse-view.tsx` | Filters extracted; `auto-rows-fr` grid; nova cards |
| `src/components/nightlife/nightlife-browse-card.tsx` | Nova + cover 16:10; shadcn `Button` for maps |
| `src/components/nightlife/__tests__/nightlife-browse-card.test.tsx` | **New** — 2 Vitest |
| `scripts/san-575-nightlife-scope-gate.sh` | **New** — allows `nightlife/` only |
| `e2e/san-575-nightlife-visual-evidence.spec.ts` | **New** — 375/768/1280 screenshots |

**Not touched:** routes, nav, Mastra, CopilotKit, maps, chat (`CafeResultCard` in `search-tool-renders.tsx` unchanged).

---

## Test results

| Suite | Result |
|-------|--------|
| Nightlife scope gate | **PASS** |
| Vitest `nightlife-browse-card` | **2/2 PASS** |
| SCREEN-022 browse (3 tests) | **3/3 PASS** |
| SAN-575 nightlife visual | **3/3 PASS** |

```bash
bash scripts/san-575-nightlife-scope-gate.sh
npm test -- --run src/components/nightlife/__tests__/nightlife-browse-card.test.tsx
npx playwright test e2e/screens/SCREEN-022-nightlife-browse.spec.ts \
  e2e/san-575-nightlife-visual-evidence.spec.ts --project=chromium --workers=1
```

---

## Evidence paths

| Slice | Path |
|-------|------|
| Restaurants (post-merge) | `tasks/testing/evidence/2026-06-05/san-575/RESULTS.md` |
| Nightlife (branch) | `tasks/testing/evidence/2026-06-06/san-575-nightlife/{375,768,1280}-nightlife.png` + `RESULTS.md` |

---

## PR readiness verdict

| Item | Status |
|------|--------|
| **PR #80 (restaurants)** | **Shipped** @ `429557b` |
| **Nightlife PR** | **Ready to commit + push + open PR** — local tests green; run Floor CI on push |
| Blockers before merge | Commit, push, Floor CI green |
| Follow-ups (non-blocking) | Prod duplicate `restaurants-browse` testid; `storage.test.ts` Infisical flake on full Vitest |

Say the word if you want me to **commit, push, and open the nightlife PR**.



**PR #80 is done** — next work is post-merge verification, housekeeping, then pick **SAN-575 slice 2** (UI) or **SAN-586** (data) depending on whether you want browse polish or events unblocked first.

---

## Immediate (today, ~30 min)

| Step | Why | Command / action |
|------|-----|------------------|
| **1. Prod smoke** | Only gap in notes-8 | Tier-1: `curl` + optional browse on [mdeai.co/restaurants](https://www.mdeai.co/restaurants) — Laureles filter, 16:10 cards, no console errors |
| **2. Linear SAN-575** | PR used `Refs`, not `Closes` | Comment: restaurants slice shipped @ `429557b`. Either **In Progress** (nightlife/cafés left) or sub-issue **SAN-575-restaurants Done** |
| **3. Delete stale branch** | Still exists locally + remote | `git branch -d ai/san-574-d-08-shared-browse-system` + `git push origin --delete ai/san-574-d-08-shared-browse-system` |
| **4. Local junk** | Pollutes `npm run floor` | Remove or `.gitignore` untracked `github/`; delete orphan `toggle-group.tsx` unless nightlife slice needs it |

---

## Pick one primary track

### Track A — **SAN-575 slice 2: `/nightlife`** (recommended if design velocity matters)

Same pattern as restaurants — low risk, reuses `VenueCardShell` + `BrowseLayout`:

1. Branch `ai/san-575-d-09-nightlife-reskin`
2. Mirror restaurants: `composition="nova"` + `mediaLayout="cover"` on browse only; chat stays `legacy`
3. Filters: `Link` + `toggleVariants` (not `ToggleGroupItem` — SCREEN-023 lesson)
4. Scope gate: extend `san-575-scope-gate.sh` or copy for nightlife paths only
5. Tests: nightlife SCREEN spec + visual evidence @ 375/768/1280
6. **Do not touch:** routes/nav, Mastra, CopilotKit, maps, greyed sidebar, SAN-577

Then slice 3: `/cafes` (same playbook).

### Track B — **SAN-586 (DATA-036 public events API)** (recommended if Camila/events browse is P0)

Unblocks **SAN-518** (`/events` browse per notes-6):

1. Branch `ai/san-586-data-036-events-api`
2. Public list endpoint + shape contract for browse cards
3. Vitest for API route; no UI in same PR
4. After merge → SAN-518 consumes API

**Parallel OK:** one agent on nightlife UI, one on events API — they don't conflict.

---

## Optional cleanup (non-blocking)

| Item | When |
|------|------|
| CodeRabbit nits from #80 (viewport label 1280 vs 1360, evidence path, scope-gate root `page.tsx`, hero ordering test) | Small follow-up PR or fold into nightlife branch |
| `storage.test.ts` 2 failures under Infisical | Separate fix: mock/unset `DATABASE_URL` in that test file so local full suite is green |
| Update `notes-8.md` | Strike "merge #80 now" — it's merged |

---

## Suggested order

```
1. Prod smoke /restaurants          → evidence row in san-575 RESULTS.md
2. Linear + delete san-574 branch   → ledger clean
3. SAN-575 /nightlife OR SAN-586    → your call on UI vs data priority
4. After nightlife: /cafes          → then close SAN-575
5. After SAN-586: SAN-518 /events   → events browse
```

**My lean:** prod smoke + branch cleanup first, then **nightlife slice** while it's fresh (same components, fast win), **SAN-586 in parallel** if you have a second slot — events browse is the bigger persona unlock but doesn't need the UI work to start.

Want me to run prod Tier-1 + update Linear, or open the nightlife branch?