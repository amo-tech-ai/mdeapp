---
doc_id: MDEAI-COMPETITOR-GUIDEGEEK
title: GuideGeek — Deep Teardown & mdeai Differentiation Strategy
version: 1.0
date: 2026-05-31
status: Draft (strategy input — not execution authority)
companions:
  - plan/competitors/12-mdeai-blueprint.md (cross-competitor synthesis; GuideGeek summarized there)
  - plan/competitors/01-mindtrip.md … 05-booking.md (Mindtrip — the maps/workspace benchmark)
  - plan/competitors/11-openclaw.md (local-intelligence enrichment moat)
authority_note: Execution authority stays with docs/roadmap.md + tasks/INDEX.md. WhatsApp prod is Post-MVP/Advanced here too.
primary_sources:
  - guidegeek.com · brands.guidegeek.com (+ /press)
  - DiscoverGreece "Pythia", Discover Halifax launches
  - Rotterdam hands-on walkthrough · "+40% AI travel" survey
  - theblondeabroad review · daidu.ai · rentalscaleup.com · PRNewswire (Messenger/Instagram)
---

# GuideGeek — Deep Teardown & mdeai Differentiation

> **One line:** GuideGeek is the **distribution + DMO-licensing** winner of chat-native travel AI — and it is *weak exactly where mdeai is strong*: grounded/accurate local data, embedded maps + structured cards, and completing actions in-surface instead of redirecting out. Its two documented failures (a **pricing hallucination — "$107/night in chat vs ~$1,009 on Airbnb"** and **"no map integration, open Google Maps yourself"**) are a literal validation of mdeai's grounding-first, maps-native bet.

This doc is the GuideGeek deep-dive promised in [`12-mdeai-blueprint.md`](12-mdeai-blueprint.md) §1.1. Part A = teardown (the 25 questions + required tables). Part B = how mdeai beats it with the Medellín stack. Part C = returns (MVP / roadmap / moat).

---

# PART A — GuideGeek teardown

## A0. Snapshot scorecard (/100)

| Dimension | Score | Note |
|---|---:|---|
| Distribution / acquisition | 96 | Zero-install, rides Meta's billion-user rails; QR → WhatsApp |
| Conversational onboarding | 92 | No app, no account, "text like a friend," 42 languages |
| Breadth (global coverage) | 90 | 61 countries, any destination |
| White-label / B2B flywheel | 94 | 30+ DMOs, persona-per-city, analytics dashboard |
| Speed / responsiveness | 88 | Full itinerary "within a minute" |
| **Grounding / accuracy** | **48** | Pricing hallucination; "too trendy"; thin local truth |
| **Maps / spatial UX** | **20** | **No embedded map** — user opens Google Maps manually |
| **In-surface action / booking** | **35** | Redirects to OTA; "couldn't book inside WhatsApp" |
| Persistence / workspace | 30 | Linear thread; no saved multi-day itinerary canvas |
| Memory / personalization | 55 | Within-thread; no strong durable profile evidence |
| Trust framing | 78 | "Real-time, 1,000+ integrations, Matador editorial" |
| Monetization clarity | 80 | B2B DMO licensing confirmed; affiliate inferred |
| **Overall (as a product)** | **74** | Brilliant wedge + reach; shallow depth + no transaction loop |

The low three (grounding, maps, in-surface action) are **not minor polish gaps — they are the seam mdeai attacks.**

## A1. What GuideGeek actually is
A **free-to-consumer**, chat-native AI travel concierge built by **Matador Network** (CEO Ross Borden), living inside **WhatsApp, Instagram DM, and Facebook Messenger** — **no app, no account**: scan a QR and message it "like a friend." Multilingual (**42 languages confirmed in use**, 50+ marketed). Self-positioned as "the AI backbone of the travel industry." Scale: **3.7M+ questions answered, 61 countries, hundreds of thousands of active users (targeting 1M).** It is two products in one: a free consumer assistant *and* a **white-label engine** ("GuideGeek for Brands") licensed to 30+ destination marketing organizations (DMOs).

## A2. Core product architecture (as observed)

```text
USER (consumer)                         DMO / BRAND (B2B)
  │ QR → WhatsApp/IG/Messenger            │ licenses white-label persona
  ▼                                       ▼
┌──────────────────────────────────────────────────────┐
│  GuideGeek conversational AI (OpenAI GPT-4 / GPT-4o)   │
│   RAG grounding:                                       │
│     • Matador editorial corpus + proprietary datasets  │
│     • 1,000+ travel integrations (flights/stays/acts)  │
│     • [white-label] DMO site index (guides/maps/members)│
│   Action: real-time price lookup → OTA deep links      │
└──────────────────────────────────────────────────────┘
  │ text + external links (Airbnb/Booking/Expedia)        ⚠ no native map
  ▼                                                        ⚠ no in-thread booking
USER reads reply, opens Google Maps / OTA manually
```

The architecture is **chat-thread + RAG + affiliate links** — there is no spatial layer, no structured card renderer, and no transaction completion inside the surface. That simplicity is *why it scales* and *why it's shallow.*

## A3. WhatsApp / Instagram / Facebook workflow

| Step | What happens | UX quality |
|---|---|---|
| Entry | QR code on site / "Try on WhatsApp" → opens thread in an app you're already logged into | 🟢 frictionless |
| First message | Open natural-language prompt ("quiet week in December near Lisbon") | 🟢 no form |
| Reply | Full itinerary/recs **within ~1 min**, grouped by mood/distance | 🟢 fast |
| Lodging | Returns OTA listings as **direct links**; **platform chosen by phrasing** (apartment→Airbnb, hotel→Booking/Expedia) | 🟡 clever, but |
| Booking | **External redirect to OTA — cannot complete in chat** | 🔴 leaks out |
| Spatial | **No map embed — "open Google Maps yourself"** (Rotterdam) | 🔴 gap |
| Persistence | Linear thread; **no saved itinerary workspace** | 🔴 degrades on complex trips |

## A4. AI orchestration patterns
Single-assistant **RAG over a curated corpus + live travel integrations**, GPT-4/4o doing intent → retrieve → compose. No evidence of multi-agent handoffs or visible "thinking" steps (contrast Mindtrip/our `04-chat.md`). Platform-selection-by-phrasing is a lightweight routing heuristic, not an agent graph. **Lesson:** you don't need agent sprawl to ship value — but you *do* need grounding discipline they lack.

## A5. Conversational UX patterns
- **One open prompt → full answer.** No faceted filters, no wizard.
- **Grouped recommendations** (by mood/distance) — scannable on a phone.
- **Text + links**, minimal rich UI (no documented quick-reply buttons or structured cards in the hands-on pieces).
- **"Text like a friend"** tone; concise, multilingual.
- Onboarding is *the conversation itself* — account creation is **never the first ask.**

## A6. Travel recommendation engine
RAG-ranked over Matador editorial + 1,000+ integrations, blended with real-time price/availability. Strength = breadth + freshness framing. **Weakness = corpus bias** ("a few suggestions were a bit too trendy," Rotterdam) and **price accuracy** (the $107→$1,009 hallucination). It recommends well; it does not *verify* well.

## A7. Maps / cards / links UX
This is the **biggest product gap**: **no native map, no structured cards.** Recommendations are prose + external links; spatial reasoning is offloaded to the user ("open Google Maps yourself"). For a category where *where* is half the decision (especially rentals/nightlife), this is a strategic opening.

## A8. Human + AI interaction model
Pure AI in the consumer flow — **no human handoff** observed. On the B2B side, DMOs get an **analytics dashboard** (traveler behavior + content performance) that feeds *human* content strategy (Greece explicitly loops query analytics back into editorial). So humans tune the corpus offline; they don't join the live thread.

## A9. Persistent conversation / memory strategy
Thread-scoped. Some within-conversation continuity, but **no evidence of a durable cross-session traveler profile or a saved itinerary object.** Complex multi-day planning degrades because the thread is the only memory. (Mindtrip's persistent workspace is the counter-model; see `01-mindtrip.md`.)

## A10. Booking & workflow capabilities
**Discovery + deep-link, not transaction.** Real-time price lookup → OTA redirect (Airbnb/Booking/Expedia). The **Apr 2026 "Ripe" partnership for "AI-driven real-time bookings"** signals they *know* in-surface booking is the gap and are buying their way toward it. Today: **you cannot complete a booking inside the chat.**

## A11. Brand / white-label AI strategy
"**GuideGeek for Brands**" = a white-label concierge **branded with a local persona name per destination**: Greece **Pythia**, NYC **Libby**, Seattle **Emerald**, Iowa **Goldie**, Mammoth **Sierra**, South Africa **Siyanda**, Frisco **Frankie** (FIFA WC 2026), WildChina **WildConcierge**, etc. Each DMO gets: **site-indexed knowledge base**, custom itineraries, **member-business promotion w/ exclusive deals**, 50+ languages, **analytics dashboard**, deployment on the board's own social channels and/or a **website widget**. This is the real business — see A13.

## A12. Tourism board partnerships (what each bought)

| Partner | Persona / form | What it solved | Proof |
|---|---|---|---|
| DiscoverGreece | "Pythia", web + WhatsApp | First European custom; **EU compliance** GuideGeek lacked before; query→content analytics | "so customizable… accessible via WhatsApp" |
| Discover Halifax | "Halifax AI", website widget | Alt to the website; trained on site + guides + maps + member listings + 1,000+ integrations; **DEI-balanced recs** (Mi'kmaq, 2SLGBTQIA+, African NS) | bottom-right chat widget |
| Toronto "6ix" | persona, social | **Engagement proof: 7,500+ messages / 2,700+ users / 2 months** | — |
| 30+ others | NYC, Seattle, Iowa, Colorado, Santa Monica, Aruba, Reno-Tahoe, NZ (Minecraft)… | Localized assistant on owned channels + analytics | press index |

## A13. Revenue model & monetization

| Stream | Status | Detail |
|---|---|---|
| **B2B DMO licensing** | ✅ confirmed primary | Destinations license a custom persona; fees undisclosed |
| **Affiliate / booking commissions** | 🟡 strongly inferred | OTA deep links; Ripe "real-time bookings" deal points here |
| **Consumer subscription** | ❌ none | Confirmed **free to consumers** |
| Distribution cost | ✅ ~free | Rides Meta messaging rails |

**Structure:** consumer product is a **free top-of-funnel + data engine**; money is **B2B licensing** (+ future affiliate). Classic "free reach → sell the white-label flywheel."

## A14. Why users like it
Zero friction (no app/account), 24/7, fast (~1 min), personalized, multilingual, conversational discovery in an app they already live in. Market tailwind: **AI-for-travel usage +40% YoY (16% → 22.8%), 82.7% satisfaction** (Matador n=1,000 survey).

## A15. Biggest weaknesses & complaints (concrete)

| # | Weakness | Evidence | Severity |
|---|---|---|---|
| 1 | **Pricing hallucination** | "$107/night in chat vs ~$1,009 total on Airbnb" (rentalscaleup) | 🔴 trust-killing |
| 2 | **No map integration** | "open Google Maps yourself" (Rotterdam) | 🔴 category gap |
| 3 | **Recs skew "too trendy"** | Rotterdam ("without clichés" → still trendy) | 🟡 corpus bias |
| 4 | **No in-chat booking** | "couldn't be completed within WhatsApp" | 🔴 leaks revenue + user |
| 5 | **No persistent itinerary workspace** | thread-only | 🟡 degrades complex trips |
| 6 | Thin verified-local depth | global breadth ≠ neighborhood truth | 🟡 the moat opening |

*(Note: the BlondeAbroad review reads sponsored and surfaced* **zero** *complaints — weight the hands-on Rotterdam + rentalscaleup pieces, not the influencer post.)*

## A16. What competitors (incl. GuideGeek) still fail at
- **Grounded accuracy** (price/hours/coords verified, not generated).
- **Spatial UX** in chat (embedded map + pins).
- **In-surface transaction** (book/pay without leaving).
- **Deep single-city local truth** (neighborhood, creator, vibe, freshness).
- **Supply side** (hosts/landlords publishing) — they're demand-only.
- **AI + human hybrid** live handoff for hot/complex cases.

## A17. How GuideGeek likely works technically

| Layer | Signal | Confidence |
|---|---|---|
| LLM | **OpenAI GPT-4 / GPT-4o** | ✅ confirmed (PRNewswire + B2B site) |
| Transport | **WhatsApp Business API + Meta Graph** (WA/IG/Messenger) | 🟢 strong |
| Grounding | RAG over **Matador corpus + proprietary data + 1,000+ travel integrations**; white-label adds **DMO site index** | 🟢 strong |
| Maps | **None native** — relies on user's Google Maps | 🔴 confirmed gap |
| Commerce | OTA affiliate deep links (Airbnb/Booking/Expedia); Ripe for real-time | 🟢 |
| Analytics | DMO dashboard (behavior + content performance) | ✅ stated |

## A18. Agent / workflow architecture
Best read as **one RAG assistant + lightweight phrasing-based routing + an offline content/analytics loop** — not a multi-agent runtime. Effective and cheap; the cost is uniform shallowness (no specialist verification step for price/availability). mdeai's **router → vertical workflows + grounding tools** is strictly more capable here.

## A19. AI automation opportunities (what they automate vs leave manual)
Automated: discovery, multilingual reply, itinerary drafting, price *lookup*, FAQ deflection (B2B), analytics. **Manual / absent:** price *verification*, spatial rendering, booking completion, human escalation, durable personalization, supply-side publishing.

## A20. Messaging-first UX advantages
- **No install / no account** → near-zero acquisition friction.
- **Lives where users already are** (LatAm = WhatsApp-default).
- **Async + 24/7**, notification-native (re-engagement via the inbox they check hourly).
- **Voice/photo-capable channel** (under-exploited by GuideGeek).
- **Multilingual by default.**

## A21. Multi-channel strategy
One brain, three Meta surfaces (WhatsApp / IG / Messenger) + **white-label website widgets** (Halifax). The persona re-skins per destination but the engine is shared — exactly the **"brain once, renderer many"** principle in [`12-mdeai-blueprint.md`](12-mdeai-blueprint.md) §0.

## A22. Customer acquisition strategy
**Two funnels:** (1) consumer = Matador media reach + QR + Meta virality, free; (2) B2B = **DMO partnerships are themselves acquisition** — each tourism board markets its own persona to its visitors, so GuideGeek acquires users *through its customers.* Brilliant compounding.

## A23. Retention / stickiness factors
Weakest area. Stickiness rests on the **WhatsApp thread persisting in your inbox** + brand recall. **No saved collections, no durable profile, no itinerary object, no alerts** observed → low structural retention. **This is a wide-open lane for mdeai.**

## A24. What makes it scalable
Stateless-ish chat + RAG + Meta-hosted transport = **marginal cost per user ≈ LLM tokens.** No app to maintain, no maps infra, no booking ops (redirects out). White-label is **productized config** (site index + persona). Scales horizontally across cities cheaply — *because it stays shallow.*

## A25. Why WhatsApp works so well
Ubiquity (esp. LatAm), zero install, identity/contacts built in, async + push-native, voice/photo, encrypted/trusted, and **the conversation persists** as a relationship artifact. For Medellín specifically, WhatsApp *is* the default commerce + coordination layer — which is why it's mdeai's Phase-2 wedge, not a nice-to-have.

---

## A26. Required consolidated tables

### Features
| Feature | GuideGeek | Quality |
|---|---|---|
| NL chat discovery | ✅ | 🟢 |
| Itinerary draft | ✅ thread | 🟡 not persistent |
| Real-time price lookup | ✅ | 🔴 accuracy bug |
| Embedded map / pins | ❌ | 🔴 |
| Structured cards | ❌ (text+links) | 🔴 |
| In-surface booking | ❌ redirect | 🔴 |
| Multilingual | ✅ 42 | 🟢 |
| White-label persona | ✅ 30+ DMOs | 🟢 |
| Analytics dashboard (B2B) | ✅ | 🟢 |
| Saved / collections | ❌ | 🔴 |
| Human handoff | ❌ | 🔴 |
| Supply-side publishing | ❌ | 🔴 |

### Channels
| Channel | Use | Note |
|---|---|---|
| WhatsApp | primary consumer | QR onboarding |
| Instagram DM | consumer | Meta rails |
| Messenger | consumer | Meta rails |
| Website widget | white-label | Halifax |

### AI capabilities
| Capability | Present | Gap |
|---|---|---|
| RAG over curated corpus | ✅ | bias ("too trendy") |
| Live price integration | ✅ | unverified → hallucinations |
| Routing (phrasing heuristic) | ✅ lightweight | no specialist verify step |
| Grounded geo | ❌ | no maps |
| Memory/personalization | partial | no durable profile |
| Visible reasoning | ❌ | — |

### Automation patterns / Use cases / Monetization / Competitive advantage / Tech-stack
| Axis | GuideGeek |
|---|---|
| Automation | discovery, itinerary draft, FAQ deflection, multilingual reply, analytics; **not** price-verify / booking / escalation |
| Use cases | trip planning, dining/lodging/activity recs, safety/photo-spot Q&A, DMO visitor assist |
| Monetization | B2B DMO licensing (confirmed) + affiliate (inferred); free consumer |
| Competitive advantage | distribution (Meta rails + Matador media) + DMO flywheel + breadth |
| Tech stack | GPT-4/4o · WhatsApp Business API / Meta Graph · Matador corpus + 1,000+ integrations RAG · OTA affiliate · no native maps |

### UX analysis (strengths / weaknesses)
| Strengths | Weaknesses |
|---|---|
| zero-friction, fast, multilingual, conversational, 24/7 | no map, no cards, no in-chat booking, pricing hallucination, no persistence, shallow local depth |

---

# PART B — How mdeai beats GuideGeek

**Thesis:** GuideGeek went **wide and shallow** (every city, chat-only, redirect-out). mdeai goes **deep and transactional** (one city, grounded, maps-native, completes the action) — then *adopts GuideGeek's own white-label flywheel* to expand. We out-execute on the three things it scores <50 on: **grounding, maps, in-surface action.**

## B1. Capability-by-capability: where the mdeai stack wins

| Capability | GuideGeek | mdeai stack → result | Phase |
|---|---|---|---|
| **Grounded accuracy** | RAG → price hallucination | **Google Maps/Places + Grounding** (never invent price/coords/hours) + attribution UI | MVP |
| **Spatial UX** | none (open Maps yourself) | **Maps-native 3-panel** + price/glyph pins, bidirectional card↔pin | MVP |
| **In-surface action** | redirect to OTA | **Stripe** event tickets (paid + QR) + **rental lead capture** in-surface | MVP |
| **Local depth** | global, thin | **Medellín intelligence graph** (OpenClaw crawl → Supabase → pgvector) | Post-MVP |
| **Vibe/semantic search** | keyword RAG | **embeddings (pgvector)**: "quiet, laptop-friendly, romantic" | Post-MVP |
| **Cross-vertical** | travel-only | rentals + **nightlife** + **restaurant bookings** + events in one chat | MVP→ |
| **Supply side** | demand-only | **broker/host workflows**: Roberto publishes events; landlord lead loop | MVP/Post |
| **Orchestration** | single RAG | **Mastra** router → vertical workflows + tools (verify steps) | MVP |
| **Memory/personalization** | thread-only | working memory now → **durable profile + Saved** | MVP→Post |
| **Human handoff** | none | **Chatwoot-model** inbox + HITL approval on money/outreach | Post-MVP |
| **WhatsApp** | the whole product | **same brain, WA renderer** (transport, not rewrite) | Post-MVP/Adv |
| **Retention objects** | none | **Saved / collections / alerts / neighborhood pages** | Post-MVP |

## B2. The two failures that *are* our pitch
1. **"$107 vs $1,009"** → mdeai's hard rule: **Gemini never invents price/coords/hours; Maps/Places grounds it; UI attributes the source.** We can run a literal demo: same query, GuideGeek hallucinates, mdeai shows the verified total + "from Google Maps."
2. **"Open Google Maps yourself"** → mdeai's map is the **right panel / mobile bottom sheet**, pins synced to every card. Spatial is the product, not an exit.

## B3. What mdeai should COPY from GuideGeek
- **Zero-friction conversational onboarding** — no form, no account-first (we already plan this).
- **Grouped, phone-scannable replies** (≤3 picks/bubble on WhatsApp).
- **Persona-per-destination white-label** — *this is the expansion model*: "Medellín concierge" → license the engine to other LatAm cities / hotels / DMOs once the Medellín graph proves out.
- **Acquire-through-customers**: partner with Medellín hotels, coworkings, tourism orgs — each markets the assistant to its own visitors.
- **Free consumer top-of-funnel**, monetize B2B + transactions.
- **Analytics-back-to-content loop** (Greece) → our query logs improve the neighborhood graph.

## B4. What mdeai should AVOID (GuideGeek's mistakes)
- ❌ Unverified price/availability in replies → **always ground or say "checking"** (never fabricate).
- ❌ Mapless chat → **never ship a recommendation without a pin.**
- ❌ Redirect-out for the money moment → **complete tickets/leads in-surface.**
- ❌ Thread-only memory → **build the Saved/profile retention object.**
- ❌ Breadth before depth → **own Medellín completely before city #2.**
- ❌ Agent sprawl chasing "depth" → **router + a few grounded workflows** (roadmap rule).

## B5. What mdeai can UNIQUELY own
> **"Medellín's living local graph + grounded maps-native concierge that actually transacts — on web today, WhatsApp tomorrow."**
- The **neighborhood × creator × vibe × freshness graph** (OpenClaw-fed) no global player will build per-city.
- **Cross-vertical in one chat** (rental + café + nightlife + event), spatially unified.
- **Supply + demand marketplace** (hosts/brokers publish; seekers discover; money flows in-surface).
- **Bilingual EN/ES Medellín nuance** + **WhatsApp voice-note intake** (huge in LatAm, untouched by GuideGeek).

## B6. AI + human hybrid (the model GuideGeek lacks)
```text
AI (Mastra router + grounded tools)  → handles 90% discovery/answers
   │ confidence low / hot lead / money / outreach
   ▼
HITL gate (approval)  → human (Patricia/broker) via Chatwoot-style inbox
   │ drafts prepared by AI, sent by human
   ▼
back to AI thread (logged to Supabase leads + ai_runs)
```
GuideGeek is 100% AI and **leaks the hard cases**; mdeai keeps a human in the loop for trust-critical and revenue-critical moments.

---

# PART C — Returns

## C1. MVP recommendations (already on the roadmap — this just sharpens the "why")
1. `/chat` 3-panel, **maps-native**, router-first (MAP-001→003→007). *Beats GuideGeek's #2 gap.*
2. **Grounding attribution** on every grounded fact; Gemini never fabricates price/coords/hours. *Beats #1 gap.*
3. **In-surface money**: event tickets (Stripe → paid + QR) + rental lead capture. *Beats #4 gap.*
4. Restaurant/nightlife DB search → unified cross-vertical chat (O4).
5. Host publish + HITL (Roberto) — *the supply side GuideGeek doesn't have.*
6. Conversational onboarding, no form, no account-first.

## C2. Advanced roadmap (deepen, then expand like GuideGeek did)
- **Medellín intelligence graph** via OpenClaw (sandbox → enrich): cafés↔coworking↔nightlife↔rentals, creator picks, freshness, vibe labels.
- **pgvector vibe/semantic search** + review/menu summarization + hidden-gems scoring.
- **Saved / collections / alerts / neighborhood pages** (retention objects GuideGeek lacks).
- **WhatsApp transport**: same brain, WA list/button renderer + **voice-note intake**; Chatwoot-style human handoff.
- **Restaurant bookings + broker workflows** (supply depth).
- **White-label "city concierge"** — license the engine to hotels/DMOs/other LatAm cities (GuideGeek's flywheel, but grounded + transactional).

## C3. Best UI/UX patterns to adopt
- 3-panel desktop → mobile **bottom sheet** (Google Maps model); chat input docked.
- **Price/glyph pins**, bidirectional card↔pin highlight, never blank map.
- **Visible thinking** during handoff (we have it).
- WhatsApp: ≤3 picks/bubble, interactive buttons/lists, location pins, "open full view" deep-link, template alerts, voice intake.
- Conversational, deferred-account onboarding with multiple cold-start ramps.

## C4. Best workflow patterns
- **Router → vertical workflow → grounded tool → card + pin → (action: ticket/lead) → log.**
- **Verify step** for price/availability before it reaches the user (GuideGeek's missing link).
- **HITL gate** on money/outreach; human handoff via inbox.
- **Brain-once / renderer-many** so web and WhatsApp share logic.

## C5. Monetization opportunities (sharper than GuideGeek's)
| Stream | mdeai | Phase | vs GuideGeek |
|---|---|---|---|
| Event ticketing | Stripe commission per ticket | MVP | GuideGeek can't transact |
| Rental lead / commission | lead fee → booking commission | MVP→Adv | they redirect out |
| Restaurant/nightlife bookings | reservation fees, promoted "tonight" | Post-MVP | absent |
| Sponsored placements (labeled) | local-business deals (their B2B promo idea) | Post-MVP | they have it (B2B); we ground it |
| **White-label city concierge** | license Medellín engine to hotels/DMOs/cities | Advanced | **directly copy their best model** |
| Affiliate handoff | stays/tours where we don't transact | Post-MVP | parity |

## C6. Infrastructure recommendations
- **Supabase** = data truth (places graph, leads, orders, RLS). **Mastra** = orchestration. **CopilotKit** = UI. **Google Maps/Places** = spatial + grounding. **Gemini** = explanation (tool-backed only). **Stripe** = money. **pgvector** = semantic. **OpenClaw** = enrichment (sandbox, draft-only, source-labeled). **WhatsApp Business API** = Phase-2 transport. **Chatwoot-model** inbox = human handoff. (All consistent with `CLAUDE.md` hard rules + roadmap.)

## C7. Strategic moat analysis
| Moat layer | GuideGeek | mdeai |
|---|---|---|
| Distribution | 🟢 Meta rails + Matador media | 🟡 build via WA + local partners |
| Data depth | 🔴 broad/shallow | 🟢 **deep Medellín graph (compounding)** |
| Grounding/trust | 🔴 hallucinations | 🟢 **Maps-grounded + attribution** |
| Transaction loop | 🔴 redirects | 🟢 **in-surface tickets/leads** |
| Supply side | 🔴 none | 🟢 **hosts/brokers publish** |
| White-label flywheel | 🟢 30+ DMOs | 🟡 **adopt after Medellín proof** |

**The defensible core:** a **living, grounded, transactional Medellín graph** that compounds with every query, crawl, and booking — something a global breadth-player structurally won't build per-city. Win Medellín deep, then run GuideGeek's white-label playbook outward.

> **Bottom line:** Copy GuideGeek's *distribution instincts and white-label flywheel*; refuse its *shallowness*. mdeai's MVP (grounded maps-native chat that transacts) already targets the exact three dimensions GuideGeek scores below 50 on — so the differentiation isn't aspirational, it's the plan of record.
