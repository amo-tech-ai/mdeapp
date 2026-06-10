# Mastra Booking Audit — Feature Matrix

**Forensic scores · 2026-06-09 · corrected from disk evidence**

## Comparison table

| Repo | Purpose | Agents | Tools | Booking Flow | Memory | Multi-Agent | Human Approval | Notifications | WhatsApp | Stripe | Database | Production Ready | Score /100 |
|------|---------|--------|-------|--------------|--------|-------------|----------------|---------------|----------|--------|----------|------------------|------------|
| care-connect | Healthcare scheduling | 1 (Sophia) | 3 | Availability → book slot → PG insert | Postgres + semantic recall | No | No | No | No | No | PostgreSQL | No | **68** |
| mastra-hotel-booking-ai-agent | Hotel LiteAPI search | 1 | 7 (3 wired) | Search → details → rates; create unwired | In-memory (10 msgs) | No | No | No | No | No | None | No | **58** |
| a2a-mastra-demo | Travel A2A orchestrator | 1 | 4 A2A wrappers | Delegate to external Agno agents | None | Yes (external) | No | No | No | No | None | No | **41** |
| Sol_Basic_Hotel… | Mock booking lookup | 1 | 1 | Account ID → list mock stays | LibSQL file | No | No | No | No | No | LibSQL + mock | No | **38** |
| guest-booking-assistant | Podcast email voice demo | 1 | 6 email/search | Voice → email outreach | In-memory sessions | No | No | No | No | No | Postgres (emails only) | No | **18** |
| a2a-book-agent | Gutenberg excerpts | 1 | 1 | Gutendex search → excerpt | In-memory tasks | A2A client | No | No | No | No | None | No | **18** |
| Booksy-Agent | Reading library | 2 (1 active) | 10+ book tools | Add/track books | In-memory Maps | A2A route | No | No | No | No | In-memory | No | **12** |
| mastravel | Static HTML travel site | 0 | 0 | Enquiry forms (HTML only) | None | No | No | No | WhatsApp link | No | None | No | **0** |

---

## Dimension scores (/100)

| Repo | Architecture | Code Quality | Booking Features | Agent Design | Reusability | mdeai Fit |
|------|-------------|--------------|------------------|--------------|-------------|-----------|
| care-connect | 55 | 48 | 60 | 52 | 45 | **55** |
| mastra-hotel-booking-ai-agent | 50 | 62 | 45 | 48 | 40 | **42** |
| a2a-mastra-demo | 50 | 54 | 40 | 45 | 50 | **35** |
| Sol_Basic_Hotel… | 48 | 45 | 20 | 50 | 35 | **45** |
| guest-booking-assistant | 45 | 38 | **0** | 52 | 35 | **18** |
| a2a-book-agent | 42 | 54 | **0** | 45 | 50 | **18** |
| Booksy-Agent | 52 | 48 | **5** | 58 | 38 | **12** |
| mastravel | **0** | **0** | **0** | **0** | **0** | **0** |

---

## Strengths, weaknesses, risks, gaps

### care-connect ⭐ Top reference

| | |
|---|---|
| **Strengths** | End-to-end tool → service → repository; Zod schemas; slot check before book; RAG guidelines |
| **Weaknesses** | No schema DDL; transaction not atomic; Ollama-only; Mastra 0.7 stale |
| **Risks** | Copying transaction pattern without fix; healthcare context with no auth |
| **Missing** | HITL, WhatsApp, CopilotKit, Supabase RLS, idempotency, cancellation |

### mastra-hotel-booking-ai-agent

| | |
|---|---|
| **Strengths** | Richest external API tool set; Jest + errorHandler; honest prototype docs |
| **Weaknesses** | createBooking/cancel not on agent; OpenAI lock-in; LiteAPI key required |
| **Risks** | Appears complete but booking path is broken by design |
| **Missing** | Gemini, Supabase, HITL, honest "request not confirm" UX |

### a2a-mastra-demo

| | |
|---|---|
| **Strengths** | A2A delegation + Agno protocol adapter; Mastra 0.24; build/start pipeline |
| **Weaknesses** | No local booking persistence; hardcoded LLM URL; task API shimmed |
| **Risks** | External Agno dependency for any demo |
| **Missing** | Supabase, auth, real booking commit |

### Sol_Basic_Hotel…

| | |
|---|---|
| **Strengths** | Gemini + Mastra 0.10; prompt discipline; devcontainer |
| **Weaknesses** | Mock-only; no create/modify; no tests |
| **Risks** | Prompt examples cite cities not in mock data |
| **Missing** | Real PMS/API, auth, write tools |

### Misnamed repos (guest-booking, Booksy, a2a-book-agent, mastravel)

| | |
|---|---|
| **Strengths** | Layercode voice bridge (guest-booking); A2A Telex patterns (a2a-book-agent) |
| **Weaknesses** | Zero reservation logic despite audit list names |
| **Risks** | **HIGH:** Prior docs recommended wrong repos as #1–#3 |
| **Missing** | Everything required for restaurant/venue booking |

---

## mdeai already has (not in any external repo)

| Capability | mdeapp location | Status |
|------------|-----------------|--------|
| `venue_booking_requests` + RLS | Supabase migration (SAN-298 Done) | ✅ |
| Insert + idempotency | `src/lib/venues/venue-booking-core.ts` | ✅ |
| Honest request UX copy | `docs/tasks/venues/docs/02-booking-whatsapp.md` | ✅ |
| Patricia HITL + WhatsApp plan | VEN-003 sequence diagram | Spec only |
| `requestVenueBooking` Mastra tool | — | ❌ SAN-299 Todo |
| CopilotKit HITL card | — | ❌ SAN-302 Todo |

**Conclusion:** External repos inform **patterns**, not copy-paste code. mdeai's honest request model is **more production-appropriate for Medellín** than LiteAPI instant hotel booking.
