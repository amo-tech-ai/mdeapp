import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { WebCitationList } from "../web-citation-list";

describe("WebCitationList", () => {
  it("renders badge and links", () => {
    const html = renderToStaticMarkup(
      <WebCitationList
        citations={[
          {
            title: "Event Guide",
            url: "https://example.com/event",
          },
        ]}
      />,
    );
    expect(html).toContain('data-testid="web-citation-badge"');
    expect(html).toContain("From the web");
    expect(html).toContain('data-testid="web-citation-link"');
    expect(html).toContain("https://example.com/event");
  });

  it("shows unverified when reason set and no citations", () => {
    const html = renderToStaticMarkup(
      <WebCitationList citations={[]} reason="no_grounding_metadata" />,
    );
    expect(html).toContain('data-testid="web-citation-unverified"');
  });

  it("hides when NEXT_PUBLIC_WEB_CITATIONS=false", () => {
    vi.stubEnv("NEXT_PUBLIC_WEB_CITATIONS", "false");
    const html = renderToStaticMarkup(
      <WebCitationList citations={[{ title: "X", url: "https://example.com" }]} />,
    );
    expect(html).toBe("");
    vi.unstubAllEnvs();
  });
});
