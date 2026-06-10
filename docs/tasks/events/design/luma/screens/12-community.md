---
screen: Community
screenshots: [community block on event — capture needed]
route: /events/[slug]#community
persona: Camila
mdeai_status: not-built
linear: EVP-044, SAN-147
---

# Wireframe — Luma Community Block

## Goals

Show recurring group identity; drive repeat attendance; optional WhatsApp/link.

## ASCII — on event detail

```text
┌─────────────────────────────────────┐
│ Community                           │
├─────────────────────────────────────┤
│ [logo] Parceros Community           │
│ Weekly startup nights in Poblado    │
│ 12 past events · 840 members        │
│ [Follow] [View community]           │
├─────────────────────────────────────┤
│ WhatsApp circle (after register)    │
│ [Join link — host approved]         │
└─────────────────────────────────────┘
```

## Component inventory

| Component | Type | Phase |
|-----------|------|-------|
| CommunityCard | domain | P2 |
| WhatsAppLink | domain | P3 — opt-in |

## mdeai mapping

EVP-044 — host-controlled URL; visibility after ticket purchase optional.

## Non-negotiable

No autonomous WhatsApp bulk send; opt-in + template compliance (PRD Phase 2).

## Wireframe prompt

Capture Luma community section on event page — note CTA copy and gating.
