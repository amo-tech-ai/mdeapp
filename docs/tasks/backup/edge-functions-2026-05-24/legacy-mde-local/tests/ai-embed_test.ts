import { assertEquals } from "jsr:@std/assert@1";
import {
  auditIgnore,
  defaultHeaders,
  gatewayAnonHeaders,
  gatewayOptions,
  gatewayPost,
  parseJson,
} from "./audit_helpers.ts";

const SLUG = "ai-embed";

Deno.test({
  name: `${SLUG} — OPTIONS`,
  ignore: auditIgnore(),
  async fn() {
    const s = await gatewayOptions(SLUG);
    assertEquals([200, 204, 503].includes(s), true);
  },
});

Deno.test({
  name: `${SLUG} — POST without x-ai-embed-secret → 403`,
  ignore: auditIgnore(),
  async fn() {
    const { status } = await gatewayPost(
      SLUG,
      JSON.stringify({
        entity_type: "event",
        entity_id: "00000000-0000-4000-8000-000000000001",
      }),
    );
    assertEquals(status, 403);
  },
});

Deno.test({
  name: `${SLUG} — POST invalid UUID with secret`,
  ignore: auditIgnore(),
  async fn() {
    const secret = Deno.env.get("AI_EMBED_SECRET")?.trim() ?? "";
    if (!secret) {
      console.log(`[${SLUG}] skip: set AI_EMBED_SECRET in serve .env`);
      return;
    }
    const h = gatewayAnonHeaders();
    h.set("x-ai-embed-secret", secret);
    const { status } = await gatewayPost(
      SLUG,
      JSON.stringify({ entity_type: "listing", entity_id: "not-a-uuid" }),
      h,
    );
    assertEquals(status, 400);
  },
});
