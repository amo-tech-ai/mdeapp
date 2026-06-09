# 05 — WhatsApp Onboarding · Mobile-first WA UI · Interaction Patterns

Covers **#6 WhatsApp onboarding flow**, **#17 Mobile-first WhatsApp-inspired UI**, and WhatsApp interaction patterns. **Phase status: Post-MVP / Advanced** (per `docs/roadmap.md` — WhatsApp prod is deferred). Architected now as a **renderer over the same Mastra brain** ("brain once, renderer many"), built later. Transport = WhatsApp Business API + Chatwoot for human handoff.

> Principle: WhatsApp is a **transport**, not a rewrite. Same router/tools/grounding as `/chat`; only the renderer changes (cards → WA list/button messages; map → location pin + "open full view" deep-link).

---

## #6 WhatsApp onboarding flow  ·  entry from web (QR/number) · persona: all

**Goals:** zero-install entry (GuideGeek's superpower) — scan/tap → land in a warm, useful first exchange → first value in one message, account never required.

```text
WEB TRIGGER (home / concierge landing)        WHATSAPP THREAD (first run)
┌────────────────────────┐                    ┌──────────────────────────┐
│ Chat with mde on        │                    │ mde · online              │
│ WhatsApp                │                    │ ┌──────────────────────┐ │
│  ┌────────┐             │   scan / tap →     │ │👋 Hi! I'm mde, your   │ │ greeting
│  │ ▓ QR ▓ │  or         │                    │ │Medellín concierge.    │ │
│  └────────┘             │                    │ │What are you after?    │ │
│  [ Open WhatsApp → ]    │                    │ └──────────────────────┘ │
│  +57 ··· ····           │                    │ [🏠 Rentals][🍽 Food]    │ quick-reply
└────────────────────────┘                    │ [🌃 Nightlife][🎟 Events]│ buttons (≤3-4)
                                               │ ── or just type ──        │
                                               │ you: furnished Laureles   │
                                               │      under $1.5M          │
                                               │ mde: ⠿ finding 3…         │
                                               │ (list message + pins)     │
                                               └──────────────────────────┘
```

| Step | Detail |
|---|---|
| Trigger | QR (desktop) / deep-link button (mobile) / displayed number; opt-in captured |
| Greeting | one warm line + **quick-reply buttons** (verticals) — multiple cold-start ramps, no form |
| First value | one query → ≤3 picks (list message) within seconds |
| Account | never asked first; identity = phone; profile builds implicitly |
| Consent | 24h session window noted; opt-in for template alerts |

**Avoid (GuideGeek mistakes):** mapless text walls, unverified prices, redirect-out. **Copy:** "text like a friend", multilingual readiness, instant value.

---

## #17 Mobile-first WhatsApp-inspired UI (native WA + our mobile web echo)

WhatsApp can't render arbitrary HTML — degrade gracefully to **interactive messages**. Our **mobile web `/chat`** also borrows WA's conversation ergonomics (bubble rhythm, quick replies, voice).

```text
NATIVE WHATSAPP RENDERING                    MOBILE WEB /chat (WA-inspired)
┌──────────────────────────┐                ┌───────────────────────┐
│ you: cafés to work,       │                │ ‹ mde   Cafés…    ◌ + │
│      Laureles             │                ├───────────────────────┤
│ mde: 3 laptop-friendly ☕ │ list message   │ you: cafés to work     │
│ ┌──────────────────────┐ │                │ mde ⠿ scanning…        │
│ │① Café Vibe  ★4.6      │ │ row            │ ┌rec①┐┌rec②┐ →scroll   │ card carousel
│ │  $$ · open · 350m     │ │                │ ▣ Google Maps          │
│ │  ▸ Open full view     │ │ deep-link      │ [Cheaper][Map][Quiet?] │ quick replies
│ ├──────────────────────┤ │                │ ┌📍 location pin┐      │
│ │② …  ③ …               │ │                │ └────────────────┘     │
│ └──────────────────────┘ │                │ [ type…      🎤  ➤ ]   │ voice mic
│ [📍 Map] [Show cheaper]   │ buttons        │ Chat Explore Saved Me  │
│ 🎤 voice note supported   │                └───────────────────────┘
└──────────────────────────┘
```

| WA element | mdeai use |
|---|---|
| List message | ranked picks (≤10 rows; we show ≤3) — title · price · meta |
| Reply buttons (≤3) | follow-ups: Map · Show cheaper · Compare |
| Location message | drop the venue pin natively |
| Deep link | "Open full view" → web detail/`/chat` (rich map+cards) |
| Template message | alerts: event reminder, new rental, "tonight" (opt-in, outside 24h) |
| Voice note | inbound: Gemini transcribe → same pipeline (LatAm-critical) |
| Catalog/product (Advanced) | tickets as WA products |

**Mobile web echo:** bottom-docked input + mic, h-scroll card carousel, quick-reply chips, bottom-sheet map, bubble rhythm. Build mobile-first, expand to 3-panel.

---

## WhatsApp interaction patterns (conversation UX)

| Pattern | Rule |
|---|---|
| Brevity | ≤3 picks per message; short bubbles; scannable on a phone |
| Structure | buttons/lists over free text walls |
| Spatial | native location pin + "open full view" deep-link (never "open Google Maps yourself") |
| Grounding | still cite source + freshness in-line |
| Action | tickets via deep-link to Stripe (or WA product, Advanced); lead via in-thread form steps |
| Memory | per-contact profile (neighborhoods, budget, vibe) persists across sessions |
| **Human handoff** | Chatwoot-style: AI handles 90%; hot lead / money / low-confidence → human takeover in same thread; HITL on outreach (AI drafts, human sends) |
| Re-engagement | template alerts (opt-in) = the retention engine WhatsApp uniquely enables |
| Voice | accept voice notes; reply in text + optional voice (Advanced) |

```text
AI ↔ HUMAN HYBRID (Chatwoot model)
 user ─▶ Mastra brain (router + grounded tools) ──▶ 90% auto-resolved
              │ low confidence / hot lead / money / outreach
              ▼
        Chatwoot inbox ─▶ human (Patricia / broker) takes over same WA thread
              │ AI drafts reply, human approves & sends (HITL)
              ▼
        back to AI · logged to Supabase (leads, ai_runs)
```

**States:** onboarding greeting (default) · "finding…" (loading) · "nothing matches, try…" (empty, never dead-end) · "having trouble, a human will follow up" (error → handoff). **Monetization:** in-thread tickets/leads + alert-driven re-engagement + (Advanced) WA commerce. **Retention:** the thread lives in the inbox they check hourly + opt-in alerts — structurally stickier than web.

**Why WhatsApp works (Medellín):** ubiquity + zero install + identity built-in + async/push-native + voice/photo + trusted + persistent relationship. It's the default commerce/coordination layer locally — hence the Phase-2 wedge.
