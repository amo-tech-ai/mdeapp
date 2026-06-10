---
title: Discovery Journeys
screens: [001, 002, 028, 035]
---

# Discovery Experience

## Home + AI recommendations

```mermaid
flowchart TD
  Q[Find networking this weekend] --> C[conciergeAgent]
  C --> S[search_events]
  S --> CARDS[Event cards]
  CARDS --> EXP[AI explains why match]
  EXP --> MAP[Map pins]
  MAP --> NEAR[Nearby restaurants MVP]
```

## Browse path

```mermaid
flowchart LR
  E[/events] --> F[Filters]
  F --> L[List]
  L --> D[Detail]
```

## Wireframes

- [001 Home](../events/001-home-discovery.md)
- [002 Search](../events/002-search-results.md)
- [028 Recommendations overlay](../events/028-ai-recommendations.md)
- [035 Recommendations hub](../events/035-recommendations-hub.md)
