# Rental Host Dashboard + Lead Management
> Routes: `/host/rentals` · `/host/rentals/[id]/leads`  
> User: Rental Host  
> Phase: Core · P1

---

## Rental Dashboard Wireframe

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  ▣ mdeai  Rentals Dashboard                                       🔔  Diego  │
├─────────────────┬──────────────────────────────────────┬───────────────────────┤
│  LEFT 280px     │  CENTER                              │  RIGHT 360px          │
│  ─────────────  │                                      │                       │
│  🏠 Rentals ←  │  Good morning, Diego 👋               │  ┌─────────────────┐  │
│  ─────────────  │                                      │  │  This Month     │  │
│  My Properties  │  ── Needs Attention ──               │  │  4 inquiries    │  │
│  Apto Estadio   │                                      │  │  2 viewings     │  │
│  Apt Laureles   │  ┌─────────────────────────────┐    │  │  1 viewing done │  │
│  ─────────────  │  │ ⚡ Camila González           │    │  │  $0 revenue     │  │
│  [+ Add Listing]│  │ Inquired 2h ago · No reply  │    │  │  (no signed     │  │
│  ─────────────  │  │ [Reply with AI Draft]        │    │  │   lease yet)    │  │
│  AI Summary     │  └─────────────────────────────┘    │  └─────────────────┘  │
│  "2 inquiries   │                                      │                       │
│  need reply"    │  ┌─────────────────────────────┐    │  ┌─────────────────┐  │
│                 │  │ ⚡ Viewing tomorrow 10am     │    │  │  Lead Pipeline  │  │
│                 │  │ Camila · Apto El Estadio     │    │  │  ─────────────  │  │
│                 │  │ [View Details] [Prep Checklist│   │  │  New:     2     │  │
│                 │  └─────────────────────────────┘    │  │  Contacted: 1   │  │
│                 │                                      │  │  Viewing: 1     │  │
│                 │  ── Active Listings ──               │  │  Closed: 0      │  │
│                 │                                      │  └─────────────────┘  │
│                 │  ┌─────────────────────────────┐    │                       │
│                 │  │ 🏠 Apto El Estadio          │    │                       │
│                 │  │ $950/mo · Active · 4 views  │    │                       │
│                 │  │ [Manage] [See Leads]        │    │                       │
│                 │  └─────────────────────────────┘    │                       │
│                 │  ┌──────────────────────────────┐   │                       │
│                 │  │ 💬 Ask about your listings [▶│   │                       │
│                 │  └──────────────────────────────┘   │                       │
└─────────────────┴──────────────────────────────────────┴───────────────────────┘
```

---

## Lead Management Wireframe

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  ▣ mdeai  Apto El Estadio › Leads                                🔔  Diego   │
├─────────────────┬──────────────────────────────────────┬───────────────────────┤
│  LEFT 280px     │  CENTER — CRM Pipeline               │  RIGHT 360px          │
│  ─────────────  │                                      │                       │
│  NEW (2)        │  ┌─────── NEW ──────────────────┐   │  ┌─────────────────┐  │
│  CONTACTED (1)  │  │ Camila G · 2BR · Jan 15     │   │  │  AI Draft       │  │
│  VIEWING (1)    │  │ $950–1200 · Pet-friendly    │   │  │  ─────────────  │  │
│  CLOSED (0)     │  │ Score: 92 · Inquiry: 2h ago  │   │  │  "Hi Camila,    │  │
│  ─────────────  │  │ [Reply] [Move Stage] [Details│   │  │  Thanks for     │  │
│  [+ Add Lead]   │  └─────────────────────────────┘   │  │  your interest  │  │
│                 │                                      │  │  in Apto El     │  │
│                 │  ┌─────── NEW ──────────────────┐   │  │  Estadio...     │  │
│                 │  │ Miguel T · 1BR · Feb 1      │   │  │                 │  │
│                 │  │ $800–1000 · No pets         │   │  │  [Edit] [Send]  │  │
│                 │  │ Score: 71 · Inquiry: 1d ago  │   │  └─────────────────┘  │
│                 │  │ [Reply] [Move Stage] [Details│   │                       │
│                 │  └─────────────────────────────┘   │  ┌─────────────────┐  │
│                 │                                      │  │  Lead Score     │  │
│                 │  ┌─────── VIEWING ──────────────┐   │  │  Camila: 92/100 │  │
│                 │  │ Ana R · 2BR · Jan 20        │   │  │  "Budget: ✓     │  │
│                 │  │ Viewing: Tue Jan 7 · 3pm    │   │  │  Beds: ✓        │  │
│                 │  │ [Prep Notes] [Confirm]      │   │  │  Timeline: ✓    │  │
│                 │  └─────────────────────────────┘   │  │  Pets: ✓"       │  │
│                 │                                      │  └─────────────────┘  │
└─────────────────┴──────────────────────────────────────┴───────────────────────┘
```

---

## AI Features
- AI lead score (0–100) calculated from: budget match, timeline, bed count match, pet policy
- AI draft reply auto-generated from user profile + inquiry content
- "Prep Checklist" before viewing: "Clean common areas, prepare lease FAQ, print floor plan"
- Auto follow-up: "Ana hasn't replied in 48h — want me to send a gentle nudge?"
