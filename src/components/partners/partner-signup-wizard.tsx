"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition, useEffect } from "react";
import {
  ArrowRightIcon,
  CheckCircle2Icon,
  CheckIcon,
  CircleDotIcon,
  LoaderCircleIcon,
  MapPinIcon,
  SparklesIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  activateErrorMessage,
  activatePartnerRequest,
  buildActivatePayload,
  shouldDeferDashboardRedirect,
  type ActivatePartnerResponse,
  type PartnerSignupFormState,
} from "@/lib/partners/activate-client";
import { PARTNER_TYPE_LABELS } from "@/lib/partners/parse-partner-signup-params";
import type { PartnerType } from "@/lib/partners/partner-types";

type PartnerSignupWizardProps = {
  partnerType: PartnerType;
  draftId?: string;
  initialCategory?: string;
  isAuthenticated: boolean;
  loginNextPath: string;
};

type WizardStep = "url" | "analyzing" | "review";

type ViewState =
  | { kind: "form"; step: WizardStep }
  | { kind: "loading" }
  | {
      kind: "success";
      created: boolean;
      data: ActivatePartnerResponse;
      dashboardDeferred: boolean;
    }
  | { kind: "error"; message: string; step: WizardStep };

const ANALYZE_ROWS = [
  "Reading your page",
  "Finding your location on the map",
  "Drafting your listing",
  "Checking it against Google",
] as const;

// Step numbers: type picker = 1 (done before wizard mounts), url = 2, analyzing = 3, review = 4
const STEP_NUMBER: Record<WizardStep, number> = {
  url: 2,
  analyzing: 3,
  review: 4,
};
const TOTAL_STEPS = 4;

function WizardStepBar({ step }: { step: WizardStep | "done" }) {
  const shown = step === "done" ? TOTAL_STEPS : (STEP_NUMBER[step] ?? TOTAL_STEPS);
  return (
    <div className="flex items-center gap-3 px-4 py-3 sm:px-6" aria-label="Signup progress">
      <div
        className="flex flex-1 gap-1.5"
        role="progressbar"
        aria-valuenow={shown}
        aria-valuemin={1}
        aria-valuemax={TOTAL_STEPS}
        aria-valuetext={`Step ${shown} of ${TOTAL_STEPS}`}
        data-testid="signup-wizard-progress"
      >
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors duration-300",
              shown >= n ? "bg-primary" : "bg-muted",
            )}
          />
        ))}
      </div>
      <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
        {step === "done" ? "Done" : `Step ${shown} of ${TOTAL_STEPS}`}
      </span>
    </div>
  );
}

function SourceChip({
  children,
  active,
}: {
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium",
        active
          ? "border-primary/30 bg-primary/10 text-primary"
          : "border-border bg-muted/40 text-muted-foreground",
      )}
    >
      {active && <CheckIcon className="size-3" aria-hidden="true" />}
      {children}
    </span>
  );
}

function WizardDraftCard({ partnerType }: { partnerType: PartnerType }) {
  const label = PARTNER_TYPE_LABELS[partnerType];
  return (
    <Card data-testid="signup-wizard-draft-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent/15">
            <SparklesIcon className="size-5 text-accent" aria-hidden="true" />
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary" className="text-xs">Example</Badge>
            <Badge variant="outline" className="gap-1 text-xs text-accent border-accent/30 bg-accent/5">
              <span aria-hidden="true">✦</span> AI draft
            </Badge>
          </div>
        </div>
        <CardTitle className="text-xl">Alma Rooftop</CardTitle>
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="secondary">Rooftop bar</Badge>
          <Badge variant="secondary">Provenza</Badge>
          <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">Open now</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 text-sm">
        <div className="flex items-baseline justify-between border-b border-border pb-2">
          <span className="text-muted-foreground">Category</span>
          <span className="font-medium">Bar · Rooftop</span>
        </div>
        <div className="flex items-baseline justify-between border-b border-border pb-2">
          <span className="text-muted-foreground">Address</span>
          <span className="font-medium">Cra. 35 #8A, Provenza</span>
        </div>
        <div className="flex items-baseline justify-between border-b border-border pb-2">
          <span className="text-muted-foreground">Hours</span>
          <span className="font-medium">Tue–Sun · 5pm–2am</span>
        </div>
        <div className="flex items-baseline justify-between border-b border-border pb-2">
          <span className="text-muted-foreground">Capacity</span>
          <span className="rounded-md bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
            Data pending
          </span>
        </div>
        <div className="flex items-baseline justify-between pb-2">
          <span className="text-muted-foreground">Pricing</span>
          <span className="rounded-md bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
            Data pending
          </span>
        </div>
        <p className="rounded-lg border border-dashed border-border bg-muted/40 p-3 text-xs leading-relaxed text-muted-foreground">
          <span className="mr-1 text-accent">✦</span>
          Drafted description: &ldquo;A lively rooftop in the heart of Provenza for cocktails and city views.&rdquo;{" "}
          <em>Edit before publishing.</em>
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <MapPinIcon className="size-3.5 text-accent" aria-hidden="true" />
          Located on the map · grounded in Google Maps
        </div>
        <p className="text-xs text-muted-foreground">
          This is a sample {label.toLowerCase()} profile. Your real data will appear here after AI extraction.
        </p>
      </CardContent>
    </Card>
  );
}

function WizardVisibilityCard() {
  const fields = [
    { key: "name", label: "Business name", weight: 10, done: true },
    { key: "category", label: "Category", weight: 10, done: true },
    { key: "address", label: "Address", weight: 10, done: true },
    { key: "hours", label: "Opening hours", weight: 10, done: true },
    { key: "description", label: "Description", weight: 10, done: true },
    { key: "mapPin", label: "Map pin", weight: 5, done: true },
    { key: "socials", label: "Social links", weight: 7, done: true },
    { key: "amenities", label: "Amenities", weight: 10, done: true },
    { key: "photos", label: "Add 3+ photos", weight: 15, done: false },
    { key: "menu", label: "Add menu / booking link", weight: 8, done: false },
    { key: "whatsapp", label: "Connect WhatsApp", weight: 5, done: false },
  ] as const;

  const [done, setDone] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(fields.map((f) => [f.key, f.done])),
  );

  const total = fields.reduce((s, f) => s + f.weight, 0);
  const score = Math.round(
    fields.filter((f) => done[f.key]).reduce((s, f) => s + f.weight, 0) / total * 100,
  );
  const missing = fields.filter((f) => !done[f.key]);

  return (
    <Card data-testid="signup-wizard-visibility">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-baseline justify-between text-base">
          <span>Visibility score</span>
          <span className="font-mono text-xl tabular-nums text-primary" data-testid="signup-wizard-score">
            {score}%
          </span>
        </CardTitle>
        <CardDescription className="text-xs">
          {missing.length > 0
            ? `Potential 100% · +${100 - score} available`
            : "Fully optimized"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div
          className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuenow={score}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-500 motion-reduce:transition-none"
            style={{ width: `${score}%` }}
          />
        </div>
        {missing.length > 0 && (
          <ul className="flex flex-col gap-2">
            {missing.map((f) => (
              <li key={f.key} className="flex items-center gap-2 text-xs" data-testid={`signup-wizard-opt-${f.key}`}>
                <span className="font-mono tabular-nums text-primary">+{f.weight}</span>
                <span className="flex-1 text-muted-foreground">{f.label}</span>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-6 px-2 text-xs"
                  onClick={() => setDone((d) => ({ ...d, [f.key]: true }))}
                  data-testid={`signup-wizard-opt-add-${f.key}`}
                >
                  Add
                </Button>
              </li>
            ))}
          </ul>
        )}
        <p className="text-xs text-muted-foreground">
          Score = % of fields complete — deterministic, never estimated. AI can draft a field; you approve before it counts.
        </p>
      </CardContent>
    </Card>
  );
}

function WizardConciergePreview() {
  return (
    <Card data-testid="signup-wizard-concierge-preview">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <span className="text-accent" aria-hidden="true">✦</span>
          Concierge preview
          <Badge variant="secondary" className="ml-auto text-xs">Example</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="ml-auto w-fit rounded-2xl rounded-br-sm bg-accent/15 px-3 py-2 text-sm text-foreground">
          Best rooftop for cocktails near Provenza tonight?
        </div>
        <div className="rounded-xl border border-border bg-muted/30 p-3">
          <div className="flex items-start gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent/15">
              <MapPinIcon className="size-4 text-accent" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">Alma Rooftop</p>
              <p className="text-xs text-muted-foreground">Rooftop bar · Provenza · open now</p>
            </div>
            <span className="shrink-0 rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
              Book
            </span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Why it&apos;s recommended: matches{" "}
            <span className="font-medium text-foreground">&ldquo;rooftop&rdquo;</span> +{" "}
            <span className="font-medium text-foreground">&ldquo;cocktails&rdquo;</span>, open now, a 4-minute walk away.
          </p>
        </div>
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <CheckIcon className="size-3.5 text-primary" aria-hidden="true" />
          Grounded in Google Maps · example preview — your real listing appears here after approval
        </p>
      </CardContent>
    </Card>
  );
}

export function PartnerSignupWizard({
  partnerType,
  draftId,
  initialCategory,
  isAuthenticated,
  loginNextPath,
}: PartnerSignupWizardProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [view, setView] = useState<ViewState>({ kind: "form", step: "url" });
  const [businessUrl, setBusinessUrl] = useState("");
  const [analyzeProgress, setAnalyzeProgress] = useState(0);
  const [form, setForm] = useState<PartnerSignupFormState>({
    businessName: "",
    category: initialCategory ?? "",
    neighborhood: "",
  });

  const typeLabel = PARTNER_TYPE_LABELS[partnerType];
  const loginHref = `/login?next=${encodeURIComponent(loginNextPath)}`;

  // Analyzing animation: 4 rows, ~600ms each, then transition to review
  useEffect(() => {
    if (view.kind !== "form" || view.step !== "analyzing") return;
    setAnalyzeProgress(0);
    const t1 = setTimeout(() => setAnalyzeProgress(1), 600);
    const t2 = setTimeout(() => setAnalyzeProgress(2), 1200);
    const t3 = setTimeout(() => setAnalyzeProgress(3), 1800);
    const t4 = setTimeout(() => {
      setAnalyzeProgress(4);
      // Pre-fill form with example "AI extracted" data (real data comes from SAN-1194 · PTR-AI-001)
      setForm({
        businessName: "Alma Rooftop",
        category: "Bar · Rooftop",
        neighborhood: "Provenza",
      });
      setView({ kind: "form", step: "review" });
    }, 2500);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, [view]);

  function updateField<K extends keyof PartnerSignupFormState>(
    key: K,
    value: PartnerSignupFormState[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleApprove() {
    if (!isAuthenticated) return;
    if (!form.businessName.trim()) {
      setView({ kind: "error", message: "Business name is required.", step: "review" });
      return;
    }
    setView({ kind: "loading" });
    startTransition(async () => {
      try {
        const payload = buildActivatePayload(partnerType, form, draftId);
        const result = await activatePartnerRequest(payload);

        if (!result.ok) {
          if (result.status === 401) {
            const next =
              typeof window !== "undefined"
                ? `${window.location.pathname}${window.location.search}`
                : loginNextPath;
            router.push(`/login?next=${encodeURIComponent(next)}`);
            return;
          }
          setView({
            kind: "error",
            message: activateErrorMessage(result.status, result.message),
            step: "review",
          });
          return;
        }

        const dashboardDeferred = shouldDeferDashboardRedirect(result.data.redirectTo);
        if (!dashboardDeferred) {
          router.push(result.data.redirectTo);
          return;
        }

        setView({
          kind: "success",
          created: result.created,
          data: result.data,
          dashboardDeferred: true,
        });
      } catch {
        setView({ kind: "error", message: "Something went wrong. Please try again.", step: "review" });
      }
    });
  }

  // ── Auth gate ──────────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <Card className="w-full max-w-md shadow-sm" data-testid="partner-signup-auth-gate">
        <CardHeader>
          <Badge variant="secondary" className="mb-1 w-fit">{typeLabel}</Badge>
          <CardTitle>Sign in to continue</CardTitle>
          <CardDescription>
            Create your {typeLabel.toLowerCase()} partner profile after you sign in. We&apos;ll bring you back here.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button size="lg" className="w-full" nativeButton={false} render={<Link href={loginHref} />}>
            Sign in
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            No account?{" "}
            <Link
              href="/signup"
              className="font-medium text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Create one
            </Link>
          </p>
        </CardContent>
      </Card>
    );
  }

  // ── Success (done state) ───────────────────────────────────────────────────
  if (view.kind === "success") {
    return (
      <div className="w-full max-w-2xl" data-testid="partner-signup-success">
        <WizardStepBar step="done" />
        <div className="flex flex-col items-center gap-4 px-4 py-8 text-center sm:px-8">
          <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CheckCircle2Icon className="size-7" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">You&apos;re listed.</h1>
          <Badge variant="secondary" className="gap-1.5 border border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400">
            <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
            In review · live within ~24h
          </Badge>
          <p className="max-w-md text-sm text-muted-foreground">
            You approved the draft. A quick human check keeps the concierge trustworthy — your listing is usually live within 24 hours.
          </p>
        </div>

        <div className="grid gap-4 px-4 sm:grid-cols-2 sm:px-8">
          <Card data-testid="partner-signup-created-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-base">
                What we created
                <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">Ready</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-2 text-sm">
                {["Your listing + map pin", "A grounded concierge profile", "2 draft social posts (await your OK)"].map(
                  (item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckIcon className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                      {item}
                    </li>
                  ),
                )}
              </ul>
            </CardContent>
          </Card>

          <Card data-testid="partner-signup-activate-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Activate your listing</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-2 text-sm">
                {[
                  { label: "Listing drafted & approved", done: true },
                  { label: "Verify your email", done: false },
                  { label: "Add 3+ photos (+15)", done: false },
                  { label: "Connect WhatsApp (+5)", done: false },
                  { label: "Publish your first event", done: false },
                ].map((item) => (
                  <li key={item.label} className="flex items-start gap-2">
                    <span
                      className={cn(
                        "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border",
                        item.done
                          ? "border-primary bg-primary/10"
                          : "border-border bg-transparent",
                      )}
                      aria-hidden="true"
                    >
                      {item.done && <CheckIcon className="size-2.5 text-primary" />}
                    </span>
                    <span className={item.done ? "text-foreground" : "text-muted-foreground"}>
                      {item.label}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-3 px-4 pb-8 pt-6 sm:flex-row sm:px-8">
          <Button
            size="lg"
            className="flex-1"
            nativeButton={false}
            render={<Link href="/partners" data-testid="partner-signup-preview-listing" />}
          >
            Preview your listing
            <ArrowRightIcon className="size-4" aria-hidden="true" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="flex-1"
            nativeButton={false}
            render={<Link href="/host/dashboard" data-testid="partner-signup-go-dashboard" />}
          >
            Go to dashboard
          </Button>
        </div>

        <p className="px-4 pb-2 text-center text-xs text-muted-foreground sm:px-8">
          Listing ID:{" "}
          <span className="font-mono" data-testid="partner-signup-listing-id">
            {view.data.partnerId}
          </span>
        </p>
        {view.dashboardDeferred && (
          <p className="px-4 pb-6 text-center text-xs text-muted-foreground sm:px-8" data-testid="partner-signup-dashboard-next">
            Dashboard coming next — we&apos;ll take you there as soon as it launches.
          </p>
        )}
      </div>
    );
  }

  // ── Loading ────────────────────────────────────────────────────────────────
  if (view.kind === "loading") {
    return (
      <div className="flex w-full max-w-md items-center justify-center gap-3 py-16 text-sm text-muted-foreground" data-testid="partner-signup-loading">
        <LoaderCircleIcon className="size-5 animate-spin" aria-hidden="true" />
        Activating your account…
      </div>
    );
  }

  const currentStep = view.step;
  const errorMessage = view.kind === "error" ? view.message : null;

  // ── Step 2: URL paste ──────────────────────────────────────────────────────
  if (currentStep === "url") {
    return (
      <div className="w-full max-w-lg" data-testid="signup-wizard-step-url">
        <WizardStepBar step="url" />
        <div className="flex flex-col gap-6 px-4 py-8 sm:px-8">
          <div>
            <p className="mb-1 text-sm font-semibold text-primary">{typeLabel}</p>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Paste a link and we&apos;ll do the rest.
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Drop your website or Google Business profile — AI drafts your listing from it. You approve everything before it goes live.
            </p>
          </div>

          {errorMessage && (
            <p
              className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
              role="alert"
              data-testid="partner-signup-error"
            >
              {errorMessage}
            </p>
          )}

          <div className="flex gap-2">
            <Input
              value={businessUrl}
              onChange={(e) => setBusinessUrl(e.target.value)}
              placeholder="https://your-business.co"
              aria-label="Your business URL"
              data-testid="signup-wizard-url-input"
              onKeyDown={(e) => {
                if (e.key === "Enter" && businessUrl.trim()) {
                  setView({ kind: "form", step: "analyzing" });
                }
              }}
            />
            <Button
              disabled={!businessUrl.trim()}
              onClick={() => setView({ kind: "form", step: "analyzing" })}
              data-testid="signup-wizard-analyze-btn"
              data-analytics-event="partner_signup_analyze"
            >
              Analyze
              <ArrowRightIcon className="size-4" aria-hidden="true" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <SourceChip active>Website</SourceChip>
            <SourceChip active>Google Business</SourceChip>
            <SourceChip>Instagram</SourceChip>
            <SourceChip>Airbnb</SourceChip>
            <SourceChip>Booking</SourceChip>
            <SourceChip>Eventbrite</SourceChip>
          </div>

          <div className="relative flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <button
            type="button"
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-background px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => setView({ kind: "form", step: "analyzing" })}
            data-analytics-event="partner_signup_google"
            data-testid="signup-wizard-google-btn"
          >
            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35 24 35c-6.1 0-11-4.9-11-11s4.9-11 11-11c2.8 0 5.4 1.1 7.3 2.9l5.7-5.7C33.5 6.2 28.9 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c2.8 0 5.4 1.1 7.3 2.9l5.7-5.7C33.5 6.2 28.9 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
              <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35 26.7 36 24 36c-5.3 0-9.7-3.6-11.3-8.4l-6.5 5C9.5 39.6 16.2 44 24 44z" />
              <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.6l6.2 5.2c-.4.4 6.6-4.8 6.6-14.8 0-1.3-.1-2.3-.4-3.5z" />
            </svg>
            Continue with Google
          </button>

          <button
            type="button"
            className="text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => setView({ kind: "form", step: "review" })}
            data-testid="signup-wizard-manual-link"
          >
            Or fill it in manually →
          </button>
        </div>
      </div>
    );
  }

  // ── Step 3: Analyzing ──────────────────────────────────────────────────────
  if (currentStep === "analyzing") {
    return (
      <div className="w-full max-w-lg" data-testid="signup-wizard-step-analyzing">
        <WizardStepBar step="analyzing" />
        <div className="flex flex-col gap-6 px-4 py-8 sm:px-8">
          <div>
            <p className="mb-1 text-sm font-semibold text-accent">✦ Working on it</p>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Turning your link into a listing…
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Reading your page and grounding it in real places. This takes a few seconds.
            </p>
          </div>

          <div className="flex flex-col gap-3" data-testid="signup-wizard-analyze-rows">
            {ANALYZE_ROWS.map((row, i) => {
              const done = analyzeProgress > i;
              const active = analyzeProgress === i;
              return (
                <div
                  key={row}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border px-4 py-3 text-sm transition-colors duration-300",
                    done
                      ? "border-primary/20 bg-primary/5 text-foreground"
                      : active
                        ? "border-border bg-background text-foreground"
                        : "border-border bg-background text-muted-foreground",
                  )}
                  data-testid={`signup-wizard-analyze-row-${i}`}
                >
                  <span className="shrink-0">
                    {done ? (
                      <CheckCircle2Icon className="size-4 text-primary" aria-hidden="true" />
                    ) : active ? (
                      <LoaderCircleIcon className="size-4 animate-spin text-primary" aria-hidden="true" />
                    ) : (
                      <CircleDotIcon className="size-4 text-muted-foreground/40" aria-hidden="true" />
                    )}
                  </span>
                  {row}
                </div>
              );
            })}
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Press <kbd className="rounded border border-border px-1.5 py-0.5 font-mono text-xs">Esc</kbd> to cancel
          </p>
        </div>
      </div>
    );
  }

  // ── Step 4: Review & approve ───────────────────────────────────────────────
  return (
    <div className="w-full max-w-4xl" data-testid="signup-wizard-step-review">
      <WizardStepBar step="review" />

      <div className="flex flex-col gap-6 px-4 py-8 sm:px-8">
        <div>
          <p className="mb-1 text-sm font-semibold text-primary">Review &amp; approve</p>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            From a link to a live-ready listing.
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            AI drafted this from your page. Check it over —{" "}
            <strong>nothing goes live until you approve</strong>. Anything we couldn&apos;t verify is marked &ldquo;data pending&rdquo;, never guessed.
          </p>
        </div>

        {/* Before → After transform strip */}
        <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3 text-xs" data-testid="signup-wizard-transform">
          <div>
            <span className="font-semibold text-muted-foreground">Before</span>
            <br />
            <span className="text-muted-foreground">Just a link — {businessUrl || "almarooftop.co"}</span>
          </div>
          <ArrowRightIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <div>
            <span className="font-semibold text-foreground">After · seconds</span>
            <br />
            <span className="text-muted-foreground">A listing, map pin, visibility score &amp; concierge preview</span>
          </div>
        </div>

        {errorMessage && (
          <p
            className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            role="alert"
            data-testid="partner-signup-error"
          >
            {errorMessage}
          </p>
        )}

        {/* Draft grid: left card + right aside */}
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <WizardDraftCard partnerType={partnerType} />

          <div className="flex flex-col gap-4">
            <WizardVisibilityCard />
            <WizardConciergePreview />
          </div>
        </div>

        {/* Optional: manual edit fields (used when "fill in manually" was chosen) */}
        <details className="group">
          <summary className="cursor-pointer list-none text-sm font-medium text-primary underline-offset-4 hover:underline" data-testid="signup-wizard-edit-details-toggle">
            Edit details
          </summary>
          <Card className="mt-3">
            <CardContent className="pt-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="wizBusinessName">Business name</Label>
                  <Input
                    id="wizBusinessName"
                    name="businessName"
                    value={form.businessName}
                    onChange={(e) => updateField("businessName", e.target.value)}
                    autoComplete="organization"
                    placeholder="Roof Events Medellín"
                    data-testid="signup-wizard-name-input"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="wizCategory">Category</Label>
                  <Input
                    id="wizCategory"
                    name="category"
                    value={form.category ?? ""}
                    onChange={(e) => updateField("category", e.target.value)}
                    placeholder="e.g., Restaurant, Café"
                    data-testid="signup-wizard-category-input"
                  />
                </div>
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <Label htmlFor="wizNeighborhood">Neighborhood</Label>
                  <Input
                    id="wizNeighborhood"
                    name="neighborhood"
                    value={form.neighborhood ?? ""}
                    onChange={(e) => updateField("neighborhood", e.target.value)}
                    placeholder="Provenza"
                    data-testid="signup-wizard-neighborhood-input"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </details>

        <input type="hidden" name="type" value={partnerType} readOnly />
        {draftId && <input type="hidden" name="draftId" value={draftId} readOnly />}

        {/* CTAs */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button
            size="lg"
            onClick={handleApprove}
            disabled={pending}
            data-testid="signup-wizard-approve-btn"
            data-analytics-event="partner_signup_approve"
          >
            Approve &amp; publish
            <ArrowRightIcon className="size-4" aria-hidden="true" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => setView({ kind: "form", step: "url" })}
            data-testid="signup-wizard-back-to-url-btn"
          >
            Edit details
          </Button>
          <span className="text-xs text-muted-foreground">
            You&apos;re in control — approve before anything is live.
          </span>
        </div>
      </div>
    </div>
  );
}
