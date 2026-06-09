---
legacy_id: EVT-049
linear: SAN-508
linear_url: https://linear.app/sanjiovani/issue/SAN-508/evt-049-sponsor-venue-match
task_id: veb-017-advanced
tier: advanced
title: Sponsor ↔ venue match for brand launches
layer: mastra
priority: P3
status: Not Started
estimated_effort: 2 days
depends_on: [evp-029, veb-007]
unblocks: []
skills: [mastra, gemini, mde-supabase]
description: Match sponsor CRM leads to rooftop/launch venues — cross-sell B2B revenue.
---

# VEB-017-advanced — Sponsor venue match

> **Linear:** [EVT-049 — Sponsor ↔ venue match for brand launches](https://linear.app/sanjiovani/issue/SAN-508/evt-049-sponsor-venue-match) · **Project:** [Events Platform](https://linear.app/sanjiovani/project/events-platform-46150ec19346/issues)

## Phase 2+ — revenue cross-sell

## What we're building

When sponsor pipeline has "brand launch in Provenza", rank event venues with fit scores + capacity for branded events.

## Integration

| System | Role |
|--------|------|
| EVP-029 sponsor CRM | Lead requirements |
| VEB-007 match panel | Same UI component |
| Patricia | Intro email / WA — manual v1 |

## Acceptance criteria

- [ ] Feature flag gated
- [ ] Sponsor data never exposed to public venue cards
- [ ] Match reasons cite sponsor brief fields only

## Related

- [`EVP-029`](../../../events/tasks/EVP-029-advanced-sponsor-crm-lite.md)
