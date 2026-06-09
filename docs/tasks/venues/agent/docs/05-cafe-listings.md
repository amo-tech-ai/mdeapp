# Best approach for the Café Directory

You should build this in layers.

NOT just:

```text id="70c4ca"
Google Maps listing
```

Instead:

```text id="x0q2qr"
AI café intelligence directory
```

---

# What makes cafés special (patterns from sources)

After reviewing:

* TripAdvisor
* Eater
* Medellin.com
* Nomad blogs
* Reddit discussions
* Specialty coffee guides

the same signals repeatedly appear:

| Signal                    | Why people recommend cafés         |
| ------------------------- | ---------------------------------- |
| Specialty coffee quality  | beans, roasters, pour-over quality |
| Laptop/work friendly      | wifi, outlets, seating             |
| Atmosphere/vibe           | aesthetic, calm, social            |
| Neighborhood context      | Provenza, Laureles, Manila         |
| Third-wave coffee culture | artisanal coffee focus             |
| Brunch/food quality       | pastries, breakfast                |
| Local reputation          | locals repeatedly recommend        |
| Digital nomad popularity  | remote work culture                |
| Roasting/farm story       | direct trade/family farms          |
| Quiet vs social energy    | productivity vs nightlife          |

---

# Strongest recurring cafés across sources

These appear repeatedly:

| Café                 | Why repeatedly recommended              |
| -------------------- | --------------------------------------- |
| Pergamino            | flagship specialty coffee + remote work |
| Rituales             | award-winning + social impact coffee    |
| Hija Mia             | aesthetic + relaxed + nomad favorite    |
| Café Velvet          | quiet + stylish + desserts              |
| Café Zeppelin        | coworking + brunch                      |
| Al Alma              | bakery + brunch + work                  |
| Revolución           | specialty coffee                        |
| Laboratorio del Café | coffee-focused enthusiasts              |
| Café Noir            | calm atmosphere                         |
| Typica               | specialty coffee culture                |

Sources repeatedly position Pergamino and Rituales as Medellín specialty coffee leaders. ([Latam Coffee Trip][1])

---

# What should EACH café listing contain

## Core structured data

| Field           | Why important    |
| --------------- | ---------------- |
| Name            | identity         |
| Neighborhood    | location context |
| Address         | maps/navigation  |
| Google Place ID | canonical source |
| Rating          | trust            |
| Review count    | confidence       |
| Hours           | utility          |
| Price level     | fit              |
| Website         | credibility      |
| Instagram       | social proof     |
| Maps URL        | navigation       |
| Photos          | visual trust     |
| Coordinates     | geo features     |

---

# AI intelligence fields

This is what makes mdeai unique.

| Field             | Example                                                        |
| ----------------- | -------------------------------------------------------------- |
| AI vibe summary   | “quiet minimalist specialty café popular among remote workers” |
| Best for          | remote work / brunch / dates                                   |
| Coffee style      | third-wave / espresso / pour-over                              |
| Crowd type        | locals / nomads / students                                     |
| Atmosphere        | cozy / social / calm                                           |
| Noise level       | quiet / medium / busy                                          |
| Work friendliness | 9/10                                                           |
| WiFi quality      | strong / moderate                                              |
| Seating quality   | laptop-friendly / limited                                      |
| Source mentions   | Eater + Medellin.com + Reddit                                  |
| AI match score    | 92/100                                                         |

---

# Instagram is VERY important

Especially for:

* aesthetics
* brunch cafés
* digital nomad appeal
* trend detection

You should store:

| Instagram data   | Why                     |
| ---------------- | ----------------------- |
| Handle           | discovery               |
| follower range   | popularity signal       |
| latest post date | freshness               |
| vibe tags        | aesthetic understanding |

Example:

```text id="jlwmtt"
@pergaminocafe
```

already appears repeatedly in guides. ([Latam Coffee Trip][1])

---

# What images should you include?

## Best image types

| Type                | Why                   |
| ------------------- | --------------------- |
| Hero exterior       | recognition           |
| Interior seating    | vibe/work suitability |
| Coffee closeups     | specialty quality     |
| Food/brunch         | conversion            |
| Outdoor seating     | atmosphere            |
| Workspace tables    | remote workers        |
| Latte art/pour-over | coffee credibility    |

---

# IMPORTANT image rule

Do NOT hotlink random copyrighted blog images.

Best strategy:

| Source               | Recommended |
| -------------------- | ----------- |
| Places API photos    | ✅ primary   |
| Official Instagram   | ✅ reference |
| User-uploaded future | ✅ ideal     |
| Blog screenshots     | ❌ avoid     |

Use:

```text id="8lcxuh"
Places API New photo references
```

through your secure proxy.

---

# What should go into pgvector?

This is where things become powerful.

---

# GOOD vector content

Embed:

| Content                   | Why                           |
| ------------------------- | ----------------------------- |
| AI vibe summaries         | semantic search               |
| Café personality          | “quiet industrial workspace”  |
| Article summaries         | captures qualitative opinions |
| Reddit recommendations    | captures real user sentiment  |
| Neighborhood descriptions | contextual recommendations    |
| “Best for” profiles       | recommendation quality        |
| Similarity descriptors    | “like Pergamino”              |

---

# BAD vector content

Do NOT embed:

```text id="bb5v1n"
rating: 4.7
address
hours
lat/lng
```

Those belong in SQL.

---

# Best recommendation examples

## User asks:

```text id="jl3uvz"
quiet cafés near nightlife
```

AI should combine:

* nightlife proximity
* quiet vibe
* coworking friendliness
* late opening hours
* review quality
* article mentions

NOT just:

```text id="pjhtxt"
Google rating
```

---

# Best AI ranking system

## Current

```text id="0ex1pd"
Google relevance
+
Google rating
```

---

# Better future

```text id="v2r2i8"
Google relevance
+
Places enrichment
+
semantic café vibe match
+
source mentions
+
review confidence
+
user preference fit
+
neighborhood context
```

---

# Example future card

```text id="h9uq5n"
Pergamino
★ 4.7 · 4,100 reviews

Best for:
Specialty coffee + remote work

Why recommended:
Featured in Eater and multiple Medellín coffee guides.
Known for high-quality beans, fast WiFi, and strong digital nomad atmosphere.

Tags:
Third-wave coffee
Laptop-friendly
Outdoor seating
Brunch
```

---

# Additional VERY valuable information

## Add these fields

| Field                     | Why powerful        |
| ------------------------- | ------------------- |
| “Best time to go”         | avoid crowds        |
| Sunlight/outdoor rating   | lifestyle fit       |
| Remote-work duration      | “good for 3+ hours” |
| Air conditioning          | useful in Medellín  |
| Power outlet availability | critical for nomads |
| Noise curve by hour       | advanced UX         |
| Nearby landmarks          | contextual search   |
| Nearby nightlife score    | social planning     |
| Brunch quality score      | food discovery      |
| Dessert/pastry quality    | café culture        |
| Signature drink           | uniqueness          |
| Roaster origin            | coffee enthusiasts  |
| Bean sourcing story       | authenticity        |

---

# Best UX direction

Do NOT make:

```text id="9bxm8z"
Google Maps clone
```

Build:

```text id="42mfhg"
AI lifestyle café discovery
```

The differentiation is:

* vibe
* semantic matching
* explainability
* local intelligence
* recommendation quality

---

# Best architecture

## Final recommended flow

```text id="uw2bn5"
Grounding Lite
→ café candidates

Places API New
→ photos/ratings/hours

Article intelligence
→ vibe + reputation

pgvector
→ semantic matching

mdeai scoring
→ personalized ranking

CopilotKit UI
→ explainable recommendations
```

---

# Most important next task

## MAP-024 — AI Café Scoring

Without this:

```text id="zj6p1o"
you only show Google rankings
```

With this:

```text id="7i9xxv"
mdeai becomes an intelligent café recommender
```

That is the real breakthrough.

[1]: https://latamcoffeetrip.com/cafes/pergamino-cafe?utm_source=chatgpt.com "Pergamino Café — Medellín | LATAM Coffee Trip"
