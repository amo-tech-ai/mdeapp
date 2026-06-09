import { assert, assertEquals } from "jsr:@std/assert@1";
import { auditIgnore, gatewayOptions, gatewayPost, parseJson } from "./audit_helpers.ts";

const SLUG = "ai-optimize-route";

Deno.test({
  name: `${SLUG} — OPTIONS`,
  ignore: auditIgnore(),
  async fn() {
    const s = await gatewayOptions(SLUG);
    assertEquals([200, 204, 503].includes(s), true);
  },
});

Deno.test({
  name: `${SLUG} — POST <2 items → 200 fallback`,
  ignore: auditIgnore(),
  async fn() {
    const { status, text } = await gatewayPost(
      SLUG,
      JSON.stringify({
        items: [{
          id: "a",
          title: "A",
          latitude: 1,
          longitude: 1,
          item_type: "x",
          start_at: null,
        }],
        dayDate: "2026-01-01",
      }),
    );
    assertEquals(status, 200);
    const j = parseJson(text) as { optimizedOrder?: unknown };
    assert(Array.isArray(j.optimizedOrder));
  },
});
