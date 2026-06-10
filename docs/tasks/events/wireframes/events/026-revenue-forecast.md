---
type: wireframe
screen_number: "026"
title: Revenue Forecast
route: /host/analytics/forecast
persona: [Roberto]
phase: MVP
agent: hostOpsAgent
---

# Wireframe: Revenue Forecast

## Page goal

Projected attendance and revenue from sales pace.

## Components

ForecastCard · PaceChart · ScenarioBand · ActionSuggestions

## AI features

`revenueForecastWorkflow` · generative forecast card

## Mermaid

```mermaid
flowchart TD
  A[Sales pace SQL] --> B[Workflow steps]
  B --> C[Gemini narrative]
  C --> D[Forecast card in chat]
```
