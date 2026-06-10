---
title: task-verifier — Events vertical (EVP)
---

# Events task verification

**Specs:** `tasks/events/tasks/{MVP,ADV,...}/EVP-*.md` (specs ARE nested under `tasks/events/tasks/`). Venue-booking specs: `tasks/events/specs/venue-booking/*` + canonical `tasks/venues/tasks/event-booking/VEB-*`.  
**Index:** `tasks/events/tasks/INDEX.md` · **Legacy map:** `tasks/events/tasks/LEGACY-ID-MAP.md`  
**Audit:** `tasks/events/audit/{01-audit-events-mvp,02-events-audit,03-events-tasks-audit}.md` (NOT `tasks/audit/32-*`, which never existed).  
**PRD / roadmap:** `tasks/events/events-prd.md`, `tasks/events/events-roadmap.md`  
**Live execution:** `tasks/events/todo.md` + Linear `SAN-### · EVT-*/AIE-*` (EVP-* is the legacy spec scheme; map via LEGACY-ID-MAP — e.g. EVP-032 = SAN-135).

## ID scheme (2026-05-27)

| Pattern | Tier | Example |
|---------|------|---------|
| `EVP-001-core` … `EVP-014-core` | Core MVP — revenue + host | Proof, checkout, HITL, cards, host list |
| `EVP-015-mvp` … `EVP-028-mvp` | Post-MVP — discovery/maps | Grounding pack EVP-018 → EVP-019..028 |
| `EVP-029-advanced` … `EVP-031-advanced` | Sponsor + automation | After commerce proof |

**PRD week IDs (F33, F14, …)** may still appear in `plan/prd` — execution order uses **EVP-***.

## Blocking gates

1. **EVP-001-core** before trusting Done labels or prod claims.
2. **EVP-003-core** not prod-ready until webhook secrets distinct (`tasks/notes/F11-evidence.md`).
3. **EVP-014-core** before Roberto host ops complete.
4. **EVP-015-mvp+** only after core proof green.
5. No auto-publish from Search grounding (**EVP-026-mvp**).

## Evidence

`tasks/notes/EVT-01-evidence.md` (legacy name → EVP-002-core), `F33`–`F40`, `F11`, `F14`, `F15` — refresh via EVP-001-core.
