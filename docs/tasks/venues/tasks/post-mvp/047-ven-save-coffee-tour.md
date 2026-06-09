---
id: VEN-047
title: saveCoffeeTour + user interactions RLS
status: Open
priority: P2
phase: CTI-B
effort: 3h
owner: claude
depends_on: [VEN-032, VEN-038, F08]
blocks: [VEN-051]
skill: [mde-supabase, mastra, copilotkit-agui]
mcp: [user-supabase]
---

# VEN-047 — Save coffee tour

## In plain English

Let **logged-in users** save tours to a personal list — stored in `coffee_tour_user_interactions` with RLS so only they see their saves.

## User story

**As Camila (logged in on `/chat`),** I want to tap **Save** on a tour card, **so that** I can come back after comparing rentals and events without re-asking the agent.

## Real-world example

Camila saves *Tour Urbano La Sierra* → row in `coffee_tour_user_interactions` with her `auth.uid()`; Andrés cannot see her list; Saved appears in nav (minimal list OK for MVP).

## Goals

1. Write tool `saveCoffeeTour` (auth required).
2. Card Save button → tool or server action.
3. Saved list surface (minimal) or profile hook.

## Success criteria

1. User A cannot read User B saves.
2. Vitest: RLS policy mock or integration doc.
3. Save button only when authenticated (F08).
4. No service role key in `mdeapp/src/**`.

## Do not

- Service role in client components.
