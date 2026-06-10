# Edge function freeze list

Frozen per `plan/04-supabase-cleanup.md` Phase 2 — do not redeploy from CI until Phase 2/3 feature work unfreezes a slug.

| Slug | Version @ freeze | Cluster | Frozen |
|------|------------------|---------|--------|
| sponsor-checkout | 18 | sponsor | 2026-05-19 |
| sponsor-payment-webhook | 19 | sponsor | 2026-05-19 |
| sponsor-impression | 18 | sponsor | 2026-05-19 |
| sponsor-click | 18 | sponsor | 2026-05-19 |
| sponsor-contract-sign | 21 | sponsor | 2026-05-19 |
| sponsor-contract-generate | 18 | sponsor | 2026-05-19 |
| sponsor-application-create | 18 | sponsor | 2026-05-19 |
| sponsor-cancel | 19 | sponsor | 2026-05-19 |
| sponsor-moderate | 21 | sponsor | 2026-05-19 |
| sponsor-roi-explain | 22 | sponsor | 2026-05-19 |
| sponsor-audience-match | 22 | sponsor | 2026-05-19 |
| sponsor-optimize | 22 | sponsor | 2026-05-19 |
| sponsor-creative-gen | 21 | sponsor | 2026-05-19 |
| openclaw-delivery-webhook | 14 | openclaw | 2026-05-19 |
| openclaw-concierge-webhook | 14 | openclaw | 2026-05-19 |
| openclaw-outreach | 10 | openclaw | 2026-05-19 |
| postiz-schedule-posts | 10 | postiz | 2026-05-19 |
| postiz-approval-webhook | 10 | postiz | 2026-05-19 |
| vote-cast | 22 | contest | 2026-05-19 |
| contestant-social-enrich | 21 | contest | 2026-05-19 |
| fraud-scan | 21 | contest | 2026-05-19 |
| moderate-asset | 21 | contest | 2026-05-19 |
| whatsapp-webhook | 30 | other | 2026-05-19 |
| hermes-ranking | 10 | other | 2026-05-19 |
| event-photo-moderate | 18 | other | 2026-05-19 |

## Phase 1 — not frozen (active paths)

- `chat-lead-capture` — anon lead capture (verify_jwt false after deploy)
- `rentals`, `ticket-checkout`, `ticket-payment-webhook`, `ticket-validate`, `lead-from-form`, `p1-crm`, `listing-*`, `rules-engine`, `google-directions`

## Deprecated for mdeapp chat (do not call from CopilotKit)

`ai-router`, `ai-chat`, `ai-search`, `ai-trip-planner`, `ai-optimize-route`, `ai-suggest-collections`, `ai-embed`
