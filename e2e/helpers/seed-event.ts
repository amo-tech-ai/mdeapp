import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { loadEnvLocalForE2E } from "./auth";

export const QA_SLUG_PREFIX = "qa-host-events-";
export const QA_TITLE = "[QA DELETE] Host Events Test";

export type SeedStatus = "published" | "draft";

function adminClient(): SupabaseClient {
  loadEnvLocalForE2E();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;
  if (!url || !serviceKey) {
    throw new Error("E2E Supabase service env missing (url/serviceKey)");
  }
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/** Delete every QA-seeded event for this organizer. Run BEFORE seeding (clears
 *  crashed-run leftovers) and in afterAll. Shared prod DB has no test isolation. */
export async function cleanupQaEvents(organizerId: string): Promise<void> {
  const admin = adminClient();
  await admin
    .from("events")
    .delete()
    .eq("organizer_id", organizerId)
    .like("slug", `${QA_SLUG_PREFIX}%`);
}

/** Seed one QA event owned by `organizerId`. Self-contained (no edge-fn import). */
export async function seedEvent(
  organizerId: string,
  opts: { status: SeedStatus; slug?: string },
): Promise<{ id: string; slug: string }> {
  const admin = adminClient();
  // FK events.organizer_id -> profiles.id. qa-landlord already has a profile;
  // upsert is defensive and ignored if it can't insert (event insert is the signal).
  try {
    await admin
      .from("profiles")
      .upsert({ id: organizerId }, { onConflict: "id", ignoreDuplicates: true });
  } catch {
    // best-effort — rely on the existing profile
  }

  const slug = opts.slug ?? `${QA_SLUG_PREFIX}${opts.status}-${Date.now()}`;
  const { data, error } = await admin
    .from("events")
    .insert({
      // `source` has CHECK events_source_check (google|ticketmaster|manual|
      // ai_generated). Use "manual" for the QA seed; QA_TITLE marks it.
      source: "manual",
      name: `${QA_TITLE} (${opts.status})`,
      city: "Medellín",
      country: "CO",
      event_start_time: new Date(Date.now() + 7 * 86_400_000).toISOString(),
      currency: "cop",
      slug,
      status: opts.status,
      organizer_id: organizerId,
    })
    .select("id, slug")
    .single();

  if (error || !data) throw error ?? new Error("seedEvent insert failed");
  return { id: data.id as string, slug: data.slug as string };
}
