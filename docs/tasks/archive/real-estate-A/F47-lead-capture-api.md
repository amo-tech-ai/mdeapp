---
id: F47
title: Lead capture from chat/rental cards → leads row
status: Done
priority: P0
phase: MVP — O3
effort: 2h
depends_on: [F46, F08]
skill: [mde-supabase, copilotkit-develop]
prd_ref: plan/prd/06-rentals-leads.md
---

# F47 — Lead capture (MVP O3)

## 1. Purpose

MVP requires **one `leads` row** from a chat/rental session. Wire CTA on `RentalCard` → `POST /api/leads` (or edge) with RLS-safe insert and `source = mdeai-app`.

## 2. Acceptance criteria

1. Click CTA → `leads` row visible in Supabase.
2. Auth optional or session-attributed per RLS policy.
3. localhost proof + SQL in evidence.
