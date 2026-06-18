# SAN-1093 · RE-DES-002 — Broker Concierge Phase A — Class U localhost evidence

> **Purpose:** localhost runtime proof for **SAN-1093 Done status** (anti-fake-done gate 9).
> **Not a merge blocker** — PR [#252](https://github.com/amo-tech-ai/mdeapp/pull/252) merges on green CI; this proof gates flipping the Linear issue to Done.
> **Date:** 2026-06-18 · **Commit:** `a15f2057` · **Branch:** `ai/san-1093-re-des-002-concierge-shell`

## Environment

| Item | Value |
|---|---|
| Server | `next dev --webpack -p 3013` (worktree on `a15f2057`), booted via `infisical run` |
| Auth | Real Supabase broker session for a seeded QA broker (`create_broker_onboarding_draft` → `landlord_profiles` row), injected as `sb-*-auth-token` cookie |
| Runner | Playwright chromium, `SMOKE_BASE_URL=http://localhost:3013` |
| Capture spec | `e2e/san-1093-overview-evidence.spec.ts` (ad-hoc capture — **not committed**, not in CI) |

## Route tested

`GET /host/rentals?mode=overview` — broker concierge workspace, **overview mode**.

## DOM proof (asserted visible, all passed)

| Testid / content | Meaning |
|---|---|
| `rentals-concierge` | Three-panel shell root present |
| `rc-left` · `rc-center` · `rc-right` | All three panels render |
| `ctx-analytics` | Right panel shows the overview analytics context |
| `r1-kpi-0` | KPI placeholder card present |
| `rc-input` is **disabled** | Composer off (no live brokerAgent in Phase A) |
| text `Data pending.` visible | No invented KPI numbers — honest empty state |

Screenshot: [`RE-DES-002-overview-desktop.png`](./RE-DES-002-overview-desktop.png) (1360×900) — shows:
- **Left:** Opportunities feed (lead/listing/viewing/marketing), Saved workflows, Recent — all static, disabled.
- **Center:** "AI-ready — brokerAgent not live" badge · "Overview mode — same shell" · disabled starters · disabled composer "Ask your rentals concierge… (SAN-1124)".
- **Right:** "Overview · Phase B" · `ctx-analytics` note "KPI blocks wire from fetchBrokerDashboard after this shell lands — no invented counts in Phase A" · four "Data pending." KPI cards.

## Console errors

**None.** `watchCriticalConsoleErrors` + `assertConsoleClean` passed (no critical console errors during load).

## Verdict

**PASS.** `/host/rentals?mode=overview` boots clean and renders the Phase A concierge shell with the correct disabled/empty states and no invented data. Satisfies the localhost runtime-proof requirement for SAN-1093 · RE-DES-002.

## Scope note

This proves **Done eligibility for SAN-1093**, not merge readiness — PR #252 is independently mergeable on green CI (DeepSource JS confirmed green on `a15f2057`). The capture spec is intentionally left uncommitted (one-off evidence, not a CI test).
