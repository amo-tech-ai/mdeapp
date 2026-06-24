import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { HomeNav } from "../home-nav";

describe("HomeNav", () => {
  it("renders Log in and Sign up links on desktop actions", () => {
    const html = renderToStaticMarkup(<HomeNav />);
    expect(html).toContain('href="/login"');
    expect(html).toContain('href="/signup"');
    expect(html).toContain("Log in");
    expect(html).toContain("Sign up");
  });
});
