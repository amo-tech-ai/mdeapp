// @vitest-environment jsdom
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import { createRoot, type Root } from "react-dom/client";
import { act } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PartnerSignupWizard } from "@/components/partners/partner-signup-wizard";

const PARTNER_ID = "22222222-2222-4222-a222-222222222222";

const mocks = vi.hoisted(() => ({
  activatePartnerRequest: vi.fn(),
  push: vi.fn(),
}));

vi.mock("@/lib/partners/activate-client", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/lib/partners/activate-client")>();
  return {
    ...actual,
    activatePartnerRequest: mocks.activatePartnerRequest,
  };
});

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mocks.push }),
}));

const defaultProps = {
  partnerType: "host" as const,
  isAuthenticated: true,
  loginNextPath: "/partners/signup?type=host",
};

function setInputValue(input: HTMLInputElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    "value",
  )?.set;
  setter?.call(input, value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.dispatchEvent(new Event("change", { bubbles: true }));
}

function mountWizard(
  props: Partial<React.ComponentProps<typeof PartnerSignupWizard>> = {},
) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  let root!: Root;
  act(() => {
    root = createRoot(container);
    root.render(<PartnerSignupWizard {...defaultProps} {...props} />);
  });
  return {
    container,
    unmount: () => {
      act(() => {
        root.unmount();
      });
      document.body.removeChild(container);
    },
  };
}

/** Skip to the review step via the "Or fill in manually" link. */
const advanceToReview = async (container: HTMLElement) => {
  const manualLink = container.querySelector(
    '[data-testid="signup-wizard-manual-link"]',
  ) as HTMLElement;
  await act(() => {
    manualLink.click();
  });
};

/** Fill businessName + click Approve from the review step. */
const approveWithName = async (container: HTMLElement, name: string) => {
  const nameInput = container.querySelector(
    '[data-testid="signup-wizard-name-input"]',
  ) as HTMLInputElement;
  setInputValue(nameInput, name);
  const approveBtn = container.querySelector(
    '[data-testid="signup-wizard-approve-btn"]',
  ) as HTMLButtonElement;
  await act(async () => {
    approveBtn.click();
  });
};

describe("PartnerSignupWizard (static markup)", () => {
  it("shows auth gate when unauthenticated", () => {
    const html = renderToStaticMarkup(
      <PartnerSignupWizard
        partnerType="host"
        isAuthenticated={false}
        loginNextPath="/partners/signup?type=host"
      />,
    );
    expect(html).toContain('data-testid="partner-signup-auth-gate"');
    expect(html).toContain("/login?next=");
  });

  it("renders URL paste step (Step 2) as initial view when authenticated", () => {
    const html = renderToStaticMarkup(
      <PartnerSignupWizard
        partnerType="host"
        draftId="33333333-3333-4333-a333-333333333333"
        isAuthenticated
        loginNextPath="/partners/signup?type=host"
      />,
    );
    expect(html).toContain('data-testid="signup-wizard-step-url"');
    expect(html).toContain('data-testid="signup-wizard-analyze-btn"');
    expect(html).toContain('data-testid="signup-wizard-progress"');
  });

  it("initializes the category field from initialCategory when advancing to review", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    let root!: Root;
    act(() => {
      root = createRoot(container);
      root.render(
        <PartnerSignupWizard
          partnerType="venue"
          initialCategory="Restaurant"
          isAuthenticated
          loginNextPath="/partners/signup?type=venue&category=restaurant"
        />,
      );
    });

    act(() => {
      (
        container.querySelector(
          '[data-testid="signup-wizard-manual-link"]',
        ) as HTMLElement
      ).click();
    });

    const categoryInput = container.querySelector(
      '[data-testid="signup-wizard-category-input"]',
    ) as HTMLInputElement;
    expect(categoryInput?.value).toBe("Restaurant");

    act(() => root.unmount());
    document.body.removeChild(container);
  });

  it("does not show internal roadmap copy in the form footer", () => {
    const html = renderToStaticMarkup(
      <PartnerSignupWizard
        partnerType="host"
        isAuthenticated
        loginNextPath="/partners/signup?type=host"
      />,
    );
    expect(html).not.toContain("Phase 2");
    expect(html).not.toContain("co-pilot panel");
  });
});

describe("PartnerSignupWizard (submit flow)", () => {
  beforeEach(() => {
    mocks.activatePartnerRequest.mockReset();
    mocks.push.mockReset();
    window.history.pushState({}, "", "/partners/signup?type=host");
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("rejects whitespace-only business name", async () => {
    const { container, unmount } = mountWizard();
    await advanceToReview(container);
    // Business name is empty ("") when skipping URL step manually
    await approveWithName(container, "   ");

    expect(mocks.activatePartnerRequest).not.toHaveBeenCalled();
    expect(
      container.querySelector('[data-testid="partner-signup-error"]'),
    ).toBeTruthy();
    expect(container.textContent).toContain("Business name is required.");
    unmount();
  });

  it("shows API error when activation fails", async () => {
    mocks.activatePartnerRequest.mockResolvedValue({
      ok: false,
      status: 400,
      message: "Validation failed",
    });

    const { container, unmount } = mountWizard();
    await advanceToReview(container);
    await approveWithName(container, "Roof Events");

    expect(
      container.querySelector('[data-testid="partner-signup-error"]'),
    ).toBeTruthy();
    expect(container.textContent).toContain("Validation failed");
    unmount();
  });

  it("redirects to login when activation returns 401", async () => {
    mocks.activatePartnerRequest.mockResolvedValue({
      ok: false,
      status: 401,
      message: "Unauthorized",
    });

    const { container, unmount } = mountWizard();
    await advanceToReview(container);
    await approveWithName(container, "Roof Events");

    expect(mocks.push).toHaveBeenCalledWith(
      "/login?next=%2Fpartners%2Fsignup%3Ftype%3Dhost",
    );
    unmount();
  });

  it("shows deferred success when dashboard is not live", async () => {
    mocks.activatePartnerRequest.mockResolvedValue({
      ok: true,
      status: 201,
      created: true,
      data: {
        partnerId: PARTNER_ID,
        type: "host",
        status: "draft",
        redirectTo: "/dashboard",
      },
    });

    const { container, unmount } = mountWizard();
    await advanceToReview(container);
    await approveWithName(container, "Roof Events");

    expect(mocks.push).not.toHaveBeenCalled();
    expect(
      container.querySelector('[data-testid="partner-signup-success"]'),
    ).toBeTruthy();
    expect(container.textContent).toContain(PARTNER_ID);
    expect(
      container.querySelector('[data-testid="partner-signup-dashboard-next"]'),
    ).toBeTruthy();
    unmount();
  });

  it("redirects immediately when dashboard redirect is not deferred", async () => {
    mocks.activatePartnerRequest.mockResolvedValue({
      ok: true,
      status: 200,
      created: false,
      data: {
        partnerId: PARTNER_ID,
        type: "host",
        status: "draft",
        redirectTo: "/host/events",
      },
    });

    const { container, unmount } = mountWizard();
    await advanceToReview(container);
    await approveWithName(container, "Roof Events");

    expect(mocks.push).toHaveBeenCalledWith("/host/events");
    unmount();
  });
});
