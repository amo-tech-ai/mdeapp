import { createTool } from '@mastra/core/tools';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { runAuditedSearch } from '../lib/run-audited-search';
import { searchRentalsIntelligent } from '../lib/intelligence-rental-search';
import { writeSearchLog, type EmbedStatus } from '../lib/search-logs';
import type { EmbedFailureReason } from '../lib/query-embedding';

export const rentalSchema = z.object({
  id: z.string(),
  title: z.string(),
  neighborhood: z.string(),
  nightly_price: z.number(),
  currency: z.literal('USD'),
  bedrooms: z.number(),
  wifi: z.boolean(),
  amenities: z.array(z.string()),
  image: z.string(),
  source_url: z.string(),
  schedule_viewing_url: z.string(),
  host_name: z.string(),
  availability: z.string(),
  tags: z.array(z.string()),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export type Rental = z.infer<typeof rentalSchema>;

export type RentalQuery = {
  neighborhood?: string;
  minBedrooms?: number;
  maxPricePerNight?: number;
  limit?: number;
  queryText?: string;
  checkIn?: string;
  checkOut?: string;
  stayType?: "nightly" | "monthly" | "total_trip";
};

export type RentalSearchResult = {
  results: Rental[];
  total: number;
  source: 'supabase' | 'mock';
  hybridUsed?: boolean;
  embedStatus?: EmbedStatus;
  embedFailureReason?: EmbedFailureReason;
  embedHttpStatus?: number;
  rankExplanation?: import('../lib/search-logs').RankExplanationEntry[];
};

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

export interface ApartmentRow {
  id: string;
  title: string;
  neighborhood: string;
  bedrooms: number | null;
  price_daily: number;
  wifi_speed: number | null;
  amenities: string[] | null;
  images: string[] | null;
  host_name: string | null;
  source_url: string | null;
  available_from: string | null;
  available_to: string | null;
  pet_friendly: boolean;
  parking_included: boolean;
  minimum_stay_days: number;
  slug: string | null;
  latitude: number | null;
  longitude: number | null;
}

export function rowToRental(r: ApartmentRow): Rental {
  return rentalSchema.parse({
    id: r.id,
    title: r.title,
    neighborhood: r.neighborhood,
    nightly_price: Number(r.price_daily),
    currency: 'USD' as const,
    bedrooms: r.bedrooms ?? 0,
    wifi: (r.wifi_speed ?? 0) > 0,
    amenities: r.amenities ?? [],
    image: (r.images ?? [])[0] ?? '',
    source_url: r.source_url ?? `https://mdeai.co/rentals/${r.slug ?? r.id}`,
    schedule_viewing_url: `https://mdeai.co/rentals/${r.slug ?? r.id}/schedule-viewing`,
    host_name: r.host_name ?? 'Host',
    availability: formatAvailability(r.available_from, r.available_to),
    tags: deriveTags({
      amenities: r.amenities ?? [],
      pet_friendly: r.pet_friendly,
      parking_included: r.parking_included,
      minimum_stay_days: r.minimum_stay_days,
      wifi_speed: r.wifi_speed,
      price_daily: Number(r.price_daily),
    }),
    latitude: r.latitude != null ? Number(r.latitude) : undefined,
    longitude: r.longitude != null ? Number(r.longitude) : undefined,
  });
}

function formatAvailability(from: string | null, to: string | null): string {
  if (!from && !to) return 'Available now';
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  if (from && to) return `Available ${fmt(from)} – ${fmt(to)}`;
  if (from) return `Available from ${fmt(from)}`;
  return 'Available now';
}

function deriveTags(row: {
  amenities: string[];
  pet_friendly: boolean;
  parking_included: boolean;
  minimum_stay_days: number;
  wifi_speed: number | null;
  price_daily: number;
}): string[] {
  const tags: string[] = [];
  const am = (row.amenities ?? []).map((a) => a.toLowerCase());
  if (am.some((a) => a.includes('workspace') || a.includes('desk') || a.includes('cowork')))
    tags.push('remote-work');
  if (row.pet_friendly) tags.push('pet-friendly');
  if (row.parking_included) tags.push('parking');
  if (row.minimum_stay_days >= 28) tags.push('long-stay');
  if (row.price_daily && row.price_daily <= 50) tags.push('budget');
  if (am.some((a) => a.includes('pool') || a.includes('gym'))) tags.push('gym');
  if (am.some((a) => a.includes('nightlife') || a.includes('bar'))) tags.push('nightlife');
  if (am.some((a) => a.includes('family') || a.includes('kid'))) tags.push('family');
  return tags.length ? tags : ['walkable'];
}

export function isAvailableForStay(
  row: { available_from: string | null; available_to: string | null },
  checkIn?: string,
  checkOut?: string,
): boolean {
  return !(
    (checkOut && row.available_from && row.available_from > checkOut) ||
    (checkIn && row.available_to && row.available_to < checkIn)
  );
}

export function sortForMonthlyStay<T extends Rental>(results: T[]): T[] {
  return [...results].sort((a, b) => {
    const aLong = a.tags.includes('long-stay') ? 0 : 1;
    const bLong = b.tags.includes('long-stay') ? 0 : 1;
    if (aLong !== bLong) return aLong - bLong;
    return a.nightly_price - b.nightly_price;
  });
}

async function searchRentalsFromSupabase(
  query: RentalQuery,
): Promise<{ results: Rental[]; total: number; source: 'supabase' }> {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error('Supabase client unavailable');
  }

  const limit = query.limit ?? 8;
  // MVP: count:'exact' for accurate browse subtitle (~180 active listings). Revisit
  // estimated/cached counts post-MVP if apartments table grows materially.
  let q = client
    .from('apartments')
    .select(
      'id, title, neighborhood, bedrooms, price_daily, wifi_speed, amenities, images, host_name, source_url, available_from, available_to, pet_friendly, parking_included, minimum_stay_days, slug, latitude, longitude',
      { count: 'exact' },
    )
    .eq('status', 'active')
    .not('price_daily', 'is', null)
    .order('price_daily', { ascending: true })
    .limit(limit);

  if (query.neighborhood) {
    q = q.ilike('neighborhood', `%${query.neighborhood}%`);
  }
  if (typeof query.minBedrooms === 'number') {
    q = q.gte('bedrooms', query.minBedrooms);
  }
  if (typeof query.maxPricePerNight === 'number') {
    q = q.lte('price_daily', query.maxPricePerNight);
  }
  if (query.checkIn) {
    // available_to IS NULL (open-ended) OR available_to >= checkIn
    q = q.or(`available_to.is.null,available_to.gte.${query.checkIn}`);
  }
  if (query.checkOut) {
    // available_from IS NULL (available now) OR available_from <= checkOut
    q = q.or(`available_from.is.null,available_from.lte.${query.checkOut}`);
  }

  const { data, error, count } = await q;
  if (error) {
    throw new Error(error.message);
  }

  let results = ((data ?? []) as ApartmentRow[]).map(rowToRental);
  if (query.stayType === 'monthly') {
    results = sortForMonthlyStay(results);
  }
  return { results, total: count ?? results.length, source: 'supabase' };
}

// Fallback mock kept for offline/test environments
const MOCK_RENTALS: Rental[] = [
  {
    id: 'rnt_lau_001',
    title: 'Bright 2BR with Balcony in Laureles',
    neighborhood: 'Laureles',
    nightly_price: 78,
    currency: 'USD',
    bedrooms: 2,
    wifi: true,
    amenities: ['wifi', 'workspace', 'kitchen', 'balcony', 'washer'],
    image: 'https://images.unsplash.com/photo-rental-lau-001',
    source_url: 'https://mdeai.co/rentals/rnt_lau_001',
    schedule_viewing_url: 'https://mdeai.co/rentals/rnt_lau_001/schedule-viewing',
    host_name: 'Andrés Restrepo',
    availability: 'Available May 15 – Aug 30, 2026',
    tags: ['long-stay', 'remote-work', 'walkable'],
    latitude: 6.2530,
    longitude: -75.5910,
  },
  {
    id: 'rnt_lau_002',
    title: 'Modern 1BR Loft near Primer Parque',
    neighborhood: 'Laureles',
    nightly_price: 64,
    currency: 'USD',
    bedrooms: 1,
    wifi: true,
    amenities: ['wifi', 'workspace', 'kitchen', 'gym', 'rooftop'],
    image: 'https://images.unsplash.com/photo-rental-lau-002',
    source_url: 'https://mdeai.co/rentals/rnt_lau_002',
    schedule_viewing_url: 'https://mdeai.co/rentals/rnt_lau_002/schedule-viewing',
    host_name: 'Sofía Vélez',
    availability: 'Available now – Jul 10, 2026',
    tags: ['solo-traveler', 'remote-work', 'pet-friendly'],
    latitude: 6.2515,
    longitude: -75.5922,
  },
  {
    id: 'rnt_lau_003',
    title: 'Quiet Studio off Avenida Nutibara',
    neighborhood: 'Laureles',
    nightly_price: 42,
    currency: 'USD',
    bedrooms: 0,
    wifi: true,
    amenities: ['wifi', 'kitchen', 'workspace'],
    image: 'https://images.unsplash.com/photo-rental-lau-003',
    source_url: 'https://mdeai.co/rentals/rnt_lau_003',
    schedule_viewing_url: 'https://mdeai.co/rentals/rnt_lau_003/schedule-viewing',
    host_name: 'Camila Ortiz',
    availability: 'Available Jun 1 – Dec 31, 2026',
    tags: ['budget', 'long-stay', 'quiet'],
    latitude: 6.2525,
    longitude: -75.5932,
  },
  {
    id: 'rnt_lau_004',
    title: 'Spacious 3BR Penthouse · Segundo Parque',
    neighborhood: 'Laureles',
    nightly_price: 110,
    currency: 'USD',
    bedrooms: 3,
    wifi: true,
    amenities: ['wifi', 'pool', 'workspace', 'kitchen', 'washer', 'balcony'],
    image: 'https://images.unsplash.com/photo-rental-lau-004',
    source_url: 'https://mdeai.co/rentals/rnt_lau_004',
    schedule_viewing_url: 'https://mdeai.co/rentals/rnt_lau_004/schedule-viewing',
    host_name: 'Miguel Arango',
    availability: 'Available Jul 1 – Oct 31, 2026',
    tags: ['family', 'premium', 'long-stay'],
    latitude: 6.2510,
    longitude: -75.5905,
  },
  {
    id: 'rnt_lau_005',
    title: 'Cozy 1BR near La Setenta',
    neighborhood: 'Laureles',
    nightly_price: 55,
    currency: 'USD',
    bedrooms: 1,
    wifi: true,
    amenities: ['wifi', 'kitchen', 'workspace', 'smart-tv'],
    image: 'https://images.unsplash.com/photo-rental-lau-005',
    source_url: 'https://mdeai.co/rentals/rnt_lau_005',
    schedule_viewing_url: 'https://mdeai.co/rentals/rnt_lau_005/schedule-viewing',
    host_name: 'Laura Gómez',
    availability: 'Available now – Sep 30, 2026',
    tags: ['nightlife', 'walkable', 'solo-traveler'],
    latitude: 6.2535,
    longitude: -75.5917,
  },
  {
    id: 'rnt_pob_001',
    title: 'Sunny 2BR in El Poblado',
    neighborhood: 'El Poblado',
    nightly_price: 95,
    currency: 'USD',
    bedrooms: 2,
    wifi: true,
    amenities: ['wifi', 'pool', 'gym', 'kitchen', 'concierge'],
    image: 'https://images.unsplash.com/photo-rental-pob-001',
    source_url: 'https://mdeai.co/rentals/rnt_pob_001',
    schedule_viewing_url: 'https://mdeai.co/rentals/rnt_pob_001/schedule-viewing',
    host_name: 'Patricia Lopera',
    availability: 'Available Jun 1 – Aug 31, 2026',
    tags: ['nightlife', 'walkable', 'gym'],
    latitude: 6.2090,
    longitude: -75.5655,
  },
  {
    id: 'rnt_env_001',
    title: 'Cozy Studio in Envigado',
    neighborhood: 'Envigado',
    nightly_price: 38,
    currency: 'USD',
    bedrooms: 0,
    wifi: true,
    amenities: ['wifi', 'kitchen'],
    image: 'https://images.unsplash.com/photo-rental-env-001',
    source_url: 'https://mdeai.co/rentals/rnt_env_001',
    schedule_viewing_url: 'https://mdeai.co/rentals/rnt_env_001/schedule-viewing',
    host_name: 'Juliana Mejía',
    availability: 'Available now – Aug 15, 2026',
    tags: ['budget', 'quiet', 'long-stay'],
    latitude: 6.1750,
    longitude: -75.5908,
  },
];

function searchRentalsFromMock(query: RentalQuery): { results: Rental[]; total: number; source: 'mock' } {
  let results = MOCK_RENTALS.slice();
  if (query.neighborhood) {
    const q = query.neighborhood.toLowerCase();
    results = results.filter((r) => r.neighborhood.toLowerCase().includes(q));
  }
  if (typeof query.minBedrooms === 'number') {
    results = results.filter((r) => r.bedrooms >= query.minBedrooms!);
  }
  if (typeof query.maxPricePerNight === 'number') {
    results = results.filter((r) => r.nightly_price <= query.maxPricePerNight!);
  }
  const total = results.length;
  return { results: results.slice(0, query.limit ?? 8), total, source: 'mock' };
}

// Named export for direct workflow calls (sync signature kept for compatibility;
// internally async — callers that need real DB data should await searchRentals())
export async function searchRentals(
  query: RentalQuery,
): Promise<RentalSearchResult> {
  const limit = query.limit ?? 8;

  if (query.queryText?.trim()) {
    try {
      const started = Date.now();
      const intel = await searchRentalsIntelligent(query);
      const latencyMs = Date.now() - started;
      await writeSearchLog({
        queryText: query.queryText,
        slots: intel.slots,
        toolName: 'search-rentals',
        resultsCount: intel.results.length,
        latencyMs,
        hybridUsed: intel.hybridUsed,
        embedStatus: intel.embedStatus,
        embedFailureReason: intel.embedFailureReason,
        embedHttpStatus: intel.embedHttpStatus,
        groundingUsed: false,
        rankExplanation: intel.rankExplanation,
      });
      return {
        results: intel.results.slice(0, limit),
        total: intel.total,
        source: intel.source,
        hybridUsed: intel.hybridUsed,
        embedStatus: intel.embedStatus,
        embedFailureReason: intel.embedFailureReason,
        embedHttpStatus: intel.embedHttpStatus,
        rankExplanation: intel.rankExplanation,
      };
    } catch (err) {
      console.warn(
        '[search-rentals] intelligent search failed, falling back to structured search:',
        (err as Error).message,
      );
    }
  }

  try {
    const { results, total, source } = await searchRentalsFromSupabase(query);
    return { results, total, source };
  } catch (err) {
    console.warn(
      '[search-rentals] Supabase query failed, falling back to mock:',
      (err as Error).message,
    );
  }
  return searchRentalsFromMock(query);
}

export const searchRentalsTool = createTool({
  id: 'search-rentals',
  description:
    'Search Medellín rentals by neighborhood, bedrooms, and price. Returns rental cards with source_url and schedule_viewing_url. Queries live Supabase apartments table; falls back to demo data if DB is unavailable.',
  inputSchema: z.object({
    neighborhood: z.string().optional().describe('e.g. Laureles, El Poblado, Envigado'),
    minBedrooms: z.number().int().min(0).optional(),
    maxPricePerNight: z.number().positive().optional().describe('USD per night'),
    limit: z.number().int().min(1).max(20).default(8),
    queryText: z
      .string()
      .optional()
      .describe('Natural-language rental search e.g. digital nomad rental in Laureles near cafes'),
  }),
  outputSchema: z.object({
    results: z.array(
      rentalSchema.extend({
        rankScore: z.number().optional(),
        evidenceText: z.string().nullable().optional(),
      }),
    ),
    source: z.enum(['supabase', 'mock']),
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
  execute: async (inputData: RentalQuery, context?: any) => {
    const { neighborhood, minBedrooms, maxPricePerNight, limit = 8, queryText } = inputData;
    const { results, source, hybridUsed, rankExplanation } = await runAuditedSearch(
      'search-rentals',
      searchRentals,
      { neighborhood, minBedrooms, maxPricePerNight, limit, queryText },
      context,
    );

    return {
      results: results.map((r) => ({
        id: r.id,
        title: r.title,
        neighborhood: r.neighborhood,
        bedrooms: r.bedrooms,
        nightly_price: r.nightly_price,
        currency: r.currency,
        host_name: r.host_name,
        wifi: r.wifi,
        amenities: r.amenities,
        tags: r.tags,
        availability: r.availability,
        image: r.image,
        source_url: r.source_url,
        schedule_viewing_url: r.schedule_viewing_url,
        latitude: r.latitude,
        longitude: r.longitude,
        rankScore: "rankScore" in r ? (r as { rankScore?: number }).rankScore : undefined,
        evidenceText: "evidenceText" in r ? (r as { evidenceText?: string | null }).evidenceText : undefined,
      })),
      source,
      hybridUsed,
      rankExplanation,
    };
  },
});
