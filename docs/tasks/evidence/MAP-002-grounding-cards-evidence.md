# MAP-002 — Grounded café card titles (prod fix) — 2026-05-25

**Commits:** `7ad5aec` · `a4c1ecb` (mdeapp)  
**Cloud Run:** `mdeai-adk-grounding-00005-4bf`  
**Vercel:** Production Ready · `www.mdeai.co`

## Problem

Chat prose listed real café names but generative cards showed generic **Place** + duplicate **Maps grounding** link bullets.

## Root cause

1. Sidecar/Gemini sometimes returned `title: "Place"` while attribution had real names  
2. Mastra tool defaulted to `"Place"` with no attribution recovery  
3. UI did not parse JSON-string tool envelopes; attribution footer duplicated card Maps links  

## Fix

| Layer | Change |
|-------|--------|
| Sidecar | `attribution.title` on MCP pins; Gemini `web.title` fallback |
| Mastra | `map-adk-grounding-pins.ts` + `parse-grounded-tool-result.ts` |
| UI | `groundedRender` uses parser; compact attribution footer |
| Scripts | `verify:grounding` rejects Place; smoke accepts compact attribution |

## Verification

| Check | Result |
|-------|--------|
| `npm run verify:grounding` | ✅ Café Euge… (not Place) |
| `npm run floor` | ✅ 176 Vitest |
| Cloud Run rev 00005 | ✅ grounding-lite 5 pins |
| www Playwright | ✅ 5 cards: Café Primavera, Namazzi, … · 0 generic Place |
| Map results panel | ✅ Café / place rows with real names |

Query: `list cafes in laureles` on `https://www.mdeai.co/`

## Not Done (follow-on)

- MAP-015 card ↔ pin sync for grounded cards  
- MAP-018 Mindtrip photos/ratings (Places New enrichment)  
- MAP-014 mobile single map mount  
