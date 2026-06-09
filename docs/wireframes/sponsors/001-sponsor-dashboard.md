# Sponsor Dashboard + Opportunity Discovery
> Routes: `/sponsor` · `/sponsor/discover`  
> User: Sponsor (Patricia's ops contact)  
> Phase: MVP · P1

---

## Sponsor Dashboard Wireframe

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  ▣ mdeai  Sponsor Dashboard                              🔔  Águila Beer Co. │
├─────────────────┬──────────────────────────────────────┬───────────────────────┤
│  LEFT 280px     │  CENTER                              │  RIGHT 360px          │
│  ─────────────  │                                      │                       │
│  📊 Dashboard ← │  Good morning, Águila! 🍺            │  ┌─────────────────┐  │
│  🔍 Discover    │                                      │  │  Pipeline       │  │
│  📋 Proposals   │  ── Active Campaigns ──              │  │  ─────────────  │  │
│  📈 Analytics   │                                      │  │  New:     5     │  │
│  ─────────────  │  ┌─────────────────────────────┐    │  │  Proposed: 2    │  │
│  Brand Profile  │  │ 🎵 Jazz Festival · Jan 20   │    │  │  Active:  1     │  │
│  Industry: Beer │  │ Sponsor: Logo on stage       │    │  │  Complete: 0    │  │
│  Audience: 25–40│  │ Budget: $3,000 committed     │    │  └─────────────────┘  │
│  Budget: $2–5k  │  │ Est. impressions: 5,400      │    │                       │
│  ─────────────  │  │ [View Campaign] [Track ROI]  │    │  ┌─────────────────┐  │
│  [Edit Profile] │  └─────────────────────────────┘    │  │  Total Invested │  │
│                 │                                      │  │  $3,000         │  │
│                 │  ── AI Recommendations ──            │  │  Est. ROI:      │  │
│                 │                                      │  │  $9,200 earned  │  │
│                 │  ┌─────────────────────────────┐    │  │  (3.1× return)  │  │
│                 │  │ ⭐ Salsa Festival · Feb 8    │    │  └─────────────────┘  │
│                 │  │ 2,000 guests · Fit: 91/100   │    │                       │
│                 │  │ Budget: $2,500               │    │  ┌─────────────────┐  │
│                 │  │ "Your audience age matches   │    │  │  ⚡ AI           │  │
│                 │  │ 85% of confirmed attendees"  │    │  │  "Salsa Fest is │  │
│                 │  │ [View] [Generate Proposal]   │    │  │  your highest   │  │
│                 │  └─────────────────────────────┘    │  │  fit event this │  │
│                 │                                      │  │  month"         │  │
│                 │  ┌──────────────────────────────┐   │  └─────────────────┘  │
│                 │  │ 💬 Ask about sponsorships [▶]│   │                       │
│                 │  └──────────────────────────────┘   │                       │
└─────────────────┴──────────────────────────────────────┴───────────────────────┘
```

---

## Opportunity Discovery Wireframe

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  ▣ mdeai  Discover Opportunities                                  🔔           │
├─────────────────┬──────────────────────────────────────┬───────────────────────┤
│  LEFT 280px     │  CENTER                              │  RIGHT 360px          │
│  ─────────────  │                                      │                       │
│  Filters        │  AI: "12 brand-fit events this        │  ┌─────────────────┐  │
│  Date: Jan–Mar  │  quarter matching Águila Beer Co.     │  │  Fit Score      │  │
│  Budget: $1–5k  │  Sorted by audience overlap."        │  │  Legend:        │  │
│  Min att: 500   │                                      │  │  90+  Perfect   │  │
│  ─────────────  │  ┌─────────────────────────────┐    │  │  80–89 Great    │  │
│  Event Types    │  │ 🎵 Salsa Festival · Feb 8    │    │  │  70–79 Good     │  │
│  ● Music        │  │ 2,000 attendees · El Centro  │    │  │  <70  Skip      │  │
│  ● Outdoor      │  │ Fit: 91/100 · Budget: $2,500 │    │  └─────────────────┘  │
│  ○ Nightlife    │  │ Audience: 78% within 25–35   │    │                       │
│  ○ Sports       │  │ [Generate Proposal] [Pass]   │    │  ┌─────────────────┐  │
│                 │  └─────────────────────────────┘    │  │  🗺️ Event map   │  │
│                 │                                      │  │  Medellín        │  │
│                 │  ┌─────────────────────────────┐    │  │  [●] Salsa Fest  │  │
│                 │  │ 🎉 Beer Festival · Feb 22    │    │  │  [●] Beer Fest   │  │
│                 │  │ 5,000 attendees · Envigado   │    │  │  [●] Jazz Night  │  │
│                 │  │ Fit: 88/100 · Budget: $4,000 │    │  └─────────────────┘  │
│                 │  │ [Generate Proposal] [Pass]   │    │                       │
│                 │  └─────────────────────────────┘    │                       │
│                 │  ┌──────────────────────────────┐   │                       │
│                 │  │ 💬 What events are you targeting│  │                       │
│                 │  └──────────────────────────────┘   │                       │
└─────────────────┴──────────────────────────────────────┴───────────────────────┘
```

---

## Proposal Generation HITL

```
┌──────────────────────────────────────────────────────┐
│  📋 Generated Proposal — Salsa Festival              │
│                                                      │
│  To: Salsa Festival Organizer                        │
│  From: Águila Beer Co.                               │
│                                                      │
│  Partnership Proposal                                │
│  ─────────────────────────────────────────────────  │
│  We'd like to sponsor the Salsa Festival with        │
│  stage presence + branded bar area for $2,500.       │
│                                                      │
│  Your audience of 2,000 (78% age 25–35) aligns      │
│  perfectly with our target demographic.              │
│                                                      │
│  Expected ROI: 3.2× based on comparable events.     │
│  ─────────────────────────────────────────────────  │
│                                                      │
│  [✅ Send Proposal]  [✏️ Edit]  [✕ Cancel]          │
└──────────────────────────────────────────────────────┘
```

---

## AI Features
- Fit score: agent calculates audience overlap % between sponsor profile and event attendees
- Proposal auto-generated from brand profile + event data — no manual writing
- ROI estimate from comparable past sponsorships on platform
- Post-event: "Jazz Festival reached 5,400 people. Your QR code was scanned 234 times."
