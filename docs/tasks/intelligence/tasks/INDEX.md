---
title: Agent Intelligence & Shared Memory — Task Program
program: INT-001…022
updated: 2026-06-01
linear_sync: SAN-404…SAN-425
linear_view: https://linear.app/sanjiovani/view/intelligence-7bbdb829ba23
linear_map: ../LINEAR.md
plan: ../agent-plan.md
architecture: ../00-shared-intelligence-architecture.md
---

# Agent Intelligence & Shared Memory — Task Index

**Golden rule:** Mastra orchestrates · Gemini reasons · code searches · Supabase remembers · CopilotKit mirrors UI · pgvector recalls later.

**Do not:** one giant super-agent. **Do:** shared intelligence + vertical specialists + deterministic search.

## Implementation order (strict)

```text
CORE:    INT-001 → INT-002 → INT-003 → INT-004 → INT-005
MVP:     INT-006 → INT-007 → INT-008 → INT-009 → INT-010
POST-MVP: INT-011 → INT-012 → INT-013 → INT-014 → INT-015
ADVANCED: INT-016 → INT-017 → INT-018 → INT-019 → INT-020
```

Parallel platform work (do not block CORE): **VEC-001…003** before INT-016.

## Summary by phase

| Phase | Tasks | Priority | Outcome |
|-------|-------|----------|---------|
| **CORE** | INT-001…005 | P0 | Gemini reasons on turn 1; no canned bypass; regression green |
| **MVP** | INT-006…010 | P0–P1 | Date filters; event/café wrappers; CK readable state |
| **POST-MVP** | INT-011…015 | P1–P2 | Durable prefs; retrieval; ranking boost; evidence |
| **ADVANCED** | INT-016…020 | P2 | pgvector; embeddings; cross-domain; settings UI; observational |

## Master table

| Order | ID | Linear | Title | Phase | P | Status | Depends |
|------:|----|--------|-------|-------|---|--------|---------|
| 1 | [INT-001](../archive/INT-001-shared-intent-slot-schema.md) | [SAN-404](https://linear.app/sanjiovani/issue/SAN-404) | Shared intent + slot schema | CORE | P0 | ✅ Done · archived | — |
| 2 | [INT-002](../archive/INT-002-rental-parser-monthly-date-city.md) | [SAN-405](https://linear.app/sanjiovani/issue/SAN-405) | Rental parser monthly/date/city | CORE | P0 | ✅ Done · archived | INT-001 |
| 3 | [INT-003](./INT-003-gemini-smart-clarify-routing.md) | [SAN-406](https://linear.app/sanjiovani/issue/SAN-406) | Gemini smart clarify routing | CORE | P0 | 🟥 Todo ⚠️ | INT-001, INT-002 |
| 4 | [INT-004](./INT-004-no-canned-clarify-bypass.md) | [SAN-407](https://linear.app/sanjiovani/issue/SAN-407) | No canned clarify bypass | CORE | P0 | 🟥 Todo ⚠️ | INT-003 |
| 5 | [INT-005](./INT-005-intelligence-regression-tests.md) | [SAN-408](https://linear.app/sanjiovani/issue/SAN-408) | Intelligence regression tests | CORE | P0 | ✅ Done | INT-002–004 |
| 6 | [INT-006](./INT-006-rental-availability-date-filters.md) | [SAN-409](https://linear.app/sanjiovani/issue/SAN-409) | Rental availability date filters | MVP | P1 | ✅ Done | INT-002 |
| 7 | [INT-007](../archive/INT-007-event-intelligence-wrapper.md) | [SAN-410](https://linear.app/sanjiovani/issue/SAN-410) | Event intelligence wrapper | MVP | P1 | ✅ Done · archived | INT-001, INT-005 |
| 8 | [INT-008](../archive/INT-008-cafe-intelligence-wrapper.md) | [SAN-411](https://linear.app/sanjiovani/issue/SAN-411) | Café intelligence wrapper | MVP | P1 | ✅ Done · archived | INT-001, INT-005 |
| 9 | [INT-009](./INT-009-copilot-readable-ui-state.md) | [SAN-412](https://linear.app/sanjiovani/issue/SAN-412) | CopilotKit readable UI state | MVP | P1 | 🟡 In Progress | INT-003 |
| 10 | [INT-010](./INT-010-working-memory-schema-update.md) | [SAN-413](https://linear.app/sanjiovani/issue/SAN-413) | Working memory schema update | MVP | P1 | 🟡 In Progress · PR #39 open | INT-001 |
| 11 | [INT-011](./INT-011-user-preferences-schema.md) | [SAN-414](https://linear.app/sanjiovani/issue/SAN-414) | user_preferences schema + RLS | POST-MVP | P1 | ⚪ Not Started | INT-005 |
| 12 | [INT-012](./INT-012-user-interactions-schema.md) | [SAN-415](https://linear.app/sanjiovani/issue/SAN-415) | user_interactions schema | POST-MVP | P1 | ⚪ Not Started | INT-011 |
| 13 | [INT-013](./INT-013-retrieve-preferences-before-search.md) | [SAN-416](https://linear.app/sanjiovani/issue/SAN-416) | Retrieve prefs before search | POST-MVP | P1 | ⚪ Not Started | INT-011, INT-012 |
| 14 | [INT-014](./INT-014-ranking-boost-from-memory.md) | [SAN-417](https://linear.app/sanjiovani/issue/SAN-417) | Ranking boost from memory | POST-MVP | P2 | ⚪ Not Started | INT-013 |
| 15 | [INT-015](./INT-015-memory-evidence-tests.md) | [SAN-418](https://linear.app/sanjiovani/issue/SAN-418) | Memory evidence tests | POST-MVP | P2 | ⚪ Not Started | INT-013, INT-014 |
| 16 | [INT-016](./INT-016-pgvector-semantic-memory.md) | [SAN-419](https://linear.app/sanjiovani/issue/SAN-419) | pgvector semantic memory | ADVANCED | P2 | ⚪ Not Started | VEC-001, INT-011 |
| 17 | [INT-017](./INT-017-gemini-embeddings-memory.md) | [SAN-420](https://linear.app/sanjiovani/issue/SAN-420) | Gemini embeddings for memory | ADVANCED | P2 | ⚪ Not Started | VEC-003, INT-016 |
| 18 | [INT-018](./INT-018-cross-domain-personalization.md) | [SAN-421](https://linear.app/sanjiovani/issue/SAN-421) | Cross-domain personalization | ADVANCED | P2 | ⚪ Not Started | INT-016, INT-007, INT-008 |
| 19 | [INT-019](./INT-019-memory-settings-ui.md) | [SAN-422](https://linear.app/sanjiovani/issue/SAN-422) | Memory settings UI | ADVANCED | P2 | ⚪ Not Started | INT-011, INT-016 |
| 20 | [INT-020](./INT-020-observational-memory-learning.md) | [SAN-423](https://linear.app/sanjiovani/issue/SAN-423) | Observational memory learning | ADVANCED | P2 | ⚪ Not Started | INT-012, INT-016 |

**Status verified 2026-06-01** — against `mdeapp` `origin/main` (c9e54b8) + prod synthetic smoke run `26760735915` (success, https://www.mdeai.co) + live Supabase `zkwcbyxiwklihegjhuql`; mirrors Linear `track:intelligence`. Legend: ✅ Done · archived = committed to GitHub **and** live on Vercel → moved to [`../archive/`](../archive/) · 🟢 In Review = code on `main`, hard **Done** withheld pending runtime proof · 🟡 In Progress = partial · ⚪ Not Started.

**Archived 2026-06-01 (committed to GitHub + live on Vercel):** INT-001 · INT-002 · INT-007 · INT-008 → [`../archive/`](../archive/). Proof: `origin/main` c9e54b8 + prod synthetic smoke run `26760735915` (4-vertical `data-testid` card assertions green on https://www.mdeai.co). **Not archived** — INT-003 (0.50–0.84 Gemini-clarify band is *not* the live path: canned `RENTAL_CLARIFY_MESSAGE` still fires; `conciergeAgent` not smoke-covered), INT-004 (canned bypass still live; deploy-gated behind UX-001/002), INT-005 (e2e `intelligence/` spec absent; depends on INT-004), INT-010 (Zod `lastRentalQuery.genericAskPending` drift = live persistence bug).

Open items behind the non-green / ⚠️ rows:
- **⚠️ INT-004** — clarify-bypass shipped, but routes the 0.50–0.84 confidence band to `conciergeAgent`, which is **dead on prod** (RUN_ERROR `EAUTHTIMEOUT` / INCOMPLETE_STREAM, QA F-1). Deploy-gated behind UX-001 (restore concierge) + UX-002 (surface RUN_ERROR).
- **⚠️ INT-010** — working-memory schema shipped, but Zod `lastRentalQuery` is missing `genericAskPending` (present on `lastEventQuery` + both `ConciergeWorkingMemory` TS fields). One-line drift fix open in `mdeapp/src/mastra/agents/concierge.ts`.
- **🟡 INT-006** — budget parsing on `main`; date-overlap availability SQL filter not yet shipped.
- **🟡 INT-009** — readable UI-state mirror still open.
- **✅ INT-021** — restaurant + venue wrapper shipped PR #94 (`c24d1d2`); prod smoke 5/5 PASS.

### Additive (post-audit 2026-05-28)

Added after the program audit closed gaps the 00-program-report flagged. Not part of the strict INT-001→020 CORE/MVP chain; sequence by their `depends_on`.

| Order | ID | Title | Phase | P | Status | Depends | Owner | Note |
|------:|----|-------|-------|---|--------|---------|-------|------|
| 21 | [INT-021](./INT-021-restaurant-venue-intelligence-wrapper.md) | [SAN-424](https://linear.app/sanjiovani/issue/SAN-424) | Restaurant & venue wrapper | MVP | P1 | ✅ Done | INT-001, INT-005 |
| 22 | [INT-022](./INT-022-routing-confidence-instrumentation.md) | [SAN-425](https://linear.app/sanjiovani/issue/SAN-425) | Routing confidence telemetry | MVP | P2 | ✅ Done | INT-002 |

## Real-world examples by phase

| Phase | Vertical | Example prompt | Expected |
|-------|----------|------------------|----------|
| CORE | Rental | `list rentals in june 1 to 30 $1000 medellin` | Medellín monthly clarify OR search; not generic budget/dates re-ask |
| MVP | Event | `salsa events this weekend near Provenza` | vibe + dateRange + neighborhood slots; event search or focused clarify |
| MVP | Café | `quiet café in Laureles for remote work tomorrow` | cafe_search + needs; Places or clarify WiFi vs outdoor |
| POST-MVP | Rental | Repeat Camila visit | Laureles boost from `user_preferences` |
| ADVANCED | Restaurant | `romantic dinner in El Poblado under $80` | slots + future semantic recall |
| ADVANCED | Venue | `birthday venue for 20 people with music` | capacity + vibe slots (INT-005 scope later) |

## Superseded task files (do not use for new work)

Root-level `tasks/intelligence/INT-00x-*.md` (2026-05-28) → replaced by this folder. See [MIGRATION.md](./MIGRATION.md).

## Linear sync (2026-06-01)

> **View:** [Intelligence board](https://linear.app/sanjiovani/view/intelligence-7bbdb829ba23) · filter `label:track:intelligence` · sort `int-seq:01`…`22`  
> **Full map:** [`../LINEAR.md`](../LINEAR.md) · [`../../linear/intelligence-canonical-titles.json`](../../linear/intelligence-canonical-titles.json)  
> **Re-import:** `node scripts/linear-import-intelligence-tasks.mjs`

| INT | Linear | Status (Linear @ sync) |
|-----|--------|------------------------|
| INT-001…008 | SAN-404…411 | 001/002/007/008 **Done**; 003–005 In Review; 006/009 In Progress |
| INT-010…020 | SAN-413…423 | 010 In Review; 011–020 Backlog |
| INT-021…022 | SAN-424…425 | 021 Done; 022 Backlog |

**MIS siblings on same view:** DATA-039…047, SEARCH-001…003, VEC-*, AI-* — see [`../../linear/intelligence-queue.json`](../../linear/intelligence-queue.json).

## Related programs (not duplicated)

| Program | Index | Relationship |
|---------|-------|----------------|
| Real estate implementation | [`../../real-estate/tasks/INDEX.md`](../../real-estate/tasks/INDEX.md) | RE-017…020 implement INT-002…006 rental slices |
| Vector platform | [`../../vector/INDEX.md`](../../vector/INDEX.md) | VEC-001…007 before INT-016/017 |
| Master plan | [`../agent-plan.md`](../agent-plan.md) | PRD, mermaid, confidence bands |

## Next recommended PR

**PR-A (CORE):** INT-001 + INT-002 + INT-003 + INT-004 in one branch (≤400 lines) or split INT-001 then INT-002–004.

Ledger: C-016 (INT-001), C-013 (INT-002/RE-017), C-014 (INT-003–004/RE-018).
