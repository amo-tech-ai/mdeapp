"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRentalUi } from "@/components/chat/rental-ui-context";
import { submitScheduleViewing } from "@/lib/leads/submit-schedule-viewing";
import { useModalA11y } from "@/lib/use-modal-a11y";

/** SCREEN-008 — schedule viewing modal → POST /api/leads/schedule-viewing (G2). */
export function ScheduleViewingModal() {
  const { scheduleTarget, closeScheduleViewing, setLeadConfirmation } = useRentalUi();
  const panelRef = useRef<HTMLDivElement>(null);
  useModalA11y(Boolean(scheduleTarget), closeScheduleViewing, panelRef);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredAt, setPreferredAt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!scheduleTarget) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const result = await submitScheduleViewing({
        listingId: scheduleTarget.listingId,
        listingTitle: scheduleTarget.title,
        neighborhood: scheduleTarget.neighborhood,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        preferredAt: preferredAt || undefined,
      });
      setLeadConfirmation({
        leadId: result.leadId,
        message: result.message,
        listingTitle: scheduleTarget.title,
      });
      closeScheduleViewing();
      setName("");
      setEmail("");
      setPhone("");
      setPreferredAt("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submit failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
      role="presentation"
      data-testid="schedule-viewing-modal"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeScheduleViewing();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="schedule-viewing-title"
        className="w-full max-w-md rounded-xl border border-border bg-background p-4 shadow-lg"
      >
        <h2 id="schedule-viewing-title" className="text-lg font-semibold">
          Schedule a viewing
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {scheduleTarget.title} · {scheduleTarget.neighborhood}
        </p>
        <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
          <label className="block text-sm">
            <span className="font-medium">Your name</span>
            <input
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              name="name"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={submitting}
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Email</span>
            <input
              type="email"
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              name="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Phone (optional)</span>
            <input
              type="tel"
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              name="phone"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={submitting}
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Preferred time</span>
            <input
              type="datetime-local"
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              name="preferredAt"
              value={preferredAt}
              onChange={(e) => setPreferredAt(e.target.value)}
              disabled={submitting}
            />
          </label>
          {error ? (
            <p
              role="alert"
              className="text-sm text-destructive"
              data-testid="schedule-viewing-error"
            >
              {error}
            </p>
          ) : null}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={closeScheduleViewing}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" data-testid="schedule-viewing-submit" disabled={submitting}>
              {submitting ? "Submitting…" : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
