"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BROKER_ONBOARDING_NEIGHBORHOODS } from "@/lib/rentals/broker-onboarding-constants";
import type { BrokerOnboardingFormInput } from "@/lib/rentals/broker-onboarding-validate";
import { submitBrokerOnboarding } from "@/lib/rentals/submit-broker-onboarding";
import { cn } from "@/lib/utils";

type Step = 1 | 2 | 3;

const INITIAL: BrokerOnboardingFormInput = {
  displayName: "",
  whatsapp: "",
  neighborhoods: [],
  address: "",
  bedrooms: 2,
  bathrooms: 1,
  monthlyRentCop: 0,
  photoUrl: "",
  confirmedListingRights: false,
};

function StepIndicator({ step }: { step: Step }) {
  const items: { n: Step; label: string }[] = [
    { n: 1, label: "Profile" },
    { n: 2, label: "Listing" },
    { n: 3, label: "Review" },
  ];
  return (
    <ol className="mb-8 flex items-center justify-center gap-2 text-sm" aria-label="Onboarding steps">
      {items.map(({ n, label }, index) => (
        <li key={n} className="flex items-center gap-2">
          <span
            className={cn(
              "flex size-8 items-center justify-center rounded-full border text-xs font-medium",
              step >= n
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground",
            )}
            aria-current={step === n ? "step" : undefined}
          >
            {n}
          </span>
          <span className={cn(step === n ? "text-foreground" : "text-muted-foreground")}>
            {label}
          </span>
          {index < items.length - 1 ? (
            <span className="mx-1 hidden h-px w-8 bg-border sm:block" aria-hidden />
          ) : null}
        </li>
      ))}
    </ol>
  );
}

function toggleNeighborhood(current: string[], value: string): string[] {
  return current.includes(value)
    ? current.filter((n) => n !== value)
    : [...current, value];
}

export function RentalsOnboardingWizard() {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<BrokerOnboardingFormInput>(INITIAL);
  const [pending, startTransition] = useTransition();

  const canContinueStep1 =
    form.displayName.trim().length > 0 && form.neighborhoods.length > 0;
  const canContinueStep2 =
    form.address.trim().length > 0 &&
    form.monthlyRentCop > 0 &&
    Number.isFinite(form.bedrooms) &&
    Number.isFinite(form.bathrooms);

  function patch<K extends keyof BrokerOnboardingFormInput>(
    key: K,
    value: BrokerOnboardingFormInput[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit() {
    startTransition(async () => {
      const result = await submitBrokerOnboarding(form);
      if (!result.ok) {
        toast.error(result.message);
      }
    });
  }

  return (
    <div data-testid="rentals-onboarding" className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="font-serif text-2xl font-semibold">Set up your broker profile</h1>
        <p className="text-sm text-muted-foreground">
          Three quick steps — then your first listing draft is ready in Listings.
        </p>
      </div>

      <StepIndicator step={step} />

      {step === 1 ? (
        <section
          data-testid="ro-step-profile"
          className="space-y-4 rounded-xl border border-border bg-card p-6"
        >
          <div className="space-y-2">
            <Label htmlFor="ro-display-name">Display / company name</Label>
            <Input
              id="ro-display-name"
              value={form.displayName}
              onChange={(e) => patch("displayName", e.target.value)}
              placeholder="Ana Properties"
              autoComplete="organization"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ro-whatsapp">WhatsApp (optional)</Label>
            <Input
              id="ro-whatsapp"
              value={form.whatsapp}
              onChange={(e) => patch("whatsapp", e.target.value)}
              placeholder="+57 300 123 4567"
              autoComplete="tel"
            />
          </div>
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium">Neighborhoods served</legend>
            <div className="flex flex-wrap gap-2">
              {BROKER_ONBOARDING_NEIGHBORHOODS.map((name) => {
                const selected = form.neighborhoods.includes(name);
                return (
                  <Button
                    key={name}
                    type="button"
                    size="sm"
                    variant={selected ? "default" : "outline"}
                    onClick={() => patch("neighborhoods", toggleNeighborhood(form.neighborhoods, name))}
                  >
                    {name}
                  </Button>
                );
              })}
            </div>
          </fieldset>
          <div className="flex justify-end">
            <Button
              type="button"
              disabled={!canContinueStep1}
              onClick={() => setStep(2)}
            >
              Continue →
            </Button>
          </div>
        </section>
      ) : null}

      {step === 2 ? (
        <section
          data-testid="ro-step-listing"
          className="space-y-4 rounded-xl border border-border bg-card p-6"
        >
          <div className="space-y-2">
            <Label htmlFor="ro-address">Street address</Label>
            <Input
              id="ro-address"
              value={form.address}
              onChange={(e) => patch("address", e.target.value)}
              placeholder="Calle 10 #42-15"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ro-bedrooms">Bedrooms</Label>
              <Input
                id="ro-bedrooms"
                type="number"
                min={0}
                value={form.bedrooms}
                onChange={(e) => patch("bedrooms", Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ro-bathrooms">Bathrooms</Label>
              <Input
                id="ro-bathrooms"
                type="number"
                min={0}
                step={0.5}
                value={form.bathrooms}
                onChange={(e) => patch("bathrooms", Number(e.target.value))}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ro-rent">Monthly rent (COP)</Label>
            <Input
              id="ro-rent"
              type="number"
              min={1}
              value={form.monthlyRentCop || ""}
              onChange={(e) => patch("monthlyRentCop", Number(e.target.value))}
              placeholder="2400000"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ro-photo">Photo URL (optional)</Label>
            <Input
              id="ro-photo"
              value={form.photoUrl}
              onChange={(e) => patch("photoUrl", e.target.value)}
              placeholder="https://… (storage upload follow-up)"
            />
            <p className="text-xs text-muted-foreground">
              Paste an image URL for Class U proof — Supabase Storage upload ships later.
            </p>
          </div>
          <div className="flex justify-between gap-2">
            <Button type="button" variant="outline" onClick={() => setStep(1)}>
              ← Back
            </Button>
            <Button type="button" disabled={!canContinueStep2} onClick={() => setStep(3)}>
              Continue →
            </Button>
          </div>
        </section>
      ) : null}

      {step === 3 ? (
        <section
          data-testid="ro-step-review"
          className="space-y-4 rounded-xl border border-border bg-card p-6"
        >
          <div className="space-y-2 rounded-lg bg-muted/40 p-4 text-sm">
            <p>
              <span className="font-medium">Profile:</span> {form.displayName}
              {form.whatsapp ? ` · ${form.whatsapp}` : ""}
            </p>
            <p>
              <span className="font-medium">Neighborhoods:</span> {form.neighborhoods.join(", ")}
            </p>
            <p>
              <span className="font-medium">Listing:</span> {form.address} · {form.bedrooms}BR ·{" "}
              {form.bathrooms}BA · COP {form.monthlyRentCop.toLocaleString("en-US")}
            </p>
            {form.photoUrl ? (
              <p>
                <span className="font-medium">Photo:</span> {form.photoUrl}
              </p>
            ) : null}
          </div>
          <label className="flex cursor-pointer items-start gap-3 text-sm">
            <input
              data-testid="ro-ack"
              type="checkbox"
              className="mt-1 size-4 rounded border-border"
              checked={form.confirmedListingRights}
              onChange={(e) => patch("confirmedListingRights", e.target.checked)}
            />
            <span>I confirm I can list this property</span>
          </label>
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
            <Button type="button" variant="outline" onClick={() => setStep(2)}>
              ← Back
            </Button>
            <Button
              data-testid="ro-submit"
              type="button"
              disabled={!form.confirmedListingRights || pending}
              onClick={handleSubmit}
            >
              {pending ? "Saving…" : "Save draft & go to listings"}
            </Button>
          </div>
        </section>
      ) : null}
    </div>
  );
}
