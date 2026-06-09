---
title: "Brand Asset Management + Social Media Automation"
updated: 2026-06-06
parent: ./00-INDEX.md
note: Parts 8 + 9 — both feed the Postiz pipeline
---

# Brand Assets + Social Automation (Parts 8 & 9)

Partner assets feed the AI content + Postiz social pipeline. One asset store, one publish pipeline.

## Brand asset management

Assets: logos · photos · videos · menus · brand guidelines · social accounts · marketing assets.

```mermaid
flowchart LR
  UP["Upload<br/>partner / Google Business import"] --> VAL["Validate<br/>type · size · rights"]
  VAL --> AIP["AI process<br/>tag · alt-text · crop · best-pick · brand-extract"]
  AIP --> STORE["Store (Supabase Storage, RLS)"]
  STORE --> USE["Usage<br/>listings · posts · landing · concierge cards"]
  USE --> REUSE["Reused across all surfaces"]
```

- **Brand guidelines extracted** (colors/voice) → AI content stays on-brand.
- Rights/consent recorded on upload; partner owns assets.
- One store; every surface (listing, Postiz post, card) references it — no re-upload.

## Social media automation (Postiz)

Channels: Instagram · Facebook · TikTok · LinkedIn · WhatsApp · Google Business Profile.

```mermaid
flowchart LR
  TRIG["Trigger<br/>new event · promo · schedule"] --> GEN["AI content creation<br/>(assets + brand voice)"]
  GEN --> APP{"Partner approves"}
  APP -- edit --> GEN
  APP -- yes --> SCHED["Schedule (Postiz)"]
  SCHED --> PUB["Publish to channels"]
  PUB --> REP["Report<br/>reach · engagement · clicks"]
  REP --> OPP["Dashboard → next post suggestion"]
```

## Notes
- **Postiz** owns scheduling/publishing; mdeai owns content gen (Gemini) + approval (HITL) + assets.
- WhatsApp + Google Business Profile via existing Chatwoot/Places integrations.
- Cadence + channels set in signup step 8 / dashboard Marketing tab.
- All public posts are HITL — partner approves before anything goes live.
