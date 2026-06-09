---
id: EVP-027-mvp
linear: SAN-130
legacy_id: EVT-D10
title: Discovery test plan
status: Not Started
priority: P2
phase: Post-MVP
effort: 2d
depends_on: [EVP-025-mvp-copilotkit-discovery-ui]
parent_pack: EVP-018-mvp-event-web-discovery-task-pack.md
---

# EVP-027-mvp — Test plan

## Coverage

| Layer | Tests |
|-------|-------|
| Unit | dedupe, scoring, query templates, Zod schemas |
| Workflow | mocked ADK responses, Supabase-first path |
| Integration | grounding failure → fallback |
| RLS | anon cannot read approval queue |
| E2E | Playwright discovery turn + save approval |
| Smoke | localhost script with `EVENT_WEB_DISCOVERY=1` |
| Visual | Chrome DevTools MCP console clean |

## Acceptance criteria

- [ ] `npm run floor` green with flag off (default)
- [ ] Separate CI job or tag `@discovery` for flag-on tests
- [ ] SCREEN-006 unchanged when flag off
