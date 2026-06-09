import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SearchRequest {
  query: string;
  domain?: "all" | "apartments" | "cars" | "restaurants" | "events";
  semantic?: boolean;
  filters?: {
    neighborhood?: string;
    priceMin?: number;
    priceMax?: number;
    dateFrom?: string;
    dateTo?: string;
  };
  limit?: number;
}

interface SearchResult {
  id: string;
  type: "apartment" | "car" | "restaurant" | "event";
  title: string;
  description: string | null;
  price: number | null;
  rating: number | null;
  imageUrl: string | null;
  location: string | null;
  relevanceScore: number;
  metadata: Record<string, unknown>;
}

function getSupabaseClient(authHeader: string | null) {
  // Use anon key so RLS applies to all queries. When the user's JWT is forwarded
  // in the Authorization header, the client authenticates as that user;
  // otherwise it authenticates as the anon role. Either way, service_role is
  // never granted and inactive/draft records stay hidden.
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    {
      auth: { autoRefreshToken: false, persistSession: false },
      global: { headers: authHeader ? { Authorization: authHeader } : {} },
    }
  );
}

async function embedQuery(query: string): Promise<number[] | null> {
  const apiKey = Deno.env.get("GEMINI_API_KEY");
  if (!apiKey) return null;
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${apiKey}`;
    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "models/gemini-embedding-001",
        content: { parts: [{ text: query }] },
        outputDimensionality: 768,
      }),
    });
    if (!resp.ok) return null;
    const data = await resp.json();
    const values: number[] = data?.embedding?.values;
    if (!Array.isArray(values) || values.length !== 768) return null;
    return values;
  } catch {
    return null;
  }
}

async function extractSearchParams(query: string): Promise<{
  keywords: string[];
  domain: string | null;
  neighborhood: string | null;
  priceRange: { min: number | null; max: number | null };
  cuisineType: string | null;
  eventType: string | null;
  vehicleType: string | null;
}> {
  const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
  if (!GEMINI_API_KEY) {
    return {
      keywords: query.toLowerCase().split(/\s+/).filter((w) => w.length > 2),
      domain: null, neighborhood: null,
      priceRange: { min: null, max: null },
      cuisineType: null, eventType: null, vehicleType: null,
    };
  }

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
      {
        method: "POST",
        headers: { Authorization: `Bearer ${GEMINI_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gemini-2.0-flash-lite",
          messages: [
            {
              role: "system",
              content: `You are a search query analyzer for a Medellín travel app. Extract structured parameters.
Respond with JSON only:
{
  "keywords": ["array", "of", "important", "words"],
  "domain": "apartments|cars|restaurants|events|null",
  "neighborhood": "El Poblado|Laureles|Envigado|null",
  "priceRange": { "min": number|null, "max": number|null },
  "cuisineType": "Colombian|Italian|Japanese|etc|null",
  "eventType": "concert|festival|cultural|null",
  "vehicleType": "sedan|SUV|luxury|null"
}`,
            },
            { role: "user", content: query },
          ],
          max_tokens: 300,
          temperature: 0.1,
        }),
      }
    );
    if (response.ok) {
      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || "{}";
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]);
    }
  } catch (err) {
    console.error("AI extraction failed:", err);
  }

  return {
    keywords: query.toLowerCase().split(/\s+/).filter((w) => w.length > 2),
    domain: null, neighborhood: null,
    priceRange: { min: null, max: null },
    cuisineType: null, eventType: null, vehicleType: null,
  };
}

async function semanticSearchListings(
  supabase: ReturnType<typeof getSupabaseClient>,
  embedding: number[],
  filters: SearchRequest["filters"],
  limit: number
): Promise<SearchResult[]> {
  const { data, error } = await supabase.rpc("semantic_search_listings", {
    query_embedding: `[${embedding.join(",")}]`,
    match_count: limit,
  });
  if (error) { console.error("Semantic listing search error:", error); return []; }

  return (data || [])
    .filter((r: Record<string, unknown>) => {
      if (filters?.neighborhood && r.neighborhood)
        return String(r.neighborhood).toLowerCase().includes(filters.neighborhood.toLowerCase());
      return true;
    })
    .filter((r: Record<string, unknown>) => {
      if (filters?.priceMin && r.price_monthly) return Number(r.price_monthly) >= filters.priceMin!;
      return true;
    })
    .filter((r: Record<string, unknown>) => {
      if (filters?.priceMax && r.price_monthly) return Number(r.price_monthly) <= filters.priceMax!;
      return true;
    })
    .map((r: Record<string, unknown>) => ({
      id: r.id as string,
      type: "apartment" as const,
      title: r.title as string,
      description: (r.description as string) ?? null,
      price: (r.price_monthly as number) ?? null,
      rating: (r.rating as number) ?? null,
      imageUrl: Array.isArray(r.images) ? (r.images[0] as string) : null,
      location: (r.neighborhood as string) ?? null,
      relevanceScore: (r.similarity as number) ?? 0,
      metadata: { amenities: r.amenities, bedrooms: r.bedrooms, similarity: r.similarity },
    }));
}

async function semanticSearchEvents(
  supabase: ReturnType<typeof getSupabaseClient>,
  embedding: number[],
  filters: SearchRequest["filters"],
  limit: number
): Promise<SearchResult[]> {
  const { data, error } = await supabase.rpc("semantic_search_events", {
    query_embedding: `[${embedding.join(",")}]`,
    match_count: limit,
  });
  if (error) { console.error("Semantic event search error:", error); return []; }

  return (data || []).map((r: Record<string, unknown>) => ({
    id: r.id as string,
    type: "event" as const,
    title: r.name as string,
    description: (r.description as string) ?? null,
    price: (r.ticket_price_min as number) ?? null,
    rating: (r.rating as number) ?? null,
    imageUrl: (r.primary_image_url as string) ?? null,
    location: (r.address as string) ?? null,
    relevanceScore: (r.similarity as number) ?? 0,
    metadata: { eventType: r.event_type, startTime: r.event_start_time, similarity: r.similarity },
  }));
}

async function semanticSearchRestaurants(
  supabase: ReturnType<typeof getSupabaseClient>,
  embedding: number[],
  limit: number
): Promise<SearchResult[]> {
  const { data, error } = await supabase.rpc("semantic_search_restaurants", {
    query_embedding: `[${embedding.join(",")}]`,
    match_count: limit,
  });
  if (error) { console.error("Semantic restaurant search error:", error); return []; }

  return (data || []).map((r: Record<string, unknown>) => ({
    id: r.id as string,
    type: "restaurant" as const,
    title: r.name as string,
    description: (r.description as string) ?? null,
    price: (r.price_level as number) ?? null,
    rating: (r.rating as number) ?? null,
    imageUrl: (r.primary_image_url as string) ?? null,
    location: (r.address as string) ?? (r.city as string) ?? null,
    relevanceScore: (r.similarity as number) ?? 0,
    metadata: { cuisineTypes: r.cuisine_types, priceLevel: r.price_level, similarity: r.similarity },
  }));
}

async function searchApartments(
  supabase: ReturnType<typeof getSupabaseClient>,
  filters: SearchRequest["filters"],
  neighborhood: string | null,
  limit: number
): Promise<SearchResult[]> {
  let query = supabase
    .from("apartments")
    .select("id, title, description, neighborhood, price_monthly, rating, images, amenities")
    .eq("status", "active");

  if (neighborhood || filters?.neighborhood)
    query = query.ilike("neighborhood", `%${neighborhood || filters?.neighborhood}%`);
  if (filters?.priceMin) query = query.gte("price_monthly", filters.priceMin);
  if (filters?.priceMax) query = query.lte("price_monthly", filters.priceMax);

  const { data, error } = await query
    .order("rating", { ascending: false, nullsFirst: false })
    .limit(limit);
  if (error) { console.error("Apartment search error:", error); return []; }

  return (data || []).map((apt, idx) => ({
    id: apt.id,
    type: "apartment" as const,
    title: apt.title,
    description: apt.description,
    price: apt.price_monthly,
    rating: apt.rating,
    imageUrl: apt.images?.[0] || null,
    location: apt.neighborhood,
    relevanceScore: Math.min(0.55, 1 - idx * 0.05),
    metadata: { amenities: apt.amenities },
  }));
}

async function searchRestaurants(
  supabase: ReturnType<typeof getSupabaseClient>,
  cuisineType: string | null,
  limit: number
): Promise<SearchResult[]> {
  let query = supabase
    .from("restaurants")
    .select("id, name, description, cuisine_types, price_level, rating, primary_image_url, city, address")
    .eq("is_active", true);

  if (cuisineType) query = query.contains("cuisine_types", [cuisineType]);

  const { data, error } = await query
    .order("rating", { ascending: false, nullsFirst: false })
    .limit(limit);
  if (error) { console.error("Restaurant search error:", error); return []; }

  return (data || []).map((rest, idx) => ({
    id: rest.id,
    type: "restaurant" as const,
    title: rest.name,
    description: rest.description,
    price: rest.price_level,
    rating: rest.rating,
    imageUrl: rest.primary_image_url,
    location: rest.address || rest.city,
    relevanceScore: Math.min(0.55, 1 - idx * 0.05),
    metadata: { cuisineTypes: rest.cuisine_types, priceLevel: rest.price_level },
  }));
}

async function searchCars(
  supabase: ReturnType<typeof getSupabaseClient>,
  vehicleType: string | null,
  filters: SearchRequest["filters"],
  limit: number
): Promise<SearchResult[]> {
  let query = supabase
    .from("car_rentals")
    .select("id, make, model, year, vehicle_type, price_daily, rating, images, features")
    .eq("status", "active");

  if (vehicleType) query = query.ilike("vehicle_type", `%${vehicleType}%`);
  if (filters?.priceMax) query = query.lte("price_daily", filters.priceMax);

  const { data, error } = await query
    .order("rating", { ascending: false, nullsFirst: false })
    .limit(limit);
  if (error) { console.error("Car search error:", error); return []; }

  return (data || []).map((car, idx) => ({
    id: car.id,
    type: "car" as const,
    title: `${car.year} ${car.make} ${car.model}`,
    description: `${car.vehicle_type} - ${car.features?.slice(0, 3).join(", ") || "Well equipped"}`,
    price: car.price_daily,
    rating: car.rating,
    imageUrl: car.images?.[0] || null,
    location: "Medellín pickup available",
    relevanceScore: Math.min(0.55, 1 - idx * 0.05),
    metadata: { vehicleType: car.vehicle_type, features: car.features },
  }));
}

async function searchEvents(
  supabase: ReturnType<typeof getSupabaseClient>,
  eventType: string | null,
  filters: SearchRequest["filters"],
  limit: number
): Promise<SearchResult[]> {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  let query = supabase
    .from("events")
    .select("id, name, description, event_type, event_start_time, ticket_price_min, rating, primary_image_url, address")
    .eq("is_active", true)
    .gte("event_start_time", oneHourAgo);

  if (eventType) query = query.ilike("event_type", `%${eventType}%`);
  if (filters?.dateFrom) query = query.gte("event_start_time", filters.dateFrom);
  if (filters?.dateTo) query = query.lte("event_start_time", filters.dateTo);

  const { data, error } = await query.order("event_start_time", { ascending: true }).limit(limit);
  if (error) { console.error("Event search error:", error); return []; }

  return (data || []).map((evt, idx) => ({
    id: evt.id,
    type: "event" as const,
    title: evt.name,
    description: evt.description,
    price: evt.ticket_price_min,
    rating: evt.rating,
    imageUrl: evt.primary_image_url,
    location: evt.address,
    relevanceScore: Math.min(0.55, 1 - idx * 0.05),
    metadata: { eventType: evt.event_type, startTime: evt.event_start_time },
  }));
}

async function generateSummary(query: string, results: SearchResult[]): Promise<string> {
  const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
  if (!GEMINI_API_KEY || results.length === 0)
    return results.length === 0
      ? "No results found for your search. Try broadening your criteria."
      : `Found ${results.length} results matching your search.`;

  try {
    const resultSummary = results
      .slice(0, 5)
      .map((r) => `- ${r.title} (${r.type}): ${r.price ? `$${r.price}` : "Price varies"}, Rating: ${r.rating || "N/A"}`)
      .join("\n");

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
      {
        method: "POST",
        headers: { Authorization: `Bearer ${GEMINI_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gemini-2.0-flash-lite",
          messages: [
            {
              role: "system",
              content:
                "You are a helpful travel assistant. Provide a brief, friendly 1-2 sentence summary of search results for Medellín, Colombia.",
            },
            {
              role: "user",
              content: `User searched for: "${query}"\n\nTop results:\n${resultSummary}\n\nProvide a brief summary.`,
            },
          ],
          max_tokens: 150,
          temperature: 0.7,
        }),
      }
    );
    if (response.ok) {
      const data = await response.json();
      return data.choices?.[0]?.message?.content || `Found ${results.length} great options!`;
    }
  } catch (err) {
    console.error("Summary generation failed:", err);
  }

  return `Found ${results.length} results matching your search.`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const startTime = Date.now();

  try {
    const authHeader = req.headers.get("Authorization");
    const supabase = getSupabaseClient(authHeader);

    const body: SearchRequest = await req.json();
    const { query, domain = "all", semantic = false, filters = {}, limit = 10 } = body;

    if (!query || typeof query !== "string") {
      return new Response(JSON.stringify({ error: "Query is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const results: SearchResult[] = [];
    const resultsPerDomain = Math.ceil(limit / (domain !== "all" ? 1 : 4));

    if (semantic) {
      const embedding = await embedQuery(query);

      if (embedding) {
        const searchPromises: Promise<SearchResult[]>[] = [];
        // When a neighborhood filter is set and domain=all, skip cars —
        // cars have no neighborhood and would pollute location-specific results.
        const neighborhoodActive = !!filters?.neighborhood;

        if (domain === "all" || domain === "apartments")
          searchPromises.push(semanticSearchListings(supabase, embedding, filters, resultsPerDomain));
        if (domain === "all" || domain === "events")
          searchPromises.push(semanticSearchEvents(supabase, embedding, filters, resultsPerDomain));
        if (domain === "all" || domain === "restaurants")
          searchPromises.push(semanticSearchRestaurants(supabase, embedding, resultsPerDomain));
        // Cars have no embeddings — keyword fallback; skip when neighborhood filter active
        if ((domain === "all" && !neighborhoodActive) || domain === "cars")
          searchPromises.push(searchCars(supabase, null, filters, resultsPerDomain));

        const settled = await Promise.all(searchPromises);
        settled.forEach((r) => results.push(...r));

        // If neighborhood filter is active but semantic returned 0 matching apartments,
        // add keyword apartment results as fallback so the user isn't left with nothing.
        if (neighborhoodActive && domain === "all" && !results.some((r) => r.type === "apartment")) {
          const kwApts = await searchApartments(supabase, filters, filters.neighborhood!, resultsPerDomain);
          results.push(...kwApts);
        }

        results.sort((a, b) => b.relevanceScore - a.relevanceScore);
        const finalResults = results.slice(0, limit);
        const summary = await generateSummary(query, finalResults);

        return new Response(
          JSON.stringify({
            success: true,
            query,
            summary,
            results: finalResults,
            meta: {
              total: finalResults.length,
              domains: [...new Set(finalResults.map((r) => r.type))],
              durationMs: Date.now() - startTime,
              mode: "semantic",
            },
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      // Fall through to keyword if embedding failed
    }

    const params = await extractSearchParams(query);
    const effectiveDomain = domain !== "all" ? domain : params.domain;
    const kLimit = Math.ceil(limit / (effectiveDomain ? 1 : 4));

    const keywordPromises: Promise<SearchResult[]>[] = [];
    if (!effectiveDomain || effectiveDomain === "apartments")
      keywordPromises.push(searchApartments(supabase, filters, params.neighborhood, kLimit));
    if (!effectiveDomain || effectiveDomain === "restaurants")
      keywordPromises.push(searchRestaurants(supabase, params.cuisineType, kLimit));
    if (!effectiveDomain || effectiveDomain === "cars")
      keywordPromises.push(searchCars(supabase, params.vehicleType, filters, kLimit));
    if (!effectiveDomain || effectiveDomain === "events")
      keywordPromises.push(searchEvents(supabase, params.eventType, filters, kLimit));

    const keywordResults = await Promise.all(keywordPromises);
    keywordResults.forEach((r) => results.push(...r));
    results.sort((a, b) => b.relevanceScore - a.relevanceScore);
    const finalResults = results.slice(0, limit);
    const summary = await generateSummary(query, finalResults);

    return new Response(
      JSON.stringify({
        success: true,
        query,
        summary,
        results: finalResults,
        meta: {
          total: finalResults.length,
          domains: [...new Set(finalResults.map((r) => r.type))],
          durationMs: Date.now() - startTime,
          mode: "keyword",
          extractedParams: params,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("AI Search error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Search failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
