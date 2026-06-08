"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { CheckCircle2Icon } from "lucide-react";
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
  /** Prefills the Category field when the hub passes ?category= (venue subtypes). */
  initialCategory?: string;
  isAuthenticated: boolean;
  loginNextPath: string;
};

type ViewState =
  | { kind: "form" }
  | { kind: "loading" }
  | {
      kind: "success";
      created: boolean;
      data: ActivatePartnerResponse;
      dashboardDeferred: boolean;
    }
  | { kind: "error"; message: string };

function PartnerTypeBadge({ label }: { label: string }) {
  return (
    <Badge variant="secondary" className="mb-2 w-fit">
      {label}
    </Badge>
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
  const [view, setView] = useState<ViewState>({ kind: "form" });
  const [form, setForm] = useState<PartnerSignupFormState>({
    businessName: "",
    category: initialCategory ?? "",
    neighborhood: "",
  });

  const typeLabel = PARTNER_TYPE_LABELS[partnerType];
  const loginHref = `/login?next=${encodeURIComponent(loginNextPath)}`;

  function updateField<K extends keyof PartnerSignupFormState>(
    key: K,
    value: PartnerSignupFormState[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isAuthenticated) return;

    const businessName = form.businessName.trim();
    if (!businessName) {
      setView({
        kind: "error",
        message: "Business name is required.",
      });
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
          });
          return;
        }

        const dashboardDeferred = shouldDeferDashboardRedirect(
          result.data.redirectTo,
        );

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
        setView({
          kind: "error",
          message: "Something went wrong. Please try again.",
        });
      }
    });
  }

  if (!isAuthenticated) {
    return (
      <Card className="w-full max-w-md shadow-sm" data-testid="partner-signup-auth-gate">
        <CardHeader>
          <PartnerTypeBadge label={typeLabel} />
          <CardTitle>Sign in to continue</CardTitle>
          <CardDescription>
            Create your {typeLabel.toLowerCase()} partner profile after you sign
            in. We&apos;ll bring you back here.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button
            size="lg"
            className="w-full"
            nativeButton={false}
            render={<Link href={loginHref} />}
          >
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

  if (view.kind === "success") {
    return (
      <Card className="w-full max-w-md shadow-sm" data-testid="partner-signup-success">
        <CardHeader>
          <PartnerTypeBadge label={typeLabel} />
          <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-accent/15 text-accent">
            <CheckCircle2Icon aria-hidden="true" />
          </div>
          <CardTitle>
            {view.created ? "Partner profile created" : "Partner profile ready"}
          </CardTitle>
          <CardDescription>
            Your {typeLabel.toLowerCase()} account is saved as a draft while you
            finish setup.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
          <p
            className="rounded-lg border border-dashed border-border bg-muted/40 px-3 py-2 font-mono text-xs"
            data-testid="partner-signup-partner-id"
          >
            Partner ID: {view.data.partnerId}
          </p>
          {view.dashboardDeferred ? (
            <p data-testid="partner-signup-dashboard-next">
              Dashboard coming next — we&apos;ll take you there as soon as it
              launches.
            </p>
          ) : null}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md shadow-sm" data-testid="partner-signup-wizard">
      <CardHeader>
        <PartnerTypeBadge label={typeLabel} />
        <CardTitle>Partner signup</CardTitle>
        <CardDescription>
          Step 1 of 1 — business profile. Submit to activate your partner
          account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {view.kind === "error" ? (
          <p
            className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            role="alert"
            data-testid="partner-signup-error"
          >
            {view.message}
          </p>
        ) : null}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <Label htmlFor="businessName">Business name</Label>
            <Input
              id="businessName"
              name="businessName"
              required
              value={form.businessName}
              onChange={(e) => updateField("businessName", e.target.value)}
              autoComplete="organization"
              placeholder="Roof Events Medellín"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                name="category"
                value={form.category ?? ""}
                onChange={(e) => updateField("category", e.target.value)}
                placeholder="e.g., Restaurant, Café"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="neighborhood">Neighborhood</Label>
              <Input
                id="neighborhood"
                name="neighborhood"
                value={form.neighborhood ?? ""}
                onChange={(e) => updateField("neighborhood", e.target.value)}
                placeholder="Provenza"
              />
            </div>
          </div>
          <input type="hidden" name="type" value={partnerType} readOnly />
          {draftId ? (
            <input type="hidden" name="draftId" value={draftId} readOnly />
          ) : null}
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={pending || view.kind === "loading"}
            data-testid="partner-signup-submit"
          >
            {pending || view.kind === "loading"
              ? "Activating…"
              : "Activate partner account"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
