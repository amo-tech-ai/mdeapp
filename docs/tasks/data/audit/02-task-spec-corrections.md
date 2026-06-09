---
date: 2026-05-29
skill: mde-supabase
method: Live MCP + disk cross-check vs tasks/data/tasks-data/
---

# Data task spec corrections (2026-05-29)

Verified against **mde-supabase** rules and live project `zkwcbyxiwklihegjhuql`.

## Verdict

| Area | Before | After corrections |
|------|--------|-------------------|
| **Done tasks vs live DB** | Bodies still showed pre-migration gaps | Updated DATA-020, 027, 029, 028, 001 |
| **DATA-004** | P0 full re-seed | P1 verify-only (44/44 place_ids live) |
| **DATA-005** | Missing DATA-009 dep | `depends_on: data-009`; target `venue_anchors` |
| **DATA-034** | Blocked MAP-001 (shipped); wrong `venues` join | Unblocks MAP-012 only; `event_venues` SQL |
| **DATA-011** | 47 edge functions | **37** active (MCP list) |
| **Evidence hygiene** | AC checkboxes open on Done tasks | Checked + `evidence:` frontmatter on 12 tasks |
| **INDEX-data.md** | Stale statuses | Done markers + data-004 label |

## mde-supabase compliance notes (already correct on disk)

| Rule | Task alignment |
|------|----------------|
| `(SELECT auth.uid())` in RLS | DATA-009 M1 policies match supabase-plan |
| No anon INSERT on `leads` | DATA-020, DATA-011 guest-lead audit |
| service_role seeds only | DATA-005, DATA-035 venue_anchors writes |
| SECURITY DEFINER + `search_path` | DATA-027 RPC; DATA-010 P1 list updated |
| Every exposed table has RLS | DATA-009 M1/M2 verified 2026-05-29 |

## Remaining spec gaps (not wrong — still open work)

1. **Repo migrations** — DATA-027/029 SQL not yet in `supabase/migrations/` (live-only via MCP)
2. **App follow-ups** — `chat-lead-capture`, ticket checkout `tripId`, Mastra → `insert_trip_item_for_user`
3. **DATA-012/019/026** — AC checkboxes in body still partial; frontmatter evidence links added
4. **Forensic audit file** — `tasks-data-forensic-audit.md` is point-in-time; use this doc + `IMPLEMENTATION-STATUS.md` for current state

## Files edited this pass

`data-001`, `002`, `004`, `005`, `009`, `010`, `011`, `012`, `019`, `020`, `026`, `027`, `028`, `029`, `034`, `INDEX-data.md`
