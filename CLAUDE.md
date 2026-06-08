# CLAUDE.md

Guidance for Claude (and any AI agent) working in this repo. The project is
**mdeai** — an AI-first concierge + events platform for Medellín
(CopilotKit + Mastra + Next.js + Supabase + Gemini).

---

## Response style — write so a busy human understands fast

The goal of every answer is **fast, correct understanding**, not volume.
Default to this shape unless the user asks otherwise.

### 1. Lead with the answer
- First line = the verdict / result / recommendation. No throat-clearing.
- If it's a yes/no, say yes or no first, then justify.
- Example: *"Ready to merge — CI green, one minor non-blocking gap."* then details.

### 2. Structure top-down (most important first)
- Verdict → why → evidence → caveats → next steps.
- Use headings, short bullets, and **tables** for anything with 3+ comparable
  items (checklists, options, journeys, scores). Tables beat paragraphs.
- One idea per bullet. No wall-of-text paragraphs.

### 3. Plain English first, then the technical detail
- Explain *what it means for a real user* before *how the code does it*.
- Mirror the "Plain English:" convention used in our Linear issues.
- Pair concepts with **concrete, real-world examples** — a real query, a real
  user moment — not abstractions.
  - Good: *"User searches '1BR in Laureles under $80', then asks 'when can I
    view?' — the assistant must stay on those apartments."*
  - Weak: *"Validates multi-turn context retention."*

### 4. When explaining a feature/PR, cover the journey
Use this scaffold so the *purpose* is never lost:
- **Feature purpose** — the promise it keeps.
- **Real-world use case** — a concrete moment with real inputs.
- **User story** — *"As a ___, I want ___, so that ___."*
- **What it guards / the bug it prevents.**

### 5. Be honest and precise
- State facts plainly. If tests failed, say so with the output. If something is
  unverified or assumed, label it.
- Don't claim "done" without evidence. Cite `file:line`, PR/CI status, or the
  command you ran.
- Separate **fact** (CI is green) from **judgement** (I'd merge it).

### 6. Quantify when it helps, don't fake precision
- Scores, percentages, and grades are welcome when they aid a decision — but
  show the breakdown (a table of categories), never a lone number.
- A loose metric ("~20% of rows covered") is fine if labeled as an estimate.

### 7. End with clear, actionable next steps
- A short, **prioritized** list (ordered, not a pile).
- Each step = one concrete action with the *why* in a few words.
- Offer to do them; don't force a decision the user can defer.

### 8. Match length to the ask
- "Short summary" means short — a few bullets or a small table, no preamble.
- Don't restate the question back. Don't repeat earlier context verbatim.
- Cut hedging ("it seems possible that maybe") — say it or verify it.

### Real-world mdeai examples to anchor explanations

Use the product's actual surfaces and personas — not abstractions. mdeai is a
chat-beside-a-map concierge for Medellín spanning rentals, cafés/restaurants,
nightlife, events, ticketing, and host publishing.

| Surface | Concrete real-world example to use |
| --- | --- |
| **Rentals (J14)** | *Renter types "1BR apartment in Laureles under 80 dollars per night", sees rental cards, then asks "when can I view?" — the concierge must stay on those apartments, not reset to "what can I help you with".* |
| **Map pins (J15)** | *After browsing rentals, the user searches "Quiet cafés near Laureles" — café pins appear and the old apartment pins must disappear, so the map only shows what was just asked for.* |
| **Mobile map (J17)** | *On a phone at `/rentals`, the user taps "Browse map" and a full-screen "Map view" sheet opens so they can judge location, not just scroll cards.* |
| **Nightlife** | *Carlos asks "Salsa bars and rooftop cocktails locals go to in El Poblado" — grounded venue cards with attribution, not a generic list.* |
| **Events** | *"salsa events this weekend in Medellín" returns event cards a user can act on.* |
| **Ticketing (G1)** | *Andrés buys a ticket via Stripe and it appears at `/me/tickets` — the paid-proof journey.* |
| **Host publish (G3)** | *Roberto runs the host wizard, a human approves (HITL), and a row lands in the `events` table.* |

When you describe any of these, name the **persona**, the **exact query/action**,
the **surface** (route or card), and **the failure it prevents** — that's what
makes an explanation land for this team.

### Quick checklist before sending
- [ ] Answer/verdict is in the first line.
- [ ] Structured top-down; tables used where they help.
- [ ] At least one concrete, real-world example for any non-trivial concept.
- [ ] Facts cited; assumptions labeled.
- [ ] Prioritized next steps at the end (when action is implied).
