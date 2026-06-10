---
title: CopilotKit Shared State Definitions
type: reference
skill: copilotkitV1
---

# Shared State Schemas (3-place sync)

Each schema: **Zod in agent** · **`src/lib/types`** · **`useCoAgent<T>`**

## EventDraftState (LIVE)

```typescript
// hostEventAgent — /host/event/new
interface EventDraftState {
  title: string;
  description: string;
  category: string;
  startsAt: string;
  venuePlaceId?: string;
  venueName?: string;
  capacity?: number;
  tiers: Array<{ name: string; priceCents: number; capacity: number }>;
  status: "draft" | "awaiting_approval" | "published";
}
```

## MdeState (LIVE)

```typescript
// conciergeAgent — /, /chat
interface MdeState {
  lastQuery: string;
  hint: string;
  activeIntent?: "events" | "rentals" | "places";
}
```

## HostDashboardState (BUILD P0)

```typescript
// hostOpsAgent — /host/events, /host/analytics
interface HostDashboardState {
  selectedEventId: string | null;
  dateRange: "7d" | "30d" | "all";
  kpis: {
    revenueCents: number;
    ticketsSold: number;
    capacity: number;
    conversionRate?: number;
  };
  tasks: Array<{ id: string; label: string; status: "open" | "done" }>;
  insights: string[];
}
```

## AnalyticsState (MVP)

```typescript
// hostOpsAgent per-event drill-down
interface AnalyticsState {
  eventId: string;
  views: number;
  registrations: number;
  funnel: { view: number; detail: number; checkout: number; paid: number };
}
```

## SponsorDashboardState (MVP)

```typescript
// sponsorAgent — /host/sponsors
interface SponsorDashboardState {
  selectedEventId: string | null;
  pipeline: Array<{
    sponsorId: string;
    name: string;
    fitScore: number;
    stage: "research" | "shortlist" | "proposal" | "won" | "lost";
  }>;
}
```

## VenueExplorerState (P0 wire)

```typescript
// concierge or venue search — /venues
interface VenueExplorerState {
  query: string;
  neighborhood?: string;
  minCapacity?: number;
  maxBudgetCents?: number;
  results: Array<{ placeId: string; name: string; score: number }>;
  comparedIds: string[];
}
```

## AttendeeState (MVP)

```typescript
// attendeeAgent — /me/tickets, /inbox
interface AttendeeState {
  upcomingTicketIds: string[];
  lastEventId?: string;
  preferences: string[];
}
```
