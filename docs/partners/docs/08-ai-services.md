---
title: "Part 7 — AI Services Catalog"
updated: 2026-06-06
parent: ./00-INDEX.md
note: services mdeai can SELL to partners — built on the same Mastra/Gemini/CopilotKit stack
---

# Part 7 — AI Services Catalog

All run on the existing stack (Mastra agents · Gemini · CopilotKit · Supabase · Postiz · OpenClaw). Sold as add-ons in signup (step 8/9) and the dashboard.

## By vertical

| Vertical | AI service | What it does | Stack | Tier |
|---|---|---|---|---|
| **Restaurants** | Menu optimization | rank/describe items, highlight margins | Gemini | Growth |
| | AI marketing/promos | draft + schedule promos | Postiz | Growth |
| | AI review replies | draft replies (HITL) | Mastra | Growth |
| | AI promotions | time-based offers | Mastra | Pro |
| **Cafés** | AI posts | auto social content | Postiz | Growth |
| | Remote-work tagging | auto-classify vibe/wifi | Gemini | Free |
| **Nightclubs/Bars** | AI event creation | draft event from a sentence | host wizard | Growth |
| | AI ticket pricing | suggest tiers by demand | Mastra | Pro |
| | Recurring ingest | pull weekly nights | OpenClaw | Pro |
| **Event Hosts** | AI event creation | full draft + tiers | host wizard | Free |
| | AI promo campaigns | multi-channel promo | Postiz | Growth |
| | AI audience targeting | who to reach | Mastra | Pro |
| **Real Estate** | AI listing creation | listing from photos | Gemini vision | Growth |
| | AI lead qualification | score + route leads | Mastra | Growth |
| | AI viewing scheduling | auto-schedule HITL | Mastra | Pro |
| **Sponsors** | Sponsorship matching | match brand ↔ events/audience | Mastra | Custom |
| | Campaign recommendations | optimize spend | Mastra | Custom |
| **Vendors** | Storefront optimization | titles/photos/pricing | Gemini | Growth |
| **All / Agencies** | Custom AI builds | bespoke agents/automation | full stack | Retainer |
| | Social management | done-for-you Postiz | Postiz | $/mo |
| | Data/event automation | scraping/ingestion | OpenClaw | $/mo |

## Pricing tiers (cross-vertical)

| Tier | Price (placeholder) | Includes |
|---|---|---|
| **Free** | $0 | Listing · concierge surfacing · basic profile · 1 AI service |
| **Growth** | $/mo | + AI marketing (Postiz) · AI replies · analytics · featured slots |
| **Pro** | $$/mo | + automations (OpenClaw ingest, auto-scheduling) · pricing AI · priority placement |
| **Agency / Custom** | retainer + setup | bespoke builds · multi-location · API · dedicated success |

## Guardrails
- **HITL on money + public content** (replies, prices, posts) at default — partner approves.
- **Grounded only** — AI uses real signals (Places, bookings, reviews); never fabricates stats.
- Gemini-only (no other LLM SDK in prod); reuse Mastra agents, don't fork per partner.
