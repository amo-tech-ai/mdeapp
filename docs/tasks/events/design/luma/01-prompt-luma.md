---
title: Luma Forensic Analysis — Master Prompt
date: 2026-06-08
outputs:
  master: ./luma-analysis-master.md
  wireframes: ./02-wireframe-prompts.md
  diagrams: ./03-diagrams.md
  per_screen: ./screens/
screenshots: /home/sk/mdeai/screenshots/luma
---

> **Outputs generated 2026-06-08.** Use this file to re-run or extend analysis when screenshots are added.

You are a Senior Product Designer, UX Architect, Event Platform Expert, AI Systems Architect, and Luma Reverse-Engineering Specialist.

Reference Screens:

- E-1.png
- Events-details-1.png
- Events-discover-1.png
- Events-list-1.png
- Events-medelin1.png
- Events-pay.png
- Events-profile.png
- me-1.png
- me-2.png
- me-3.png
- me-4.png
- me-5.png
- me-6.png

Goal:

Perform a complete forensic analysis of the Luma platform and create a master document explaining:

- UI
- UX
- Layouts
- Information Architecture
- User Journeys
- Event Workflows
- Host Workflows
- Registration
- Ticketing
- CRM
- Analytics
- Marketing
- Discovery
- Community
- Growth loops
- AI opportunities

Then map everything to mdeai Events.

---

# Phase 1 — Screen Inventory

Analyze every screenshot.

Create:

| Screen | Purpose | User | Status |
|----------|----------|----------|----------|
| Discover |
| Event List |
| Event Detail |
| Checkout |
| Profile |
| Host Dashboard |
| Guests |
| Registration |
| Blasts |
| Analytics |
| Settings |
| Community |

For each screen identify:

- Goals
- Components
- Data
- Actions
- User value
- Business value

---

# Phase 2 — Information Architecture

Map complete Luma IA.

Create sitemap.

Example:

Discover
├── Events
├── Calendars
├── Cities
├── Categories

Event
├── Overview
├── Registration
├── Tickets
├── Location
├── Hosts
├── Community
├── Guests

Host
├── Overview
├── Guests
├── Registration
├── Blasts
├── Insights
├── Settings

Profile
├── Hosting
├── Attending
├── Past Events

Generate Mermaid diagram.

---

# Phase 3 — User Journey Analysis

Analyze journeys.

## Camila

Discover event
→ View event
→ Register
→ Join chat
→ Attend
→ Receive follow-up

## Andrés

Find paid event
→ Checkout
→ Stripe
→ Ticket
→ QR
→ Check-in

## Roberto

Create event
→ Configure
→ Publish
→ Invite
→ Market
→ Manage guests
→ Analyze results

Generate Mermaid flows.

---

# Phase 4 — Three Panel Architecture

Analyze Luma's underlying architecture.

Identify:

## Panel 1

Discovery

Examples:

- Search
- Feed
- Categories
- Cities
- Calendars

## Panel 2

Event Experience

Examples:

- Event detail
- Registration
- Checkout
- Community
- Maps

## Panel 3

Host OS

Examples:

- Event management
- CRM
- Guests
- Analytics
- Marketing

Create architecture diagrams.

Then redesign for mdeai.

---

# Phase 5 — Content Structure

Analyze every event page.

Extract sections.

Examples:

- Hero
- Event image
- Date
- Venue
- Registration
- Description
- Agenda
- Speakers
- Hosts
- Attendees
- Community
- Maps
- Related events

For each section:

- Why it exists
- User benefit
- Conversion impact

Score 1-10.

---

# Phase 6 — Host Dashboard Analysis

Analyze:

Overview
Guests
Registration
Blasts
Insights
Settings

For each page identify:

- Components
- Tables
- Actions
- Metrics
- Automations

Then recommend improvements using:

- AI
- CopilotKit
- Mastra
- Supabase
- PG Vector

---

# Phase 7 — AI Opportunities

Identify where Luma lacks AI.

Create:

## Concierge Agent

Examples:

- Find events
- Recommend events
- Build itineraries

## Host Agent

Examples:

- Create event
- Generate content
- Marketing suggestions
- Pricing suggestions

## Marketing Agent

Examples:

- Email campaigns
- WhatsApp campaigns
- Social campaigns

## Venue Agent

Examples:

- Venue matching
- Capacity planning
- Budget planning

## Sponsor Agent

Examples:

- Sponsor matching
- Proposal generation

For each define:

- Inputs
- Outputs
- Tools
- Workflows

---

# Phase 8 — mdeai Mapping

Create:

| Luma Feature | mdeai Equivalent | Status | Linear |
|-------------|-----------------|---------|---------|

Categories:

- Discovery
- Ticketing
- Registration
- Hosting
- CRM
- Marketing
- Analytics
- Community
- AI

---

# Phase 9 — Missing Screens

Identify screens mdeai should add.

Examples:

- Host Analytics
- Event Marketing
- Event CRM
- Sponsor Dashboard
- Venue Dashboard
- WhatsApp Campaigns
- Discovery Queue
- Event AI Copilot

For each:

- Purpose
- User
- Priority
- MVP or Future

---

# Phase 10 — Create Master Document

Create / update:

- `tasks/events/design/luma/luma-analysis-master.md`
- `tasks/events/design/luma/02-wireframe-prompts.md` (index)
- `tasks/events/design/luma/03-diagrams.md` (Mermaid)
- `tasks/events/design/luma/screens/{NN}-{slug}.md` (one per screen)

Include:

1. Executive Summary
2. Screen Inventory
3. UX Review
4. Layout Review
5. Information Architecture
6. User Journeys
7. Host Workflows
8. Ticketing Workflows
9. Marketing Workflows
10. CRM Workflows
11. AI Opportunities
12. mdeai Mapping
13. Missing Screens
14. Recommended Roadmap
15. Mermaid Diagrams

Output final tables:

- Top 25 Luma features
- Top 25 features mdeai should copy
- Top 25 AI enhancements mdeai should add
- MVP vs Growth vs Advanced roadmap

Be extremely detailed and evidence-based from the screenshots.
Do not assume.
Document exactly what exists and why it exists.