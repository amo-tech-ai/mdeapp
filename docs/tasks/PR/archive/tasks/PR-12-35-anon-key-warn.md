---
task_id: PR-12
title: #35 warn when anon keys absent (follow-up)
phase: LOW
priority: P3
status: Done
archived: 2026-06-02
main_sha: 4de18f1
prod_sha: 4de18f1
area: frontend
skill: mde-maps
source: docs/02-pr-audit.md (#35 follow-up)
depends_on: []
follows_merged: PR #35 (UX-028 / SAN-440)
verified: 2026-06-01
main_sha: c9e54b8
spec_accuracy_pct: 100
audit_dot: green
description: Add a dev console.warn when Maps/anon keys are missing so silent map failures surface during development.
---

## Summary

| Field | Value |
|-------|-------|
| Source | #35 (MERGED) follow-up — the merged change handles missing keys but **fails silently** |
| Gap | When the Maps/publishable anon key is absent, the map just doesn't render — no signal to the dev |
| Fix | Emit a single `console.warn` (dev only) naming the missing env var so the failure is diagnosable |

## Problem

#35 landed but a missing anon/Maps key produces a silent blank map — a dev wastes time before realizing the key isn't set. A one-line guarded `console.warn` (naming the **env var name**, never a value) turns a silent failure into an obvious one. This is a small developer-experience follow-up, not a behavior change for end users.

## Change (wiring)

| Layer | File | Action |
|-------|------|--------|
| Map init | the Maps/anon key read site (from #35; grep `NEXT_PUBLIC_*MAPS*` / publishable-key access) | Modify — if key missing, `console.warn("[maps] NEXT_PUBLIC_…_KEY not set; map disabled")` once |

## Skill to use

- **`mde-maps`** — where the Maps key is read; confirm the warn sits before the `<Map>`/loader bails, and that `mapId` + key handling stay intact.

## Gates / Acceptance

- [ ] Missing key → exactly one `console.warn` naming the **env var name** (never the value).
- [ ] Key present → no warn, no behavior change, map renders.
- [ ] Warn is dev-observable but doesn't throw or break SSR.
- [ ] No secret/value ever logged (var **name** only).
- [ ] `/verify-floor` green.

## Testing & proof

### Persona / journey

**Sofía/Lucía** — missing Maps key produces one dev `console.warn` (env var **name** only); **Camila** sees unchanged map when key is set.

### Pre-ship

```bash
cd mdeapp
# Key present (normal dev)
npm run dev:ui &
# Browser: / — no [maps] warn in console
# Key absent simulation: unset NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in .env.local, restart
# Expect exactly one console.warn naming the var — map blank but no throw
npm run floor
```

**Pass criteria:** warn fires once when key missing; zero warns when key present; SSR does not crash; no secret values logged.

**Evidence artifact:** `tasks/testing/evidence/PR-12-maps-anon-warn.md` — console capture screenshot.

## Risks / Notes

- Trivial, lowest-priority — bundle-able, but keep it its own tiny PR for a clean audit trail.
- **Never log the key value** — name only (session secret-handling rule).
- Persona: **Sofía** (dev) / **Lucía** (QA) — a missing-key warn shortens the "why is the map blank?" loop; no end-user-facing change.
