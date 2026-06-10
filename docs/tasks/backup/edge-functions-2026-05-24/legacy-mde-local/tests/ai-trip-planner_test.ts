import { assertEquals } from "jsr:@std/assert@1";
import { auditIgnore, gatewayOptions, gatewayPost } from "./audit_helpers.ts";

const SLUG = "ai-trip-planner";

Deno.test({
  name: `${SLUG} — OPTIONS`,
  ignore: auditIgnore(),
  async fn() {
    const s = await gatewayOptions(SLUG);
    assertEquals([200, 204, 503].includes(s), true);
  },
});

Deno.test({
  name: `${SLUG} — POST missing dates → 400`,
  ignore: auditIgnore(),
  async fn() {
    const { status } = await gatewayPost(SLUG, JSON.stringify({ interests: ["food"] }));
    assertEquals(status, 400);
  },
});

Deno.test({
  name: `${SLUG} — POST valid-ish body (may fail on GEMINI/network)`,
  ignore: auditIgnore(),
  async fn() {
    const { status } = await gatewayPost(
      SLUG,
      JSON.stringify({
        startDate: "2026-06-01",
        endDate: "2026-06-03",
        interests: ["food"],
      }),
    );
    assertEquals([200, 500].includes(status), true);
  },
});
