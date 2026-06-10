---
name: vitest-component-testing
description: "Use when writing Vitest unit tests for React components in mdeai.co. Triggers: any new *.test.tsx file, any failing component test in JSDOM, any 'how do I test X component' question. Built on test-driven-development (skills.sh) + our actual test patterns from D2-D5."
metadata:
  source: https://skills.sh/ (test-driven-development)
  installed: 2026-04-29
  version: "0.1.0"
  origin: external + mdeai.co adaptations
  test_count_at_install: 86
---

# Vitest component testing — mdeai.co

Our test setup: **Vitest 3 + @testing-library/react + JSDOM + colocated `*.test.tsx` files**. Test count: 86 across 15 files (target: never regress).

## Stack-specific gotchas (must read before writing tests)

### 1. JSDOM is missing browser APIs that Radix uses

`src/test/setup.ts` polyfills these. Do NOT add them per-test:

- `ResizeObserver` (Radix Select uses it for menu sizing)
- `Element.prototype.scrollIntoView` (Radix Select scrolls highlighted item)
- `Element.prototype.hasPointerCapture` / `releasePointerCapture` / `setPointerCapture` (Radix Tooltip / Dropdown)
- `window.matchMedia` (anything with responsive hooks)

If you see `ResizeObserver is not defined` errors, your test is hitting a Radix primitive — the polyfill will catch it once `setup.ts` runs.

### 2. Mock supabase BEFORE importing the module under test

The real `@/integrations/supabase/client.ts` constructs a session at import time using `localStorage`. JSDOM's `localStorage` doesn't expose `getItem` the way the auth-helper expects — you'll get an unhandled rejection that fails the entire test FILE, not just the test.

```ts
import { describe, it, expect, vi } from "vitest";

// Order matters here — vi.mock has to register the mock factory before
// the module-under-test imports the supabase client at parse time.
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    storage: {
      from: () => ({
        upload: vi.fn(),
        getPublicUrl: () => ({ data: { publicUrl: "" } }),
        remove: vi.fn(),
      }),
    },
  },
}));

// NOW import the thing that imports the supabase client
import { uploadListingPhoto } from "./upload-listing-photo";
```

This pattern was a real bug in D4 — caught it via vitest's "unhandled rejection in test file" warning.

### 3. Wrap routing-aware components in MemoryRouter

Any component that uses `<Link>`, `useNavigate`, or `useLocation` must be wrapped:

```tsx
import { MemoryRouter } from "react-router-dom";

render(
  <MemoryRouter>
    <Step1Basics onSubmit={vi.fn()} />
  </MemoryRouter>,
);
```

### 4. shadcn `<Button asChild><Link>` renders the LINK as the button

`asChild` prop merges Button's className onto the child element. So:

```tsx
<Button asChild data-testid="step3-cta-listing">
  <Link to="/host/listings/new">List your first property</Link>
</Button>
```

…renders ONE element: `<a data-testid="step3-cta-listing" class="btn-classes" href="/host/listings/new">…</a>`.

Do NOT do `screen.getByTestId(...).querySelector('a')` — that returns null. Just check the testid'd element directly:

```ts
const cta = screen.getByTestId("step3-cta-listing");
expect(cta.tagName).toBe("A");
expect(cta).toHaveAttribute("href", "/host/listings/new");
```

## Test-writing checklist

For every new component test:

- [ ] **Contract first** — write a comment block at the top describing the 3-5 behaviors the test guards. Re-read after writing — every test should map to a contract bullet
- [ ] **Use accessible queries** — `getByRole`, `getByLabelText` over `getByTestId`. `data-testid` is for elements without a semantic role (drop zones, complex composites)
- [ ] **One behavior per `it()`** — if the description has "and", split it
- [ ] **Make Files real, not strings** — for file-upload tests:
  ```ts
  const file = new File([new Uint8Array(1024)], "x.pdf", { type: "application/pdf" });
  ```
- [ ] **`vi.fn()` for callbacks** — assert on `.toHaveBeenCalledWith(...)`, not `.toBeCalled()` (catches arg drift)
- [ ] **`fireEvent` for synthetic** + **`userEvent`** when you need realistic timing

## Reference: test files we've shipped

These are the canonical examples — copy from them when starting a new test:

| File | Lines | Pattern demonstrated |
|---|---|---|
| `src/components/auth/AccountTypeStep.test.tsx` | ~50 | Radio-group selection + onSelect callback |
| `src/components/host/onboarding/Step1Basics.test.tsx` | ~110 | react-hook-form + Zod validation rejection |
| `src/components/host/onboarding/Step2Verification.test.tsx` | ~80 | File-input MIME + size guards with real File objects |
| `src/components/host/onboarding/Step3Welcome.test.tsx` | ~60 | shadcn Button asChild Link href assertions |
| `src/components/host/listing/ListingForm/Step2Specs.test.tsx` | ~120 | Number-stepper bounds + amenity chip toggling |
| `src/hooks/host/useListingDraft.test.ts` | ~80 | Hook tests via `renderHook` + `act` + sessionStorage assertions |
| `src/lib/storage/upload-listing-photo.test.ts` | ~60 | Pre-import vi.mock pattern (see gotcha 2) |

## Companion skills

- `systematic-debugging` — when a test fails, run that loop before adding console.logs
- `claude-preview-browser-testing` — what unit tests can't catch (real network, real auth)
- `verification-before-completion` (skills.sh) — `npm run test` exit 0 doesn't mean done; verify the failing-case test you wrote actually fails when the bug is reintroduced
