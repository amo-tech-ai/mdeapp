import { assertEquals } from "jsr:@std/assert@1";
import { auditIgnore, gatewayOptions, gatewayPost, parseJson } from "./audit_helpers.ts";

const SLUG = "ai-suggest-collections";

Deno.test({
  name: `${SLUG} — OPTIONS`,
  ignore: auditIgnore(),
  async fn() {
    const s = await gatewayOptions(SLUG);
    assertEquals([200, 204, 503].includes(s), true);
  },
});

Deno.test({
  name: `${SLUG} — POST <3 places → 200 empty suggestions`,
  ignore: auditIgnore(),
  async fn() {
    const { status, text } = await gatewayPost(
      SLUG,
      JSON.stringify({ savedPlaces: [{ id: "a", location_id: "1", location_type: "restaurant" }] }),
    );
    assertEquals(status, 200);
    const j = parseJson(text) as { success?: boolean; suggestions?: unknown[] };
    assertEquals(j.success, true);
    assertEquals(Array.isArray(j.suggestions), true);
  },
});

Deno.test({
  name: `${SLUG} — POST invalid JSON → 500 (caught)`,
  ignore: auditIgnore(),
  async fn() {
    const { status } = await gatewayPost(SLUG, "not-json");
    assertEquals(status, 500);
  },
});
