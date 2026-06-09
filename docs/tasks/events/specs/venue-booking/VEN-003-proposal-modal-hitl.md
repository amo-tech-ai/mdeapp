---
id: VEN-003
linear: SAN-496
status: Spec-only
persona: roberto
pattern: OVL-003 HITL
updated: 2026-06-08
---

# VEN-003 — Request proposal modal (HITL)

## Purpose

Roberto submits event date, headcount, budget → venue/Patricia approves.

## Layout

Dialog: form fields · summary · Submit · CopilotKit optional prefill from host wizard

## Fields

date, guests, budget, notes, contact

## Acceptance

- [ ] renderAndWaitForResponse or form POST + admin queue
- [ ] Creates row in booking queue (VEN-007)
