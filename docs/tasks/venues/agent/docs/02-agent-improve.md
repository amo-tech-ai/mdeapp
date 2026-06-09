## Current answer

Right now, mdeai does **not** truly “evaluate best cafés” itself.

It mostly does this:

```text
User: best cafés in Medellín
↓
Mastra chooses search-grounded-places
↓
Google Grounding Lite searches Google Maps
↓
Google decides the top results
↓
mdeai enriches them with rating, reviews, photos, hours
↓
UI displays cards
```

So today:

```text
“Best” = Google’s ranking + visible rating/review signals
```

Not:

```text
mdeai’s own scoring system
```

The uploaded audit confirms there is no custom re-rank by rating or review count after enrichment. 

---

# Current evaluation table

| Layer          | What it does today                            | Good? | Gap                         |
| -------------- | --------------------------------------------- | ----: | --------------------------- |
| User query     | Sends words like “best”, “quiet”, “specialty” |     ✅ | Depends on user wording     |
| Grounding Lite | Finds/ranks places                            |     ✅ | Google controls order       |
| Places API     | Adds rating, reviews, hours, photos           |     ✅ | Display only                |
| Mastra         | Chooses the right tool                        |     ✅ | Does not score results      |
| UI cards       | Shows quality signals                         |     ✅ | No “why this is best” score |
| mdeai ranking  | Not implemented                               |     ❌ | No custom rubric            |

---

# Example today

If user asks:

```text
best cafés in Laureles
```

Google may return:

| Café          | Rating | Reviews | Why shown        |
| ------------- | -----: | ------: | ---------------- |
| Café Euge     |    4.8 |     800 | Google ranked it |
| Pergamino     |    4.7 |   2,000 | Google ranked it |
| Café Zeppelin |    4.6 |     900 | Google ranked it |

mdeai shows the cards, but does not yet calculate:

```text
Café Score: 92/100
```

---

# How to improve it

Add a simple **mdeai Café Score**.

## Suggested scoring formula

| Factor                      | Weight | Why                                    |
| --------------------------- | -----: | -------------------------------------- |
| Rating                      |    30% | quality                                |
| Review count                |    20% | confidence                             |
| Open now                    |    15% | useful immediately                     |
| Distance / viewport         |    15% | nearby relevance                       |
| Query match                 |    10% | matches “quiet”, “coworking”, “brunch” |
| Price fit                   |     5% | budget relevance                       |
| Freshness/source confidence |     5% | trust                                  |

---

# Result

Instead of only showing:

```text
Café Euge
★ 4.8
Open now
```

show:

```text
Café Euge
Best Match · 92/100
★ 4.8 · 800 reviews · Open now
Reason: strong rating, coworking vibe, close to Laureles
```

---

# Better ranking table

| Rank | Café           | Google rating | mdeai score | Reason                          |
| ---: | -------------- | ------------: | ----------: | ------------------------------- |
|    1 | Café Euge      |           4.8 |          92 | coworking + high rating         |
|    2 | Pergamino      |           4.7 |          89 | many reviews + specialty coffee |
|    3 | Café Zeppelin  |           4.6 |          84 | good vibe + nearby              |
|    4 | Café Primavera |           4.5 |          78 | dog-friendly + outdoor          |
|    5 | Pausa Coffee   |           4.4 |          76 | brunch-focused                  |

---

# Recommended improvements

| Priority | Improvement            | Why                                 |
| -------- | ---------------------- | ----------------------------------- |
| P1       | Add café score         | Makes “best” explainable            |
| P1       | Re-rank by score       | Better than raw Google order        |
| P1       | Add “Why this match?”  | Builds trust                        |
| P2       | Add preference filters | quiet, wifi, brunch, dog-friendly   |
| P2       | Add user context       | remote work vs date night           |
| P2       | Add Search grounding   | verify current buzz/events          |
| P3       | Add feedback loop      | user likes/dislikes improve ranking |

---

# Best next task

Create:

```text
MAP-024 — mdeai Place Quality Scoring
```

Goal:

```text
Take Grounding Lite + Places results
and rank them using mdeai’s own explainable score.
```

---

# Success criteria

| Requirement        | Pass condition                    |
| ------------------ | --------------------------------- |
| Score exists       | every café card has score         |
| Ranking improves   | highest scored card appears first |
| Explanation exists | card shows 1-line reason          |
| No hallucination   | only use available fields         |
| Fallback works     | if no rating, keep Google order   |
| Tests pass         | scoring unit tests                |

---

# Simple summary

Today:

```text
Google decides “best.”
mdeai displays evidence.
```

Better future:

```text
Google finds candidates.
Places enriches them.
mdeai scores and explains why each is best.
```

That would make the concierge feel much smarter.
