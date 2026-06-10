---
name: neighborhood-guide-creator
description: Build comprehensive, shareable neighborhood guides that showcase local expertise and help buyers connect emotionally with an area
metadata:
  version: "1.0"
  author: NextAutomation
---

# Neighborhood Guide Creator

Produce detailed, authentic neighborhood guides that combine lifestyle storytelling with practical data, designed to position you as the local expert and help buyers make informed location decisions.

## When to Use
- A buyer is choosing between two or more neighborhoods and needs a comparison
- Building a library of neighborhood content for your website or social media
- Preparing for a listing appointment to demonstrate area knowledge
- Creating a relocation packet for an out-of-town buyer
- Generating content for a geographic farming campaign
- A client asks "What's it like to live there?" and you want a thorough answer

## Input Required

| Field | Required | Description |
|-------|----------|-------------|
| `neighborhood_name` | Yes | Name of the neighborhood or area |
| `city_state` | Yes | City and state |
| `agent_knowledge` | No | Your personal observations, favorite spots, insider tips |
| `target_audience` | No | Who is the guide for: families, young professionals, retirees, investors |
| `property_context` | No | Specific listing address or price range context |
| `comparison_neighborhoods` | No | Other neighborhoods to compare against |
| `include_market_data` | No | Whether to incorporate pricing and market trend data |
| `format` | No | Full guide, social media series, listing insert, email newsletter |

## Process

### Step 1: Neighborhood Profile Framework
Build the guide using the PLACE framework, which ensures every guide covers the dimensions that matter most to buyers.

**The PLACE Framework:**

| Dimension | What It Covers | Why It Matters |
|-----------|---------------|----------------|
| **P**eople | Demographics, community character, who lives there | Buyers want to know if they will fit in |
| **L**ifestyle | Dining, shopping, recreation, nightlife, culture | Daily life experience beyond the house |
| **A**ccess | Commute, transit, walkability, highways, airport proximity | Practical logistics of daily life |
| **C**ost | Home prices, property taxes, HOA norms, cost of living | Financial feasibility |
| **E**nvironment | Schools, safety, parks, natural features, climate considerations | Family and quality-of-life factors |

### Step 2: Authenticity Layer
Every guide must include honest trade-offs and insider knowledge. Guides that read like tourism brochures destroy credibility. The goal is to sound like advice from a friend who lives there, not a marketing piece.

**Authenticity Requirements:**
- Include at least one genuine downside or trade-off
- Reference specific business names, not generic categories
- Mention seasonal variations (a neighborhood that is vibrant in May may be different in January)
- Acknowledge ongoing changes (development, gentrification, construction, infrastructure projects)
- Distinguish between "established" and "aspirational" -- if a neighborhood is improving, say so honestly

### Step 3: Data Integration
When market data is available, weave it naturally into the narrative rather than presenting raw tables. Buyers respond to context, not spreadsheets.

**Data Points to Include (when available):**

| Data Point | How to Present |
|-----------|---------------|
| Median home price | "Most homes here sell between $X and $Y, with the sweet spot around $Z" |
| Price per square foot | "You're paying about $X per square foot, which is [higher/lower] than [comparison area]" |
| Days on market | "Homes here sell [quickly/at a measured pace] -- typically within [X] weeks" |
| Year-over-year appreciation | "Values have [risen/held/softened] by about X% over the past year" |
| Property tax rate | "Expect property taxes around $X per year on a $Y home" |
| HOA prevalence | "Most [subdivisions/condos] have HOAs ranging from $X to $Y per month" |

### Step 4: Guide Generation
Produce the complete guide with all sections, tailored to the target audience.

### Step 5: Content Adaptation
If multiple formats are requested, adapt the core guide into platform-specific versions.

## Output Format

```
============================================
NEIGHBORHOOD GUIDE
============================================
[Neighborhood Name], [City, State]
Prepared by: [Agent Name]
Date: [Date]
Target Audience: [Audience type]

--- THE VIBE ---
[2-3 sentences capturing the feel of the neighborhood. What would you tell a friend who asked "So what's it actually like?" Answer that question.]

--- BEST FOR ---
[Who thrives here and why. Be specific: "Dual-income couples in their 30s who want walkability but aren't ready to give up a backyard" is better than "young professionals."]

--- HOME TYPES AND PRICING ---
[What's available: architectural styles, lot sizes, age of housing stock, price ranges by tier. Include context for what the money gets you.]

Housing Stock Overview:
| Type | Typical Price Range | Typical Size | Availability |
|------|-------------------|--------------|-------------|
| [Type] | $XXX-$XXX | X-X sqft | [Common/Limited/Rare] |

--- TOP 5 SPOTS ---
[Specific restaurants, cafes, parks, shops, or venues that define the area. Not the obvious tourist spots -- the places that locals actually go to regularly.]

1. [Name] -- [One sentence on what it is and why it matters]
2. [Name] -- [One sentence]
3. [Name] -- [One sentence]
4. [Name] -- [One sentence]
5. [Name] -- [One sentence]

--- SCHOOLS OVERVIEW ---
(If applicable)
| School | Type | Grades | Rating | Notes |
|--------|------|--------|--------|-------|
| [Name] | Public/Private/Charter | K-5/6-8/9-12 | X/10 | [One-line note] |

[Context paragraph: What do parents actually think? Are the ratings reliable? Are there notable programs?]

--- GETTING AROUND ---
Walk Score: [X/100] | Bike Score: [X/100] | Transit Score: [X/100]

[Practical commute information]
| Destination | Drive Time | Transit Time | Notes |
|-------------|-----------|-------------|-------|
| Downtown | XX min | XX min | [Peak vs. off-peak] |
| Airport | XX min | XX min | [Best route] |
| Major Employer Hub | XX min | XX min | [If relevant] |

[Parking situation, road conditions, upcoming transit projects]

--- THE TRADE-OFFS ---
[Honest downsides. This section builds more trust than any other part of the guide. Include 2-4 genuine trade-offs with context.]

1. [Trade-off]: [Explanation and how residents deal with it]
2. [Trade-off]: [Explanation]
3. [Trade-off]: [Explanation]

--- LOCAL SECRETS ---
[1-2 things that only residents know. Not available on Yelp's front page. The kind of tip that makes someone say "I didn't know that."]

--- WHAT'S CHANGING ---
[Current development projects, zoning changes, new businesses opening, infrastructure improvements, or neighborhood trajectory. Buyers want to know where the area is heading, not just where it is today.]

--- MARKET SNAPSHOT ---
(If market data provided)
| Metric | Current | Trend |
|--------|---------|-------|
| Median Price | $XXX,XXX | [Direction] |
| Avg DOM | XX days | [Direction] |
| Inventory | XX homes | [Direction] |
| YoY Appreciation | X.X% | [Direction] |

============================================
```

## Methodology

### The PLACE Framework (Proprietary)
The PLACE framework was developed to address the most common gap in real estate marketing: neighborhood guides that cover amenities but miss the factors that actually determine whether a buyer will be happy living in a location. Academic research on residential satisfaction (Amerigo & Aragones, 1997; Galster & Hesser, 1981) consistently identifies five factors that predict long-term satisfaction: social fit (People), daily experience (Lifestyle), practical logistics (Access), affordability alignment (Cost), and environmental quality (Environment).

### Walk Score Methodology
Walk Score (walkscore.com) uses a patented algorithm that measures the distance to nearby amenities across multiple categories: grocery, restaurants, shopping, coffee, banks, parks, schools, books, and entertainment. Scores range from 0-100:

| Score | Classification | What It Means |
|-------|---------------|---------------|
| 90-100 | Walker's Paradise | Daily errands do not require a car |
| 70-89 | Very Walkable | Most errands can be accomplished on foot |
| 50-69 | Somewhat Walkable | Some errands can be accomplished on foot |
| 25-49 | Car-Dependent | Most errands require a car |
| 0-24 | Almost All Errands Require a Car | Minimal infrastructure within walking distance |

Walk Score is a useful proxy but has limitations: it does not account for sidewalk quality, pedestrian safety, terrain (hills), or weather. Always supplement with personal observation.

### GreatSchools Rating Context
GreatSchools ratings (1-10) are the most commonly referenced school quality metric in real estate. However, agents should understand the methodology to advise clients accurately:

- Ratings are based primarily on standardized test scores
- They do not capture arts programs, special education quality, school culture, or extracurricular offerings
- Schools serving higher-poverty populations are structurally disadvantaged in the rating system
- A school rated 6/10 with strong parent involvement and diverse programming may be a better fit than a 9/10 that focuses narrowly on test preparation

Always present ratings with context, not as a standalone verdict.

### Neighborhood Lifecycle Model
Every neighborhood moves through a lifecycle that affects property values, community character, and investment potential:

| Stage | Characteristics | Investment Implication |
|-------|----------------|----------------------|
| Decline | Disinvestment, vacancy, deferred maintenance | Highest risk, highest potential return |
| Stabilization | Community organizing, first-mover renovations, artist/creative influx | Early-stage opportunity; gentrification debates begin |
| Revitalization | New businesses opening, rising prices, media attention, infrastructure investment | Rapid appreciation phase; affordability declining |
| Maturity | Established desirability, stable prices, fully developed amenities | Low risk, moderate returns, lifestyle premium |
| Plateau/Transition | Price ceiling reached; younger demographics priced out; potential for next cycle | Watch for stagnation signals vs. sustained demand |

Identify where the neighborhood sits in this lifecycle and note it in the guide. Buyers and investors have fundamentally different interests depending on the stage.

## Advanced Configuration

| Parameter | Default | Options | Description |
|-----------|---------|---------|-------------|
| `guide_length` | `full` | `full`, `condensed`, `social_series` | Output format and length |
| `tone` | `conversational` | `conversational`, `professional`, `luxury`, `relocation_packet` | Voice and formality |
| `include_market_data` | `true` | `true`, `false` | Whether to include pricing and trend data |
| `include_schools` | `auto` | `auto`, `yes`, `no` | Auto-detects based on neighborhood type |
| `comparison_format` | `none` | `none`, `side_by_side`, `narrative` | How to present comparisons |
| `seasonal_focus` | `none` | `none`, `spring`, `summer`, `fall`, `winter` | Highlight seasonal characteristics |
| `investment_angle` | `false` | `true`, `false` | Include rental yield and investor-relevant data |
| `photo_shot_list` | `false` | `true`, `false` | Generate a recommended photography list for the guide |

## Example

### Input
```
neighborhood_name: Montrose
city_state: Houston, TX
agent_knowledge: Very artsy, amazing food scene, close to museum district, lots of bungalows and townhomes. Parking can be rough on weekends. Some flooding concerns. I love recommending Uchi and Underbelly Hospitality restaurants.
target_audience: Young professional couple relocating from Austin
include_market_data: true
```

### Output
```
============================================
NEIGHBORHOOD GUIDE
============================================
Montrose, Houston, TX
Prepared by: [Agent Name]
Date: 2026-01-25
Target Audience: Young professional couple relocating from Austin

--- THE VIBE ---
Montrose is Houston's creative conscience -- eclectic, walkable by Houston standards, and unapologetically itself. Tattoo parlors share walls with James Beard-nominated restaurants. A 1920s bungalow sits next to a glass-and-steel townhome, and nobody questions it. If Austin's South Congress had a Houston cousin with more diversity and less self-awareness, this is it.

--- BEST FOR ---
Creative professionals, dual-income couples without kids (or with one), food obsessives, and anyone who chose Houston because of the culture but wants to live somewhere that doesn't feel like a suburb. If you value walkability, independent businesses, and a neighborhood with strong opinions, Montrose is your match. If you need a large yard, a quiet cul-de-sac, or easy freeway access during rush hour, look elsewhere.

--- HOME TYPES AND PRICING ---
Montrose's housing stock is a study in contrasts. Original 1920s-1950s bungalows and cottages sit alongside modern townhome developments built from 2010 onward. The bungalows offer character and generous lots but require maintenance budgets. The townhomes offer turnkey living and rooftop decks but trade yard space for vertical square footage.

| Type | Typical Price Range | Typical Size | Availability |
|------|-------------------|--------------|-------------|
| Original Bungalow (unrenovated) | $350K-$500K | 1,200-1,800 sqft | Limited -- being demolished for townhome lots |
| Renovated Bungalow | $550K-$800K | 1,400-2,200 sqft | Moderate -- high demand |
| Modern Townhome (interior lot) | $425K-$600K | 1,600-2,200 sqft | Common |
| Modern Townhome (end unit/corner) | $550K-$750K | 1,800-2,600 sqft | Moderate |
| Mid-Rise Condo | $275K-$500K | 900-1,500 sqft | Common |
| Luxury New Construction | $800K-$1.5M+ | 2,500-4,000 sqft | Limited |

Coming from Austin, you will find that your dollar goes further in Montrose than it would in Zilker or Travis Heights, but the gap has narrowed significantly since 2022.

--- TOP 5 SPOTS ---
1. **Uchi Houston** -- Tatsu Aichi's omakase and cold dishes are worth every dollar. Sit at the bar if you can. This is a "treat yourself" spot, not a Tuesday dinner.
2. **Underbelly Hospitality (Georgia James / UB Preserv)** -- Chris Shepherd's restaurant group defines Houston's modern food identity. Georgia James for steak, UB Preserv for adventurous dining.
3. **The Menil Collection** -- Free. World-class. Never crowded on a Tuesday morning. The Rothko Chapel is across the lawn and equally essential. Locals treat these like their personal art galleries.
4. **Anvil Bar & Refuge** -- The cocktail bar that put Houston on the national cocktail map. No menu gimmicks, just excellent drinks and bartenders who know what they're doing.
5. **Buffalo Bayou Park** -- 160 acres of trails, public art, and kayak launches along the bayou. The Johnny Steele Dog Park is the social hub for Montrose dog owners. Saturday mornings here feel like a neighborhood block party.

--- SCHOOLS OVERVIEW ---
| School | Type | Grades | Rating | Notes |
|--------|------|--------|--------|-------|
| Poe Elementary | Public (HISD) | PK-5 | 7/10 | Strong magnet program; highly sought-after; zoning matters |
| Lanier Middle School | Public (HISD) | 6-8 | 5/10 | Mixed reviews; many Montrose families go private at this stage |
| Lamar High School | Public (HISD) | 9-12 | 6/10 | Large school with strong athletics and arts; IB program available |
| St. Stephen's Episcopal | Private | PK-8 | N/A | Popular Montrose private option; waitlist common |
| The Kinkaid School | Private | PK-12 | N/A | Top-tier Houston private school; 20-minute drive from Montrose |

Honest take: Elementary is strong at Poe, but middle and high school options are where Montrose families diverge. Many stay in HISD and are happy; others transition to private schools around 6th grade. If schools are a top priority and you want a guaranteed 9/10 public school K-12 pipeline, neighborhoods like Bellaire or Memorial offer that at a higher price point.

--- GETTING AROUND ---
Walk Score: 78/100 (Very Walkable) | Bike Score: 72/100 | Transit Score: 43/100

| Destination | Drive Time | Transit Time | Notes |
|-------------|-----------|-------------|-------|
| Downtown Houston | 10 min | 25 min (METRORail) | Wheeler Station is in Montrose |
| Texas Medical Center | 12 min | 20 min (METRORail) | Direct rail line |
| Galleria/Uptown | 15 min | 35+ min | Better by car |
| IAH Airport | 35 min | Not practical | Use I-45 N; factor traffic |
| Hobby Airport | 25 min | Not practical | 610 to I-45 S |
| Energy Corridor | 30-40 min | Not practical | This is the commute that burns out Montrose residents |

Montrose is one of the few Houston neighborhoods where you can realistically walk to dinner, coffee, and groceries. That said, this is still Houston -- you will need a car for most non-neighborhood errands. Street parking is manageable on weekdays. Weekends near Westheimer and Montrose Blvd are a different story -- plan to walk or rideshare.

Coming from Austin: the METRORail will feel limited compared to what you're used to, but the Montrose stop makes downtown and Medical Center commutes genuinely car-optional.

--- THE TRADE-OFFS ---
1. **Flooding**: This is the one you have to take seriously. Parts of Montrose are in or near FEMA flood zones. Some streets flood during heavy rain events even outside the 100-year floodplain. Always check FEMA maps at the property level, ask for flood disclosure history, and budget for flood insurance ($1,200-$3,000/year depending on elevation). Some blocks are perfectly fine; others are not. This is a street-by-street conversation, not a neighborhood-wide verdict.

2. **Parking on Weekends**: Westheimer and lower Montrose Blvd become parking nightmares on Friday and Saturday nights. If your home is on one of these corridors, weekend noise and parking competition are real. Side streets one to two blocks off the main roads are dramatically calmer.

3. **Older Home Maintenance**: If you buy a bungalow, budget 1-2% of the home's value annually for maintenance. Foundation issues (Houston clay soil), aging plumbing (galvanized pipes in pre-1970 homes), and HVAC demands (Houston summers are relentless) are the three biggest cost centers. Get a thorough inspection and a sewer scope before closing.

4. **Construction and Density**: The neighborhood is actively densifying. Empty lots and bungalow teardowns are becoming 3-story townhome rows. If you fall in love with a quiet street, check whether the vacant lot next door has development permits filed. The city planning portal (HoustonPermits.org) will show pending applications.

--- LOCAL SECRETS ---
The Menil Collection bookstore has one of the best curated gift sections in Houston. It is where locals buy birthday presents when they want something thoughtful and unexpected. The bookstore alone is worth the visit.

There is an informal Tuesday night bike ride that starts at Avant Garden (a bar on Dunlavy) and loops through the neighborhood. It is not advertised online. Show up with a bike around 8 PM and you will find it.

--- WHAT'S CHANGING ---
- The Innovation Corridor along Midtown's edge is bringing new mixed-use development that will increase walkable density between Montrose and downtown
- Several restaurant groups have announced 2026 openings along lower Westheimer, continuing the area's food dominance
- METRO's University Line (long-planned BRT route) would run through Montrose if funded -- this has been discussed for years but would materially improve transit access if built
- Property values have appreciated 6-8% annually since 2021, with some signs of moderation in late 2025. The neighborhood is firmly in the "maturity" stage of its lifecycle -- established desirability with stable long-term value

--- MARKET SNAPSHOT ---
| Metric | Current (Jan 2026) | Trend |
|--------|-------------------|-------|
| Median Price (SFH) | $585,000 | Stable (+2.1% YoY) |
| Median Price (Townhome) | $475,000 | Up (+4.8% YoY) |
| Avg DOM | 22 days | Slightly increasing |
| Active Inventory | 85 homes | Up from 68 last year |
| YoY Appreciation | 3.2% (blended) | Moderating from 6.8% in 2024 |

============================================
```

## Edge Cases and Best Practices

**Neighborhoods You Do Not Know Well**: When you lack personal knowledge of an area, be transparent. State: "This guide is based on market data and publicly available information. For personal insights, I recommend connecting with an agent who specializes in [neighborhood]." Never fabricate local knowledge.

**Gentrifying Areas**: Handle gentrification with honesty and respect. Acknowledge the tension between new investment and displacement. Avoid language that celebrates rising prices without acknowledging who is affected. Frame the situation factually: "Home values have risen X% over Y years, which has changed the neighborhood's demographics and character."

**Rural or Suburban Areas Without Walk Score Data**: For areas where Walk Score is not meaningful (rural, exurban), replace the walkability section with "Quality of Life Infrastructure" covering: nearest grocery, hospital, school bus routes, internet availability, and road maintenance quality. These are the practical factors that determine daily life in non-urban areas.

**Seasonal Guides**: If the guide is for a specific season (e.g., a winter relocation from a northern state to a southern one), emphasize seasonal factors: summer heat management, hurricane preparedness, seasonal flooding patterns, or winter activity options. What is appealing in October may be challenging in August.

**Investment-Focused Guides**: When the audience is an investor rather than an owner-occupant, replace lifestyle language with yield language. Instead of "Top 5 Spots," present "Tenant Demand Indicators." Instead of "The Vibe," present "Neighborhood Lifecycle Stage and Appreciation Trajectory."

**Comparison Format**: When comparing two or more neighborhoods, use a structured side-by-side format for quantitative factors and a narrative format for qualitative differences. End with a clear recommendation: "If your top priority is X, choose Neighborhood A. If your top priority is Y, choose Neighborhood B."

## Integration

This skill pairs with:
- **Property Description Generator** -- Embed a neighborhood summary into listing descriptions for added context
- **Market Analysis Reporter** -- Pull market data directly into the Market Snapshot section
- **Client Follow-Up Scheduler** -- Send neighborhood guides to active buyers as a value-add touchpoint
- **Lead Qualifier Agent** -- Use neighborhood guides as the value-offer in first-contact outreach for buyer leads
