import { assertEquals } from "jsr:@std/assert@1";
import { auditIgnore, gatewayOptions, gatewayPost, parseJson } from "./audit_helpers.ts";

const SLUG = "ai-search";

Deno.test({
  name: `${SLUG} — OPTIONS`,
  ignore: auditIgnore(),
  async fn() {
    const s = await gatewayOptions(SLUG);
    assertEquals([200, 204, 503].includes(s), true);
  },
});

Deno.test({
  name: `${SLUG} — POST missing query → 400`,
  ignore: auditIgnore(),
  async fn() {
    const { status } = await gatewayPost(SLUG, JSON.stringify({ semantic: false }));
    assertEquals(status, 400);
  },
});

Deno.test({
  name: `${SLUG} — POST keyword query`,
  ignore: auditIgnore(),
  async fn() {
    const { status, text } = await gatewayPost(
      SLUG,
      JSON.stringify({ query: "café", domain: "events", limit: 3, semantic: false }),
    );
    assertEquals(status, 200);
    const j = parseJson(text) as { success?: boolean; results?: unknown };
    assertEquals(j.success, true);
    assertEquals(Array.isArray(j.results), true);
  },
});
