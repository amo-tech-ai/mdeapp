# Venues — planning docs hub

**Prompt source:** [`prompt-plan-venues.md`](./prompt-plan-venues.md) · **PRD:** [`prd-venues.md`](./prd-venues.md) · **Tracker:** [`../INDEX.md`](../INDEX.md) · **Working notes:** [`../notes-venues.md`](../notes-venues.md)

Phase 1 venues = **Mindtrip-style place discovery** on `/` (café · restaurant · nightlife) + **honest WhatsApp request booking**. Event **space** B2B stays in [`../../events/`](../../events/INDEX.md).

---

## Planning doc index

| # | Doc | Contents |
|---|-----|----------|
| 1 | [`01-architecture.md`](./01-architecture.md) | System layers, data ownership, architecture mermaid |
| 2 | [`02-booking-whatsapp.md`](./02-booking-whatsapp.md) | Request booking flow, schema decision, WA outbox, mermaid |
| 3 | [`03-agents-tools-copilotkit.md`](./03-agents-tools-copilotkit.md) | Mastra tools, concierge routing, CopilotKit UI plan |
| 4 | [`04-supabase-seeds-vectors.md`](./04-supabase-seeds-vectors.md) | Tables audit, VEN-001 schema, seeds, pgvector |
| 5 | [`05-maps-places-adk.md`](./05-maps-places-adk.md) | MAP tasks ↔ venues, ADK, Places field masks |
| 6 | [`06-openclaw-automation.md`](./06-openclaw-automation.md) | Safe OpenClaw jobs, OCL-* tasks, draft-only rules |
| 7 | [`07-roadmap-mvp.md`](./07-roadmap-mvp.md) | Core MVP phases + **next 10 tasks** (exact order) |
| 8 | [`08-roadmap-advanced.md`](./08-roadmap-advanced.md) | Phase 2+ vector, EVP-036 nearby, partner reservations |
| 9 | [`09-risks-blockers.md`](./09-risks-blockers.md) | Risks, conflicts, stale specs |
| 10 | [`10-status-audit.md`](./10-status-audit.md) | Completed vs missing |
| 11 | [`11-gemini-maps-adk-venues-routing.md`](./11-gemini-maps-adk-venues-routing.md) | Gemini · Maps · ADK → CAF/RST/NGT |
| 12 | [`12-mastra-venues-routing.md`](./12-mastra-venues-routing.md) | Mastra agents · tools · workflows → MSV-* |
| 13 | [`13-copilotkit-venues-routing.md`](./13-copilotkit-venues-routing.md) | CopilotKit generative UI · HITL → CKV-* |

**Index (build order VEN-001+):** [`../INDEX.md`](../INDEX.md) · **Docs → tasks gap:** [`../tasks/DOCS-TASK-GAP-MAP.md`](../tasks/DOCS-TASK-GAP-MAP.md)

---

## Skills used (routing)

| Skill | Planning docs |
|-------|----------------|
| [`copilotkit`](../../../.claude/skills/copilotkit/SKILL.md) | 03, **13** — generative UI, disabled actions, HITL |
| [`copilotkit-develop`](../../../.claude/skills/copilotkit-develop/SKILL.md) | **13** — useCopilotAction, useCoAgent |
| [`copilotkit-integrations`](../../../.claude/skills/copilotkit-integrations/SKILL.md) | **13** — Mastra AG-UI bridge |
| [`copilotkit-agui`](../../../.claude/skills/copilotkit-agui/SKILL.md) | **13** — tool events, SSE |
| [`copilotkit-debug`](../../../.claude/skills/copilotkit-debug/SKILL.md) | **13** — name mismatch, traces |
| [`mastra`](../../../.claude/skills/mastra/SKILL.md) | 03, **12** — agents, tools, workflows, MCP |
| [`gemini`](../../../.claude/skills/gemini/SKILL.md) | 03, 04, **11** — models, embeddings, tool calling |
| [`google-agents-cli-adk-code`](../../../.claude/skills/google-agents-cli-adk-code/SKILL.md) | 05, **11** — ADK sidecar |
| [`mde-maps`](../../../.claude/skills/mde-maps/SKILL.md) | 05, **11** — Places, grounding, markers |
| [`mde-supabase`](../../../.claude/skills/mde-supabase/SKILL.md) | 04 — RLS, migrations |
| [`mde-whatsapp`](../../../.claude/skills/mde-whatsapp/SKILL.md) | 02 — outbox, Twilio; not OpenClaw gateway |
| [`open-claw`](../../../.claude/skills/open-claw/SKILL.md) | 06 — enrichment only |
| [`pgvector`](../../../.agents/skills/pgvector/SKILL.md) | 04 — VEC-* path |
| [`mermaid-diagrams`](../../../.claude/skills/mermaid-diagrams/SKILL.md) | 01, 02, 03 — flows |

---

## Screen specs (execution)

| Group | scr + wire |
|-------|------------|
| 005 café | [`cafes/INDEX.md`](../cafes/INDEX.md) · [`005-scr`](../archive/005-scr-cafe-listings-map-booking.md) |
| 006 sheet | [`006-scr-venue-detail-sheet.md`](../archive/006-scr-venue-detail-sheet.md) — rentals/events only |
| 007 nightlife | [`007-scr-nightlife-listings-map.md`](../007-scr-nightlife-listings-map.md) |
| 008 restaurant | [`008-scr-restaurant-listings-map.md`](../008-scr-restaurant-listings-map.md) |

*Last updated: 2026-05-27*

**Task index:** [`../tasks/index-tasks.md`](../tasks/index-tasks.md) · **Gemini/Maps:** doc 11 · **Mastra:** doc 12 · **CopilotKit:** doc 13
