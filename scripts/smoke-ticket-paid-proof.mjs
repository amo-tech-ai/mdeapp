#!/usr/bin/env node
/**
 * G1 ops checklist — Stripe webhook endpoint inventory + latest order status.
 * Does NOT perform a live payment. Run after manual test checkout for paid proof.
 */
const BASE = process.env.SMOKE_BASE_URL ?? "http://localhost:3001";

async function main() {
  console.log("=== G1 Stripe ops checklist ===\n");

  try {
    const { execSync } = await import("node:child_process");
    const out = execSync("stripe webhook_endpoints list --limit 5 2>/dev/null", {
      encoding: "utf8",
    });
    const parsed = JSON.parse(out);
    const testEndpoints = (parsed.data ?? []).filter((e) => !e.livemode);
    if (testEndpoints.length === 0) {
      console.log("🔴 No test-mode webhook endpoints — payments stay pending");
    } else {
      for (const ep of testEndpoints) {
        console.log(`✅ Test endpoint ${ep.id}`);
        console.log(`   URL: ${ep.url}`);
        console.log(`   Events: ${(ep.enabled_events ?? []).join(", ")}`);
      }
    }
  } catch {
    console.log("⚠ stripe CLI not configured — run: stripe webhook_endpoints list");
  }

  console.log("\n--- Latest checkout smoke (session only) ---");
  const res = await fetch(`${BASE}/api/tickets/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      eventId: "22222222-2222-2222-2222-000000000001",
      ticketId: "33333333-3333-3333-3333-000000000001",
      quantity: 1,
      buyerEmail: `g1.ops+${Date.now()}@mdeai.co`,
      buyerName: "G1 Ops",
      idempotencyKey: crypto.randomUUID(),
      returnPath: "/events/reina-de-antioquia-2026-finals",
    }),
  });
  const json = await res.json();
  if (res.ok && json.success && json.stripeSessionUrl) {
    console.log(`✅ Checkout session orderId=${json.orderId}`);
    console.log("   Next: complete Stripe test payment → verify event_orders.status=paid");
    console.log(`   Wallet: /me/tickets/${json.orderId}?token=<from email or sessionStorage>`);
  } else {
    console.log("✗ Checkout failed", res.status, json);
    process.exit(1);
  }

  console.log("\n--- F11 reminder ---");
  console.log("Verify STRIPE_WEBHOOK_SECRET ≠ STRIPE_SPONSOR_WEBHOOK_SECRET (see tasks/notes/F11-evidence.md)");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
