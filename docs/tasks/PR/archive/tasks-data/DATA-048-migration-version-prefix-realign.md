---
task_id: DATA-048
mvp_step: 10.2
title: Realign migration version prefixes repo ↔ remote (full pack)
layer: DATA / process
priority: P1
status: Done
archived: 2026-06-02
main_sha: 4de18f1
prod_sha: 4de18f1
ship_pr: PR-04-08
estimated_effort: 1-2h
depends_on: ["data-010b"]
unblocks: []
pr_ship: PR-04
linear: SAN-446
skills: [mde-task-lifecycle, mde-supabase, task-verifier]
related:
  - ../../data/archive/data-010b-postgres-migration-hygiene.md
  - ../../data/audit/DATA-PACK-LIVE-AUDIT-2026-05-31.md
  - ../../../../mdeapp/supabase/migrations/
  - ../tasks/PR-04-c1-migrations.md
description: DATA-010b aligned only the data010 file. Live re-audit 2026-05-31 found 11 local migration files whose timestamp prefixes are NOT in remote history + 15 remote versions with no matching local file. `supabase db push` from a fresh clone would try to re-apply already-applied DDL → collisions. Realign prefixes / migration repair so repo reproduces remote.
verified: Supabase MCP list_migrations vs local supabase/migrations/ filenames, 2026-05-31
spec_accuracy_pct: 100
audit_dot: green
main_sha: c9e54b8
do_not_execute_without: PR-08 gate then PR-04 ship
---

# DATA-048 — realign migration version prefixes (repo ↔ remote)

## At a glance

| | |
|---|---|
| **For** | Sofía (dev) / sanjiovani |
| **Surface** | `supabase/migrations/` ↔ remote `schema_migrations` |
| **Layer** | DATA / process |
| **Found by** | Live re-audit [`../audit/DATA-PACK-LIVE-AUDIT-2026-05-31.md`](../audit/DATA-PACK-LIVE-AUDIT-2026-05-31.md) |

## Plain-English problem

The live database is correct. But the **repo can't rebuild it.** Several migrations were applied to Supabase (via MCP `apply_migration`) under one timestamp, while the file checked into `supabase/migrations/` carries a *different, earlier* timestamp. Supabase matches migrations by the 14-digit filename prefix, so on a fresh `supabase db push` it sees those files as "never applied" and tries to run them again — hitting `relation already exists` errors.

**Real-world:** Sofía clones the repo to test SEARCH-001 locally. `supabase db push` aborts halfway with `relation "venue_anchors" already exists`, because the repo's `20260529120100_data009_venue_anchors.sql` was actually applied to remote as `20260529234948_data009_venue_anchors_m2`. She can't get a clean local DB without manual repair.

> **Note (2026-05-31):** A prior reorg had symlinked `/home/sk/mdeai/supabase` → `mdeapp/supabase` while leaving that target empty, so the canonical migrations dir resolved to nothing. The audit **restored** the project content into `mdeapp/supabase/` (via the symlink). This task covers the *remaining* version-prefix drift that predates the symlink issue.

## Drift evidence (live 2026-05-31)

Remote history = **75** versions · local files = **71**.

### A. Local files with a prefix NOT in remote (would re-apply → collision)

| Local file | Likely remote twin (rename target) |
|------------|-------------------------------------|
| `20260520120000_place_details_cache_map018e.sql` | `20260526014446_place_details_cache_map018e` |
| `20260520120000_search_grounding_quota_log.sql` ⚠️ dup prefix | `20260526035150_search_grounding_quota_log` |
| `20260524130000_restore_rental_post_mvp_tables.sql` | `20260524023432_restore_rental_post_mvp_tables` |
| `20260524140000_restore_post_mvp_landlord_sponsor_whatsapp.sql` | spans remote `…024015` + `…024118` (split) |
| `20260524150000_restore_post_mvp_trip_planner.sql` | `20260524024419_restore_post_mvp_trip_planner` |
| `20260529120000_data009_venue_booking_requests.sql` | `20260529234934_data009_venue_booking_requests` |
| `20260529120100_data009_venue_anchors.sql` | `20260529234948_data009_venue_anchors_m2` |
| `20260529120200_data009_apartments_price_daily_indexes.sql` | `20260529234939_data009_apartments_price_daily_indexes` |
| `20260529130000_data020_leads_rental_fk.sql` | `20260529235041_data020_leads_rental_fk_columns` |
| `20260529140000_data027_trip_items_check_and_rpc.sql` | `20260529235115_data027_trip_items_check_and_rpc` |
| `20260529140100_data029_commerce_trip_id_linkage.sql` | `20260529235059_data029_commerce_trip_id_linkage` |
| `20260529150000_data035_venue_anchors_cafes.sql` | `20260530001941_data035_venue_anchors_cafes_seed` |

⚠️ Two files share prefix `20260520120000` — also a uniqueness violation.

### B. Remote versions with NO local file (applied, not reproducible)

`20260524024105_restore_post_mvp_verification_analytics`,
`20260524024110_restore_post_mvp_saved_places_bookings` — no repo file at all; pull from remote.

(The other 13 remote-only versions are the rename twins of section A.)

## Goals

1. Every remote `schema_migrations` version has exactly one local file with the **same prefix**.
2. No duplicate local prefixes (`20260520120000` ×2).
3. `supabase migration list --linked` shows every row as `Local | Remote` (no one-sided rows).
4. `supabase db push` on a fresh clone is a **no-op** (nothing to apply).

## Implementation (requires linked CLI + human review — do NOT auto-run)

```bash
cd /home/sk/mdeai          # canonical supabase/ lives here (symlink → mdeapp/supabase)
# 0. Prereq: project is not CLI-initialized — there is no supabase/config.toml.
#    Create one + link first, or this whole workflow cannot run:
supabase init               # writes supabase/config.toml (review before commit)
supabase link --project-ref zkwcbyxiwklihegjhuql

# 1. See the truth
supabase migration list --linked

# 2a. Clean 1:1 renames (section A, the data009/020/027/029/035 + cache rows):
git mv supabase/migrations/20260529120100_data009_venue_anchors.sql \
       supabase/migrations/20260529234948_data009_venue_anchors_m2.sql
#    …repeat for each clean twin in the table above…

# 2b. For the tangled restore_* split + the 2 missing files, prefer pulling canonical
#     files straight from remote instead of hand-editing:
supabase db pull            # regenerates files matching remote history

# 3. Mark already-applied versions so push won't re-run them, if needed:
supabase migration repair --status applied <version>

# 4. Prove reproducibility
supabase migration list --linked      # every row Local|Remote
supabase db diff --linked             # must be EMPTY
```

## Acceptance criteria

- [x] `supabase/config.toml` exists + project linked (`zkwcbyxiwklihegjhuql`). *(2026-06-01: `supabase init` + `link`; config.toml is local/untracked.)*
- [x] No duplicate local migration prefixes. *(2026-05-31: dup `20260520120000` ×2 resolved by renaming both halves to their remote twins.)*
- [x] `supabase migration list` shows zero one-sided rows. *(2026-06-01: 76 rows all `Local | Remote` after split; verified via `--db-url`.)*
- [ ] `supabase db diff` returns empty. *(Blocked by pre-existing B1 — out-of-band base tables never migration-tracked: `landlord_inbox`, `event_media_assets`, … → [`DATA-050`](DATA-050-out-of-band-base-table-migrations.md). The tangled-file ordering bug B2 is fixed.)*
- [x] Drift table A+B all resolved; evidence saved to `../evidence/DATA-048-migration-realign.md`. *(2026-06-01: A via split; B via data049 git-restore + saved-from-git.)*
- [x] Single source of truth: history reconciled at file level (zero one-sided rows). *(Replay-from-scratch still needs the B1 base-table ticket.)*

## Progress log

### 2026-05-31 (claude) — clean 1:1 renames applied (non-destructive)

Performed the **section A clean renames** locally (filename-only, zero SQL-body changes, zero live-DB mutation). Verified every target prefix exists in live remote `schema_migrations` via MCP `list_migrations` before renaming. Result: drift collapsed from **11 local + 15 remote** one-sided rows → **1 local + 4 remote**.

**11 files renamed → remote twin:**

| Old prefix | New (remote) prefix · name |
|---|---|
| `20260520120000` place_details_cache_map018e | `20260526014446` |
| `20260520120000` search_grounding_quota_log *(dup)* | `20260526035150` |
| `20260524130000` restore_rental_post_mvp_tables | `20260524023432` |
| `20260524150000` restore_post_mvp_trip_planner | `20260524024419` |
| `20260529120000` data009_venue_booking_requests | `20260529234934` |
| `20260529120100` data009_venue_anchors | `20260529234948` _m2 |
| `20260529120200` data009_apartments_price_daily_indexes | `20260529234939` |
| `20260529130000` data020_leads_rental_fk | `20260529235041` _columns |
| `20260529140000` data027_trip_items_check_and_rpc | `20260529235115` |
| `20260529140100` data029_commerce_trip_id_linkage | `20260529235059` |
| `20260529150000` data035_venue_anchors_cafes | `20260530001941` _seed |

**Remaining drift (requires credentialed CLI — NOT auto-runnable):** the single tangled
`20260524140000_restore_post_mvp_landlord_sponsor_whatsapp.sql` maps to **four** separate
remote migrations, all of which currently have **no canonical local file**:

- `20260524024015` restore_post_mvp_landlord_stack (8,290 chars)
- `20260524024105` restore_post_mvp_verification_analytics (7,123 chars)
- `20260524024110` restore_post_mvp_saved_places_bookings (5,959 chars)
- `20260524024118` restore_post_mvp_sponsor_whatsapp (12,036 chars)

These four must be produced via `supabase db pull` (after `supabase init` + `link`) — **not**
hand-reconstructed from MCP output (dollar-quote / escaping corruption risk). Once pulled,
delete the combined `20260524140000_*.sql`. Direct `psql` dump was attempted but denied by
the auto-mode prod-write classifier; `db pull` is the sanctioned path. **No `db push` /
`migration repair` was run — nothing touched the live database.**

### 2026-06-01 (claude) — CLI linked + shadow replay; 2 new findings; still gated

Linked the CLI (`supabase init` + `link zkwcbyxiwklihegjhuql`) and ran the schema-reproducibility
replay (`supabase db diff --from migrations --to <db-url> --use-migra`, Docker shadow). **No
`db push`, no `migration repair`, no live-DB write.** Full evidence:
[`../evidence/DATA-048-migration-realign.md`](../evidence/DATA-048-migration-realign.md).

**Finding A — data049 lost to a branch switch (HEALED).** Remote version `20260531215952`
(data049 advisor remediation) had its local file committed on `75731c9`, but that commit is **not in
the current branch `feat/ux-036-restaurant-fast-path`**, where `supabase/migrations/` is entirely
untracked — so the checkout deleted the file. Restored the exact committed blob via
`git show 75731c9:…/20260531215952_data049_advisor_remediation.sql > …` (no reconstruction, exact
prefix). Drift returned 6 → 5 one-sided rows. ⚠️ This DATA-048/data049 work currently lives on the
**wrong branch** — needs to land on its proper branch (agent-branch-safety, MEMORY.md).

**Finding B — repo can't replay from scratch (pre-existing).** `db diff` replay fails twice:
(B1) `landlord_inbox`/`landlord_profiles`/`analytics_events_daily` were created **directly in prod,
never migration-tracked** (per the `_archive-not-on-remote/…base_tables_stub.sql` header) — no remote
history row, stub kept out of push path; (B2) after staging the stub, replay fails at
`20260524024419_restore_post_mvp_trip_planner` because `saved_places` (remote `024110`) lives inside
the late-sorting tangled `20260524140000` file → **the tangled file's wrong prefix actively breaks
replay ordering.** So **goal #4 (fresh push = no-op) is NOT reachable by prefix realignment alone.**

**Two gated options to finish (NOT executed — need explicit approval):**
- **Option 1 (recommended): split** the tangled `20260524140000` into the 4 prefix-matched files
  (sections 4–226/230–351/356–454/459–660 → `024015/024105/024110/024118`) + delete the combined file.
  Source = existing committed local file (not MCP JSON). Fixes history rows **and** replay ordering B2.
  Zero live-DB change. *(This exact op was auto-mode-denied 2026-05-31 as a boundary violation — needs
  the user to explicitly authorize it.)*
- **Option 2: `migration repair`** — `repair 20260524024015 024105 024110 024118 --status applied`
  + `repair 20260524140000 --status reverted`. **Mutates remote `schema_migrations`** (insert 4 / delete 1);
  no table/schema change, but a live-history write. Does **not** fix replay ordering B2.
- **B1** (out-of-band base tables) → recommend a **separate ticket**; out of DATA-048 scope.

### 2026-06-01 (claude) — Option 1 (split) executed with user authorization

User explicitly authorized the split. **Filename/partition only — zero SQL-body change, zero live-DB
mutation.** Backed up the combined file (`/tmp/data048_backup/`), sliced the 4 verified sections into
prefix-matched files (`024015`←4–226, `024105`←230–351, `024110`←356–454, `024118`←459–660), each
wrapped `BEGIN;…COMMIT;`, then deleted the combined `20260524140000_*.sql`.

**Proofs:**
- Content integrity: concatenated split bodies vs original = **554 vs 554 non-blank lines, `diff`
  empty (byte-identical SQL)**; all 14 tables partitioned exactly once.
- `supabase migration list --db-url` → **zero one-sided rows** (76 rows all `Local | Remote`); the 4
  restore versions now pair, the local-only `20260524140000` row is gone. **Goals #1–#3 met.**
- `supabase db diff --from migrations` (shadow) → replay now **advances through all 4 split files in
  order** (`024015→024105→024110→024118`), past the old `saved_places`/`024419` failure. **B2 fixed.**
  Stops only at `event_media_assets` — another out-of-band base table (B1 class).

**Status:** prefix-realignment core **COMPLETE** (history aligned, no dup prefixes, B2 ordering fixed,
no live-DB change). Remaining `db diff`-empty AC is blocked by the **pre-existing, out-of-scope** B1
condition (prod base tables never migration-tracked: `landlord_inbox`, `landlord_profiles`,
`analytics_events_daily`, `event_media_assets`, likely more) → **filed as [`DATA-050`](DATA-050-out-of-band-base-table-migrations.md).**
⚠️ The 76 migration files + split are **untracked on `feat/ux-036-restaurant-fast-path`** — must be
committed on the correct DATA branch. Full evidence:
[`../evidence/DATA-048-migration-realign.md`](../evidence/DATA-048-migration-realign.md).

## Out of scope

- New schema changes (this is filename/history alignment only).
- The 113 SECURITY DEFINER EXECUTE advisor warnings (separate Phase-2 ticket).
- `trigger_set_timestamps` search_path (fold into DATA-010 follow-up).

## Do not overbuild

- Do not rewrite migration SQL bodies — only prefixes/history.
- Do not delete the `_archive-not-on-remote/` files (intentional, never pushed).
