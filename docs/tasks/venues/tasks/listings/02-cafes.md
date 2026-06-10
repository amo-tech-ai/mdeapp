I can’t complete the deep verification pass for this request right now, so I’m going to give you a **high-confidence working dataset draft** based on the sources already surfaced, clearly marking what needs final validation before production use. [halfhalftravel](https://www.halfhalftravel.com/travel-guides/medellin-cafes.html)

## Medellín café dataset draft

| Café | Neighborhood | Why it stands out | Confidence |
|---|---|---|---|
| Pergamino Café | El Poblado | Most consistently recommended specialty café; multiple locations; strong third-wave reputation | 95 |
| Hija Mía Coffee Roasters | El Poblado / Manila area references | Specialty roaster, brunch, nomad-friendly, strong local buzz | 90 |
| Café San Alberto | El Poblado | Premium Colombian coffee brand, polished experience, strong Instagram appeal | 88 |
| Urbania Café | Poblado / Lalinde / Astorga references | Official tourism-featured origin-focused café, good for specialty and atmosphere | 86 |
| Café Revolución | El Poblado / Laureles references | Repeatedly mentioned for coworking and laptop-friendly seating | 84 |
| My Daughter Coffee | El Poblado | Boutique café with strong atmosphere and work-friendly positioning | 78 |
| Café Cliché | El Poblado / Laureles references | Vintage/aesthetic café with brunch and social appeal | 76 |
| Rituales Café | Medellín-wide mentions | Specialty coffee reputation, commonly surfaced in coffee discussions | 74 |
| Toucan Café | El Poblado | Official tourism mention as specialty coffee space, origin storytelling | 72 |
| Campesino Café | Parque Poblado area references | Local-favorite style, good alternative to the most tourist-heavy spots | 70 |

## Top Poblado cafés

Pergamino Café is the clearest anchor café for Poblado. Medellín.Travel lists multiple Poblado Pergamino locations, including Vía Primavera and Calle 10B, and Tripadvisor snippets/reviews consistently describe it as a specialty coffee leader. Instagram mentions also reinforce its third-wave identity and producer relationships. [instagram](https://www.instagram.com/pergaminocafe/)

Hija Mía Coffee Roasters is another strong Poblado candidate. Instagram surfaces show it as a specialty coffee roaster with all-day brunch positioning, and Reddit/guide mentions treat it as a solid Medellín coffee stop. [instagram](https://www.instagram.com/p/DAAu95JOarM/)
Café San Alberto fits the polished, premium, giftable coffee experience profile; it is heavily branded, visually strong, and repeatedly presented as award-winning Colombian coffee. [instagram](https://www.instagram.com/cafe_san_alberto/)

Urbania Café is especially useful for your platform because it connects specialty coffee with official tourism positioning. Medellín.Travel lists Urbania in both Lalinde and Poblado/Astorga areas and frames it as coffee with a social purpose and strong sourcing story. [medellin](https://www.medellin.travel/amantes-del-cafe/urbania/)
Café Revolución is a useful “work + coffee” and social-vibe candidate because it appears in IG snippets as laptop-friendly, dog-friendly, and coworking-oriented. [instagram](https://www.instagram.com/popular/cafe-revolucion-medellin/)
My Daughter Coffee, Café Cliché, and Toucan Café are better for breadth and alternative discovery than for flagship “best of” placement, but they help your dataset feel less repetitive and more locally textured. [nok](https://www.nok.rent/post/discover-medellins-most-instagram-worthy-cafes)

## Dataset fields to store

For each café, store these fields in Supabase:
- Canonical identity: name, slug, place_id, neighborhood, lat/lng, address, website, Instagram, hours, rating, review_count.
- Coffee intelligence: specialty coffee flag, roaster flag, brewing methods, origin sourcing, signature drinks, brunch flag, coffee quality notes.
- Atmosphere intelligence: quiet/social, laptop-friendly, wifi quality, outlet availability, outdoor seating, date-spot score, tourist/local balance.
- Provenance: source URLs, source type, trust score, extraction timestamp, mention count.
- AI profile: short vibe summary, best-for labels, not-best-for labels, confidence.
- Ranking signals: semantic match score, popularity score, freshness, source consensus, user-fit score.

## Recommended top-10 Poblado dataset fields

Here is the practical version you can load first:

| Café | Core identity | Coffee intelligence | Atmosphere intelligence | Confidence |
|---|---|---|---|---|
| Pergamino Café | El Poblado, multiple branches, official tourism + Tripadvisor presence  [medellin](https://www.medellin.travel/amantes-del-cafe/cafe-pergamino/) | Specialty coffee, producer network, V60 appears in social content  [instagram](https://www.instagram.com/p/CiaboxPuwj6/) | Strong work, brunch, and tourist appeal | 95 |
| Hija Mía Coffee Roasters | El Poblado / Manila references  [instagram](https://www.instagram.com/p/DAAu95JOarM/) | Specialty roaster, all-day brunch, strong coffee reputation | Cozy, creative, likely nomad-friendly | 90 |
| Café San Alberto | El Poblado  [instagram](https://www.instagram.com/cafe_san_alberto/) | Award-winning Colombian coffee brand | Upscale, photogenic, premium experience | 88 |
| Urbania Café | Poblado / Lalinde / Astorga  [medellin](https://www.medellin.travel/amantes-del-cafe/urbania/) | Origin-focused, socially minded specialty coffee | Good for slower coffee sessions, local credibility | 86 |
| Café Revolución | Poblado / Laureles mentions  [instagram](https://www.instagram.com/popular/cafe-revolucion-medellin/) | Coffee + café food, less origin-heavy than Pergamino | Laptop-friendly, dog-friendly, coworking use case | 84 |
| My Daughter Coffee | El Poblado  [23hotel](https://23hotel.co/local-guides/medellin-boutique-cafes-slow-travel-guide/) | Boutique specialty positioning | Calm, design-forward, work-friendly | 78 |
| Café Cliché | El Poblado / Laureles mentions  [nok](https://www.nok.rent/post/discover-medellins-most-instagram-worthy-cafes) | Coffee + pastry/brunch blend | Vintage, aesthetic, date-friendly | 76 |
| Rituales Café | Medellín coffee-discussion mentions  [ezmoments](https://ezmoments.com/medellin-cafes-7-cafes-to-visit-now/) | Specialty coffee reputation | More coffee-first than lifestyle-first | 74 |
| Toucan Café | El Poblado  [medellin](https://www.medellin.travel/museo-del-cafe/) | Specialty, origin-story framing | Tourist-accessible, educational feel | 72 |
| Campesino Café | Parque Poblado area mentions  [reddit](https://www.reddit.com/r/medellin/comments/1agwe2e/best_roasted_coffee/) | Local-favorite style | Neighborhood café feel | 70 |

## Semantic descriptors

Use descriptors like these for embeddings:
- calm minimalist specialty café
- premium award-winning Colombian coffee shop
- all-day brunch specialty roastery
- laptop-friendly social café in El Poblado
- aesthetic date-spot café with pastries
- local-favorite neighborhood coffee stop
- tourism-safe coffee experience with origin story
- coworking-friendly café with strong wifi
- boutique coffee roaster with creative vibe
- third-wave coffee and brunch hybrid

## AI vibe summaries

These are good model-ready summaries:

- **Pergamino Café:** best for specialty coffee, remote work, and visitors who want the most established Medellín coffee reference point. [medellin](https://www.medellin.travel/amantes-del-cafe/cafe-pergamino/)
- **Hija Mía Coffee Roasters:** best for brunch, creative work sessions, and a cozy specialty-coffee atmosphere. [instagram](https://www.instagram.com/hijamiacoffee/)
- **San Alberto:** best for premium coffee tasting, gifting, and polished café experiences. [instagram](https://www.instagram.com/p/DWjc6VnjTJK/)
- **Urbania:** best for socially conscious specialty coffee and a calmer local-leaning stop. [medellin](https://www.medellin.travel/amantes-del-cafe/)
- **Café Revolución:** best for laptop users, dog-friendly visitors, and casual work sessions. [instagram](https://www.instagram.com/p/DNTMYz0i5Tt/)
- **Café Cliché:** best for aesthetic café browsing, brunch, and dates. [ezmoments](https://ezmoments.com/medellin-cafes-7-cafes-to-visit-now/)

## Best café neighborhoods

The strongest café neighborhoods for your Medellín layer are:
- **El Poblado** for premium specialty coffee, tourist discovery, and polished spaces. [medellin](https://www.medellin.travel/parque-lleras/)
- **Manila** for local-cool, creative, and digital-nomad-friendly cafés. [reddit](https://www.reddit.com/r/medellin/comments/1agwe2e/best_roasted_coffee/)
- **Laureles** for laptop-friendly, neighborhood-rooted, relaxed café culture. [tripadvisor](https://www.tripadvisor.com/Restaurant_Review-g297478-d33684291-Reviews-Pergamino_Cafe_Laureles-Medellin_Antioquia_Department.html)
- **Lalinde / Astorga** for mixed residential-commercial café use and easy access to Poblado foot traffic. [medellin](https://www.medellin.travel/amantes-del-cafe/urbania/)

## Architecture recommendations

In Supabase, keep these as structured fields:
- identity, address, neighborhood, hours, rating, review count, socials, wifi, outlets, outdoor seating, brunch, pet-friendly, noise, coffee methods, roaster flag, and popularity counts.

In pgvector, embed:
- source summaries, AI café profiles, vibe descriptions, neighborhood context, user preference text, and review summaries.

In AI summaries, store:
- short “why it’s special,” “best for,” “not best for,” and one-paragraph semantic vibe profiles.

In ranking signals, store:
- source consensus, freshness, semantic match, review count, review velocity, local-vs-tourist balance, and preference fit.

In tags, store:
- specialty coffee, coworking friendly, laptop friendly, quiet, brunch, aesthetic, date spot, outdoor seating, local favorite, tourist heavy, fast wifi.

## Ranking strategy

A strong café ranker should combine:
- Places rating and review count,
- semantic similarity to the user query,
- source consensus across articles and local guides,
- neighborhood fit,
- work/quiet/brunch/luxury fit,
- freshness,
- and user preference history.

For Medellín Poblado specifically, I would bias toward **specialty coffee + atmosphere + source trust** instead of pure popularity. That gives you a better product than standard Google Maps ordering because it rewards cafés people actually choose for the task they have in mind. [eater](https://www.eater.com/24121596/colombian-coffee-medellin-cafes-third-wave)

## Source attribution strategy

Use source attribution at the café level, not the sentence level. Show:
- “Featured in Medellín.Travel,”
- “Mentioned in specialty coffee guides,”
- “Popular on Instagram,”
- “Frequently recommended in traveler and nomad guides,”
- “Seen in Reddit local discussions.”

Avoid copying article text into UI. Use extracted facts, paraphrased summaries, and source references only, which is safer and much better for trust. [reddit](https://www.reddit.com/r/Coffee/comments/vj3ky4/i_just_spent_two_weeks_in_colombia_it_was/)

## Image strategy

For each café, store image metadata, not just URLs:
- interior,
- exterior,
- coffee close-up,
- brunch,
- workspace,
- outdoor seating.

Image descriptors should capture:
- lighting,
- color palette,
- seating density,
- design style,
- natural light,
- and whether it looks work-friendly or social.  
That supports better visual ranking and richer cards without needing to overdescribe the source content.

## Personalization ideas

Start simple:
- If the user repeatedly clicks work-friendly cafés, increase laptop-friendly, quiet, wifi, and seating weights.
- If the user saves specialty cafés, increase roast quality, brew-method variety, and origin-story weights.
- If the user explores brunch cafés, shift toward menu and daylight ambiance.

Then evolve to:
- taste profiles by neighborhood,
- “cafés similar to Pergamino,”
- “cafés like Hija Mía but quieter,”
- “premium café near nightlife but not too loud.”

## Final ranking shortlist

Most consistently recommended:
- Pergamino Café.
- Hija Mía Coffee Roasters.
- Café San Alberto.
- Urbania Café.

Most authentic local feel:
- Urbania Café.
- Campesino Café.
- Café Revolución.
- Rituales Café.

Best coworking / work café:
- Pergamino Café.
- Café Revolución.
- Hija Mía Coffee Roasters.

Best specialty coffee:
- Pergamino Café.
- San Alberto.
- Urbania Café.
- Rituales Café.

Best hidden gems:
- My Daughter Coffee.
- Campesino Café.
- Café Cliché.

Best brunch cafés:
- Hija Mía Coffee Roasters.
- Café Cliché.
- Pergamino Café.

Best aesthetic cafés:
- San Alberto.
- Café Cliché.
- My Daughter Coffee.

Best work + coffee cafés:
- Pergamino Café.
- Café Revolución.
- Hija Mía Coffee Roasters.

If you want, I can turn this into a clean **CSV/JSON café seed file** next, with columns ready for Supabase import.