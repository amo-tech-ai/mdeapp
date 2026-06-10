---
id: EVP-029-advanced
linear: SAN-132
legacy_id: EVT-MVP-04
title: Sponsor CRM-lite + proposal drafts
status: Not Started
priority: P2
persona: Patricia, Roberto, Sponsor
depends_on:
  - EVP-001-core
  - EVP-003-core
---

# EVP-029-advanced — Sponsor CRM-lite + proposal drafts

## Objective

Create the smallest sponsor workflow that can generate revenue without building a full marketplace.

## Scope

| Feature | MVP behavior |
|---|---|
| Sponsor lead | Patricia creates/edits a sponsor lead. |
| Event fit | System calculates simple deterministic fit fields plus optional AI explanation. |
| Proposal draft | Gemini drafts benefits and outreach copy from event facts. |
| Approval | Human approves before sending or exporting. |
| ROI snapshot | SQL-backed ticket/referral metrics summarized after event. |

## Database planning

Use Supabase with RLS. Prefer a `sponsor` schema if existing platform sponsor docs require it.

Candidate tables:

- `sponsor.leads`
- `sponsor.event_matches`
- `sponsor.proposal_drafts`
- `sponsor.approvals`
- `sponsor.roi_snapshots`

## Forbidden

- No autonomous outreach.
- No AI-generated contracts sent directly.
- No sponsor payments outside Stripe.
- No AI mutation of event pricing, order state, or sponsor status without approval.

## Acceptance criteria

- RLS is enabled and verified for every table.
- Proposal draft can be generated and stored.
- Approval/rejection is audited.
- No external send occurs in this task.
- Patricia has a usable admin queue for review.
