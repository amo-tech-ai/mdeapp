---
id: EVP-028-mvp
linear: SAN-131
legacy_id: EVT-D11
title: Production readiness checklist
status: Not Started
priority: P2
phase: Post-MVP
effort: 1d
depends_on: [EVP-027-mvp-discovery-test-plan]
parent_pack: EVP-018-mvp-event-web-discovery-task-pack.md
---

# EVP-028-mvp — Production readiness

## Checklist

- [ ] No secret exposure (grep + security-reviewer)
- [ ] Timeouts on ADK + grounding (15s cap)
- [ ] Rate limits per user/IP on discovery endpoint
- [ ] Quota alerts (Gemini, Places, Search)
- [ ] `ai_runs` + `event_discovery_runs` logging
- [ ] Source citation / attribution compliance
- [ ] Graceful fallback copy for Camila
- [ ] Cache TTL on snapshots (7d)
- [ ] Feature flag default off + Vercel env doc
- [ ] Rollback: disable flag → EVP-005-core path only
- [ ] Cost monitoring dashboard query for Patricia

## Acceptance criteria

- [ ] Checklist copied to `tasks/notes/EVP-028-mvp-prod-checklist.md` with sign-off lines
- [ ] Rollback runbook ≤1 page
