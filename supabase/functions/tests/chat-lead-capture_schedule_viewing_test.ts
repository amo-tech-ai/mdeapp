import { assertEquals } from "jsr:@std/assert@1";
import {
  isScheduleViewingRequest,
  parsePreferredShowingAt,
} from "../_shared/schedule-viewing-bridge.ts";

Deno.test("parsePreferredShowingAt — datetime-local Bogota", () => {
  const iso = parsePreferredShowingAt("2026-06-15T14:00");
  assertEquals(typeof iso, "string");
  assertEquals(iso?.includes("2026-06-15"), true);
});

Deno.test("parsePreferredShowingAt — invalid", () => {
  assertEquals(parsePreferredShowingAt(""), null);
  assertEquals(parsePreferredShowingAt("not-a-date"), null);
});

Deno.test("isScheduleViewingRequest — rental + listing + preferred_at", () => {
  assertEquals(
    isScheduleViewingRequest("rental", "750e8400-e29b-41d4-a716-446655440001", "2026-06-01T10:00"),
    true,
  );
  assertEquals(isScheduleViewingRequest("host", "x", "2026-06-01T10:00"), false);
  assertEquals(isScheduleViewingRequest("rental", "x", ""), false);
});
