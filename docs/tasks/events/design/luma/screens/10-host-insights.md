---
screen: Host Insights / Analytics
screenshots: [host insights tab — capture needed]
route: /host/analytics
persona: Roberto
mdeai_status: spec-only
linear: SAN-729
spec: ../../../specs/pages/missing/PAGE-M02-host-analytics.md
---

# Wireframe — Luma Host Insights

## Goals

Revenue, registrations over time, conversion, traffic sources — plus **AI Q&A** in mdeai.

## ASCII — Luma insights

```text
┌─────────────────────────────────────┐
│ Insights · Fashion Night            │
├─────────────────────────────────────┤
│ Revenue      $2,140                 │
│ Registered   42 / 250               │
│ Checked in   0                      │
├─────────────────────────────────────┤
│ [Chart: registrations / day]        │
├─────────────────────────────────────┤
│ [Chart: revenue by tier]            │
└─────────────────────────────────────┘
```

## ASCII — mdeai target (PAGE-M02 + Copilot)

```text
┌──────────┬────────────────────────────┐
│ KPI cards│ Registrations chart        │
│ Revenue  │ Tier breakdown           │
│          ├────────────────────────────┤
│          │ Copilot: "vs last event?"  │
│          │ [generative KPI card]      │
└──────────┴────────────────────────────┘
```

## Component inventory

| Component | Type | Owner |
|-----------|------|-------|
| KpiCard | domain | server fetch |
| TierChart | domain | `useCopilotAction` |
| HostOpsCopilotBridge | domain | `hostOpsAgent` |

## Tools (Mastra)

- `list_host_events`
- `get_sales_summary`
- `salesInsightWorkflow`

## mdeai mapping

**P0 gap** — see [`../../../docs/01a-copilotkit-mastra-plan.md`](01a-copilotkit-mastra-plan.md).

## Wireframe prompt

Capture Luma insights tab → map each metric to Supabase query + `hostOpsAgent` tool.
