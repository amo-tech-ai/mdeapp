---
id: PAGE-M09
route: /admin/discovery or chat overlay
status: Spec-only
linear: SAN-129
persona: patricia
related: OVL-004
updated: 2026-06-08
---

# PAGE-M09 — Discovery approval queue

## Purpose

Human approval for web-scraped events before `discovered_events` → `events` promote.

## Surfaces

**Option A:** Patricia `/admin/discovery` table  
**Option B:** In-chat HITL only (OVL-004) — prefer B for Phase 1, A for volume

## Acceptance

- [ ] No auto-publish
- [ ] Citation required on every row
- [ ] Reuses ApprovalPanel pattern
