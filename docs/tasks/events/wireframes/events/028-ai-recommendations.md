---
type: wireframe
screen_number: "028"
title: AI Recommendations
route: / (overlay)
persona: [Camila]
phase: MVP
agent: conciergeAgent
---

# Wireframe: AI Recommendations

## Page goal

"Why this event?" personalized recommendations with compatibility.

## Components

RecommendationCard · CompatibilityScore · ExplainPanel · SaveCTA

## AI features

EVP-042 · `useCopilotReadable` user prefs · hybrid search

## Mermaid

```mermaid
flowchart TD
  U[User profile] --> R[Recommend engine]
  R --> E[Explain + card]
  E --> M[Map pin]
```
