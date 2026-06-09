 /home/sk/mdeai/venues/data/venue-dataplan.md /home/sk/mdeai/tasks/data/plan/data-intelligence-plan.md  review is the plan correct has it been setup  correctly  you are a senior software specialist and forensic auditor 
audit identify errors red flags failure points blockers 
critical fixes 
generate audit report
evaluate percent correct
suggest improvements 
best practices 


run multiple tests

list corrections for each task verify 100 % correct grading system and generate scores use green yellow red dots percent correct for each task report for each add easy to understand descriptions with real world examples The plan is **very strong overall**.

I’d rate it:

| Area                |  Score |

| ------------------- | -----: |

| Architecture vision | 95/100 |

| AI/search design    | 93/100 |

| MVP practicality    | 88/100 |

| Database design     | 90/100 |

| Operational realism | 92/100 |

| Migration safety    | 84/100 |

| Complexity risk     | 72/100 |

| Overall             | 89/100 |

Main verdict:

* ✅ Correct north-star architecture

* ✅ Correct decision NOT to merge into one `venues` table yet

* ✅ Excellent AI-native direction

* ⚠️ Slight overengineering risk for MVP

* ⚠️ Some polymorphic FK complexity

* ⚠️ Missing operational/data freshness strategy

* ⚠️ Missing ranking evaluation framework

The document is genuinely good and much more realistic than most AI-generated “super platform” plans. 

# What is VERY correct

## 1. NOT doing a big-bang `venues` migration now

This is the most important correct decision.

The doc correctly says:

> keep current catalogs for MVP and unify intelligence first

That is the safest production approach. 

Real-world:

* Uber did not rewrite all dispatch systems at once

* Airbnb did not unify all listing types immediately

* Stripe keeps compatibility layers for years

Correct move:

```text

intelligence layer first

catalog merge later

```

Excellent decision.

---

# 2. `venue_*` naming is correct

This is also correct:

```text

venue_signals

venue_documents

venue_embeddings

venue_source_evidence

```

instead of:

```text

restaurant_signals

```

Why this matters:

You are building:

* cafes

* restaurants

* rooftops

* nightlife

* gyms

* attractions

So intelligence should be universal.

Correct architecture.

---

# 3. Intelligence layer = real moat

This section is excellent:

```text

Google Maps = where

mdeai = where + why

```

That is the correct product positioning.

Google already owns:

* maps

* addresses

* hours

* ratings

Your advantage is:

* vibe

* hidden gems

* date-night

* nomad-friendly

* rooftop quality

* local authenticity

* nightlife flow

Very strong product thinking.

---

# 4. Hybrid search approach is correct

This is good:

```text

FTS + vector + signals

```

instead of:

```text

LLM-only ranking

```

Correct architecture.

Real-world:

* Airbnb

* Booking

* Perplexity

* Pinterest

* Spotify

all use:

```text

structured ranking + embeddings

```

not pure AI generation.

---

# Biggest red flags

# 🔴 1. Polymorphic FK complexity

This is the biggest technical risk.

Example:

```sql

restaurant_id

venue_anchor_id

venue_kind

```

This becomes painful over time.

Problems:

* harder joins

* harder constraints

* harder analytics

* harder RLS

* harder migrations

* harder ORM typing

* duplicated indexes

This is acceptable TEMPORARILY.

But:

```text

do not stay here too long

```

Recommendation:

Move to:

```text

venues(id)

```

within Phase 2 before:

* bookings scale

* AI memory grows

* recommendations expand

---

# 🔴 2. Too many intelligence scores

This section is slightly overengineered:

```text

quiet_score

date_night_score

digital_nomad_score

wifi_score

rooftop_score

cocktail_score

nightlife_score

brunch_score

hidden_gem_score

local_authenticity_score

touristy_score

service_score

value_score

```

Problem:

Who maintains these?

AI-generated scores drift over time.

Real-world issue:

* venue changes ownership

* wifi disappears

* rooftop closes

* crowd changes

* brunch menu removed

Recommendation:

For MVP:

keep only:

```text

quiet_score

date_night_score

wifi_score

nightlife_score

rooftop_score

touristy_score

```

Add the others later.

---

# 🔴 3. Missing freshness system

This is a major gap.

You mention:

```text

facts_checked_at

```

but not:

* TTL strategy

* stale score detection

* refresh priority

* decayed confidence

* freshness weighting

This matters A LOT.

Real-world:

A Medellín venue changes rapidly.

Need:

```sql

freshness_score

last_verified_at

verification_source

stale_after_days

```

Especially for:

* nightlife

* restaurants

* temporary closures

---

# 🔴 4. No operational moderation layer

Missing:

```text

human moderation workflow

```

AI enrichment alone is dangerous.

Need:

```text

draft

reviewed

verified

expired

```

especially for:

* hidden gem

* authenticity

* nightlife

* safety-related info

---

# 🔴 5. Embedding explosion risk

This is risky:

```text

venue_documents

venue_embeddings

```

Potential issue:

Every:

* review

* menu

* reddit post

* webpage

* Instagram text

creates embeddings.

This can explode cost/storage.

Recommendation:

MVP:

Only embed:

* summaries

* curated snippets

* top reviews

* menu summaries

NOT raw everything.

---

# Missing important systems

# 🟡 1. Venue lifecycle status

Missing:

```sql

status

```

Need:

```text

active

temporarily_closed

permanently_closed

pending_review

seasonal

hidden

deprecated

```

Very important.

---

# 🟡 2. Data confidence weighting

Need:

```sql

confidence_source

```

Google should weigh more than Reddit.

Example:

```text

Google hours > Reddit comment

```

Need weighted evidence.

---

# 🟡 3. AI hallucination prevention rules

Need stronger rules like:

```text

AI cannot invent:

- hours

- pricing

- menu items

- reservation availability

```

Only infer:

* vibe

* atmosphere

* likely categories

---

# 🟡 4. Ranking evaluation framework

Huge missing piece.

Need:

```text

human-rated search evaluations

```

Example:

```text

"best rooftop dinner provenza"

```

Then:

* humans rank results

* compare AI rankings

Otherwise ranking drifts badly.

---

# Web-scale realism check

The document is realistic for:

| Scale              | Verdict                                |

| ------------------ | -------------------------------------- |

| Medellín MVP       | ✅ Excellent                            |

| Colombia expansion | ✅ Good                                 |

| Latin America      | 🟡 Needs simplification                |

| Global scale       | 🔴 Current polymorphic model will hurt |

---

# Most important recommendation

## Keep THIS:

```text

shared intelligence layer

```

## Delay THIS:

```text

full venues merge

```

## Simplify THIS:

```text

too many signal scores

```

## Add THIS:

```text

freshness + verification system

```

---

# Best next steps

## Priority 1

Add:

```text

freshness + verification lifecycle

```

---

## Priority 2

Create:

```text

human evaluation ranking dataset

```

20–50 Medellín queries.

---

## Priority 3

Reduce signal complexity for MVP.

---

## Priority 4

Add moderation workflow.

---

## Priority 5

Complete:

```text

venue_signals

venue_source_evidence

embedding_jobs

```

before attempting unified `venues`.

---

# Biggest strategic insight

The BEST part of this plan is:

```text

AI-native venue intelligence

```

NOT:

```text

another places directory

```

That is the correct direction.

are the suggestions correct verify is the plan correct do we have tasks for the venue intelligence plan 