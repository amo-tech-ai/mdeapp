Short answer: **mdeai does not run its own “best café” score.** For “best cafés in Medellín,” Camila’s concierge usually calls **`search-grounded-places`**, which sends your words to **Google Maps Grounding Lite**. **Google** decides which places match “best” and in what order. We only show up to **5** results, optionally enrich them with **rating / review count / hours**, and render cards — we **do not re-rank** by rating in code.

---

## What happens when you ask that in chat

```text
You: "best cafes in medellin"
        ↓
conciergeAgent (Gemini 3.5 Flash) — picks a tool from instructions
        ↓
search-grounded-places  ← cafés/POIs go here, NOT search-restaurants
        ↓
ADK sidecar → Grounding Lite MCP search_places
  text_query: "best cafes in medellin"  (your phrase, passed through)
  location_bias: Medellín centroid (6.2442, -75.5812) or map viewport if you panned first
  page_size: 5 (default)
        ↓
Google returns places + optional AI summary — order is Google's
        ↓
Places Details enrich (rating, userRatingCount, openNow, photo, Maps links)
        ↓
UI: GroundedPlaceCard + map pins (you judge "best" from stars/cards)
        ↓
Agent reply: ~2 sentences only ("how many matches, which area") — must NOT list café names in text
```

Concierge rules explicitly route café/coffee queries to **grounded Maps search**, not the Supabase restaurant catalog:

```91:94:mdeapp/src/mastra/agents/concierge.ts
- search-grounded-places: natural-language place discovery (cafés, venues, POIs) via Google Maps grounding — use when the user wants real map pins from Google, not only Supabase inventory.
...
- For café / coffee / quiet spot / POI requests near a neighborhood (e.g. "quiet cafés near Laureles"), call search-grounded-places — not search-restaurants.
```

---

## Who decides “best”?

| Layer | Role in “best” |
|--------|----------------|
| **Your wording** | Words like “best”, “top”, “quiet”, “specialty” go into `text_query` unchanged — Google interprets them. |
| **Grounding Lite MCP** | Ranks/returns places for that query near the bias point. No mdeai scoring model. |
| **Places enrichment** | Adds `rating`, `userRatingCount`, `openNow`, photo — **display only**; order stays MCP order. |
| **Gemini concierge** | Must not invent a ranked list in chat; cards carry the evidence. |
| **You** | See stars and cards; “best” is your read of Google’s picks + ratings on cards. |

There is **no** code path that sorts results by `rating` or `userRatingCount` after enrichment. `map-adk-grounding-pins.ts` maps fields; it does not rank.

---

## What the agent is *not* doing

- **Not** querying Supabase `search-restaurants` for curated “best” lists (that tool has its own `rating` in DB, but café flow bypasses it).
- **Not** running a custom rubric (wifi, noise, laptop-friendly, etc.) unless you say that in the query and Google’s search reflects it.
- **Not** guaranteeing global “best in Medellín” — default bias is **city-wide Medellín** unless you panned the map (F50b sends **viewport** as `locationBias`).
- **Not** using Google **Search** grounding for cafés (`search-web-grounded-events` is for fresh **events** on the web only).

---

## How you can *see* quality signals in the UI

On **http://localhost:3001/chat** after a café search:

1. **Photo cards** — `rating` (e.g. 4.9), review count, price level, open now.
2. **Map pins** — same 5 places geographically.
3. **Links** — Directions / Reviews / Open in Google Maps (when Google returns those URIs).
4. **Short agent text** — e.g. “Found 5 matches in Medellín” — not a detailed “#1 because…” essay (by design).

So “how does it assess?” → **mostly Google’s relevance for your query + visible Google ratings on cards**, not a separate mdeai evaluator.

---

## If you want sharper “best” behavior

| You say | Effect |
|---------|--------|
| `best specialty coffee in Laureles` | Google biases toward Laureles + specialty coffee semantics |
| Pan map to El Poblado, then `cafés here` | F50b sends **viewport** bias — “best” near what you see |
| `highest rated cafés in Laureles` | Still Google’s interpretation of the text; we don’t sort by rating server-side |
| `quiet laptop-friendly cafés` | Vibe words in `text_query`; no structured filter in our stack |

**Gap today:** no explicit re-rank by `rating` or review count after enrichment. That would be a product change (sort pins by `userRatingCount` / `rating` before render).

---

## DevTools sanity check (one request)

Network → `POST …/v1/grounding/invoke` → body should include:

- `query` with your full sentence  
- `locationBias` (Medellín or viewport)  
- Response `pins[]` with `rating`, `fieldMaskVersion: details-v3-links-2026-05-26`

Response `metadata.source` should be `grounding-lite` (or `gemini-maps-grounding` only on MCP fallback).

---

**Bottom line for Camila:** “Best cafés” means **Google Maps search for that phrase**, top **5** in **Google’s order**, shown on cards with **Google ratings** — the agent explains count/area in prose but does **not** independently score or rank venues beyond what Google already returned.