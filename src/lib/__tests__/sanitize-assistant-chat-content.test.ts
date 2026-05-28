import { describe, expect, it } from "vitest";
import {
  isToolLeakJson,
  sanitizeAssistantChatContent,
  shouldHideAssistantChatContent,
  stripBalancedJsonObjects,
} from "../sanitize-assistant-chat-content";

const GROUNDING_SNIPPET =
  '{"results":[{"id":"ChIJAwOZ5ikoRI4RWqsKH3Ve1gI","title":"PERGAMINO Coffee Via Primavera","latitude":6.2083135,"longitude":-75.5671227,"placeId":"ChIJAwOZ5ikoRI4RWqsKH3Ve1gI","photoAuthorAttributions":[{"displayName":"PERGAMINO Café Via Primavera"}]}],"attribution":[{"source":"google_maps_grounding","placeUri":"https://maps.google.com/?cid=204454690216913754","title":"PERGAMINO Coffee Via Primavera"}],"source":"grounding","metadata":{"source":"grounding-lite","cafeQualityFilter":true}}';

describe("sanitizeAssistantChatContent", () => {
  it("detects grounding tool JSON", () => {
    expect(isToolLeakJson(JSON.parse(GROUNDING_SNIPPET))).toBe(true);
  });

  it("removes nested grounding JSON via brace balancing", () => {
    const prose = `Google Maps sources

PERGAMINO Coffee Via Primavera
Rituales Compañía de Café
${GROUNDING_SNIPPET}
{"success":true}`;

    const cleaned = sanitizeAssistantChatContent(prose);
    expect(cleaned).not.toContain('"placeId"');
    expect(cleaned).not.toContain('"source":"grounding"');
    expect(cleaned).not.toContain('"success":true');
    expect(cleaned).not.toContain("Google Maps sources");
    expect(cleaned).not.toContain("PERGAMINO Coffee Via Primavera");
  });

  it("keeps normal assistant prose", () => {
    const prose =
      "I found 5 Google-verified café candidates across Laureles and Poblado. Want laptop-friendly spots?";
    expect(sanitizeAssistantChatContent(prose)).toBe(prose);
  });

  it("keeps normal prose that mentions best option and next step", () => {
    const prose =
      "The best option for tonight is the salsa show in Poblado. Your next step is to book tickets early.";
    expect(sanitizeAssistantChatContent(prose)).toBe(prose);
    expect(shouldHideAssistantChatContent(prose)).toBe(false);
  });

  it("removes duplicated rental results boilerplate", () => {
    const prose = `Here are solid short-term rental options in Medellín:
**What I searched for**
under $33/night
**Best option**
Start with **Budget 1BR** — details in the first card.
**Next step**
Open **Details** for photos.`;
    expect(sanitizeAssistantChatContent(prose)).toBe("");
    expect(shouldHideAssistantChatContent(prose)).toBe(true);
  });

  it("hides content when only tool payload remains", () => {
    expect(shouldHideAssistantChatContent(GROUNDING_SNIPPET)).toBe(true);
    expect(shouldHideAssistantChatContent('{"success":true}')).toBe(true);
  });

  it("stripBalancedJsonObjects removes multiple blobs", () => {
    const raw = `ok {"success":true} tail ${GROUNDING_SNIPPET}`;
    const out = stripBalancedJsonObjects(raw, isToolLeakJson);
    expect(out.trim()).toBe("ok  tail");
  });
});
