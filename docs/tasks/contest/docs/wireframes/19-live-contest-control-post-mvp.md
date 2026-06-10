---
title: Live Contest Control Post-MVP Wireframe
status: Draft
date: 2026-06-03
screen_id: CONT-WF-19
path: /live/contests/[id]
persona: Producer
task: Future
phase: Post-MVP
repo_refs:
  - OpenStreamPoll
  - Helios Server
code_refs:
  - /home/sk/mdeai/mdeapp/src/components/ui/button.tsx
  - /home/sk/mdeai/mdeapp/src/components/ui/badge.tsx
  - /home/sk/mdeai/mdeapp/src/lib/supabase/service.ts
---

# Live Contest Control Post-MVP

## Purpose

Producer-facing control surface for live audience prompts, overlay state, QR moments, and tally display after MVP vote truth is stable.

## Wireframe

```text
+--------------------------------------------------------------------------------+
| Live control                                       Start segment | Freeze display|
+------------------------------+-------------------------------------------------+
| Rundown                      | Overlay preview                                  |
| Intro, contestants, vote QR  | Active QR, vote count display, sponsor slide     |
| Segment controls             | Audit/tally status and emergency stop            |
+------------------------------+-------------------------------------------------+
```

## Components And Code To Use

- Study OpenStreamPoll for live overlay/QR mechanics only.
- Use Helios concepts for never treating overlay state as vote truth.
- Use shadcn `Button`, `Badge`, `Card`, `Dialog`, `Tooltip`.

## States

Offline, rehearsal, live, overlay active, QR expired, tally frozen, emergency stop, producer denied.

## Responsive

Desktop-first production console. Tablet allowed for monitoring. Mobile is read-only/status-only.

## Tests / Proof

Post-MVP only: overlay route smoke, Supabase realtime proof, emergency stop test, vote truth separation test.

## Confidence

Medium. Correctly deferred until MVP ledgers are proven.
