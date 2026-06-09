import { getCorsHeaders, jsonResponse, errorBody } from "../_shared/http.ts";
import { getServiceClient } from "../_shared/supabase-clients.ts";

interface DeliveryEvent {
  event: "ack"|"sent"|"delivered"|"read"|"failed"|"opted_out";
  messageId: string; to: string; chatId?: string;
  campaignId?: string; outboxId?: string; status?: string;
  error?: { code: string; message: string }; timestamp?: string;
}

function normalizeStatus(event: string, status?: string): string {
  const s = (status ?? event).toLowerCase();
  if (s==="ack"||s==="sent") return "sent";
  if (s==="delivered") return "delivered";
  if (s==="read") return "read";
  if (s==="failed") return "failed";
  if (s==="bounced") return "bounced";
  if (s==="opted_out"||s==="stop") return "opted_out";
  return "sent";
}

function verifyBearer(authHeader: string|null, secret: string): boolean {
  if (!authHeader) return false;
  const expected = `Bearer ${secret}`;
  if (authHeader.length !== expected.length) return false;
  const a = new TextEncoder().encode(authHeader);
  const b = new TextEncoder().encode(expected);
  let diff = 0;
  for (let i=0; i<a.length; i++) diff |= a[i]! ^ b[i]!;
  return diff === 0;
}

Deno.serve(async (req) => {
  if (req.method==="OPTIONS") return new Response("ok",{headers:getCorsHeaders(req)});

  const webhookSecret = Deno.env.get("OPENCLAW_WEBHOOK_SECRET");
  if (!webhookSecret) return jsonResponse(errorBody("CONFIG_ERROR","Webhook secret not configured"),500,req);

  if (!verifyBearer(req.headers.get("Authorization"), webhookSecret)) {
    console.warn("openclaw-delivery-webhook: invalid bearer token");
    return jsonResponse(errorBody("UNAUTHORIZED","Invalid webhook token"),401,req);
  }

  let event: DeliveryEvent;
  try { event = await req.json() as DeliveryEvent; }
  catch { return jsonResponse(errorBody("BAD_REQUEST","Invalid JSON body"),400,req); }

  if (!event.messageId||!event.to) return jsonResponse(errorBody("BAD_REQUEST","Missing messageId or to"),400,req);

  const status = normalizeStatus(event.event, event.status);
  const db = getServiceClient();

  const logRow: Record<string,unknown> = {
    openclaw_message_id: event.messageId,
    channel: "whatsapp", recipient: event.to, status,
    metadata: JSON.stringify({chatId:event.chatId,raw_event:event.event}),
  };
  if (event.outboxId)   logRow.outbox_id   = event.outboxId;
  if (event.campaignId) logRow.campaign_id = event.campaignId;
  if (event.error) { logRow.error_code=event.error.code; logRow.error_message=event.error.message; }
  if (status==="sent")      logRow.sent_at      = event.timestamp??new Date().toISOString();
  if (status==="delivered") logRow.delivered_at = event.timestamp??new Date().toISOString();
  if (status==="read")      logRow.read_at      = event.timestamp??new Date().toISOString();

  const { error: logErr } = await db.rpc("fn_upsert_delivery_log",{p_data:logRow});
  if (logErr) {
    console.error("delivery_logs upsert error:",logErr.message);
    return jsonResponse(errorBody("DB_ERROR",logErr.message),500,req);
  }

  if (status==="opted_out") {
    const identifier = event.to.replace(/\D/g,"").replace(/^1/,"");
    const {error:suppErr} = await db.from("suppression_list").upsert(
      {channel:"whatsapp",identifier,reason:"user_stop",source:"openclaw_webhook",created_at:new Date().toISOString()},
      {onConflict:"channel,identifier"}
    );
    if (suppErr) console.error("suppression_list upsert error:",suppErr.message);
    else console.log("openclaw-delivery-webhook: opted out",identifier);
  }

  console.log(`openclaw-delivery-webhook: ${event.event} -> ${status} for ${event.to}`);
  return jsonResponse({ok:true,status},200,req);
});
