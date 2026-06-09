/**
 * listing-create — Landlord V1 D5.
 *
 * Receives a fully-validated listing payload from the host wizard
 * (steps 1-4 of /host/listings/new), runs auto-moderation, and writes
 * the apartments row. Returns the moderation verdict so the client
 * can route to either a "go live" or "needs review" or "rejected"
 * UI state.
 *
 * Auth: verify_jwt: true via supabase/config.toml. We additionally
 * confirm the caller has a landlord_profiles row before writing.
 *
 * Auto-moderation rules: see ./auto-moderation.ts (pure module + deno test).
 *
 * Rate limit: 10 listings / hour / user (durable Postgres limiter).
 *
 * Apartments insert uses the service role because moderation_status +
 * source + landlord_id are server-controlled, not client-controlled.
 */

import { z } from "https://esm.sh/zod@3.23.8";
import {
  getCorsHeaders,
  jsonResponse,
  errorBody,
} from "../_shared/http.ts";
import {
  getServiceClient,
  getUserClient,
  getUserId,
} from "../_shared/supabase-clients.ts";
import { allowRateDurable } from "../_shared/rate-limit.ts";
import {
  autoModerationVerdict,
  type ListingForModeration,
} from "./auto-moderation.ts";
import {
  signModerationToken,
  buildModerationUrl,
  TOKEN_DEFAULT_TTL_SECONDS,
} from "../_shared/moderation-token.ts";
import { sendFounderEmail } from "../_shared/founder-email.ts";
import { renderNeedsReviewEmail } from "../listing-moderate/email-template.ts";

const PhotoSchema = z.object({
  publicUrl: z.string().url(),
  path: z.string().min(1),
  sizeBytes: z.number().int().positive().optional(),
});

const PayloadSchema = z.object({
  // Step 1 — address
  address: z.string().min(5).max(200),
  city: z.string().min(2).max(80),
  neighborhood: z.string().min(2).max(80),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  // Step 2 — specs
  bedrooms: z.number().int().min(0).max(10),
  bathrooms: z.number().int().min(1).max(10),
  size_sqm: z.number().int().positive().max(2000).nullable().optional(),
  furnished: z.boolean(),
  price_monthly: z.number().positive(),
  currency: z.enum(["COP", "USD"]),
  minimum_stay_days: z.number().int().min(1).max(365),
  amenities: z.array(z.string().min(1).max(40)).max(30),
  building_amenities: z.array(z.string().min(1).max(40)).max(20),
  // Step 3 — photos
  images: z.array(PhotoSchema).max(40),
  // Step 4 — title + description
  title: z.string().min(8).max(100),
  description: z.string().min(1).max(4000),
});

type ListingPayload = z.infer<typeof PayloadSchema>;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: getCorsHeaders(req) });
  }
  if (req.method !== "POST") {
    return jsonResponse(
      errorBody("METHOD_NOT_ALLOWED", "Use POST"),
      405,
      req,
    );
  }

  // 1. Auth gate. verify_jwt:true in config.toml already rejects unauthed
  // requests, but we still need user.id for the rate-limit key + landlord
  // lookup. getUserId returns null on missing/invalid — return 401.
  const authHeader = req.headers.get("Authorization");
  const userId = await getUserId(authHeader);
  if (!userId || !authHeader) {
    return jsonResponse(
      errorBody("UNAUTHORIZED", "Sign in to create a listing"),
      401,
      req,
    );
  }

  // 2. Rate limit: 10 listings / hour / user. Durable so it survives
  // edge-fn cold starts. Fails open on DB outage.
  const userClient = getUserClient(authHeader);
  const rate = await allowRateDurable(
    userClient,
    `listing-create:${userId}`,
    10,
    3600,
  );
  if (!rate.allowed) {
    return jsonResponse(
      errorBody(
        "RATE_LIMITED",
        "Too many listings created. Try again in an hour.",
        { retry_after_seconds: rate.retry_after_seconds },
      ),
      429,
      req,
    );
  }

  // 3. Parse + validate payload.
  let payload: ListingPayload;
  try {
    const json = await req.json();
    payload = PayloadSchema.parse(json);
  } catch (err) {
    return jsonResponse(
      errorBody(
        "INVALID_PAYLOAD",
        "Listing payload didn't validate",
        err instanceof z.ZodError ? err.flatten() : String(err),
      ),
      400,
      req,
    );
  }

  // 4. Confirm the caller has a landlord_profiles row. Without one, they
  // haven't completed onboarding; the wizard's auth gate also enforces
  // this client-side, but this server-side check closes the loop.
  const { data: landlordRow, error: landlordErr } = await userClient
    .from("landlord_profiles")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();
  if (landlordErr) {
    console.error("listing-create landlord lookup error:", landlordErr);
    return jsonResponse(
      errorBody("LANDLORD_LOOKUP_FAILED", landlordErr.message),
      500,
      req,
    );
  }
  if (!landlordRow) {
    return jsonResponse(
      errorBody(
        "ONBOARDING_INCOMPLETE",
        "Finish /host/onboarding before creating a listing",
      ),
      403,
      req,
    );
  }

  // 5. Auto-moderation. Pure function — no I/O.
  const moderationInput: ListingForModeration = {
    description: payload.description,
    latitude: payload.latitude,
    longitude: payload.longitude,
    price_monthly: payload.price_monthly,
    currency: payload.currency,
    photos_count: payload.images.length,
  };
  const { verdict, reasons } = autoModerationVerdict(moderationInput);

  if (verdict === "rejected") {
    // Don't write anything — let the client surface the reasons so the
    // user can fix and resubmit. Conservative: 2+ violations is too
    // many to triage manually.
    return jsonResponse(
      {
        success: false,
        error: {
          code: "AUTO_REJECTED",
          message: "Listing rejected by automated review",
          details: { reasons },
        },
        verdict,
      },
      422,
      req,
    );
  }

  // 6. Insert apartments via service role. Server-side authority over:
  //   - landlord_id (from RLS-validated profile lookup)
  //   - moderation_status (from verdict)
  //   - source = 'manual'
  //   - status = 'active' (renter-side queries filter this; needs_review
  //                       still goes live optimistically per plan §3.1)
  const moderationStatus = verdict === "auto_approved"
    ? "approved"
    : "pending";

  const service = getServiceClient();
  const { data: apartmentRow, error: insertErr } = await service
    .from("apartments")
    .insert({
      title: payload.title,
      description: payload.description,
      neighborhood: payload.neighborhood,
      address: payload.address,
      city: payload.city,
      latitude: payload.latitude,
      longitude: payload.longitude,
      bedrooms: payload.bedrooms,
      bathrooms: payload.bathrooms,
      size_sqm: payload.size_sqm ?? null,
      furnished: payload.furnished,
      price_monthly: payload.price_monthly,
      currency: payload.currency,
      minimum_stay_days: payload.minimum_stay_days,
      amenities: payload.amenities,
      building_amenities: payload.building_amenities,
      images: payload.images.map((p) => p.publicUrl),
      landlord_id: landlordRow.id,
      moderation_status: moderationStatus,
      source: "manual",
      status: "active",
      created_by: userId,
    })
    .select("id, moderation_status")
    .single();

  if (insertErr) {
    console.error("listing-create insert error:", insertErr);
    return jsonResponse(
      errorBody("INSERT_FAILED", insertErr.message),
      500,
      req,
    );
  }

  // 7. needs_review → fire founder magic-link email. Failures here MUST
  // NOT fail the request — the listing is already in the DB and the
  // founder can still moderate via direct SQL or the (D7) admin shell.
  if (verdict === "needs_review") {
    fireNeedsReviewEmail({
      listingId: apartmentRow.id,
      title: payload.title,
      neighborhood: payload.neighborhood,
      city: payload.city,
      price: payload.price_monthly,
      currency: payload.currency,
      photoCount: payload.images.length,
      landlordId: landlordRow.id,
      reasons,
    }).catch((err) => {
      console.warn("[listing-create] founder email dispatch failed:", err);
    });
  }

  return jsonResponse(
    {
      success: true,
      data: {
        listing_id: apartmentRow.id,
        moderation_status: apartmentRow.moderation_status,
        verdict,
        reasons,
      },
    },
    201,
    req,
  );
});

interface NeedsReviewArgs {
  listingId: string;
  title: string;
  neighborhood: string;
  city: string;
  price: number;
  currency: "COP" | "USD";
  photoCount: number;
  landlordId: string;
  reasons: string[];
}

async function fireNeedsReviewEmail(args: NeedsReviewArgs): Promise<void> {
  const secret = Deno.env.get("FOUNDER_MODERATION_SECRET");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  if (!secret || !supabaseUrl) {
    console.warn(
      "[listing-create] needs_review email skipped: secret or SUPABASE_URL unset",
    );
    return;
  }

  // Look up the landlord display_name for the email body. Best-effort.
  const service = getServiceClient();
  let landlordName: string | null = null;
  const { data: profile } = await service
    .from("landlord_profiles")
    .select("display_name")
    .eq("id", args.landlordId)
    .maybeSingle();
  if (profile) landlordName = profile.display_name ?? null;

  const now = Math.floor(Date.now() / 1000);
  const exp = now + TOKEN_DEFAULT_TTL_SECONDS;
  const [approveTok, rejectTok] = await Promise.all([
    signModerationToken(
      { lid: args.listingId, act: "approve", iat: now, exp },
      secret,
    ),
    signModerationToken(
      { lid: args.listingId, act: "reject", iat: now, exp },
      secret,
    ),
  ]);

  const approveUrl = buildModerationUrl(supabaseUrl, approveTok);
  const rejectUrl = buildModerationUrl(supabaseUrl, rejectTok);

  const { subject, text } = renderNeedsReviewEmail(
    {
      title: args.title,
      neighborhood: args.neighborhood,
      city: args.city,
      price_monthly: args.price,
      currency: args.currency,
      photo_count: args.photoCount,
      landlord_display_name: landlordName,
      reasons: args.reasons,
    },
    approveUrl,
    rejectUrl,
  );

  await sendFounderEmail({ subject, text });
}
