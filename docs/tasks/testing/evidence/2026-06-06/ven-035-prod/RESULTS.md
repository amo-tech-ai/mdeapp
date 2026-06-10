# VEN-035 — prod e2e hygiene (#91)

**Merge:** PR #91 → `main` @ `af5cb66`  
**Date:** 2026-06-06

## Change

Replaced stale `/cafes` placeholder assertions in `VEN-035-venue-release.spec.ts` with live browse grid pattern.

## Verification

| Check | Result |
|-------|--------|
| Floor CI (PR #91) | PASS |
| Local SCREEN-028 + VEN-035 cafés case | PASS |
| Prod `GET /cafes` | **200** |

No prod browser re-run required (e2e-only; browse already live since SAN-519).
