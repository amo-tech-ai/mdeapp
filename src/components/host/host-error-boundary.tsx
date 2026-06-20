"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

/**
 * SAN-1209-FIX — Host OS error isolation.
 *
 * Production incident: the unified Host OS shell rendered its header + nav, but
 * the page body (and the Copilot rail) went blank on /host/dashboard,
 * /host/events and /host/analytics. A throw inside the shared client subtree
 * (e.g. the persistent <CopilotChat>/hostOpsAgent runtime connection) unmounted
 * to the nearest boundary — and there was none — so React discarded the body
 * silently. No fallback, no console breadcrumb.
 *
 * This boundary makes any such crash *visible and contained*: the rest of the
 * page keeps rendering, the operator sees a labelled fallback, and the real
 * error is logged so prod can be diagnosed without a debugger. Roberto never
 * stares at a blank screen because one widget threw.
 *
 * Class component because React error boundaries require it; there is no hooks
 * equivalent for componentDidCatch.
 */

type HostErrorBoundaryProps = {
  children: ReactNode;
  /** Rendered in place of the crashed subtree. */
  fallback: ReactNode;
  /** Short label used in the console breadcrumb (e.g. "copilot-rail"). */
  label: string;
};

type HostErrorBoundaryState = {
  hasError: boolean;
};

// skipcq: JS-0067 - ES module export; not browser global scope
export class HostErrorBoundary extends Component<
  HostErrorBoundaryProps,
  HostErrorBoundaryState
> {
  state: HostErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): HostErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // Diagnostic breadcrumb — survives minified prod builds (no dev overlay).
    console.error(`[host-os ${this.props.label} crashed]`, {
      message: error.message,
      stack: error.stack,
      componentStack: info.componentStack,
    });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
