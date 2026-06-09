---
id: EVT-AUDIT-05
title: ALL-EVENTS-DATA-MODEL — live Supabase forensic audit
linear: SAN-492
related: SAN-858
linear_url: https://linear.app/sanjiovani/issue/SAN-858/data-quality-events-ownership-classification
probed: 2026-06-09
project: zkwcbyxiwklihegjhuql
auditor: task-verifier · mde-supabase · Supabase MCP
grade: A-
percent_correct: 90
readiness: 88
verdict: GO migration branch · NO-GO prod apply · NO-GO SAN-493–502 code until migration
---

# Forensic Audit — ALL-EVENTS-DATA-MODEL (live)

> **SoT under review:** [`../data/ALL-EVENTS-DATA-MODEL.md`](../data/ALL-EVENTS-DATA-MODEL.md)  
> **Prior audit:** [`04-data-model-audit.md`](./04-data-model-audit.md)  
> **Ownership follow-up:** Linear **SAN-858** · DATA-QUALITY · Events Ownership Classification

## Final verdict

| Metric | Value | Dot |
|--------|------:|:---:|
| **Audit accuracy** | **90/100** | 🟢 |
| **Document grade** | **A-** | 🟢 |
| **Model readiness** | **88/100** | 🟢 |
| **Prod apply** | **NO-GO** (human sign-off) | 🔴 |
| **Blind `organizer_id` backfill** | **REJECTED** (0-row fix) | 🔴 |

---

## Live probes (verified this session)

```sql
-- Published events ownership (49 published rows)
null_organizer: 31
null_org AND created_by NOT NULL: 0   -- created_by backfill fixes ZERO rows
null_org AND created_by NULL: 31
with_host_display: 18

-- Partners (2 rows)
both type=host, status=draft — zero type=venue, zero active

-- SAN-492 state
venue_event_offerings / venue_event_packages: absent
partner_locations: 12 cols (no accepts_event_bookings yet)
latest applied migration: 20260608202427_san135_backfill_event_host_display
authored not applied: 20260609120000_san492_event_venue_offerings.sql
```

---

## What is correct 🟢

| Item | Verdict |
|------|---------|
| 31 published events missing `organizer_id` | 🟢 True |
| All 31 also have `created_by` NULL | 🟢 True (kills naive backfill) |
| 18/49 published have `details.host_display` | 🟢 True |
| 0 venue partners / 0 `partner_locations` | 🟢 True |
| `restaurants` has no `event_offerings` column | 🟢 True |
| SAN-492 not applied to prod | 🟢 True |
| Migration branch exists on disk only | 🟢 True |
| SAN-493 must **create** venue partners from scratch | 🟢 True |
| `partner_locations` reuse model (no `partner_venues`) | 🟢 True |
| `bookings.booking_type='event'` + `partner_status` CHECK live | 🟢 True |
| `events_venue_fkey` formal FK | 🟢 True |

---

## Corrections applied (doc + audit)

| Issue | Fix | Status |
|-------|-----|--------|
| Wrong backfill `organizer_id = created_by` | **Rejected** — 0 rows; use **SAN-858** classification | 🟢 Fixed in audit |
| Wrong SAN-494 join | `restaurants.google_place_id = partner_locations.google_place_id` | 🟢 Patched in ALL-EVENTS |
| Readiness mismatch (84 vs 88) | Standardize **88** | 🟢 Patched |
| Missing `offering_key` | Added to §10 + ERD | 🟢 Patched |
| Missing migration pointer | `mdeapp/supabase/migrations/20260609120000_san492_event_venue_offerings.sql` AUTHORED NOT APPLIED | 🟢 Patched |
| Missing data-quality § | §13.5 live gaps | 🟢 Patched |
| ERD `partners` column label | `type partner_type` (not `partner_type type`) | 🟢 Patched |

---

## Events ownership — correct framing (not “Organizer Backfill”)

**31 published rows** with `organizer_id` NULL and `created_by` NULL are likely **discovery/imported catalogue events**, not host-wizard rows missing a column.

| Option | Action | When |
|--------|--------|------|
| **A** | Classify as discovery; keep `organizer_id` NULL | Default if `source` ≠ `host_wizard` |
| **B** | Assign system/admin organizer | Platform-owned catalogue only |
| **C** | Backfill only rows with **proven** owner evidence | Manual audit per row |

**Do not** run `UPDATE events SET organizer_id = created_by WHERE organizer_id IS NULL` — **fixes 0 rows**.

Tracked: **SAN-858** · DATA-QUALITY · Events Ownership Classification.

---

## Blockers matrix

| # | Sev | Item | Blocks |
|---|-----|------|--------|
| B1 | 🔴 | SAN-492 migration not applied | SAN-493–502 |
| B2 | 🔴 | SAN-178 G1 live ticket proof | SAN-115 → SAN-857 |
| B3 | 🟡 | 31 orphan published events (ownership TBD) | Host list completeness · SAN-858 |
| B4 | 🟡 | Zero venue-capable partners | SAN-493 demo |
| B5 | 🟡 | Patricia `bookings_admin_*` RLS in unapplied migration | SAN-502 |
| B6 | 🟡 | VEN-001 `event_offerings` spec drift | SAN-494 |
| B7 | ⚪ | Human ERD sign-off | Prod migration |

---

## Corrected execution order

```text
1. SAN-178  PAY-001 live ticket (Core) — blocks SAN-115
2. SAN-492  EVT-033 migration PR review (SQL + RLS smoke + get_advisors) — NO live apply
3. SAN-510/511/512/513/514  wires in parallel (no schema)
4. SAN-493  seed after 492 apply — CREATE venue partners + locations
5. SAN-494–502  venue UI chain
6. SAN-858  DATA-QUALITY ownership classification (parallel research — no blind SQL)
7. SAN-857  browse panel after SAN-115
```

---

## Scoring rubric

| Weight | Criterion | Score |
|--------|-----------|------:|
| 25% | Live inventory accuracy | 95% |
| 25% | Architecture (`partner_locations` reuse) | 91% |
| 20% | SAN-492 plan ↔ migration SQL | 90% |
| 15% | RLS / governance | 88% |
| 15% | Task-chain alignment | 85% |
| | **Weighted** | **90%** → **A-** |

---

## Safe next task

**SAN-178** (P0 prod ticket proof) in parallel with **SAN-510/511** wires and **SAN-492** migration PR review — **no DDL on prod**.
