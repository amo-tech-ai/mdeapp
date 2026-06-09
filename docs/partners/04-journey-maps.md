---
title: "Part 3 — Partner Journey Maps (Mermaid ×10)"
updated: 2026-06-06
parent: ./00-INDEX.md
note: every journey = Discovery → Marketing → Signup → AI onboarding → Dashboard → Revenue → Automation → Retention
---

# Part 3 — Partner Journey Maps

Common spine (all 10): `Discovery → Marketing page → Signup (typed wizard) → AI onboarding → Dashboard → Revenue → Automation → Retention`. Diagrams show the vertical-specific deltas.

## 1. Restaurant

```mermaid
flowchart LR
  D["Discovery<br/>search · concierge mentions"] --> M["/venues (restaurant)"]
  M --> S["signup?type=venue"] --> AO["AI onboarding<br/>menu · hours · photos"]
  AO --> DASH["Dashboard"] --> REV["Revenue<br/>featured · reservations"]
  REV --> AU["Automation<br/>AI review replies · promos · posts"]
  AU --> RET["Retention<br/>weekly insights · renewal"]
```

## 2. Café

```mermaid
flowchart LR
  D["Discovery<br/>nomad searches 'work cafés'"] --> M["/venues (café)"]
  M --> S["signup?type=venue"] --> AO["AI onboarding<br/>wifi · vibe · remote-work tags"]
  AO --> DASH["Dashboard"] --> REV["Revenue<br/>featured placement"]
  REV --> AU["Automation<br/>Postiz posts · promos"] --> RET["Retention<br/>foot-traffic insights"]
```

## 3. Nightclub

```mermaid
flowchart LR
  D["Discovery<br/>'tonight in Provenza'"] --> M["/venues (nightclub)"]
  M --> S["signup?type=venue"] --> AO["AI onboarding<br/>recurring nights · capacity"]
  AO --> DASH["Dashboard"] --> EV["Publish event (AI wizard)"]
  EV --> REV["Revenue<br/>tickets · table booking · featured"]
  REV --> AU["Automation<br/>Postiz · OpenClaw recurring ingest"] --> RET["Retention<br/>fill-rate reports"]
```

## 4. Event Host (Roberto)

```mermaid
flowchart LR
  D["Discovery<br/>/host ad · referral"] --> M["/host"]
  M --> S["signup?type=host"] --> AO["AI onboarding<br/>org profile"]
  AO --> NEW["/host/event/new<br/>AI form-fill"] --> HITL{"Approve?"}
  HITL -- yes --> REV["Revenue<br/>ticket % · featured"]
  HITL -- edit --> NEW
  REV --> AU["Automation<br/>AI promo · audience targeting"] --> RET["Retention<br/>repeat events"]
```

## 5. Sponsor

```mermaid
flowchart LR
  D["Discovery<br/>reach pitch · outreach"] --> M["/sponsors"]
  M --> S["signup?type=sponsor / demo"] --> REVW{"Patricia review"}
  REVW -- approved --> CAMP["AI onboarding<br/>goals · budget · match"]
  CAMP --> DASH["Sponsor dashboard"] --> REV["Revenue<br/>sponsored events · placements"]
  REV --> AU["Automation<br/>campaign optimize · reporting"] --> RET["Retention<br/>renew · upsell"]
```

## 6. Real Estate Host / Broker

```mermaid
flowchart LR
  D["Discovery<br/>Camila demand · referral"] --> M["/partners/rentals"]
  M --> S["signup?type=broker"] --> AO["AI onboarding<br/>AI listing draft from photos"]
  AO --> DASH["/broker dashboard"] --> LEAD["Leads<br/>schedule-viewing (HITL)"]
  LEAD --> REV["Revenue<br/>lead fee · booking commission"]
  REV --> AU["Automation<br/>AI lead-qual · auto-reply · scheduling"] --> RET["Retention<br/>portfolio insights"]
```

## 7. Vendor (marketplace — Phase 3)

```mermaid
flowchart LR
  D["Discovery<br/>local SMB outreach"] --> M["/partners/vendor"]
  M --> S["signup?type=vendor"] --> AO["AI onboarding<br/>storefront · catalog import"]
  AO --> DASH["Vendor dashboard"] --> REV["Revenue<br/>product commission · subscription"]
  REV --> AU["Automation<br/>AI storefront optimize · restock alerts"] --> RET["Retention<br/>sales analytics"]
```

## 8. Marketplace Seller (services)

```mermaid
flowchart LR
  D["Discovery<br/>event-service demand"] --> M["/partners/vendor (service)"]
  M --> S["signup?type=vendor"] --> AO["AI onboarding<br/>service · pricing · availability"]
  AO --> DASH["Dashboard"] --> BOOK["Bookings<br/>requests → confirm"]
  BOOK --> REV["Revenue<br/>booking commission"]
  REV --> AU["Automation<br/>AI quote · calendar sync"] --> RET["Retention<br/>repeat bookings · reviews"]
```

## 9. Tour Operator

```mermaid
flowchart LR
  D["Discovery<br/>tourist itineraries"] --> M["/partners?type=tour"]
  M --> S["signup?type=partner"] --> AO["AI onboarding<br/>experiences · times · capacity"]
  AO --> DASH["Dashboard"] --> INC["Included in AI itineraries / trips"]
  INC --> REV["Revenue<br/>booking commission"]
  REV --> AU["Automation<br/>AI itinerary placement · reminders"] --> RET["Retention<br/>seasonal campaigns"]
```

## 10. Influencer / Creator

```mermaid
flowchart LR
  D["Discovery<br/>creator program ad"] --> M["/partners/creator"]
  M --> S["signup?type=partner (creator)"] --> AO["AI onboarding<br/>niche · audience"]
  AO --> BUILD["AI guide builder"] --> SHARE["Share guides · affiliate links"]
  SHARE --> REV["Revenue<br/>affiliate · commission · tips"]
  REV --> AU["Automation<br/>auto-update guides · payout"] --> RET["Retention<br/>leaderboard · tiers"]
```

**Reuse note:** every "AI onboarding" node = the same `/partners/signup` co-pilot (see Part 4); every "Dashboard" = the same shell (Part 5). Verticals differ only in fields + which services switch on.
