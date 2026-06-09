# Chatwoot Setup Plan — Review, Gaps & Improvements

> Review of the proposed Chatwoot setup plan against production reality and the existing codebase. Companion to [`chatwoot-integration-plan.md`](chatwoot-integration-plan.md) (the architecture/PRD) — this doc is the **operational hardening layer**: what the setup plan gets right, what's missing, and the concrete additions to ship safely.
> **Verdict:** the plan is **80% production-ready as an operating model** and an excellent setup sequence. The missing 20% is where most Chatwoot+WhatsApp projects fail: **compliance, the bridge contract, data source-of-truth, security, and reconciliation with code that already exists.**

## 1. What the plan gets right (keep as-is)

| Strength | Why it matters |
|---|---|
| Chatwoot as "communication OS", not just chat | Correct framing — it's the channel + human + CRM layer |
| Phased Core → MVP → Growth → Advanced → AI | Right order; ships value before complexity |
| **MVP = Chatwoot + WhatsApp + Agent Bot + Mastra + Supabase** | Matches the recommended slice exactly |
| Teams = Rentals/Restaurants/Nightlife/Events | Clean routing taxonomy |
| WhatsApp setup options table (Embedded Signup / manual Cloud / Twilio) | Accurate and decision-useful |
| CLI + `fazer-ai/chatwoot-skills` for Claude Code | Real, high-leverage for ops/debugging |
| Mastra stays the brain (not Chatwoot Captain) | Correct — avoids logic duplication |
| Paid vs OSS table | Honest about self-host tradeoffs |

> **Adopt into the main plan:** the GitHub repos list, the WhatsApp-setup-options decision table, and the Chatwoot CLI + Claude Code skills workflow. These were thin in the integration plan.

---

## 2. Critical gaps (must fix before production)

### 2.1 WhatsApp compliance & the 24-hour window `[missing — highest risk]`

The plan says "WhatsApp channel" but omits the rules that *break* most launches:

| Rule | Requirement |
|---|---|
| **24-hour customer service window** | You can only free-form reply within 24h of the user's last message. Outside it → **approved template message only**. The bot pipeline must check window state. |
| **Template approval** | Re-engagement / proactive messages need Meta-approved templates (utility/marketing categories). Submit early — approval takes hours-days. |
| **Opt-in (Ley 1581 + Meta)** | Proactive WhatsApp requires documented opt-in. Reuse the existing **`whatsapp_subscriptions`** table as the opt-in ledger. |
| **STOP / opt-out** | Must honor unsubscribe; auto-label + suppress. |
| **Messaging tiers / rate limits** | New WABA starts at 250 conv/day; scales with quality rating. Plan re-engagement volume around this. |

**Action:** add a `whatsapp_window_state` check + template fallback in the bridge; wire opt-in/STOP to `whatsapp_subscriptions`.

### 2.2 The Agent Bot ↔ Mastra bridge contract `[under-specified]`

"Connect Agent Bot webhook to Mastra" hides the part that needs a spec:

```text
Chatwoot → POST /api/chatwoot-bridge   (webhook: message_created)
  verify HMAC signature (X-Chatwoot-Signature)  ← REQUIRED, omitted in plan
  ignore if message.sender.type == "agent_bot"  ← prevent self-loops
  build context: { contact, last_N_messages, conversation.custom_attributes }
  → Mastra agent run
  ← { reply, confidence, intent, needs_human, lead? }
  → Chatwoot API:
       POST /messages (reply)                         (public)
       POST /messages (private note: AI summary+score) (private, for humans)
       PATCH conversation: labels[intent], custom_attributes, status
       if needs_human → assign team, status=open, remove bot assignee
```

| Missing piece | Add |
|---|---|
| **Webhook signature verification** | Verify `X-Chatwoot-Signature` (HMAC) — without it the bridge is an open endpoint |
| **Self-loop guard** | Skip `agent_bot`/`outgoing` messages or the bot replies to itself |
| **Idempotency** | Dedupe on Chatwoot `message.id` (webhooks retry) |
| **Timeout/fallback** | If Mastra > N s → canned "one moment, a human will help" + escalate |
| **Error handling / DLQ** | Failed runs → n8n dead-letter + alert, never a silent drop |

### 2.3 Source-of-truth & cross-channel identity `[missing]`

The plan stores leads in Supabase but doesn't resolve: *same person messages on WhatsApp AND Instagram — one contact or two?*

| Decision | Recommendation |
|---|---|
| Who owns the conversation? | **Chatwoot** |
| Who owns the business object (lead/booking)? | **Supabase** |
| Contact mapping | Store `mde_contact_id` in Chatwoot contact `custom_attributes`; mirror `chatwoot_contact_id` in Supabase `contacts` |
| Identity merge | Use Chatwoot **contact merge** + phone/email as the join key; one Supabase contact across channels |

### 2.4 Reconcile with the **existing `whatsapp_*` tables** `[not addressed — will cause drift]`

The codebase **already has** `whatsapp_conversations`, `whatsapp_messages`, `whatsapp_subscriptions`, `wa_outbox`. The plan doesn't say what happens to them when Chatwoot arrives. Two writers to the same conversation = chaos.

| Existing table | Decision |
|---|---|
| `whatsapp_conversations` / `whatsapp_messages` | **Deprecate as the live store** — Chatwoot becomes the conversation source of truth. Keep read-only/archive or stop writing. |
| `whatsapp_subscriptions` | **Keep** — repurpose as the opt-in/marketing-consent ledger (Chatwoot doesn't track Ley-1581 consent). |
| `wa_outbox` | **Replace** outbound cron with **Chatwoot Campaigns** (Phase 4) or n8n → Chatwoot API. Don't run two senders. |

> **Pick one WhatsApp sender.** Running both the legacy `wa_outbox` loop and Chatwoot's WhatsApp will double-send and risk a ban.

### 2.5 Security & secrets `[missing]`

| Item | Action |
|---|---|
| Self-signup | `ENABLE_ACCOUNT_SIGNUP=false` (or the env equivalent) so the public instance isn't open |
| API tokens | Scope bot token; store in Vercel/Supabase secrets, never client |
| Webhook secret | HMAC verify both directions |
| RLS | New `contacts`/`conversations` mirror tables get RLS (matches repo invariant: no service-role in `src/**`) |
| Audit logs | Enable (Ley 1581 + dispute defense) |

---

## 3. Important improvements (do in MVP/Phase 2)

| # | Improvement | Why |
|---|---|---|
| I1 | **Confidence-based handoff model** | Plan says "human joins if needed" — define *when*: `needs_human \|\| confidence<0.6 \|\| intent ∈ {payment, complaint, vip, complex}` |
| I2 | **Required conversation attributes** before resolve | Plan mentions it in Phase 4 — pull to MVP: don't let rental convos resolve without `budget`+`date`+`area` (data quality = lead value) |
| I3 | **Revenue wiring** | Plan is ops-only. Add: G2 lead → `leads` → **`lead_billing`** meter; payment links in chat (reuse G1 ticket checkout); featured via `sponsor.*` |
| I4 | **CopilotKit coexistence** | Plan ignores the existing web concierge. Chatwoot's web inbox is the **human-handoff destination** for CopilotKit, not a replacement — one shared Mastra brain |
| I5 | **n8n vs direct endpoint clarity** | Use **n8n** for fan-out/retries/3rd-party glue; keep the **Mastra call** in a thin Next.js `/api/chatwoot-bridge` (lower latency, typed) |
| I6 | **Staging + sandbox** | Test number / Meta test WABA + staging Chatwoot before pointing prod WhatsApp at it |
| I7 | **Observability** | Structured logs on the bridge, webhook success rate, bot-containment metric, alert on DLQ |
| I8 | **IG/FB specifics** | IG needs a **Professional account + linked FB Page**; Messenger has its own 24h window + message tags — same window discipline as WhatsApp |

---

## 4. Cost model the plan is missing

OSS self-host is "free" software, but **WhatsApp itself is not free** — Meta charges per *conversation* by category:

| Cost line | Notes |
|---|---|
| **Meta WhatsApp conversations** | Priced per 24h conversation, by category (service/utility/marketing); service convos have a monthly free tier. Budget per expected volume. |
| **Twilio (if used)** | Adds per-message markup on top of Meta — easier setup, higher unit cost. Use Cloud API direct for scale. |
| **Hetzner + Coolify** | ~€10–40/mo VPS (Postgres + Redis + Sidekiq + Chatwoot + n8n); add object storage + backups |
| **Model (Gemini)** | Per bridge call — cache + route cheap models |

> **Decision:** **manual WhatsApp Cloud API direct** (not Twilio) for unit economics once past pilot; Embedded Signup or Twilio only to move fast in week 1.

---

## 5. Corrected / hardened setup order

The plan's 12-step order is good. Hardened version (changes **in bold**):

| # | Step | Addition |
|---|---|---|
| 1 | Self-host Chatwoot (Hetzner/Coolify) | **+ Postgres, Redis, Sidekiq, object storage, SMTP, SSL, backups, `ENABLE_ACCOUNT_SIGNUP=false`** |
| 2 | Create teams | Rentals/Restaurants/Nightlife/Events |
| 3 | Web chat inbox | **= CopilotKit handoff destination** |
| 4 | Labels + custom attributes | **+ required attrs for rental resolve** |
| 5 | **Staging + Meta test number** | **before prod WhatsApp** |
| 6 | WhatsApp channel (Cloud API direct) | **+ templates submitted for approval early** |
| 7 | Agent Bot → `/api/chatwoot-bridge` | **+ HMAC verify, self-loop guard, idempotency, timeout fallback** |
| 8 | Save qualified leads → Supabase | **+ contact identity mapping, `lead_billing` hook** |
| 9 | **Deprecate `wa_outbox`/`whatsapp_*` writers** | **one sender only** |
| 10 | Instagram (Professional acct) | + 24h window discipline |
| 11 | Facebook Messenger | + message tags |
| 12 | Automations / routing / SLA | confidence handoff, auto-label, auto-assign |
| 13 | Campaigns / follow-ups | **opt-in only via `whatsapp_subscriptions`, honor STOP** |
| 14 | **Observability + DLQ alerts** | **bot containment, webhook health** |

---

## 6. Gap scorecard

| Area | Plan coverage | Risk if unfixed |
|---|---|---|
| Setup sequence | 🟢 Strong | Low |
| Teams/labels/attributes | 🟢 Strong | Low |
| WhatsApp **compliance/window** | 🔴 Missing | **High (ban/legal)** |
| Bridge **contract/security** | 🟡 Vague | **High (open endpoint, loops)** |
| Data **source-of-truth/identity** | 🔴 Missing | Med (data drift) |
| **`whatsapp_*` reconciliation** | 🔴 Missing | **High (double-send)** |
| Revenue wiring | 🟡 Light | Med (ops without income) |
| CopilotKit coexistence | 🔴 Missing | Med (duplicate logic) |
| Cost model | 🟡 Partial | Med (budget surprise) |
| Observability | 🔴 Missing | Med (silent failures) |

---

## 7. Bottom line — what to add to the plan

**Top 6 must-add before launch:**
1. **WhatsApp 24h-window + template + opt-in/STOP** handling (compliance).
2. **Bridge contract**: HMAC verify + self-loop guard + idempotency + timeout fallback.
3. **Reconcile `whatsapp_*`/`wa_outbox`** — Chatwoot is the single conversation source + single sender.
4. **Identity mapping** `mde_contact_id ↔ chatwoot_contact_id`; one contact across channels.
5. **Revenue hooks**: lead → `lead_billing`; payment links via existing G1 checkout; featured via `sponsor.*`.
6. **Security baseline**: signup off, scoped tokens, RLS on mirror tables, audit logs.

**Nice-to-add:** confidence handoff model, required attributes in MVP, staging/sandbox, observability/DLQ, explicit WhatsApp cost budget, CLI/skills ops workflow.

> Everything else in the proposed plan stands. It's a strong operating model — these additions make it **production-safe and revenue-wired**, and prevent the two failure modes that sink Chatwoot+WhatsApp launches: **a Meta ban (compliance/double-send)** and **a wide-open/looping bridge.**

> _Review v1 — pairs with [`chatwoot-integration-plan.md`](chatwoot-integration-plan.md). Fold the Top-6 into the setup order before Phase 2._
