import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { EventHostBlock } from "../event-host-block";

describe("EventHostBlock", () => {
  it("renders hosted-by label and host name", () => {
    const html = renderToStaticMarkup(
      <EventHostBlock host={{ name: "Ana Martinez", avatarUrl: null }} />,
    );
    expect(html).toContain('data-testid="event-host-block"');
    expect(html).toContain("Hosted by");
    expect(html).toContain("Ana Martinez");
  });

  it("renders host block when avatar url is provided", () => {
    const html = renderToStaticMarkup(
      <EventHostBlock
        host={{
          name: "Ana Martinez",
          avatarUrl: "https://example.com/avatar.png",
        }}
      />,
    );
    expect(html).toContain('data-testid="event-host-block"');
    expect(html).toContain("Ana Martinez");
  });

  it("renders fallback initials when avatar url is missing", () => {
    const html = renderToStaticMarkup(
      <EventHostBlock host={{ name: "Ana Martinez", avatarUrl: null }} />,
    );
    expect(html).toContain("AM");
  });
});
