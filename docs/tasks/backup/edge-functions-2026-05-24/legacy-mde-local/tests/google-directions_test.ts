import { assertEquals } from "jsr:@std/assert@1";
import {
  apikeyOnlyHeaders,
  auditIgnore,
  gatewayOptions,
  gatewayPost,
  parseJson,
} from "./audit_helpers.ts";

const SLUG = "google-directions";

Deno.test({
  name: `${SLUG} — OPTIONS`,
  ignore: auditIgnore(),
  async fn() {
    const s = await gatewayOptions(SLUG);
    assertEquals([200, 204, 503].includes(s), true);
  },
});

Deno.test({
  name: `${SLUG} — POST without Bearer → 401`,
  ignore: auditIgnore(),
  async fn() {
    const { status } = await gatewayPost(
      SLUG,
      JSON.stringify({ waypoints: [] }),
      apikeyOnlyHeaders(),
    );
    assertEquals(status, 401);
  },
});

Deno.test({
  name: `${SLUG} — POST <2 waypoints → 400 (after validation order fix)`,
  ignore: auditIgnore(),
  async fn() {
    const { status } = await gatewayPost(
      SLUG,
      JSON.stringify({ waypoints: [{ id: "1", latitude: 0, longitude: 0, title: "A" }] }),
    );
    assertEquals(status, 400);
  },
});

Deno.test({
  name: `${SLUG} — POST valid waypoints (may 500 missing GOOGLE_MAPS_API_KEY / upstream)`,
  ignore: auditIgnore(),
  async fn() {
    const body = {
      waypoints: [
        { id: "1", latitude: 6.2442, longitude: -75.5812, title: "A" },
        { id: "2", latitude: 6.2518, longitude: -75.5636, title: "B" },
      ],
    };
    const { status, text } = await gatewayPost(SLUG, JSON.stringify(body));
    assertEquals([200, 500].includes(status), true);
    if (status === 500) {
      const j = parseJson(text) as { error?: string; success?: boolean };
      assertEquals(typeof j.error === "string" || typeof j.success === "boolean", true);
    }
  },
});
