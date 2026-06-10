---
id: VEN-006
linear: SAN-500
status: Spec-only
updated: 2026-06-08
---

# VEN-006 — Host wizard venue step

## Purpose

Add wizard step after basics: search venue, match panel, or manual address.

## Integration

`/host/event/new` · `HostEventShell` stepper · `EventDraftState.venue`

## Wire

Linear SAN-513 wire companion

## Acceptance

- [ ] Optional skip (manual address)
- [ ] Links to VEN-004 match when partner venues exist
