// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";

/**
 * SAN-1209-FIX — Host OS body must never blank silently.
 *
 * Production incident: the unified Host OS shell rendered its header + nav but
 * the page body and Copilot rail went blank on /host/dashboard, /host/events
 * and /host/analytics. These tests lock in the defensive contract:
 *  - the persistent Copilot rail crashing does NOT take down the page body;
 *  - a page-body subtree crashing shows a labelled fallback, not a blank panel.
 *
 * Error boundaries only catch during the client commit phase, so we render with
 * `react-dom/client` (createRoot), not `renderToStaticMarkup`.
 */

// Toggle: make the mocked CopilotChat (the rail) throw on render.
const mocks = vi.hoisted(() => ({ railThrows: false, pathname: "/host/dashboard" }));

vi.mock("@copilotkit/react-core/v2", () => ({
  CopilotChat: () => {
    if (mocks.railThrows) {
      throw new Error("hostOpsAgent runtime connection failed");
    }
    return <div data-testid="copilot-chat-mock">chat</div>;
  },
}));

vi.mock("next/navigation", () => ({
  usePathname: () => mocks.pathname,
}));

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

import { HostOsBody } from "@/components/host/host-os-body";
import { HostErrorBoundary } from "@/components/host/host-error-boundary";

let container: HTMLElement;
let root: Root;
let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  mocks.railThrows = false;
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  // React logs caught boundary errors to console.error; silence + capture.
  consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  act(() => {
    root.unmount();
  });
  container.remove();
  consoleErrorSpy.mockRestore();
});

// skipcq: JS-0067 - module-local test helper; not browser global scope
function render(node: React.ReactElement): void {
  act(() => {
    root.render(node);
  });
}

// skipcq: JS-0067 - module-local test helper; not browser global scope
function Boom(): React.ReactElement {
  throw new Error("page body subtree exploded");
}

describe("HostErrorBoundary", () => {
  it("renders children when nothing throws", () => {
    render(
      <HostErrorBoundary label="unit" fallback={<span data-testid="fb">fallback</span>}>
        <span data-testid="child">ok</span>
      </HostErrorBoundary>,
    );
    expect(container.querySelector('[data-testid="child"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="fb"]')).toBeNull();
  });

  it("shows the fallback and logs a labelled breadcrumb when a child throws", () => {
    render(
      <HostErrorBoundary label="page-body" fallback={<span data-testid="fb">fallback</span>}>
        <Boom />
      </HostErrorBoundary>,
    );
    expect(container.querySelector('[data-testid="fb"]')).not.toBeNull();
    const loggedOurBreadcrumb = consoleErrorSpy.mock.calls.some(
      (call: unknown[]) =>
        typeof call[0] === "string" && call[0].includes("[host-os page-body crashed]"),
    );
    expect(loggedOurBreadcrumb).toBe(true);
  });
});

describe("HostOsBody", () => {
  it("renders the page body children and the chat region when healthy", () => {
    render(
      <HostOsBody routeLabel="Overview">
        <main data-testid="routed-page">dashboard body</main>
      </HostOsBody>,
    );
    expect(container.querySelector('[data-testid="routed-page"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="host-os-chat-region"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="copilot-chat-mock"]')).not.toBeNull();
  });

  it("keeps the page body rendered even when the Copilot rail crashes", () => {
    mocks.railThrows = true;
    render(
      <HostOsBody routeLabel="Analytics">
        <main data-testid="routed-page">analytics body</main>
      </HostOsBody>,
    );
    // The whole point of SAN-1209-FIX: body survives a rail crash.
    expect(container.querySelector('[data-testid="routed-page"]')).not.toBeNull();
    // Rail shows its fallback instead of a blank panel.
    expect(container.querySelector('[data-testid="host-os-chat-fallback"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="copilot-chat-mock"]')).toBeNull();
  });

  it("shows the body fallback (not a blank panel) when a routed page throws", () => {
    render(
      <HostOsBody routeLabel="Events">
        <Boom />
      </HostOsBody>,
    );
    expect(container.querySelector('[data-testid="host-os-body-fallback"]')).not.toBeNull();
    // The rail next to a crashed body is unaffected.
    expect(container.querySelector('[data-testid="copilot-chat-mock"]')).not.toBeNull();
  });

  it("recovers the body fallback on route change (boundary is not sticky)", () => {
    // One screen crashes...
    mocks.pathname = "/host/dashboard";
    render(
      <HostOsBody routeLabel="Overview">
        <Boom />
      </HostOsBody>,
    );
    expect(container.querySelector('[data-testid="host-os-body-fallback"]')).not.toBeNull();

    // ...navigating to a healthy screen must NOT stay stuck on the fallback.
    // The shell stays mounted; only the pathname-keyed boundary remounts.
    mocks.pathname = "/host/events";
    render(
      <HostOsBody routeLabel="Events">
        <main data-testid="routed-page">events body</main>
      </HostOsBody>,
    );
    expect(container.querySelector('[data-testid="host-os-body-fallback"]')).toBeNull();
    expect(container.querySelector('[data-testid="routed-page"]')).not.toBeNull();
  });
});
