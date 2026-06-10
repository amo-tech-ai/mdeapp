# Saved Items
> Route: `/me/saved`  
> User: Consumer (all roles)  
> Phase: Core · P1

---

## Page Goal

One-stop shelf for everything Camila bookmarked. Mixed-domain (events, rentals, restaurants, cafes, nightlife, venues). AI surfaces saved items that are about to sell out, have new availability, or match upcoming plans.

---

## User Stories

- As Camila, I want to see all the things I saved in one place so I don't lose track.
- As a user, I want the AI to alert me when a saved rental drops in price or a saved event is almost sold out.
- As a user, I want to unsave items I no longer care about.

---

## Desktop Wireframe

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  ▣ mdeai  Saved Items                                             🔔  Camila  │
├─────────────────┬──────────────────────────────────────┬───────────────────────┤
│  LEFT 280px     │  CENTER                              │  RIGHT 360px          │
│  ─────────────  │                                      │                       │
│  📌 Saved ←    │  [All] [Events] [Rentals] [Food]      │  ┌─────────────────┐  │
│  ─────────────  │  [Venues] [Nightlife]    Total: 7    │  │  ⚡ AI           │  │
│  Sort           │  ─────────────────────────────────   │  │  "Jazz Night    │  │
│  ● Recent       │                                      │  │  is 90% sold.   │  │
│  ○ Domain       │  ┌─────────────────────────────┐    │  │  You saved it   │  │
│  ○ Urgency      │  │ 🎵 Jazz Night               │    │  │  3 days ago."   │  │
│  ─────────────  │  │ Fri Jan 10 · 9pm–1am        │    │  │  [Buy Ticket]   │  │
│  AI Summary     │  │ Parque Lleras               │    │  └─────────────────┘  │
│  "Jazz Night    │  │ 🔥 90% sold · 2 days away   │    │                       │
│  90% sold"      │  │ [♡ Saved] [Buy Ticket ▶]   │    │  ┌─────────────────┐  │
│  "Apto price    │  └─────────────────────────────┘    │  │  Map            │  │
│  dropped $50"   │                                      │  │  [pins for      │  │
│                 │  ┌─────────────────────────────┐    │  │  saved items]   │  │
│                 │  │ 🏠 Apto El Estadio           │    │  └─────────────────┘  │
│                 │  │ Laureles · 2BR · Furnished   │    │                       │
│                 │  │ $900/mo ↓ was $950           │    │                       │
│                 │  │ 🟢 Available · Updated today  │    │                       │
│                 │  │ [♡ Saved] [Inquire ▶]       │    │                       │
│                 │  └─────────────────────────────┘    │                       │
│                 │                                      │                       │
│                 │  ┌─────────────────────────────┐    │                       │
│                 │  │ 🍽️ Oci.Mde                  │    │                       │
│                 │  │ Provenza · Upscale Colombian │    │                       │
│                 │  │ ⭐ 4.8 · Avg $45/person      │    │                       │
│                 │  │ [♡ Saved] [Reserve ▶]       │    │                       │
│                 │  └─────────────────────────────┘    │                       │
│                 │  ┌──────────────────────────────┐   │                       │
│                 │  │ 💬 Ask about your saves  [▶] │   │                       │
│                 │  └──────────────────────────────┘   │                       │
└─────────────────┴──────────────────────────────────────┴───────────────────────┘
```

---

## Mobile Wireframe

```
┌─────────────────────────────────────┐
│  ← Saved (7)                       │
│  [All] [Events] [Rentals] [Food]   │
│  ─────────────────────────────     │
│  ⚡ Jazz Night 90% sold! [Buy]     │
│  ─────────────────────────────     │
│  🎵 Jazz Night · Fri Jan 10        │
│  Parque Lleras · 🔥 90% sold       │
│  [♡] [Buy Ticket]                  │
│                                     │
│  🏠 Apto El Estadio · $900 ↓$950  │
│  Laureles · Available · Today      │
│  [♡] [Inquire]                     │
│                                     │
│  🍽️ Oci.Mde · Provenza             │
│  ⭐ 4.8 · Reserve table            │
│  [♡] [Reserve]                     │
│  ─────────────────────────────     │
│  [💬 Ask about your saves]         │
└─────────────────────────────────────┘
```

---

## States

### Loading State

```
┌────────────────────────────────────────────────────────┐
│  Saved Items                                           │
│  [████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░]    │ ← skeleton
│  [████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░]    │ ← skeleton
└────────────────────────────────────────────────────────┘
```

### Empty State (nothing saved)

```
┌────────────────────────────────────────────────────────┐
│  📌 Nothing saved yet                                  │
│                                                        │
│  Tap the ♡ on any event, rental, or place             │
│  to save it here.                                     │
│                                                        │
│  [Explore Events]   [Browse Rentals]                  │
└────────────────────────────────────────────────────────┘
```

### Empty State (filtered, e.g. Events tab has no saves)

```
┌────────────────────────────────────────────────────────┐
│  No saved events                                       │
│  [Browse Events →]                                    │
└────────────────────────────────────────────────────────┘
```

---

## Saved Item Card Anatomy

```
┌─────────────────────────────────────────────────────┐
│ [domain emoji] [Title]                              │
│ [Subtitle: location / date / price]                 │
│ [status badge] · [freshness label]                  │
│ [♡ Saved — click to unsave]   [Primary CTA ▶]      │
└─────────────────────────────────────────────────────┘
```

Status badges:
| Domain | Badge examples |
|---|---|
| Events | `🔥 90% sold`, `🎟️ Tickets available`, `✅ Free` |
| Rentals | `🟢 Available`, `🟡 Pending inquiry`, `🔴 Taken` |
| Restaurants | `✅ Walk-ins welcome`, `📅 Reserve required` |
| Cafes | `📡 300Mbps · Open until 10pm` |
| Nightlife | `🎉 Tonight · Entry $15` |

---

## Components

| Component | Props | Notes |
|---|---|---|
| `SavedItemsList` | `items[]`, `filter`, `isLoading` | Virtualized; filter tabs at top |
| `SavedItemSkeleton` | — | Loading state |
| `SavedEmptyState` | `domain?`, `onExplore` | Global or per-tab empty |
| `SavedCard` | `item`, `onUnsave`, `onCta` | Polymorphic — renders for any domain |
| `StatusBadge` | `domain`, `status` | Domain-appropriate badge |
| `FreshnessBadge` | `updatedAt` | "Updated today" / "N days ago" |
| `PriceChangeBadge` | `oldPrice`, `newPrice` | `↓ was $950` in green |
| `AIUrgencyAlert` | `message`, `ctaLabel`, `onCta` | Right panel when AI detects urgency |
| `SavedMapPanel` | `items[]` | Map pins for all saved items |

---

## Data Contract

```typescript
// Supabase: saved_items table
type SavedItem = {
  id: string
  user_id: string
  entity_id: string
  entity_type: "event" | "rental" | "venue" | "restaurant" | "cafe" | "nightlife"
  saved_at: string

  // Joined from entity table
  title: string
  subtitle: string
  price: number | null
  status: string        // "available" | "sold_out" | "limited" etc.
  updated_at: string    // from entity table
  lat: number | null
  lng: number | null
}
```

---

## AI Features

| Feature | Trigger | HITL? |
|---|---|---|
| Urgency alerts | Page load; event <90% capacity or <48h away | No |
| Price drop notification | Rental price decreases | No — info card |
| Availability change | Rental status changes | No — badge update |
| "Plan my weekend" | Chat: "what should I do this weekend?" | No |
| Cross-domain plan | "I'm going to Jazz Night — find a restaurant nearby" | No |

---

## RLS Policy

```sql
ALTER TABLE saved_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_saves"
  ON saved_items FOR ALL
  USING (user_id = auth.uid());
```

---

## Mermaid — Saved Items Flow

```mermaid
flowchart TD
  A([/me/saved]) --> L[Load saved_items WHERE user_id=auth.uid()]
  L --> AI[conciergeAgent scans for urgency]
  AI --> U{Urgent items?}
  U -->|Yes| ALERT[Show AIUrgencyAlert in right panel]
  U -->|No| LIST[Render saved cards]
  ALERT --> LIST
  LIST --> S{User action}
  S -->|Unsave| DEL[DELETE saved_items WHERE id=?]
  S -->|Buy / Inquire / Reserve| CTA[Navigate to entity CTA flow]
  S -->|Chat| CHAT[conciergeAgent cross-domain planning]
```

---

## Analytics Events

| Event | Properties |
|---|---|
| `saved.list_viewed` | `item_count`, `active_filter` |
| `saved.item_unsaved` | `entity_type`, `entity_id` |
| `saved.cta_clicked` | `entity_type`, `cta_type` |
| `saved.urgency_alert_shown` | `entity_id`, `reason` |

---

## MVP / Post-MVP Scope

| Feature | Phase |
|---|---|
| Saved list with domain tabs | Core P1 |
| Unsave action | Core P1 |
| Status + freshness badges | Core P1 |
| AI urgency alerts | Core P1 |
| Price drop badge | Core P1 |
| Map of saved items | MVP |
| Push notification on price drop | Advanced |
| Saved collections / folders | Post-MVP |
