# Mastra Booking Research Audit — Final Report

**Date:** 2026-06-09  
**Class:** D (docs/research)  
**Auditor:** Forensic clone + disk analysis of 8 GitHub repos  
**Impact:** Tourist/Carlos on `/chat` — booking request flow; Patricia — review queue

---

## Executive Summary

We cloned and forensically analyzed eight "Mastra booking" repositories. **Only one repo (`care-connect`) implements a real book-into-database flow.** A second (`mastra-hotel-booking-ai-agent`) has partial external API tools but does not complete bookings on the agent path. **Four repos are misnamed** (reading books, podcast email, static HTML) and were incorrectly ranked #1–#3 in prior internal docs.

**Recommendation:** Do not fork external repos. Implement MVP using:

1. Existing **`venue-booking-core.ts`** + SAN-298 schema (Done)
2. **care-connect** pattern: availability check → slot fill → transactional insert tool
3. **CopilotKit HITL** (Roberto publish pattern) via SAN-302
4. **Phase 3 OpenClaw** only after honest request flow is proven (`04-openclaw.md`)

**Linear:** SAN-299, SAN-302, SAN-303 already exist — **do not create duplicates**.

---

## Top 3 Repositories (corrected)

| Rank | Repo | Why | Score |
|------|------|-----|------:|
| 🥇 1 | **care-connect** | Only end-to-end tool → service → DB booking | **68/100** |
| 🥈 2 | **mastra-hotel-booking-ai-agent** | Best API tool + error handling; partial flow | **58/100** |
| 🥉 3 | **a2a-mastra-demo** | Multi-agent delegation reference for Phase 2 | **41/100** |

**Previously recommended #1 (`guest-booking-assistant-layercode-mastra`) scores 18/100** — it is a podcast email voice demo with zero booking logic.

---

## Recommended Features to Copy

| Feature | Source | mdeai destination |
|---------|--------|-------------------|
| Tool → service → repository | care-connect | `requestVenueBooking` execute path |
| Slot filling prompts | care-connect + Sol_Basic prompts | conciergeAgent instructions |
| Zod tool input/output | All viable repos | SAN-299 tool schema |
| Error taxonomy | mastra-hotel `errorHandler.ts` | Tool execute error mapping |
| HITL confirm before write | mdeapp Roberto wizard | SAN-302 CopilotKit card |
| A2A delegation | a2a-mastra-demo | Phase 2 OpenClaw orchestration |
| Honest request copy | mdeai VEN-003 (not external) | Already spec'd |

---

## Recommended Architecture

See [`phase5-recommended-architecture.md`](./phase5-recommended-architecture.md) and [`architecture-diagram.md`](./architecture-diagram.md).

**MVP one-liner:**

```text
/chat → conciergeAgent → HITL confirm → requestVenueBooking → venue_booking_requests → Patricia
```

---

## Linear Roadmap

| Priority | Issue | Status |
|----------|-------|--------|
| P0 | [SAN-298 · VEN-019 — venue_booking_requests migration](https://linear.app/sanjiovani/issue/SAN-298) | ✅ Done |
| P0 | PR #156 — Request Table web form | In review |
| P0 | [SAN-299 · VEN-020 — requestVenueBooking Mastra tool](https://linear.app/sanjiovani/issue/SAN-299) | **Next** |
| P0 | [SAN-302 · VEN-023 — CopilotKit HITL action](https://linear.app/sanjiovani/issue/SAN-302) | Todo |
| P0 | [SAN-303 · VEN-024 — registry CI test](https://linear.app/sanjiovani/issue/SAN-303) | Todo |
| Post-MVP | [SAN-686 · PTR — full booking system](https://linear.app/sanjiovani/issue/SAN-686) | Backlog |
| Phase 3 | OpenClaw automation | No Linear yet — intentional |

---

## Production Readiness Assessment

| Layer | Readiness | Notes |
|-------|-----------|-------|
| mdeai DB + insert core | **90/100** | SAN-298 Done; idempotency wired |
| mdeai web form (PR #156) | **85/100** | Needs merge + browser proof |
| mdeai agent tool (SAN-299) | **0/100** | Not started |
| External repos (any) | **≤28/100** | Demos; none production-ready |
| OpenClaw automation | **65/100** for Phase 3 fit | Too early for launch |

**Overall booking MVP readiness:** **85/100** after PR #156 merge; **95/100** after SAN-299 + SAN-302 ship with localhost proof.

---

## Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Prior docs pointed to wrong repos | **High** | This audit supersedes `06-mastra-booking.md` rankings |
| Agent claims "confirmed" without venue OK | **High** | HITL + honest copy; never set confirmed from tool alone |
| Copying LiteAPI instant-book UX | Med | Medellín has no OpenTable — stay request-based |
| OpenClaw bot detection / ToS | Med | Phase 3 only; Patricia gate |
| Duplicate Linear issues | Low | Verified — use SAN-299/302/303 |

---

## Cost Analysis

| Approach | Dev cost | Runtime cost | Risk |
|----------|----------|--------------|------|
| **Build MVP (SAN-299/302)** | ~3–4 eng-days | Gemini tool calls + Supabase rows | Low |
| Fork care-connect | ~2 weeks port + Supabase rewrite | Ollama infra if kept | Med |
| Fork mastra-hotel + LiteAPI | ~1 week + API fees | LiteAPI per search; wrong vertical | High |
| OpenClaw auto-book now | ~3+ weeks | Browser/API + WhatsApp | **High** — defer |

---

## Build vs Buy Analysis

| Option | Verdict |
|--------|---------|
| **Build** requestVenueBooking on mdeai core | ✅ **Recommended** — 3–4 days, fits Medellín market |
| **Buy/fork** guest-booking-assistant | ❌ Wrong product entirely |
| **Buy** LiteAPI / hotel APIs | ❌ Wrong vertical for restaurant MVP |
| **Buy** Apify OpenTable Booker | ⚠️ Phase 3 only; paid + ToS risk |
| **Adapt** care-connect patterns | ✅ Copy architecture, not code wholesale |

---

## Final Scoring (aggregate)

| Dimension | Score | Meaning |
|-----------|------:|---------|
| Architecture (best external) | **55/100** | care-connect layering — still needs mdeai stack port |
| Code Quality (best external) | **62/100** | mastra-hotel tests + errors |
| Booking Features (best external) | **60/100** | care-connect — no HITL/WhatsApp |
| Agent Design | **52/100** | Slot fill works; none have CopilotKit |
| Reusability for mdeai | **45/100** | Patterns > code |
| **mdeai Fit (external repos)** | **42/100** | mdeai internal core scores **90/100** for MVP DB path |

---

## Final Rankings + Implementation Order

1. **Use mdeapp `venue-booking-core.ts`** — already built
2. **Study care-connect** — booking tool pattern only
3. **Implement SAN-299** — Mastra tool
4. **Implement SAN-302** — HITL card
5. **Implement SAN-303** — registry test
6. **Patricia queue** — admin surface
7. **Phase 2** — WhatsApp draft (MSV-003), SAN-686
8. **Phase 3** — OpenClaw per `04-openclaw.md`

---

## Artifacts

| File | Purpose |
|------|---------|
| [`repo-summary.md`](./repo-summary.md) | Phase 1 inventory |
| [`features.md`](./features.md) | Phase 2 matrix |
| [`phase3-mdeai-mapping.md`](./phase3-mdeai-mapping.md) | Copy/adapt/avoid |
| [`phase4-use-cases.md`](./phase4-use-cases.md) | Persona workflows |
| [`phase5-recommended-architecture.md`](./phase5-recommended-architecture.md) | MVP / Phase 2 / 3 |
| [`phase6-linear-tasks.md`](./phase6-linear-tasks.md) | Linear verification |
| [`architecture-diagram.md`](./architecture-diagram.md) | Mermaid diagrams |
| [`repos/`](./repos/) | Shallow clones (gitignored recommended) |

---

## Supersedes

- Incorrect rankings in `docs/restaurant/06-mastra-booking.md` (guest-booking #1, Booksy #2)
- Prompt-only `docs/restaurant/07-Mastra-Booking-Research-Audit.md` — execution complete in this folder

**Next engineering step:** Merge PR #156 → branch `ai/san-299-ven-020-requestvenuebooking-mastra-tool` → SAN-299.
