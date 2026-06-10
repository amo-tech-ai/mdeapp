# El Poblado Café Directory — Top 10 Draft

**Important:** this is a research-backed draft. For production, verify each café with **Google Places API New** for live rating, hours, placeId, photos, and exact Maps URL.

| #  | Café                           | Why it belongs                                                                                                                                 | Best for                                     | Web/social verified                                                | Confidence |
| -- | ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- | ------------------------------------------------------------------ | ---------: |
| 1  | **Pergamino Calle 10B**        | Iconic El Poblado specialty café; official page describes it as creative, retro, dynamic, and good for local/international nomads.             | specialty coffee, work, first-time visitors  | Official store page + Instagram found. ([PERGAMINO | COLOMBIA][1]) |         98 |
| 2  | **Hija Mía Coffee Roasters**   | Manila roaster/café; official site says “the best coffee in Medellín,” with daily hours and address.                                           | remote work, flat white, brunch              | Official site + Instagram found. ([Hija Mía][2])                   |         96 |
| 3  | **Urbania Café**               | Colombian specialty coffee brand with social/environmental mission; Poblado locations verified on official site.                               | specialty coffee, quiet work, ethical coffee | Official site + Instagram found. ([Urbania Café][3])               |         95 |
| 4  | **Café Velvet**                | Via Primavera café; TripAdvisor lists brunch, outdoor seating, free WiFi, service, and location.                                               | quiet work, brunch, aesthetic café           | TripAdvisor + Instagram found. ([Tripadvisor][4])                  |         94 |
| 5  | **Café Noir**                  | Luxury café/bar lounge in El Poblado; official site positions it as sophisticated with cocktails, gourmet food, and artisanal coffee.          | upscale coffee, date spot, evening café      | Official site + Instagram found. ([Café Noir][5])                  |         92 |
| 6  | **Amelier Café El Poblado**    | Café/brunch/coworking concept; Pluria lists it as a coworking café at Cl. 9A #37-48.                                                           | coworking, brunch, group work                | Pluria + Instagram found. ([Pluria][6])                            |         90 |
| 7  | **Café Quindío Vía Primavera** | Colombian coffee brand; official store finder confirms Medellín presence, Instagram confirms brand, TripAdvisor page exists for Vía Primavera. | Colombian coffee brand, aesthetic café       | Official site + Instagram + TripAdvisor found. ([Café Quindío][7]) |         88 |
| 8  | **Pergamino Vía Primavera**    | Same strong Pergamino brand; official pages confirm El Poblado stores and specialty coffee positioning.                                        | specialty coffee, tourist-friendly, reliable | Official store pages found. ([PERGAMINO | COLOMBIA][8])            |         88 |
| 9  | **Café La Manchuria**          | Mentioned in café travel guide for El Poblado; needs Places verification before production listing.                                            | local café discovery                         | Mentioned in Gather Coffee guide. ([Gather Coffee Lounge][9])      |         72 |
| 10 | **Azai Praia Lovers**          | Strong design/vibe mention in El Poblado guide; likely more “beautiful place” than coffee authority. Needs Places verification.                | aesthetic café, brunch/social                | Mentioned in Gather Coffee guide. ([Gather Coffee Lounge][9])      |         68 |

---

# What content each listing should include

| Section          | What to store                                                   |
| ---------------- | --------------------------------------------------------------- |
| Core             | name, neighborhood, address, placeId, lat/lng, Maps URL         |
| Coffee           | espresso, pour-over, cold brew, single-origin, roaster info     |
| Work suitability | WiFi, outlets, seating, noise, stay duration                    |
| Vibe             | quiet, social, luxury, minimalist, nomad-friendly               |
| Food             | brunch, pastries, breakfast, desserts                           |
| Trust            | rating, review count, article mentions, source confidence       |
| Media            | Places photo refs, Instagram link, interior/exterior/photo tags |
| AI               | vibe summary, best-for tags, match score, why recommended       |

---

# Best pgvector content

Embed:

```text
“Quiet specialty coffee café in Manila, good for remote work, flat whites, relaxed brunch, laptop-friendly seating.”
```

Do **not** embed:

```text
rating, address, hours, lat/lng
```

Those belong in normal Supabase columns.

---

# Best next step

Create a seed table for these 10:

```text
cafes
cafe_sources
cafe_ai_profiles
cafe_embeddings
```

Then enrich with:

```text
Google Places API New
→ placeId
→ rating
→ photos
→ hours
→ googleMapsLinks
```

[1]: https://co.pergamino.co/pages/tiendas/calle-10-b?srsltid=AfmBOooNmE2WkyYj9rGo1zvxt0CM0QPFKhv6b2US4ajlzn53Ut1SlUpp&utm_source=chatgpt.com "Calle 10B – PERGAMINO | COLOMBIA"
[2]: https://www.hijamiacoffee.com/?srsltid=AfmBOopVLAMIledG-edsuLRV4TARL7gsLJ4kYSH2dEne9eX1jM_q8G_J&utm_source=chatgpt.com "Hija Mia Coffee Roasters"
[3]: https://www.urbaniacafe.com/tiendas-fisicas/?utm_source=chatgpt.com "Tiendas Físicas"
[4]: https://www.tripadvisor.co/Restaurant_Review-g297478-d7113458-Reviews-Cafe_Velvet-Medellin_Antioquia_Department.html?utm_source=chatgpt.com "CAFÉ VELVET, Medellín - Restaurante Opiniones, Menú y Fotos"
[5]: https://www.cafenoircolombia.com/?utm_source=chatgpt.com "Café Noir - Medellín's Iconic Luxury Cafe & Bar"
[6]: https://pluria.co/es/espacio-de-coworking/colombia/medellin/el-poblado/2507--amelier-gastro-lounge-el-poblado?utm_source=chatgpt.com "Amelier Café El Poblado - [location] - Espacio de ..."
[7]: https://www.cafequindio.com.co/pages/tiendas-cafe-quindio?srsltid=AfmBOoqN9Efdw-d3iYeyOtaR1p6uP14H1TgPdDXnaIcVjE5Nk1BI_32H&utm_source=chatgpt.com "Encuentra Nuestras Tiendas | Café Quindío ☕🌿"
[8]: https://co.pergamino.co/pages/tiendas/via-primavera?srsltid=AfmBOoqEPGSHbbKAUCmXI8X7rxVC5ijQb04UuGIcD0JlsKZbKXh0YPvv&utm_source=chatgpt.com "Vía Primavera – PERGAMINO | COLOMBIA"
[9]: https://gather.coffee/stories/blog-post-title-one-sgawh-69k63?utm_source=chatgpt.com "The Cafes of Medellin"
