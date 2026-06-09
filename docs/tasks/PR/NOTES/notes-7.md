# PR train — where we are (plain English)

**Updated:** 2026-06-02  
**App code (`mdeapp`):** `main` @ **`330f47e`** (matches `origin/main`)  
**Prod (last manual smoke):** `a9eb176` on [mdeai.co](https://www.mdeai.co)  
**Board map:** [`tasks/PR/LINEAR.md`](../LINEAR.md)

---

## The one sentence version

**The app is fixed and tested on `main`; you are waiting for three automatic “health checks” on production each night before the next big PRs are allowed.**

---

## What just shipped (already on `main`)

| What | Why it mattered |
|------|-----------------|
| **UX-020** (#45) | Shared types for rental/event/café/restaurant cards |
| **PR-10** | Vercel Analytics in the layout |
| **PR-11** | Closed old stacked PRs #19 / #20 |
| **PR-12** | Dev warning when Maps API key is missing |
| **PinId fix** (`4688b7a`) | Rentals no longer break TypeScript / floor |
| **Hydration fix** (`961e9bc`) | No more React “tree hydrated” noise in chat |
| **Maps bootstrap** (`330f47e`) | Maps auth callback without React 19 script errors |

**Verified locally (2026-06-02):** lint · typecheck · **436 tests** · build · floor · all four search APIs (rentals, events, cafés, restaurants) return 200.

---

## Is anything uncommitted?

### `mdeapp/` (the real app repo)

| File | Committed? | What to do |
|------|------------|------------|
| All fixes above | **Yes** — pushed to `origin/main` | Nothing required |
| `package-lock.json` (tiny change) | **No** | Noise only — `git checkout package-lock.json` or ignore |
| `scripts/smoke-*.mjs`, `verify-supabase-data.mjs` | **No** (untracked) | Optional local tools — not part of PR train |

**No open product task is blocked by uncommitted code.**

### `/home/sk/mdeai/` (planning repo)

Dirty files like `.mcp.json`, `README.md` — planning/config only, not the Next.js app.

### Side branch (separate work)

**`feat/int-006-rental-dates-san-409`** — rental date intelligence (SAN-409). Not merged. Rebase onto `main` when you pick that up again.

---

## What is blocking Stable Beta?

Only **one gate**:

| Linear | Name | Rule |
|--------|------|------|
| **[SAN-462](https://linear.app/sanjiovani/issue/SAN-462)** | OPS-001 soak | GitHub must run **[prod synthetic smoke](https://github.com/amo-tech-ai/mdeapp/actions/workflows/prod-synthetic-smoke.yml)** **3 times on the schedule** (cron **09:00 UTC**) and **all pass**. |

- **Manual** “Run workflow” clicks **do not count**.
- Progress: **1 / 3** scheduled greens — first pass [run 26820069434](https://github.com/amo-tech-ai/mdeapp/actions/runs/26820069434) (2026-06-02 09:00 UTC cron).
- Until 3/3: **Stable Beta = not signed off** — even though the app works.

Think of it like a smoke detector that must beep “OK” three mornings in a row on its **timer**, not because you pressed “test.”

---

## What to do next (in order)

### Step 1 — Wait and watch (hands-off, ~3 days)

Each morning, open [GitHub Actions → Prod synthetic smoke](https://github.com/amo-tech-ai/mdeapp/actions/workflows/prod-synthetic-smoke.yml).

You want **3 runs** where:

- **Event** = `schedule` (not `workflow_dispatch`)
- **Result** = success ✅
- **Commit** = production deploy you care about (track vs `a9eb176` / newer after you promote)

If one **scheduled** run fails → read logs, fix only that bug. No refactors.

**During soak, avoid merging:** SEARCH big bang (#38), UX-023 (card shell refactor), ADK, DATA migrations — anything that changes chat/maps/pins or the smoke workflow itself.

### Step 2 — After 3 scheduled greens

| Order | Linear | Task | What you get |
|------:|--------|------|----------------|
| 1 | **SAN-462** | Mark Done | Stable Beta sign-off |
| 2 | **SAN-458** | PR-16 | Enable branch protection (`Floor / floor` + 1 review) — see [`tasks/PR/docs/16-branch-protection.md`](../docs/16-branch-protection.md) |
| 3 | **SAN-437** | UX-023 | First **runtime** card UI refactor (`ResultCardShell`) |
| 4 | **SAN-460** | PR-18 | Pin GitHub Actions to SHAs (security) |

### Step 3 — Optional anytime (not on critical path)

| Item | Notes |
|------|--------|
| **PR-15** / SAN-444 | Backlog |
| **GCP Maps billing** | Stops `BillingNotEnabledMapError` in the map panel |
| **Embed API 403** | Rentals still work; fix key if you want smarter search |
| **Update `LINEAR.md`** | Set `main_sha: 330f47e` when you touch docs |
| **`venues-booking.md`** | Planning — fine during soak |

---

## Simple diagram

```text
TODAY                         NEXT ~3 DAYS              THEN
  │                                │                    │
  │  main @ 330f47e                │  3× nightly ✅      │  Stable Beta
  │  tests green                   │  (scheduled only)   │  PR-16 + UX-023
  │  soak 1/3                      │                    │
  ▼                                ▼                    ▼
 ship fixes done ──────────► watch Actions ──────────► next PR train
     (no uncommitted                      each 09:00 UTC
      product work)
```

---

## Local dev quick check

```bash
cd /home/sk/mdeai/mdeapp
git pull origin main          # should be @ 330f47e
npm run dev                   # UI :3001, Mastra :4111
npm run floor                 # lint + typecheck + build + test + audit
```

If you see old errors (`mounted is not defined`, script in `<head>`):

```bash
rm -rf .next && npm run dev
```

Hard refresh the browser (Ctrl+Shift+R).

---

## Personas (who cares)

| Persona | What this means |
|---------|-----------------|
| **Camila** (chat) | Search for rentals/events/food works; memory/soak is about prod stability |
| **Tourist** (cafés/map) | Cards and pins work; Maps billing is infra, not app logic |
| **Sofía** (dev) | `main` is clean; next code is PR-16 + UX-023 **after** soak |
| **Patricia** (ops) | SAN-462 is the only launch-critical ticket right now |

---

## Links

- [MDEAPP Linear board](https://linear.app/sanjiovani/project/mdeapp-099cd7795071/issues) · filter `label:track:pr`
- [PR index](../INDEX.md)
- [Verification rules](../VERIFICATION.md)
- Evidence: [`tasks/testing/evidence/2026-06-02-search-verticals-smoke.md`](../../testing/evidence/2026-06-02-search-verticals-smoke.md)
