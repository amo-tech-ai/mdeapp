"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { EventProposalShellTarget } from "@/components/chat/rental-ui-context";
import {
  emptyEventProposalForm,
  validateEventProposal,
  type EventProposalFormState,
} from "@/components/sheets/event-proposal-shell-core";

type SubmitStatus = "idle" | "submitting" | "success" | "error";

type FieldChange = (
  key: keyof EventProposalFormState,
) => (
  event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
) => void;

/**
 * Presentational proposal form — no Dialog context, so it renders standalone
 * and is testable. The dialog chrome (title/description) lives in the shell.
 */
export function EventProposalForm({
  form,
  status,
  message,
  onField,
  onSubmit,
  onCancel,
}: {
  form: EventProposalFormState;
  status: SubmitStatus;
  message: string | null;
  onField: FieldChange;
  onSubmit: (event: React.FormEvent) => void;
  onCancel: () => void;
}) {
  return (
    <form onSubmit={onSubmit} data-testid="event-proposal-hitl-panel">
      <div className="flex flex-col gap-3 py-4 text-sm">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="ep-event-type">Event type</Label>
          <Input
            id="ep-event-type"
            value={form.eventType}
            onChange={onField("eventType")}
            placeholder="Birthday, corporate dinner…"
          />
        </div>
        <div className="flex gap-3">
          <div className="flex flex-1 flex-col gap-1.5">
            <Label htmlFor="ep-start-date">Date</Label>
            <Input
              id="ep-start-date"
              type="date"
              value={form.startDate}
              onChange={onField("startDate")}
            />
          </div>
          <div className="flex flex-1 flex-col gap-1.5">
            <Label htmlFor="ep-party-size">Guests</Label>
            <Input
              id="ep-party-size"
              type="number"
              min={20}
              max={500}
              value={form.partySize}
              onChange={onField("partySize")}
              placeholder="20+"
            />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="ep-name">Your name</Label>
          <Input
            id="ep-name"
            value={form.contactName}
            onChange={onField("contactName")}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="ep-email">Email</Label>
          <Input
            id="ep-email"
            type="email"
            value={form.contactEmail}
            onChange={onField("contactEmail")}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="ep-phone">Phone (optional)</Label>
          <Input
            id="ep-phone"
            value={form.contactPhone}
            onChange={onField("contactPhone")}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="ep-notes">Notes (optional)</Label>
          <Textarea
            id="ep-notes"
            value={form.notes}
            onChange={onField("notes")}
            rows={2}
          />
        </div>

        {status === "error" && message ? (
          <p
            role="alert"
            className="text-sm text-destructive"
            data-testid="event-proposal-error"
          >
            {message}
          </p>
        ) : null}
        <p className="text-xs text-muted-foreground">
          Proposal pending — not confirmed until venue approval.
        </p>
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          data-testid="event-proposal-cancel-btn"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={status === "submitting"}
          data-testid="event-proposal-submit-btn"
        >
          {status === "submitting" ? "Sending…" : "Submit proposal"}
        </Button>
      </div>
    </form>
  );
}

/**
 * SAN-496 · EVT-037 — Request proposal modal (HITL).
 * Collects event details and POSTs to /api/events/proposal (the Part 1 route),
 * which persists the proposal as a pending booking for venue approval.
 */
export function EventProposalShell({
  target,
  open,
  onOpenChange,
}: {
  target: EventProposalShellTarget | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [form, setForm] = useState<EventProposalFormState>(
    emptyEventProposalForm,
  );
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [message, setMessage] = useState<string | null>(null);

  const onField: FieldChange = (key) => (event) =>
    setForm((prev) => ({ ...prev, [key]: event.target.value }));

  function handleOpenChange(next: boolean) {
    if (!next) {
      setForm(emptyEventProposalForm);
      setStatus("idle");
      setMessage(null);
    }
    onOpenChange(next);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!target || status === "submitting") return;

    const validated = validateEventProposal(form, target);
    if (!validated.ok) {
      setStatus("error");
      setMessage(validated.message);
      return;
    }

    setStatus("submitting");
    setMessage(null);
    try {
      const res = await fetch("/api/events/proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated.body),
      });
      const json = (await res.json()) as {
        success?: boolean;
        message?: string;
        error?: { message?: string };
      };
      if (!res.ok || !json.success) {
        setStatus("error");
        setMessage(json.error?.message ?? "Could not send your proposal.");
        return;
      }
      setStatus("success");
      setMessage(json.message ?? "Proposal sent — pending venue approval.");
    } catch {
      setStatus("error");
      setMessage("Network error — please try again.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md" data-testid="event-proposal-shell">
        {target ? (
          status === "success" ? (
            <div data-testid="event-proposal-success">
              <DialogHeader>
                <DialogTitle>Proposal sent</DialogTitle>
                <DialogDescription>{target.venueTitle}</DialogDescription>
              </DialogHeader>
              <p className="py-4 text-sm text-muted-foreground">{message}</p>
              <DialogFooter>
                <Button type="button" onClick={() => handleOpenChange(false)}>
                  Done
                </Button>
              </DialogFooter>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Request event proposal</DialogTitle>
                <DialogDescription>
                  Venue: {target.venueTitle}
                </DialogDescription>
              </DialogHeader>
              <EventProposalForm
                form={form}
                status={status}
                message={message}
                onField={onField}
                onSubmit={handleSubmit}
                onCancel={() => handleOpenChange(false)}
              />
            </>
          )
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
