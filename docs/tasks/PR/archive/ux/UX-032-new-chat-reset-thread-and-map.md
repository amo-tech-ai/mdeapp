---
id: UX-032
title: New chat resets thread, working memory, results, and map pins
status: Done
archived: 2026-06-02
main_sha: 4de18f1
prod_sha: 4de18f1
vercel: true
merged_pr: https://github.com/amo-tech-ai/mdeapp/pull/36
merge_sha: 1a51ad2
linear: SAN-321
priority: P2
phase: MVP — session hygiene
effort: 2-4h
owner: claude
legacy_from: UX-006
depends_on: []
blocks: []
skill: [mde-task-lifecycle, copilotkit-integrations, mde-maps, testing]
related:
  - ../UX-006-new-chat-reset-thread-and-map.md
  - ../tests/23-live-audit.md
description: "New chat" is Link href="/" only — leaves CopilotKit thread, working memory, result cards, and map pins. Real reset required.
---

# UX-032 — New chat reset (from UX-006)

## Purpose

**Camila** finishes a rental search, clicks New chat, expects a clean slate — today she keeps old pins, filters, and messages.

## Root cause (verified)

`chat-nav-rail.tsx:24-30` — client nav to `/` without clearing:

- CopilotKit thread / messages
- `useCoAgent<ConciergeWorkingMemory>()` state
- Map pins (`useMapContext`)
- Rich card registrar counts

## Files

| File | Change |
|------|--------|
| `src/components/chat/chat-nav-rail.tsx` | Reset handler vs bare Link |
| `src/components/chat/chat-center-panel.tsx` | Wire reset callback |
| `src/platform/maps/map-context.tsx` | Clear pins API |
| `src/components/chat/rich-card-results-context.tsx` | Reset counts |

## Acceptance

- [x] New chat → empty message list, zero pins, cleared working memory filters (`ConciergeSessionProvider` + `nav-new-chat`).
- [x] Rental fast-path still works on next message (e2e sends second query path via remount).
- [x] Playwright: `npm run test:e2e:new-chat` PASS (localhost 2026-06-01).
- [ ] Optional manual prod: New chat after rental search on [mdeai.co](https://www.mdeai.co).

## Flow diagram

```mermaid
sequenceDiagram
    participant U as User
    participant Nav as New chat
    participant CK as CopilotKit thread
    participant Mem as Working memory
    participant Map as Map pins

    U->>Nav: click New chat
    Nav->>CK: new threadId / clear messages
    Nav->>Mem: reset ConciergeWorkingMemory
    Nav->>Map: clear pins + selection
    Nav-->>U: empty chat + empty map
```

## Verification (2026-06-01)

| Claim | Result |
|-------|--------|
| PR #36 merged `1a51ad2` | ✅ |
| Linear SAN-321 | ✅ Done |
| `test:e2e:new-chat` | ✅ PASS |
| Prod deploy | ✅ on Vercel (post-merge) |
