# DATA-050 — base-table backfill evidence (B1, iteration 1)

**Date:** 2026-06-01 · **Branch:** `data/DATA-048-migration-realign` (mdeapp) · **Task:** [`../tasks-data/DATA-050-out-of-band-base-table-migrations.md`](../tasks-data/DATA-050-out-of-band-base-table-migrations.md)

**Goal of this iteration:** fix the `landlord_inbox` replay-ordering failure safely, *without mutating live production schema* — author one early, live-sourced base-table migration and validate in a Docker shadow only.

**Caution honored:** no `supabase db push`, no `migration repair`, no live DDL/DML. The only live access was **read-only** introspection (`supabase db diff --to`, `pg_dump --schema-only`). Replay validation was a throwaway Docker shadow.

---

## 1. Environment confirmed

| | |
|---|---|
| Branch (mdeapp) | `data/DATA-048-migration-realign` ✓ (canonical DATA tree, migration files present + committed) |
| supabase CLI | 2.100.0 · pg_dump 18.4 · Docker up |
| Live target | `…@aws-1-us-east-1.pooler.supabase.com` (`zkwcbyxiwklihegjhuql`), **session mode :5432** for pg_dump/diff (the `DATABASE_URL` default is the :6543 transaction pooler, which pg_dump can't use) |

Connection string sourced from `.env.local` without printing; credentials masked in all output.

## 2. Replay failure reproduced (BEFORE)

```bash
# from mdeapp/ — replays every local migration into a clean Docker shadow
supabase db diff --from migrations --to "$DATABASE_URL" --use-migra
```

Replay applies cleanly through `20260430130000_landlord_v1_fk_indexes.sql`, then aborts:

```
Applying migration 20260501204538_landlord_v1_response_metrics.sql...
ERROR: relation "public.landlord_inbox" does not exist (SQLSTATE 42P01)
At statement: 1
-- 1. landlord_response_metrics view (security_invoker)
CREATE OR REPLACE VIEW public.landlord_response_metrics ...
  FROM public.landlord_inbox          ← fails here
```

**Root cause (B1, the issue DATA-048 scoped out):** `landlord_profiles`, `landlord_inbox`,
`landlord_inbox_events` and `analytics_events_daily` were created in **production via direct SQL**
in early sprints and never committed as ordered migrations. They are only (re)created by the
*later* `20260524024015` / `20260524024105` "restore" migrations, which sort **after** the
`20260501204538` migration that references `landlord_inbox` → ordering failure on a from-scratch replay.

## 3. Fix authored

**File:** [`mdeapp/supabase/migrations/20260430140000_landlord_v1_base_tables.sql`](../../../mdeapp/supabase/migrations/20260430140000_landlord_v1_base_tables.sql)
(prefix `20260430140000` sorts **after** `20260430130000_landlord_v1_fk_indexes` and **before** `20260501204538`).

**Objects included** (exactly the four required base tables + the one helper they need):

| Object | Components |
|---|---|
| `public.landlord_profiles` | table, PK, `UNIQUE(user_id)`, `status_idx`, `updated_at` trigger, RLS + 4 policies, grants |
| `public.acting_landlord_ids()` | `SQL STABLE SECURITY DEFINER` — reads `landlord_profiles`; **required by the inbox/analytics policies**, but defined only in the later `20260524024015`, so (re)created here |
| `public.landlord_inbox` | table, 5 indexes, FKs (→ auth.users, apartments, landlord_profiles), `updated_at` trigger, RLS + 3 policies, grants |
| `public.landlord_inbox_events` | table, 3 indexes, FKs (→ landlord_inbox CASCADE, auth.users), RLS + 2 policies, grants |
| `public.analytics_events_daily` | table, PK(landlord_id,date), FK → landlord_profiles CASCADE, `date_idx`, RLS + 2 policies, grants |

**Source of DDL:** scoped, read-only
`pg_dump --schema-only -t public.landlord_profiles -t public.landlord_inbox -t public.landlord_inbox_events -t public.analytics_events_daily`
against the **live** schema (2026-06-01). Verified field-for-field against the committed restore
migrations (`20260524024015`, `20260524024105`) — types, defaults, CHECKs, FK actions, policy
expressions all match. No hand-reconstruction from MCP JSON.

**Ordering / dependency notes:**
- `public.update_updated_at()` and `public.is_admin()` already exist at this point — both created by `20260404044720_remote_schema.sql` (replays first). Confirmed by grep.
- `public.apartments` and `auth.users` already exist (remote_schema / Supabase auth), so the inline FKs resolve.
- `acting_landlord_ids()` is created **after** `landlord_profiles` (its body reads that table) and **before** the inbox/analytics policies that call it.

**Why it coexists cleanly with the later restore migrations:** both `20260524024015` and
`20260524024105` are **fully idempotent** (`CREATE TABLE IF NOT EXISTS`, `CREATE INDEX IF NOT EXISTS`,
`DROP POLICY IF EXISTS; CREATE POLICY`, `DROP TRIGGER IF EXISTS; CREATE TRIGGER`,
`CREATE OR REPLACE FUNCTION`, guarded FK). Once these objects exist, those migrations no-op / replace —
no duplicate-object error. The new migration mirrors that same idempotent style.
The redundant `landlord_profiles_user_idx` is intentionally **omitted** (live has only the implicit
unique index on `user_id`; the redundant btree exists in `20260524024015` but not in prod — a
pre-existing residual unrelated to this fix).

## 4. Re-validation (AFTER) — `landlord_inbox` failure is FIXED

Re-ran the same shadow replay. The new migration applies (the `… does not exist, skipping`
NOTICEs are the `DROP … IF EXISTS` guards firing harmlessly on the empty shadow):

```
Applying migration 20260430130000_landlord_v1_fk_indexes.sql...
Applying migration 20260430140000_landlord_v1_base_tables.sql...      ← NEW, applies clean
Applying migration 20260501204538_landlord_v1_response_metrics.sql... ← now PASSES the view
```

✅ **`relation "public.landlord_inbox" does not exist` (42P01) is gone.** Statement 1 (the
`landlord_response_metrics` view) and statement 2 (its GRANT) now succeed.

## 5. NEXT failure (recorded, NOT fixed — out of this iteration's 4-table scope)

Replay now advances to a **different** error, **statement 3 of the same file**:

```
Applying migration 20260501204538_landlord_v1_response_metrics.sql...
ERROR: column "landlord_id" does not exist (SQLSTATE 42703)
At statement: 3
CREATE OR REPLACE FUNCTION public.snapshot_analytics_events_daily(target_date date) ...
    LEFT JOIN (
      SELECT landlord_id, count(*) AS created
      FROM public.apartments               ← apartments has no landlord_id column here
      WHERE landlord_id IS NOT NULL ...
```

**Next missing object: the `public.apartments.landlord_id` COLUMN (out-of-band).**
- `public.apartments` **is** created early — `20260404044720_remote_schema.sql:1189`
  (`CREATE TABLE IF NOT EXISTS "public"."apartments"`) — but **without** a `landlord_id` column.
- **No push-path migration ever adds `apartments.landlord_id`.** Later migrations only *assume*
  it: `20260524022749:17` (`UPDATE public.apartments SET landlord_id = NULL …`) and
  `20260524024015:101` (adds the `apartments_landlord_id_fkey` constraint on the column). Both
  sort after `20260501204538` and neither adds the column itself.
- The quarantined stub already anticipated this exact gap:
  `_archive-not-on-remote/20260430140000_landlord_v1_base_tables_stub.sql:87` →
  `alter table public.apartments add column if not exists landlord_id uuid references public.landlord_profiles(id) on delete set null;`

**Recommended next iteration (gated, do not auto-run):** add, in an early migration that sorts
**after** `landlord_profiles` exists and **before** `20260501204538` (the same `20260430140000`
file is the natural home, or a sibling), the prod-faithful column:

```sql
ALTER TABLE public.apartments
  ADD COLUMN IF NOT EXISTS landlord_id uuid
    REFERENCES public.landlord_profiles(id) ON DELETE SET NULL;
```

Source the exact type/FK from a scoped `pg_dump -t public.apartments` of live before committing.
This is **deliberately deferred** here per the task scope ("required objects" = the 4 landlord
base tables; "do not include unrelated tables"; "record the next failure if any").

## 6. Proposed repair command — DO NOT RUN without explicit human approval (Step 9)

The four tables **already exist in production**, so the new migration must be registered in remote
history **without** re-running its DDL:

```bash
# DATA-050 — requires explicit human approval before running (mutates remote schema_migrations)
supabase migration repair --status applied 20260430140000
```

Not executed. Presented for approval only.

## 7. No live DB mutation — confirmation

- Commands run: `supabase db diff --from migrations --to <live> --use-migra` (read-only diff into
  ephemeral Docker shadow), `pg_dump --schema-only` (read-only), local file reads/greps.
- **Not** run: `supabase db push`, `supabase migration repair`, any `ALTER`/`INSERT`/`UPDATE`/`CREATE`
  against live. Live production schema is unchanged.

---

## 8. Iteration 2 (B2) — `apartments.landlord_id` historical-mutation characterization

**Date:** 2026-06-01 · **investigation only** — no fix authored, no live mutation. Read-only
`information_schema`/`pg_catalog` introspection + static grep/reads of local migration files.

### 8.1 Origin verdict — the column was created out-of-band and lost from the replay path

`public.apartments.landlord_id` — `uuid`, nullable, **no default**, **ordinal_position 53** in live prod
(read-only check). The original `CREATE TABLE apartments` (`20260404044720:1189-1244`) defines ~51 columns
ending at `raw_amenities`; ownership there is keyed by **`host_id`** (`:1227`) / **`created_by`** (`:1234`),
and the only ownership index authored then is `apartments(host_id)` (`20260405120000:102`). `landlord_id`
is **not original** — ordinal 53 = appended to the table's end by a later `ALTER`.

All four hypotheses resolve TRUE, and they compound:

| Hypothesis | Verdict | Evidence |
|---|---|---|
| added manually in prod | **TRUE** | ordinal_position 53 (appended post-CREATE); column + FK + partial index all live |
| introduced by archived stub only | **TRUE** | the *only* `ADD COLUMN … landlord_id` in the whole tree is `_archive-not-on-remote/20260430140000_landlord_v1_base_tables_stub.sql:85-87` |
| lost during migration drift | **TRUE** | that stub was quarantined to `_archive-not-on-remote/` (never replayed) → column-creating DDL fell out of the path |
| partially migrated | **TRUE** | dependents (FK `apartments_landlord_id_fkey`, index `idx_apartments_landlord_id`) were re-captured by `20260524024015:101-109`, but the **base column ADD was never re-homed** |

**When landlord ownership appeared:** with the landlord_v1 stack (~2026-04-30, the stub's timestamp), to feed
`snapshot_analytics_events_daily` (2026-05-01). Before that, apartment ownership = `host_id`/`created_by`.

**Live data:** 44 apartment rows, **0** with `landlord_id` populated — the `20260524022749:17` cleanup nulled
every link and nothing re-populated. The column is structurally present but carries no live linkage.

### 8.2 Dependency report — everything coupled to `apartments.landlord_id`

| # | Dependent | Migration (replay pos) | Kind | Effect if column absent |
|---|---|---|---|---|
| 1 | `snapshot_analytics_events_daily(date)` | `20260501204538` (#27) | function body **reads** it (`LANGUAGE sql`) | **42703 at CREATE** (`check_function_bodies=on`) — *current blocker* |
| 2 | `UPDATE apartments SET landlord_id=NULL` | `20260524022749:17` (#49) | DML **write** | 42703 (reached only after #27 clears) |
| 3 | `apartments_landlord_id_fkey` | `20260524024015:101` (#51) | FK constraint (guarded DO-block) | FK add fails |
| 4 | `idx_apartments_landlord_id` (partial) | `20260524024015:107` (#51) | index `IF NOT EXISTS` | index create fails |
| 5 | drop redundant `apartments_landlord_idx` | `20260531215952:22` | `DROP INDEX IF EXISTS` | harmless no-op |

**No RLS policy, no view, no trigger depends on `landlord_id`.** The 3 apartments policies
(anyone_can_view_active / authenticated_can_view_all / service_role_full_access) and 2 triggers
(`apartments_updated_at`, `trg_ai_embed_apartment`) are column-agnostic; `landlord_response_metrics`
reads `landlord_inbox`, not `apartments.landlord_id`. Blast radius = **1 function + 1 DML + 1 FK + 1 index**.

### 8.3 Replay timeline + dependency graph

```
#1   20260404044720 remote_schema      CREATE apartments  (NO landlord_id; ownership = host_id/created_by)
#9   20260405120000 core_corrections   CREATE INDEX apartments(host_id)            ← host_id was the owner key
 …
#26  20260430140000 landlord_base      CREATE landlord_profiles                    ← landlord_id's FK target (B1 fix)
        ┌────────────────────────────────────────────────────────────────────────┐
        │  ✗ MISSING HISTORICAL MUTATION:                                          │
        │     ALTER TABLE apartments ADD COLUMN landlord_id uuid                   │
        │       REFERENCES landlord_profiles(id) ON DELETE SET NULL               │
        │     exists only in the archived stub + manually in prod (ordinal 53)     │
        │     expected slot: AFTER #26, BEFORE #27                                 │
        └────────────────────────────────────────────────────────────────────────┘
#27  20260501204538 response_metrics   snapshot fn READS apartments.landlord_id    ← ✗ CURRENT BLOCKER (42703)
 …
#49  20260524022749 canonical_cleanup  UPDATE apartments SET landlord_id = NULL     (write)
#51  20260524024015 restore_landlord   ADD FK + partial index on landlord_id        (guarded / idempotent)
#54  20260524024118 restore_sponsor    FK → event_media_assets(id)                  ← ✗ NEXT out-of-band gap (no CREATE anywhere)
 …
     20260531215952 data049_advisor    DROP redundant apartments_landlord_idx
```

- **Earliest reference:** #27 (`20260501204538`).
- **Expected order:** column ADD between #26 and #27.
- **Current order:** column never created in-path; first *creation* is implicit/assumed by #51 — 24 files too late.
- **Missing mutation:** the `ADD COLUMN landlord_id` ALTER above.

### 8.4 Idempotency of later apartments-touching migrations (coexistence proof)

A future early `ADD COLUMN` coexists cleanly with every later toucher:
- **#49 UPDATE** — unguarded, but on the empty shadow the column exists with 0 rows → no-op, succeeds.
- **#51 FK** — guarded by `IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='apartments_landlord_id_fkey')`.
  An early `ADD COLUMN … REFERENCES …` auto-names its FK exactly `apartments_landlord_id_fkey`
  (Postgres `table_column_fkey` convention) → the DO-block sees it and **skips**. No duplicate.
- **#51 index** — `CREATE INDEX IF NOT EXISTS idx_apartments_landlord_id` → no-ops.
- **data049 DROP** — `DROP INDEX IF EXISTS apartments_landlord_idx` → harmless no-op.

→ Same idempotent-coexistence property that made the B1 base-tables fix safe.

### 8.5 Classification

**DATA-050 continuation (B2), not a separate DATA task.** Identical root cause/pattern to B1: an out-of-band
prod mutation whose creating DDL was quarantined into `_archive-not-on-remote/`, later only *partially*
re-captured (FK+index, not the column) by a restore migration sorting after the first consumer. Mechanically
both a **replay-order fix** and a **historical-mutation backfill** — the dual nature B1 had. It is literally the
"next failure" recorded in §5.

### 8.6 Proposed strategy — NOT authored this turn

- **One sibling migration** in the `[#26, #27)` window — e.g. `20260430140500_apartments_landlord_id.sql`
  (after `20260430140000_landlord_v1_base_tables`, before `20260501204538`). Rule "do not modify
  landlord_v1_base_tables" ⇒ a **sibling**, never an edit to #26.
- Body (prod-faithful; source the exact type/FK from a scoped `pg_dump -t public.apartments` before committing):
  ```sql
  ALTER TABLE public.apartments
    ADD COLUMN IF NOT EXISTS landlord_id uuid
      REFERENCES public.landlord_profiles(id) ON DELETE SET NULL;
  ```
- **Register, don't push** — the column already exists in prod, so the same gated
  `migration repair --status applied 20260430140500` pattern applies (human-approved, never auto-run).

### 8.7 Risks of an early ALTER — LOW

| Risk | Assessment |
|---|---|
| Duplicate column | none — `ADD COLUMN IF NOT EXISTS` |
| Duplicate FK | none — inline FK auto-name collides *by design* with #51's guarded name → #51 skips |
| Data backfill / lock | none — 0 populated rows; nullable uuid, no default ⇒ metadata-only catalog change, no table rewrite |
| Drift from prod | none if FK is **inline** (`ON DELETE SET NULL`, matches prod) |
| FK target ordering | safe — `landlord_profiles` exists at #26, before the chosen slot |

Nuance: add the column **with inline `REFERENCES`** (not bare) so the auto-named FK matches #51's guard.

### 8.8 Does the replay continue after the landlord_id fix?

**Partially — it clears the current blocker but does NOT reach completion.**
- ✅ With `landlord_id` present, every column the #27 snapshot function references exists
  (`landlord_profiles.id`, `landlord_inbox.*`, `apartments.landlord_id`, `analytics_events_daily.*`) →
  statement 3 type-checks, #27 passes.
- ✗ The **same class of gap recurs**: `public.event_media_assets` is referenced as an FK target at
  **#54 (`20260524024118:52`)** and is **created by no migration in the tree** (grep returns only the
  reference) — another out-of-band table → next failure ≥ #54.
- ⚠️ Files #28–#53 not exhaustively re-verified statically; an empirical shadow re-run is the recommended
  **first step of the (gated) B2 fix iteration**, not of this characterization turn.

**No live mutation. No migration authored. No `db push` / `repair`.**

---

## 9. Iteration 3 (Request C) — full replay-gap archaeology (shadow-only)

**Goal:** systematically inventory *every* remaining replay gap before any repair, by driving the
shadow replay to completion in a disposable scratch tree. Replay archaeology, not hotfixing — **no
live mutation, no `db push`, no `repair`, no real migration authored.**

### 9.1 Method — disposable scratch-tree replay to completion

Copied the 77 tracked migrations to `/tmp/data050-arch/supabase/` (excluded `_archive-not-on-remote/`)
and added **throwaway probes** (never committed; deleted after run) just sufficient to advance the
shadow past each blocker and reveal the *next* one:
- `…140500_zzz_probe_apartments_landlord_id.sql` — `ADD COLUMN IF NOT EXISTS landlord_id` + `moderation_status`.
- `…050000_zzz_probe_orphan_tables.sql` — minimal stubs for the 5 out-of-band orphan tables.
- Re-timestamped `data045` (`20260601120700→20260530120700`) and `data047` (`…120800→…120800`→`20260530120800`)
  to sit **before** `data049` (`20260531215952`) — models the replay-order repair.

The real B1 fix (`20260430140000_landlord_v1_base_tables.sql`) seeded the landlord stack natively.
Result: **79/79 `Applying migration …` lines succeeded, 0 apply-phase SQLSTATE errors**, straight
through to the final migration `data044` (`20260601120600`). The only error is a post-apply *diff*-phase
connection quirk (`database "postgres&sslmode=require"` — a `?`-query-string parse artifact in the CLI's
`--to` connection), which is **orthogonal to the replay** — the apply phase ran to completion. The
blocker chain is therefore **fully enumerated**.

### 9.2 Replay-gap inventory

| # | Replay pos | Object | Type | In prod | In replay (in-tree) | Source / first consumer | Risk | Proposed fix |
|---|---|---|---|---|---|---|---|---|
| 1 | #26 | `landlord_profiles` | base table | ✅ | ✅ **B1** | consumer `20260501204538`; fix `20260430140000` | — | **FIXED (B1)** |
| 2 | #26 | `landlord_inbox` | base table | ✅ | ✅ **B1** | same | — | **FIXED (B1)** |
| 3 | #26 | `landlord_inbox_events` | base table | ✅ | ✅ **B1** | same | — | **FIXED (B1)** |
| 4 | #26 | `analytics_events_daily` | base table | ✅ | ✅ **B1** | same | — | **FIXED (B1)** |
| 5 | #27 | `apartments.landlord_id` (ord 53) | out-of-band column | ✅ | ❌ | consumer `20260501204538` snapshot fn | LOW | `ALTER … ADD COLUMN IF NOT EXISTS` (B2) |
| 6 | data040 | `apartments.moderation_status` (ord 54, NOT NULL dflt `'pending'`) | out-of-band column | ✅ | ❌ | consumer `data040` trigger `WHEN` | LOW | `ALTER … ADD COLUMN IF NOT EXISTS` (B2) |
| 7 | #54 | `event_media_assets` (19 col, **0 rows**) | orphan table | ✅ | ❌ | FK target `20260524024118:52` + `data049` | MED | recover base table (B3) |
| 8 | #70 `data049` | `approval_decisions` (6 col, **0 rows**) | orphan table | ✅ | ❌ | `data049` covering idx | MED | recover base table (B3) |
| 9 | #70 `data049` | `approval_requests` (14 col, **0 rows**, **FK hub: 6 inbound**) | orphan table | ✅ | ❌ | `data049` covering idx | **MED-HIGH** | recover base table **first** (B3) |
| 10 | #70 `data049` | `email_outbox` (16 col, **0 rows**) | orphan table | ✅ | ❌ | `data049` covering idx | MED | recover base table (B3) |
| 11 | #70 `data049` | `event_wait_list` (12 col, **0 rows**) | orphan table | ✅ | ❌ | `data049` covering idx | MED | recover base table (B3) |
| 12 | #70 `data049` | `event_grounding` (7 col, 0 rows) | **replay-order inversion** | ✅ | ✅ `data045`@120700 | CREATE `data045`; indexed by `data049`@215952 | LOW | re-timestamp `data045` < `data049` (B4) |
| 13 | #70 `data049` | `rental_grounding` (7 col, 0 rows) | **replay-order inversion** | ✅ | ✅ `data045`@120700 | same | LOW | re-timestamp `data045` (B4) |
| 14 | #70 `data049` | `venue_source_evidence` (11 col, **20 rows**) | **replay-order inversion** | ✅ | ✅ `data045`@120700 | same | LOW | re-timestamp `data045` (B4) |
| 15 | #70 `data049` | `search_logs` (16 col, **58 rows**) | **replay-order inversion** | ✅ | ✅ `data047`@120800 | CREATE `data047`; ref'd by `data049`@215952 (10×) | LOW | re-timestamp `data047` (B4) |

> **Non-blocking prod drift (NOT replay gaps):** `apartments.rejection_reason` (55), `apartments.source`
> (56), `apartments.fts_content` (57) — out-of-band columns that **no migration references**, so the
> replay never touches them. Recover only for prod-faithfulness, not to unblock replay.

### 9.3 Categories (the five groupings)

- **A · Out-of-band base-table recovery (5):** `event_media_assets`, `approval_decisions`,
  `approval_requests`, `email_outbox`, `event_wait_list`. No in-tree `CREATE`; created directly in prod.
  **All 0 rows → zero data-loss risk.**
- **B · Historical ALTER recovery (2 blocking + 3 drift):** blocking = `apartments.landlord_id`,
  `apartments.moderation_status`; drift = `rejection_reason`, `source`, `fts_content`. The
  `landlord_id` ADD COLUMN survives only in the archived stub (`…_stub.sql:85`); `moderation_status`
  survives nowhere in-tree.
- **C · Replay-order repair (4 objects / 2 file renames):** `event_grounding`, `rental_grounding`,
  `venue_source_evidence` (all `data045`), `search_logs` (`data047`) — in-tree CREATEs that sort
  **after** their `data049` consumer. Fixed purely by re-timestamping 2 migration files; no DDL authored.
- **D · Archived-stub recovery (1, already done):** the landlord base-table stub → recovered as **B1**.
  The `apartments.landlord_id` ADD COLUMN lives in the *same* archived stub (folds into B2).
- **E · Orphaned FK targets (2):** `event_media_assets` (1 inbound FK from the `#54` restore migration —
  this is *why* it blocks before `data049`), `approval_requests` (**6 inbound FKs — a hub**; must be
  created before its dependents in any faithful recovery).

### 9.4 Blast radius per object (live prod, read-only)

| Object | cols | RLS | policies | triggers | indexes | inbound FKs | rows |
|---|---|---|---|---|---|---|---|
| `event_media_assets` | 19 | ✅ | 2 | 1 | 6 | 1 | 0 |
| `approval_decisions` | 6 | ✅ | 2 | 1 | 3 | 0 | 0 |
| `approval_requests` | 14 | ✅ | 2 | 0 | 4 | **6** | 0 |
| `email_outbox` | 16 | ✅ | 1 | 0 | 7 | 0 | 0 |
| `event_wait_list` | 12 | ✅ | 5 | 0 | 7 | 0 | 0 |
| `event_grounding` | 7 | ✅ | 2 | 0 | 2 | 0 | 0 |
| `rental_grounding` | 7 | ✅ | 2 | 0 | 2 | 0 | 0 |
| `venue_source_evidence` | 11 | ✅ | 2 | 0 | 3 | 0 | 20 |
| `search_logs` | 16 | ✅ | 3 | 0 | 4 | 0 | 58 |
| `apartments.landlord_id` | — | (parent) | — | — | 1 partial idx | — (FK→landlord_profiles) | 0 populated / 44 |
| `apartments.moderation_status` | — | (parent) | — | consumed by 1 trigger | — | — | 44 (all `'pending'` default) |

Every orphan already has **RLS enabled + ≥1 policy in prod** — a faithful recovery migration must
re-declare RLS + policies (satisfies the hard rule) but introduces **no new policy decisions**; it
mirrors what prod already enforces.

### 9.5 Full replay timeline (after B1, with gaps marked)

```
remote_schema ─#1… ─#26 [B1: landlord stack ✅] ─#27 ✗ apartments.landlord_id ───────────┐ (B2)
   … ─#54 ✗ event_media_assets (FK target, restore) ──────────────────────────────────┐ (B3)
   … ─#70 data049 ✗ approval_decisions/approval_requests/email_outbox/event_wait_list ──┘ (B3)
                  ✗ event_grounding/rental_grounding/venue_source_evidence (data045) ──┐ (B4 re-order)
                  ✗ search_logs (data047) ───────────────────────────────────────────┘
   … data040 ✗ apartments.moderation_status (trigger WHEN) ───────────────────────────── (B2)
   … ─#79 data044 (final) ✅  ← replay reaches end once B2+B3+B4 applied
```

Dependency ordering that the repair must honor:
`landlord_profiles` (B1) → `apartments.landlord_id` (B2, FK into landlord_profiles) →
`event_media_assets`/orphans (B3, before `#54` restore + `data049`) →
`apartments.moderation_status` (B2, before `data040`) →
re-timestamp `data045`/`data047` before `data049` (B4).

### 9.6 Incremental stabilization vs foundational bootstrap

**Recommendation: incremental stabilization — do NOT author a foundational bootstrap/squash.**

- The history is **mostly sound**: only **4 discrete repair units** (B1 done + B2 + B3 + B4) stand
  between the current tree and a clean end-to-end replay, and the scratch run **proves** those four
  linearize the whole chain.
- A bootstrap squash would **discard the audit trail** of 77 migrations, risk **diverging** from the
  122-table prod, and re-derive RLS/policies that prod already enforces — high effort, high risk, no
  payoff when only ~6% of objects are gapped.
- All data-bearing gaps (`search_logs` 58, `venue_source_evidence` 20) are **inversions with in-tree
  CREATEs** — they need *ordering*, not recreation, so no data is at stake. Every *recreated* object
  (the 5 orphans) is **empty**.

### 9.7 Remaining replay debt — estimate

| Unit | Work | Objects | Status |
|---|---|---|---|
| **B1** | early landlord base-tables migration | 4 tables + 1 fn | ✅ authored & shadow-validated |
| **B2** | early `apartments` ALTER (landlord_id + moderation_status; optionally 3 drift cols) | 2 (+3) columns | ⬜ to author (1 file) |
| **B3** | early orphan-table recovery (faithful prod DDL + RLS/policies) | 5 tables | ⬜ to author (1 file, largest) |
| **B4** | re-timestamp `data045` + `data047` before `data049` | 4 tables, 2 renames | ⬜ rename only, 0 DDL |

**Total remaining debt ≈ 2 new migrations + 2 file renames.** No further blockers exist beyond these
(empirically: replay completes once all four are in place). B3 is the bulk of the effort (faithful
extraction of 5 prod tables incl. the 6-FK `approval_requests` hub).

### 9.8 Safest repair sequencing (when the gate opens — NOT executed here)

1. **B4 first (lowest risk, zero DDL):** rename `data045`→`20260530120700`, `data047`→`20260530120800`.
   Pure ordering; removes 4 gaps; reversible.
2. **B3 (orphan recovery):** one migration timestamped just after `remote_schema` (≤ `20260404…`, before
   the `#54` restore). Faithful `CREATE TABLE IF NOT EXISTS` for the 5 tables — **`approval_requests`
   before any dependent** — each with RLS + its prod policies. All targets empty → safe.
3. **B2 (apartments ALTERs):** one early migration at `20260430140500` (after B1 so the
   `landlord_profiles` FK target exists): `ADD COLUMN IF NOT EXISTS landlord_id …` +
   `moderation_status text NOT NULL DEFAULT 'pending'`. Idempotent; coexists with `#51`'s guarded FK
   and `data040`'s trigger.
4. **Re-validate** via the same shadow replay (now no probes); expect 79/79 clean apply.
5. **Then** (separate gated step) `supabase migration repair` for any prod/history divergence — never
   in this characterization track.

> Risk ordering rationale: B4 (rename) < B3 (empty-table create) < B2 (column add on 44-row table,
> still trivial). None touch data; all are `IF NOT EXISTS`/guarded → re-runnable.

### 9.9 Disposition

- **Replay fully characterized:** 15 gaps total — 4 fixed (B1), 11 outstanding across 3 repair units
  (B2/B3/B4). Empirically proven to linearize.
- **Scratch tree `/tmp/data050-arch` is disposable** — probes never committed; deleted after this run.
- **No live mutation. No migration authored. No `db push` / `repair`.** Authoring B2/B3/B4 is the next,
  separately-gated iteration.
