---
id: F41
title: /rentals page + map + chat entry (Camila)
status: Not Started
priority: P0
phase: MVP — O3
effort: 3-4h
depends_on: [MAP-001, F24, F46]
skill: [copilotkit-develop, mde-maps]
index_ref: index.md §7 PR-5 · v1/chat-with-your-data
verified_against:
  - /home/sk/mdeai/CopilotKit/examples/v1/chat-with-your-data/
  - /home/sk/mdeai/github/maps/react-google-maps/
---

# F41 — `/rentals` + map (Camila)

## 1. Purpose

Surface for Camila: listing grid + map pins + link to `/chat` for conversational search. Uses F46 workflow results — not standalone `rentalAgent`.

## 2. Acceptance criteria

1. `/rentals` HTTP 200 with ≥1 listing card.
2. Map shows rental pins for visible listings.
3. Chat link routes to `/chat` with router dispatch.
