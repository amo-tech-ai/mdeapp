import { assertEquals } from "jsr:@std/assert@1";
import {
  apikeyOnlyHeaders,
  auditIgnore,
  edgeTestJwt,
  gatewayAnonHeaders,
  gatewayOptions,
  gatewayPost,
  parseJson,
  userJwtHeaders,
} from "./audit_helpers.ts";

const SLUG = "sponsor-roi-explain";

const fakeAppId = "00000000-0000-4000-8000-000000000099";

function postBody(): string {
  return JSON.stringify({ application_id: fakeAppId });
}

Deno.test({
  name: `${SLUG}  -  OPTIONS`,
  ignore: auditIgnore(),
  async fn() {
    assertEquals([200, 204, 503].includes(await gatewayOptions(SLUG)), true);
  },
});

Deno.test({
  name: `${SLUG}  -  apikey-only (no Bearer) -> 401`,
  ignore: auditIgnore(),
  async fn() {
    const { status, text } = await gatewayPost(SLUG, postBody(), apikeyOnlyHeaders());
    assertEquals(status, 401);
    const j = parseJson(text) as {
      success?: boolean;
      error?: { code?: string };
      msg?: string;
    };
    // Kong may reject before the edge function (msg), or the function returns errorBody.
    if (typeof j.msg === "string") {
      assertEquals(j.msg.includes("Bearer") || j.msg.includes("Auth header"), true);
    } else {
      assertEquals(j.success, false);
      assertEquals(j.error?.code, "UNAUTHORIZED");
    }
  },
});

Deno.test({
  name: `${SLUG}  -  anon gateway JWT not a sponsor session -> 401 UNAUTHORIZED`,
  ignore: auditIgnore(),
  async fn() {
    const { status, text } = await gatewayPost(SLUG, postBody());
    assertEquals(status, 401);
    const j = parseJson(text) as { error?: { code?: string } };
    assertEquals(j.error?.code, "UNAUTHORIZED");
  },
});

Deno.test({
  name: `${SLUG}  -  garbage JWT segments -> 401 (Kong or edge)`,
  ignore: auditIgnore(),
  async fn() {
    const h = gatewayAnonHeaders();
    h.set("Authorization", "Bearer not.a.validjwt");
    const { status, text } = await gatewayPost(SLUG, postBody(), h);
    assertEquals(status, 401);
    const j = parseJson(text) as { error?: { code?: string }; msg?: string };
    if (typeof j.msg === "string") {
      assertEquals(
        j.msg.includes("Token") || j.msg.includes("Invalid"),
        true,
      );
    } else {
      assertEquals(j.error?.code, "UNAUTHORIZED");
    }
  },
});

Deno.test({
  name: `${SLUG}  -  lowercase bearer prefix (Kong requires 'Bearer')`,
  ignore: auditIgnore(),
  async fn() {
    const token = gatewayAnonHeaders().get("Authorization")!.replace(/^Bearer\s+/i, "").trim();
    const h = gatewayAnonHeaders();
    h.set("Authorization", `bearer ${token}`);
    const { status, text } = await gatewayPost(SLUG, postBody(), h);
    assertEquals(status, 401);
    const j = parseJson(text) as { msg?: string; error?: { code?: string } };
    if (typeof j.msg === "string") {
      assertEquals(j.msg.includes("Bearer") || j.msg.includes("Auth header"), true);
    } else {
      assertEquals(j.error?.code, "UNAUTHORIZED");
    }
  },
});

Deno.test({
  name: `${SLUG}  -  EDGE_TEST_USER_JWT random app -> 403 or 404`,
  ignore: auditIgnore() || !edgeTestJwt(),
  async fn() {
    const { status } = await gatewayPost(SLUG, postBody(), userJwtHeaders(edgeTestJwt()));
    assertEquals([403, 404].includes(status), true);
  },
});
