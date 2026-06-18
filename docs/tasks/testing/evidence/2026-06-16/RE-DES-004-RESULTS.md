# SAN-1095 · RE-DES-004 — Broker OS data layer + overview redirect

**Class:** C (data layer + redirect — no persona UI in this PR)  
**Branch:** `ai/san-1095-re-des-004-dashboard` · PR #244  
**Persona:** Roberto — broker metrics feed **SAN-1093 · RE-DES-002** concierge shell (not shipped here)

## Verdict

Merge-ready data layer: scalar KPI counts, generic load errors, `/host/rentals/dashboard` → `?mode=overview` redirect only.

## Checks run

| Check | Result |
|-------|--------|
| `npm test -- --run src/lib/rentals` | 40/40 pass (2026-06-18) |
| `floor` CI on PR #244 | pass |
| DeepSource JS/SQL/Secrets | pass |
| Option B scope | no `rentals-dashboard-shell.tsx` / duplicate KPI layout |
| Class U concierge shell | deferred to **SAN-1093 · RE-DES-002** |

## Notes

- KPIs use `{ count: "exact", head: true }` — not capped listing/showing array lengths.
- Attention queue lists capped at 5–20 rows (display only).
- UI wiring lands in SAN-1093 Phase B.
