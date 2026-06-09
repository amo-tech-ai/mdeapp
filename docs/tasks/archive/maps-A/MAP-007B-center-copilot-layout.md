---
id: MAP-007B
title: Mindtrip center chat layout (Path B)
status: Done
completed_at: 2026-05-23
evidence: /home/sk/mdeai/tasks/notes/MAP-007B-evidence.md
priority: P0
phase: MVP — O4
effort: 6-8h
owner: claude
depends_on: [MAP-007, F48, F49, F50, MAP-002, F07]
supersedes: MAP-007 sidebar-first polish
skill: [copilotkit-develop, copilotkit-integrations, mde-maps, shadcn]
---

# MAP-007B — Center Copilot chat layout (Path B)

## Purpose

Layout **migration** from F48 `CopilotSidebar` edge chat to Mindtrip-style:

```text
LEFT nav | CENTER CopilotChat + cards | RIGHT map
```

Not MAP-007 polish. Runtime (`/api/copilotkit`), Mastra, ADK, Grounding Lite unchanged.

## Success criteria

- Desktop lg+: nav 260–280px · center `CopilotChat` · map 380–440px
- Mobile: single chat column; map FAB `bottom-24 right-4`; sheet 75–85vh; input never covered
- One `data-testid="nav-rail"` in DOM
- F50 pin sync + grounding attribution preserved
- Playwright desktop/mobile/tablet green; `npm run floor` green
- Evidence: `tasks/notes/MAP-007B-evidence.md`

## Out of scope

- CopilotKit v2 headless migration
- Legacy `useChat` / edge chat port
- Supabase migrations
