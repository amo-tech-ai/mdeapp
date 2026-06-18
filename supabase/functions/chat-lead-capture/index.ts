import { getCorsHeaders, errorBody, jsonResponse } from "../_shared/http.ts";
import { getServiceClient, getUserId } from "../_shared/supabase-clients.ts";
import { allowRateDurable, clientIp } from "../_shared/rate-limit.ts";
import {
  createScheduleViewingBridge,
  isScheduleViewingRequest,
} from "../_shared/schedule-viewing-bridge.ts";

const VALID_INTENTS = [
  "rental",
  "host",
  "buyer",
  "event_organizer",
  "sponsor",
] as const;
const VALID_SOURCES = ["chat_auto", "chat_explicit", "form"] as const;

type Intent = (typeof VALID_INTENTS)[number];
type Source = (typeof VALID_SOURCES)[number];

const jr = jsonResponse;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: getCorsHeaders(req) });
  }

  const serviceClient = getServiceClient();
  const authHeader = req.headers.get("Authorization");
  const userId = await getUserId(authHeader);

  if (!userId) {
    const rl = await allowRateDurable(
      serviceClient,
      `chat-lead:${clientIp(req)}`,
      20,
      3600,
    );
    if (!rl.allowed) {
      return jr(
        errorBody("RATE_LIMIT", "Too many submissions — try again later"),
        429,
        req,
      );
    }
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return jr(errorBody("BAD_REQUEST", "Invalid JSON"), 400, req);
  }

  const intent = body.intent as string;
  if (!VALID_INTENTS.includes(intent as Intent)) {
    return jr(
      errorBody(
        "VALIDATION_ERROR",
        `intent must be one of: ${VALID_INTENTS.join(", ")}`,
      ),
      400,
      req,
    );
  }

  const source: Source = VALID_SOURCES.includes(body.source as Source)
    ? (body.source as Source)
    : "chat_auto";

  const email = typeof body.email === "string" ? body.email : null;
  const phone = typeof body.phone === "string" ? body.phone : null;
  const name = typeof body.name === "string" ? body.name : null;
  const conversation_id =
    typeof body.conversation_id === "string" ? body.conversation_id : null;
  const listing_id = typeof body.listing_id === "string" ? body.listing_id : null;
  const preferred_at =
    typeof body.preferred_at === "string" ? body.preferred_at : null;
  const trip_id = typeof body.trip_id === "string" ? body.trip_id : null;
  const idempotency_key =
    typeof body.idempotency_key === "string" ? body.idempotency_key : null;

  if (
    isScheduleViewingRequest(intent, listing_id, preferred_at)
  ) {
    const bridge = await createScheduleViewingBridge(serviceClient, {
      listingId: listing_id ? listing_id : '',
      preferredAt: preferred_at ? preferred_at : '',
      tripId: trip_id,
      idempotencyKey: idempotency_key,
      userId,
      email,
      name,
      phone,
      source,
      metadata: {
        ...(conversation_id ? { conversation_id } : {}),
        ...(body.neighborhood ? { neighborhood: body.neighborhood } : {}),
        ...(body.listing_title ? { listing_title: body.listing_title } : {}),
      },
    });

    if (!bridge.ok) {
      return jr(errorBody(bridge.code, bridge.message), 400, req);
    }

    const { leadId, showingId, idempotentReplay } = bridge.result;
    console.log(
      `[lead-capture] schedule lead=${leadId} showing=${showingId} replay=${idempotentReplay}`,
    );

    return jr({
      success: true,
      data: {
        lead_id: leadId,
        showing_id: showingId,
        idempotent_replay: idempotentReplay,
        actions: [
          {
            type: "OPEN_LEAD_CAPTURED",
            payload: {
              lead_id: leadId,
              showing_id: showingId,
              message:
                "Viewing scheduled — the landlord will confirm your time slot.",
            },
          },
        ],
      },
    });
  }

  const metadata: Record<string, unknown> = {};
  if (conversation_id) metadata.conversation_id = conversation_id;
  if (body.neighborhood) metadata.neighborhood = body.neighborhood;
  if (body.budget_max) metadata.budget_max = body.budget_max;
  if (body.move_in_date) metadata.move_in_date = body.move_in_date;
  if (listing_id) metadata.listing_id = listing_id;
  if (body.listing_title) metadata.listing_title = body.listing_title;
  if (preferred_at) metadata.preferred_at = preferred_at;

  const leadInsert: Record<string, unknown> = {
    user_id: userId ?? null,
    intent,
    email,
    phone,
    name,
    source,
    metadata,
    status: "new",
  };

  if (trip_id) leadInsert.trip_id = trip_id;

  const { data: lead, error } = await serviceClient
    .from("leads")
    .insert(leadInsert)
    .select("id")
    .single();

  if (error) {
    console.error("[chat-lead-capture] insert error:", error);
    return jr(errorBody("DB_ERROR", "Failed to save lead"), 500, req);
  }

  console.log(
    `[lead-capture] id=${lead.id} intent=${intent} source=${source} email=${email ?? "—"}`,
  );

  return jr({
    success: true,
    data: {
      lead_id: lead.id,
      actions: [
        {
          type: "OPEN_LEAD_CAPTURED",
          payload: {
            lead_id: lead.id,
            message: "Agent notified — someone will reach out within 24h.",
          },
        },
      ],
    },
  });
});
