[![Medellin Coffee Farm Tour (2025) - All You MUST Know Before You Go (w ...](https://tse1.mm.bing.net/th/id/OIP.3WvGd1v5-LqqkA99NCQUIwHaFj?pid=Api)](https://www.tripadvisor.com.au/Attraction_Review-g297478-d14009783-Reviews-Medellin_Coffee_Farm_Tour-Medellin_Antioquia_Department.html?utm_source=chatgpt.com)

## Medellín Coffee Tour dataset draft

| Rank | Listing                                            | Area                           | Why it belongs                                                                                                                                                     | Best for                                                 | Confidence |
| ---: | -------------------------------------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------- | ---------: |
|    1 | Medellín Coffee Farm Tour / Urban Coffee Tour      | Barrio La Sierra               | Strongest La Sierra signal: farm-to-cup, cable car/trolley route, community transformation story, 5-star style reputation across marketplaces. ([GetYourGuide][1]) | authentic local tour, social impact, first-time visitors |         96 |
|    2 | La Casa Grande Coffee Hacienda                     | Santa Elena / outside Medellín | Historic 1800s hacienda, farm experience, lunch, tasting, English/Spanish tour, strong official site. ([La Casa Grande][2])                                        | heritage finca, families, scenic day trip                |         95 |
|    3 | Tour de Café Corazón de León                       | Medellín                       | Official site confirms farm coffee tour, barismo, hiking, groups, two daily reserved tours. ([Coffee Tour Medellin][3])                                            | farmstay, hiking, groups                                 |         91 |
|    4 | Coffee Tour Medellín / Expedition Colombia         | Near Medellín                  | Hands-on half-day farm tour about 45 minutes from Medellín: harvest, coffee process, farm walk. ([Expedition Colombia][4])                                         | cultural coffee basics, tourists                         |         89 |
|    5 | Proyecto Renacer / Cafés Renacer                   | La Sierra                      | Micro-washed station / coffee-tour project tied to La Sierra and family coffee story. Needs deeper Maps verification. ([Instagram][5])                             | social impact, community coffee                          |         86 |
|    6 | Café Atardecer / Tour Cafetero                     | Medellín / Palmitas references | Family coffee-farming story, plant-to-cup experience, Instagram + Tripadvisor presence. ([Instagram][6])                                                           | sunset/scenic, family-run                                |         84 |
|    7 | Beyond Colombia Santa Elena Coffee Farm Experience | Santa Elena                    | Structured farm/tasting tour in Santa Elena, English/Spanish, scenic mountain context. ([Beyond Colombia Free Tours][7])                                           | English-speaking visitors, Santa Elena                   |         82 |
|    8 | LandVenture Coffee Tours                           | Medellín / Antioquia           | Private-tour operator with coffee-tour category; needs listing-level verification. ([LandVenture Travel][8])                                                       | private/custom tours                                     |         76 |
|    9 | Café Relevo                                        | Santa Elena                    | Specialty coffee farm in Santa Elena with coffee tours on Instagram; needs full website/Places check. ([Instagram][9])                                             | specialty coffee, farm visit                             |         74 |
|   10 | Artisan Coffee Tours                               | Antioquia                      | Appears in Maps-style list but weak public verification from search. Keep as “needs verification.”                                                                 | hidden/local option                                      |         55 |

## What each listing should include

| Section  | Fields                                                                        |
| -------- | ----------------------------------------------------------------------------- |
| Core     | name, slug, place_id, address, lat/lng, Maps URL, phone, website, Instagram   |
| Tour     | duration, price, pickup, language, group size, booking URL                    |
| Coffee   | farm type, harvest activity, roasting, brewing, tasting, bean story           |
| Trust    | rating, review count, source URLs, source confidence, duplicate-name check    |
| AI       | vibe summary, best for, not best for, authenticity score, social impact score |
| pgvector | embedding text, intent tags, semantic descriptors                             |

## Suggested scoring

```text
Coffee Tour Score /100 =
25 rating + reviews
20 authenticity / real farm experience
15 verified sources
15 social impact / local story
10 distance / map fit
5 language fit
5 price / duration fit
5 availability / booking confidence
```

## Example embedding text

```text
Authentic community-focused coffee farm tour in Barrio La Sierra with hands-on harvesting, coffee tasting, cable car access, Medellín hillside views, local family guides, social impact story, and beginner-friendly coffee education.
```

## Best MVP move

Start with **Urban Coffee Tour / La Sierra**, **La Casa Grande**, **Corazón de León**, **Proyecto Renacer**, and **Café Atardecer**. These have the strongest mix of Maps presence, official/social sources, and clear tour differentiation.

[1]: https://www.getyourguide.com/medellin-l1215/urban-coffee-tour-in-barrio-la-sierra-t518636/?utm_source=chatgpt.com "Medellín Coffee Farm Tour with Trolley and Cable Car Ride"
[2]: https://www.lacasagrandecoffeehacienda.com/?utm_source=chatgpt.com "La Casa Grande Coffee Hacienda"
[3]: https://cafecorazondeleon.com/?utm_source=chatgpt.com "Tour del café en medellín - Coffee Tour Medellin"
[4]: https://expeditioncolombia.com/coffee-tour-medellin/?utm_source=chatgpt.com "Coffee Tour Medellin: Colombian Cultural Half Day ..."
[5]: https://www.instagram.com/cafes.renacer/?utm_source=chatgpt.com "PROYECTO RENACER (@cafes.renacer)"
[6]: https://www.instagram.com/atardecer_cafe/?utm_source=chatgpt.com "Tour Cafetero/Coffe Tours (@atardecer_cafe)"
[7]: https://www.beyondcolombia.com/tours/48-coffee-tour-medellin-farm-santa-elena?locale=en&utm_source=chatgpt.com "Coffee Farm Experience in Santa Elena - Tour"
[8]: https://landventuretravel.co/?utm_source=chatgpt.com "▷ LandVenture Travel Agency Medellín and Antioquia Tours"
[9]: https://www.instagram.com/caferelevo/?utm_source=chatgpt.com "café relevo (@caferelevo) · Santa Elena"
