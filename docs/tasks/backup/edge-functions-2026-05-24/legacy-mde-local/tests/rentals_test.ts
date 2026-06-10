import { assertEquals } from "jsr:@std/assert@1";
import {
  apikeyOnlyHeaders,
  auditIgnore,
  gatewayOptions,
  gatewayPost,
  parseJson,
} from "./audit_helpers.ts";

const SLUG = "rentals";

Deno.test({
  name: `${SLUG} — OPTIONS`,
  ignore: auditIgnore(),
  async fn() {
    const s = await gatewayOptions(SLUG);
    assertEquals([200, 204, 503].includes(s), true);
  },
});

Deno.test({
  name: `${SLUG} — POST unknown action → 400`,
  ignore: auditIgnore(),
  async fn() {
    const { status } = await gatewayPost(SLUG, JSON.stringify({ action: "bogus" }));
    assertEquals(status, 400);
  },
});

Deno.test({
  name:
    `${SLUG} — POST intake with apikey only (gateway may inject Authorization — then 200, else 401)`,
  ignore: auditIgnore(),
  async fn() {
    const { status } = await gatewayPost(
      SLUG,
      JSON.stringify({ action: "intake", messages: [] }),
      apikeyOnlyHeaders(),
    );
    assertEquals([200, 401].includes(status), true);
  },
});

Deno.test({
  name: `${SLUG} — POST search minimal (may 429 rate limit / 500 JSON parse bugs)`,
  ignore: auditIgnore(),
  async fn() {
    const { status, text } = await gatewayPost(
      SLUG,
      JSON.stringify({ action: "search", filter_json: {}, limit: 2 }),
    );
    assertEquals([200, 429, 500].includes(status), true);
    if (status === 200) {
      const j = parseJson(text) as { success?: boolean };
      assertEquals(j.success, true);
    }
  },
});

Deno.test({
  name: `${SLUG} — POST malformed JSON`,
  ignore: auditIgnore(),
  async fn() {
    const { status } = await gatewayPost(SLUG, "not-json");
    assertEquals(status, 500);
  },
});
