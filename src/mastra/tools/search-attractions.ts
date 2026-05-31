import { createTool } from '@mastra/core/tools';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { runAuditedSearch } from '../lib/run-audited-search';

// ---- Schemas (kept aligned with MASTRA-046 AttractionListingSchema) ---------

const categoryEnum = z.enum([
  'park',
  'museum',
  'viewpoint',
  'tour',
  'landmark',
  'neighborhood-walk',
  'day-trip',
]);

const bestTimeEnum = z.enum(['morning', 'afternoon', 'evening', 'any']);

export const attractionSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: categoryEnum,
  neighborhood: z.string(),
  priceUsd: z.number().describe('Entry / tour cost in USD; 0 = free'),
  durationMinutes: z.number().int().positive(),
  rating: z.number().min(0).max(5),
  bestTimeOfDay: bestTimeEnum,
  tags: z.array(z.string()),
  imageUrl: z.string(),
  sourceUrl: z.string(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  // MASTRA-048 enrichment fields (populated by scripts/enrich-places.ts)
  placeId: z.string().nullable().optional().describe('Google Place ID — null until enriched'),
  mapsUrl: z.string().nullable().optional().describe('Canonical Google Maps deep link (placeUri)'),
  aiSummary: z.string().nullable().optional().describe('Gemini-generated 2-sentence venue description'),
});

export type Attraction = z.infer<typeof attractionSchema>;
export type AttractionCategory = z.infer<typeof categoryEnum>;
export type BestTimeOfDay = z.infer<typeof bestTimeEnum>;

// ---- Query API --------------------------------------------------------------

export type AttractionQuery = {
  category?: AttractionCategory;
  neighborhood?: string;
  maxPriceUsd?: number;
  freeOnly?: boolean;
  limit?: number;
};

// ---- DB plumbing (anon Supabase JS — RLS: tourist_destinations_select_anon) -

interface TouristDestinationRow {
  id: string;
  name: string;
  category: string | null;
  subcategory: string | null;
  address: string | null;
  city: string | null;
  tags: string[] | null;
  best_for: string[] | null;
  entry_fee_amount: number | string | null;
  estimated_visit_duration: string | null;
  primary_image_url: string | null;
  website: string | null;
  latitude: number | string | null;
  longitude: number | string | null;
  google_place_id: string | null;
  maps_url: string | null;
  ai_summary: string | null;
  rating: number | string | null;
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

function rowToAttraction(r: TouristDestinationRow): Attraction {
  return {
    id: String(r.id),
    name: r.name,
    category: normalizeCategory(r.category ?? r.subcategory),
    neighborhood: deriveNeighborhood(r),
    priceUsd: r.entry_fee_amount != null ? Number(r.entry_fee_amount) : 0,
    durationMinutes: parseDurationMinutes(r.estimated_visit_duration),
    rating: r.rating != null ? Number(r.rating) : 0,
    bestTimeOfDay: deriveBestTime(r.best_for, r.tags),
    tags: Array.isArray(r.tags) ? r.tags : [],
    imageUrl: r.primary_image_url ?? '',
    sourceUrl: r.website ?? `https://mdeai.co/attractions/${r.id}`,
    latitude: r.latitude != null ? Number(r.latitude) : undefined,
    longitude: r.longitude != null ? Number(r.longitude) : undefined,
    placeId: r.google_place_id ?? null,
    mapsUrl: r.maps_url ?? null,
    aiSummary: r.ai_summary ?? null,
  };
}

// ---- DB-row → tool-output mapping helpers (exported for unit tests) --------

const CATEGORY_VALUES: AttractionCategory[] = [
  'park',
  'museum',
  'viewpoint',
  'tour',
  'landmark',
  'neighborhood-walk',
  'day-trip',
];

/** Coerce a free-form DB category string to the strict enum; default `landmark`. */
export function normalizeCategory(raw: string | null | undefined): AttractionCategory {
  if (!raw) return 'landmark';
  const lower = raw.toLowerCase().trim();
  // Direct match
  if ((CATEGORY_VALUES as string[]).includes(lower)) {
    return lower as AttractionCategory;
  }
  // Common aliases
  if (lower.includes('park') || lower.includes('garden') || lower.includes('plaza')) return 'park';
  if (lower.includes('museum') || lower.includes('gallery')) return 'museum';
  if (lower.includes('viewpoint') || lower.includes('mirador') || lower.includes('cerro')) return 'viewpoint';
  if (lower.includes('tour') || lower.includes('walking-tour') || lower.includes('guided')) return 'tour';
  if (lower.includes('walk') || lower.includes('neighborhood') || lower.includes('barrio')) return 'neighborhood-walk';
  if (lower.includes('day-trip') || lower.includes('daytrip') || lower.includes('excursion')) return 'day-trip';
  return 'landmark';
}

/**
 * Parse `estimated_visit_duration` text (e.g. "60 minutes", "1 hour", "1.5 hours",
 * "90 min", "all day") into a positive integer of minutes. Fallback 60.
 */
export function parseDurationMinutes(raw: string | null | undefined): number {
  if (!raw) return 60;
  const lower = raw.toLowerCase().trim();
  if (lower.includes('all day') || lower.includes('full day')) return 480; // 8h
  const numMatch = lower.match(/(\d+(?:\.\d+)?)/);
  if (!numMatch) return 60;
  const n = parseFloat(numMatch[1]);
  if (!isFinite(n) || n <= 0) return 60;
  if (lower.includes('hour') || lower.includes('hr') || lower.includes('h ')) {
    return Math.max(1, Math.round(n * 60));
  }
  // default unit: minutes
  return Math.max(1, Math.round(n));
}

const BEST_TIME_VALUES: BestTimeOfDay[] = ['morning', 'afternoon', 'evening', 'any'];

/** Pull a `bestTimeOfDay` hint out of the `best_for` / `tags` arrays; default `any`. */
export function deriveBestTime(
  bestFor: string[] | null | undefined,
  tags: string[] | null | undefined,
): BestTimeOfDay {
  const haystack = [...(bestFor ?? []), ...(tags ?? [])].map((s) => s.toLowerCase());
  for (const candidate of BEST_TIME_VALUES) {
    if (haystack.some((h) => h.includes(candidate))) return candidate;
  }
  if (haystack.some((h) => h.includes('sunset') || h.includes('night'))) return 'evening';
  if (haystack.some((h) => h.includes('breakfast') || h.includes('sunrise'))) return 'morning';
  return 'any';
}

/** Choose a non-empty neighborhood string from address-shaped columns. */
export function deriveNeighborhood(row: {
  subcategory: string | null;
  address: string | null;
  city: string | null;
}): string {
  return (
    (row.subcategory ?? '').trim() ||
    (row.address ?? '').trim() ||
    (row.city ?? '').trim() ||
    'Medellín'
  );
}

// ---- DB query --------------------------------------------------------------

async function searchAttractionsFromDB(
  query: AttractionQuery,
): Promise<{ results: Attraction[]; total: number; source: 'supabase'; error?: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return {
      results: [],
      total: 0,
      source: 'supabase',
      error: 'Supabase client unavailable (SUPABASE_URL + SUPABASE_ANON_KEY)',
    };
  }

  const limit = Math.max(1, Math.min(query.limit ?? 5, 20));

  try {
    let q = client
      .from('tourist_destinations')
      .select(
        'id, name, category, subcategory, address, city, tags, best_for, entry_fee_amount, estimated_visit_duration, primary_image_url, website, latitude, longitude, google_place_id, maps_url, ai_summary, rating',
      )
      .or('latitude.not.is.null,longitude.not.is.null,address.not.is.null')
      .order('rating', { ascending: false, nullsFirst: false })
      .order('name', { ascending: true })
      .limit(limit);

    if (query.neighborhood) {
      const n = query.neighborhood;
      q = q.or(`subcategory.ilike.%${n}%,address.ilike.%${n}%,city.ilike.%${n}%`);
    }
    if (query.category) {
      const c = query.category;
      q = q.or(`category.ilike.%${c}%,subcategory.ilike.%${c}%`);
    }
    if (query.freeOnly) {
      q = q.or('entry_fee_amount.is.null,entry_fee_amount.eq.0');
    } else if (typeof query.maxPriceUsd === 'number') {
      q = q.or(`entry_fee_amount.is.null,entry_fee_amount.lte.${query.maxPriceUsd}`);
    }

    const { data, error } = await q;
    if (error) {
      return { results: [], total: 0, source: 'supabase', error: error.message };
    }

    const results = ((data ?? []) as TouristDestinationRow[]).map(rowToAttraction);
    return { results, total: results.length, source: 'supabase' };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { results: [], total: 0, source: 'supabase', error: message };
  }
}

/**
 * Public, testable wrapper. Calls Supabase under the hood. Never throws —
 * returns `{ results: [], total: 0, error }` on failure so the agent can fall
 * back to text.
 */
export async function searchAttractions(
  query: AttractionQuery,
): Promise<{ results: Attraction[]; total: number; source: 'supabase'; error?: string }> {
  return searchAttractionsFromDB(query);
}

// ---- Mastra tool wrapper ---------------------------------------------------

export const searchAttractionsTool = createTool({
  id: 'search-attractions',
  description:
    'Search Medellín attractions, tours, viewpoints, and day-trips from the live `tourist_destinations` table.',
  inputSchema: z.object({
    category: categoryEnum.optional(),
    neighborhood: z.string().optional(),
    maxPriceUsd: z.number().nonnegative().optional().describe('USD; 0 = free'),
    freeOnly: z.boolean().optional(),
    limit: z.number().int().min(1).max(20).default(5),
  }),
  outputSchema: z.object({
    results: z.array(attractionSchema),
    total: z.number(),
    source: z.literal('supabase'),
    error: z.string().optional(),
  }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  execute: async (inputData: AttractionQuery, context?: any) => {
    const { category, neighborhood, maxPriceUsd, freeOnly, limit = 5 } = inputData;
    const { results, total, source, error } = await runAuditedSearch(
      'search-attractions',
      searchAttractions,
      {
        category,
        neighborhood,
        maxPriceUsd,
        freeOnly,
        limit,
      },
      context,
    );

    return { results, total, source, ...(error ? { error } : {}) };
  },
});
