import { getCorsHeaders, errorBody, jsonResponse } from "../_shared/http.ts";
import { getServiceClient, getUserId } from "../_shared/supabase-clients.ts";
import { slugifyEventTitle } from "./slugify.ts";
import { buildEventInsert } from "./build-event-insert.ts";

const jr = jsonResponse;

type DraftPayload = {
  title?: string;
  neighborhood?: string;
  dateIso?: string;
  venue?: string;
  priceMinCop?: number;
  capacity?: number;
  description?: string;
  ticketTiers?: Array<{ name: string; priceCop: number; quantity: number }>;
};

type Body = {
  decision?: string;
  draft?: DraftPayload;
  approvalRequestId?: string;
  reason?: string;
};

const VALID_DECISIONS = new Set(["approved", "edit", "rejected"]);

function mapRpcDecision(decision: string): string {
  if (decision === "approved") return "approve";
  if (decision === "rejected") return "reject";
  return "edit";
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: getCorsHeaders(req) });
  }
  if (req.method !== "POST") {
    return jr(errorBody("METHOD_NOT_ALLOWED", "POST only"), 405, req);
  }

  const authHeader = req.headers.get("Authorization");
  const userId = await getUserId(authHeader);
  if (!userId) {
    return jr(errorBody("UNAUTHORIZED", "Sign in required"), 401, req);
  }

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return jr(errorBody("BAD_REQUEST", "Invalid JSON"), 400, req);
  }

  const decision = body.decision ?? "";
  if (!VALID_DECISIONS.has(decision)) {
    return jr(
      errorBody("VALIDATION_ERROR", "decision must be approved, edit, or rejected"),
      400,
      req,
    );
  }

  const draft = body.draft;
  if (!draft || typeof draft !== "object") {
    return jr(errorBody("VALIDATION_ERROR", "draft is required"), 400, req);
  }

  const service = getServiceClient();

  const { data: approvalId, error: reqErr } = await service.rpc("request_approval", {
    p_agent: "hostEventAgent",
    p_action_type: "publish_event",
    p_subject: draft.title ?? "Untitled event",
    p_payload: draft,
    p_risk_level: "medium",
    p_requested_by: userId,
  });

  if (reqErr || !approvalId) {
    return jr(
      errorBody("RPC_FAILED", reqErr?.message ?? "request_approval failed"),
      500,
      req,
    );
  }

  const rpcDecision = mapRpcDecision(decision);
  const { error: decideErr } = await service.from("approval_decisions").insert({
    request_id: approvalId,
    decision: rpcDecision,
    decided_by: userId,
    reason: body.reason ?? null,
  });

  if (decideErr) {
    return jr(errorBody("RPC_FAILED", decideErr.message), 500, req);
  }

  if (decision !== "approved") {
    return jr(
      {
        success: true,
        approvalRequestId: approvalId,
        decision,
        eventId: null,
        slug: null,
      },
      200,
      req,
    );
  }

  if (!draft.title || !draft.dateIso) {
    return jr(
      errorBody("VALIDATION_ERROR", "title and dateIso required to publish"),
      400,
      req,
    );
  }

  const slug = slugifyEventTitle(draft.title);

  const { data: profile, error: profileErr } = await service
    .from("profiles")
    .select("full_name, avatar_url")
    .eq("id", userId)
    .maybeSingle();

  if (profileErr) {
    return jr(errorBody("PROFILE_LOOKUP_FAILED", profileErr.message), 500, req);
  }

  const hostDisplay =
    profile?.full_name && profile.full_name.trim()
      ? { name: profile.full_name.trim(), avatarUrl: profile.avatar_url }
      : undefined;

  const { data: eventRow, error: eventErr } = await service
    .from("events")
    .insert(buildEventInsert(draft, userId, slug, hostDisplay))
    .select("id, slug")
    .single();

  if (eventErr || !eventRow) {
    return jr(
      errorBody("INSERT_FAILED", eventErr?.message ?? "event insert failed"),
      500,
      req,
    );
  }

  const tiers = draft.ticketTiers ?? [];
  if (tiers.length > 0) {
    const rows = tiers.map((tier) => ({
      event_id: eventRow.id,
      name: tier.name,
      price_cents: tier.priceCop,
      qty_total: tier.quantity,
      currency: "cop",
      is_active: true,
    }));
    const { error: tierErr } = await service.from("event_tickets").insert(rows);
    if (tierErr) {
      return jr(errorBody("INSERT_FAILED", tierErr.message), 500, req);
    }
  } else if ((draft.priceMinCop ?? 0) > 0) {
    const { error: tierErr } = await service.from("event_tickets").insert({
      event_id: eventRow.id,
      name: "General Admission",
      price_cents: draft.priceMinCop,
      qty_total: draft.capacity && draft.capacity > 0 ? draft.capacity : 100,
      currency: "cop",
      is_active: true,
    });
    if (tierErr) {
      return jr(errorBody("INSERT_FAILED", tierErr.message), 500, req);
    }
  }

  return jr(
    {
      success: true,
      approvalRequestId: approvalId,
      decision,
      eventId: eventRow.id,
      slug: eventRow.slug,
    },
    200,
    req,
  );
});
