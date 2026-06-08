"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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

export function PartnerSignupWizard({
  partnerType,
  draftId,
  isAuthenticated,
  loginNextPath,
}: PartnerSignupWizardProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [view, setView] = useState<ViewState>({ kind: "form" });
  const [form, setForm] = useState<PartnerSignupFormState>({
    businessName: "",
    category: "",
    neighborhood: "",
  });

  const typeLabel = PARTNER_TYPE_LABELS[partnerType];

  function updateField<K extends keyof PartnerSignupFormState>(
    key: K,
    value: PartnerSignupFormState[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isAuthenticated) return;

    setView({ kind: "loading" });
    startTransition(async () => {
      const payload = buildActivatePayload(partnerType, form, draftId);
      const result = await activatePartnerRequest(payload);

      if (!result.ok) {
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
    });
  }

  if (!isAuthenticated) {
    return (
      <Card className="w-full max-w-lg" data-testid="partner-signup-auth-gate">
        <CardHeader>
          <CardTitle>Sign in to continue</CardTitle>
          <CardDescription>
            Create your {typeLabel.toLowerCase()} partner profile after you sign
            in.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Link
            href={`/login?next=${encodeURIComponent(loginNextPath)}`}
            className={cn(buttonVariants(), "inline-flex")}
          >
            Sign in
          </Link>
        </CardFooter>
      </Card>
    );
  }

  if (view.kind === "success") {
    return (
      <Card className="w-full max-w-lg" data-testid="partner-signup-success">
        <CardHeader>
          <CardTitle>
            {view.created ? "Partner profile created" : "Partner profile ready"}
          </CardTitle>
          <CardDescription>
            Your {typeLabel.toLowerCase()} account is saved as a draft while you
            finish setup.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
          <p data-testid="partner-signup-partner-id">
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
    <Card className="w-full max-w-lg" data-testid="partner-signup-wizard">
      <CardHeader>
        <CardTitle>Partner signup</CardTitle>
        <CardDescription>
          Step 1 — business profile for {typeLabel}. Submit to activate your
          partner account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {view.kind === "error" ? (
          <p
            className="mb-4 text-sm text-destructive"
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
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              name="category"
              value={form.category ?? ""}
              onChange={(e) => updateField("category", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="neighborhood">Neighborhood</Label>
            <Input
              id="neighborhood"
              name="neighborhood"
              value={form.neighborhood ?? ""}
              onChange={(e) => updateField("neighborhood", e.target.value)}
            />
          </div>
          <input type="hidden" name="type" value={partnerType} readOnly />
          {draftId ? (
            <input type="hidden" name="draftId" value={draftId} readOnly />
          ) : null}
          <Button
            type="submit"
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
