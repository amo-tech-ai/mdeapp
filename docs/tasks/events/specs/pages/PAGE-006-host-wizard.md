---
id: PAGE-006
title: Host event creation wizard
route: /host/event/new
status: Live
linear: SAN-366
persona: roberto
screen: SCREEN-016
updated: 2026-06-08
implementation:
  page: mdeapp/src/app/host/event/new/page.tsx
  shell: mdeapp/src/components/host/host-event-shell.tsx
  agent: hostEventAgent (Mastra)
playwright: mdeapp/e2e/screens/SCREEN-016-host-wizard.spec.ts
wireframe: ../../wireframes/004-wire-host-event-wizard.md
---

# PAGE-006 — Host event wizard

## Purpose

NL-driven event creation with CopilotKit + HITL publish.

## Layout

Host nav rail (left) · chat wizard (center) · preview/draft panel (right on md+)

## Components

`HostEventShell`, `HostEventCopilotBridge`, `EventPublishApprovalPanel`, form fields

## Auth

Required; `getServerUser()` on page

## Mobile

Nav rail hidden; single column chat

## Gaps

- `HostNavRail` Events link disabled
- Venue step not built (VEN-006)
- Analytics nav disabled

## Acceptance

- [x] CopilotKit wired
- [x] HITL approval
- [x] Auth redirect in SCREEN-016
