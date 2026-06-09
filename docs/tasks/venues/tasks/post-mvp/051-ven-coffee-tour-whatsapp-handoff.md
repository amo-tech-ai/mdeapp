---
id: VEN-051
title: WhatsApp handoff for coffee tours
status: Open
priority: P3
phase: CTI-C
effort: 4h
owner: claude
depends_on: [VEN-047, VEN-037, F08]
blocks: []
skill: [mde-supabase]
mcp: []
deferred_skill: [mde-whatsapp]
---

# VEN-051 — WhatsApp handoff

## In plain English

Add a **WhatsApp button** on tour cards when we have a verified phone from Places/DB — opens `wa.me` with a pre-filled message. No bot sending messages in this task (Colombia Phase 2).

## User story

**As a Tourist in Colombia,** I want to message the tour operator in WhatsApp in one tap, **so that** I can book in the channel locals actually use.

## Real-world example

Card for La Casa Grande shows **WhatsApp** → `https://wa.me/57300…?text=Hola, quiero información sobre el tour de café…` — only if `phone` + `source_confidence` pass threshold; no phone → button hidden.

## Goals

1. CTA on `CoffeeTourCard` when `phone` + `source_confidence` ≥ threshold.
2. Template message query param (pre-filled Spanish/English).
3. Full WA concierge deferred to Phase 2 OpenClaw (OCL-014-postmvp).

## Success criteria

1. No WA send without verified phone from Places/DB.
2. Link opens WhatsApp with correct country code (+57).
3. Static deep link only — no `mde-whatsapp` bot until Phase 2 (OCL-014-postmvp for full WA concierge).

## Note

`mde-whatsapp` is 🔴 deferred in index-skills — static deep link only for VEN-051.
