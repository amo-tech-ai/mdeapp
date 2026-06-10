---
title: MVP Scope
status: Strategic appendix
date: 2026-05-24
related:
  - ../prd-event-contest.md
  - ./04-verification-report-2026-06-02.md
---

# MVP Scope

This is the short execution copy of the contest MVP boundary. The deeper version is [prd-event-contest.md](../prd-event-contest.md).

## MVP tracks (execution order)

| Track | Tasks | Ship when |
|---|---|---|
| **MVP-A** | CTEST-000 → 001 → 002 → 004 → 005 → 006 → 008 → 009 → 010 → 007 (core specs) | Free vote ledger + host workspace + contestant signup/profile + public vote page + E2E |
| **MVP-B** | CTEST-003, 011, sponsor/WhatsApp surfaces in 006 | After MVP-A green: paid tickets/votes, discovery sandbox |

Vote UI (`/contests/*/vote`) is **blocked** until CTEST-002 RPCs pass SQL proof.

## Build First (full vertical — split by track above)

| Area | MVP scope |
|---|---|
| Contest setup | Organizer creates a contest, divisions, contestant slots, schedule, venue, and public page. |
| Contestants | Contestants submit profile, media, bio, social links, and compliance fields. |
| Voting | Free and paid voting with deterministic ledger, anti-fraud signals, audit logs, and admin review. |
| Tickets | Stripe Checkout for event tickets and paid vote packs, with webhook-only fulfillment. |
| Judges | Judge login, score entry, score locks, weighted formulas, and signed final publish. |
| WhatsApp | Opt-in reminders, approved templates, ticket/vote links, and organizer alerts. |
| Sponsors | Sponsor CRM, package builder, AI proposal drafts, approval queue, and manual send. |
| AI marketing | Draft posts, voting copy, contestant profile polish, and campaign suggestions. |
| Admin | Moderation queue, vote audit view, contestant approval, sponsor approval, and winner publish controls. |
| Testing | Local boot, route proof, SQL proof, API proof, browser proof, and negative-case proof. |

## Defer

| Deferred item | Reason |
|---|---|
| OpenClaw daily scraping | Needs legal/TOS review, quotas, source allowlist, and sandboxed approval gates. |
| Autonomous DMs/outreach | Too risky for MVP reputation, compliance, and deliverability. |
| Postiz automated publishing | Keep campaign launch manual until approvals and rollback flows are proven. |
| Livestream overlays | Valuable, but not required to prove contest setup, voting, tickets, judging, and sponsor drafts. |
| Influencer automation | Start with manual recommendations, not autonomous discovery/outreach. |
| Complex vector memory | SQL truth and simple search are enough for MVP. |
| Kubernetes/microservices | Modular monolith plus Supabase and queues is the right first operating model. |

## Done Standard

No MVP task is Done without recorded evidence:

| Proof | Required evidence |
|---|---|
| Route | Page returns successfully and the correct persona can use it. |
| SQL | Tables, RLS, policies, constraints, and audit rows are verified. |
| API | Happy path and at least one negative path are probed. |
| Browser | UI interaction is checked through a real browser or Playwright. |
| Payment | Stripe webhook is the only source of paid fulfillment truth. |
| AI | AI output is draft-only or approval-gated for sensitive actions. |
