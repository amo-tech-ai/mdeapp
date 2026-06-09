---
task_id: RE-006
title: Schedule viewing modal (SCREEN-008)
layer: APP
priority: P0
phase: core
status: In Progress
persona: Camila
depends_on: [RE-004]
unblocks: [RE-007, RE-009]
skills: [copilotkit-agui, shadcn, mde-supabase]
screen_ids: [SCREEN-008]
wireframes:
  - ../wireframes/017-scr-schedule-viewing-modal.md
description: Complete SCREEN-008 Done — modal, validation, confirmation in thread.
---

# RE-006 — Schedule viewing modal

## Disk (partial)

✅ `schedule-viewing-modal.tsx`  
✅ `submitScheduleViewing` → `/api/leads/schedule-viewing`  
✅ Wired in `geo-chat-shell.tsx`  
🟡 SCREEN-008 status "missing" in scr — refresh to match disk  
🟡 Confirmation card in CopilotChat — verify

## Acceptance criteria

- [ ] Required fields validated
- [ ] Submit creates `leads` row (staging/local)
- [ ] Confirmation UX in chat or toast
- [ ] SCREEN-008 Done gate + Playwright

## Do not do

- No direct browser INSERT to `leads`
- No OTA redirect
