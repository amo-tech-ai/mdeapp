---
title: VENUE-DATA-MODEL — Forensic Schema Audit
audited: 2026-06-08
auditor: task-verifier · mde-supabase · Supabase MCP (project zkwcbyxiwklihegjhuql)
target: tasks/events/data/VENUE-DATA-MODEL.md
linear: SAN-492
verdict: 🔴 NOT 100% correct — 3 blockers (1 new), several red flags. NO-GO for migration.
---

# VENUE-DATA-MODEL — Forensic Schema Audit

> **RESOLUTION (2026-06-08):** model revised to the **`partner_locations` reuse** design — `partner_locations` (identity, EXTEND) + `venue_event_offerings`/`packages` (CREATE) + **`bookings`** (proposal/approval, REUSE); `venue_booking_requests` left untouched. **B1 resolved** (no `partner_venues`; reuse shipped partner stack), **B2 resolved** (`partner_ids_for_user()`/`is_admin()` RLS + public read), **B3 dissolved** (no `venue_booking_requests` changes). Readiness **68 → 84 (GO for migration branch, human sign-off pending)**. Findings below stand as the record that drove the revision.

**Question:** Is `VENUE-DATA-MODEL.md` 100% correct and safe to migrate from?
**Verdict:** **No.** It correctly kills the `event_venues` collision, but it **introduces a new duplication** (ignores the shipped partner stack), its **`partner_venues` RLS keys on a column that doesn't exist**, and its **`venue_booking_requests` reuse fails three live NOT-NULL/CHECK constraints**. Self-scored readiness 78 is optimistic — true readiness ≈ **68/100**. Correctly **HOLD migration**; the doc itself needs a revision first.

---

## Scorecard

| Dimension | Doc claim | Audit verdict | Dot |
|-----------|----------:|--------------:|:---:|
| 3-way conflict analysis | accurate | **accurate** ✅ | 🟢 |
| `event_venues` domain split | correct | **correct** (RLS + `events.venue_id` confirmed) | 🟢 |
| Don't create `venues`/`event_venue_bookings` | sound | **sound** | 🟢 |
| `partner_venues` as new master | recommended | **duplicates shipped `partners`/`partner_locations`** | 🔴 |
| `partner_venues` RLS | "owner write" | **no owner column; admin-seeded** | 🔴 |
| `venue_booking_requests` reuse | "extend INSERT check" | **breaks 3 NOT-NULL/CHECK constraints** | 🔴 |
| `bookings` table | "generic (separate)" | **dismissed without analysis — has approval+partner workflow** | 🟡 |
| Admin/Patricia read path | — | **missing from RLS plan** | 🟡 |
| Column completeness | partial | **missing lat/lng, timestamps, address** | 🟡 |
| Live-probe section | accurate | **accurate** (minor migration-name slip) | 🟢 |

**Readiness: 68/100 — NO-GO for migration SQL · GO for a doc revision.**

---

## 1. What the model gets RIGHT (verified on live DB)

- **Three-way conflict is real and correctly stated.** `event_venues` (7 rows, organizer-owned) ≠ absent `venues` ≠ Linear's "create `event_venues`". ✅
- **`event_venues` is genuinely a different domain.** Probed RLS: `venues_owner_all` = `organizer_id = (SELECT auth.uid())`; `venues_public_select` = `EXISTS(events e WHERE e.venue_id = event_venues.id AND e.status IN ('published','live'))`. This **proves `events.venue_id → event_venues`** (column exists ✅) — so overloading it would break SAN-135. The "KEEP `event_venues` unchanged" call is correct.
- **Don't create `venues` or `event_venue_bookings`** — correct; both absent and both would duplicate.
- **`restaurants.id` is `uuid`** ✅ — so `partner_venues.restaurant_id → restaurants(id)` is type-valid.
- **Live-probe section matches reality**: `event_venues`/`venue_booking_requests`/`restaurants`/`venue_anchors`/`bookings` exist; `partner_venues`/`venue_event_offerings`/`venue_event_packages` absent; RLS counts 2/3/6 confirmed.

---

## 2. Blockers (🔴 must fix before migration)

### B1 — `partner_venues` duplicates the shipped partner stack
**Evidence:** `list_migrations` shows **ptr001–ptr014 (2026-06-06)** created `partner_organizations`, `partners`, `partner_members`, `partner_locations`, `partner_services`, `partner_assets`, plus `bookings.partner_id / approved_by / approved_at / partner_status` and `revenue_ledger`. **Mamacita is a "partner."** The doc proposes a brand-new `partner_venues` master and **never checked the partner stack** — the exact "second parallel table" mistake the doc was written to prevent, one layer up.
**Impact:** A new `partner_venues` forks partner identity away from `partners`/`partner_locations`; SAN-493 seed, Patricia ops (`partner_members` RLS), and `revenue_ledger` all fragment.
**Fix:** Before creating `partner_venues`, prove `partners` + `partner_locations` + `partner_services` **cannot** model an event-capable venue (capacity, offerings, `accepts_event_bookings`). Most likely outcome: `venue_event_offerings`/`packages` hang off **`partner_locations.id`** (or `partners.id`), not a new master. If a new table is truly needed, justify in the doc against the partner ERD.

### B2 — `partner_venues` RLS keys on a column that doesn't exist
**Evidence:** Proposed `partner_venues` columns (doc lines 56–66): `id, restaurant_id, name, google_place_id, neighborhood, accepts_event_bookings, is_verified, capacity_seated, capacity_standing`. **No `owner_id`/`organizer_id`/`created_by`.** Yet the RLS plan (line 115) says **"owner write."** And SAN-493 says Patricia *seeds* these (admin-owned, not user-owned).
**Impact:** "Owner write" is unimplementable (no column) and semantically wrong (admin-seeded). RLS is undefined → migration can't write a correct policy.
**Fix:** Define explicitly: **public `SELECT` where `is_verified = true`; write = service-role / admin only** (or `partner_member` of the owning partner if folded into the partner stack per B1). No end-user write in MVP.

### B3 — `venue_booking_requests` reuse breaks live constraints
**Evidence (probed `pg_constraint` + columns):**
- `venue_kind` **NOT NULL** + `CHECK (venue_kind IN ('cafe','restaurant','nightclub'))` — no value for an event/partner proposal.
- `place_id` **NOT NULL** (text) — every row needs a Google place_id.
- `contact_name`, `contact_email` **NOT NULL**.
The doc's plan ("add `booking_kind, partner_venue_id, event_type, budget`… extend INSERT check") **never lists these constraints.**
**Impact:** An `event_proposal` INSERT (SAN-496) fails unless it supplies a `venue_kind` from the 3-value set and a non-null `place_id` — even when targeting a `partner_venue` that may lack a place_id. The seed/HITL inserts will error.
**Fix:** The migration must **relax `venue_kind` CHECK** (add `'event'`/`'partner'` or drop NOT NULL) **and** make `place_id` nullable for `booking_kind='event_proposal'` (or copy `partner_venues.google_place_id`, requiring it be NOT NULL on the partner side). Spell this out before coding.

---

## 3. Red flags (🟡 fix or justify)

| # | Red flag | Evidence | Fix |
|---|----------|----------|-----|
| R4 | **4th polymorphic venue FK** on `venue_booking_requests` | Already has `place_id`, `restaurant_id`→restaurants, `venue_anchor_id`→venue_anchors; doc adds `partner_venue_id` (4th) with no "exactly-one-target" CHECK | Reuse `restaurant_id` (partner_venues links to restaurants) **or** move event proposals to `bookings` (R5); add a CHECK if a 4th FK stay |
| R5 | **`bookings` table dismissed without analysis** | `bookings` cols include `booking_type, resource_id, status, party_size, partner_id, approved_by, approved_at, partner_status` — a **ready-made approval + partner workflow** (ptr011/012) | Justify why `venue_booking_requests` over `bookings`; the latter already models Patricia approve (SAN-502) |
| R6 | **No admin/Patricia read path** | `venue_booking_requests` SELECT policy = `user_id = (SELECT auth.uid())` (own only); only `venue_booking_service` (`true`, service-role) bypasses | Add an admin SELECT policy (or document the SAN-502 queue reads via edge fn / service role) |
| R7 | **"extend INSERT check" is inaccurate** | Existing `venue_booking_insert_own` WITH CHECK = `user_id = (SELECT auth.uid())` — venue-agnostic; event rows already pass | Drop this claim; the real work is **constraint** changes (B3), not RLS INSERT |
| R8 | **`partner_venues` missing columns** | Proposed schema lacks `created_at/updated_at`, `latitude/longitude` (SAN-494 card shows a pin), `address`, `price_level`; offerings lacks `spaces/setup_notes/best_for` (VEB-001 had them); packages lacks `description` | Add timestamps + coords + address minimum |
| R9 | **Migration filename wrong** | Doc cites prereq `20260608120000_san135_…`; **actual applied** version is `20260608202427_san135_backfill_event_host_display` (`list_migrations`) | Correct the timestamp |
| R10 | **Indexes underspecified** | Offerings/packages RLS will `EXISTS`-join on `partner_venue_id` + `is_verified` | Index `venue_event_offerings.partner_venue_id`, `venue_event_packages.partner_venue_id`, `partner_venues.is_verified` (RLS-perf rule) |

---

## 4. Critical fixes (in order)

1. **Reconcile with the partner stack (B1)** — decide: offerings on `partner_locations` (reuse) **vs** new `partner_venues`. This changes everything downstream; do it first.
2. **Define `partner_venues`/partner-location RLS concretely (B2)** — public SELECT `is_verified`; write service-role/admin only. Name the exact policy SQL.
3. **List + amend the `venue_booking_requests` constraints (B3)** — `venue_kind`, `place_id`, `contact_*`; write the `ALTER … DROP CONSTRAINT … ADD CONSTRAINT` lines and a backfill default for the 1 existing row.
4. **Justify `venue_booking_requests` vs `bookings` (R5)** — one paragraph + decision.
5. **Add admin read path (R6)** and **fix the "extend INSERT check" wording (R7)**.

---

## 5. Anything missing?

- **Partner-stack analysis** — the single biggest omission (B1/R5). The doc audited `event_venues`, `venue_booking_requests`, `restaurants`, `venue_anchors`, `bookings` but **not** `partners`/`partner_locations`/`partner_services`, which is where a "bookable partner venue" most naturally lives.
- **`idempotency_key` reuse** — table has it; event proposals should set it to dedupe double-submits (SAN-496). Not mentioned.
- **Status vocabulary mapping** — existing CHECK = `pending|confirmed|declined|cancelled`. Patricia "approve" → `confirmed`, "reject" → `declined`. There is no `approved` value; document the mapping so SAN-496/502 don't invent one.
- **`events.venue_id` formal FK** — **verified:** `events_venue_fkey` → `event_venues(id)`.
- **Seed dedup target** — doc says dedupe vs `venue_anchors`; after B1 it must **also** dedupe vs `partners`/`partner_locations`.
- **`down` safety for `venue_kind` CHECK** — relaxing a CHECK then re-tightening fails if `event_proposal` rows exist; the rollback plan should state the CHECK change is effectively one-way once event rows land.

---

## 6. Suggested improvements

1. **Fold into the partner stack** (preferred): `partner_locations` gains `accepts_event_bookings` + capacity; `venue_event_offerings`/`packages` FK → `partner_locations.id`; proposals → `bookings` (`booking_type='event_venue'`, `partner_id`, `partner_status`). Zero new identity tables, reuses shipped RLS + approval + `revenue_ledger`.
2. If a standalone `partner_venues` is kept, add `owner_partner_id uuid REFERENCES partners(id)`, `latitude/longitude`, `address`, `created_at/updated_at`, and write the RLS against `partner_members`.
3. Add a **decision matrix** (`partner_locations`-reuse vs new `partner_venues` vs `bookings`-reuse) with the trade-offs, so the human approver signs off on a model, not just a table list.
4. Add a **constraint-delta block** for `venue_booking_requests` (exact `ALTER` statements) so SAN-493/496 know the contract.
5. Re-score readiness **after** B1–B3 close; current 78 should read **68** until the partner-stack question is answered.

---

## 7. Live schema evidence (probed 2026-06-08, project zkwcbyxiwklihegjhuql)

**`venue_booking_requests` constraints:** `venue_kind` NOT NULL CHECK∈{cafe,restaurant,nightclub} · `place_id` NOT NULL · `status` NOT NULL default `pending` CHECK∈{pending,confirmed,declined,cancelled} · `source` CHECK∈{web,chat,whatsapp} · FKs → `auth.users`, `restaurants(id)`, `venue_anchors(id)` · existing venue refs: `place_id` + `restaurant_id` + `venue_anchor_id` (adding `partner_venue_id` = 4th).

**RLS — `venue_booking_requests`:** `venue_booking_service` ALL `true` (service) · `venue_booking_insert_own` INSERT `user_id=(SELECT auth.uid())` · `venue_booking_select_own` SELECT `user_id=(SELECT auth.uid())` → **no admin SELECT**.

**RLS — `event_venues`:** `venues_owner_all` ALL `organizer_id=(SELECT auth.uid())` · `venues_public_select` SELECT `EXISTS(events e WHERE e.venue_id=event_venues.id AND e.status IN ('published','live'))` → confirms `events.venue_id`.

**Partner stack (shipped 2026-06-06, ptr001–014):** `partners`, `partner_organizations`, `partner_members`, `partner_locations`, `partner_services`, `partner_assets`, `bookings.{partner_id,approved_by,approved_at,partner_status}`, `revenue_ledger`.

**`bookings` columns:** `id, user_id, booking_type, resource_id, resource_title, status, start_date, end_date, party_size, quantity, unit_price, total_price, currency, payment_status, …, partner_id, approved_by, approved_at, partner_notes, partner_status`.

**Migrations:** `20260608202427_san135_backfill_event_host_display` is latest/applied (doc cites `20260608120000` — slip). `partner_venues`/`venue_event_offerings`/`venue_event_packages` absent.

---

---

## 9. Live MCP verification (2026-06-08, project zkwcbyxiwklihegjhuql)

Independent re-probe via Supabase MCP + `mde-supabase` skill (RLS + constraints before migration).

| Audit claim | MCP result | Verdict |
|-------------|------------|---------|
| **B1** partner stack shipped (ptr001–014) | Migrations `20260606130000`–`20260606131300` applied | ✅ |
| **B1** `partners`, `partner_locations`, `partner_services` exist | All present; `partner_venues` absent | ✅ |
| **B1** `partner_locations` has lat/lng/place_id/address | Columns confirmed | ✅ |
| **B2** no owner column on proposed `partner_venues` | Doc columns have no `owner_id`/`partner_id` FK | ✅ |
| **B2** doc RLS now says service-role write | Current VENUE-DATA-MODEL § RLS — **partial fix**; still no `partners` link | 🟡 |
| **B3** `venue_kind` NOT NULL CHECK ∈ {cafe,restaurant,nightclub} | `venue_booking_requests_venue_kind_check` | ✅ |
| **B3** `place_id` NOT NULL | `is_nullable=NO` | ✅ |
| **B3** `contact_name`, `contact_email` NOT NULL | `is_nullable=NO` both | ✅ |
| **B3** status CHECK = pending,confirmed,declined,cancelled | Live constraint — **conflicts** with doc's `reviewing`/`approved` | ✅ |
| **B3** `source` NOT NULL + CHECK | `web|chat|whatsapp` — doc omits | ✅ |
| **B3** `requested_at` NOT NULL | Doc omits | ✅ |
| **R5** `bookings.partner_id`, `approved_by`, `partner_status` | Columns exist | ✅ |
| **R6** no admin SELECT on booking requests | Only `venue_booking_select_own` + `venue_booking_service` | ✅ |
| **R9** SAN-135 migration name slip | Applied: `20260608202427_san135_backfill_event_host_display` | ✅ |
| `event_venues` 7 rows, RLS 2 policies | Count=7; `venues_owner_all`, `venues_public_select` | ✅ |
| `events.venue_id → event_venues` | FK `events_venue_fkey` | ✅ |
| `restaurants.id` uuid (FK valid) | `venue_booking_requests_restaurant_id_fkey` | ✅ |

**Row counts:** `event_venues` 7 · `venue_booking_requests` 1 · `partners` 2 · `partner_locations` 0 · `bookings` 0

### Audit accuracy score

| Dimension | Score |
|-----------|------:|
| Blocker identification (B1–B3) | **97/100** |
| Constraint evidence | **100/100** |
| Partner-stack finding | **100/100** |
| RLS evidence | **98/100** |
| B2 vs current doc (RLS fixed in doc) | **85/100** — audit predates service-role fix; blocker downgraded to 🟡 for RLS text only |

**Overall audit correctness: 95/100 (A)** — the forensic audit is **substantially correct**. The approved VENUE-DATA-MODEL.md (86/GO) is **overstated**; true readiness remains **≈68/100** until B1 + B3 close.

### Doc vs live conflicts (must fix in VENUE-DATA-MODEL)

| VENUE-DATA-MODEL says | Live DB says |
|-----------------------|--------------|
| status: `reviewing`, `approved` | CHECK: `pending`, `confirmed`, `declined`, `cancelled` |
| extend cols only | must also relax/amend `venue_kind`, `place_id`, `contact_*`, `source` for `event_proposal` |
| new `partner_venues` master | `partner_locations` already has geo + place_id (0 rows, table ready) |
| prereq migration `20260608120000` | applied `20260608202427` |

**Recommendation:** Re-open VENUE-DATA-MODEL for **Option B revision** — fold offerings onto `partner_locations` (preferred per §6) **or** add `owner_partner_id → partners(id)` + full constraint-delta block before any migration branch.

---

## 10. Final answer (post MCP verification)

- **Is VENUE-DATA-MODEL 100% correct?** **No.** Correct on the `event_venues` collision; wrong/incomplete on (B1) ignoring the shipped partner stack, (B2) an RLS owner column that doesn't exist, (B3) three live constraints on `venue_booking_requests` it never lists.
- **Red flags:** 4th polymorphic FK, `bookings` dismissed without analysis, no admin read path, inaccurate "extend INSERT check," missing columns, wrong migration name, underspecified indexes.
- **Blockers:** B1, B2, B3 — all must close before SAN-492 migration.
- **Critical fix first:** decide `partner_locations`-reuse vs new `partner_venues` (B1) — it determines the whole model.
- **Safe to migrate?** **No.** **Safe to revise the doc?** Yes — that's the next step.
- **Readiness:** **68/100** (doc's 78 is optimistic — it predates the partner-stack finding).

### Stop condition
🛑 **Not ready.** Fix B1 (partner-stack reconciliation), B2 (partner_venues RLS owner model), B3 (`venue_booking_requests` constraint deltas) before any migration SQL. The model solved one duplicate-table trap and walked into another.
