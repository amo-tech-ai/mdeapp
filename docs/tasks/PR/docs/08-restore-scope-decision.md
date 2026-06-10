---
title: PR-08 — restore_post_mvp_* scope decision
date: 2026-06-01
main_sha: c9e54b8
data_branch: data/DATA-048-migration-realign
decision_by: agent + disk evidence (human merge gate still required)
blocks: PR-04, SAN-446
related: SAN-445 (DATA-050)
---

# PR-08 — `restore_post_mvp_*` scope decision

## Verdict

| Family | Decision | Rationale |
|--------|----------|-----------|
| **`restore_post_mvp_*` (5 files)** | **KEEP in C1** | Already applied on remote prod; version IDs match `schema_migrations`; DATA-048 split them cleanly; deferring breaks replay order and FK wiring |
| **Landlord B1 base tables (`20260430*` early family)** | **INCLUDE via DATA-050 in same C1 train** | Shadow replay fails without `landlord_inbox` / `landlord_profiles` / `analytics_events_daily`; author from live schema + `migration repair --status applied` — **no DDL re-run on prod** |
| **Landlord app / product features** | **DEFER Phase 2** | Camila MVP does not query landlord stack; migrations for replay only |

**PR-04 may open** once DATA-050 B1 migrations are authored and reviewed (human gate before `migration repair`).

---

## Objects in `restore_post_mvp_*` family

Source: `data/DATA-048-migration-realign` → `supabase/migrations/`

| Migration prefix | File | Creates (summary) |
|------------------|------|-------------------|
| `20260524024015` | `restore_post_mvp_landlord_stack.sql` | `landlord_profiles`, inbox, landlord events |
| `20260524024105` | `restore_post_mvp_verification_analytics.sql` | `verification_requests`, `analytics_events_daily` |
| `20260524024110` | `restore_post_mvp_saved_places_bookings.sql` | `saved_places`, booking extensions |
| `20260524024118` | `restore_post_mvp_sponsor_whatsapp.sql` | `event_sponsors`, WhatsApp tables |
| `20260524024419` | `restore_post_mvp_trip_planner.sql` | `trips`, collections; re-wires FKs on `saved_places` |

Each header states: *matches remote `schema_migrations` version* — these are **history fidelity**, not net-new prod DDL.

---

## Forward-dependency scan

| Later consumer | Depends on | If deferred? |
|----------------|------------|--------------|
| `20260524024419` trip planner | `saved_places.trip_id` FK | **Cannot defer** trip restore without leaving broken FK intent |
| `20260501204538_landlord_v1_response_metrics` | `landlord_inbox` | Needs **DATA-050 B1** *before* this timestamp (not `restore_post_mvp`) |
| `event_sponsor_placements` chain | `event_media_assets` | DATA-050 B1 — separate early migration |
| Phase 1 app (`/`, `/rentals`, `/chat`) | rentals, events, profiles | **No** dependency on sponsor/trip/landlord UI tables |

**Conclusion:** Trimming `restore_post_mvp_*` from C1 would desync local replay from prod history without shrinking Phase 1 app scope. **Keep all five.**

---

## DATA-050 B1 (separate from restore_post_mvp)

| Item | Action |
|------|--------|
| Preserved SQL | [`evidence/20260430140000_landlord_v1_base_tables.sql.preserved`](../evidence/20260430140000_landlord_v1_base_tables.sql.preserved) — **reference only** |
| Stub (do not push as-is) | `migrations/_archive-not-on-remote/20260430140000_landlord_v1_base_tables_stub.sql` on DATA branch |
| Authoring | Scoped `pg_dump` from live prod → early-prefix migration(s) sorting **before** `20260501204538` |
| Prod apply | `supabase migration repair --status applied <version>` only — tables already exist |

Landlord **product** PR (`feat/landlord-v1-base`) waits on human sign-off after B1 repair plan; **migrations** ship in C1 for replay.

---

## PR-04 C1 extract checklist

```bash
cd mdeapp
git checkout main
git checkout -b data/c1-supabase-migrations
git checkout data/DATA-048-migration-realign -- supabase/migrations/
# Do NOT checkout functions/seeds/rollbacks — PR-05/06/07
ls supabase/migrations | sed -E 's/_.*//' | sort | uniq -d   # must be empty
```

Expected: **~76** live migration files + `_archive-not-on-remote/` (not in push path).

After DATA-050 B1 files are added: shadow-replay on disposable branch → then open PR → update SAN-446.

---

## Sign-off

- [x] `restore_post_mvp_*` enumerated (5 files)
- [x] Forward-dependency scan documented
- [x] Verdict: **KEEP in C1**
- [ ] Human approval for DATA-050 `migration repair` (required before merge)
- [ ] Shadow-replay green (PR-04 acceptance)
