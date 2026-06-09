import { assertEquals } from "jsr:@std/assert@1";
import { buildLeadCaptureInsert } from "../_shared/leads-capture.ts";

Deno.test("buildLeadCaptureInsert — anon rental with email and listing", () => {
  const row = buildLeadCaptureInsert({
    userId: null,
    conversationId: null,
    intent: "rental",
    email: "proof+lead@mdeai.test",
    neighborhood: "Laureles",
    listing_id: "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  });
  assertEquals(row.source, "chat_auto");
  assertEquals(row.user_id, null);
  assertEquals(row.conversation_id, null);
  assertEquals(row.email, "proof+lead@mdeai.test");
  assertEquals(row.metadata.neighborhood, "Laureles");
  assertEquals(row.metadata.apartment_id, "7c9e6679-7425-40de-944b-e07fc1f90ae7");
  assertEquals(row.status, "new");
});

Deno.test("buildLeadCaptureInsert — authed with conversation_id", () => {
  const uid = "550e8400-e29b-41d4-a716-446655440001";
  const cid = "550e8400-e29b-41d4-a716-446655440002";
  const row = buildLeadCaptureInsert({
    userId: uid,
    conversationId: cid,
    intent: "rental",
    email: "camila@test.com",
  });
  assertEquals(row.user_id, uid);
  assertEquals(row.conversation_id, cid);
});

Deno.test("buildLeadCaptureInsert — minimal metadata when only intent", () => {
  const row = buildLeadCaptureInsert({
    userId: null,
    conversationId: null,
    intent: "rental",
  });
  assertEquals(Object.keys(row.metadata).length, 0);
});
