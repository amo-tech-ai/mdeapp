# notes-10 — next steps (post events browse + nav)

**Context:** SAN-575 browse verticals (restaurants/nightlife/cafés), SAN-586 public events API, SAN-518 `/events` browse, and SAN-584 Events nav are **shipped on prod** (`main` @ `7137608`).

**Evidence:**
- `tasks/testing/evidence/2026-06-06/san-518/RESULTS.md`
- `tasks/testing/evidence/2026-06-06/san-584/RESULTS.md`

**Housekeeping (2026-06-06):** ✅ prod Tier-1 refresh · ✅ `sitemap.md` updated · ✅ SAN-575 **Done** in Linear · SAN-366 already **Done** (2026-06-04, PRs #64–66) — optional prod re-verify on current SHA, not a greenfield build.

---

## Shipped stack (2026-06-06)

| Task | PR | Prod |
|------|-----|------|
| SAN-586 DATA-036 public events API | #84 | `GET /api/events/public` → 200 |
| SAN-518 SCREEN-027 `/events` browse | #86 | `/events` → 200, 34 cards |
| SAN-584 Events nav enable | #87 | `/` → Events link → `/events` |

**Still disabled in nav:** Cafés (`href: null`), Rentals (`href: null`).

---

## Immediate (~30 min) — ✅ done 2026-06-06

| Step | Status | Result |
|------|--------|--------|
| **1. Prod Tier-1 refresh** | ✅ | `/events` 200 · `/api/events/public` 200 · `/cafes` 200 · `/restaurants` 200 · `/nightlife` 200 · `/` 200 |
| **2. Update `sitemap.md`** | ✅ | `/events` LIVE · `/cafes` LIVE · Events nav enabled · `/host/events` LIVE |
| **3. SAN-575 parent** | ✅ | Linear **Done** (2026-06-06) |
| **4. SAN-366 host publish** | ✅ already Done | Linear Done 2026-06-04 (Step 0 `organizer_id` + bridge fix merged) — re-run prod proof only if regression suspected |

```bash
curl -s -o /dev/null -w "GET /events -> %{http_code}\n" https://www.mdeai.co/events
curl -s -o /dev/null -w "GET /api/events/public -> %{http_code}\n" https://www.mdeai.co/api/events/public
node /home/sk/mdeai/tasks/testing/scripts/chat-smoke.mjs --base https://www.mdeai.co
```

---

## Best next move (post-housekeeping)

**Lean decision updated:** SAN-366 is already Done — **don't reopen unless prod regression**. Pick **Track A (UI)** as the active build track:

```text
Track 1 — UI polish (primary)
SAN-587 events re-skin + cafés nav enable (SAN-584 pattern)

Track 2 — Intelligence gate (parallel, Patricia)
DATA-041 venue_signals human QA sign-off → SEARCH-003 → INT-021

Track 3 — Optional
SAN-366 prod re-verify on main @7137608 (screenshot refresh only)
Mastra Phase 0 SAN-589 tracing (infra, no browse overlap)
```

---

## Pick one primary track

### Track A — **Design polish** (low risk, persona-visible) ← **primary now**

| Item | Linear / spec | Scope |
|------|----------------|-------|
| **SAN-587** D-09b events re-skin | Todo | Nova `VenueCardShell`-style polish on browse `EventCard` grid only — chat cards stay legacy |
| **Cafés nav enable** | SAN-584 pattern | `chat-nav-rail.tsx`: `cafes.href` → `/cafes` (page live; nav still `null`) |
| **Rentals nav** | **Wait** | Keep `href: null` until `/rentals` browse route is LIVE per sitemap |

Same playbook as SAN-584: one-line nav flip + SCREEN spec nav test + prod smoke.

### Track B — **Events host G3** (Roberto north star)

| Item | Linear | Scope |
|------|--------|-------|
| **SAN-366** EVT-002 | **Done** 2026-06-04 | Step 0 + prod proof shipped (PRs #64–66). Optional: refresh evidence on `main` @ `7137608` if audit needs current screenshots |

Wizard + `/api/approval-commit` LIVE. Only re-run if publish regression reported.

### Track C — **Intelligence** (unblocks better restaurant/venue chat)

| Order | Task | Gate |
|-------|------|------|
| 1 | **DATA-041** venue_signals | Patricia signs `tasks/data/evidence/DATA-041-venue-signals-human-qa.md` |
| 2 | **SEARCH-003** | First hybrid: restaurants + `venue_signals` (after DATA-047/VEC-001) |
| 3 | **INT-021** | Restaurant & venue intelligence wrapper |

Do **not** start INT-021 before DATA-041 editorial sign-off — audit flags this as the human gate.

### Track D — **Mastra Phase 0** (infra quality, Patricia/Sofía)

From [`tasks/mastra/plan/1-agents-plan.md`](../mastra/plan/1-agents-plan.md) — epic **SAN-588**:

```
00C tracing (0.5d) → 00A hallucination scorer (1.5d) → 00B grounding scorer → 00D allowlist
```

Parallel-safe with Tracks A–C; no browse UI overlap.

---

## Optional cleanup (non-blocking)

| Item | When |
|------|------|
| Duplicate `data-testid` on browse pages during loading (`restaurants-browse`, etc.) | Small PR — e2e already uses `.first()` |
| `storage.test.ts` Infisical flake on full Vitest | Mock/unset `DATABASE_URL` in that file |
| Prod smoke Laureles on `/cafes` after deploy lag | Re-run SCREEN-028 if flaky |
| `SCREEN-027` P6 prod smoke in san-584 evidence | Already done 2026-06-06 |

---

## Suggested order

```
✅ SAN-586 → SAN-518 → SAN-584          (done)
✅ Housekeeping (sitemap, Tier-1, SAN-575) (2026-06-06)
1. SAN-587 events re-skin + cafés nav     (Track A — primary build)
2. DATA-041 sign-off → SEARCH-003         (Track C — Patricia parallel)
3. Optional: SAN-366 prod evidence refresh (already Done in Linear)
4. Mastra Phase 0 (SAN-589 tracing)       (Track D — infra)
5. After DATA-041: INT-021 restaurant wrapper
6. Phase 2 commerce: PAY + AGT-11 — deferred
```

**Lean recommendation:** **SAN-587 + cafés nav** is the next shippable slice (D-09 pattern, no Mastra). Patricia runs **DATA-041** sign-off in parallel. SAN-366 is closed — only re-open for regression.

---

## Quick reference — personas

| Persona | Next visible win |
|---------|------------------|
| **Andrés / Tourist** | **SAN-587** prettier `/events` · **cafés nav flip** |
| **Roberto** | SAN-366 Done — optional prod evidence refresh |
| **Camila** | DATA-041 → better restaurant grounding in chat |
| **Patricia** | DATA-041 QA sign-off · Mastra tracing (SAN-589) |
| **Lucía** | Prod matrix row for `/events` in `09-prod-live-journey-matrix.md` |

---

## Commands cheat sheet

```bash
# Local browse regression
cd mdeapp
infisical run --silent --env=dev --path=/ -- \
  npx playwright test e2e/screens/SCREEN-027-events-browse.spec.ts --project=chromium --workers=1

# Prod events vertical
curl -s -o /dev/null -w "prod GET /events -> %{http_code}\n" https://www.mdeai.co/events
```

**Next doc:** `notes-11-next.md` after first pick from §Suggested order is merged or signed off.
