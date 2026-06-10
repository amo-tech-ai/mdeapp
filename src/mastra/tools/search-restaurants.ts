import { createTool } from '@mastra/core/tools';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { extractNeighborhood } from './search-events';
import { runAuditedSearch } from '../lib/run-audited-search';
import { searchRestaurantsIntelligent } from '../lib/intelligence-restaurant-search';
import { writeSearchLog, type RankExplanationEntry } from '../lib/search-logs';

const cuisineEnum = z.enum([
  'colombian',
  'paisa',
  'seafood',
  'steakhouse',
  'vegetarian',
  'cafe',
  'international',
  'street-food',
]);

export const restaurantSchema = z.object({
  id: z.string(),
  name: z.string(),
  cuisine: cuisineEnum,
  neighborhood: z.string(),
  priceTier: z.enum(['$', '$$', '$$$', '$$$$']),
  avgPricePerPerson: z.number().describe('USD'),
  currency: z.literal('USD'),
  rating: z.number().min(0).max(5),
  vibe: z.array(z.string()),
  imageUrl: z.string(),
  sourceUrl: z.string(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  // MASTRA-048 enrichment fields (populated by scripts/enrich-places.ts)
  placeId: z.string().nullable().optional().describe('Google Place ID — null until enriched'),
  mapsUrl: z.string().nullable().optional().describe('Canonical Google Maps deep link (placeUri)'),
  aiSummary: z.string().nullable().optional().describe('Gemini-generated 2-sentence venue description'),
});

export type Restaurant = z.infer<typeof restaurantSchema>;
export type Cuisine = z.infer<typeof cuisineEnum>;

/** Curated fallback when Supabase returns no rows or is unavailable (offline / empty DB). */
const FALLBACK_RESTAURANTS: Restaurant[] = [
  {
    id: 'rst_lau_001',
    name: 'Hatoviejo Laureles',
    cuisine: 'paisa',
    neighborhood: 'Laureles',
    priceTier: '$$',
    avgPricePerPerson: 18,
    currency: 'USD',
    rating: 4.5,
    vibe: ['traditional', 'family-friendly', 'live-music-weekends'],
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
    sourceUrl: 'https://mdeai.co/restaurants/rst_lau_001',
    latitude: 6.2516,
    longitude: -75.5898,
  },
  {
    id: 'rst_pob_001',
    name: 'Carmen',
    cuisine: 'international',
    neighborhood: 'El Poblado',
    priceTier: '$$$$',
    avgPricePerPerson: 65,
    currency: 'USD',
    rating: 4.8,
    vibe: ['fine-dining', 'tasting-menu', 'date-night'],
    imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
    sourceUrl: 'https://mdeai.co/restaurants/rst_pob_001',
    latitude: 6.2098,
    longitude: -75.5663,
  },
  // Cafés — required by curatedFallback (B-10: FALLBACK_RESTAURANTS had no café entries)
  {
    id: 'rst_lau_cafe_001',
    name: 'Pergamino Café',
    cuisine: 'cafe',
    neighborhood: 'Laureles',
    priceTier: '$',
    avgPricePerPerson: 8,
    currency: 'USD',
    rating: 4.7,
    vibe: ['specialty-coffee', 'third-wave', 'work-friendly', 'wifi'],
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800',
    sourceUrl: 'https://mdeai.co/restaurants/rst_lau_cafe_001',
    latitude: 6.2489,
    longitude: -75.5843,
  },
  {
    id: 'rst_lau_cafe_002',
    name: 'Urbania Café',
    cuisine: 'cafe',
    neighborhood: 'Laureles',
    priceTier: '$',
    avgPricePerPerson: 7,
    currency: 'USD',
    rating: 4.5,
    vibe: ['specialty-coffee', 'quiet', 'neighborhood', 'wifi'],
    imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800',
    sourceUrl: 'https://mdeai.co/restaurants/rst_lau_cafe_002',
    latitude: 6.2503,
    longitude: -75.5871,
  },
  {
    id: 'rst_pob_cafe_001',
    name: 'Velvet Café',
    cuisine: 'cafe',
    neighborhood: 'El Poblado',
    priceTier: '$',
    avgPricePerPerson: 9,
    currency: 'USD',
    rating: 4.6,
    vibe: ['specialty-coffee', 'brunch', 'work-friendly', 'wifi'],
    imageUrl: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800',
    sourceUrl: 'https://mdeai.co/restaurants/rst_pob_cafe_001',
    latitude: 6.2091,
    longitude: -75.5672,
  },
];

export type RestaurantQuery = {
  cuisine?: Cuisine;
  neighborhood?: string;
  maxPricePerPerson?: number;
  minRating?: number;
  limit?: number;
  priceTier?: '$' | '$$' | '$$$' | '$$$$';
  userLatitude?: number;
  userLongitude?: number;
  /** Natural-language query — enables hybrid + venue_signals (SEARCH-003). */
  queryText?: string;
};

export type RestaurantSource = 'supabase' | 'fallback';

interface RestaurantRow {
  id: string;
  name: string;
  cuisine_types: string[] | null;
  price_level: number;
  address: string | null;
  city: string | null;
  neighborhood: string | null;
  latitude: number | string | null;
  longitude: number | string | null;
  primary_image_url: string | null;
  rating: number | string | null;
  tags: string[] | null;
  // MASTRA-048 enrichment columns (nullable until enrich-places.ts runs)
  google_place_id: string | null;
  maps_url: string | null;
  ai_summary: string | null;
}

let _client: ReturnType<typeof createClient> | null = null;

function getSupabaseClient() {
  if (_client) return _client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  _client = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return _client;
}

/** Map DB cuisine_types + description keywords → tool enum (for Zod + filters). */
export function mapCuisineFromTypes(types: string[] | null): Cuisine {
  if (!types?.length) return 'international';
  const blob = types.join(' ').toLowerCase();
  if (blob.includes('vegan') || blob.includes('vegetarian') || blob.includes('plant')) return 'vegetarian';
  if (blob.includes('paisa')) return 'paisa';
  if (blob.includes('seafood') || blob.includes('sushi') || blob.includes('japanese') || blob.includes('peruvian'))
    return 'seafood';
  if (blob.includes('steak') || blob.includes('fine dining') || blob.includes('molecular') || blob.includes('michelin'))
    return 'steakhouse';
  if (blob.includes('coffee') || blob.includes('café') || blob.includes('cafe')) return 'cafe';
  if (blob.includes('street') || blob.includes('food hall') || blob.includes('mercado')) return 'street-food';
  if (blob.includes('colombian') || blob.includes('traditional')) return 'colombian';
  return 'international';
}

export function priceLevelToTier(priceLevel: number): '$' | '$$' | '$$$' | '$$$$' {
  const n = Math.min(4, Math.max(1, priceLevel));
  return (['$', '$$', '$$$', '$$$$'] as const)[n - 1];
}

/** Rough USD anchor from price_level when DB has no per-person price. */
export function estimateAvgPriceFromLevel(priceLevel: number): number {
  const table: Record<number, number> = { 1: 12, 2: 22, 3: 42, 4: 68 };
  return table[Math.min(4, Math.max(1, priceLevel))] ?? 25;
}

function num(v: number | string | null | undefined): number | undefined {
  if (v === null || v === undefined) return undefined;
  const n = typeof v === 'string' ? Number(v) : v;
  return Number.isFinite(n) ? n : undefined;
}

function rowToRestaurant(row: RestaurantRow): Restaurant {
  const pl = typeof row.price_level === 'number' ? row.price_level : Number(row.price_level) || 2;
  const rating = num(row.rating) ?? 0;
  const lat = num(row.latitude);
  const lng = num(row.longitude);
  return {
    id: row.id,
    name: row.name,
    cuisine: mapCuisineFromTypes(row.cuisine_types),
    neighborhood: row.neighborhood ?? extractNeighborhood(row.address, row.city),
    priceTier: priceLevelToTier(pl),
    avgPricePerPerson: estimateAvgPriceFromLevel(pl),
    currency: 'USD',
    rating,
    vibe: row.tags?.length ? row.tags : row.cuisine_types ?? [],
    imageUrl: row.primary_image_url ?? '',
    sourceUrl: `https://mdeai.co/restaurants/${row.id}`,
    latitude: lat,
    longitude: lng,
    // MASTRA-048 enrichment fields — null until enrich-places.ts + cache-ai-summaries.ts run
    placeId: row.google_place_id ?? null,
    mapsUrl: row.maps_url ?? null,
    aiSummary: row.ai_summary ?? null,
  };
}

function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function applyRestaurantFilters(rows: Restaurant[], query: RestaurantQuery): Restaurant[] {
  let results = rows.slice();
  if (query.cuisine) {
    results = results.filter((r) => r.cuisine === query.cuisine);
  }
  if (query.neighborhood) {
    const q = query.neighborhood.toLowerCase();
    results = results.filter((r) => r.neighborhood.toLowerCase().includes(q));
  }
  if (query.priceTier) {
    results = results.filter((r) => r.priceTier === query.priceTier);
  }
  if (typeof query.maxPricePerPerson === 'number') {
    results = results.filter((r) => r.avgPricePerPerson <= query.maxPricePerPerson!);
  }
  if (typeof query.minRating === 'number') {
    results = results.filter((r) => r.rating >= query.minRating!);
  }
  if (
    typeof query.userLatitude === 'number' &&
    typeof query.userLongitude === 'number'
  ) {
    results = results
      .map((r) => ({
        r,
        dist:
          r.latitude != null && r.longitude != null
            ? haversineKm(
                query.userLatitude!,
                query.userLongitude!,
                r.latitude,
                r.longitude,
              )
            : Number.POSITIVE_INFINITY,
      }))
      .sort((a, b) => a.dist - b.dist)
      .map(({ r }) => r);
  }
  return results;
}

export type RestaurantSearchResult = {
  results: Restaurant[];
  total: number;
  source: RestaurantSource;
  hybridUsed?: boolean;
  rankExplanation?: RankExplanationEntry[];
};

export async function searchRestaurants(
  query: RestaurantQuery,
): Promise<RestaurantSearchResult> {
  const limit = query.limit ?? 5;

  if (query.queryText?.trim()) {
    const started = Date.now();
    let intel: Awaited<ReturnType<typeof searchRestaurantsIntelligent>> | null = null;
    try {
      intel = await searchRestaurantsIntelligent(query);
    } catch (err) {
      console.warn('[search-restaurants] intelligent search failed:', err instanceof Error ? err.message : err);
    }
    const latencyMs = Date.now() - started;

    // Apply filters after intelligent search; fall back to curated list on empty/error.
    const intelFiltered = intel?.results?.length
      ? applyRestaurantFilters(intel.results, query)
      : [];

    if (intelFiltered.length === 0) {
      console.warn('[search-restaurants] intelligent path empty — using curated fallback');
      const fallback = applyRestaurantFilters(FALLBACK_RESTAURANTS, query);
      await writeSearchLog({
        queryText: query.queryText,
        slots: intel?.slots,
        toolName: 'search-restaurants',
        resultsCount: fallback.length,
        latencyMs,
        hybridUsed: false,
        groundingUsed: false,
      });
      return { results: fallback.slice(0, limit), total: fallback.length, source: 'fallback' };
    }

    // Log final count (after filters) — not pre-filter count.
    await writeSearchLog({
      queryText: query.queryText,
      slots: intel?.slots,
      toolName: 'search-restaurants',
      resultsCount: intelFiltered.length,
      latencyMs,
      hybridUsed: intel?.hybridUsed,
      groundingUsed: false,
      rankExplanation: intel?.rankExplanation,
    });
    return {
      results: intelFiltered.slice(0, limit),
      total: intelFiltered.length,
      source: intel?.source ?? 'fallback',
      hybridUsed: intel?.hybridUsed,
      rankExplanation: intel?.rankExplanation,
    };
  }

  const client = getSupabaseClient();

  const returnFallback = (
    reason: 'no_client' | 'error' | 'empty_db',
  ): RestaurantSearchResult => {
    if (reason !== 'no_client') {
      console.warn(`[search-restaurants] ${reason} — using fallback list`);
    } else {
      console.warn('[search-restaurants] Supabase client unavailable — using fallback list');
    }
    const filtered = applyRestaurantFilters(FALLBACK_RESTAURANTS, query);
    return { results: filtered.slice(0, limit), total: filtered.length, source: 'fallback' as const };
  };

  if (!client) {
    return returnFallback('no_client');
  }

  let q = client
    .from('restaurants')
    .select(
      'id, name, cuisine_types, price_level, address, city, neighborhood, latitude, longitude, primary_image_url, rating, tags, google_place_id, maps_url, ai_summary',
    )
    .eq('is_active', true)
    .order('rating', { ascending: false, nullsFirst: false })
    .limit(48);

  if (query.neighborhood) {
    // Strip PostgREST-special chars (commas, parens, dots) before filter string interpolation.
    const safeNeighborhood = query.neighborhood
      .replace(/[^a-zA-ZáéíóúüñÁÉÍÓÚÜÑ0-9\s\-]/g, "")
      .trim();
    if (safeNeighborhood) {
      q = q.or(
        `neighborhood.ilike.%${safeNeighborhood}%,address.ilike.%${safeNeighborhood}%,city.ilike.%${safeNeighborhood}%`,
      );
    }
  }

  const { data, error } = await q;

  if (error) {
    console.error('[search-restaurants] Supabase error:', error.message);
    return returnFallback('error');
  }

  const raw = (data ?? []) as RestaurantRow[];
  if (raw.length === 0) {
    return returnFallback('empty_db');
  }

  let mapped = raw.map(rowToRestaurant);
  mapped = applyRestaurantFilters(mapped, query);
  return {
    results: mapped.slice(0, limit),
    total: mapped.length,
    source: 'supabase' as const,
  };
}

export const searchRestaurantsTool = createTool({
  id: 'search-restaurants',
  description:
    'Search Medellín restaurants from Supabase (public.restaurants). Falls back to a short curated list only when the DB returns no rows or Supabase is unavailable.',
  inputSchema: z.object({
    cuisine: cuisineEnum.optional(),
    neighborhood: z.string().optional().describe('e.g. Laureles, El Poblado, Envigado, Centro'),
    maxPricePerPerson: z.number().positive().optional().describe('USD'),
    minRating: z.number().min(0).max(5).optional(),
    limit: z.number().int().min(1).max(20).default(5),
    queryText: z
      .string()
      .optional()
      .describe('Natural-language search e.g. quiet rooftop dinner in Provenza'),
  }),
  outputSchema: z.object({
    results: z.array(
      restaurantSchema.extend({
        rankScore: z.number().optional(),
        evidence: z
          .array(
            z.object({
              sourceType: z.string(),
              sourceUrl: z.string().nullable(),
              extractedText: z.string().nullable(),
            }),
          )
          .optional(),
      }),
    ),
    total: z.number(),
    source: z.enum(['supabase', 'fallback']),
    hybridUsed: z.boolean().optional(),
    rankExplanation: z
      .array(
        z.object({
          factor: z.string(),
          score: z.number(),
          note: z.string(),
        }),
      )
      .optional(),
  }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  execute: async (inputData: RestaurantQuery, context?: any) => {
    const { cuisine, neighborhood, maxPricePerPerson, minRating, limit = 5, queryText } =
      inputData;
    const { results, total, source, hybridUsed, rankExplanation } = await runAuditedSearch(
      'search-restaurants',
      searchRestaurants,
      {
        cuisine,
        neighborhood,
        maxPricePerPerson,
        minRating,
        limit,
        queryText,
      },
      context,
    );

    return { results, total, source, hybridUsed, rankExplanation };
  },
});
