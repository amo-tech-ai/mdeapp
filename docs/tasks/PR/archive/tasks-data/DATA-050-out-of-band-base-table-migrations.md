---
task_id: DATA-050
mvp_step: 10.3
title: Backfill migrations for out-of-band prod base tables (replay reproducibility)
layer: DATA / process
priority: P1
status: Done
archived: 2026-06-02
main_sha: 4de18f1
prod_sha: 4de18f1
ship_pr: PR-04-08
estimated_effort: 2-3h
depends_on: ["DATA-048"]
unblocks: []
pr_gate: PR-08
linear_issue: SAN-445
verified: 2026-06-01
main_sha: c9e54b8
spec_accuracy_pct: 100
audit_dot: green
skills: [mde-task-lifecycle, mde-supabase, task-verifier]
related:
  - DATA-048-migration-version-prefix-realign.md
  - ../../data/evidence/DATA-048-migration-realign.md
  - ../../data/evidence/DATA-050-base-table-backfill.md
  - ../../../../mdeapp/supabase/migrations/
  - ../../../../mdeapp/supabase/migrations/_archive-not-on-remote/20260430140000_landlord_v1_base_tables_stub.sql
  - ../tasks/PR-08-restore-postmvp-decision.md
description: >
  DATA-048 fixed prefix drift + replay ORDERING (B2) but explicitly scoped out the
  out-of-band base-table issue (B1). Several PRODUCTION tables were created via direct
  SQL in early sprints and never committed as migrations, so they have no remote
  `schema_migrations` row and nothing in the replay path creates them — making
  `supabase db diff --from migrations` (Docker shadow replay) fail from scratch and a
  fresh clone's `supabase db push` non-empty. Author properly-ordered early base-table
  migrations sourced from the live schema, then `migration repair --status applied` to
  register them in remote history WITHOUT re-running DDL.
verified: Shadow replay failure points captured in DATA-048 evidence §4 + §4b, 2026-06-01
---

# DATA-050 — backfill migrations for out-of-band prod base tables

## At a glance

| | |
|---|---|
| **For** | Sofía (dev) / sanjiovani |
| **Surface** | `supabase/migrations/` ↔ remote `schema_migrations` (shadow replay) |
| **Layer** | DATA / process |
| **Found by** | DATA-048 shadow replay — [`../evidence/DATA-048-migration-realign.md`](../evidence/DATA-048-migration-realign.md) §4, §4b |
| **Caution profile** | **Same as DATA-048** — credentialed CLI + live-history mutation; gated behind explicit human approval. Do NOT auto-run. |

## Hard blocker — fix branch isolation FIRST

DATA-050 **must execute only from the canonical DATA remediation branch** that contains the
complete 76-file migration tree (the DATA-048 output). On the current branch
(`feat/ux-036-restaurant-fast-path`) `supabase/migrations/` is **empty / untracked** — a shadow
replay there has no inputs and any work risks being lost on the next checkout (the agent
branch-switch hazard, MEMORY.md + DATA-048 evidence §3).

**Do not start enumeration or authoring until:**
1. The canonical DATA branch exists and is checked out with all 76 migration files present, AND
2. Those files are **committed** (not untracked), so a checkout can't silently delete them again.

Execution from feature/UI branches is prohibited.

## Plain-English problem

The live database is correct. The **repo still can't rebuild it from scratch.** Several
production tables were created out-of-band — direct SQL run against prod in early sprints —
and were **never committed as migrations.** Because Supabase tracks applied migrations by the
14-digit filename prefix in `supabase_migrations.schema_migrations`, these tables have **no
remote history row at all**, and nothing in the local migration set creates them either. So a
fresh `supabase db diff --from migrations` (which replays every local migration into a clean
Docker shadow) dies the moment a *later* migration references one of these missing base objects.

This is **B1** — the issue DATA-048 explicitly scoped out. DATA-048 resolved the version-prefix
drift and fixed replay **ordering** (B2, the tangled `20260524140000` file), but it could not make
`db diff` empty because of B1. This ticket closes B1.

**Real-world:** Sofía clones the repo to stand up a clean local DB for SEARCH/AUTH work. After
DATA-048, prefixes line up and ordering is fixed — but `supabase db diff --from migrations` still
aborts at `ERROR: relation "public.landlord_inbox" does not exist`, because `landlord_inbox` was
born in prod via raw SQL and no migration ever created it. She cannot get a clean, reproducible
local database.

## Confirmed missing base objects (so far)

From the DATA-048 shadow replay (each is a distinct replay failure point or an unsatisfied FK):

| Object | How it surfaced | Evidence |
|---|---|---|
| `public.landlord_inbox` | replay fails: `20260501204538_landlord_v1_response_metrics.sql` → `relation "public.landlord_inbox" does not exist` | DATA-048 evidence §4.1 |
| `public.landlord_profiles` | same stub class; created in prod via direct SQL | §4.1 + stub header |
| `public.analytics_events_daily` | same stub class; created in prod via direct SQL | §4.1 + stub header |
| `public.event_media_assets` | after staging the stub, replay then stops here (referenced by `event_sponsor_placements.asset_id`) | §4b post-split replay |

**Likely more, NOT yet exhaustively confirmed** (treat as a discovery task — enumerate before authoring):
`public.events`, `public.apartments`, `public.profiles`, and the enums
`booking_type` / `booking_status` / `payment_status`. The full set is whatever the shadow replay
demands that has no creating migration; **drive enumeration from the replay, not from this list.**

### The smoking gun (already in the repo)

A deliberately-quarantined stub documents the root cause in its own header:

```
mdeapp/supabase/migrations/_archive-not-on-remote/20260430140000_landlord_v1_base_tables_stub.sql
  → "These tables exist in production (created via direct SQL in early sprints)
     but were never committed as local migrations."
```

It is **kept OUT of the push path on purpose** (the `_archive-not-on-remote/` dir is never
pushed). It is a marker, not a fix — it has no remote history row and must not simply be moved
into the push path (that would make `db push` try to CREATE tables that already exist in prod).

## Goals

1. Enumerate the **complete** set of out-of-band prod objects (tables + enums + dependencies) that
   the shadow replay needs but no migration creates — driven by repeated `db diff --from migrations`
   runs, not guesswork.
2. Author properly-ordered **early** base-table migrations whose 14-digit prefixes sort *before* the
   first migration that references each object, sourced from the **live schema**. **Prefer a scoped
   `pg_dump --schema-only -t <object>` of just these objects** — `supabase db pull` is a fallback only
   if its generated diff is tightly reviewed (a broad pull pulls in extension / policy / auth / storage
   noise). **Never** hand-reconstruct from MCP JSON (dollar-quote / escaping corruption risk, per the
   DATA-048 lesson).
3. Register those new versions in remote history via `supabase migration repair --status applied
   <version>` so the rows exist **without re-running the DDL** against prod.
4. `supabase db diff --from migrations` (fresh Docker shadow) replays clean and shows **no unexpected
   schema drift** — any residual diff is explicitly documented + human-approved, not silently accepted.
   This satisfies the DATA-048 AC that B1 was blocking. (Validate via `db diff` parity in a **Docker
   shadow only** — do **not** rely on running `db push` against prod to "prove" the no-op.)

## Implementation (requires linked CLI + human review — do NOT auto-run)

> **Gate:** this mutates live `schema_migrations` (the `migration repair` step) and requires the
> credentialed CLI. Treat with the **same caution profile as DATA-048** — present the plan, get
> explicit human authorization, then execute. No `db push` / `migration repair` until approved.

```bash
cd /home/sk/mdeai          # canonical supabase/ → mdeapp/supabase (symlink)
# Prereq (from DATA-048): supabase init + link already done; config.toml is local/untracked.
# If a fresh clone: supabase init && supabase link --project-ref zkwcbyxiwklihegjhuql

# 1. Enumerate — iterate until you have the full missing-object set.
#    Each run names the next unsatisfied relation/enum; add it to the list and re-run.
supabase db diff --from migrations --to "$DATABASE_URL" --use-migra   # Docker shadow replay

# 2. Source canonical DDL from the LIVE schema for ONLY these objects.
#    PREFERRED: scoped pg_dump of just the missing objects (tight, no Supabase-managed noise):
pg_dump "$DATABASE_URL" --schema-only -t public.landlord_inbox -t public.landlord_profiles \
  -t public.analytics_events_daily -t public.event_media_assets ...   # + enums (dump type defs)
#    FALLBACK: supabase db pull — only if you carefully review the generated diff; a broad pull
#    drags in extension / policy / auth / storage diffs unrelated to these base tables.
#    supabase db pull

# 3. Hand-place the resulting CREATE statements into EARLY-prefixed migration files so each
#    object is created BEFORE its first referencing migration. Suggested anchor: a single
#    20260430xxxxxx_* base-tables migration (the stub's prefix family), split by dependency
#    layer (enums → base tables → dependent tables) if ordering requires it.
#    Do NOT just un-archive the stub — author real, ordered, live-sourced DDL.

# 4. Register in remote history WITHOUT re-running DDL (these objects already exist in prod):
supabase migration repair --status applied <new_version> [<new_version> ...]

# 5. Prove reproducibility — in a Docker SHADOW only, never against prod.
supabase migration list --db-url "$DATABASE_URL"   # every row Local | Remote, no one-sided
supabase db diff --from migrations --use-migra      # no unexpected drift (residual = documented + approved)
```

## Acceptance criteria

- [ ] Complete missing-object set enumerated from the shadow replay (tables + enums + deps), recorded in `../evidence/DATA-050-base-table-backfill.md`.
- [ ] Early-prefixed base-table migration(s) authored from the **live** schema (scoped `pg_dump` preferred; reviewed `db pull` fallback), ordered before every referencing migration. Zero hand-reconstruction from MCP JSON.
- [ ] New versions registered via `supabase migration repair --status applied` — **DDL not re-run** against prod; verified no table/column change to live DB.
- [ ] `supabase migration list` shows **zero one-sided rows**.
- [ ] `supabase db diff --from migrations` (fresh **Docker shadow**) replays clean with **no unexpected schema drift** — any residual diff is documented + human-approved. Closes the DATA-048 AC that B1 was blocking.
- [ ] Reproducibility validated via `db diff` parity in a shadow DB — **not** by running `db push` against prod.
- [ ] Evidence saved to `../evidence/DATA-050-base-table-backfill.md`; localhost/CLI proof attached per task-verifier gate 9.

## Caution / approval gate

- **Live-history mutation:** step 4 (`migration repair`) inserts rows into remote
  `supabase_migrations.schema_migrations`. Inventory-only steps (`db diff`, `db pull`,
  `migration list`) are read-only/local; the repair is the one live write — **require explicit
  human authorization before running it**, same as DATA-048.
- **Never run `db push` here** as a shortcut — these tables already exist in prod; a push would
  attempt to CREATE them and error (or worse, if it didn't, double-create). `migration repair` is
  the correct register-without-DDL path.
- **Replay validation is Docker-shadow only.** Never replay the migration set against the production
  database. `db diff --from migrations` / `--use-migra` build a throwaway shadow DB — that is the only
  sanctioned replay target.
- A scoped `pg_dump` against prod was auto-mode-denied during DATA-048 and is read-only but still
  requires the same explicit approval; `supabase db pull` is the auto-sanctioned fallback if a tightly
  reviewed diff is acceptable.

## Out of scope

- The prefix-drift / tangled-file split — **done in DATA-048** (B2). This ticket is B1 only.
- New schema changes / feature DDL (this is reproducibility backfill of already-live objects only).
- The 113 SECURITY DEFINER EXECUTE advisor warnings (separate Phase-2 ticket).

## Do not overbuild

- Do not author CREATE statements for objects the replay does **not** demand — let the shadow
  replay define the exact set.
- Do not simply move `_archive-not-on-remote/…base_tables_stub.sql` into the push path; author
  real, live-sourced, correctly-ordered DDL and register via repair.
- Do not modify any existing migration SQL body — only ADD early base-table migrations + repair rows.
- ⚠️ Branch hygiene: DATA-048's migration files are currently **untracked on a feature branch**
  (`feat/ux-036-restaurant-fast-path`, per DATA-048 evidence §3). Start this work from the correct
  DATA branch with those files present, or the shadow replay will be missing inputs (agent-branch
  safety, MEMORY.md).
