---
id: OVL-003
title: Host publish HITL approval panel
route: overlay on /host/event/new
status: Live
linear: SAN-366
persona: roberto
updated: 2026-06-08
implementation:
  component: mdeapp/src/components/host/event-publish-approval-panel.tsx
  bridge: mdeapp/src/components/host/host-event-copilot-bridge.tsx
pattern: CopilotKit renderAndWaitForResponse
---

# OVL-003 — Event publish approval panel

## Purpose

Human-in-the-loop gate before `approval-commit` writes to Supabase.

## Persona example

Roberto reviews AI-filled draft card → **Approve** → event published with `organizer_id`.

## Layout

Preview `EventCard` + diff summary + Approve / Reject buttons.

## testIds

`host-event-approval-panel`

## Accessibility

Focus on primary Approve; destructive Reject secondary styling

## Acceptance

- [x] Blocks agent until respond()
- [x] Preview matches draft state
- [x] Wired in host wizard
