import { assertEquals } from "jsr:@std/assert@1";
import {
  buildToolChoice,
  resolveForcedLeadToolName,
  resolveForcedToolName,
} from "../_shared/chat-tool-choice.ts";

Deno.test("resolveForcedToolName — rentals before events (show me rentals)", () => {
  const prompt = "Show me 5 rentals in Laureles with map pins";
  assertEquals(resolveForcedToolName(prompt), "search_apartments");
  const choice = buildToolChoice(prompt) as { type: string; function: { name: string } };
  assertEquals(choice.function.name, "search_apartments");
});

Deno.test("resolveForcedToolName — top rentals in Laureles", () => {
  assertEquals(
    resolveForcedToolName("top rentals in Laureles"),
    "search_apartments",
  );
});

Deno.test("resolveForcedToolName — events without stealing show", () => {
  assertEquals(
    resolveForcedToolName("What events are on this weekend?"),
    "search_events",
  );
});

Deno.test("resolveForcedToolName — ambiguous auto", () => {
  assertEquals(buildToolChoice("hello"), "auto");
});

Deno.test("resolveForcedLeadToolName — contact host", () => {
  const prompt =
    "I want to contact the host for the first one. My email is proof+lead@mdeai.test";
  assertEquals(resolveForcedLeadToolName(prompt), "capture_lead");
  const choice = buildToolChoice(prompt) as { type: string; function: { name: string } };
  assertEquals(choice.function.name, "capture_lead");
});

Deno.test("resolveForcedLeadToolName — lead wins over rental keywords", () => {
  const prompt = "contact me about rentals in Laureles, email me@test.com";
  const choice = buildToolChoice(prompt) as { type: string; function: { name: string } };
  assertEquals(choice.function.name, "capture_lead");
});
