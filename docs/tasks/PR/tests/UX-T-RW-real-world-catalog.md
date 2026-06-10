---
id: UX-T-RW
title: Real-world scenario catalog (backlog)
status: Not Started
priority: P1
phase: post UX-T-031
description: Persona-driven scenarios beyond 23-live-audit matrix — implement as Playwright or synthetic monitor after core specs green.
---

# UX-T-RW — Real-world test catalog

Implement after [UX-T-031](UX-T-031-live-audit-verticals.spec.md) passes scenarios 1–2 and 3–4 are green post UX-019/013.

## Tourist / concierge

| ID | Scenario | Tool | Assert |
|----|----------|------|--------|
| RW-01 | Rental → `"when can I view the first one?"` | Playwright serial | Stays rental intent; no event hijack |
| RW-02 | `"events tonight"` → `"show apartments instead"` | Playwright | Event memory cleared; rental fast-path fires |
| RW-03 | Mobile 390px rental → map sheet → pin tap | Playwright | `map-sheet-content` + pin interaction |
| RW-04 | `"vegetarian restaurants El Poblado"` | Playwright + network | Not `/api/events/search` |
| RW-05 | Café with ADK up (staging) vs down | Playwright route toggle | Same card shape; attribution when grounded |

## Roberto / events

| ID | Scenario | Assert |
|----|----------|--------|
| RW-06 | `/host/event/new` HITL approve | Interrupt UI + form fill |
| RW-07 | Event detail → Buy → checkout 500 | `booking-checkout-error` inline (SCREEN-019) |

## Camila / rentals

| ID | Scenario | Assert |
|----|----------|--------|
| RW-08 | Schedule viewing CTA → lead API | POST `/api/leads/schedule-viewing` 200 |
| RW-09 | Chips Laureles + Events then rental send | Rental fast-path; chips don't force event path |

## Resilience

| ID | Scenario | Assert |
|----|----------|--------|
| RW-10 | Prod CopilotKit failure | [UX-T-016](UX-T-016-concierge-run-error.spec.md) on prod (careful) |
| RW-11 | New chat reset | UX-032: map clears, thread resets |
| RW-12 | Synthetic 4-query cron | UX-034 monitor |
| RW-13 | Gemini billing deny | Generic error; no `AI_APICallError` in DOM |
| RW-14 | Double Enter while inProgress | No duplicate cards/pins |

## Card system (post UX-T-030)

| ID | Scenario | Assert |
|----|----------|--------|
| RW-15 | Hover card → pin highlight | `data-highlighted` or equivalent |
| RW-16 | Generic results suppressed | No dup panel when registrar mounted |

## Production-only

| ID | URL | Query | Assert |
|----|-----|-------|--------|
| PROD-01 | mdeai.co | rental query | ≥3 cards |
| PROD-02 | mdeai.co | specialty coffee Laureles | ≥1 café card (post UX-013) |
| PROD-03 | mdeai.co | load `/` | No `BillingNotEnabledMapError` in console |

## Priority order

1. RW-02, RW-04 (extend B-09 coverage)
2. RW-03 (mobile)
3. RW-14 (double-send — LESSONS.md)
4. RW-11 when UX-032 starts
5. PROD-* via UX-T-035 / UX-034
