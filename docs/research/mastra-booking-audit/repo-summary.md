# Mastra Booking Audit — Repository Summary

**Class D · Forensic audit · 2026-06-09**  
**Clones:** `docs/research/mastra-booking-audit/repos/` (shallow, depth 1)

## Executive finding

**Only 2 of 8 repos are genuine Mastra booking references.** Four others are **misnamed** (reading books, podcast email, static HTML). Prior docs (`06-mastra-booking.md`) scored repos by **name**, not disk content — scores are corrected below.

| Rank | Repo | Actual domain | Booking relevance | Corrected score |
|------|------|---------------|-------------------|-----------------|
| 1 | [care-connect](repos/care-connect/) | Healthcare scheduling | **High** — tool → service → PostgreSQL | **68/100** |
| 2 | [mastra-hotel-booking-ai-agent](repos/mastra-hotel-booking-ai-agent/) | Hotel search via LiteAPI | **Medium** — partial API booking tools | **58/100** |
| 3 | [a2a-mastra-demo](repos/a2a-mastra-demo/) | Travel A2A orchestration | **Low** — delegation pattern only | **41/100** |
| 4 | [Sol_Basic_Hotel_Booking…](repos/Sol_Basic_Hotel_Booking_Assistant_Mastra_AI_Google_Gemini/) | Gemini hotel FAQ | **Low** — mock read-only lookup | **38/100** |
| 5 | [guest-booking-assistant…](repos/guest-booking-assistant-layercode-mastra/) | Podcast email + Layercode voice | **None** | **18/100** |
| 6 | [a2a-book-agent](repos/a2a-book-agent/) | Gutenberg excerpt extraction | **None** | **18/100** |
| 7 | [Booksy-Agent](repos/Booksy-Agent/) | Personal reading library | **None** | **12/100** |
| 8 | [mastravel](repos/mastravel/) | Static HTML in README only | **None** | **0/100** |

---

## Per-repo inventory

### 1. care-connect — **Best booking pattern**

| Field | Value |
|-------|-------|
| **Purpose** | Healthcare appointment scheduling (Sophia agent) |
| **Stack** | Mastra 0.7, Ollama llama3.2, PostgreSQL + pgvector |
| **Agents** | `careConnectAgent` — availability + booking + RAG guidelines |
| **Tools** | `doctorAvailabilityTool`, `bookAppointmentTool`, `agentGuidelinesTool` |
| **Booking flow** | Check slots → collect patient info → transactional INSERT + mark slot booked |
| **DB** | `doctors`, `availability_slots`, `patients`, `appointments` (no DDL on disk) |
| **Auth** | None |
| **Run** | `docker compose up` + `ollama serve` + `npm run dev` — schema must be created manually |
| **Install** | Not run in audit (`node_modules` absent) |

**Copy for mdeai:** Tool → service → repository layering; Zod tool I/O; slot availability check before insert.

**Avoid:** Ollama stack; transaction bug (BEGIN on client but repos use pool); no schema migrations.

---

### 2. mastra-hotel-booking-ai-agent — **Best external API tool surface**

| Field | Value |
|-------|-------|
| **Purpose** | Hotel search/details/availability via LiteAPI |
| **Stack** | Mastra 0.8, OpenAI GPT-4, axios |
| **Agents** | `hotelBookingAgent` — 3 tools wired, 4 defined but not attached |
| **Tools** | searchHotels, getHotelDetails, checkAvailability (+ createBooking, cancel — unwired) |
| **Booking flow** | Search → details → rates; **create booking not exposed to agent** |
| **DB** | In-memory Mastra memory only |
| **Auth** | LiteAPI key server-side only |
| **Run** | `npm install` + `.env.development` (OPENAI_API_KEY, LITEAPI_KEY) + `npm run dev` |
| **Tests** | Jest suite with 80% coverage threshold |

**Copy for mdeai:** LiteAPI-style validation/error taxonomy; multi-step hotel tool definitions.

**Avoid:** OpenAI-only; unwired booking tools; old Mastra 0.8.

---

### 3. a2a-mastra-demo — **Multi-agent delegation reference**

| Field | Value |
|-------|-------|
| **Purpose** | Travel receptionist delegates to Agno hotel/flight agents via A2A |
| **Stack** | Mastra 0.24, remote Ollama qwen3-coder |
| **Agents** | `travel-receptionist-agent` + 4 A2A wrapper tools |
| **Tools** | getAgentCard, sendMessage, createTask, getTask |
| **Booking flow** | Receptionist → A2A message to external specialist — no local persistence |
| **DB** | None |
| **Run** | Requires external `A2A_SERVER_URL` (Agno demo server) |

**Copy for mdeai:** Phase 2/3 orchestration shell; protocol adapter pattern in `a2a-fetch.ts`.

**Avoid:** Hardcoded remote LLM URL; createTask = sendMessage shim; no booking truth locally.

---

### 4. Sol_Basic_Hotel_Booking_Assistant — **Gemini + Mastra 0.10 skeleton**

| Field | Value |
|-------|-------|
| **Purpose** | Read-only mock booking lookup by account ID |
| **Stack** | Mastra 0.10, Gemini 2.0 Flash, LibSQL file memory |
| **Agents** | `hotelAssistant` — single `getBookings` tool |
| **Booking flow** | User gives account ID → agent lists mock upcoming stays |
| **Run** | `cd hotel-assistant && npm install && npm run dev` |

**Copy for mdeai:** Prompt guardrails (no hallucinated recommendations); Zod input/output on tools.

**Avoid:** Mock data; no write path; gemini-2.0-flash model ID.

---

### 5–8. Misnamed / non-booking repos

| Repo | What it actually is | Why prior score was wrong |
|------|---------------------|---------------------------|
| guest-booking-assistant-layercode-mastra | Layercode voice + podcast guest **email** outreach | Name says "guest booking" |
| Booksy-Agent | Personal **reading** library tracker | "Booksy" ≠ salon booking |
| a2a-book-agent | Project Gutenberg **book excerpt** via A2A | "book-agent" = literature |
| mastravel | Bootstrap travel **HTML** embedded in README | No Mastra code on disk |

---

## Setup summary (all repos)

| Repo | Install | Env vars | Runnable without secrets |
|------|---------|----------|----------------------------|
| care-connect | `npm install` | DB_*, OLLAMA_BASE_URL | No (Ollama + Postgres) |
| mastra-hotel-booking-ai-agent | `npm install` | OPENAI_API_KEY, LITEAPI_KEY | No |
| a2a-mastra-demo | `pnpm install` | A2A_SERVER_URL, NODE_ENV | No |
| Sol_Basic… | `cd hotel-assistant && npm install` | GOOGLE_GENERATIVE_AI_API_KEY | Partial (Studio UI) |
| guest-booking-assistant | `npm install` | LAYERCODE_*, BRAVE_*, DB_*, Gemini | No |
| Booksy-Agent | `npm install` | GOOGLE_AI_API_KEY | Partial |
| a2a-book-agent | `npm install` | NODE_ENV required | Partial (Express only) |
| mastravel | N/A | N/A | No |

**Audit note:** Dependencies were not installed during clone audit. Scores reflect **code review on disk**, not runtime proof.

---

## Recommended study order for mdeai

1. **mdeapp `venue-booking-core.ts`** — already ships the insert path Tourist needs
2. **care-connect** — slot-filling + availability + book tool pattern
3. **mastra-hotel-booking-ai-agent** — external API tool validation (adapt for Places, not LiteAPI)
4. **a2a-mastra-demo** — Phase 2 multi-agent delegation only
5. **Skip** guest-booking-assistant, Booksy-Agent, a2a-book-agent, mastravel for booking work

See [`final-report.md`](./final-report.md) for scores, architecture, and Linear roadmap.
