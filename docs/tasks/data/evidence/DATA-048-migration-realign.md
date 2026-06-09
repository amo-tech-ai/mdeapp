# DATA-048 — migration realign evidence

**Verified:** 2026-06-01 (UTC) · Supabase CLI `2.100.0` · linked project `zkwcbyxiwklihegjhuql`
**Method:** read-only `supabase migration list` + Docker shadow `supabase db diff --from migrations`. **No `db push`, no `migration repair`, no live-DB write.**

> Continuation of the 2026-05-31 work (11 clean prefix renames already on disk). This pass added CLI linkage, a schema-reproducibility replay, and uncovered two findings that change the closure picture.

---

## 1. Commands run (all read-only against live)

```bash
cd /home/sk/mdeai                      # supabase/ → mdeapp/supabase (symlink)
supabase init                          # wrote supabase/config.toml (local-only, untracked)
supabase link --project-ref zkwcbyxiwklihegjhuql
supabase migration list --db-url "$DATABASE_URL"        # read-only history compare
supabase db diff --from migrations --to "$DATABASE_URL" --use-migra   # Docker shadow replay
```

`--db-url "$DATABASE_URL"` (pooler conn string from repo `.env.local`) was used instead of
`--linked` because `--linked` SASL-auth'd with the link password and failed; the pooler URL is
the known-good path. Nothing about this is a write.

---

## 2. Authoritative drift — `supabase migration list` (2026-06-01)

Remote `schema_migrations` = **75** versions · local files = **73** (after data049 restore, below).
**5 one-sided rows remain:**

| Version | Local file? | Remote row? | Note |
|---|---|---|---|
| `20260524024015` restore_post_mvp_landlord_stack | ❌ | ✅ | content lives inside tangled `20260524140000` |
| `20260524024105` restore_post_mvp_verification_analytics | ❌ | ✅ | ″ |
| `20260524024110` restore_post_mvp_saved_places_bookings | ❌ | ✅ | ″ |
| `20260524024118` restore_post_mvp_sponsor_whatsapp | ❌ | ✅ | ″ |
| `20260524140000` restore_post_mvp_landlord_sponsor_whatsapp | ✅ | ❌ | tangled file = **union** of the 4 above |

All other 70 rows pair cleanly `Local | Remote`. (Cosmetic: `20260509240000` prints its raw
version in the Time column because `24:00:00` is not a valid clock time — both sides present, fine.)

---

## 3. Finding A — data049 file was lost to a branch switch (HEALED)

Remote has version `20260531215952` (data049 advisor remediation, applied via MCP on 2026-05-31).
Its local file was committed on **`75731c9`** — but that commit is **not in the current branch
`feat/ux-036-restaurant-fast-path`**, and on this branch the entire `supabase/migrations/` dir is
**untracked**. The branch switch therefore deleted the tracked data049 file from the working tree
(untracked siblings survived). This is the agent-branch-switch hazard noted in MEMORY.md.

**Action taken (safe):** restored the exact committed blob — no reconstruction, exact remote prefix:
```bash
git show 75731c9:supabase/migrations/20260531215952_data049_advisor_remediation.sql \
  > supabase/migrations/20260531215952_data049_advisor_remediation.sql
```
This re-pairs the `20260531215952` row. Drift returned from 6 → 5 one-sided rows.

---

## 4. Finding B — repo cannot replay from scratch (PRE-EXISTING, orthogonal to prefix drift)

`supabase db diff --from migrations` applies every local migration to a fresh Docker shadow, then
diffs vs remote. It **fails to replay**, in two stages:

1. **`20260501204538_landlord_v1_response_metrics.sql`** → `ERROR: relation "public.landlord_inbox" does not exist`.
   `landlord_inbox` / `landlord_profiles` / `analytics_events_daily` were **created directly in prod
   via SQL in early sprints and never migration-tracked** (confirmed by the header of
   `_archive-not-on-remote/20260430140000_landlord_v1_base_tables_stub.sql`). They have **no remote
   `schema_migrations` row**, and the stub is deliberately kept out of the push path. So a from-scratch
   replay has nothing creating them.

2. Temporarily staging that stub into the replay path advances past stage 1, then fails at
   **`20260524024419_restore_post_mvp_trip_planner.sql`** → `ERROR: relation "public.saved_places" does not exist`.
   On remote, `saved_places` is created at `20260524024110`; locally it lives **inside** the tangled
   `20260524140000` file, which sorts **after** `024419`. **The tangled file's wrong (late) timestamp
   actively breaks replay ordering** — hard evidence that splitting it into the 4 correctly-timestamped
   files is the correct fix, not merely cosmetic history bookkeeping.

   (The stub stage was a local shadow-only test; the temp copy was removed immediately. Working tree
   ends at 73 `.sql` files, tangled file byte-for-byte unchanged.)

**Consequence:** DATA-048 **goal #4** ("fresh `db push` is a no-op") is **not reachable by prefix
realignment alone**. Two independent blockers: (B1) out-of-band base tables with no migration, and
(B2) the tangled-file ordering — only B2 is in DATA-048's stated scope.

---

## 4b. RESOLUTION — Option 1 (split) executed with user authorization (2026-06-01)

User explicitly authorized the split. Performed **filename/partition only — zero SQL-body change, zero
live-DB mutation:**

1. Backed up combined file → `/tmp/data048_backup/`.
2. Sliced the verified section boundaries into 4 prefix-matched files, each wrapped `BEGIN;…COMMIT;`:
   | New file | Remote version | Source lines |
   |---|---|---|
   | `20260524024015_restore_post_mvp_landlord_stack.sql` | `20260524024015` | 4–226 |
   | `20260524024105_restore_post_mvp_verification_analytics.sql` | `20260524024105` | 230–351 |
   | `20260524024110_restore_post_mvp_saved_places_bookings.sql` | `20260524024110` | 356–454 |
   | `20260524024118_restore_post_mvp_sponsor_whatsapp.sql` | `20260524024118` | 459–660 |
3. **Content-integrity proof:** concatenated split bodies vs original = **554 vs 554 non-blank lines,
   `diff` empty (byte-identical SQL).** All 14 tables partitioned exactly once.
4. Deleted the combined `20260524140000_*.sql`.

**Post-split verification (read-only):**
- `supabase migration list --db-url` → **zero one-sided rows**, 76 rows all `Local | Remote`. The 4
  restore versions now pair; the local-only `20260524140000` row is gone. **Goals #1–#3 met.**
- `supabase db diff --from migrations` (shadow, stub staged for the out-of-band base tables) →
  replay now **advances cleanly through all 4 split files in order** (`024015 → 024105 → 024110 →
  024118`), past the old `saved_places`/`024419` ordering failure. **B2 is fixed.** It then stops at
  `event_media_assets` — *another* out-of-band prod table (same class as B1), confirming the replay
  blocker is now purely the broad "prod objects never migration-tracked" condition, not prefix drift.

## 5. What it would take to finish — gated decisions (Option 1 DONE; Option 2 N/A)

### Option 1 — split the tangled file ✅ DONE (2026-06-01, user-authorized)

Executed as described in §4b. Fixed history rows 1–5 **and** replay ordering B2. Zero live-DB change.

### Option 2 — `supabase migration repair` — NOT NEEDED (history now aligns via files)

Was the fallback; unnecessary because Option 1 reconciled history at the file level with no remote
`schema_migrations` mutation. Recorded for completeness only — **not run.**

### Blocker B1 (out of DATA-048 scope) — base tables never migration-tracked

To make a fresh clone truly replayable, the prod-only base tables (`landlord_profiles`,
`landlord_inbox`, `analytics_events_daily`, and `saved_places`/`bookings` dependency timing) need a
proper early migration + matching `migration repair`. Recommend a **separate ticket** — flagged, not
done here.

---

## 6. Acceptance-criteria status

| AC | State |
|---|---|
| `config.toml` exists + linked | ✅ (`supabase init` + `link`; config.toml is local/untracked) |
| No duplicate local prefixes | ✅ (resolved 2026-05-31) |
| `migration list` zero one-sided rows | ✅ — split executed; 76 rows all `Local \| Remote` |
| `db diff` empty | ❌ — replay reaches end of restore set but stops at out-of-band base tables (B1: `landlord_inbox`, `event_media_assets`, …) → **separate ticket** |
| Drift table A+B resolved + evidence saved | ✅ — A resolved (split + data049 restore); B resolved (saved/pull-from-git); evidence = this file |
| Single source of truth reconciled | ✅ for history; ⚠️ replay-from-scratch needs B1 ticket |

**Verdict:** The prefix-realignment core of DATA-048 is **DONE** — repo↔remote history now matches with
zero one-sided rows, no duplicate prefixes, and the replay-ordering bug (B2) caused by the tangled
file's wrong prefix is fixed. **No live database state was changed.** One AC (`db diff` empty) remains
blocked by a *pre-existing, broader* issue — prod base tables (`landlord_inbox`, `landlord_profiles`,
`analytics_events_daily`, `event_media_assets`, likely more) were created out-of-band and never
migration-tracked. That is **out of DATA-048's stated scope** and should be its own ticket. Two caveats
for the maintainer: (1) all 76 migration files + the split are currently **untracked on branch
`feat/ux-036-restaurant-fast-path`** and need to be committed on the correct DATA branch; (2) backup of
the original combined file is at `/tmp/data048_backup/`.
