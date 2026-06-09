/**
 * hermes-ranking — 06A
 *
 * Scores and ranks apartments by a 7-factor weighted composite.
 * Called by frontend after ai-search returns candidate apartment_ids.
 *
 * Auth: Bearer JWT (optional user_id for personalisation)
 * verify_jwt: false — optional auth; public ranking allowed
 *
 * Weights (must sum 1.0):
 *   budget_fit      0.25
 *   neighborhood    0.20
 *   wifi_quality    0.15
 *   stay_length     0.15
 *   amenity_match   0.10
 *   host_rating     0.10
 *   freshness       0.05
 */

import { getCorsHeaders, jsonResponse, errorBody } from "../_shared/http.ts";
import { getServiceClient, getUserId } from "../_shared/supabase-clients.ts";

const WEIGHTS = {
  budget_fit: 0.25,
  neighborhood: 0.20,
  wifi_quality: 0.15,
  stay_length: 0.15,
  amenity_match: 0.10,
  host_rating: 0.10,
  freshness: 0.05,
};

const BATCH_SIZE = 100;
const MAX_FRESHNESS_DAYS = 180;

interface UserPreferences {
  budget_min?: number;
  budget_max?: number;
  neighborhoods?: string[];
  wifi_min?: number;
  stay_length?: number;
  amenities?: string[];
}

interface ApartmentRow {
  id: string;
  price_per_night: number | null;
  neighborhood: string | null;
  wifi_speed: number | null;
  min_stay: number | null;
  max_stay: number | null;
  amenities: string[] | null;
  host_rating: number | null;
  created_at: string | null;
}

interface ScoreBreakdown {
  budget_fit: number;
  neighborhood: number;
  wifi_quality: number;
  stay_length: number;
  amenity_match: number;
  host_rating: number;
  freshness: number;
}

function scoreBudgetFit(price: number | null, prefs: UserPreferences): number {
  if (price === null) return 0.5;
  const { budget_min, budget_max } = prefs;
  if (budget_min === undefined && budget_max === undefined) return 0.7;
  const lo = budget_min ?? 0;
  const hi = budget_max ?? Infinity;
  if (price >= lo && price <= hi) return 1.0;
  if (price < lo) return Math.max(0, 1 - (lo - price) / lo);
  return Math.max(0, 1 - (price - hi) / hi);
}

function scoreNeighborhood(neighborhood: string | null, prefs: UserPreferences): number {
  if (!prefs.neighborhoods?.length) return 0.7;
  if (!neighborhood) return 0.3;
  const requested = prefs.neighborhoods.map((n) => n.toLowerCase());
  return requested.includes(neighborhood.toLowerCase()) ? 1.0 : 0.3;
}

function scoreWifi(wifiSpeed: number | null, prefs: UserPreferences): number {
  if (wifiSpeed === null) return 0.7;
  const minRequired = prefs.wifi_min;
  if (!minRequired) return Math.min(1.0, wifiSpeed / 100);
  if (wifiSpeed >= minRequired) return 1.0;
  return Math.max(0, wifiSpeed / minRequired);
}

function scoreStayLength(minStay: number | null, maxStay: number | null, prefs: UserPreferences): number {
  if (!prefs.stay_length) return 0.7;
  const requested = prefs.stay_length;
  const lo = minStay ?? 1;
  const hi = maxStay ?? 365;
  if (requested >= lo && requested <= hi) return 1.0;
  if (requested < lo) return Math.max(0, 1 - (lo - requested) / lo);
  return Math.max(0, 1 - (requested - hi) / hi);
}

function scoreAmenityMatch(amenities: string[] | null, prefs: UserPreferences): number {
  if (!prefs.amenities?.length) return 0.7;
  if (!amenities?.length) return 0.0;
  const available = amenities.map((a) => a.toLowerCase());
  const requested = prefs.amenities.map((a) => a.toLowerCase());
  const matched = requested.filter((a) => available.includes(a)).length;
  return matched / requested.length;
}

function scoreHostRating(rating: number | null): number {
  if (rating === null) return 0.6;
  return Math.min(1.0, Math.max(0, rating / 5.0));
}

function scoreFreshness(createdAt: string | null): number {
  if (!createdAt) return 0.5;
  const ageMs = Date.now() - new Date(createdAt).getTime();
  const ageDays = ageMs / (1000 * 60 * 60 * 24);
  if (ageDays <= 0) return 1.0;
  return Math.max(0, 1 - ageDays / MAX_FRESHNESS_DAYS);
}

function calculateScore(apt: ApartmentRow, prefs: UserPreferences): {
  total: number;
  breakdown: ScoreBreakdown;
} {
  const breakdown: ScoreBreakdown = {
    budget_fit: scoreBudgetFit(apt.price_per_night, prefs),
    neighborhood: scoreNeighborhood(apt.neighborhood, prefs),
    wifi_quality: scoreWifi(apt.wifi_speed, prefs),
    stay_length: scoreStayLength(apt.min_stay, apt.max_stay, prefs),
    amenity_match: scoreAmenityMatch(apt.amenities, prefs),
    host_rating: scoreHostRating(apt.host_rating),
    freshness: scoreFreshness(apt.created_at),
  };
  const total =
    breakdown.budget_fit * WEIGHTS.budget_fit +
    breakdown.neighborhood * WEIGHTS.neighborhood +
    breakdown.wifi_quality * WEIGHTS.wifi_quality +
    breakdown.stay_length * WEIGHTS.stay_length +
    breakdown.amenity_match * WEIGHTS.amenity_match +
    breakdown.host_rating * WEIGHTS.host_rating +
    breakdown.freshness * WEIGHTS.freshness;
  return { total: Math.round(total * 100) / 100, breakdown };
}

Deno.serve(async (req: Request) => {
  const cors = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response("ok", { status: 204, headers: cors });

  const t0 = Date.now();
  const db = getServiceClient();

  const authHeader = req.headers.get("Authorization");
  const userId = authHeader ? await getUserId(authHeader) : null;

  let body: { apartment_ids: string[]; user_preferences: UserPreferences };
  try {
    body = await req.json();
  } catch {
    return jsonResponse(errorBody("BAD_REQUEST", "Invalid JSON"), 400, req);
  }

  const { apartment_ids, user_preferences } = body;
  if (!Array.isArray(apartment_ids) || apartment_ids.length === 0) {
    return jsonResponse(errorBody("BAD_REQUEST", "apartment_ids must be a non-empty array"), 400, req);
  }
  if (apartment_ids.length > 500) {
    return jsonResponse(errorBody("BAD_REQUEST", "apartment_ids max 500"), 400, req);
  }
  if (!user_preferences || typeof user_preferences !== "object") {
    return jsonResponse(errorBody("BAD_REQUEST", "user_preferences required"), 400, req);
  }

  const { data: run } = await db
    .from("agent_runs")
    .insert({
      agent_kind: "hermes",
      agent_name: "hermes-ranking",
      routine: "06A",
      input: { apartment_ids_count: apartment_ids.length, user_preferences, user_id: userId },
      status: "running",
    })
    .select("id")
    .single();
  const agentRunId = run?.id ?? null;

  const allApartments: ApartmentRow[] = [];
  for (let i = 0; i < apartment_ids.length; i += BATCH_SIZE) {
    const batch = apartment_ids.slice(i, i + BATCH_SIZE);
    const { data, error } = await db
      .from("apartments")
      .select("id, price_per_night, neighborhood, wifi_speed, min_stay, max_stay, amenities, host_rating, created_at")
      .in("id", batch);
    if (error) {
      if (agentRunId) {
        await db.from("agent_runs").update({
          status: "error",
          output: { error: error.message },
          finished_at: new Date().toISOString(),
          duration_ms: Date.now() - t0,
        }).eq("id", agentRunId);
      }
      return jsonResponse(errorBody("DB_ERROR", error.message), 500, req);
    }
    if (data) allApartments.push(...(data as ApartmentRow[]));
  }

  const scored = allApartments.map((apt) => {
    const { total, breakdown } = calculateScore(apt, user_preferences);
    return { apartment_id: apt.id, total_score: total, breakdown };
  });
  scored.sort((a, b) => b.total_score - a.total_score);

  const duration = Date.now() - t0;

  if (agentRunId) {
    await db.from("agent_runs").update({
      status: "success",
      output: { ranked_count: scored.length, top_score: scored[0]?.total_score ?? 0 },
      finished_at: new Date().toISOString(),
      duration_ms: duration,
    }).eq("id", agentRunId);
  }

  return jsonResponse({
    success: true,
    data: { ranked: scored, duration_ms: duration },
  }, 200, req);
});
