#!/usr/bin/env node
/**
 * G1 smoke — POST /api/tickets/checkout (proxies ticket-checkout edge).
 * Expects 502/500 if Stripe keys missing locally; 200 when edge + Stripe configured.
 */
const BASE = process.env.SMOKE_BASE_URL ?? "http://localhost:3001";

const EVENT_ID = "22222222-2222-2222-2222-000000000001";
const TICKET_ID = "33333333-3333-3333-3333-000000000001";

async function main() {
  const payload = {
    eventId: EVENT_ID,
    ticketId: TICKET_ID,
    quantity: 1,
    buyerEmail: `andres.smoke+${Date.now()}@mdeai.co`,
    buyerName: "Andres Smoke",
    idempotencyKey: crypto.randomUUID(),
    returnPath: "/events/reina-de-antioquia-2026-finals",
  };

  const res = await fetch(`${BASE}/api/tickets/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = await res.json();

  if (res.ok && json.success && json.stripeSessionUrl) {
    console.log(`✅ ticket checkout OK orderId=${json.orderId}`);
    return;
  }

  const code = json.error?.code ?? "unknown";
  if (res.status === 502 && (code === "CONFIG_ERROR" || code === "STRIPE_ERROR")) {
    console.log(`⚠ ticket checkout edge reachable but Stripe not configured (${code})`);
    console.log("   Deploy EVT-01 secrets (STRIPE_SECRET_KEY, QR_SIGNING_SECRET) for full G1 proof.");
    process.exit(0);
  }

  console.error("✗ ticket checkout failed", res.status, json);
  process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
