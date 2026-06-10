# SAN-858 · DATA-QUALITY — Events ownership classification

**Date:** 2026-06-09  
**Linear:** [SAN-858](https://linear.app/sanjiovani/issue/SAN-858/data-quality-events-ownership-classification)  
**Verdict:** 🟢 **Option A recommended** — discovery catalogue; keep `organizer_id` NULL

---

## Live probe

| Metric | Value |
|--------|------:|
| Published events | 49 |
| `organizer_id` NULL | **31** |
| NULL `organizer_id` AND NULL `created_by` | **31** (100%) |
| `source` for all 31 | **`manual`** |
| Sample slugs | Mostly **NULL** (catalogue imports, not host wizard) |
| `details.host_display` on published | 18/49 |

**Naive backfill `organizer_id = created_by` fixes 0 rows.**

---

## Classification recommendation

| Option | Verdict | Rationale |
|--------|---------|-----------|
| **A — Discovery catalogue** | 🟢 **Default** | `source=manual`, no `created_by`, no slug — Roberto did not publish these |
| B — System/admin owner | 🟡 Optional | Only if product wants all events under one platform org for RLS |
| C — Proven-owner backfill | 🟡 Case-by-case | Host wizard publishes after EVT-002 only; legacy rows lack owner evidence |

**Persona impact:** Roberto on `/host/events` should see **only** events he publishes via wizard — not 31 imported catalogue rows. Tourist/Andrés still see them on `/events/[slug]` browse.

---

## Sample rows (NULL organizer)

| name | source | slug | host_display |
|------|--------|------|:------------:|
| Salsa Night at Teatro Lido | manual | null | no |
| Medellín Food & Wine Festival | manual | null | no |
| Festival de Música Colombiana | manual | null | no |

**Ticketed prod event** `reina-de-antioquia-2026-finals` — separate row; has tiers (Andrés G1 proof target).

---

## Rules

- **No DDL** in this task without approved migration
- **No blind UPDATE** on `organizer_id`

**Next:** Product sign-off on Option A → document in [`ALL-EVENTS-DATA-MODEL.md`](../../../events/data/ALL-EVENTS-DATA-MODEL.md) §13.5
