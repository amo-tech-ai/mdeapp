Understood — supersede #23, don't merge it. This is a read-only extraction audit: compare #23 against `data/DATA-048-migration-realign`, classify every file, recommend the split. No code changes, no `db push`, no migration repair.

Let me first establish ground truth — which local repo maps to the `amo-tech-ai/mdeapp` remote, #23's current mergeable state and file list, and whether the DATA-048 branch exists.

Two critical facts already: **#23 is actually `MERGEABLE` (state `UNSTABLE`)** — not conflicting as the table assumed; UNSTABLE = mergeable but a check is red (the Supabase Preview failure). And the named source-of-truth branch **`data/DATA-048-migration-realign` returned zero matches** on the remote. That's a premise I must verify before classifying against it — let me check pagination, local branches, and alternate names.

Decisive finding: **`data/DATA-048-migration-realign` exists only locally — it was never pushed.** The remote has 33 branches, none named `DATA-*`. So the "source of truth" branch isn't on GitHub yet, and PR #23's head (`feat/supabase-track-migrations`) does exist remotely. Now let me pull the two file sets to compare — #23's 100 files (via API, no fetch) and the local DATA branch's diff vs main.

The picture is sharpening and it overturns part of the premise. PR #23 touches **only `supabase/` + 2 `scripts/` files** — zero `src/` code (clean separation). The local DATA branch is the *opposite*: it carries migrations **plus** UX card work (UX-021/022/025/026 + a copilotkit fix) — so it's actually the more mixed branch. And the colliding `20260520120000` pair appears in #23 but not in the DATA branch's visible range. I need the exact set intersection to classify each file. Let me comm the two file lists.

Now it's unambiguous. The two branches are **not substitutes** — they overlap only on `supabase/migrations/`, and each holds files the other completely lacks:

- **Only in #23:** 15 edge-function files, 6 seeds, 2 rollbacks, README, 2 seed scripts = **26 files that exist nowhere in the DATA branch.**
- **Only in DATA branch:** 28 `src/`+`e2e` UX files (cards/hooks/copilotkit) — unrelated to data-tracking, and several already shipped as #30/#32/#35/#36.

So "supersede #23 with the DATA branch" would **silently drop the edge functions, seeds, and rollbacks.** Let me compare the migration sets exactly to see what's genuinely redundant vs unique.

Now the relationship is fully resolved. The migration comparison is decisive:

- **60 migrations are identical** on both branches (the shared legacy history through `20260601` data047/vec).
- **#23's 12 unique migrations are the *broken* ones**: the `20260520120000` collision pair (confirmed — collision detected in #23, **none** on DATA branch) plus coarse-timestamp `restore_*` and `data009/020/027/029/035` files.
- **The DATA branch replaces them with 16 corrected ones**: collision renamed to `20260526014446`/`20260526035150`, restore split into 6 properly-timestamped files, DATA-009/020/027/029 re-timestamped, **plus net-new `data049_advisor_remediation`**.

So for *migrations*, the DATA branch is strictly better — the user is right. **But** #23 also holds 26 non-migration files (edge functions, seeds, rollbacks, scripts) that the DATA branch entirely lacks — those can't be dropped, only extracted. Let me confirm the baseline: what does `main` already track under `supabase/`?

Complete evidence now in hand — and it materially corrects the operating premise. Here's the forensic extraction audit.

---

# PR #23 Supersession Audit — `feat/supabase-track-migrations`

## Decision: **Confirmed — do not merge #23. Extract, then close.** But two premises in the plan are wrong and would cause data loss if followed literally.

### Premise corrections (evidence-backed)

| Claim in the plan | Reality (verified) |
|---|---|
| "#23 not mergeable / already conflicts" | **False.** GitHub reports `mergeable: MERGEABLE`, state `UNSTABLE`. There is **no git conflict** — UNSTABLE means a *check* is red (the Supabase Preview, killed by the timestamp collision). |
| "The DATA branch is cleaner — use it as source of truth instead of #23" | **True for migrations only.** The DATA branch contains **0 edge functions, 0 seeds, 0 rollbacks, 0 scripts.** Those 26 files exist **only in #23**. Superseding #23 with the DATA branch as-is would **silently delete all edge functions, seeds, and rollbacks.** |
| "Break into PR-C1 migrations + PR-C2 replay-repair migrations" (two migration PRs) | **Unsafe.** Migrations are a *totally-ordered replay sequence*. Splitting them across two independently-merging PRs reintroduces the exact out-of-order replay drift (DATA-050) you're trying to avoid. Must be **one** migrations PR. |

**Also:** the DATA branch is **local-only (never pushed)** and **itself mixed** — it carries 32 `src/`/`e2e`/`package.json` UX files (UX-021/022/025/026 + copilotkit fix), several already merged via #30/#32/#35/#36. So it is *not* a clean cut-source either; you extract **only its `supabase/migrations/` paths**, never the whole branch.

---

## What the two branches actually are

| | PR #23 (`feat/supabase-track-migrations`) | DATA branch (`data/DATA-048-migration-realign`, local) |
|---|---|---|
| Migrations | 72 (+2 archived) — **contains the collision** | 76 (+2 archived) — **collision fixed, +DATA-049** |
| Edge functions | **15** | 0 |
| Seeds | **6** | 0 |
| Rollbacks | **2** | 0 |
| Scripts / README | **2 + 1** | 0 |
| `src/` + `e2e` UX | 0 | **32** (out of scope — belongs to UX PRs) |
| On `main` already? | **No** — `supabase/` is entirely untracked on main | No |

**60 migrations are byte-identical on both branches** (the legacy history through `20260601` data047/vec). The branches diverge on exactly 12 (#23) vs 16 (DATA) files — and that delta is the whole story.

---

## Classification (every file bucketed)

### 🔴 OUTDATED — DROP (12 files, all in #23, superseded by DATA branch)
The DATA branch is the realigned authority for these:

| #23 file (drop) | Superseded by (DATA branch) | Why |
|---|---|---|
| `20260520120000_place_details_cache_map018e.sql` | `20260526014446_…` | **collision** — same prefix as ↓ |
| `20260520120000_search_grounding_quota_log.sql` | `20260526035150_…` | **collision** — P0 preview blocker |
| `20260524130000_restore_rental_post_mvp_tables.sql` | `20260524023432_…` | coarse ts → realigned |
| `20260524140000_restore_post_mvp_landlord_sponsor_whatsapp.sql` | split into `024015`+`024105`+`024110`+`024118` | one coarse file → 4 granular |
| `20260524150000_restore_post_mvp_trip_planner.sql` | `20260524024419_…` | coarse ts → realigned |
| `20260529120000…150000_data009/020/027/029/035` (7 files) | `20260529234934…235115` + `20260530001941` (`_m2`/`_seed` revisions) | coarse ts + **content-revised** |

### 🟢 STILL NEEDED — EXTRACT (26 files, **only** in #23, NOT on DATA branch)
These have no replacement anywhere — losing them is the real risk:
- **15 edge functions:** `_shared/{http,jwt,rate-limit,schedule-viewing-bridge,supabase-clients}.ts`, `approval-commit/`, `chat-lead-capture/`, `ticket-checkout/`, `ticket-payment-webhook/`, `tests/`, 4 `config.toml`
- **6 seeds:** `cafes-medellin.{seed,curated}.json`, `golden-queries-venues.json`, `nightclubs-medellin.{csv,curated.json}`, `seeds/README.md`
- **2 rollbacks:** `vec001_rollback.sql`, `data039_rollback.sql`
- **1 README:** `supabase/README.md`
- **2 scripts:** `seed-cafe-anchors.mjs`, `seed-nightclub-anchors.mjs`

### 🟢 ALREADY REPRESENTED on DATA branch (60 shared migrations)
Source these from the DATA branch (collision-free set), not from #23. No action needed on #23 for them.

### ⚠️ UNSAFE / GATED — replay-drift risk (the `restore_post_mvp_*` family)
These **restore post-MVP tables** (trip planner, sponsor, WhatsApp, landlord stack). Two concerns: (a) replay-order drift (DATA-050) — must pass shadow replay; (b) **Phase-1 scope** — post-MVP tables may not belong in Phase 1 at all. Your shadow-replay tasks (#1–#16) already validated a base-tables fix; re-run that gate on the final set before merge.

### 📦 ARCHIVED — keep out of the live timeline (2 files, both branches)
`_archive-not-on-remote/20260430140000_landlord_v1_base_tables_stub.sql`, `…/20260516120000_rls_audit_fixes.sql` — already in an `_archive` dir; do not ship as live migrations.

---

## Recommended PR split (corrected — 4 PRs, not 5)

| Order | PR | Scope | Source | Gate before merge |
|---|---|---|---|---|
| **1st** | **C1 — Migrations** | The **whole realigned sequence** (collision-free), incl. validated `restore_*` | **DATA branch** `supabase/migrations/` only | Shadow-replay green; collision check empty; RLS+policy on new tables |
| **2nd** | **C2 — Edge functions** | 15 function files | **#23** | Fix `chat-lead-capture/config.toml:1` `verify_jwt=false` → add justification comment (security-reviewer P1) |
| **3rd** | **C3 — Seeds** | 6 seed files + 2 seed scripts | **#23** | Low risk; depends on C1 tables existing |
| **4th** | **C4 — Rollbacks + docs** | 2 rollbacks + `supabase/README.md` | **#23** | Lowest risk; anytime after C1 |

**Why migrations stay one PR:** Supabase replays by timestamp order. If "replay-repair" migrations carry *earlier* timestamps than already-merged ones, a second migrations PR inserts them *behind* applied migrations → they never run → drift. Either one PR, or strictly sequential (C1 fully merged before any later-timestamped migration PR) — **never parallel.**

---

## Final answers to your 4 asks

1. **Keep list:** DATA branch's 76 realigned migrations (→ C1) + #23's 26 unique non-migration files (edge fns, seeds, rollbacks, scripts, README → C2/C3/C4).
2. **Drop list:** #23's 12 outdated migrations (collision pair + coarse-timestamp restore/data009-035) — superseded by DATA branch.
3. **Move-to-later:** `restore_post_mvp_*` family — gate on shadow-replay **and** a Phase-1-scope decision (post-MVP tables may not belong yet).
4. **Exact PR order:** C1 → C2 → C3 → C4. **Close #23? Yes — but only *after* C2/C3/C4 extract its 26 unique files.** Post a supersede comment linking C1–C4 (your clean-branch + supersede-comment pattern; no rebase/force-push).

## Two red flags to act on now
- **The realigned migrations live only on an unpushed local branch.** If that working copy is lost, the collision fix + DATA-049 + the 6-way restore split are gone. Cutting and pushing C1 soon doubles as the backup.
- **`supabase/` has never been version-controlled** (untracked on main, not gitignored). Until C1 lands, the entire schema history exists only in these two unmerged branches + the live DB.

I've made **zero changes** — this is report-only per your instruction. Next step, on your go: I can cut **C1** from the DATA branch's `supabase/migrations/` onto a fresh branch off `main` (migrations only, leaving the 32 UX files behind), run the collision + shadow-replay checks, and open it — then extract C2–C4 from #23. Want me to start with C1?