---
title: DATA workstream — forensic audit & live deployment tracker
date: 2026-06-01
auditor: claude (senior software specialist / forensic auditor)
project: zkwcbyxiwklihegjhuql (Supabase, live)
method: Supabase MCP (execute_sql, list_migrations, get_advisors security+performance) + disk evidence + shadow-replay archaeology (DATA-050 §9)
plan_under_audit: tasks/data/plan/data-intelligence-plan.md (V1, 2026-05-31)
index_under_audit: tasks/data/tasks-data/INDEX-data.md (2026-05-30/31)
constraints: read-only — no live mutation, no db push, no migration repair, no migrations authored
---

# DATA forensic audit — live 2026-06-01

**Process:** 1·Examine → 2·Verify (MCP SQL on live) → 3·Validate (exact counts, no `reltuples`) → 4·Measure (% per task) → 5·Identify (red flags / blockers / fixes).

**Status legend:** 🟢 Complete · 🟡 In Progress · 🟥 Blocked / Failing · ⚪ Not Started.

---

## 0. Executive verdict

> **The data-intelligence stack IS deployed and version-tracked.** All 6 search RPCs, the embed-enqueue triggers on all 3 catalogs, the per-domain HNSW indexes, the signals tables, and the `data039→data047` migrations are live on `zkwcbyxiwklihegjhuql`. RLS covers **113/114** public tables (the 1 gap is PostGIS `spatial_ref_sys` — non-actionable). **Embeddings are ~95% backfilled** (apartments 44/44, restaurants 43/44, events 43/49).
>
> **Two real gaps remain, neither MVP-blocking for search:** (1) the **evidence/grounding layer is venue-only** — `event_grounding`/`rental_grounding` exist but are **empty (0 rows)**, and `event_source_evidence`/`rental_source_evidence`/`venue_grounding` **do not exist**; (2) the **migration tree does not replay from scratch** (DATA-050 reproducibility debt — fully characterized, repair gated on human approval).

| Dimension | Live verdict | Evidence |
|---|---|---|
| Intelligence tables deployed | 🟢 **Yes** — signals + embeddings + jobs + venue evidence all present, RLS+policy on each | §2, §6 |
| Search RPCs deployed + hardened | 🟢 **Yes** — 6/6 live, `search_path=''` | §2 |
| Embed pipeline (trigger→queue→worker) | 🟡 **Half** — triggers + queue live; embeddings backfilled **directly** (`embedding_jobs`=1, idle); loop unproven | §3-R1 |
| Evidence / grounding layer | 🟡 **Venue-only** — event/rental grounding empty; 3 evidence tables missing | §3-R2 |
| Migration reproducibility | 🟥 **Tree won't replay clean** — DATA-050 debt | §3-R3, §7 |
| Security posture | 🟢 **Strong** — 1 ERROR is a known false positive; 2 always-true policies on orphan tables | §6 |
| **INDEX-data.md accuracy** | **~93% correct** — 4 stale/overclaimed rows corrected in §4 | §4 |

**Headline number: the live DB is ~93% consistent with the INDEX claims** — strong, with four forensic corrections (DATA-045 overclaimed, migration-drift figure stale, neighborhoods count off-by-one, DATA-050 understated).

---

## 1. Live deployment tracker (core MVP first)

Columns per the requested template. Counts are **exact `count(*)`**, verified 2026-06-01.

### 1a. Core intelligence stack (the MVP search loop)

| Task / Object | Description | Status | % | ✅ Confirmed (live) | ⚠️ Missing / Failing | 💡 Next Action |
|---|---|---|---|---|---|---|
| VEC-001 | pgvector HNSW dedup | 🟢 | 100% | Exactly **1 HNSW idx per** embeddings table (`event/listing/restaurant_embeddings_hnsw`); no duplicates | — | None |
| DATA-039 | restaurants schema patch | 🟢 | 100% | restaurants **44/44** w/ neighborhood + place_id | — | None |
| DATA-040 | `embedding_jobs` queue + triggers | 🟢 | 100% (infra) | Table live; `trg_enqueue_embed_{apartment,event,restaurant}` **all enabled** → `enqueue_embedding_job` (secdef, `search_path=public`) | Queue **idle (1 row)** — loop never exercised end-to-end | Run one live INSERT→job→worker cycle to prove the loop (R1) |
| DATA-041 | `venue_signals` + seed | 🟢 | 100% | **30** rows | Human QA top-30 (off-DB) | Close [`DATA-041 human-qa`](../evidence/DATA-041-venue-signals-human-qa.md) |
| DATA-042 | `event_signals` + seed | 🟢 | 100% | **49** rows | — | None |
| DATA-043 | `rental_signals` + seed | 🟢 | 100% | **44** rows | — | None |
| DATA-044 | `neighborhood_profiles` | 🟢 | 100% | **8** profiles | Only **8 of 13** neighborhoods profiled (62%) | Profile remaining 5 (low priority) |
| DATA-045 | evidence / grounding tables | 🟡 | **~45%** | `venue_source_evidence` **20 rows**; `event_grounding`+`rental_grounding` tables exist | `event_grounding`=**0**, `rental_grounding`=**0**; `venue_grounding`, `event_source_evidence`, `rental_source_evidence` **do not exist** — layer is venue-only + heterogeneous | Decide canonical evidence shape across domains; seed via AI-004 |
| DATA-047 | `search_logs` observability | 🟢 | 100% | Migration applied (latest remote `20260601120800`) | — | None |
| Embeddings backfill | vectors for semantic/hybrid | 🟢 | ~95% | apartments **44/44**, restaurants **43/44**, events **43/49** | 1 restaurant + 6 events unembedded | Re-embed the 7 stragglers |
| SEARCH-003 | restaurant hybrid (app) | 🟢 | 100% | `hybrid_search_restaurants` + `semantic_search_restaurants` live, hardened | Patricia QA ☐ | Linear SAN-388 |
| SEARCH-001 | rental hybrid (app) | ⚪ | 0% | `hybrid_search_listings`/`semantic_search_listings` **RPCs already live** | App wiring not started | Wire app to existing RPC (low cost — RPC done) |
| SEARCH-002 | event hybrid (app) | ⚪ | 0% | `hybrid_search_events`/`semantic_search_events` **RPCs already live** | App wiring not started | Wire app to existing RPC (low cost — RPC done) |
| AI-003 | signal enrichment batch | ⚪ | 0% | Signals tables seeded (baseline) | Enrichment batch not run | Phase 1b |
| AI-004 | grounding verification | ⚪ | 0% | Grounding tables exist (event/rental) | 0 grounding rows anywhere except venue evidence | Phase 1b — unblocks DATA-045 |
| DATA-046 | golden queries v2 | ⚪ | 0% | Spec on disk | Not written | Phase 1b |

### 1b. Migration reproducibility (DATA-048 / DATA-050)

| Task | Description | Status | % | ✅ Confirmed (live) | ⚠️ Missing / Failing | 💡 Next Action |
|---|---|---|---|---|---|---|
| DATA-048 | realign migration prefixes repo↔remote | 🟡 | ~90% | Remote history **reconciled to 76 rows, no one-sided drift** (was 11/15); intelligence stack applied | `db diff` not yet empty — blocked by the out-of-band base tables (B1 → DATA-050) | Commit reconciliation on the DATA branch |
| DATA-050 | backfill migrations for out-of-band prod objects | 🟡 | **~45%** | **Archaeology complete** — 15-gap inventory, 5 categories, blast radius, sequencing ([`evidence §9`](../evidence/DATA-050-base-table-backfill.md)); shadow replay proven to linearize with B2/B3/B4 | **Repair NOT executed** (gated): tree still won't replay clean; `20260430140000_landlord_v1_base_tables.sql` is **local-only (unapplied)**; `apartments.landlord_id`+`moderation_status` + 5 orphan tables remain out-of-band | **Human-gated:** author B2/B3/B4 backfill migrations → `migration repair` |

---

## 2. Live object inventory (what is actually deployed)

| Object class | Live state (2026-06-01) |
|---|---|
| **Public tables** | 114; **RLS enabled on 113** (only `spatial_ref_sys` off — PostGIS system table) |
| **Catalogs** | apartments **44** · events **49** · restaurants **44** · venue_anchors **30** · neighborhoods **13** |
| **Signals** | venue_signals **30** · event_signals **49** · rental_signals **44** · neighborhood_profiles **8** |
| **Embeddings** | listing **44** (100%) · restaurant **43** (98%) · event **43** (88%); **1 HNSW index each**, no dupes |
| **Queue** | embedding_jobs **1** (idle) |
| **Evidence/grounding** | venue_source_evidence **20** · event_grounding **0** · rental_grounding **0**; `venue_grounding`/`event_source_evidence`/`rental_source_evidence` absent |
| **Search RPCs** | `hybrid_search_{events,listings,restaurants}` + `semantic_search_{events,listings,restaurants}` — **6/6 live, `search_path=''`** |
| **Embed triggers** | `trg_enqueue_embed_{apartment,event,restaurant}` — **3/3 enabled** |
| **Functions** | 987 public · 78 SECURITY DEFINER · **3** secdef without `search_path` |
| **Migrations** | remote applied **76** (latest `20260601120800` = data047) · local files **77** · drift = **1 local-only** |
| **Edge functions** | ~40 ACTIVE (mostly legacy entrypoints; data-pipeline worker not separately verified) |

---

## 3. Red flags / blockers / critical fixes

**R1 — Embed loop unproven end-to-end (🟡 medium).** Triggers + queue + worker function all exist, but `embedding_jobs` holds **1 row** while 130 catalog rows are already embedded → the backfill was done **directly/out-of-band**, not through the trigger→queue→worker loop. *Risk:* a new listing/event may never get embedded automatically; nobody has watched the loop run. *Fix:* insert one row, confirm a job enqueues and a worker drains it. *Not* MVP-blocking for existing search (vectors present).

**R2 — Evidence/grounding layer is venue-only + heterogeneous (🟡 medium).** `event_grounding`/`rental_grounding` exist but are **empty**; `venue_grounding`, `event_source_evidence`, `rental_source_evidence` **don't exist**. DATA-045 is marked Done/100% in the INDEX but is **~45%** in reality. *Risk:* "grounded" answers for events/rentals have no provenance rows. *Fix:* pick one canonical evidence shape, then seed via AI-004. Forensic correction logged in §4.

**R3 — Migration tree won't replay from scratch (🟥 blocker for reproducibility, not for prod).** Out-of-band objects (`apartments.landlord_id`, `apartments.moderation_status`, 5 orphan tables) + a local-only base-tables migration mean `supabase db reset`/fresh CI replay fails. Fully characterized in [DATA-050 §9](../evidence/DATA-050-base-table-backfill.md). *Fix is gated* (human-approved `migration repair`) — do **not** auto-apply.

**R4 — 2 always-true RLS policies (🟡 low).** `delivery_receipts` and `email_outbox` carry `USING (true)` policies (security advisor). `email_outbox` is one of the 5 DATA-050 orphan tables. *Fix:* scope these policies during the DATA-050 orphan cleanup.

**R5 — `auth_leaked_password_protection` OFF (🟡 low, AUTH-011).** HaveIBeenPwned check disabled project-wide. *Fix:* enable in Auth settings (AUTH-011).

**R6 — Hygiene tail (⚪ low).** 3 SECURITY DEFINER functions without `search_path` (advisor flags `trigger_set_timestamps`); 14 unindexed FKs; 6 duplicate indexes; 1 table with no PK; 3 extensions in `public`. None MVP-blocking; batch into a "DATA-049b advisor remediation v2" cleanup.

---

## 4. Forensic corrections — INDEX claims vs live (~93% accurate)

| # | INDEX-data.md claim | Live reality (2026-06-01) | Verdict |
|---|---|---|---|
| C1 | DATA-045 "🟢 Completed 100% · 20 evidence rows" | venue_source_evidence 20 ✔ but event/rental grounding **0**; 3 evidence tables **absent** | **Overclaimed → 🟡 ~45%** |
| C2 | "migration version-prefix drift … 11 local-only / 15 remote-only" | DATA-048 reconciled remote to **76, no one-sided**; live drift = **1 local-only** file | **Stale → corrected** |
| C3 | neighborhoods "**12**" (live spot-check) | **13** live | Off-by-one (data added since) |
| C4 | DATA-050 "⚪ Not Started 0%" | Archaeology complete (§9): 15-gap inventory + sequencing | **Understated → 🟡 ~45%** |
| C5 | restaurants "44/44" | **44** rows ✔ (43 embedded) | **Correct** (the "43" floating around is the *embedding* count) |
| C6 | edge functions "40 ACTIVE" | ~40 ACTIVE ✔ | Correct |
| C7 | Signals 30/49/44, HNSW dedup, search_path hardening, RLS coverage | All match live | **Correct** |

---

## 5. Next steps — focus on core MVP

**Do now (cheap, high-leverage — the RPCs already exist):**
1. **Wire SEARCH-001 (rentals) + SEARCH-002 (events)** to the **already-live** `hybrid_search_listings` / `hybrid_search_events` RPCs. This is app glue, not DB work — the expensive half is done.
2. **Re-embed the 7 stragglers** (1 restaurant + 6 events) so semantic coverage is 100%.
3. **Prove the embed loop (R1):** one INSERT → confirm `embedding_jobs` enqueues → worker drains.

**Do next (correctness / honesty):**
4. **Resolve DATA-045 (R2):** decide the canonical evidence/grounding shape, drop the heterogeneity, seed via AI-004.
5. **Enable leaked-password protection (R5, AUTH-011).**

**Gated (human-approved only):**
6. **DATA-050 repair (R3):** author B2/B3/B4 backfill migrations + `migration repair`. Do not auto-run.

**Defer (Phase 1b / P2):** AI-003 enrichment, DATA-046 golden v2, neighborhood_profiles 9–13, advisor-remediation v2 (R6).

---

## 6. Advisor summary (security + performance)

**Security — 121 lints (1 ERROR, 120 WARN):**
- `rls_disabled_in_public` × **1** — `spatial_ref_sys` (PostGIS system table; **non-actionable false positive**).
- `*_security_definer_function_executable` × **113** — standard Supabase noise for SECURITY DEFINER RPCs callable by anon/authenticated; expected, not a finding.
- `rls_policy_always_true` × **2** — `delivery_receipts`, `email_outbox` (R4).
- `function_search_path_mutable` × **1** — `trigger_set_timestamps` (R6).
- `extension_in_public` × **3** — pg_trgm, postgis, vector (R6).
- `auth_leaked_password_protection` × **1** — OFF (R5).

**Performance — 430 lints (106 WARN, 324 INFO):**
- `unused_index` × **309** (INFO) — **expected noise**: freshly-seeded tables never scanned; HNSW + new covering indexes show "unused" until queried. Not a finding.
- `multiple_permissive_policies` × **100** (WARN) — incl. embeddings tables (anon+authenticated SELECT); minor eval cost.
- `unindexed_foreign_keys` × **14** · `duplicate_index` × **6** · `no_primary_key` × **1** — batch into R6 cleanup.

*No MVP-blocking performance issue on the intelligence stack.*

---

## 7. Migration reproducibility debt (DATA-050)

Local tree **77** files; remote applied **76**; intelligence stack `data039→data047` **all applied**. The single version-level drift is **`20260430140000_landlord_v1_base_tables.sql` (local-only, unapplied)**. Beyond version accounting, prod carries **out-of-band objects no migration creates in order**: `apartments.landlord_id`, `apartments.moderation_status`, and 5 orphan tables (`event_media_assets`, `approval_decisions`, `approval_requests`, `email_outbox`, `event_wait_list`). A fresh replay therefore **breaks** at the first consumer. Full 15-gap inventory, 5 categories, blast-radius, and B2→B3→B4 sequencing are in [DATA-050 §9](../evidence/DATA-050-base-table-backfill.md). **Recommendation: incremental stabilization** (≈2 backfill migrations + 2 renames), repair **human-gated**. Zero data at risk (orphans empty; data-bearing objects need reorder only).

---

## 8. Verification appendix (queries run 2026-06-01, read-only)

All against `zkwcbyxiwklihegjhuql` via Supabase MCP `execute_sql` / `get_advisors` / `list_migrations`:
- Catalog + signal + embedding + evidence exact `count(*)` (via `query_to_xml` dynamic count — avoids `reltuples=-1`).
- Per-domain embedding coverage (`NOT EXISTS` anti-join): apartments 0 / restaurants 1 / events 6 unembedded.
- Functions: `pg_proc` × `proconfig` for secdef + `search_path`.
- Triggers: `pg_trigger` (non-internal) on the 5 catalogs + `tgenabled`.
- Vector indexes: `pg_index` × `pg_am` where `amname in ('hnsw','ivfflat')`.
- RLS coverage: `pg_class.relrowsecurity` count vs `pg_tables`.
- Migration drift: `supabase_migrations.schema_migrations` presence checks + count.
- Advisors: security (121) + performance (430), parsed out-of-context from saved tool-result files.

**Constraints honored:** no live mutation · no `db push` · no `migration repair` · no migrations authored · connection strings never sourced · `execute_sql` output treated as untrusted.
