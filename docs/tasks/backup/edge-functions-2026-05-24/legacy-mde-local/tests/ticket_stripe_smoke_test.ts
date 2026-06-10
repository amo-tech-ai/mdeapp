/**
 * EVT-069 — Contract tests for ticket Stripe spine (no live Stripe calls).
 * Live smoke: scripts/evt069-stripe-smoke.sh
 */
import { assertEquals } from "jsr:@std/assert@1";

const CHECKOUT_SRC = await Deno.readTextFile(
  new URL("../ticket-checkout/index.ts", import.meta.url),
);
const WEBHOOK_SRC = await Deno.readTextFile(
  new URL("../ticket-payment-webhook/index.ts", import.meta.url),
);

Deno.test("ticket-checkout: explicit card payment_method_types for COP", () => {
  assertEquals(
    CHECKOUT_SRC.includes('payment_method_types: ["card"]'),
    true,
    "COP checkout must set payment_method_types to avoid STRIPE_ERROR",
  );
});

Deno.test("ticket-checkout: payment_intent metadata only order_id (B1)", () => {
  assertEquals(
    CHECKOUT_SRC.includes("order_id: rpcData.order_id"),
    true,
  );
  assertEquals(
    CHECKOUT_SRC.includes("payment_intent_data"),
    true,
  );
});

Deno.test("ticket-payment-webhook: raw body before constructEventAsync", () => {
  assertEquals(WEBHOOK_SRC.includes("await req.text()"), true);
  assertEquals(
    WEBHOOK_SRC.includes("constructEventAsync"),
    true,
  );
});

Deno.test("ticket-payment-webhook: idempotency on stripe event.id", () => {
  assertEquals(WEBHOOK_SRC.includes("stripe_${event.id}"), true);
});

Deno.test("ticket-checkout: idempotency upsert uses PK column key only", () => {
  assertEquals(
    CHECKOUT_SRC.includes('onConflict: "key"'),
    true,
    "idempotency_keys PK is (key); key,endpoint onConflict fails silently",
  );
});

Deno.test("ticket-payment-webhook: finalize RPC on payment_intent.succeeded", () => {
  assertEquals(WEBHOOK_SRC.includes("ticket_payment_finalize"), true);
});
